(readme could be the design-doc eventually, for now this is freeform)

Todo / WIP notes:

-   Optional explicit route name (vs. just using the filename/key)
-   Color parameters! Three-element numeric array...
    -   Do this with a different "style" – different default styles for different array sizes
-   Code coverage...
-   Better error messaging for config file parsing throughout
-   "trigger" mode for parameter updates - wait until button click
-   "animated" mode for sketches: call update with request a
-   Show a project's groups on right panel

-   Make old style possible via parameterization (or something like it)
-   Build basic panels & UI for architecture validation
-   Validate canvas-sketch usage with current spec
-   Read through old notes and absorb in design doc

-   When changing param defaults (assigned in file) what happens? Especially with local storage... param default vals will get confusing...

-   Param UI
    -   Option to reset to default/preset value
    -   Lock parameter value (?)
    -   Numeric params
        -   Option to randomize within range
        -   Type in value (when slider is visible?)

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

-   Canvas zooming & panning
-   Cloud preset storage
    -   Share presets with _just_ a link
-   LFOs and/or other sorts of param sidechaining
-   Midi control:
    -   Included in global configuration
    -   Enable project switching (fast switching)
-   Render queue (preempt & cancel long-running renders)
-   Fast switching:
    -   Optional (global config)
    -   Multiple canvases already instantiated
    -   Optional transition effects:
        -   Simple crossfade
        -   Alpha overlay for custom cutouts, wipes, etc
        -   Maybe a base Sketch class function called when transition begins?
