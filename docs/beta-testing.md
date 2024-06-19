# Notes for Beta Users

Thank you for checking out Sketchbook! Sketchbook is still in beta, with more feature work planned, as well as a continued focus on performance and stability. With that said, backwards compatibility is a high priority for any new changes. Hopefully Sketchbook is already a stable and fruitful environment for your creative coding work.

Any feedback is extremely helpful – please reach out with feature requests, bug reports, ideas, or anything else. You can get in touch by [filing an issue](https://github.com/flatpickles/sketchbook/issues/new) on GitHub, or emailing [matt@skbk.cc](mailto:matt@skbk.cc).

## Roadmap

The full scope of anticipated future development for Sketchbook is tracked and roughly prioritized in [this GitHub project](https://github.com/users/flatpickles/projects/2/views/1). Please peruse the project at your leisure, but here are a few notable goals worth calling out:

-   [**CLI Tool**](https://github.com/flatpickles/sketchbook/issues/157): Sketchbook's current format as a web app that you build within feels a little clunky. Its ideal form is a `skbk` CLI tool to `run` & `deploy` your collection of projects directly, letting you create an equivalent to the current `src/art` directory, but without the surrounding app context.
-   [**Improved Local Asset Import**](https://github.com/flatpickles/sketchbook/issues/234): The current model for asset parameters is unintuitive and challenging to use well. This should be redesigned.
-   [**Easy Asset Export**](https://github.com/flatpickles/sketchbook/issues/85): Currently you can save an image of a project by right-clicking the canvas (as always), but Sketchbook should offer photo & video export support directly.
-   [**Expanded & Improved Style System**](https://github.com/flatpickles/sketchbook/issues/123): The current [styling system](theme.md) in Sketchbook could use some work, both to expand the current implementation, and evaluate better approaches.
-   [**Shader Art Improvements**](https://github.com/flatpickles/sketchbook/issues/146): The current `FragShaderProject` implementation is reasonably well equipped, but could benefit from some additional improvements.
-   [**Parameter Value Effects**](https://github.com/flatpickles/sketchbook/issues/4): Enable parameter values to influence the visibility of other parameters, to support dynamic sections, project modes, etc.
-   [**Page Loading Improvements**](https://github.com/flatpickles/sketchbook/issues/213): Both improved loading performance and a loading UI are worth looking into, for both initial page load and project switching.
-   [**Expanded Mobile Mode**](https://github.com/flatpickles/sketchbook/issues/235): Mobile Mode is currently implemented as a solid MVP, but it'd be great to show more info (and maybe enable more features) in an overlay view.
-   **Live [Webcam](https://github.com/flatpickles/sketchbook/issues/60) & [Mic](https://github.com/flatpickles/sketchbook/issues/61) Input**: Enable live video & audio input to Sketchbook projects, for live performance, audio-reactive graphics, filtered photo capture, etc.
-   **Live Performance Features**: With live AV inputs (above), [MIDI mapping](https://github.com/flatpickles/sketchbook/issues/62), [asset pools](https://github.com/flatpickles/sketchbook/issues/170), [fast switching](https://github.com/flatpickles/sketchbook/issues/73), and [param sidechaining](https://github.com/flatpickles/sketchbook/issues/72), Sketchbook could become an effective AV performance tool.

## Questions

If you've tried using Sketchbook and would be interested in sharing your thoughts in response to any of the following questions, your input would be much appreciated!

**General**

-   Did you expect Sketchbook to do anything that it doesn't do?
-   Do you expect to continue using Sketchbook after your first project or two? Why or why not?
-   Does naming make sense throughout Sketchbook? (Properties, methods, etc.)
-   Do you have any feature requests?

**Documentation**

-   Do the current docs describe what Sketchbook _**is**_ and _**does**_ well enough?
-   Was the "Quick Start Guide" effective? Any suggestions for a better first intro?
-   How intuitive is the ordering & breakdown of concepts in the documentation as a whole? Any suggestions for reorganization?

**Configuration**

-   Do you need any other parameter types or styles?
-   Are there any aesthetic aspects of Sketchbook's UI that you want to change, but that aren't currently covered in `theme.scss`? (Likely parameter styling; this is WIP as of v0.2)
-   Do you want to be able to change project & param config defaults? In other words, do you want the defaults for the properties noted in the [Project](project-config.md) and [Parameter](param-config.md) Configuration pages to be something you set yourself in a config file?

**Project Subtypes**

-   For P5 support: do you like the design? What else might you need?
-   For shader art support: do you like the design? What else might you need?
