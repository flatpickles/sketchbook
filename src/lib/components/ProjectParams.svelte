<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import { type ParamConfig, getParamSections } from '$lib/base/ParamConfig/ParamConfig';
    import { ParamGuards, type ParamValueType } from '$lib/base/ParamConfig/ParamTypes';
    import UserFileLoader from '$lib/base/Util/FileParamLoader';

    import ParamItem from './ParamItem/ParamItem.svelte';
    import ParamValueProvider from '$lib/base/Util/ParamValueProvider';

    export let projectTuple: ProjectTuple;
    $: [noSectionParams, paramSections] = getParamSections(projectTuple.params);
    const dispatch = createEventDispatcher();

    // Apply the updated param (or call the associated function)
    async function paramUpdated(event: CustomEvent) {
        const updatedConfig: ParamConfig = event.detail.config;

        // Update the project's value for this key, or call the named function
        if (ParamGuards.isFunctionParamConfig(updatedConfig)) {
            // If it's a function param, call the associated function
            const descriptor = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                updatedConfig.key
            );
            if (descriptor?.value) {
                await descriptor.value();
            }
        } else if (ParamGuards.isFileParamConfig(updatedConfig)) {
            // If it's a file param, load the file(s) then call the associated function
            try {
                // Load the file(s)
                const fileList: FileList = event.detail.value;
                const fileLoadResult = await UserFileLoader.loadFileList(fileList, updatedConfig);

                // Call the function with the loaded file(s)
                const descriptor = Object.getOwnPropertyDescriptor(
                    projectTuple.project,
                    updatedConfig.key
                );
                if (descriptor?.value) {
                    await descriptor.value(fileLoadResult.result, fileLoadResult.metadata);
                }
            } catch (e) {
                console.error(e);
                alert('Error loading file(s). See console for details.');
            }
        } else {
            // If it's an array, we need to copy it so that we don't mutate the original
            const value: ParamValueType<typeof updatedConfig> = Array.isArray(event.detail.value)
                ? [...event.detail.value]
                : event.detail.value;
            Object.defineProperty(projectTuple.project, updatedConfig.key, {
                value: value,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ParamValueProvider.setValue(updatedConfig, projectTuple.config.title, value);
        }

        // Dispatch updated event - project.update() is called in ProjectViewer
        dispatch('paramupdated', {
            updatedProject: projectTuple.project,
            paramKey: updatedConfig.key
        });
    }

    // Get the properly typed initial value for a given param
    function initialValueForParam<T extends ParamConfig>(paramConfig: T): ParamValueType<T> {
        const objectValue = Object.getOwnPropertyDescriptor(
            projectTuple.project,
            paramConfig.key
        )?.value;

        // If it's an array, we need to copy it so that we don't mutate the original
        return Array.isArray(objectValue) ? [...objectValue] : objectValue;
    }
</script>

<div class="params-wrapper">
    <!-- Put all params with no section at the top -->
    {#if noSectionParams.length > 0}
        <div class="params-grid" data-testid="no-section-params">
            {#each noSectionParams as param, paramIdx}
                <!-- Even/odd is one-indexed -->
                <ParamItem
                    config={param}
                    value={initialValueForParam(param)}
                    even={paramIdx % 2 == 1}
                    on:update={paramUpdated}
                />
            {/each}
        </div>
    {/if}

    <!-- Display a section for each param section -->
    {#each paramSections as paramSection}
        <div class="params-section" data-testid="params-section">
            <div class="params-section-header">
                <div class="params-section-header-line" />
                <div class="params-section-name">{paramSection.name}</div>
                <div class="params-section-header-line" />
            </div>
            <div class="params-grid">
                {#each paramSection.params as param, paramIdx}
                    <!-- Even/odd is one-indexed -->
                    <ParamItem
                        config={param}
                        value={initialValueForParam(param)}
                        even={paramIdx % 2 == 1}
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
