Sketchbook -> Docs -> Core Concepts

# Sketchbook Core Concepts

todo: project anatomy, etc (reference design-doc.md)

# The Project Class

## Properties

### canvas

### container

### canvasType

## Class Methods

### init

### update

... when the `renderLoop` config setting false, update will only be called after init, after parameters are updated, and after canvas size changes.

### destroy

# config.json

Param config & project config options (JSON fields) - maybe in a different file?

# Common necessities:

-   time (in projects)
-   canvas size
-   mouse position & clicks
-   instance variables (#ivar)

Note that it's running in the browser! So we generally have browser features (e.g. adding event listeners to this.canvas, for mouse movement or keypresses // todo: test this and include in demo projects)
