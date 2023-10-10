# Parameter Configuration

Without any configuration, Sketchbook will automatically infer parameter types from your [parameter implementations](params-presets.md?id=implementing-parameters), but there are many configuration options available to further customize the appearance and behavior of the parameters in your projects.

Similarly to [project configuration](project-config.md), parameter configuration is optional, and can be defined within a project's `config.json` file whenever you need it. In the project config JSON object, you can define a `params` key, and assign it a JSON object containing configuration details for any parameter keys in your project (keys being the instance variable names in your `Project` subclass).

A project `config.json` file that configures the example project discussed in the [parameters documentation](params-presets.md?id=implementing-parameters) might look like this:

```json
{
    "title": "Example Project",
    "params": {
        "numberParam": {
            "name": "Demo Integer",
            "min": 0,
            "max": 10,
            "step": 1
        },
        "arrayParam": {
            "name": "Demo Color",
            "style": "unitColor"
        }
    }
}
```

As you can see, different parameter configuration options are available for each parameter type, though some options are available across types. To see examples of different parameter configuration options, check out the "Param Examples" demo project [on GitHub](https://github.com/flatpickles/sketchbook/tree/demo/src/art/ParamExamples), and on the Sketchbook [demo deployment](https://demo.skbk.cc/ParamExamples).

## All Parameters

The parameter configuration options available for _all_ parameter types are as follows:

<!-- prettier-ignore -->
| Property Key | Default | Description |
| - | - | - |
| `name` | `[key]` | The display name for this parameter, shown to the left of its input field(s). |
| `hoverText` | `undefined` | When defined, this text description will show as the user hovers their mouse over the parameter name. |
| `section` | `undefined` | Parameters that share the same `section` name string will be collected under a section header in the parameter list. Parameters for which `section` is undefined will be shown above any parameter sections, without a section header.<br/><br/>Parameter ordering in the Sketchbook UI matches the property definition order within your project class, unless sections are present. Section order matches the property definition order of the first included parameter. |
| `fullWidthInput` | `false` | When `true`, Sketchbook will not display a label with a parameter's `name`, and will instead display its input field(s) across the full width of the parameter list. |
| `applyDuringInput` | `[inherited]` | When `true`, the UI for this parameter will apply value changes before the input action is complete, e.g. while the user is dragging a slider. When `false`, value changes will only be applied when input is complete, e.g. on mouse-up from a slider. This behavior defaults to the project's configured `paramsApplyDuringInput` value, but can be overridden in each parameter. |

## Number Parameters

In addition to the options available for all parameter types, number parameters can also be configured with the following options:

<!-- prettier-ignore -->
| Property Key | Default | Description |
| - | - | - |
| `min` | `0` | The lowest value (inclusive) to which a number parameter can be set in its input UI. |
| `max` | `1` | The highest value (inclusive) to which a number parameter can be set in its input UI. |
| `step` | `0.01` | The increment used during parameter updates, i.e. the minimum resolution of the range slider, and the increment used when pressing the up and down arrows within a number field. `step` can be set to `1.0` for integer inputs. |
| `style` | `combo` | Number parameters offer a few different styling options:<ul><li>`combo`: display contains both a slider and a number input field</li><li>`slider`: display contains only a slider</li><li>`field`: display contains only a number input field</li></ul> |
| `options` | `undefined` | When defined, this constrains a number parameter to one of several pre-defined options, and will present a drop-down selector instead of numeric input. Defining `options` will override any configured `style` (below).<br /><br />If `options` is defined as an array of numbers, the selector will show these number options as available choices. If `options` is defined as a object mapping strings to numbers (e.g. `{'one': 1, 'two': 2}`), the strings will be used as selector labels, and the number values will be set when they are selected. |

## Boolean Parameters

Boolean parameters do not yet offer any configurability beyond the options available for all parameter types. They will eventually support a configurable [switch style](https://github.com/flatpickles/sketchbook/issues/20), and will be able to declaratively impact the display of other parameters via [value effects](https://github.com/flatpickles/sketchbook/issues/4), e.g. to enable/disable different project modes.

## String Parameters

In addition to the options available for all parameter types, string parameters can also be configured with the following options:

<!-- prettier-ignore -->
| Property Key | Default | Description |
| - | - | - |
| `style` | `single` | String parameters offer a few different styling options:<ul><li>`single`: parameter input is a single-line text field</li><li>`slider`: parameter input is a multi-line text area</li><li>`color`: parameter input is a color picker, and values are set as hex colors (e.g. `#34b004`).</li></ul> |
| `options` | `undefined` | When defined, this constrains a string parameter to one of several pre-defined options, and will present a drop-down selector instead of a text input field. Defining `options` will override any configured `style` (below).<br /><br />If `options` is defined as an array of strings, the selector will show these string options as available choices. If `options` is defined as a object mapping strings to strings (e.g. `{'Option 1': 'one', 'Option 2': 'two'}`), the strings keys be used as selector labels, and the string values will be set when they are selected. |

## Numeric Array Parameters

In addition to the options available for all parameter types, numeric array parameters can also be configured with the following options:

<!-- prettier-ignore -->
| Property Key | Default | Description |
| - | - | - |
| `min` | `0` | The lowest value (inclusive) to which each numeric array element can be set in its input UI. |
| `max` | `1` | The highest value (inclusive) to which each numeric array element can be set in its input UI. |
| `step` | `0.01` | The increment used during parameter updates for each numeric array element. |
| `style` | `combo` | Numeric array parameters offer a few different styling options:<ul><li>`combo`: display contains both sliders and number input fields</li><li>`slider`: display contains only sliders</li><li>`field`: display contains only number input fields</li><li>`compactSlider`: display contains only sliders, two to a row </li><li>`compactField`: display contains only fields, two to a row</li><li>`unitColor`: parameter input is a color picker, setting each element of a three-number array in the 0-1 range. Three-element arrays only.</li><li>`byteColor`: parameter input is a color picker, setting each element of a three-number array in the 0-255 range. Three-element arrays only.</li></ul> |
| `options` | `undefined` | When defined, this constrains a number parameter to one of several pre-defined options, and will present a drop-down selector instead of numeric input. Defining `options` will override any configured `style` (below).<br /><br />If `options` is defined as an array of numbers, the selector will show these number options as available choices. If `options` is defined as a object mapping strings to numbers (e.g. `{'one': 1, 'two': 2}`), the strings will be used as selector labels, and the number values will be set when they are selected. |

## Function Parameters

In addition to the options available for all parameter types, function parameters can also be configured with the following options:

<!-- prettier-ignore -->
| Property Key | Default | Description |
| - | - | - |
| `buttonText` | `Run` | The text displayed within the button that triggers the associated function. |

## File Parameters

In addition to the options available for all parameter types, file parameters can also be configured with the following options:

<!-- prettier-ignore -->
| Property Key | Default | Description |
| - | - | - |
| `accept` | `*` | The [accept attribute string](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept) for the associated file picker, indicating which file types may be selected. |
| `multiple` | `false` | When `true`, the user can select multiple files in the associated file picker. If multiple files are selected, the resulting values will be passed as an array to the file parameter function you define in your project. When `false`, only a single file may be selected, and it is not passed within an array. |
| `mode` | `dataURL` | File parameters offer a few different modes for reading files: <ul><li>`dataURL`: files will be [read](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL) and delivered as data URL strings</li><li>`arrayBuffer`: files will be [read](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsArrayBuffer) and delivered as [Array Buffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) objects</li><li>`binaryString`: files will be [read](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString) and delivered as binary strings</li><li>`text`: files will be [read](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText) and delivered as raw text</li><li>`image`: files are expected to be images, and will be delivered as already-loaded [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) objects</li></ul>|
