<script lang="ts">
    import type { ParamConfig } from '$lib/base/ParamConfig';
    export let params: Record<string, ParamConfig>;
</script>

<ul>
    {#each Object.values(params) as param}
        <li>{param.name}</li>
    {/each}
</ul>
