<script lang="ts">
    import ProjectPresentation from '$lib/base/ProjectLoading/ProjectPresentation';
    import type { ProjectConfig } from '$lib/base/ConfigModels/ProjectConfig';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string;
    export let sorting: SortOrder = SortOrder.ReverseChronological;
    export let selectedGroup: string | undefined = undefined;

    $: visibleKeys = ProjectPresentation.presentedKeys(
        projects,
        sorting,
        $settingsStore.showExperiments,
        selectedGroup
    );
</script>

<div class="project-list">
    {#each visibleKeys as key}
        {#if true}
            <a
                href="/{key}"
                class="project-list-item"
                data-testid="project-list-item"
                class:selected={key === selectedProjectKey}
            >
                {projects[key].title}
                {#if projects[key].experimental}
                    <i
                        class="fa fa-flask experimental"
                        title="Experimental"
                        data-testid="experimental-icon"
                    />
                {/if}
            </a>
        {/if}
    {/each}
</div>

<style lang="scss">
    a {
        text-decoration: none;
        color: inherit;
        display: block;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .project-list {
        flex-grow: 1;
        padding: calc($panel-section-spacing / 2) 0;

        // Fade out edges
        @if ($project-list-scroll-fade) {
            mask-image: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 1) calc($panel-section-spacing / 2),
                rgba(0, 0, 0, 1) calc(100% - $panel-section-spacing/2),
                rgba(0, 0, 0, 0)
            );
        }

        // Scroll with no scrollbar
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        // Internal layout
        display: flex;
        flex-direction: column;
        gap: $project-spacing;
    }

    // Webkit hide scrollbar
    .project-list::-webkit-scrollbar {
        display: none;
    }

    .project-list-item {
        user-select: none;
        flex-shrink: 0;
        @include project-list-item;
    }
</style>
