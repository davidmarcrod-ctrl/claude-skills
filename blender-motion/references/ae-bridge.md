# After Effects Bridge

Moving cameras, nulls and renders between Blender and AE with blender-mcp. Load when a shot crosses between the two apps. AE must be running with a project open; it needs nothing installed (same osascript → JSX path as ae-mcp).

---

## Tools

| Direction | Tool | What it does |
|---|---|---|
| Blender → AE | `export_to_ae` | Scene camera + chosen objects → AE one-node 3D camera + 3D nulls, baked per frame. Warns about lens shift and ortho cameras (AE can't reproduce them). |
| AE → Blender | `import_from_ae` | AE camera (one-node, two-node/POI, parented, 3D Camera Tracker) + 3D layers → Blender camera, empties and planes. Footage planes get the source as texture, solids their colour; precomps/text arrive as untextured planes; lights as empties. |
| Blender passes | `setup_render_passes` | Passes + EXR output. `multilayer`: one EXR with everything, incl. Cryptomatte. `separate`: also one EXR sequence per pass (compositor File Output). Depth 16 for beauty/light passes, 32 for Z/position/vector. |
| Render | `render_animation` / `get_render_status` | Background Blender from a snapshot next to the .blend. Confirm range, engine and samples first. The file must be saved. |
| Renders → AE | `import_render_to_ae` | Rendered sequences → AE comp: beauty visible, passes above it switched off with suggested blend modes. If the MCP server restarted and forgot the job, pass `directory`. |

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
2. **Elements separate.** Each element in its own collection and its own view layer:
   - In that view layer, the other elements' collections are **holdout** (`view_layer.layer_collection.children[name].holdout = True`): they punch a transparent hole where they pass in front, so stacking the layers in AE rebuilds the right occlusion.
   - If an element must still light, reflect in or cast shadows on the others, set those collections to **indirect only** (Cycles) instead of excluding them.
   - The shadow-catcher floor stays in each view layer that casts shadows on the plate.
   - Name view layers after the element (`Balon`, `Confeti`...) so file names and AE layers read clearly.
3. **Passes separate.** `layout: "separate"` for every view layer, so beauty, shadow catcher, AO, light passes, etc. arrive as separate AE layers the user can grade on their own.
4. In AE, group each element's layers together (one precomp or a labelled block per element), passes above the beauty, switched on/off as `import_render_to_ae` suggests.

`setup_render_passes` and `import_render_to_ae` currently handle one view layer at a time (one File Output node, `MCP Pass Output`). Until they handle several, set the extra view layers and their File Output nodes with `run_python`, and point `import_render_to_ae` at each element's folder.

## Typical round trip

1. AE shot with a tracked or animated camera → `import_from_ae`.
2. Build/animate in Blender. Iterate with `preview_render`.
3. Elements in their own collections and view layers; `setup_render_passes` with `layout: "separate"` (usually `filmTransparent` on). Audit (`operational-canon.md`).
4. **Checkpoint with the user** (preview, elements, passes). Then they confirm range, engine and samples → `render_animation`; check with `get_render_status`.
5. `import_render_to_ae`, one element at a time. Then hand over to the aftereffects-motion skill.

Baking hundreds of frames in `export_to_ae` blocks Blender's UI while it runs. Say so before a long export.
