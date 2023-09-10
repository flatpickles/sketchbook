Sketchbook -> Docs -> Core Concepts

# Sketchbook Core Concepts

todo: project anatomy, etc (reference design-doc.md)

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
-   canvas size
-   mouse position & clicks
-   instance variables (#ivar)

Note that it's running in the browser! So we generally have browser features (e.g. adding event listeners to this.canvas, for mouse movement or keypresses // todo: test this and include in demo projects)
