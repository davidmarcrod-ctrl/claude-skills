---
name: higgsfield-prompt-writing
description: Write, revise, and troubleshoot image and video prompts for Higgsfield. Covers character references, locations, product shots, camera movement, acting, blocking, continuity, and audio. Includes FAST and PRO workflows. All explanations, prompts, examples, and interface labels are in English.
---

# Higgsfield Prompt Writing

English public edition, adapted from the supplied v3.2 skill. Internal production history, private project references, provenance claims, and project-specific examples have been removed. The practical workflow is consolidated below. This is a standalone edition: it does not require the original viewer scripts, templates, private tools, or project folders.

## Scope and language

Use this skill to create or revise generation prompts, diagnose an unsatisfactory result, define a character's acting task, or explain scene blocking.

- Write all explanations, prompts, filenames, captions, and interface labels in English unless the user explicitly requests another language.
- Use original, unnamed characters and generic examples. Describe visual techniques, materials, clothing, behavior, and lighting instead of referring to a celebrity, protected character, franchise, named artist, or third-party brand as a creative shortcut.
- Keep product and platform names only when they identify the actual tool being used. User-supplied product references can be described as the attached product without importing brand names into generic examples.
- Do not include private project names, client information, internal production logs, credentials, private URLs, or machine-specific paths in shared deliverables.
- Treat generation behavior described here as practical guidance, not a guarantee. Models and available controls change; use the capabilities of the model actually selected.
- Writing a prompt does not authorize running a paid generation. Follow the user's requested scope and the host application's execution rules.

## 0. FAST and PRO workflows

### Choose a mode

If the user has not already selected a mode, briefly offer:

- **FAST:** one writing pass, compact acting directions, and ten internal checks.
- **PRO:** a complete scene workflow covering dramatic purpose, acting, blocking, and a detailed audit.

Keep the selection for the conversation until the user changes it. An edit inherits the existing prompt's mode. A diagnostic answer without a new prompt does not require a mode choice. If working autonomously without a stated mode, use FAST and mention that assumption briefly.

### FAST process

1. Identify the task: image, video, or edit; the cast; the shot count; dialogue; and available references.
2. Write a usable prompt immediately. Resolve minor omissions with sensible assumptions and state only assumptions that matter.
3. Give each important person a compact acting direction: an objective directed at someone or something, a tactic, and an observable eye-line or physical action.
4. Put each critical fact in its main section and, when necessary, repeat it consistently in the shot where it matters.
5. Run the ten checks below and fix failures before delivery.
6. Return a copyable English prompt and one to three brief notes about changes or assumptions.

For a complex video, the source workflow used roughly 3,000–8,000 characters, with 12,000 as a working ceiling. These are editing targets, not platform limits. Use less when the scene is simple. Image prompts usually benefit from concise, concrete prose.

### FAST checks

1. The first frame contains the correct people, objects, positions, and starting action.
2. Shot count, cut count, and timing agree.
3. Each character appears once; each reference has a clear role.
4. Each shot has an explicit camera instruction, including its endpoint or movement limit.
5. Lens choice, camera distance, and framing describe a compatible optical result.
6. Required behavior is stated positively; unwanted objects are not repeatedly named.
7. No contradictory camera, action, lighting, or continuity instructions remain.
8. Eye-lines are physically possible, including when the target is outside the frame.
9. Dialogue, speaker assignment, and the permitted audio are clear.
10. Image edits specify the target, requested change, protected features, and integration into the original.

### PRO process

Work through scene purpose, acting, blocking, prompt construction, and the complete audit in Section 9. Perform the analysis internally. Deliver the finished prompt with a short summary of the important corrections and any remaining uncertainty. Do not invent audit scores or claim to have tested a generation that was not run.

### Switching modes

- **PRO to FAST:** preserve the first-frame setup, cast, reference roles, camera instructions, exact dialogue, audio inventory, and fixes for observed failures. Remove decorative adjectives, redundant analysis, and unnecessary repetition.
- **FAST to PRO:** preserve working passages; add missing dramatic logic, acting, spatial constraints, and continuity. Offer a blocking diagram when geometry is the main problem.

