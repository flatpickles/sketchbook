<script lang="ts">
    import ProjectViewer from '$lib/components/ProjectViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';

    export let projectConfigs: Record<string, ProjectConfig>;
    export let selectedProjectTuple: ProjectTuple;
</script>

<ProjectListPanel projects={projectConfigs} selectedProjectKey={selectedProjectTuple.key} />
<ProjectViewer project={selectedProjectTuple.project} />
<ProjectDetailPanel projectTuple={selectedProjectTuple} />
