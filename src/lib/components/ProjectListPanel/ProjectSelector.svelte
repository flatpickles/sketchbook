<script lang="ts">
    import type { ProjectConfig } from '$lib/base/ConfigModels/ProjectConfig';
    import { goto } from '$app/navigation';
    import ProjectPresentation, { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';
    import { settingsStore } from '$lib/base/Util/AppState';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string | undefined;
    export let sorting: SortOrder = SortOrder.ReverseChronological;

    // todo: factor this out (duplicated in ProjectList)
    $: visibleKeys = ProjectPresentation.presentedKeys(
        projects,
        sorting,
        $settingsStore.showExperiments
    );

    $: previousProjectKey = (() => {
        const currentProjectIndex = visibleKeys.findIndex((key) => key === selectedProjectKey);
        if (currentProjectIndex > 0) {
            return visibleKeys[currentProjectIndex - 1];
        } else {
            return undefined;
        }
    })();
    $: nextProjectKey = (() => {
        const currentProjectIndex = visibleKeys.findIndex((key) => key === selectedProjectKey);
        if (currentProjectIndex < visibleKeys.length - 1) {
            return visibleKeys[currentProjectIndex + 1];
        } else {
            return undefined;
        }
    })();

    function selectEvent(event: Event) {
        const selectedOption = event.target as HTMLOptionElement;
        const selectedValue = selectedOption.value;
        goto(`/${selectedValue}`);
    }
</script>

<div class="project-selector-wrapper">
    {#if previousProjectKey}
        <a href={`/${previousProjectKey}`}>
            <i class="fa fa-angle-left selector-button left" data-testid="previous-project" />
        </a>
    {:else}
        <i class="fa fa-angle-left selector-button left disabled" data-testid="previous-project" />
    {/if}

    <select class="project-select-element" data-testid="project-select" on:change={selectEvent}>
        {#each visibleKeys as key}
            <option value={key} selected={key === selectedProjectKey} data-testid="project-option">
                {projects[key].title}
            </option>
        {/each}
    </select>

    {#if nextProjectKey}
        <a href={`/${nextProjectKey}`}>
            <i class="fa fa-angle-right selector-button right" data-testid="next-project" />
        </a>
    {:else}
        <i class="fa fa-angle-right selector-button right disabled" data-testid="next-project" />
    {/if}
</div>

<style lang="scss">
    a {
        text-decoration: none;
        color: #000;
    }

    .project-selector-wrapper {
        @include project-selector;

        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .project-select-element {
        @include project-select-element;

        flex-grow: 1;
        text-align: center;

        // For Safari:
        text-align-last: center;
        border-radius: 0;
    }

    .selector-button {
        @include project-select-button;

        flex-grow: 0;
        display: grid;
        place-items: center;
        height: 100%;

        &.disabled {
            // Hack to keep the button full-height with no a tag:
            height: auto;
        }
    }
</style>
