# Scripting Patterns

ExtendScript object model and reusable patterns. Load before writing any JSX.

---

## Object model

```
app.project                         → the open AE project
app.project.activeItem              → the currently active comp (CompItem)
app.project.item(index)             → access any item by index (1-based)
comp.layer(name)                    → layer by name (string)
comp.layer(index)                   → layer by index (1-based)
layer.property("Transform")         → the Transform property group
layer.property("Transform").property("Position")     → position
layer.property("Transform").property("Scale")        → scale
layer.property("Transform").property("Rotation")     → rotation
layer.property("Transform").property("Opacity")      → opacity
layer.property("Transform").property("Anchor Point") → anchor point
```

Shape layer contents (Trim Paths, etc.):
```
layer.property("Contents")
layer.property("Contents").property("Group 1")
layer.property("Contents").property("Group 1").property("Trim Paths 1")
```

Effects:
```
layer.property("Effects").property("Gaussian Blur")
layer.property("Effects").property("Gaussian Blur").property("Blurriness")
```

---

## Idempotent JSX template

Every JSX you write must start with cleanup logic. If the script is re-run, it rebuilds cleanly rather than stacking duplicates.

Written for `run_script`: no undo group (it already wraps one), no `alert`, ends in `return`.

```js
// lockup_reveal_v1.jsx, cleanup-and-rebuild template (run via run_script)
var comp = __resolveComp(null, "Main"); // or app.project.activeItem
if (!comp || !(comp instanceof CompItem)) {
    return { ok: false, error: "Comp not found" };
}

// --- CLEANUP: remove layers this script manages ---
var managedLayers = ["LockupBG", "LockupText", "LockupIcon"];
for (var i = comp.numLayers; i >= 1; i--) {
    for (var j = 0; j < managedLayers.length; j++) {
        if (comp.layer(i).name === managedLayers[j]) {
            comp.layer(i).remove();
            break;
        }
    }
}

// --- BUILD ---
// ... your layer/keyframe work here ...

return { ok: true, layers: comp.numLayers };
```

Rules for idempotent scripts:
- Name layers you create. Check for those names at cleanup time.
- Never assume a layer exists; check `comp.numLayers` before indexing.
- Don't add `beginUndoGroup` / `endUndoGroup`; `run_script` does it.
- Return something useful (created layer names, counts, warnings) so you can verify without a screenshot.

---

## Setting keyframes with interpolation

```js
var prop = comp.layer("MyLayer").property("Transform").property("Position");

// set keyframes
prop.setValueAtTime(0, [960, 540]);          // frame 0
prop.setValueAtTime(1.5, [960, 200]);        // 1.5s in

// set interpolation type (after setting keyframes)
prop.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
prop.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);

// common interpolation types
// KeyframeInterpolationType.LINEAR
// KeyframeInterpolationType.BEZIER
// KeyframeInterpolationType.HOLD
// KeyframeInterpolationType.EASY_EASE (sets both in/out to ease)
```

After setting BEZIER interpolation, set spatial tangents for clean curves:
```js
// spatialTangent = [xIn, yIn, xOut, yOut] (rough values, adjust to taste)
prop.setSpatialTangentsAtKey(1, [0, 0], [0, -50]);
prop.setSpatialTangentsAtKey(2, [0, 50], [0, 0]);
```

Easy ease shortcut:
```js
prop.setInterpolationTypeAtKey(1, KeyframeInterpolationType.EASY_EASE);
prop.setInterpolationTypeAtKey(2, KeyframeInterpolationType.EASY_EASE);
```

---

## Batch keyframe pattern

When setting many layers to stagger, loop and offset:

```js
var layers = ["Word1", "Word2", "Word3", "Word4"];
var stagger = 0.08; // seconds between each
var duration = 0.4; // animation duration per element

for (var i = 0; i < layers.length; i++) {
    var layer = comp.layer(layers[i]);
    var startTime = i * stagger;
    var endTime = startTime + duration;
    var prop = layer.property("Transform").property("Opacity");

    prop.setValueAtTime(startTime, 0);
    prop.setValueAtTime(endTime, 100);
    prop.setInterpolationTypeAtKey(1 + (i * 2), KeyframeInterpolationType.EASY_EASE);
    prop.setInterpolationTypeAtKey(2 + (i * 2), KeyframeInterpolationType.EASY_EASE);
}
```

---

## Adding and applying effects

```js
var layer = comp.layer("MyLayer");
var effect = layer.property("Effects").addProperty("ADBE Gaussian Blur 2"); // use internal name
effect.property("Blurriness").setValue(20);
```

Internal names differ from display names. See `references/effects-catalog.md` for the mapping.

---

## State dump diagnostic script

Run this via `run_script` when the comp state has diverged from what you know. It returns the JSON directly.

```js
// _dump_state.jsx, run via run_script to capture current comp state
var comp = app.project.activeItem;
if (!comp || !(comp instanceof CompItem)) {
    return { ok: false, error: "No active comp." };
} else {
    var output = {
        compName: comp.name,
        duration: comp.duration,
        frameRate: comp.frameRate,
        width: comp.width,
        height: comp.height,
        layers: []
    };

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        var layerData = {
            index: i,
            name: layer.name,
            type: layer.matchName,
            inPoint: layer.inPoint,
            outPoint: layer.outPoint,
            startTime: layer.startTime,
            enabled: layer.enabled,
            solo: layer.solo,
            locked: layer.locked,
            threeDLayer: layer.threeDLayer,
            properties: {}
        };

        // dump Transform properties
        var transform = layer.property("Transform");
        var transformProps = ["Position", "Scale", "Rotation", "Opacity", "Anchor Point"];
        for (var j = 0; j < transformProps.length; j++) {
            var p = transform.property(transformProps[j]);
            if (p) {
                layerData.properties[transformProps[j]] = {
                    value: p.value,
                    numKeys: p.numKeys
                };
                if (p.numKeys > 0) {
                    var keys = [];
                    for (var k = 1; k <= p.numKeys; k++) {
                        keys.push({
                            time: p.keyTime(k),
                            value: p.keyValue(k)
                        });
                    }
                    layerData.properties[transformProps[j]].keys = keys;
                }
            }
        }

        output.layers.push(layerData);
    }

    return output; // ae-mcp serializes it (JSON polyfill is in scope)
}
```

For a quick look without keyframes, `list_layers` is enough.

---

## try/catch around risky operations

ExtendScript doesn't bubble errors cleanly. Wrap risky operations:

```js
try {
    var layer = comp.layer("MightNotExist");
    layer.property("Transform").property("Opacity").setValue(100);
} catch (e) {
    warnings.push("Error: " + e.toString()); // return warnings at the end, never alert()
}
```

---

## Naming conventions

Scripts you write should follow this pattern:
- `structural_build.jsx`, creates the full animation structure
- `lockup_reveal_v2.jsx`, versioned variant
- `colorize_dark.jsx`, variant by purpose
- `_dump_state.jsx`, leading underscore for utility/diagnostic scripts
- `_cleanup.jsx`, cleanup utility

Never name scripts by date ("script_may26.jsx"). Name by what they do.
