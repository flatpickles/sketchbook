<script lang="ts">
    import type { ProjectConfig } from '$lib/base/ConfigModels/ProjectConfig';
    import ProjectPresentation, { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { onMount } from 'svelte';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string | undefined;
    export let sorting: SortOrder = SortOrder.ReverseChronological;
    export let selectedGroup: string | undefined = undefined;

    $: visibleKeys = ProjectPresentation.presentedKeys(
        projects,
        sorting,
        $settingsStore.showExperiments,
        selectedGroup
    );

    onMount(() => {
        // Scroll to the selected project if it exists
        if (selectedProjectKey) {
            const selectedElement = document.querySelector(
                '.project-list-item.selected'
            ) as HTMLElement;
            if (selectedElement && selectedElement.scrollIntoView) {
                selectedElement.scrollIntoView({ behavior: 'instant', block: 'nearest' });
                // Scroll a little more if the selected element is near the bottom of the container
                const container = selectedElement.parentElement as HTMLElement;
                const containerRect = container.getBoundingClientRect();
                const selectedRect = selectedElement.getBoundingClientRect();
                const containerCenterY = containerRect.top + containerRect.height / 2;
                const shouldScrollMore = selectedRect.top > containerCenterY;
                if (shouldScrollMore) {
                    const computedStyle = getComputedStyle(container);
                    const scrollOffset = parseInt(computedStyle.paddingBottom, 10) || 0;
                    container.scrollTop += scrollOffset;
                }
            }
        }
    });
</script>

{#if visibleKeys.length === 0}
    <div class="project-list-placeholder" data-testid="project-list-placeholder">
        <p>
            No projects found. See <a href="http://skbk.cc">the docs</a> for notes on getting started.
        </p>
    </div>
{:else}
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
{/if}

<style lang="scss">
    .project-list-placeholder {
        width: 100%;
        height: 100%;
        padding: calc($panel-section-spacing / 2) $panel-content-inset $panel-section-spacing;

        color: rgba($panel-fg-color, $footer-text-opacity);
        text-align: center;
        font-style: italic;
        font-size: $medium-text-size;
    }

    .project-list {
        flex-grow: 1;
        padding: calc($panel-section-spacing / 2) 0 $panel-section-spacing;

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

        // Links within the list
        a {
            text-decoration: none;
            color: inherit;
            display: block;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
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
