"""
Photoreal standing visitors for the venue, rendered on the site as glossy, oil-black sculptures.

Bodies: MakeHuman base mesh + macro targets via MPFB 2 (assets CC0 — https://github.com/makehumancommunity/mpfb2).
MPFB is GPL code and is used here only as a build tool; nothing from it ships except the CC0 mesh.
Poses: sampled from rigged characters in the three.js examples (Mixamo rig; mrdoob/three.js
examples/models/gltf) and retargeted bone-by-bone onto MPFB's Mixamo-compatible rig by matching
joint-to-child directions, so differences in rest pose don't matter.

Everything is downloaded into scripts/blender/.cache on first run (gitignored).
"""

import math
import os
import subprocess
import sys
import urllib.request

import bpy
from mathutils import Matrix, Quaternion, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, ".cache")
POSE_SOURCES = ("Xbot", "Soldier", "Michelle")
THREE_MODELS = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/{}.glb"


def B(x, y, z):
    return (x, -z, y)


# --------------------------------------------------------------------------- dependencies
def _fetch():
    os.makedirs(CACHE, exist_ok=True)
    for name in POSE_SOURCES:
        path = os.path.join(CACHE, name + ".glb")
        if not os.path.exists(path):
            urllib.request.urlretrieve(THREE_MODELS.format(name), path)
    mpfb_dir = os.path.join(CACHE, "mpfb2")
    if not os.path.isdir(mpfb_dir):
        subprocess.run(
            ["git", "clone", "-q", "--depth", "1", "https://github.com/makehumancommunity/mpfb2", mpfb_dir],
            check=True,
            env={**os.environ, "GIT_LFS_SKIP_SMUDGE": "1"},
        )
    return os.path.join(mpfb_dir, "src")


def _load_mpfb(src):
    """Import MPFB's services headless (it normally runs as a registered Blender extension)."""
    sys.path.insert(0, src)
    user = os.path.join(CACHE, "mpfb_user")
    os.makedirs(user, exist_ok=True)
    bpy.utils.extension_path_user = lambda *a, **k: user
    import mpfb  # noqa: E402

    prefs = {
        "mpfb_user_data": user,
        "mpfb_second_root": "",
        "mh_user_data": "",
        "mh_auto_user_data": False,
        "mpfb_codechecks": False,
        "mpfb_shelf_label": "MPFB",
        "mpfb_show_start_here": False,
    }
    mpfb.get_preference = lambda name: prefs.get(name)
    mpfb.MPFB_CONTEXTUAL_INFORMATION = {"__package__": "mpfb", "__package_short__": "mpfb", "__file__": mpfb.__file__}
    from mpfb.services.humanservice import HumanService
    from mpfb.services.targetservice import TargetService

    return HumanService, TargetService


# --------------------------------------------------------------------------- retargeting
PREFER = {
    "mixamorig:Hips": "mixamorig:Spine",
    "mixamorig:Spine2": "mixamorig:Neck",
    "mixamorig:LeftHand": "mixamorig:LeftHandMiddle1",
    "mixamorig:RightHand": "mixamorig:RightHandMiddle1",
}


def _bone_dir(arm, pb):
    """Direction from a joint to its main child joint (independent of how bone tails were guessed)."""
    mw = arm.matrix_world
    kids = {c.name: c for c in pb.children}
    child = kids.get(PREFER.get(pb.name)) or (pb.children[0] if len(pb.children) == 1 else None)
    if child is None and pb.children:
        child = sorted(pb.children, key=lambda c: c.name)[0]
    if child is not None:
        return ((mw @ child.head) - (mw @ pb.head)).normalized()
    return ((mw @ pb.tail) - (mw @ pb.head)).normalized()


def _depth(pb):
    d = 0
    while pb.parent:
        pb, d = pb.parent, d + 1
    return d


def _sample_pose(model, action, frame):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(CACHE, model + ".glb"))
    new = [o for o in bpy.data.objects if o not in before]
    arm = next(o for o in new if o.type == "ARMATURE")
    arm.animation_data.action = bpy.data.actions[action]
    bpy.context.scene.frame_set(frame)
    bpy.context.view_layer.update()
    dirs = {pb.name: _bone_dir(arm, pb) for pb in arm.pose.bones}
    for o in new:
        bpy.data.objects.remove(o, do_unlink=True)
    for a in list(bpy.data.actions):
        bpy.data.actions.remove(a)
    return dirs