Save a new version when changing an existing prompt. Keep the previous version available.

## 1. Diagnose, revise, and record

Use this cycle:

```text
Observed failure → likely cause → targeted revision → new result → confirmed lesson
```

- Separate observations from hypotheses. Explain briefly which wording or reference may have caused the problem.
- Change the smallest part that can address the failure. Preserve successful identity, composition, action, and technical choices.
- If the same mechanism fails three times, change the structure: simplify the action, split the shot, start inside the required state, or add a suitable visual reference.
- Record a lesson only after the result supports it. Use `symptom → likely mechanism → successful correction → limits`.
- Keep learning records generic and separate from public downloads. Do not automatically modify installed skills, private records, or unrelated files.

## 2. Ten practical prompting principles

1. **Mentioned objects can become visible.** Naming an unwanted object, even in a prohibition, may introduce it. Describe the desired image directly.
2. **Prefer positive states.** Use concrete descriptions and exact inventories. A short, targeted negative can help with an observed failure; avoid long lists of unwanted imagery.
3. **Resolve contradictions.** Opening instructions, shot descriptions, and final continuity notes must agree. A contradictory closing sentence can undermine the rest of the prompt.
4. **Repeat selectively and consistently.** Repeat a critical constraint only where it needs reinforcement, using the same meaning. More adjectives do not create more control.
5. **Replace misleading words.** If a term repeatedly produces the wrong result, change the concept it evokes. For example, replace vague smoothness with the actual behavior of a handheld operator.
6. **Contain dramatic motifs.** Repeating the same unusual action throughout a prompt may exaggerate it. Assign it to one beat and describe stability elsewhere.
7. **Start inside the action.** A character already mid-stride is often easier to establish than a long sequence of reaching, preparing, and beginning. Split difficult transitions into separate shots when useful.
8. **Restructure repeated failures.** Try simpler staging, a clearer term, a motion reference plus a pose reference, or a cut into the desired state instead of adding more restrictions.
9. **Describe visible scale.** Combine a fraction of the frame, a familiar size comparison, and camera placement. Physical measurements alone may not communicate composition.
10. **Track persistent state.** State what remains after each event: an open door stays open, a moved object stays in its new position, and accumulated changes remain visible.

## 3. Video prompts

### 3.1 Build the scene

For PRO, establish:

1. What the scene is trying to accomplish.
2. What each character wants and how they pursue it.
3. Where people, objects, and the camera are placed.
4. What the first frame shows.
5. What changes during the shot.
6. What the final frame must preserve.

For FAST, reduce this to the minimum required to make the action readable.

### 3.2 Prompt structure

Use the sections the shot actually needs:

```text
SCENE CONTEXT
ACTIVE REFERENCES
LOCATION AND SPATIAL LAYOUT
FIRST FRAME AND BLOCKING
SHOT STRUCTURE
LENS AND FRAMING
CAMERA
ACTION
PHYSICS
LIGHTING
AUDIO
CONTINUITY
```

Keep prompts self-contained. Replace phrases such as “same as before” with the actual required state. Exclude invisible props and unrelated characters from other scenes.

Set duration, aspect ratio, resolution, and other generation controls through the platform when supported. If the prompt is a request for an agent to configure and run generation, include those settings explicitly in that request. Do not add unsupported command syntax.

### 3.3 Reference roles

For every attached reference, state what it controls:

| Reference | Controls | Does not automatically control |
| --- | --- | --- |
| Identity portrait | Face, hair, age, and identity | Outfit, pose, background, or camera angle |
| Character sheet | Identity, proportions, and approved clothing | Studio backdrop, sheet layout, or expression |
| Location image | Geography, architecture, and materials | Camera position or starting action unless requested |
| Product image | Shape, construction, color, and details | People or environment |
| Motion reference | Specified movement and timing | Identity, wardrobe, or visual style |
| Audio reference | Requested vocal qualities or timing | New dialogue or unwanted recording noise |

