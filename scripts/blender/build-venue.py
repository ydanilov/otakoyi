"""
Build the 3D venue used by the home-page tour (exhibition stand → office lobby → music stage → museum room).

Reproducible: run with Blender's Python module (pip install bpy) — no Blender UI needed.

    python scripts/blender/build-venue.py [--quick]
    npx @gltf-transform/cli meshopt public/models/venue.glb public/models/venue.glb
    npx @gltf-transform/cli meshopt public/models/people.glb public/models/people.glb

Outputs (public/models/):
  venue.glb          geometry: baked "Venue" + "Floor" meshes, live "Screen_*" planes (UVs 0..1)
  people.glb         standing visitors (one mesh, with normals) — see people.py
  venue-bake.jpg     Cycles-baked lighting + albedo for the Venue mesh (UV0)
  floor-bake.jpg     Cycles-baked lighting for the Floor mesh (UV0)

Coordinates below are written in three.js space (x right, y up, z towards camera) and converted
to Blender (z up). Zone origins match the camera path in src/components/works/venue-scene-canvas.tsx:
music x=0, lobby x=16, stand x=32, museum x=-16.

Screens are not baked: the site replaces their material with the live generative shaders. They still
emit light here, so their glow is baked onto the floor and walls around them.
"""

import math
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import people  # noqa: E402  (after bpy: it uses it)

QUICK = "--quick" in sys.argv
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "models")
os.makedirs(OUT, exist_ok=True)

VENUE_RES = 1024 if QUICK else 2048
FLOOR_RES = 512 if QUICK else 1024
SAMPLES = 16 if QUICK else 96


def B(x, y, z):
    """three.js (y-up) → Blender (z-up)."""
    return (x, -z, y)


# --------------------------------------------------------------------------- scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = False
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.02, 0.022, 0.03, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.6


def hex_rgb(h):
    h = h.lstrip("#")
    srgb = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, 1.0)


def material(name, color, rough=0.5, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = hex_rgb(color)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    if emit:
        p.inputs["Emission Color"].default_value = hex_rgb(emit)
        p.inputs["Emission Strength"].default_value = strength
    return m


M = {
    "floor": material("floor", "#17171a", 0.32, 0.1),
    "dark": material("dark", "#202024", 0.6),
    "panel": material("panel", "#2c2c31", 0.5),
    "concrete": material("concrete", "#45454a", 0.85),
    "white": material("white", "#d6d6d3", 0.45),
    "metal": material("metal", "#8a8a90", 0.3, 0.9),
    "wood": material("wood", "#7a5537", 0.55),
    "seat": material("seat", "#2a2f45", 0.7),
    "leaf": material("leaf", "#2f4d2b", 0.7),
    "pot": material("pot", "#3a3a3d", 0.4),
    "strip": material("strip", "#c1f354", 0.4, emit="#c1f354", strength=10),
    "bezel": material("bezel", "#0c0c0e", 0.3),
}

# Screens emit an average of the palette their live work uses, so the bake carries their glow.
SCREENS = {
    "Screen_Stage": ("#4252e0", 6.0),
    "Screen_MusicSideL": ("#7a3fd8", 4.0),
    "Screen_MusicSideR": ("#7a3fd8", 4.0),
    "Screen_MuseumBack": ("#3f5ae0", 3.0),
    "Screen_MuseumLeft": ("#2f7a6a", 2.5),
    "Screen_MuseumRight": ("#6a3fb8", 2.5),
    "Screen_MuseumFloor": ("#2c5a8a", 1.5),
    "Screen_Lobby": ("#3b6ee0", 4.0),
    "Screen_StandFloor": ("#3b8a62", 2.0),
    "Screen_StandWall": ("#4a5ee8", 4.0),
}

baked = []  # objects joined into the Venue bake mesh


def add(obj, mat, bake=True):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    if bake:
        baked.append(obj)
    return obj


def box(size, pos, mat, bevel=0.015, rot_y=0.0, bake=True):
    """size/pos in three.js space; rot_y rotates around three's y (Blender z)."""
    w, h, d = size
    bpy.ops.mesh.primitive_cube_add(size=1, location=B(*pos))
    o = bpy.context.object
    o.scale = (w, d, h)
    o.rotation_euler[2] = -rot_y
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if bevel > 0:
        mod = o.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        mod.limit_method = "ANGLE"
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return add(o, mat, bake)


def cyl(r, h, pos, mat, axis="y", verts=20, bake=True):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=verts, location=B(*pos))
    o = bpy.context.object
    if axis == "x":
        o.rotation_euler[1] = math.pi / 2
    elif axis == "z":
        o.rotation_euler[0] = math.pi / 2
    bpy.ops.object.transform_apply(rotation=True)
    return add(o, mat, bake)


