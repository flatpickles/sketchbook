# Sketchbook

Sketchbook is:

- A development tool
- A creative format
- A publishing surface

This is Sketchbook 2, an evolution of the [Sketchbook]() project. It has been fully rebuilt from the original, with the intent of being easily forkable, customizable, and usable by other artists. PRs welcome!

## Sketchbook parameters

[todo]

## Sketchbook file structure

[todo]

## Global configuration

[todo]

### Example file:

```json
{
	"title": "Sketchbook",
	"subtitle": "by <a href='http://flatpickles.com'>flatpickles</a>",
	"description": "This is a collection of programmatic art pieces. Code and details <a href='https://github.com/flatpickles/sketchbook'>here</a>."
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
        "description": "This is the description for a demo project, that will show up alongside the artwork. HTML tags may be used, e.g. for <a href='http://zombo.com'>links</a>."
		"default_preset": "Preset Name",
		"live_updates": true
	},
	"params": {
		"stringParam": {
			"name": "String Param",
			"style": "single",
			"live": true
		},
		"numberParam": {
			"name": "Number Param",
			"min": 0,
			"max": 1,
			"step": 0.01,
			"live": true,
			"style": "slider",
			"options": []
		},
		"booleanParam": {
			"name": "Boolean Param",
			"enables": ["stringParam", "functionParam"]
		},
		"functionParam": {
			"name": "Function Param"
		},
		"numericArrayParam": {
			"names": ["W", "H"],
			"min": 0,
			"max": 1,
			"step": 0.01,
			"live": true,
			"style": "field",
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

[todo]

### `params` config:

Parameters are keyed with their associated class property name. Their types will be inferred from the runtime type of these properties. The following types are available:

- **Number:** an integer or float value
- **Numeric array:** an array of numbers
- **String:** a single or multiline string
- **Boolean:** true or false value
- **Function:** a function _without parameters_
- **File:** a file selected by the user

For each type, `property` (default): description.

- **Number:**
  - `min` (0): Minimum value.
  - `max` (1): Maximum value.
  - `step` (0.01): Freehand input is snapped to an increment of this value, and slider displays use this as their step value.
  - `live` (true): When true, values will update as they're changed; when false, sketchbook will wait for field blur or mouse up.
  - `style` ("slider"): A string indicating the display style for this param. Options include:
    - "slider"
    - "field"
    - "selection"
  - `options` ([]): when using the "selection" style, this array of strings will be used for the list of selection options, and the param value will be set to the index in this list when selection occurs.
- **Numeric array:**
  - [todo]
- **String:**
  - [todo]
- **Boolean:**
  - [todo]
- **Function:**
  - [todo]
- **File:**
  - [todo]
