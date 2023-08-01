<script lang="ts">
    export let name: string;
    export let hoverText: string | undefined = undefined;
    export let even = false;
</script>

<div class="label-wrapper" class:even class:odd={!even}>
    <label class="param-label" for={name} title={hoverText}>{name}</label>
</div>
<div class="input-wrapper" class:even class:odd={!even}>
    <slot />
</div>

<style lang="scss">
    .label-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: left;

        @include parameter-item;
        padding-right: calc($parameter-item-spacing-horizontal / 2);
        margin-right: 0;
        border-radius: $border-radius 0 0 $border-radius;
    }

    .param-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        pointer-events: none;

        @include parameter-label;
    }

    .input-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        user-select: none;

        @include parameter-item;
        padding-left: calc($parameter-item-spacing-horizontal / 2);
        margin-left: 0;
        border-radius: 0 $border-radius $border-radius 0;
    }
</style>