def sphere(r, pos, mat, bake=True):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=r, subdivisions=2, location=B(*pos))
    return add(bpy.context.object, mat, bake)


def screen(name, w, h, pos, facing="z"):
    """A live screen plane with clean 0..1 UVs. facing 'z' = wall facing camera, 'y' = floor."""
    bpy.ops.mesh.primitive_plane_add(size=1, location=B(*pos))
    o = bpy.context.object
    o.name = name
    o.data.name = name
    o.scale = (w, h, 1)
    if facing == "z":
        o.rotation_euler[0] = math.pi / 2
    bpy.ops.object.transform_apply(rotation=True, scale=True)
    color, strength = SCREENS[name]
    add(o, material(name, "#000000", 0.3, emit=color, strength=strength), bake=False)
    return o


def truss(x, z, height, y0=0.0):
    """Square box truss tower: 4 chords + horizontal rungs."""
    s = 0.15
    for dx in (-s, s):
        for dz in (-s, s):
            cyl(0.024, height, (x + dx, y0 + height / 2, z + dz), M["metal"], verts=10)
    y = y0 + 0.25
    while y < y0 + height:
        cyl(0.012, 2 * s, (x, y, z - s), M["metal"], axis="x", verts=6)
        cyl(0.012, 2 * s, (x, y, z + s), M["metal"], axis="x", verts=6)
        cyl(0.012, 2 * s, (x - s, y, z), M["metal"], axis="z", verts=6)
        cyl(0.012, 2 * s, (x + s, y, z), M["metal"], axis="z", verts=6)
        y += 0.5


def truss_beam(x0, x1, y, z):
    s = 0.15
    length = x1 - x0
    for dy in (-s, s):
        for dz in (-s, s):
            cyl(0.024, length, ((x0 + x1) / 2, y + dy, z + dz), M["metal"], axis="x", verts=10)
    x = x0 + 0.25
    while x < x1:
        cyl(0.012, 2 * s, (x, y, z - s), M["metal"], verts=6)
        cyl(0.012, 2 * s, (x, y, z + s), M["metal"], verts=6)
        x += 0.5


# --------------------------------------------------------------------------- 3. music events (x = 0)
# Concert stage: deep stage, LED backdrop and side columns, truss with lights, speaker stacks,
# crowd barrier. The camera reaches it third (exhibition → lobby → music → museum).
box((13, 1.0, 5), (0, 0.5, -1.1), M["dark"], bevel=0.03)
box((13, 0.05, 0.03), (0, 0.2, 1.41), M["strip"], bevel=0)
box((11.8, 4.2, 0.2), (0, 3.2, -3.46), M["bezel"], bevel=0.02)
screen("Screen_Stage", 11.4, 3.9, (0, 3.2, -3.35))
for side, name in ((-1, "Screen_MusicSideL"), (1, "Screen_MusicSideR")):
    x = side * 7.2
    box((1.7, 5.4, 0.2), (x, 2.7, -1.6), M["bezel"], bevel=0.02)
    screen(name, 1.5, 5.2, (x, 2.7, -1.49))
    for y in (0.5, 1.45, 2.35):  # speaker stack
        box((1.2, 0.9, 1.0), (side * 8.6, y, 0.2), M["dark"], bevel=0.03)
truss(-6.6, -3.2, 6.4)
truss(6.6, -3.2, 6.4)
truss_beam(-6.6, 6.6, 6.4, -3.2)
truss_beam(-6.6, 6.6, 6.4, 0.6)
for x in (-5, -2.5, 0, 2.5, 5):  # moving heads on the front truss
    cyl(0.16, 0.32, (x, 6.05, 0.6), M["dark"], verts=16)
    cyl(0.11, 0.02, (x, 5.88, 0.6), M["strip"], verts=16)
box((12, 1.1, 0.12), (0, 0.55, 3.0), M["metal"], bevel=0.01)  # crowd barrier
# Mixing desk (FOH) far back
box((2.2, 1.0, 1.0), (0, 0.5, 11.5), M["dark"], bevel=0.03)

