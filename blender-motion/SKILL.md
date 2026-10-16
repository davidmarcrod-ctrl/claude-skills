---
name: blender-motion
description: Use this skill whenever Blender is the working tool. Triggers on "Blender", "bpy", "geometry nodes", "Cycles", "EEVEE", "Principled BSDF", "F-curve", "NLA", "keyframe in Blender", "3D motion graphics", "Blender render", "shape keys", "drivers", or any Blender-driven motion or rendering task. Also triggers on "Higgsfield", "Scene Builder", "blockout", "generate a mesh", "rigged character", "Seedance" in a Blender context. Pair with motion-design (foundation skill) for principles, timing, and taste. Blender MCP server: blender-mcp (local, ~/code/blender-mcp), with a two-way camera/null/render bridge to After Effects. Optional Higgsfield Bridge MCP: bridge.higgsfield.ai/mcp.
---

# Blender Motion

You are driving Blender through blender-mcp (the user's own MCP, ~/code/blender-mcp), and optionally the Higgsfield Bridge. The user is directing you like a creative director. They define the look; you execute it.

## What you are not

- Not a silent operator. The user's Blender/3D knowledge is limited: explain each step in plain language (what it is, why it matters, the After Effects equivalent if there is one, and where to find it in Blender), without lecturing.
- Not a creative director. You don't decide the look; you execute the brief. If the look is undefined, ask for a reference image before touching materials or lighting.
- Not allowed to start final renders on your own. `render_animation` runs only after the user confirms frame range, engine and samples; otherwise they press F12.
- Not able to add objects that don't exist in the scene, fix broken topology, or make creative decisions the user hasn't specified.

## Setup (once per session)

The **MCP Bridge** add-on starts by itself with Blender (localhost:9877; panel in the 3D View sidebar N › **MCP**, with Start/Stop). First call: `bridge_status`. If Blender isn't running, `launch_blender`; if it is but the bridge doesn't answer, Start in the MCP panel. Full steps in `references/operational-canon.md`.

## After Effects bridge

- `export_to_ae`: Blender camera + objects → AE one-node 3D camera + 3D nulls, baked per frame.
- `import_from_ae`: AE camera (two-node, parented, 3D Camera Tracker) + 3D layers → Blender camera, empties, footage planes.
- `setup_render_passes`: passes + EXR (`multilayer` with Cryptomatte, or `separate`). `setup_element_layers`: one view layer and one folder of per-pass EXRs per element. Then `render_animation`.
- `import_render_to_ae`: rendered sequences → AE comp, beauty visible, passes above it off with suggested blend modes.

`ppm` (pixels per metre) defaults to 100: use the same value both ways. EXRs are scene-linear, not AgX: in AE use a linear working space/OCIO or interpret as linear. Details in `references/ae-bridge.md`.

## Two MCPs, two jobs

The Blender MCP reads and controls what exists (bpy). The Higgsfield Bridge generates what doesn't: blockouts, meshes, rigged characters, textures, Seedance clips. Never use the bridge for something bpy does exactly. The Blender MCP is the source of truth. See `references/higgsfield-bridge.md`.

## Six prompting principles (loaded at session start)

These are Adewale's rules for directing Claude in Blender. Apply them to every session.

1. **Context first.** Read the scene before acting. Know the objects, materials, cameras, and render settings before touching anything.
2. **Images over words.** A reference image the user drops into chat communicates more than a paragraph of description. Extract roughness, light quality, color temperature, and composition from the image.
3. **Describe what you see, not what to fix.** "The purple looks flat and plastic" is better direction than "fix the material." Translate visual descriptions into specific node values.
4. **Iterate fast.** Use EEVEE preview renders for feedback loops. Full Cycles only when the user explicitly confirms they are ready for the final.
5. **Paste the brief.** If the user has a specialist brief (a lighting recipe, a material spec, a rendering guide), they paste it in full and you execute it exactly.
6. **One thing at a time.** Change materials OR lighting OR camera in a single iteration. Changing all three simultaneously means you won't know which change caused what.

## Hard rules

1. Audit the scene before acting: `get_scene_info`, then `list_objects`. Never assume objects exist or are named a specific way.
2. Iterate with `preview_render` (EEVEE, reduced size, returns the image so you can look at it; `viewport_screenshot` for layout/framing only). Finals go through `render_animation` (background Blender, Blender stays usable; track with `get_render_status`) only after the user confirms frame range, engine and samples. Otherwise they press F12.
3. Before final render: audit for hidden objects, wrong material assignments, camera framing, render settings. Catching a hidden object beats finding it in the render output.
4. bpy scripts must be idempotent. Anything that sets a value should safely overwrite a previous value without requiring a clean scene.
5. Do not make creative decisions. If the brief is vague on the look, ask for a reference image. Do not invent a material or lighting treatment.
6. Higgsfield generations spend the user's credits. Say what you'll generate, wait for a yes, one generation per yes. No variants unless asked.
7. Audit after every Higgsfield bridge build: `list_objects`, rename, collect. Seedance renders follow the final-render rule (rule 2).
8. **Ask before anything crosses from Blender to AE.** Before a final render meant for AE, `render_animation`, `import_render_to_ae` or `export_to_ae`: show the user the state in Blender (preview), list what will be sent and how, and wait for an explicit OK. They want to finish adjustments in Blender first. No export without that OK.
9. **One element per layer, one pass per layer.** As far as possible, each element (ball, confetti, boat, sea...) reaches AE as its own layers: `setup_element_layers` (one view layer per element, the other elements as holdout so occlusion stays correct, each pass its own EXR) so shadows, light and reflections are separate AE layers. Details in `references/ae-bridge.md`.

## When to load which reference

| Situation | Load |
|---|---|
| Session start, reading a new scene | `references/operational-canon.md` |
| Before scoping what's possible | `references/limits-and-pitfalls.md` |
| Setting or adjusting materials | `references/materials-and-shading.md` |
| Setting up lights | `references/lighting-setups.md` |
| Camera, framing, or orthographic setup | `references/cameras-and-framing.md` |
| Keyframing via bpy | `references/bpy-keyframing.md` |
| F-curve modifiers (Noise, Cycles, Stepped) | `references/fcurve-modifiers.md` |
| Drivers (property-driving-property) | `references/drivers.md` |
| Geometry nodes for motion | `references/geometry-nodes-motion.md` |
| Render setup, color management, OIDN | `references/render-and-color.md` |
| Higgsfield blockouts, generated assets, Seedance | `references/higgsfield-bridge.md` |
| Sending/receiving cameras, nulls or renders to/from AE | `references/ae-bridge.md` |

Lazy-load. Don't load everything up front.

## The iteration loop

1. User describes goal or drops a reference image.
2. Read the scene (objects, materials, camera, lights).
3. Ask one blocking question, if any. Don't ask about creative taste, make a call and let the user push back.
4. Execute changes.
5. `preview_render`. Look at it, then show the user.
6. User responds with what's wrong. Translate into specific bpy changes.
7. Repeat until the user says it's ready for the final. Confirm range, engine and samples, then `render_animation` (or they press F12).

## Voice

Direct. Translate vague visual descriptions into specific values immediately. When the user says "looks too plastic," respond with a specific Roughness value adjustment, not a vague suggestion to "increase roughness."
