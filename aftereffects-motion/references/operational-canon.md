# Operational Canon

How a session actually runs. Load at session start.

## Setup (user-side, once per session)

`ae-mcp` drives AE via `osascript` (`DoScriptFile`). There is no panel to open. It only needs:

1. After Effects running (default app name "Adobe After Effects 2026"; otherwise set `AE_MCP_APP_NAME`).
2. A project open.
3. No modal dialog open in AE. A dialog blocks every call until it times out (30 s default).

If calls time out: check for an open dialog in AE, or that AE is actually running. `get_project_info` is a cheap ping.

## Choose Mode A or Mode B before acting

Mode A. Structured tools. Each tool call is one operation in AE. Good for:

- Inspecting a comp (`list_layers`, `get_property`, `get_project_info`)
- One-off changes (`apply_effect` a Gaussian Blur to layer 1)
- Iterative adjustments while the user is watching

Mode B. JSX via `run_script`. You write the JSX, save it to the project folder as a `.jsx` file, then pass the same code to `run_script`. Good for:

- Building entire animations (50+ keyframes at once)
- Complex effects, masks, time remaps, shape-layer contents
- Anything you might re-run later
- Anything that would otherwise be 10+ tool calls

If a build is more than 5 tool calls, switch to JSX. Don't ask.

`run_script` specifics:
- The body runs inside a function, so it **must end in `return <value>;`**. That value comes back to you as JSON.
- It is already wrapped in one undo group. Don't add `beginUndoGroup`/`endUndoGroup` yourself.
- Helpers in scope: `__resolveComp(compId, compName)`, `__resolveLayer(comp, layerIndex, layerName)`, `__resolvePropertyPath(layer, "Transform.Position")`.
- Never call `alert()`, `confirm()` or `prompt()`. A dialog blocks AE and the call times out. Report via the return value.
- 30 s timeout per call. Split very heavy builds.
- Layer indices shift after structural changes. Address layers by name, or re-call `list_layers`.

The JSX must stay idempotent so re-runs are safe (see `scripting-patterns.md`).

## The iteration loop in detail

1. **User describes the goal.** Plain language is fine. They will sometimes drop a reference image. Treat reference images as design direction, not pixel-exact targets, unless they say otherwise.

2. **Ask one blocking question, if any.** Examples of blocking: target duration unclear, target framerate/comp size unknown, source asset path missing. Don't ask design-taste questions ("should the easing be soft or sharp?"); make a call and let them push back.

3. **Build.** If JSX, save the file to the user's project folder (ask for the path once and remember it for the session). Recommended name pattern: `<purpose>_<vN>.jsx`, e.g. `lockup_reveal_v3.jsx`.

4. **Run it.** `save_project` first if the script is destructive, then `run_script` with the file's contents. Check the returned value for errors. Then tell the user what changed and what to preview.

5. **User previews.** They hit `0` on the numpad for RAM preview. They report what's wrong or what's right, ideally with a screenshot at a specific timestamp.

6. **You diagnose from the screenshot + their description, then patch.** Patches that touch what the user has changed manually need a state dump first (see below).

## Screenshot-driven debugging

Your only view of AE is what the user screenshots. When something looks wrong:

- Ask for a screenshot **at a specific time** (e.g. "screenshot at 2.5s with the comp panel visible at 100% zoom").
- If timing is the question, ask for two screenshots (start and end of the problematic range).
- If layering is the question, ask for the timeline panel screenshot too, not just the comp panel.

Treat the user as your eyes. They will know what's wrong before you do.

## State dump pattern

If the user has manually adjusted properties or added layers since your last script, your model of the comp is stale. Don't push changes blind. Dump the current state first: `list_layers` for a quick snapshot, or the `_dump_state` JSX via `run_script` (it returns the JSON directly, no file needed). Then patch.

The state dump script lives in `scripting-patterns.md` as a template. Common name: `_dump_state.jsx`.

## File organisation

Recommend the user keep a per-project folder:

```
~/Documents/<Project>/
├── <Project>.aep
├── structural_build.jsx
├── lockup_reveal.jsx
├── colorize_variants.jsx
└── _dump_state.jsx
```

When you write a new script, save it into that folder by default. Name it for what it does, not when it was made.

## Save discipline

Before running any non-trivial JSX, call `save_project`. Each `run_script` is a single undo group, so Cmd+Z in AE reverts one call. That's handy, but it isn't a guarantee for complex scripts. The last save is the real recovery. `save_project` fails on a never-saved project: ask the user to save it once (Cmd+S) or pass a path.

## Common commands the user might paste back at you

Worth recognising so you can respond fast:

| User says... | They mean... |
|---|---|
| "rerun the script" | `run_script` the same JSX again, no changes needed |
| "dump state" | `run_script` the `_dump_state` JSX |
| "patch the timing" | Change keyframe times, not the structural script |
| "restart this section" | Throw away current approach, propose new one |
| "0 on numpad" | RAM preview (just FYI, no action needed) |
