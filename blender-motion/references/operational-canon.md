# Operational Canon

How a session actually runs. Load at session start.

---

## Bridge setup (user-side, once per session)

blender-mcp talks to the **MCP Bridge** add-on over localhost:9877. The add-on starts by itself with Blender.

1. First call of the session: `bridge_status`.
2. Blender not running: `launch_blender`, then `open_file` for the project's .blend (it refuses to discard unsaved changes unless told to).
3. Blender running but no answer: the user clicks Start in the 3D View sidebar (N) › **MCP** panel. If it still fails, restart Blender.
4. Leave Blender open for the entire session. Each mutating call is one undo step (Cmd+Z).

---

## Scene context before acting

Never touch anything before reading the scene. This is not optional.

Run `get_scene_info`, then `list_objects` (filter by type when useful, e.g. `CAMERA`, `LIGHT`). Use `get_property` for anything they don't cover. Know:
- What objects are in the scene, what they're named, what collections they're in.
- What materials are assigned and which objects have them.
- What the camera type is (orthographic or perspective) and its current position.
- What lights are present, their type (Area, Point, Sun, Spot), energy, and position.
- Current render engine (Cycles or EEVEE) and output resolution.

Only after reading the scene can you make a change that won't break something the user has already set up manually.

---

## Reference image workflow

The most efficient way to direct material and lighting work.

1. User drops a reference image into the chat.
2. Extract from the image: lighting quality (hard or soft), light direction, shadow softness, material roughness (low = glossy, high = matte), color temperature, any visible surface texture.
3. Translate directly into Blender values. Do not ask the user to interpret the image. That is your job.
4. State your reading before executing: "I'm reading this as: large soft area lights above and left, roughness ~0.1 for the surface, cool light with a warm fill. Applying now."
5. Execute. Preview. Iterate.

Real example: a reference image showed smooth purple panels with a soft gradient highlight. The read: roughness 0.07, large area lights (600x600mm or larger) for the broad gradient, Bevel + Subdivision on the geometry for smooth edges. None of that needed manual explanation from the user. One image.

---

## Specialist brief pattern

If the user has a detailed technical brief (a lighting recipe, a material spec, a specialist tutorial), they paste it in full.

> "Here is a specialist brief for the material I want. Follow it exactly and apply it to the logo material in my scene: [paste brief]"

Your job is to execute the brief precisely. Don't summarize it. Don't adapt it to something simpler. If the brief specifies exact node values, use those values.

---

## EEVEE preview loop

All iterative feedback happens via EEVEE preview, not Cycles. EEVEE takes seconds; Cycles takes minutes.

After each change:
1. `preview_render` (EEVEE, 50% by default, 16 samples; returns the image and restores the scene's settings). Look at it yourself before showing it. `viewport_screenshot` is cheaper when only layout or framing matters.
2. Ask the user what's wrong or right.
3. Translate their description into specific bpy changes. "Looks plastic" means roughness too low. "Too dark" means lights too dim or color too dark. "Shadows too sharp" means lights too small or too far.
4. Apply changes. Preview again.

EEVEE vs Cycles difference to flag: EEVEE doesn't compute volumetric materials or subsurface scattering as accurately as Cycles. If the final will be Cycles, tell the user that the EEVEE preview is directional, not final. The material may look slightly different in Cycles, particularly on glossy or volumetric surfaces.

---

## Scene audit before final render

Before any final render (`render_animation` or F12), run a scene audit with `run_python`:

```python
import bpy

print("=== SCENE AUDIT ===")
for obj in bpy.context.scene.objects:
    print(f"Object: {obj.name} | Type: {obj.type} | Hide Render: {obj.hide_render} | Hide Viewport: {obj.hide_viewport}")
    if obj.type == 'MESH' and obj.data.materials:
        for mat in obj.data.materials:
            if mat:
                print(f"  Material: {mat.name}")

cam = bpy.context.scene.camera
if cam:
    print(f"Camera: {cam.name} | Type: {cam.data.type} | Resolution: {bpy.context.scene.render.resolution_x}x{bpy.context.scene.render.resolution_y}")
else:
    print("No active camera set.")

print(f"Render Engine: {bpy.context.scene.render.engine}")
print(f"Output Path: {bpy.context.scene.render.filepath}")
```

Common issues to catch:
- Objects hidden from render (`hide_render = True`) that should be visible.
- No active camera set.
- Render engine still set to EEVEE after previewing (if final should be Cycles).
- Output path pointing to a temp location from a previous preview.
- Wrong resolution (still at preview 960x540 instead of final 4K).

---

## Final render handoff

Cycles renders take minutes to hours. Never render a final on Blender's main thread (`run_python` with `bpy.ops.render.render`): it blocks the UI and the MCP call.

When the scene is ready:
1. Tell the user the current render settings: frame range, engine, resolution, samples, denoising state, output path (`set_render_settings` to change them).
2. Confirm everything looks correct from the audit.
3. Wait for the user to confirm range, engine and samples. Then `save_file` and `render_animation`: a background Blender renders from a snapshot, the user's Blender stays usable. Report progress with `get_render_status` when asked; don't poll in a loop.
4. If the user prefers, they press F12 instead.

---

## Translating visual descriptions into Blender values

The user will describe what they see, not what settings to change. Your job is the translation.

| User says | Blender translation |
|---|---|
| "Looks too shiny / like a mirror" | Roughness too low, raise toward 0.2–0.5 |
| "Looks too plastic / fake" | Roughness near 0, no subsurface, raise Roughness to 0.07–0.15, add slight Subsurface |
| "Shadows too sharp and hard" | Light source too small or too far, increase Area Light size, or move it closer |
| "Too dark, can't see detail" | Lights underpowered or background too dark, raise light Energy or add fill light |
| "Flat, no depth" | Missing fill/rim light, or no ambient occlusion, add a secondary light or enable HDRI |
| "Wrong colour" | Material Base Color, or light Color Temperature, adjust accordingly |
| "Gradient across the face" | Large area light close to the object, increase light size to 600x600mm+ and position it 45 degrees above |
| "Frosted / soft / premium" | Roughness 0.05–0.1 + Transmission 0.0 + Volume Absorption for depth, see materials-and-shading.md |
