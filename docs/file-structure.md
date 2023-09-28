# Creating Project Files

Unlike other tools that you might `npm install` and then use in your own projects, Sketchbook is a _place_ where you build your projects, while leveraging useful features in the surrounding environment. Sketchbook starts as a blank canvas, but as you create projects within it, you'll build up a library of work that can be viewed and interacted with via in same coherent interface.

When you fork or clone the base [Sketchbook repo](https://github.com/flatpickles/sketchbook), you pull down the entirety of Sketchbook's app code to build and run locally, but you won't be using this code directly in your Sketchbook project work. The projects you build within Sketchbook are fully contained in the `src/art` directory, and you won't need to venture outside of this directory unless you want to make your own changes to Sketchbook's app code. Refer back to the [Quick Start Guide](quick-start.md) for a workflow walk-through.

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
│  ├─ Project2.ts
│  ├─ ProjectHelpers.ts
├─ util/
│  ├─ ColorUtils.js
│  ├─ PrintProject.ts
```

Within `src/art`, Sketchbook will automatically look for JS or TS files that share a name with their containing directory. These files must export a default class that descends from the `Project` base class. `config.json` files can optionally be included alongside project files, and will apply to the project file in the same directory.

As long as you're organizing and defining your project classes as expected, you can put anything else within `src/art`! Your additions could include asset files, helper code, or your own utility subclasses of `Project` (extendible by projects in your library).
