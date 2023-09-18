Sketchbook -> Docs -> Core Concepts

# Sketchbook Core Concepts

todo: project anatomy, etc (reference design-doc.md)

-   Project subclasses:
    -   Using constructor:
        -   this.canvas will not be defined
    -   SSR notes: browser features may not be available
        -   Example: Image()
        -   init() and update() not called (currently as of 8/13)
    -   Importing bundled images: show example

# The Project Class

## Properties

Setting any of these properties directly after a project is initialized is unsupported.

### canvas

### container

### canvasType

## Class Methods

### init

### update

### paramUpdated

### resized

### destroy

# config.json

Param config & project config options (JSON fields) - maybe in a different file?

# Common necessities:

-   time (in projects)
-   canvas size // resizing the canvas
    -   max at 100%
    -   need to set style size to change the way it's presented (but that's cool)
    -   internal canvas size will sync to style size, and will apply pixelRatio
-   mouse position & clicks
-   instance variables (#ivar)

Note that it's running in the browser! So we generally have browser features (e.g. adding event listeners to this.canvas, for mouse movement or keypresses // todo: test this and include in demo projects)
