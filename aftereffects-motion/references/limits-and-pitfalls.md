# Limits and Pitfalls

What `ae-mcp` can and cannot do. Read before scoping any build.

---

## Hard limits

**Viewport vision.** Claude has no live view of the AE comp. The only way to see the current state is a user screenshot (or reading values back via `get_property` / `list_layers`). Ask for a screenshot at a specific time when it's about looks, "screenshot at 2.5s with the comp panel visible at 100% zoom."

**Modal dialogs block everything.** Any open AE dialog (including one triggered by `alert()` in your own JSX) stalls the call until the 30 s timeout. Never use `alert`/`confirm`/`prompt`.

**Rendering blocks.** `queue_render` + `start_render` work, but `start_render` blocks until the whole queue finishes and there's no live progress. Warn the user before starting a long render. `open_project` refuses if there are unsaved changes.

**Tracking / roto / warp stabilizer.** Mostly UI-driven. Only `run_script`, with low expectations.

## What used to be a limit and isn't here

- **Shape-layer contents / Trim Paths.** `set_property` / `set_keyframe` take any property path, e.g. `Contents.Group 1.Contents.Trim Paths 1.End`. Creating the shape structure (groups, Trim Paths, Repeater) is still easier in JSX via `run_script`.
- **3D switch.** `set_layer_3d`.

---

## ExtendScript quirks (ES3, not modern JS)

AE's scripting engine runs ExtendScript, which is roughly ES3. It does not understand modern syntax.

**No `const` or `let`.** Use `var` only.

```js
// breaks
const x = 5;
let y = 10;

// correct
var x = 5;
var y = 10;
```

**No arrow functions.**

```js
// breaks
var result = items.map(i => i.name);

// correct
var result = [];
for (var i = 0; i < items.length; i++) {
    result.push(items[i].name);
}
```

**No template literals.**

```js
// breaks
var msg = `Layer: ${name}`;

// correct
var msg = "Layer: " + name;
```

**`Array.indexOf` not always available.** Check before using, or write a manual loop.

```js
// safe fallback
function indexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) return i;
    }
    return -1;
}
```

**No `try/catch` on property access (no optional chaining either).** Always check for null before accessing nested properties.

---

## Undo after scripts

Each `run_script` call is one undo group, so Cmd+Z in AE reverts it as a block. Other structured tools aren't necessarily grouped. Before any non-trivial script, `save_project`. The last save is the real undo.

---

## State staleness

If the user has moved keyframes, adjusted values, or added layers manually since your last script ran, your model of the comp is stale. Do not write a patch script based on stale assumptions. Write a state dump first, read the result, then patch.

---

## Performance

Each tool call is a separate osascript round-trip. Many small calls add up. If a build takes more than 5 calls, switch to one JSX via `run_script`. Don't ask.

---

## What ae-mcp can do (for reference)

- Project: `get_project_info`, `open_project`, `save_project`, `list_compositions`, `create_composition`
- Layers: `list_layers`, `create_layer` (shape/text/solid/camera/light/null), `duplicate_layer`, `precompose_layers`, `set_layer_parent`, `set_layer_3d`, `set_layer_blend_mode`, `set_track_matte`, `add_mask`
- Properties: `get_property`, `set_property`, `set_keyframe` (interpolation + temporal ease), `set_expression`
- Effects: `apply_effect` (match name or `.ffx` preset)
- Render: `queue_render`, `start_render`, `get_render_queue_status`
- `run_script`: arbitrary ExtendScript for everything else

Property paths are dot-separated display names: `Transform.Position`, `Effects.Gaussian Blur.Blurriness`, `Masks.Mask 1.Mask Path`, `Text.Source Text`.
