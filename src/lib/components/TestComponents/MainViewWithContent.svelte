<script lang="ts">
    /**
     * There's not a great way to test the MainView component in isolation, since it has a
     * Svelte slot that can contain any content. This generally contains a ProjectContent component,
     * so that's what this test component does directly.
     */

    import Project from '$lib/base/Project/Project';
    import MainView from '$lib/components/MainView/MainView.svelte';
    import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
    import ProjectContent from '$lib/components/MainView/ProjectContent.svelte';
    import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';

    export let hasDetails = true;

    const configs = {
        untitled: {
            ...ProjectConfigDefaults,
            description: hasDetails
                ? 'When a description is present, we render the project detail panel.'
                : undefined
        }
    };
    const projectTuple = {
        key: 'Untitled',
        project: new Project(),
        config: configs.untitled,
        params: [],
        presets: {
            [defaultPresetKey]: {
                key: defaultPresetKey,
                title: 'Default Values',
                values: {}
            }
        }
    };
</script>

<MainView projectConfigs={{ Untitled: configs.untitled }} selectedProjectKey="Untitled">
    <ProjectContent {projectTuple} />
</MainView>
