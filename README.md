(readme could be the design-doc eventually, for now this is freeform)

Params WIP:

-   Number fields: validate min/max/step
-   File input
-   Param UI (label double click options)
    -   Option to reset to default/preset value
    -   Option to randomize within range

Next up:

-   Test coverage:
    -   Project detail panel (component tests)
-   Saved state
    -   Param values
    -   Selected project (for root navigation redirect)
    -   Selected group
    -   Settings values
    -   Panel states
-   Show & hide panels in desktop layout
    -   Show/hide animation
    -   Show buttons from hidden state
-   Presets
    -   Model work
    -   Selection UI & plumbing
    -   Options: creation, export, import, etc
-   Settings panel & values
    -   Show & hide from button
    -   Param double click behavior
    -   Experimental mode
    -   Auto-hide panels w/ mouse hover to show them (desktop only)
    -   Double click to hide/show panels
    -   Dark mode - TBD
    -   Perf data - FPS meter (or maybe put this elsewhere)
-   config.json
    -   Defaults for all settings
-   Base project subclasses:
    -   Canvas Sketch
    -   P5
    -   REGL
-   Mobile layout & behavior
-   Info display / link from bottom left button - TBD
-   Link previews
-   Theming / styling:
    -   Expose only high-level adjustments in theme.scss; move finer details elsewhere (closer to components probably)
    -   Enable SBv1 style (or something mono/sharp)
    -   Enable dark mode configuration, somehow

Miscellaneous / notes:

-   Read through old notes and absorb in design doc
-   Read through design doc
-   Clicking a group or project list item should scroll it fully into view.
-   Optional explicit route name (vs. just using the filename/key)
-   Better error messaging for config file parsing throughout
-   "animated" mode for sketches: call update with animation frame request
-   Show a project's groups on right panel
-   Make old style possible via theme config (or something like it)
-   When changing param defaults (assigned in file) what happens? Especially with local storage... param default vals will get confusing...

Ongoing:

-   Accessibility
    -   Param label associations
    -   Semantic markup
-   Style & theme cleanup
-   Cross-browser testing
    -   Firefox text baselines are too high? Probably the baked helvetica isn't normalized

Eventual work for launch:

-   Update design doc, and/or adapt into other documentation:
    -   Getting started
    -   Full docs, etc
-   Theme examples
-   Project examples
-   Example deployment with a few demo projects (not just Longitude Studio)
-   Port SBv1 into projects.longitude.studio
-   Pick an OSS license and document accordingly
-   Record demo videos and create other marketing assets - TBD

MVP stretch goals:

-   Webcam & microphone inputs
-   MIDI inputs
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
-   Password protected projects

Philosophy:

-   Start a project as quickly as possible: idea to pixels without losing a train of thought. Creative workflow optimized from the moment of first concept.
-   Create something that's inviting for others to play with. Comprehensive and intuitive presentation out of the box, with options to enable even more functionality.
-   Create portable work. Easily carry your projects into another context (client work, etc) with minimal transportation cost (redesigning, rebuilding).
