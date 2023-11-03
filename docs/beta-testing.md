# Notes for Beta Users

Thank you for beta testing Sketchbook!! This page will be retired when I launch version 1.0, but in the meantime, here are a few notes for your consideration. Please feel free to [file GitHub issues](https://github.com/flatpickles/sketchbook/issues/new) about anything and everything, or contact me with any questions, bug reports, feature requests, etc!

<3 Matt

### Questions

If it's helpful to guide your thinking about Sketchbook with a few questions, here's some stuff I'm curious about. I'd love to talk with you about these in realtime once you've had a little time using Sketchbook, but any written notes are also extremely welcome!

**General**

-   Did you expect Sketchbook to do anything that it doesn't do?
-   Would you be interested in using something like Sketchbook even if it weren't being built by a friend?
-   Does naming make sense throughout Sketchbook? Renaming properties, methods, and concepts is easy – but now's the time!

**Feature Plans**

-   Do you have any feature requests?
-   [**CLI Tool:**](https://github.com/flatpickles/sketchbook/issues/157) My intuition is that Sketchbook's current format – a web app that you build within – is mildly unappealing. I'm considering reworking Sketchbook as a `skbk` CLI tool to `run` & `deploy` your collection of projects directly, letting you create an equivalent to the current `src/art`, but without the surrounding app context. Would you prefer this?
-   [**Mobile Mode™**](https://github.com/flatpickles/sketchbook/issues/12): Sketchbook doesn't yet work very well on narrow screens. My plan is to build a scaled down "Mobile Mode" with a much more limited UI. What do you need and not need in a mobile context? (e.g. I'm considering not allowing parameter changes at all, only preset changes)
-   If there's anything else on [the roadmap](https://github.com/users/flatpickles/projects/2/views/1) that would be particularly valuable to you, let me know and I'll prioritize it!

**Documentation**

-   Am I describing what Sketchbook _**is**_ and _**does**_ well enough in the docs I have so far?
-   Was the "Quick Start Guide" effective? Any suggestions for a better first intro?
-   How intuitive is the ordering & breakdown of concepts in the documentation as a whole? Any suggestions for reorganization?

**Configuration**

-   Are there any aesthetic aspects of Sketchbook's UI that you want to change, but that aren't currently covered in `theme.scss`? (Likely parameter styling; this is WIP as of v0.1)
-   Do you want to be able to change project & param config defaults? In other words, do you want the defaults for the properties noted in the [Project](project-config.md) and [Parameter](param-config.md) Configuration pages to be something you set yourself in a config file?

**Workflow**

-   Does Sketchbook facilitate a stable & comfortable workflow for you? Or is it getting in your way?
-   Do you need any other parameter types or styles?
-   Currently the `main` branch is a fully blank canvas, and all demo content is contained in the `demo` branch. How do you feel about that?

**Project Subtypes**

-   For the existing P5 support, do you like the design? What else might you need?
-   For the existing shader art support, same questions! (this is an [MVP](https://github.com/flatpickles/sketchbook/issues/146), but I'd like to build it out further)