# --------------------------------------------------------------------------- 4. museum / interactive park (x = -16)
# Immersive room: back + side walls and the floor are all projection surfaces.
MX = -16
box((10.4, 4.6, 0.25), (MX, 2.3, -3.3), M["dark"], bevel=0)
screen("Screen_MuseumBack", 10, 4.2, (MX, 2.3, -3.15))
for side, name in ((-1, "Screen_MuseumLeft"), (1, "Screen_MuseumRight")):
    box((0.25, 4.6, 7.4), (MX + side * 5.2, 2.3, 0.4), M["dark"], bevel=0)
    bpy.ops.mesh.primitive_plane_add(size=1, location=B(MX + side * 5.05, 2.3, 0.4))
    o = bpy.context.object
    o.name = o.data.name = name
    o.scale = (7.0, 4.2, 1)
    o.rotation_euler = (math.pi / 2, 0, -side * math.pi / 2)
    bpy.ops.object.transform_apply(rotation=True, scale=True)
    color, strength = SCREENS[name]
    add(o, material(name, "#000000", 0.3, emit=color, strength=strength), bake=False)
screen("Screen_MuseumFloor", 10, 7, (MX, 0.01, 0.4), facing="y")
box((10.6, 0.4, 7.6), (MX, 4.8, 0.4), M["dark"], bevel=0)  # ceiling lip hides projectors
for x in (MX - 3, MX, MX + 3):
    box((0.35, 0.25, 0.5), (x, 4.48, 2.6), M["panel"], bevel=0.02)  # projectors
box((2.4, 0.42, 0.6), (MX, 0.21, 2.2), M["wood"], bevel=0.02)  # bench

# --------------------------------------------------------------------------- 2. office lobby
LX = 16
box((15, 7, 0.3), (LX, 3.5, -2.45), M["concrete"], bevel=0)
box((4.5, 6.3, 0.12), (LX, 3.1, -2.26), M["bezel"], bevel=0.02)
screen("Screen_Lobby", 4.2, 6.0, (LX, 3.1, -2.19))
for side in (-1, 1):
    x = LX + side * 2.9
    while abs(x - LX) < 6.6:
        box((0.07, 5.6, 0.12), (x, 3.2, -2.24), M["wood"], bevel=0)
        x += side * 0.16
for x in (LX - 5.2, LX + 5.2):
    cyl(0.36, 7, (x, 3.5, -1.5), M["concrete"], verts=32)
# Reception desk with an LED kick strip
box((3.2, 1.05, 0.95), (LX - 3.3, 0.53, 1.0), M["white"], bevel=0.04)
box((3.4, 0.06, 1.05), (LX - 3.3, 1.08, 1.0), M["wood"], bevel=0.01)
box((3.1, 0.04, 0.02), (LX - 3.3, 0.06, 1.49), M["strip"], bevel=0)
# Bench + planters
box((2.4, 0.08, 0.6), (LX + 3.4, 0.46, 1.4), M["wood"], bevel=0.015)
for bx in (LX + 2.4, LX + 4.4):
    box((0.08, 0.42, 0.5), (bx, 0.21, 1.4), M["metal"], bevel=0)
for (px, pz) in ((LX + 6.2, 0.2), (LX - 6.4, -0.6)):
    cyl(0.34, 0.62, (px, 0.31, pz), M["pot"], verts=24)
    sphere(0.55, (px, 1.05, pz), M["leaf"])
    sphere(0.38, (px + 0.25, 1.45, pz - 0.1), M["leaf"])

# --------------------------------------------------------------------------- 3. exhibition stand
SX = 32
box((8, 0.12, 7), (SX, 0.06, 0.3), M["white"], bevel=0.01)
box((8, 0.03, 0.02), (SX, 0.03, 3.81), M["strip"], bevel=0)
screen("Screen_StandFloor", 6.5, 6.5, (SX, 0.125, 0.5), facing="y")
box((8, 3.4, 0.3), (SX, 1.82, -3.05), M["white"], bevel=0.02)
box((8.4, 0.6, 0.5), (SX, 3.82, -2.9), M["dark"], bevel=0.02)
box((2.4, 0.08, 0.02), (SX - 2.2, 3.82, -2.64), M["strip"], bevel=0)
box((2.8, 1.7, 0.08), (SX + 1.6, 2.0, -2.86), M["bezel"], bevel=0.01)
screen("Screen_StandWall", 2.6, 1.5, (SX + 1.6, 2.0, -2.81))
box((0.2, 3.4, 4.2), (SX - 3.9, 1.82, -1.1), M["white"], bevel=0.02)
box((1.7, 1.0, 0.65), (SX - 2.3, 0.62, -1.6), M["white"], bevel=0.03)
box((1.8, 0.05, 0.75), (SX - 2.3, 1.14, -1.6), M["wood"], bevel=0.01)
box((0.55, 1.6, 0.45), (SX + 3.3, 0.92, 1.9), M["dark"], bevel=0.02)
truss(SX + 3.6, -2.6, 4.4, y0=0.12)
for (px, pz, ph) in ((SX - 1.6, 2.1, 0.9), (SX - 0.9, 2.6, 0.7)):
    box((0.5, ph, 0.5), (px, 0.12 + ph / 2, pz), M["white"], bevel=0.02)

