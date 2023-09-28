# Sketchbook File Structure

`src/art` is where all of your projects will live. Each "project" in Sketchbook is a collection of files contained within a subdirectory of `src/art`. Your `src/art` directory might look like this:

```fs
src/art/
├─ Project1/
│  ├─ Project1.js
│  ├─ sprite.png
│  ├─ transform.frag
├─ Project2/
│  ├─ config.json
│  ├─ Project2.ts
│  ├─ ProjectHelpers.ts
├─ util/
│  ├─ ColorUtils.js
│  ├─ PrintProject.ts
```

Within `src/art`, Sketchbook will automatically look for JS or TS files that share a name with their containing directory. These files must export a default class that descends from the `Project` base class. `config.json` files can optionally be included alongside project files, and apply to the project file in the same directory.

As long as you're organizing and defining your project classes as expected, you can put anything else within `src/art`! Your additions could include asset files, helper code, or your own utility subclasses of `Project` (extendible by projects in your library).
