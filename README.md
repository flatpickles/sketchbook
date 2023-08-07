(readme could be the design-doc eventually, for now this is freeform)

Params WIP:

-   file inputs?
-   styles:
    -   number: separate slider & field, or same?
    -   numeric array: compact is two per line
    -   string: color options
    -   MIDI map: for numeric & boolean params,
-   Array params: use a grid layout for longform (full width) vs compact (half width / side by side) display styles
-   Component tests
    -   Sections
    -   Hover text
-   Param UI
    -   Option to reset to default/preset value
    -   Lock parameter value (?)
    -   Numeric params
        -   Option to randomize within range
        -   Type in value (when slider is visible?)

Todo / WIP notes:

-   Clicking a group or project list item should scroll it fully into view.
-   Read through old notes and absorb in design doc
-   Optional explicit route name (vs. just using the filename/key)
-   Better error messaging for config file parsing throughout
-   "animated" mode for sketches: call update with animation frame request
-   Show a project's groups on right panel
-   Make old style possible via theme config (or something like it)
-   When changing param defaults (assigned in file) what happens? Especially with local storage... param default vals will get confusing...

MVP stretch goals:

-   Link previews
-   Webcam & microphone inputs
-   API:
    -   Project list (names, dates, metadata)
    -   Link preview images
-   Easy "export snapshot" (photo) option
-   Key commands
    -   Hide/show panels
    -   Project switching
    -   Min/max range slider
    -   Undo/redo for parameter changes

Long-term goals:

-   Midi control:
    -   Included in global configuration
    -   Enable project switching (fast switching)
-   Dark mode support
-   Canvas zooming & panning
-   Cloud preset storage
    -   Share presets with _just_ a link
-   LFOs and/or other sorts of param sidechaining
-   Render queue (preempt & cancel long-running renders)
-   Fast switching:
    -   Optional (global config)
    -   Multiple canvases already instantiated
    -   Optional transition effects:
        -   Simple crossfade
        -   Alpha overlay for custom cutouts, wipes, etc
        -   Maybe a base Sketch class function called when transition begins?

Philosophy:

-   Start a project as quickly as possible: idea to pixels without losing a train of thought. Creative workflow optimized from the moment of first concept.
-   Create portable work. Easily carry your projects into another context (client work, etc) with minimal transportation cost (redesigning, rebuilding).
