# Core Concepts

So far, you have hopefully learned about Sketchbook's goals on the [Overview](README.md) page, and experimented with a basic workflow on the [Quick Start](quick-start.md) page. Read on to learn more about Sketchbook's fundamentals!

### Sketchbook File Anatomy

You will likely only need to concern yourself with two subdirectories within Sketchbook: `src/art`, where all of your projects will live, and `src/config`, where you can configure Sketchbook's behavior and appearance.

Each "project" in Sketchbook is a collection of files, all contained within a subdirectory of `src/art`. Your `src/art` directory might look like:

```
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

A few things to note:

-   Within `src/art`, Sketchbook will automatically look for JS or TS files that share a name with their containing directory. These files must export a default class that descends from the `Project` base class (discussed below).
-   `config.json` files are included alongside project files.
-   As long as you're organizing and defining your project classes as expected, you can put anything else within `src/art`! Your additions could include asset files, helper code, or your own utility subclasses of `Project` (to be extended by multiple projects in your library).

### Configuration & Customization

Sketchbook projects and parameters are deeply configurable via `config.json` files, and the app offers many options to customize its behavior and appearance in `src/config`. That said, configuration & customization is rarely required: you should be able to achieve the vast majority of your creative intentions without touching config files, so we won't discuss these further within Core Concepts. Check out these relevant docs pages when you're ready:

-   [Project Configuration](project-config.md): Options available for configuring the behavior and appearance of your projects, via `config.json` files.
-   [Parameter Configuration](param-config.md): Options available for configuring each type of supported parameter with a Sketchbook project (also within a project's `config.json`).
-   [App Settings](settings.md): Sketchbook behavior settings that can either be configured as defaults or within the Settings panel in the app.
-   [Content & Copy](content.md): Text and iconography displayed throughout the app, for example the header and footer text in the left panel.
-   [Theme & Styling](theme.md): Changing the look and feel of the app, via SCSS defaults.

### The `Project` Class

### Project Parameters

### Presets

Presets are [on the roadmap](https://github.com/flatpickles/sketchbook/issues/21) for Sketchbook 1.0, and will eventually be documented here, if not in their own page. Stay tuned!
