# Project Subtypes

Though anything you can do with Sketchbook can be accomplished by subclassing the `Project` class, Sketchbook also offers easier workflows for a few more specific types of projects.

## `P5Project`

`P5Project` is a relatively lightweight `Project` subclass that makes it easy to use [p5.js](https://p5js.org/) within Sketchbook. When you create a Sketchbook project that subclasses `P5Project`, a p5 instance will be spun up in ["instance mode"](https://p5js.org/reference/#/p5/p5), and you'll be able to use this p5 instance for rendering.

The `P5Project` class defines a few methods matching the p5 lifecycle, so you can build p5 projects in a familiar way. When using p5.js in instance mode, all library functions must be called on a p5 instance; `P5Project` offers a `p5` instance variable, and the same reference is also passed as a parameter to p5-related methods.

A basic `P5Project` subclass implementation might look like this:

```ts
import P5Project from '$lib/base/Project/P5Project';
import type P5 from 'p5';

export default class P5Demo extends P5Project {
    rectSize = 0.5; // "rectSize" is adjustable in the Sketchbook UI

    draw(p5: P5) {
        p5.background(100);
        p5.rect(0, 0, this.rectSize * p5.width, this.rectSize * p5.height);
    }
}
```

You can check out the `P5Project` superclass [on GitHub](https://github.com/flatpickles/sketchbook/blob/main/src/lib/base/Project/P5Project.ts), or in your code editor.

## Shader Art
