"""
Build the 3D venue used by the home-page tour (conference stage → office lobby → exhibition stand).

Reproducible: run with Blender's Python module (pip install bpy) — no Blender UI needed.

    python scripts/blender/build-venue.py [--quick]
    npx @gltf-transform/cli meshopt public/models/venue.glb public/models/venue.glb   # ~465 KB → ~135 KB

Outputs (public/models/):
  venue.glb          geometry: baked "Venue" + "Floor" meshes, live "Screen_*" planes (UVs 0..1)
  venue-bake.jpg     Cycles-baked lighting + albedo for the Venue mesh (UV0)
  floor-bake.jpg     Cycles-baked lighting for the Floor mesh (UV0)

Coordinates below are written in three.js space (x right, y up, z towards camera) and converted
to Blender (z up). Zone origins match the camera path in src/components/works/venue-scene-canvas.tsx:
conference x=0, lobby x=16, stand x=32.

Screens are not baked: the site replaces their material with the live generative shaders. They still
emit light here, so their glow is baked onto the floor and walls around them.
"""

import math
import os
import sys

import bpy

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
    "Screen_Stage": ("#4252e0", 5.0),
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


# --------------------------------------------------------------------------- 1. conference
box((12, 0.6, 3.6), (0, 0.3, -0.6), M["dark"], bevel=0.03)
box((12, 0.05, 0.03), (0, 0.12, 1.21), M["strip"], bevel=0)
for sx in (-5.2, 5.2):
    box((1.2, 0.2, 0.5), (sx, 0.1, 1.45), M["panel"])
    box((1.2, 0.4, 0.5), (sx, 0.2, 1.0), M["panel"])
box((11.5, 4.0, 0.2), (0, 2.6, -2.06), M["bezel"], bevel=0.02)
screen("Screen_Stage", 11.0, 3.6, (0, 2.6, -1.95))
truss(-6.2, -2.0, 5.2)
truss(6.2, -2.0, 5.2)
truss_beam(-6.2, 6.2, 5.2, -2.0)
# Lectern
box((0.6, 1.05, 0.45), (3.9, 1.125, -0.2), M["panel"], bevel=0.02)
box((0.7, 0.04, 0.55), (3.9, 1.67, -0.2), M["wood"], bevel=0.01)
# Audience: 8 rows × 14 seats with an aisle
for r in range(8):
    for c in range(14):
        x = (c - 6.5) * 0.7 + (0.5 if c >= 7 else -0.5)
        z = 2.6 + r * 0.95
        box((0.48, 0.08, 0.46), (x, 0.46, z), M["seat"], bevel=0)
        box((0.48, 0.5, 0.07), (x, 0.73, z + 0.22), M["seat"], bevel=0)
        cyl(0.03, 0.42, (x, 0.21, z), M["metal"], verts=6)

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

# --------------------------------------------------------------------------- floor (own bake)
bpy.ops.mesh.primitive_plane_add(size=1, location=B(16, 0, 2))
floor = bpy.context.object
floor.name = "Floor"
floor.data.name = "Floor"
floor.scale = (90, 50, 1)
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


area((0, 7, 3), 6, 900)
area((LX, 8, 1.5), 5, 700)
area((SX, 6.5, 1), 5, 650)
area((16, 9, 12), 20, 600, "#9fb4ff")

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
bpy.ops.object.select_all(action="DESELECT")
for o in bpy.data.objects:
    if o.type == "MESH":
        o.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=os.path.join(OUT, "venue.glb"),
    export_format="GLB",
    use_selection=True,
    export_materials="NONE",
    export_texcoords=True,
    export_normals=False,
    export_yup=True,
    export_apply=True,
)
print("exported", os.path.join(OUT, "venue.glb"))