# --------------------------------------------------------------------------- visitors
# Standing, not walking: placed where people would naturally stop and look.
# body = (gender, age, muscle, weight, height); face = degrees, 0 faces the camera (+z).
STAGE_SCREEN = (0, 3.2, -3.35)
LOBBY_SCREEN = (16, 3.4, -2.2)
STAND_FLOOR = (32, 0.1, 0.5)
STAND_WALL = (33.6, 2.0, -2.8)
MUSEUM_BACK = (-16, 2.6, -3.1)
MUSEUM_FLOOR = (-16, 0.0, 0.4)
VISITORS = [
    # Exhibition stand
    dict(pos=(30.6, 0.12, 0.3), face=140, look=STAND_FLOOR, look_weight=0.8, body=(0.1, 0.5, 0.5, 0.5, 0.52), pose=("Xbot", "idle", 15)),
    dict(pos=(32.3, 0.12, 1.6), face=200, look=STAND_FLOOR, look_weight=0.8, body=(1.0, 0.5, 0.6, 0.5, 0.6), pose=("Xbot", "sad_pose", 0)),
    dict(pos=(33.8, 0.12, -0.3), face=160, look=STAND_WALL, body=(0.0, 0.55, 0.45, 0.45, 0.55), pose=("Michelle", "SambaDance", 417)),
    dict(pos=(31.9, 0.12, 3.1), face=190, look=STAND_WALL, body=(0.85, 0.4, 0.55, 0.5, 0.62), pose=("Xbot", "agree", 20)),
    dict(pos=(34.4, 0.12, 2.0), face=225, look=STAND_FLOOR, look_weight=0.7, body=(0.2, 0.6, 0.5, 0.55, 0.5), pose=("Soldier", "Idle", 24)),
    # Office lobby
    dict(pos=(15.1, 0, 0.6), face=170, look=LOBBY_SCREEN, body=(1.0, 0.6, 0.5, 0.55, 0.58), pose=("Xbot", "idle", 30)),
    dict(pos=(16.9, 0, 1.3), face=200, look=LOBBY_SCREEN, body=(0.0, 0.45, 0.5, 0.5, 0.5), pose=("Michelle", "SambaDance", 408)),
    # Music: a crowd at the barrier, two hands in the air
    dict(pos=(-2.6, 0, 4.0), face=176, look=STAGE_SCREEN, body=(1.0, 0.45, 0.6, 0.5, 0.62), pose=("Xbot", "idle", 0), raise_arm="right"),
    dict(pos=(-1.2, 0, 4.4), face=184, look=STAGE_SCREEN, body=(0.0, 0.4, 0.5, 0.45, 0.52), pose=("Michelle", "SambaDance", 417)),
    dict(pos=(0.4, 0, 3.9), face=180, look=STAGE_SCREEN, body=(0.9, 0.5, 0.55, 0.5, 0.6), pose=("Xbot", "sad_pose", 0)),
    dict(pos=(1.9, 0, 4.5), face=170, look=STAGE_SCREEN, body=(0.1, 0.45, 0.5, 0.5, 0.5), pose=("Xbot", "idle", 30), raise_arm="left"),
    dict(pos=(3.3, 0, 4.1), face=190, look=STAGE_SCREEN, body=(1.0, 0.55, 0.5, 0.55, 0.58), pose=("Soldier", "Idle", 24)),
    dict(pos=(-0.4, 0, 5.8), face=178, look=STAGE_SCREEN, body=(0.7, 0.5, 0.5, 0.5, 0.56), pose=("Xbot", "agree", 20)),
    # Museum / interactive park
    dict(pos=(-17.6, 0, 0.9), face=160, look=MUSEUM_BACK, body=(0.0, 0.5, 0.5, 0.45, 0.52), pose=("Michelle", "SambaDance", 408)),
    dict(pos=(-15.2, 0, 0.1), face=200, look=MUSEUM_FLOOR, look_weight=0.8, body=(1.0, 0.6, 0.5, 0.55, 0.6), pose=("Xbot", "sad_pose", 0)),
    dict(pos=(-14.0, 0, 1.9), face=230, look=(-21, 2.4, 0.4), body=(0.2, 0.4, 0.5, 0.5, 0.48), pose=("Xbot", "idle", 15)),
    dict(pos=(-16.6, 0, 2.6), face=185, look=MUSEUM_BACK, body=(0.9, 0.45, 0.55, 0.5, 0.6), pose=("Xbot", "idle", 45)),
]
crowd, feet = people.build(VISITORS)
crowd.data.materials.clear()
crowd.data.materials.append(material("person", "#050506", 0.12, 0.0))
with open(os.path.join(ROOT, "src", "components", "works", "venue-people.json"), "w") as fh:
    import json

    json.dump({"feet": [[p[0], p[2]] for p in feet]}, fh)

