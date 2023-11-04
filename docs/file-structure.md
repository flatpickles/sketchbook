# Creating Project Files

Unlike many other tools that you might `npm install` and then use, Sketchbook is a _place_ where you build your projects, while leveraging useful features in the surrounding environment. As you create your projects, you'll build up a polished library of work within a coherent interface. Refer back to the [Quick Start Guide](quick-start.md) for a workflow walk-through.

When you fork or clone the base [Sketchbook repo](https://github.com/flatpickles/sketchbook), you pull down the entirety of Sketchbook's app code to build and run locally, but you won't be using this code directly in your Sketchbook project work. The projects you build within Sketchbook are fully contained in the `src/art` directory, and you won't need to venture outside of this directory unless you want to make your own changes to Sketchbook's app code.

Each project in Sketchbook is built from a collection of files contained within a subdirectory of `src/art`. Your `src/art` directory might look like this:

```fs
src/art/
├─ Project1/
│  ├─ Project1.js
│  ├─ sprite.png
│  ├─ transform.frag
├─ Project2/
│  ├─ config.json
│  ├─ presets/
│  │  ├─ CoolBeans.json
│  │  ├─ FrigidFrijoles.json
│  ├─ preview.png
│  ├─ Project2.ts
│  ├─ ProjectHelpers.ts
├─ util/
│  ├─ ColorUtils.js
│  ├─ PrintProject.ts
```

Within `src/art`, Sketchbook will automatically look for JavaScript or TypeScript files that share a name with their containing directory. This shared name becomes the "key" for the project, which is used in its URL. For example, [https://demo.skbk.cc/QuickStart](https://demo.skbk.cc/QuickStart) is implemented within a file located at `src/art/QuickStart/QuickStart.ts`.

Your named project files must export a default class that descends from the `Project` base class – see [The Project Class](project.md) to learn more about implementing `Project` subclasses. `config.json` files can optionally be included alongside project files, and will apply to the project file in the same directory. Project directories may also include [presets](params-presets.md) and a [preview image](content.md?id=open-graph-content).

As long as you're organizing and defining your project classes as expected, you can put anything else within `src/art`. Your additions could include asset files or utility code; anything you add will be bundled with your Sketchbook, and available to import in your project class files.
