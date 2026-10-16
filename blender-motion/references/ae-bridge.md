# After Effects Bridge

Moving cameras, nulls and renders between Blender and AE with blender-mcp. Load when a shot crosses between the two apps. AE must be running with a project open; it needs nothing installed (same osascript → JSX path as ae-mcp).

---

## Tools

| Direction | Tool | What it does |
|---|---|---|
| Blender → AE | `export_to_ae` | Scene camera + chosen objects → AE one-node 3D camera + 3D nulls, baked per frame. Warns about lens shift and ortho cameras (AE can't reproduce them). |
| AE → Blender | `import_from_ae` | AE camera (one-node, two-node/POI, parented, 3D Camera Tracker) + 3D layers → Blender camera, empties and planes. Footage planes get the source as texture, solids their colour; precomps/text arrive as untextured planes; lights as empties. |
| Blender passes | `setup_render_passes` | Passes + EXR output. `multilayer`: one EXR with everything, incl. Cryptomatte. `separate`: also one EXR sequence per pass (compositor File Output). Depth 16 for beauty/light passes, 32 for Z/position/vector. |
| Elements | `setup_element_layers` | One view layer per element (`{"Balon": ["Balon"], "Confeti": ["Confeti"]}`, collections or objects) and one EXR sequence per pass in `//render/<scene>/<element>/`. Other elements holdout by default (`indirect_only` / `exclude` on request); shadow catchers in every layer. `shadows: "per_element"` for one shadow layer per element. Idempotent; `remove: true` undoes it. |
| Render | `render_animation` / `get_render_status` | Background Blender from a snapshot next to the .blend. Confirm range, engine and samples first. The file must be saved. |
| Renders → AE | `import_render_to_ae` | Rendered sequences → AE comp: beauty visible, passes above it switched off with suggested blend modes. Element renders arrive as one colour-labelled block per element (`Balon beauty`, `Balon AO`...), nearest to the camera on top (`elementOrder` to change it), shadow catchers under all beauties in Multiply over the plate. If the MCP server restarted and forgot the job, pass `directory` (the scene's render folder for element renders). |

---

## Conventions (don't fight them)

- **Scale:** `ppm` (pixels per metre) defaults to 100. Use the same value in both directions or the camera solve won't line up.
- **Axes:** AE position = (Bx, −Bz, By) × ppm + comp centre. Blender's world origin lands at the comp centre, AE z = 0.
- **Time:** Blender `frame_start` = AE time 0. Match fps first with `set_render_settings` (23.976 / 29.97 supported).
- **Color:** EXRs are scene-linear (Linear Rec.709), not AgX/Filmic. In AE use a linear working space or OCIO, or interpret the footage as linear. Otherwise it looks washed out and flat, which isn't a render bug.
- **Multilayer EXR in AE** shows the beauty only. Other channels via AE's Cryptomatte effect or EXtractoR. If the comp needs passes as separate layers, use `layout: "separate"`.

---

## The user's routine (mandatory)

1. **Checkpoint before AE.** Nothing goes to AE (final render, `render_animation`, `import_render_to_ae`, `export_to_ae`) until the user has seen the Blender state and said OK. Show a preview, say what elements and passes will be sent, and ask. They prefer to fix things in Blender, not in the comp.
2. **Elements separate.** `setup_element_layers`, one element per entry, named after it (`Balon`, `Confeti`...) so file names and AE layers read clearly:
   - The other elements are **holdout** in each layer: they punch a transparent hole where they pass in front, so stacking the layers in AE rebuilds the right occlusion.
   - If an element must still light or reflect in the others without being seen, `others: "indirect_only"` (Cycles).
   - Shadow-catcher floors stay in every layer. Held-out objects still cast shadows, so each layer's catcher pass holds every shadow: `shadows: "shared"` brings one shadow layer into AE; if the user wants to grade each element's shadow on its own, `shadows: "per_element"` (one more render per element). Explain the choice.
   - Check each layer with `preview_render` + `viewLayer` before the checkpoint.
3. **Passes separate.** `setup_element_layers` writes each pass of each element as its own sequence (beauty, shadow catcher, AO, light passes...), so they arrive as separate AE layers the user can grade on their own. For a single element, `setup_render_passes` with `layout: "separate"`.
4. In AE, `import_render_to_ae` groups each element's layers together (a labelled block per element), passes above the beauty, switched on/off as suggested.

## Typical round trip

1. AE shot with a tracked or animated camera → `import_from_ae`.
2. Build/animate in Blender. Iterate with `preview_render`.
3. Elements in their own collections; `setup_element_layers` (or `setup_render_passes` with `layout: "separate"` for a single element). Audit (`operational-canon.md`).
4. **Checkpoint with the user** (preview, elements, passes). Then they confirm range, engine and samples → `render_animation`; check with `get_render_status`.
5. After the user's OK, `import_render_to_ae` with the `jobId` (all elements at once). Then hand over to the aftereffects-motion skill.

Baking hundreds of frames in `export_to_ae` blocks Blender's UI while it runs. Say so before a long export.