Do not combine conflicting references without assigning their roles. Use actual attached identifiers supported by the tool. A written placeholder does not attach a file.

When a reference shows a different world state, explain the difference: “The reference supplies the room layout; in this shot the doors are already open.”

### 3.4 Space and eye-lines

- Distinguish world coordinates from screen coordinates.
- Anchor people to physical features, then describe how camera placement frames them.
- For an off-screen gaze, specify a visible direction relative to the lens: below it, beyond frame left, or toward a point to its right.
- Keep screen direction consistent across cuts when continuity requires it.
- For groups, state the order of silhouettes and the identifying feature of each person.
- For vehicle interiors or complex rooms, describe the arrangement from both the interior and the camera's viewing direction when necessary.
- Prefer physical relationships such as “one hand on the door handle” to vague proximity.

### 3.5 Lens and framing

Describe the visible result, not just a lens number. Pair a field of view or focal length with camera distance, depth of field, and subject size. Do not mix diagonal and horizontal field-of-view values without identifying which you mean.

Useful approximate diagonal field-of-view targets from the source workflow:

| Field of view | Intended appearance |
| --- | --- |
| 107° | Very wide rectilinear perspective; large nearby foreground |
| 84° | Wide environmental view with strong depth |
| 47° | Natural-looking perspective |
| 29° | Short telephoto portrait and moderate compression |
| 18° | Stronger telephoto compression and isolated detail |
| 8° | Distant, tightly framed super-telephoto view |

These are descriptive targets, not guaranteed model controls. For wide shots, describe physical proximity, foreground scale, and the visible environment. For telephoto shots, describe distance, compression, background softness, and any foreground occlusion.

Specify framing through body boundaries: head-and-shoulders, waist at the lower edge, or the full figure including shoes. Give different optical needs separate shots when one view cannot show everything clearly.

### 3.6 Camera

Describe:

```text
Starting position → viewing direction → framing → movement → limit → ending frame
```

- Give each shot one dominant camera idea.
- Separate movement through space from zooming. A dolly changes perspective; a zoom changes focal length from the same camera position.
- Describe handheld texture through weight, breathing, small corrections, and delayed inertia. Avoid asking for both perfectly stabilized footage and pronounced handheld movement.
- Bound travel: a short retreat, a limited arc, a particular height, or a clear endpoint.
- If the camera should remain still, say so. If it should keep moving, define a continuing direction rather than relying on a general style label.
- For a stationary-camera zoom, keep camera position fixed and describe only the lens change.

### 3.7 Lighting and color

- List the sources that actually illuminate the scene, with direction, softness, color, and relative strength.
- Separate foreground illumination from background practical lights.
- Describe exposure through readable shadows, restrained highlights, or a deliberate silhouette.
- Tie color to physical objects and light sources instead of applying an unexplained tint to the entire frame.
- Preserve natural skin and product colors unless the user requests a stylized treatment.
- If an unlit object should reflect the room, describe its dark reflective surface rather than emphasizing its ability to emit light.

### 3.8 Cast and groups

- State the exact number of important people and give each a unique reference or distinguishing feature.
- Establish who is present in the first frame and who enters later.
- Specify initial positions, event order, and final positions separately.
- Keep background people engaged in small independent actions rather than synchronized motion, unless synchronization is intentional.
- Preserve clothing, held props, and character identity across cuts.
- Do not assume a final arrangement also describes the start of the clip.

### 3.9 Dialogue, performance, and audio

- Assign each line to one speaker and keep its wording exact.
- Place dialogue with the action it accompanies. Avoid accidental repetitions in multiple sections.
- Base lip-sync timing on the actual audio when available; do not invent measurements.
- Keep voice identity consistent while varying intention, pace, breath, and emotional pressure.
- Describe the permitted soundtrack as a clear list of dialogue, ambience, and effects. Add “No music” when appropriate.
- Keep audio references separate from written dialogue so reference content is not mistaken for a line to repeat.

