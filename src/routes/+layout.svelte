<script lang="ts">
    import 'ress';

    import type { PageData } from './$types';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

    export let data: PageData;
</script>

<ProjectListPanel projects={data.projects} />

<slot />
