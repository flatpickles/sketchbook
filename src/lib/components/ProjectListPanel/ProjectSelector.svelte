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
            <i class="fa fa-angle-left selector-button left" />
        </a>
    {:else}
        <i class="fa fa-angle-left selector-button left disabled" />
    {/if}

    <select class="project-selector" on:change={selectEvent}>
        {#each visibleKeys as key}
            <option value={key} selected={key === selectedProjectKey}>
                {projects[key].title}
            </option>
        {/each}
    </select>

    {#if nextProjectKey}
        <a href={`/${nextProjectKey}`}>
            <i class="fa fa-angle-right selector-button right" />
        </a>
    {:else}
        <i class="fa fa-angle-right selector-button right disabled" />
    {/if}
</div>

<style lang="scss">
    a {
        text-decoration: none;
        color: #000;
    }

    .project-selector-wrapper {
        background-color: #fff;

        display: flex;
        flex-direction: row;
        justify-content: center;

        border-bottom: 1px solid #ccc;
    }

    .project-selector {
        flex-grow: 1;
        text-align: center;
        padding: 0.5rem 0;
        font-size: $large-text-size;

        // For Safari:
        text-align-last: center;
        border-radius: 0;
    }

    .selector-button {
        flex-grow: 0;
        display: grid;
        place-items: center;
        width: 2rem;
        height: 100%;

        &.left {
            border-right: 1px solid #ccc;
        }

        &.right {
            border-left: 1px solid #ccc;
        }

        &.disabled {
            color: #ccc;
            height: auto; // hack?
        }
    }
</style>
