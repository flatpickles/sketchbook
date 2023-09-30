# Notes for Beta Users

Thank you for beta testing Sketchbook!! This page will be retired when I launch version 1.0, but in the meantime, here are a few notes for your consideration. Please feel free to [file GitHub issues](https://github.com/flatpickles/sketchbook/issues/new) about anything and everything, or contact me with any questions, bug reports, feature requests, etc!

I'm currently working on hitting a [0.1 milestone](https://github.com/flatpickles/sketchbook/milestone/1) (targeted for 9/29/23), after which point I'll be _most_ ready for feedback, but Sketchbook should be ready to look at in the meantime if you can tolerate a WIP vibe.

<3 Matt

### Questions

If it's helpful to guide your thinking about Sketchbook with a few questions, here's some stuff I'm curious about. I'd love to talk with you about these in realtime once you've had a little time using Sketchbook, but any written notes are also extremely welcome!

**General**

-   Did you expect Sketchbook to do anything that it doesn't do?
-   Would you be interested in using something like Sketchbook even if it weren't being built by a friend?
-   Do you have any feature requests?
-   Does naming make sense throughout Sketchbook? Renaming properties, methods, and concepts is easy, but now's the time!

**Documentation**

-   Am I describing what Sketchbook _**is**_ and _**does**_ well enough in the docs I have so far?
-   How intuitive is the ordering & breakdown of concepts in the documentation as a whole? Any suggestions for reorganization?
-   Does anything feel too detailed, or not detailed enough?
-   Does anything need documentation that isn't currently covered?
-   Would you prefer TypeScript examples or JavaScript examples? Or both?

**Configuration**

-   Are there any aesthetic aspects of Sketchbook's UI that you want to change, but that aren't currently covered in `theme.scss`? (E.g. parameter styling)
-   Do you want to be able to change project & param config defaults? In other words, do you want the defaults for the properties noted in the [Project](project-config.md) and [Parameter](param-config.md) Configuration pages to be something you set yourself in a config file?

**Workflow**

-   Does Sketchbook facilitate a stable & comfortable workflow for you? Or is it getting in your way?
-   Do you like the fork, update, and publish model for using Sketchbook? Unconventional, but effective?
-   Should the `main` branch have demo projects, so you have something to look at as soon as you create your fork? Currently demo projects exist on the `demo` branch to keep things clean & simple, but there's a tradeoff there.
-   Do you need any other parameter types or styles?
-   Would you rather `time` params provided by Sketchbook arrive in seconds or milliseconds? (My intuition is milliseconds, but REGL uses seconds...)

**Project Subtypes**

-   For the existing P5 support, do you like the design? What else might you need?
-   For the existing shader art support, same questions! (this is an [MVP](https://github.com/flatpickles/sketchbook/issues/146), but I'd like to build it out further)