def _rotate_bone(arm, pb, q):
    mw = arm.matrix_world
    world = mw @ pb.matrix
    rot = q.to_matrix().to_4x4() @ Matrix(world.to_3x3()).to_4x4()
    rot.translation = world.to_translation()
    pb.matrix = mw.inverted() @ rot
    bpy.context.view_layer.update()


def _retarget(arm, dirs):
    for pb in sorted(arm.pose.bones, key=_depth):
        if pb.name in dirs:
            bpy.context.view_layer.update()
            _rotate_bone(arm, pb, _bone_dir(arm, pb).rotation_difference(dirs[pb.name]))


def _look_at(arm, target, weight=0.6):
    """Turn neck + head towards a world point, partially, so it stays natural (max ~35° each)."""
    # MakeHuman bodies face -Y in their own space.
    fwd = (arm.matrix_world.to_3x3() @ Vector((0, -1, 0))).normalized()
    for name, w in (("mixamorig:Neck", weight * 0.4), ("mixamorig:Head", weight * 0.6)):
        pb = arm.pose.bones[name]
        head = arm.matrix_world @ pb.head
        want = (Vector(target) - head).normalized()
        axis, angle = fwd.rotation_difference(want).to_axis_angle()
        q = Quaternion(axis, max(-0.6, min(0.6, angle * w)))
        _rotate_bone(arm, pb, q)
        fwd = (q.to_matrix() @ fwd).normalized()


# --------------------------------------------------------------------------- lean-back pose
def _lean_dirs(base, i):
    """
    The 'lean back' pose: torso arched far back, head thrown back to the sky, knees soft and
    pushed forward, arms hanging limp along the body. Directions are in the rig's rest space
    (Blender: z up; the MakeHuman rig faces -Y at rest, so 'back' is +Y).
    Each person gets a small, deterministic variation so the crowd isn't copy-pasted.
    """
    import random

    r = random.Random(1000 + i)
    k = 0.85 + r.random() * 0.3  # how far back
    knee = 0.3 + r.random() * 0.15
    spread = 0.04 + r.random() * 0.06
    d = dict(base)

    def v(x, y, z):
        # +y = towards the back (the body faces -Y at rest).
        return Vector((x, y, z)).normalized()

    d["mixamorig:Hips"] = v(0, 0.35 * k, 1)
    d["mixamorig:Spine"] = v(0, 0.6 * k, 1)
    d["mixamorig:Spine1"] = v(0, 0.85 * k, 1)
    d["mixamorig:Spine2"] = v(0, 1.1 * k, 1)
    d["mixamorig:Neck"] = v(0, 1.45 * k, 0.8)
    d["mixamorig:Head"] = v(0.04 * (r.random() - 0.5), 1.7 * k, 0.45)
    for side, sx in (("Left", 1), ("Right", -1)):
        d[f"mixamorig:{side}UpLeg"] = v(0.06 * sx, -knee, -1)
        d[f"mixamorig:{side}Leg"] = v(0.01 * sx, 0.14, -1)
        d[f"mixamorig:{side}Foot"] = v(0.05 * sx, -1, -0.12)
        # Arms hang with gravity: straight down, a touch behind the body because it leans back.
        d[f"mixamorig:{side}Arm"] = v(spread * sx, 0.08, -1)
        d[f"mixamorig:{side}ForeArm"] = v(0.02 * sx, 0.02 + r.random() * 0.06, -1)
        d[f"mixamorig:{side}Hand"] = v(0.0, 0.05, -1)
    return d


def _drop_to_floor(obj, floor_z):
    """After posing, bent knees lift the feet: put the lowest point back on the floor."""
    low = min((obj.matrix_world @ vert.co).z for vert in obj.data.vertices)
    obj.location.z -= low - floor_z
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)


