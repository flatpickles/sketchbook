<script lang="ts">
    import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
    import { type ParamConfig, getParamSections } from '$lib/base/ConfigModels/ParamConfig';
    import {
        ParamGuards,
        type ParamValueType,
        type AnyParamValueType
    } from '$lib/base/ConfigModels/ParamTypes';
    import UserFileLoader from '$lib/base/Util/FileParamLoader';

    import ParamItem from './ParamItem.svelte';
    import ParamValueProvider from '$lib/base/ProjectLoading/ParamValueProvider';

    export let projectTuple: ProjectTuple;

    $: [noSectionParams, paramSections] = getParamSections(projectTuple.params);
    const incompleteUpdateKeys = new Set<string>();

    // Derive initial display values from the project's current values when switched. Employ some
    // Svelte trickery so this is only reactive to projectTuple reassignments, and not property
    // changes within it.
    let displayedValues = getDisplayedValues(projectTuple);
    function getDisplayedValues(currentTuple: ProjectTuple) {
        return Object.fromEntries(
            currentTuple.params.map((param) => {
                return [param.key, initialValueForParam(param)];
            })
        ) as { [key: string]: any };
    }
    $: projectSwitched(projectTuple);
    function projectSwitched(newTuple: ProjectTuple) {
        displayedValues = getDisplayedValues(newTuple);
    }

    // On each animation frame, check if any param values have diverged from their displayed values,
    // e.g. if they have been updated within a project. Keep both the UI and stored state in sync.
    $: displaySyncLoopEnabled = projectTuple.config.twoWaySync;
    $: if (displaySyncLoopEnabled) displaySyncLoop();
    function displaySyncLoop() {
        const currentValues = projectTuple.project as { [key: string]: any };
        for (const param of projectTuple.params) {
            // If the param is currently being updated, displayedValue is allowed to diverge
            if (incompleteUpdateKeys.has(param.key)) continue;

            // If the param is a function, we can't check for divergence
            const currentValue = currentValues[param.key];
            if (typeof currentValue === 'function') {
                continue;
            }

            // Check for divergence; arrays must be checked element-wise and copied
            let updatedValue: AnyParamValueType | undefined;
            if (Array.isArray(currentValue)) {
                const arrayEquality = currentValue.every(
                    (v: number, i: number) => v === displayedValues[param.key][i]
                );
                if (!arrayEquality) {
                    updatedValue = [...currentValue];
                }
            } else if (currentValue !== displayedValues[param.key]) {
                updatedValue = currentValue;
            }

            // If the value has diverged, update displayedValues and the ParamValueProvider
            if (updatedValue !== undefined) {
                displayedValues[param.key] = updatedValue;
                ParamValueProvider.setValue(param, projectTuple.key, displayedValues[param.key]);
            }
        }

        // Continue checking for divergence on each animation frame
        if (displaySyncLoopEnabled) requestAnimationFrame(displaySyncLoop);
    }

    // Apply the updated param (or call the associated function)
    async function paramUpdated(event: CustomEvent) {
        const updatedConfig: ParamConfig = event.detail.config;
        const updateComplete: boolean = event.detail.complete;

        // If the param update isn't complete and applyDuringInput isn't set, allow the UI value
        // to diverge from the project's value, and don't trigger an update.
        if (!updatedConfig.applyDuringInput && !updateComplete) {
            incompleteUpdateKeys.add(updatedConfig.key);
            return;
        }
        incompleteUpdateKeys.delete(updatedConfig.key);

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
            ParamValueProvider.setValue(updatedConfig, projectTuple.key, value);
        }

        // Invoke the paramChanged method for the current project
        projectTuple.project.paramChanged({ paramKey: updatedConfig.key });
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
                    bind:value={displayedValues[param.key]}
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
                        bind:value={displayedValues[param.key]}
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
        @if ($param-list-scroll-fade) {
            mask-image: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 1) calc($panel-section-spacing / 2),
                rgba(0, 0, 0, 1) calc(100% - $panel-section-spacing / 2),
                rgba(0, 0, 0, 0)
            );
        }

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
        gap: $param-inner-spacing;
    }

    .params-section-header-line {
        flex-grow: 1;
        height: 0;
        border-top: $parameter-section-divider;
    }

    .params-grid {
        display: grid;
        grid-template-columns: fit-content($param-label-max-width) 1fr;
        row-gap: $param-spacing;
        align-items: center;
    }
</style>
