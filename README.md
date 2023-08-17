(readme could be the design-doc eventually, for now this is freeform)

# Params WIP:

### Value Effects

Available for number, string, boolean. For a boolean, there's no value key; it's just a map with shows/hides/enables/disables keys.

```
"valueEffects": {
    "0.5": {
        "comparator": "lte",
        "shows": [],
        "hides": ["key1", "key2"],
        "enables": [],
        "disables": ["key3", "key4"]
    }
}
```

Use cases: modes (w/ options), sections, functionality only defined with some values.

### Other params stuff

-   Double check "key" values
-   Keep name as key name when other param settings are defined in json, but name is not
-   Number fields: validate min/max/step
-   Param UI (label double click options)
    -   Option to reset to default/preset value
    -   Option to randomize within range
-   Disabled as config option?
-   Documentation!!!

# Next up:

-   Test coverage:
    -   Project detail panel (component tests)
-   Project sorting: put projects with no date at the top when sorting chronologically
-   Group sorting options...
-   Section sorting options...
-   Saved state
    -   Param values (what to do with file inputs?)
    -   Selected project (for root navigation redirect)
    -   Selected group in left panel
    -   Settings values
    -   Panel states
    -   Changing default values (values set in .ts file)
        -   Track these before updating to saved state
        -   Save these so we can see when the user updated default, to use this instead of saved state (with no preset selected)
        -   Use these with double-click to reset to default (when no preset is selected)
-   Show & hide panels in desktop layout
    -   Show/hide animation
    -   Show buttons from hidden state
-   Presets
    -   Disable preset picker & controls per-project
    -   Model work
    -   Selection UI & plumbing
    -   Options: creation, export, import, etc
-   Settings panel & values
    -   Show & hide from button
    -   Param double click behavior
    -   Experimental mode
    -   Auto-hide panels w/ mouse hover to show them (desktop only)
    -   Double click to hide/show panels
    -   Canvas size/available space (default fullscreen or between panels)
    -   Canvas scale (default 2x / retina)
    -   Dark mode - TBD
    -   Perf data - FPS meter (or maybe put this elsewhere)
-   Base project subclasses:
    -   Canvas Sketch
    -   P5
    -   REGL
-   Mobile layout & behavior
-   Info display / link from bottom left button - TBD
-   No Signal display
    -   Display when no projects are loaded
    -   Also include error text; catch project errors
    -   Also display if rendering passes a time limit (e.g. infinite loop in project)
-   Link previews
-   Theming / styling:
    -   Expose only high-level adjustments in theme.scss; move finer details elsewhere (closer to components probably)
    -   Enable SBv1 style (or something mono/sharp)
    -   Enable dark mode configuration, somehow
    -   Enable constrained viewport, i.e. using _only_ the space between panels (no overlaid panels, except maybe on mobile)
-   Configuration in config.json
    -   Defaults for all settings
    -   (maybe this is just user-visible stuff? see below)
-   Configurations for devs
    -   Defaults applied to all projects: live updates, show presets, auto-style params based on names (color style for bgColor, etc)
    -   Maybe put these somewhere other than config.json?

# Miscellaneous / notes:

-   SSR: currently projects are initialized, but init() and update() aren't called.
    -   Either projects shouldn't be initialized (so we don't have to do `browser` checks within projects, e.g. to load bundled images), or init() and update() should be called once each, to draw canvas contents.
    -   Check if canvas drawing is possible with SSR; only benefit there really would be link previews, and these could just be static images if needed.
-   Parameter sorting: use config maybe? At least document
-   FileLoading vs FileParamLoader naming is confusing
-   Increase hit area for sliders
-   Default styles and modes, depending on parameter property names (e.g. "bgColor" would use color style by default)
-   Update function: take an optional "previousValues" parameter, containing previous values of exposed params before the latest update (so we can see what specifically changed). { changedKey: key, previousValues: {} }
-   Clicking a group or project list item should scroll it fully into view.
-   Optional explicit route name (vs. just using the filename/key)
-   Better error messaging for config file parsing throughout
-   "animated" mode for sketches: call update with animation frame request
-   Show a project's groups on right panel?
-   Make old style possible via theme config (or something like it)
-   When changing param defaults (assigned in file) what happens? Especially with local storage... param default vals will get confusing...
-   What happens if someone sets a parameterized property from within the project?
    -   Ideally this change is represented in params UI; e.g. load a text file into a multi-line text param
    -   Maybe they sync on project update?

# Ongoing:

-   Parse notes above into actual action items
-   Read through old notes and absorb in design doc
-   Read through design doc
-   Accessibility
    -   Param label associations (name // id // etc)
    -   Semantic markup
-   Style & theme cleanup
-   Cross-browser testing
    -   Firefox text baselines are too high? Probably the baked helvetica isn't normalized
    -   Firefox & Safari outline some fields - awkward
    -   Custom checkmark positioning seems to differ
    -   IE / Edge testing?

# Eventual work for launch:

-   Update design doc, and/or adapt into other documentation:
    -   Getting started
    -   Full docs, etc
-   Theme examples
-   Project examples
-   Example deployment with a few demo projects (not just Longitude Studio)
-   Port SBv1 into projects.longitude.studio
-   Pick an OSS license and document accordingly
-   Record demo videos and create other marketing assets - TBD

# MVP stretch goals:

-   Variants:
    -   Duplicate a folder within art and create another "variant" of an existing piece.
    -   Variants are displayed under the same title in the project list, but once you click in you can see that there are several versions.
    -   Maybe it's like tapping into a section in an iOS list view.
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

# Long-term goals:

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

# Philosophy:

-   Prototype & publish in the same place:
    -   Start a project as quickly as possible: idea to pixels without losing a train of thought. Creative workflow optimized from the moment of first concept.
    -   Create something that's inviting for others to play with. Comprehensive and intuitive presentation out of the box, with options to enable even more functionality.
-   Light-weight but heavy-duty.
    -   Opt-in customizablility. Sketchbook presents options for deep flexibility, but you can start any project without even creating a config file, and add complexity as you need it.
    -   Create portable work. Easily carry your projects into another context (client work, etc) with minimal transportation cost (redesigning, rebuilding).

# Questions for beta testers:

-   Casing in JSON fields, e.g. "liveUpdates", "dataURL" etc
-   Documentation:
    -   Formatting: website vs. markdown files on GitHub

# Utils:

-   Separate repo with things that I use in my art projects
-   Sometimes just copy, credit, and consolidate other open source work
-   Shader tools:
    -   Polar transforms
    -   Color transforms
    -   Maybe don't include because of glslify?
-   Canvas tools:
    -   approximate circle
    -   maybe extend D3 paths or something like that?

# Documentation:

-   Project subclasses:
    -   Using constructor:
        -   this.canvas will not be defined
    -   SSR notes: browser features may not be available
        -   Example: Image()
        -   init() and update() not called (currently as of 8/13)
    -   Importing bundled images: show example
