# Project Configuration

A core principle in Sketchbook's design is that _configuration is optional_. You should be able to happily and effectively use Sketchbook without needing to touch configuration files. That said, you may want to take advantage of Sketchbook's extensive configurability to present a more polished body of work to your audience.

A variety of project configuration settings are available, and when you want to change these settings, you can create a `config.json` alongside your project file.

A config file (e.g. `src/art/ProjectExample/config.json`) might look like this:

```json
{
    "title": "Example Project",
    "date": "2023-09-30",
    "description": "This is an example project.",
    "experimental": true,
    "groups": ["2D", "Test Projects"]
}
```

The available project configuration properties are as follows:

<!-- prettier-ignore -->
| Property Key | Default | Description |
| - | - | - |
| `title` | `[key]` | Display title for the project. Used in the project list (left panel) and as the header for the project detail (right panel). The default title is the project's directory/file name (key). |
| `date` | `undefined` | Defined with a standard date string format, e.g. YYYY-MM-DD. When defined, the date will be displayed as a subtitle in the project detail panel, and can be used for project list sorting. |
| `description` | `undefined` | When defined, description text appears beneath the title and subtitle in the project detail panel. You may include HTML markup (e.g. \<a /\> link tags) in your project descriptions, and this will be rendered as expected in the detail panel. |
| `experimental` | `false` | When `true`, this project will appear with an "experimental" marker in the project list, and will only be listed when `showExperiments` is enabled via the [app settings](settings.md). |
| `groups` | `[]` | An array of string group names. When groups are defined across project configs, these group names will be displayed in the project list panel, allowing the viewer to filter the project list by group. |
| `paramsApplyDuringInput` | `true` | When `true`, the parameter UI for this project will apply value changes before the input action is complete, e.g. while the user is dragging a slider. When `false`, value changes will only be applied when input is complete, e.g. on mouse-up from a slider. It can be useful to set this to `false` when parameter changes incur significant recomputation or rendering delay. This behavior can be overridden for each parameter; see [Parameter Configuration](param-config.md). |
| `canvasSize` | `undefined` | When undefined, project canvases will fill the full space available to them. If you'd instead like to have a fixed canvas size, you can provide a two-element numeric array for `canvasSize` (e.g. `[800, 600]`). This is the actual canvas drawing size; the HTML canvas element size will depend on `pixelRatio` (below). If your `canvasSize` exceeds the container size, the canvas dimensions will be constrained, and smaller than your configured values. |
| `pixelRatio` | `undefined` | When undefined, project canvases will use the device default pixel ratio (via `window.devicePixelRatio`, e.g. `2` for Retina displays). You can set this value to use any other pixel ratio, impacting the pixel density of your canvas, and the amount of space it occupies within its container (if `canvasSize` is defined). |
| `twoWaySync` | `true` | When `true`, parameter values set within a project will update the presented UI inputs. When `false`, parameter UI input will not be synced with internal changes to the underlying values. |
| `defaultPresetName` | `undefined` | When defined, Sketchbook will ignore the default parameter values set within a project file, and will instead use the named preset values as defaults. This preset will no longer be listed for the project. _[Note: presets are not yet implemented.]_ |
| `presetsAvailable` | `undefined` | When undefined, the preset selector UI will only be available for a project if it defines any presets within its `presets` subdirectory. You can set this to `true` or `false` to explicitly show/hide the preset UI for this project. _[Note: presets are not yet implemented.]_ |
| `params` | `undefined` | See [Parameter Configuration](param-config.md) to learn about the wide variety of configuration options for Sketchbook parameters.
