<script lang="ts">
    export let name: string;
    export let hoverText: string | undefined = undefined;
</script>

<div class="param" data-testid="param" title={hoverText}>
    <label for={name}>{name}</label>
    <div class="param-wrapper">
        <slot />
    </div>
</div>