### 3.10 Physical action and objects

Describe contact points, support, weight, inertia, and the direction of force. Give fabric and hair a plausible delay after body movement. Establish where a prop starts, who holds it, and where it ends. For compound objects, describe the connected silhouette so parts do not become independent objects.

Use visible comparisons for size and spacing. A brief, readable action is preferable to a chain of movements that cannot fit the clip.

### 3.11 Timing and slow motion

- Choose either one continuous take or a specified sequence of shots.
- For multiple shots, make the cut count agree with the shot count.
- Use shot-boundary timing by default. Add precise within-shot timing only when a specific event, dialogue cue, or choreographed test needs it.
- State whether slow motion affects people, the camera, or both.
- Start with action already underway when the clip needs immediate energy.
- Preserve a moving ending when a freeze is not intended.

## 4. Troubleshooting guide

| Symptom | Likely cause | Targeted correction |
| --- | --- | --- |
| An unwanted object appears | Its name is repeated in prohibitions | Describe the desired visible state without naming it |
| A character duplicates | Roles or references are ambiguous | Specify one instance per character and a closed cast list |
| Supporting cast disappears | Presence is not established per shot | State their first-frame positions and continuing activity |
| Characters look into the lens | An off-screen target is vague | Define an eye-line relative to the frame and camera |
| The camera zooms instead of moving | “Pull back” is underspecified | State physical travel and a fixed focal length |
| The camera moves during a zoom | Lens and camera motion are conflated | Fix the camera position and describe focal-length change |
| A static shot appears | Static and motion instructions conflict | Remove the conflicting instruction and define one camera action |
| A motionless opening wastes time | The prompt describes preparation | Begin mid-action and mid-camera movement |
| A room changes between views | References or spatial roles conflict | Assign one geographic source and restate the new viewpoint |
| Product details drift | Product identity is weakly anchored | Bind the product reference and identify the critical details |
| An edit changes too much | The requested change is too broad | Narrow the edit and specify protected regions |
| A diagram becomes visible scenery | Diagram appearance dominates | Use faint outlines and define it as geometry-only guidance |
| Acting looks posed | Emotion is an adjective without a task | Give the character a goal, obstacle, and observable tactic |
| The prompt loses dialogue or action | Too many competing instructions | Remove repetition and prioritize the shot-level requirements |
| A difficult action repeatedly fails | The sequence is structurally too complex | Split it, simplify staging, or add a suitable reference |

## 5. Acting and character performance

### Five elements

1. **Event:** what has just happened or is happening now.
2. **Motive:** why this matters to the person.
3. **Goal:** what they want from the other person or situation.
4. **Obstacle:** what prevents them from getting it.
5. **Tactic:** the concrete behavior they use to pursue it.

Use active, playable directions. “She tries to make him stay by withholding the answer” gives more behavior than “she looks emotional.”

Listening matters as much as speaking. Describe how a character receives information before reacting. Let body tension, balance, breath, pauses, and eye-lines express the task. Avoid assigning several unrelated gestures to the same instant.

For FAST, use one compact sentence per important character. For PRO, use:

```text
EVENT:
MOTIVE:
GOAL:
OBSTACLE:
TACTIC:
VISIBLE BEHAVIOR:
```

For a reusable character profile, a concise paragraph can define posture, gesture scale, gaze, speech rhythm, and listening behavior. Adapt that profile to the scene rather than copying a fixed performance everywhere.

Keep eyes responsive to the task, with natural focus changes and appropriate blinking. Do not use a blanket instruction to keep eyes permanently open. When glasses or a mask hide the eyes, place readable performance in the mouth, jaw, head angle, hands, and timing.

## 6. Dramatic structure

For scenes that need a dramatic progression, define:

- A concrete objective.
- An obstacle that forces a choice.
- A tactic used to overcome it.
- A reversal that changes the situation.
- A change in what the viewer understands or feels about the character.

