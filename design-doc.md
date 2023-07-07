# Sketchbook

Sketchbook is:

-   A development tool
-   A creative format
-   A publishing surface

This is Sketchbook 2, an evolution of the [original Sketchbook project](). Sketchbook 2 has been rebuilt from scratch, with the intent of being easily forkable, customizable, and usable by other artists.

Pull requests and issues are welcome!

## Basic Concepts

### Projects

Within Sketchbook, a "project" is ...

### Params

Each project within Sketchbook has its own collection of "params", i.e. parameters, which can be

### Presets

Each project within Sketchbook may optionally display a series of "presets", each of which is simply a curated collection of param

## Using Sketchbook

Sketchbook is designed to be easy to deploy with your own projects, and unopinionated about how you may be working. As long as you're building for the web and drawing stuff on an HTML canvas, you should be able to use Sketchbook however you see fit.

### Project Directories

Each project is contained within its own directory, within `src/art`. Project directories can contain any number of supporting files, though they must also contain a TypeScript (or JavaScript) file, named with the name of the Project, and exporting a default class definition with the same name as well. If my project is named "NoSignal", I'll make sure to export a class named `NoSignal` from `src/art/NoSignal/NoSignal.ts`.

Project directories may also contain two other Sketchbook particulars: a `config.json` file, and a `presets` subdirectory. Configuration files are described in detail below. The JSON files within the presets directory will automatically be displayed as available presets for the project, and file names (without the ".json") will be used as preset display names.

### Project Files

Exported project classes must be subclasses of the `Project` class, defined in `src/lib/base/Project.ts`. The `Project` class definition is extremely simple, including `init` and `update` methods for you to override, and a `canvas` reference that you can use for drawing. Projects may be instantiated before the DOM is fully loaded, but `canvas` will be defined and ready to use by the time `init` is called. `update` is called whenever any parameters are changed.

Speaking of parameters, they are simply defined as instance properties; Sketchbook will create user-adjustable parameter UIs for any instance properties that it sees defined on each project class. This means that if you're creating instance properties for internal reference, you must declare them as [private class members](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields).

For a simple demo project, please see the annotated example within `src/art`!

### Recommended Setup Steps

Clone, push Vercel, clear out `src/art`, etc...

### Development Workflow

Svelte, npm run dev, etc..

## Global Configuration

[todo]

### Example file:

```json
{
    "title": "Sketchbook",
    "subtitle": "by <a href='http://flatpickles.com'>flatpickles</a>",
    "description": "This is a collection of programmatic art pieces. Code and details <a href='https://github.com/flatpickles/sketchbook'>here</a>.",
    "sorting": "date",
    "defaultGroup": "Uncategorized",
    "storeParamValues": true,
    "storeProjectSelection": true
}
```

## Project-specific config:

Project config files are included within each project directory as JSON, and include configuration details for the project and its parameters.

Config files are optional, as are each of the properties you may include. All properties included in a config file have sensible defaults (discussed below).

### Example file:

```json
{
    "title": "Demo Project",
    "date": "2023-06-17",
    "description": "This is the description for a demo project, that will show up alongside the artwork. HTML tags may be used, e.g. for <a href='http://zombo.com'>links</a>.",
    "defaultPresetName": "Preset Name",
    "liveUpdates": true,
    "groups": ["Plotter Art"],
    "experimental": false,
    "params": {
        "numberParam": {
            "name": "Number Param",
            "min": 0,
            "max": 1,
            "step": 0.01,
            "liveUpdates": true,
            "style": "slider",
            "options": []
        },
        "numericArrayParam": {
            "name": "Dimensions",
            "names": ["W", "H"],
            "min": 0,
            "max": 1,
            "step": 0.01,
            "liveUpdates": true,
            "style": "field",
            "section": "Section 1"
        },
        "booleanParam": {
            "name": "Boolean Param",
            "enables": ["stringParam", "functionParam"],
            "section": "Section 1"
        },
        "stringParam": {
            "name": "String Param",
            "style": "single",
            "liveUpdates": true,
            "section": "Section 1"
        },
        "functionParam": {
            "name": "Function Param",
            "section": "Section 1"
        },
        "filesParam": {
            "name": "File Input",
            "multiple": false,
            "accept": "image/*"
        }
    }
}
```

### Project config:

Options (and parenthesized defaults) for the project are as follows:

-   `title` (_class name_): The display name for the project, used in the project list and in the project details overlay. Optionally used for sorting.
-   `date` (`undefined`): The date displayed for the project, used in the project details overlay (no date displayed if undefined). Optionally used for sorting.
-   `description`: (`undefined`): The description displayed for the project, used in the project details overlay (no description displayed if undefined).
-   `defaultPresetName` (`undefined`):
-   `liveUpdates` (`true`)
-   `groups` ([])
-   `experimental` (`false`)
-   `params` ({}): Parameter configuration for the project, as described below.

### Project parameters config:

Parameters are keyed with their associated property name, as defined on the project's main class object. Their types will be inferred from the runtime type of these properties. The following types are available:

-   **Number:** an integer or float value
-   **Numeric array:** an array of numbers
-   **String:** a single or multiline string
-   **Boolean:** true or false value
-   **Function:** a function _without parameters_
-   **Files:** an array of file objects selected by the user

Options (and parenthesized defaults) for each type are as follows:

-   **Number:**
    -   `name` (_property name_): Display name for parameter.
    -   `min` (0): Minimum value.
    -   `max` (1): Maximum value.
    -   `step` (0.01): Freehand input is snapped to an increment of this value, and slider displays use this as their step value.
    -   `liveUpdates` (`project.liveUpdates`): When true, values will update as they're changed; when false, sketchbook will wait for field blur or mouse up. This will override the configured `project.liveUpdates` value, i.e. that will be used as its default.
    -   `style` ("slider"): A string indicating the display style for this param. Options include:
        -   "slider": Show a range slider allowing the user to set via dragging.
        -   "field": Show an input field allowing the user to type a number.
        -   "selection": Show a dropdown selector with several options, as described below. This is particularly useful when defining a corresponding project class property as a custom TypeScript enum.
    -   `options` (`undefined`): When using the "selection" style, this array of strings will be used for the list of selection options, and the param value will be set to the index in this list when selection occurs.
    -   `section` (`undefined`): String name for the named section that this param should be grouped within, or undefined if it's a top level param. Params are displayed in the order they are defined in the file unless `section` is defined; sectioned params will be grouped together in the position of the first listed parameter.
-   **Numeric array:**
    -   `name`, `min`, `max`, `step`, `liveUpdates`, and `section` as above.
    -   `names` (_[1, 2, ...]_): An array with names for each of the parameters in index order. Must be the same length as the associated property. `name` will still be displayed to identify the entire numeric array param.
    -   `style` ("field") as above, though without a "selection" option and with a different default (as noted).
-   **String:**
    -   `name`, `liveUpdates`, and `section` as above.
    -   `style` ("single"): A string indicating the display style for this param. Options include:
        -   "single": A single-line text field input.
        -   "multi": A multi-line text field input.
-   **Boolean:**
    -   `name` and `section` as above.
    -   `enables` ([]): An array of strings, each being a property name (not display name!) for another param within this project. Included params will be disabled when this boolean param is unset. Boolean params may be included without a corresponding project class property, and used only to enable/disable other params.
-   **Function:**
    -   `name` and `section` as above.
-   **File:**
    -   `name` and `section` as above.
    -   `multiple` (false): Whether the user is allowed to select multiple files.
    -   `accept` ("\*/\*"): Optionally limit the types of files that the user can choose from the presented file selection dialog.
