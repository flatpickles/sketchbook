<script lang="ts">
    import Panel from '$lib/components/Panel.svelte';

    import type { PageData } from './$types';
    import type ProjectConfig from '$lib/base/ProjectConfig';

    export let data: PageData;
    let projectConfigs: ProjectConfig[] = Object.values(data.projects);
</script>

<Panel>
    {#each projectConfigs as projectConfig}
        {projectConfig.props.title}
    {/each}
</Panel>

<slot />