# --------------------------------------------------------------------------- build
def build(specs, lean=False):
    """
    specs: list of dicts with three.js-space placement:
      pos (x, y, z), face (deg, 0 = facing +z / the camera), look (x, y, z) or None,
      body (gender, age, muscle, weight, height in 0..1), pose (model, action, frame),
      optional raise_arm ("left" | "right") and look_weight.
    Returns (people_object, feet_positions_three_space, shadows), where each shadow is
    [x, y, z, lean_x, lean_z] in three.js space: the point between the feet on the floor and the
    horizontal offset from the feet to the head (the lean), for the contact shadows on the site.
    """
    HumanService, TargetService = _load_mpfb(_fetch())
    poses = {s["pose"]: None for s in specs}
    for key in poses:
        poses[key] = _sample_pose(*key)

    made = []
    feet = []
    shadows = []
    for i, s in enumerate(specs):
        macro = TargetService.get_default_macro_info_dict()
        for k, v in zip(("gender", "age", "muscle", "weight", "height"), s["body"]):
            macro[k] = v
        body = HumanService.create_human(macro_detail_dict=macro)
        arm = HumanService.add_builtin_rig(body, "mixamo")
        bpy.context.view_layer.objects.active = arm
        bpy.ops.object.mode_set(mode="POSE")
        dirs = dict(poses[s["pose"]])
        if lean:
            dirs = _lean_dirs(dirs, i)
        elif s.get("raise_arm"):
            # One hand in the air (concert crowd). Bodies face -Y; their right side is -X.
            sx = -1 if s["raise_arm"] == "right" else 1
            side = "Right" if s["raise_arm"] == "right" else "Left"
            dirs[f"mixamorig:{side}Arm"] = Vector((0.25 * sx, -0.15, 0.95)).normalized()
            dirs[f"mixamorig:{side}ForeArm"] = Vector((0.1 * sx, -0.1, 1)).normalized()
            dirs[f"mixamorig:{side}Hand"] = Vector((0.05 * sx, -0.05, 1)).normalized()
        _retarget(arm, dirs)
        bpy.ops.object.mode_set(mode="OBJECT")
        arm.rotation_euler[2] = math.radians(180 + s["face"])
        arm.location = B(*s["pos"])
        bpy.context.view_layer.update()
        if s.get("look") and not lean:
            bpy.ops.object.mode_set(mode="POSE")
            _look_at(arm, B(*s["look"]), s.get("look_weight", 0.6))
            bpy.ops.object.mode_set(mode="OBJECT")

        # Bake the pose into the mesh, drop helpers and the rig, lighten it for the web.
        bpy.ops.object.select_all(action="DESELECT")
        body.select_set(True)
        bpy.context.view_layer.objects.active = body
        if body.data.shape_keys:  # MPFB macros are shape keys: bake the mix before applying modifiers
            bpy.ops.object.shape_key_remove(all=True, apply_mix=True)
        for mod in list(body.modifiers):
            bpy.ops.object.modifier_apply(modifier=mod.name)
        dec = body.modifiers.new("decimate", "DECIMATE")
        dec.ratio = 0.42
        bpy.ops.object.modifier_apply(modifier=dec.name)
        bpy.ops.object.shade_smooth()
        # Keep the placement the rig gave it (location + facing) before the rig goes away.
        bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        _drop_to_floor(body, B(*s["pos"])[2])
        vs = [body.matrix_world @ v.co for v in body.data.vertices]
        lo = min(v.z for v in vs)
        hi = max(v.z for v in vs)
        foot = [v for v in vs if v.z < lo + 0.08]
        head = [v for v in vs if v.z > hi - 0.18]
        fx = sum(v.x for v in foot) / len(foot)
        fy = sum(v.y for v in foot) / len(foot)
        hx = sum(v.x for v in head) / len(head)
        hy = sum(v.y for v in head) / len(head)
        # Blender (x, y, z) → three.js (x, z, -y)
        shadows.append([round(v, 3) for v in (fx, lo, -fy, hx - fx, -(hy - fy))])
        bpy.data.objects.remove(arm, do_unlink=True)
        for vg in list(body.vertex_groups):
            body.vertex_groups.remove(vg)
        if body.data.shape_keys:
            body.shape_key_clear()
        body.name = f"Person_{i}"
        made.append(body)
        feet.append(s["pos"])

    bpy.ops.object.select_all(action="DESELECT")
    for o in made:
        o.select_set(True)
    bpy.context.view_layer.objects.active = made[0]
    bpy.ops.object.join()
    people = bpy.context.object
    people.name = "People"
    people.data.name = "People"
    return people, feet, shadows