Connect beats causally. A collection of attractive actions is not automatically a scene. Keep this analysis outside the generation prompt unless a short statement helps the model stage observable behavior.

## 7. Blocking diagrams

Use a diagram when spatial ambiguity is causing failures or the user requests one.

- Use a plain background, faint grid, and thin, muted outlines.
- Give each important figure a distinct outline color and keep the geometry readable.
- Put the legend and character mapping in accompanying text; avoid making labels part of the generated scene.
- Define the diagram as a guide to position, orientation, scale, and movement only.
- Use a separate image reference for appearance when needed.
- Distinguish camera paths from character paths. Identify start, route, trigger, and end.
- If diagram marks leak into the output, reduce their visual prominence or omit the diagram from the affected generation.

## 8. Image generation and editing

### Choose the task and tool

- **Characters:** use a model and reference workflow suited to identity consistency.
- **Locations:** use a model suited to cinematic environments and spatial detail.
- **Products:** prioritize shape, materials, construction, and accurate reference matching.
- **Edits:** use the original image as the input and make the smallest necessary change.

Use the actual capabilities available in Higgsfield. Do not assume a particular model version, reference syntax, negative-prompt field, or parameter exists without checking the active tool.

### Writing rules

- Write natural prose instead of a pile of keywords.
- Prefer specific lighting and materials to vague mood adjectives.
- Keep prompts concise; roughly 80–150 words can be enough for a straightforward image.
- Derive the palette from the user's brief and references. Do not invent a new visual direction over approved material.
- For text that should appear inside the image, supply exact wording in quotation marks and specify its placement and typography.
- Describe visual style through observable techniques rather than names of protected properties or individuals.
- Use the platform's identity references when available. Prose alone does not guarantee identity consistency.

### Character sheet template

```text
Create two studio photographs of the same original person in one image: a full-body view on the left and a head-and-shoulders portrait on the right. Use the attached portrait for identity. Preserve the face, hair, age, skin tone, and proportions across both panels.

Dress the person in [outfit description]. Use a seamless neutral gray background, soft even studio light, natural skin texture, and realistic fabric. Keep the entire head and both shoes visible in the full-body panel. Maintain the same outfit and identity in both views.
```

For a three-view sheet, request full-body front, full-body back, and a close portrait. Describe the panels in prose and keep each view consistent.

### Location template

```text
Create a photoreal cinematic location image of [place]. The camera is [position and height], looking [direction and angle].

In the foreground: [objects and spatial relationships]. At the center: [main structure]. In the background: [landmarks and depth]. On the left: [details]. On the right: [details].

Use [lens behavior], [lighting sources], and [materials]. Keep the space [occupied or empty as required]. Place the main colors in physical surfaces and light sources, with a neutral photographic foundation.
```

### Targeted edit template

```text
Edit the attached image.

TARGET: [the object or region to edit].
CHANGE: [one specific change].
PRESERVE EXACTLY: [identity, clothing, pose, framing, camera position, lighting, shadows, and all unaffected details].
INTEGRATION: Match the original perspective, texture, exposure, reflections, focus, and grain.
```

When removing an object, describe what fills the newly exposed area. If the image requires an entirely different scene or viewpoint, distinguish regeneration from a small edit.

## 9. Complete PRO audit

Check only what applies to the task:

- **Structure:** shot count, cuts, timing, starting state, and ending state agree.
- **References:** identifiers exist, inputs are attached, each reference has a role, and unused references are removed.
- **World:** location, cast, objects, illumination, and accumulated changes are internally consistent.
- **Space:** camera side, eye-lines, positions, movement limits, and screen direction are physically compatible.
- **Optics:** lens behavior, distance, framing, and depth of field support the scene.
- **Text:** no stale context, contradictory instructions, misleading trigger words, or unnecessary repeated motifs remain.
- **Performance:** each important character has a readable task and appropriate listening behavior.
- **Physics:** weight, contact, support, object scale, and persistence are clear.
- **Audio:** exact dialogue, speaker attribution, timing, ambience, effects, and music requirements agree.
- **Delivery:** the prompt is in English, copyable, self-contained, and free of private or unrelated material.

