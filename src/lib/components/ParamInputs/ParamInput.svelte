<script lang="ts">
    export let name: string;
    export let hoverText: string | undefined = undefined;
</script>

<label class="param-label" for={name} title={hoverText}>{name}</label>
<div class="param-input">
    <slot />
</div>

<style lang="scss">
    .param-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 1rem;
    }
</style>
