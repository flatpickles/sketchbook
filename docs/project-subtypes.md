# Project Subtypes

Though anything you can do with Sketchbook can be accomplished by subclassing the `Project` class, Sketchbook also offers easier workflows for a few more specific types of projects.

## `P5Project`

`P5Project` is a relatively lightweight `Project` subclass that makes it easy to use [p5.js](https://p5js.org/) within Sketchbook. When you create a Sketchbook project that subclasses `P5Project`, a p5.js will be spun up in ["instance mode"](https://p5js.org/reference/#/p5/p5), and you'll be able to use this p5 instance for rendering.

The `P5Project` class defines a few methods that match the standard functions used in a p5.js context, so you can build p5 projects in a familiar way. When using p5.js in instance mode, all library functions must be called on a p5 instance; `P5Project` offers a `p5` instance variable, and the same reference is also passed as a parameter to p5-related methods.

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

You can find the `P5Project` superclass [on GitHub](https://github.com/flatpickles/sketchbook/blob/main/src/lib/base/Project/P5Project.ts), or in your code editor. You can also check out the "P5 Demo" project [on GitHub](https://github.com/flatpickles/sketchbook/tree/demo/src/art/P5Demo), and on the Sketchbook [demo deployment](https://demo.skbk.cc/P5Demo).

## Shader Art

Sketchbook offers direct support for fragment shader art, without requiring any GL boilerplate or setup code. You can create a `.frag` file within a `src/art` subdirectory of the same name, and Sketchbook will draw this fragment shader onto a rectangle upon each animation frame. You do not need to create a `Project` subclass directly – Sketchbook creates one for you internally.

When configuring your fragment shaders, Sketchbook will define normalized (0.0-1.0) rendering coordinates as `varying vec2 uv`. Sketchbook also defines a few utility uniforms for your fragment shader, including:

-   **`time`**: runtime since project instantiation, in seconds (`float`)
-   **`renderSize`**: viewport size (width, height), in pixels (`vec2`)

You can create additional uniforms within your `.frag` file, which Sketchbook will recognize and display as adjustable parameters. Reasonable defaults are assigned, and your uniform values will be updated with any changes in the Sketchbook UI. `float`, `int`, `bool`, `vec2`, `vec3`, and `vec4` uniform parameters are supported.

A basic fragment shader implementation in Sketchbook might look like this:

```glsl
precision mediump float;
varying vec2 uv;
uniform float time;

void main() {
    vec3 bgColor = vec3(uv.x, uv.y, sin(time) / 2.0 + 0.5);
    gl_FragColor = vec4(bgColor, 1.0);
}
```

You can configure your fragment shader projects and parameters as you would for other Sketchbook projects, i.e. by creating a `config.json` file alongside your fragment shader within its containing project directory. Your uniform names will be used as parameter keys for configuration.

Sketchbook also comes with built-in [glslify](https://github.com/glslify/glslify) support: any GLSL shader files you define will be automatically be compiled with glslify, using whichever glslify modules you've added via `npm install`. This applies for fragment shader projects as discussed above, and also for any GLSL files that you import in a custom GL project.

To see how Sketchbook's fragment shader project support works under the hood, see the `FragShaderProject` class [on GitHub](https://github.com/flatpickles/sketchbook/blob/main/src/lib/base/Project/FragShaderProject.ts), or in your code editor. You can also check out the "Shader Art" demo project [on GitHub](https://github.com/flatpickles/sketchbook/tree/demo/src/art/ShaderArt), and on the Sketchbook [demo deployment](https://demo.skbk.cc/ShaderArt).
