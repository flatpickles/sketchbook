<script lang="ts">
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import {
        ParamType,
        type ParamConfig,
        getParamSections
    } from '$lib/base/ParamConfig/ParamConfig';
    import type { ParamValueType } from '$lib/base/ParamConfig/ParamTypes';

    import ParamItem from './ParamItem/ParamItem.svelte';

    export let projectTuple: ProjectTuple;
    $: [noSectionParams, paramSections] = getParamSections(projectTuple.params);

    // A little dark magic to apply the updated param (or call the associated function)
    function paramUpdated(event: any) {
        const updatedConfig = event.detail.config as ParamConfig;

        // Update the project's value for this key, or call the named function
        if (updatedConfig.type != ParamType.Function) {
            // If it's an array, we need to copy it so that we don't mutate the original
            const value = Array.isArray(event.detail.value)
                ? [...event.detail.value]
                : event.detail.value;
            Object.defineProperty(projectTuple.project, updatedConfig.key, {
                value: value,
                writable: true,
                enumerable: true,
                configurable: true
            });
            projectTuple.project.update();
        } else {
            const descriptor = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                updatedConfig.key
            );
            if (descriptor?.value) {
                descriptor.value();
                projectTuple.project.update();
            }
        }
    }

    // A little dark magic to get the properly typed initial value for a given param
    function initialValueForParam<T extends ParamConfig>(paramConfig: T): ParamValueType<T> {
        const descriptor = Object.getOwnPropertyDescriptor(projectTuple.project, paramConfig.key);
        const value = descriptor?.value;
        // If it's an array, we need to copy it so that we don't mutate the original
        return (Array.isArray(value) ? [...value] : value) as ParamValueType<T>;
    }
</script>

<div class="params-wrapper">
    <!-- Put all params with no section at the top -->
    <div class="params-grid">
        {#each noSectionParams as param, paramIdx}
            <ParamItem
                config={param}
                value={initialValueForParam(param)}
                even={paramIdx % 2 == 0}
                on:update={paramUpdated}
            />
        {/each}
    </div>

    <!-- Display a section for each param section -->
    {#each paramSections as paramSection}
        <div class="params-section">
            <div class="params-section-header">
                <div class="params-section-header-line" />
                <div class="params-section-name">{paramSection.name}</div>
                <div class="params-section-header-line" />
            </div>
            <div class="params-grid">
                {#each paramSection.params as param, paramIdx}
                    <ParamItem
                        config={param}
                        value={initialValueForParam(param)}
                        even={paramIdx % 2 == 0}
                        on:update={paramUpdated}
                    />
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    .params-wrapper {
        flex-grow: 1;
        padding: calc($panel-section-spacing / 2) 0;

        // Fade out edges
        mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) calc($panel-section-spacing / 2),
            rgba(0, 0, 0, 1) calc(100% - $panel-section-spacing / 2),
            rgba(0, 0, 0, 0)
        );

        // Scroll with no scrollbar
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }

    // Webkit hide scrollbar
    .params-wrapper::-webkit-scrollbar {
        display: none;
    }

    .params-section {
        padding-top: $parameter-section-gap;

        // If it's the first child in params-wrapper, no top padding
        .params-wrapper > &:first-child {
            padding-top: 0;
        }
    }

    .params-section-header {
        @include param-section-header;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: $parameter-item-spacing-horizontal;
    }

    .params-section-header-line {
        flex-grow: 1;
        height: 0;
        border-top: $parameter-section-divider;
    }

    .params-grid {
        display: grid;
        grid-template-columns: fit-content($parameter-label-max-width) 1fr;
        row-gap: $parameter-item-spacing-vertical;
        align-items: center;
    }
</style>
