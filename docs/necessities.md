# Common Necessities

In the tradition of a "Frequently Asked Questions" (FAQ) document, "Common Necessities" discusses a variety of scenarios you may encounter while working with Sketchbook.

## Asset file imports

Thanks to Vite's [static asset handling](https://vitejs.dev/guide/assets.html), using asset files with your Sketchbook projects is relatively easy. You can simply add an asset file within a project subdirectory, then access its resolved public URL via a standard ES6 import statement.

Here's an example project that imports and uses an `test-image.png` file which has been added alongside it:

```ts
import Project, { type Detail2D } from '$lib/base/Project/Project';
import TestImage from './test-image.png';

export default class BundledImage extends Project {
    #bundledImage: HTMLImageElement;

    constructor() {
        super();
        this.#bundledImage = new Image();
        this.#bundledImage.src = TestImage;
    }

    update({ canvas, context }: Detail2D) {
        context.drawImage(this.#bundledImage, 0, 0, canvas.width, canvas.height);
    }
}
```

You can also import assets as strings by using a `?raw` suffix:

```ts
import shaderString from './shader.glsl?raw';
```

## Non-parameterized state

Sketchbook leverages instance variable definitions on `Project` subclasses for parameters, but what if you want instance variables within your projects that are _not_ represented with parameter UI? Whenever you wish to maintain state in instance variables without seeing these variables in the parameter UI, use the hash prefix to define [private properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields). See `#bundledImage` in the example code above.

## Using browser functionality

The code you write into your `Project` subclasses will be run directly within the browser, so you are free to leverage native browser functionality as you see fit. `window`, `document`, and your other front-end favorites will all be defined as expected, and you can use them however you see fit. This also opens up fun possibilities for projects that use the ever-evolving list of sophisticated [web APIs](https://developer.mozilla.org/en-US/docs/Web/API).

## Keyboard & mouse interaction

Though Sketchbook does not currently have direct support for keyboard and mouse inputs, you can easily set up your own listeners on the `document` reference for [keyboard](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) and [mouse](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) events, for example in a project's `init` method:

```ts
init() {
    document.addEventListener('keydown', (event) => {
        console.log(event.key);
    });
}
```

The same approach applies for any other user events you'd like to respond to in your Sketchbook projects.

## Non-animated projects

The `update` function in your `Project` subclass is called continuously in a `requestAnimationFrame` loop, but you don't have to implement your drawing code there! If your project isn't meant to render in real time, you could implement a custom drawing method that is called directly from `init`, `paramsChanged`, and `resized`. This is a great choice if your rendering code takes longer than a frame to execute, and your project isn't intended to render dynamic content.

You can also enable `staticMode` in your [project config](project-config.md), which is effectively a shortcut to the technique described above. With `staticMode` enabled, you can implement your drawing code in `update`, and expect that it will only be called after your project's other lifecycle methods.

## Exporting photos & videos

Sketchbook doesn't yet provide native support for photo and video export. If you're starting a project that you'd like to save photo or video content from, you could consider using a framework within Sketchbook that supports artwork export; [`canvas-sketch`](https://github.com/mattdesl/canvas-sketch/blob/master/docs/exporting-artwork.md) is one great option.

You could also explore using the canvas element's `toDataURL` method (documented [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)) to grab currently rendered visual content. [This page](https://fjolt.com/article/html-canvas-save-as-image) offers some discussion of related techniques.

Native support for saving photo snapshots is on the Sketchbook [roadmap](https://github.com/flatpickles/sketchbook/issues/65)!

## Dynamic canvas sizing

If you want to dynamically set the canvas size within your project (e.g. for configurable rendering dimensions), you can accomplish this by setting both the styled size and rendering size of the project's `canvas` reference. Keep in mind that you'll generally need to set both of these simultaneously (probably referencing `window.devicePixelRatio`), and that setting the canvas `width` and `height` will clear the current canvas contents.

```ts
import Project, {
    type Detail2D,
    type ParamsChangedDetail2D,
    type ResizedDetail2D
} from '$lib/base/Project/Project';

export default class ResizableCanvas extends Project {
    dimensions = [1000, 1000];

    init({ canvas }: Detail2D) {
        this.#resetDimensions(canvas);
    }

    paramsChanged({ keys, canvas }: ParamsChangedDetail2D): void {
        if (keys.includes('dimensions')) this.#resetDimensions(canvas);
    }

    resized({ canvas }: ResizedDetail2D): void {
        // Sketchbook will set the canvas width and height attributes automatically
        // on resize, but `resized` is called after that, so we can reset the canvas
        // sizing here as needed.
        this.#resetDimensions(canvas);
    }

    update() {
        // ...
    }

    #resetDimensions(canvas: HTMLCanvasElement) {
        const width = this.dimensions[0];
        const height = this.dimensions[1];
        const pixelRatio = window.devicePixelRatio;

        canvas.style.width = `${width}px`;
        canvas.width = width * pixelRatio;
        canvas.style.height = `${height}px`;
        canvas.height = height * pixelRatio;
    }
}
```