# --------------------------------------------------------------------------- floor (own bake)
bpy.ops.mesh.primitive_plane_add(size=1, location=B(9, 0, 2))
floor = bpy.context.object
floor.name = "Floor"
floor.data.name = "Floor"
floor.scale = (100, 50, 1)
bpy.ops.object.transform_apply(scale=True)
floor.data.materials.append(M["floor"])

# --------------------------------------------------------------------------- lights
def area(pos, size, power, color="#fff4e6"):
    d = bpy.data.lights.new("area", "AREA")
    d.size = size
    d.energy = power
    d.color = hex_rgb(color)[:3]
    o = bpy.data.objects.new("area", d)
    o.location = B(*pos)
    scene.collection.objects.link(o)


area((0, 8, 1), 7, 1100, "#c9b8ff")
area((MX, 6, 1.5), 5, 250)
area((LX, 8, 1.5), 5, 700)
area((SX, 6.5, 1), 5, 650)
area((9, 9, 12), 24, 700, "#9fb4ff")

# --------------------------------------------------------------------------- join + unwrap
bpy.ops.object.select_all(action="DESELECT")
for o in baked:
    o.select_set(True)
bpy.context.view_layer.objects.active = baked[0]
bpy.ops.object.join()
venue = bpy.context.object
venue.name = "Venue"
venue.data.name = "Venue"


def lightmap_uv(obj, margin):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    for uv in list(obj.data.uv_layers):
        obj.data.uv_layers.remove(uv)
    obj.data.uv_layers.new(name="UVMap")
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=margin, area_weight=1.0)
    bpy.ops.object.mode_set(mode="OBJECT")


lightmap_uv(venue, 0.003)
# Floor is a single quad: keep its default 0..1 UVs.


# --------------------------------------------------------------------------- bake
def bake(obj, res, path):
    img = bpy.data.images.new(obj.name + "_bake", res, res, float_buffer=True)
    for mat in obj.data.materials:
        n = mat.node_tree.nodes.new("ShaderNodeTexImage")
        n.image = img
        mat.node_tree.nodes.active = n
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    scene.render.bake.margin = 6
    bpy.ops.object.bake(type="COMBINED", pass_filter={"DIRECT", "INDIRECT", "DIFFUSE", "GLOSSY", "EMIT"})
    scene.render.image_settings.file_format = "JPEG"
    scene.render.image_settings.quality = 88
    scene.view_settings.view_transform = "AgX"
    img.save_render(path, scene=scene)
    for mat in obj.data.materials:
        node = mat.node_tree.nodes.active
        mat.node_tree.nodes.remove(node)
    print("baked", path)


bake(venue, VENUE_RES, os.path.join(OUT, "venue-bake.jpg"))
bake(floor, FLOOR_RES, os.path.join(OUT, "floor-bake.jpg"))

# --------------------------------------------------------------------------- export
def export(path, objs, normals):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_materials="NONE",
        export_texcoords=not normals,
        export_normals=normals,
        export_yup=True,
        export_apply=True,
    )
    print("exported", path)


export(os.path.join(OUT, "venue.glb"), [o for o in bpy.data.objects if o.type == "MESH" and o.name != "People"], False)
export(os.path.join(OUT, "people.glb"), [crowd], True)
