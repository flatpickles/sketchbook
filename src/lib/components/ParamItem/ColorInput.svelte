<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let name: string;
    export let value: string;
    $: fieldValue = value;

    const dispatch = createEventDispatcher();
    function fieldInputEvent(event: Event) {
        const target = event.target as HTMLInputElement;

        // Validate color entry
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (!hexRegex.test(target.value)) {
            if (event.type === 'change') {
                fieldValue = value;
            }
            return;
        }

        // All's good, carry on
        value = fieldValue;
        dispatch(event.type, event);
    }
</script>

<!-- Currently logs a warning: https://github.com/sveltejs/svelte/issues/8446 -->

<div class="color-input-wrapper">
    <input
        class="color-field"
        type="text"
        bind:value={fieldValue}
        id={name}
        on:input={fieldInputEvent}
        on:change={fieldInputEvent}
        autocomplete="off"
        data-testid="color-param-field"
    />
    <input
        class="color-selector"
        type="color"
        bind:value
        id={name}
        on:input
        on:change
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
</style>
