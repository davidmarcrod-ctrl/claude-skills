# Limits and Pitfalls

What the Blender MCP can and cannot do. Read before scoping any build.

---

## Hard limits: MCP cannot do these

**Full Cycles render inside a tool call.** Cycles renders at meaningful quality take minutes to hours, and main-thread work blocks Blender's UI. Never render a final through `run_python` or `preview_render`. The workflow is: set everything up, audit the scene, get the user's OK on range, engine and samples, then `render_animation` (background process) or the user presses F12.

**Creative decisions.** Claude can execute a brief but cannot define the look. "Make it look good" is not a brief. If the material, lighting, or composition direction is undefined, ask for a reference image before touching anything.

**Fixing broken geometry or topology.** If an object has inverted normals, non-manifold geometry, or topology errors, MCP cannot repair it. Inform the user and tell them what to fix manually in Edit Mode.

**Modelling objects that aren't in the scene.** `create_object` adds primitives, empties, cameras, lights and text; `run_python` can build anything procedural. Real modelled assets are not something to improvise: if the brief needs one that's missing, ask the user for it (or a Higgsfield generation, with their OK).

**Real-time viewport manipulation.** MCP does not control the Blender UI directly. It sends Python commands (`viewport_screenshot` can only look). If a change requires interacting with the 3D viewport (manual vertex editing, interactive sculpting), it cannot be done via MCP.

---

## bpy script pitfalls

**Context errors.** Many `bpy.ops` operators require a specific context (Object mode, Edit mode, a specific area type). Calling an operator in the wrong context either silently fails or raises a `RuntimeError`. Always set context explicitly before calling operators:

```python
# ensure object mode before most bpy.ops.object calls
bpy.ops.object.mode_set(mode='OBJECT')
```

**Active object vs. selection.** Many operators act on `bpy.context.view_layer.objects.active`, not on a selection. Set both explicitly:

```python
obj = bpy.data.objects["MyObject"]
bpy.context.view_layer.objects.active = obj
obj.select_set(True)
```

**Dependency graph staleness.** After modifying an object's data, read computed properties (world matrix, modifier results) only after updating the dependency graph:

```python
bpy.context.view_layer.update()
# or
bpy.context.evaluated_depsgraph_get()
```

**Edit mode mesh access.** In Edit mode, the mesh must be accessed via bmesh, not `bpy.data.meshes`. Regular mesh data is not updated until you exit Edit mode.

**Material slot assignment vs. material creation.** Two separate steps. Creating a material does not assign it. Assigning a slot index that doesn't exist will fail.

```python
# safe material assignment
mat = bpy.data.materials.get("MyMat") or bpy.data.materials.new("MyMat")
if obj.data.materials:
    obj.data.materials[0] = mat
else:
    obj.data.materials.append(mat)
```

---

## Node editor pitfalls

**Node type names.** The string name required for `nodes.new()` is the internal node type name, not the UI label. They differ.

| UI label | `nodes.new()` string |
|---|---|
| Principled BSDF | `'ShaderNodeBsdfPrincipled'` |
| Emission | `'ShaderNodeEmission'` |
| Mix Shader | `'ShaderNodeMixShader'` |
| Volume Absorption | `'ShaderNodeVolumeAbsorption'` |
| Volume Scatter | `'ShaderNodeVolumeScatter'` |
| Image Texture | `'ShaderNodeTexImage'` |
| Noise Texture | `'ShaderNodeTexNoise'` |
| Color Ramp | `'ShaderNodeValToRGB'` |
| Math | `'ShaderNodeMath'` |
| Output Material | `'ShaderNodeOutputMaterial'` |

**Socket names.** Socket labels in the UI and socket identifiers in Python differ for some nodes. When connecting nodes via `links.new()`, use the socket object, not a string name:

```python
links.new(principled.outputs['BSDF'], output.inputs['Surface'])
links.new(vol_absorption.outputs['Volume'], output.inputs['Volume'])
```

**Use Nodes must be enabled.** Setting node inputs has no effect if `mat.use_nodes` is `False`.

```python
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
```

---

## EEVEE vs Cycles differences to communicate

| Feature | EEVEE | Cycles |
|---|---|---|
| Volume shaders (Absorption, Scatter) | Approximate, often looks wrong | Physically accurate |
| Subsurface scattering | Approximate | Accurate |
| Glossy reflections | Screen-space only | Full ray-traced |
| Caustics | No | Yes (slow) |
| Speed | Seconds | Minutes to hours |

If the brief requires volume materials (frosted acrylic, fog, smoke), tell the user: "The EEVEE preview is directional. Volumes will look noticeably better in Cycles."