Fix failures before delivery. Keep the audit itself out of the generation prompt.

## 10. Deliverables and versions

- Provide the finished English prompt in a copyable text block or Markdown file.
- If multiple prompts belong together, group them under short English labels in one document.
- Keep assumptions and revision notes outside the prompt.
- Use versioned filenames for subsequent revisions and retain earlier versions.
- If an interactive viewer is available, its buttons and labels must also be English. A viewer is optional; never make delivery depend on missing scripts or templates.
- Preserve spacing around reference identifiers and use the syntax the actual platform expects.
- Do not claim a prompt has generated a successful result until that result has been observed.

## 11. Reusable learning record

Keep confirmed lessons in a separate, optional record using this format:

```text
Symptom:
Likely mechanism:
Change made:
Observed result:
Model and relevant settings:
Limits or remaining uncertainty:
```

Use generic descriptions. Exclude client identities, private project history, and unrelated source material from public exports.

## 12. Complex scene organization

For a longer project, separate reusable definitions from generation-specific selections.

- **Definitions:** character identity, wardrobe, location geography, and approved visual rules.
- **Selections:** the inputs, cast, shot order, timing, and settings for this particular generation.

Keep a reference table recording what each input controls, what it does not control, and known conflicts. Use a simple hierarchy such as project → scene → generation → take when it helps. Do not require a particular local folder layout.

User-approved project requirements take precedence over generic defaults. Resolve contradictions once and keep the decision consistent in later revisions.

Use a short test only when it serves an unresolved production question and the user has authorized generation. Prompt editing alone does not require running tests.

## 13. Dialogue and interior scenes

- Describe the initial arrangement separately from the final arrangement.
- Anchor the camera to a wall, doorway, or other clear room feature.
- State the order of entrances and exits so later participants do not appear early.
- Give each important person a distinguishing reference and a readable role.
- Keep eye-lines relative to the camera when the target is off-screen.
- Describe a zoom as a lens event when the camera remains stationary.
- When a reference's lighting conflicts with the intended shot, revise the reference or limit its role rather than piling contradictory instructions into the prompt.
- Place the genre and photographic approach early, using descriptive techniques instead of names of directors, actors, franchises, or productions.
- Keep the soundtrack and dialogue inventory explicit.

## 14. Optional video character sheet

Use this format when a production needs movement and vocal behavior in addition to a static appearance reference. Use an original character and only the reference material the user intends to use.

### Layout

- One landscape frame with two simultaneous panels.
- Left panel: approximately 48% of the width, full body.
- Right panel: approximately 52%, a close portrait.
- The same person, clothing, and neutral white studio environment in both panels.
- A clear vertical division, stable cameras, consistent exposure, and realistic skin and fabric.

### Example 15-second movement plan

- **0–5 seconds:** the left figure walks forward in the character's characteristic gait. Any prop follows believable weight and contact.
- **5–6 seconds:** the figure stops in a clear pose.
- **6–12 seconds:** the figure rotates through one full turn in place while the camera and background remain still. Make clear that the body turns; no visible platform is required.
- **12–15 seconds:** hold the final pose while preserving natural breathing and small physical movement.

Keep the full figure, including shoes, visible. The right portrait stays at a constant scale, with room above the head and a small range of head movement. Props and full-body gestures belong in the left panel.

### Voice and facial performance

If voice is needed, assign all speech to the portrait panel. Keep the full-body panel silent. Describe the requested voice through timbre, accent, pace, articulation, and intention. Use a voice reference only for the qualities it is intended to control.

Use short original lines to demonstrate the required range: conversational speech, a quiet question, a stronger statement, and a controlled whisper. Match the range to the character rather than forcing every voice into the same performance. Exact within-shot timing is appropriate for this structured test.

Specify a dry, close voice recording when required, with silence between lines and no music or unrelated effects. Keep identity, outfit, panel proportions, lighting, and camera position consistent for the entire clip.
