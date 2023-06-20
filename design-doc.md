# Sketchbook

Sketchbook is:

-   A development tool
-   A creative format
-   A publishing surface

This is Sketchbook 2, an evolution of the [Sketchbook]() project. It has been fully rebuilt from the original, with the intent of being easily forkable, customizable, and usable by other artists. PRs welcome!

## Basic Concepts

### Projects

Within Sketchbook, a "project" is ...

### Params

Each project within Sketchbook has its own collection of "params", i.e. parameters, which can be

### Presets

## Using Sketchbook

Sketchbook is designed to be easy to deploy with your own projects, and unopinionated about how you may be working.

## Recommended Workflow

[todo]

## Global Configuration

[todo]

### Example file:

```json
{
    "title": "Sketchbook",
    "subtitle": "by <a href='http://flatpickles.com'>flatpickles</a>",
    "description": "This is a collection of programmatic art pieces. Code and details <a href='https://github.com/flatpickles/sketchbook'>here</a>.",
    "sorting": "date",
    "default_group": "Uncategorized",
    "store_param_values": true,
    "store_project_selection": true
}
```

## Project-specific config:

Project config files are included within each project directory as JSON, and include configuration details for the project and its parameters.

Config files are optional, as are each of the properties you may include. All properties included in a config file have sensible defaults (discussed below).

### Example file:

```json
{
    "project": {
        "title": "Demo Project",
        "date": "2023-06-17",
        "description": "This is the description for a demo project, that will show up alongside the artwork. HTML tags may be used, e.g. for <a href='http://zombo.com'>links</a>.",
        "default_preset": "Preset Name",
        "live": true,
        "groups": ["Plotter Art"],
        "experimental": false
    },
    "params": {
        "numberParam": {
            "name": "Number Param",
            "min": 0,
            "max": 1,
            "step": 0.01,
            "live": true,
            "style": "slider",
            "options": []
        },
        "numericArrayParam": {
            "names": ["W", "H"],
            "min": 0,
            "max": 1,
            "step": 0.01,
            "live": true,
            "style": "field"
        },
        "stringParam": {
            "name": "String Param",
            "style": "single",
            "live": true
        },
        "booleanParam": {
            "name": "Boolean Param",
            "enables": ["stringParam", "functionParam"]
        },
        "functionParam": {
            "name": "Function Param"
        },
        "filesParam": {
            "name": "File Input",
            "multiple": false,
            "accept": "image/*"
        }
    },
    "param_sections": [
        {
            "name": "Section One",
            "params": ["stringParam", "numberParam"]
        },
        {
            "name": "Section Two",
            "params": ["booleanParam", "functionParam"]
        }
    ]
}
```

### `project` config:

Options (and parenthesized defaults) for the project are as follows:

-   `title`: The display name for the project.
-   `date`: The date displayed for the project

### `params` config:

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
    -   `live` (`project.live`): When true, values will update as they're changed; when false, sketchbook will wait for field blur or mouse up. This will override the configured `project.live` value, i.e. that will be used as its default.
    -   `style` ("slider"): A string indicating the display style for this param. Options include:
        -   "slider": Show a range slider allowing the user to set via dragging.
        -   "field": Show an input field allowing the user to type a number.
        -   "selection": Show a dropdown selector with several options, as described below. This is particularly useful when defining a corresponding project class property as a custom TypeScript enum.
    -   `options` ([]): When using the "selection" style, this array of strings will be used for the list of selection options, and the param value will be set to the index in this list when selection occurs.
-   **Numeric array:**
    -   `names` (_[property names]_): An array with names for each of the parameters in index order. Must be the same length as the associated property.
    -   `style` ("field") as above, though without a "selection" option and with a different default (as noted).
    -   `min`, `max`, `step`, and `live` as above.
-   **String:**
    -   `name` and `live` as above.
    -   `style` ("single"): A string indicating the display style for this param. Options include:
        -   "single": A single-line text field input.
        -   "multi": A multi-line text field input.
-   **Boolean:**
    -   `name` as above.
    -   `enables` ([]): An array of strings, each being a property name (not display name!) for another param within this project. Included params will be disabled when this boolean param is unset. Boolean params may be included without a corresponding project class property, and used only to enable/disable other params.
-   **Function:**
    -   `name` as above.
-   **File:**
    -   `name` as above.
    -   `multiple` (false): Whether the user is allowed to select multiple files.
    -   `accept` ("\*/\*"): Optionally limit the types of files that the user can choose from the presented file selection dialog.

### `param_sections` config:

[todo]
