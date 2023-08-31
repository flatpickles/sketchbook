<script lang="ts">
    import ColorConversions from '$lib/base/Util/ColorConversions';
    import { createEventDispatcher } from 'svelte';

    export let name: string;
    export let value: string | number[];
    export let disabled = false;

    const dispatch = createEventDispatcher();

    // Avoid binding to the value directly within the input elements; depending on the type of
    // value, we may need to convert rgb <-> hex. Within this component we're using hex only (i.e.
    // both values below are hex strings)
    let fieldValue: string = maybeRgbToHex(value);
    let colorPickerValue: string = maybeRgbToHex(value);

    // Convert rgb to hex if necessary
    function maybeRgbToHex(maybeRgb: string | number[]): string {
        if (Array.isArray(maybeRgb)) {
            return ColorConversions.rgbToHex(maybeRgb);
        } else {
            return maybeRgb;
        }
    }

    // The text input field has received an input/change event
    function fieldInputEvent(event: Event) {
        const target = event.target as HTMLInputElement;

        // Validate color entry, reset to current value if failed
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (!hexRegex.test(target.value)) {
            if (event.type === 'change') {
                target.value = maybeRgbToHex(value);
                fieldValue = maybeRgbToHex(value);
            }
            return;
        }

        // All's good, carry on
        colorPickerValue = target.value;
        if (Array.isArray(value)) {
            value = ColorConversions.hexToRgb(target.value);
        } else {
            value = target.value;
        }
        dispatch(event.type, event);
    }

    // The color picker input has received an input/change event
    function pickerInputEvent(event: Event) {
        const target = event.target as HTMLInputElement;
        fieldValue = target.value;
        if (Array.isArray(value)) {
            value = ColorConversions.hexToRgb(target.value);
        } else {
            value = target.value;
        }
        dispatch(event.type, event);
    }
</script>

<div class="color-input-wrapper">
    <input
        type="text"
        id={name}
        class="color-field"
        autocomplete="off"
        {disabled}
        value={fieldValue}
        on:input={fieldInputEvent}
        on:change={fieldInputEvent}
        data-testid="color-param-field"
    />
    <input
        type="color"
        id={name}
        class="color-selector"
        {disabled}
        value={colorPickerValue}
        on:input={pickerInputEvent}
        on:change={pickerInputEvent}
        data-testid="color-param-selector"
    />
</div>

<style lang="scss">
    @import './styles/input-color.scss';

    .color-input-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .color-field {
        @include string-parameter-input;
        width: 100%;
        border-radius: $field-input-border-radius 0 0 $field-input-border-radius;
    }

    .color-selector {
        height: 100%;
        width: 100%;
        max-width: $param-input-item-min-width;
        border: $field-input-border;
        border-left: 0;
        border-radius: 0 $field-input-border-radius $field-input-border-radius 0;
    }

    input:disabled {
        @include parameter-input-disabled;
    }
</style>
