<script lang="ts">
    import { userSettingsLabels } from '$config/settings';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { getContext } from 'svelte';
    import { get } from 'svelte/store';
    import ParamItem from '../ProjectDetailPanel/ParamItem.svelte';

    import { content } from '$config/content';
    import type { ParamConfig } from '$lib/base/ConfigModels/ParamConfig';
    import {
        type AnyParamValueType,
        ParamGuards,
        type ParamValueType
    } from '$lib/base/ConfigModels/ParamTypes';
    import { CanvasRecorder } from '$lib/base/Util/CanvasRecorder';
    import FunctionInput from '../Inputs/FunctionInput.svelte';
    import FrameSeqControls from './FrameSeqControls.svelte';
    import {
        captureImageConfig,
        captureImageConfigKey,
        captureVideoConfig,
        captureVideoConfigKey,
        disableWhileRecording,
        settingsParamConfigs
    } from './SettingsParamConfigs';

    const canvasRecorder: CanvasRecorder | undefined = getContext('canvasRecorder');

    // Settings value configs are backed by values in the AppStateStore object
    const settingsValueConfigs = Object.keys(userSettingsLabels).map((key) => {
        const config = settingsParamConfigs.find((config) => config.key === key);
        if (!config) throw new Error(`No settings param config found for key ${key}`);
        return config;
    });

    // Reset sketchbook with reset button click
    function resetSketchbook() {
        // Clear localStorage
        localStorage.clear();

        // Clear cookies
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

        // Reload the page
        location.reload();
    }

    // Update settings in the backing app state store when a param is updated
    function paramUpdated(event: CustomEvent) {
        const updatedConfig: ParamConfig = event.detail.config;
        if (updatedConfig.key === captureVideoConfigKey) {
            toggleRecording();
        } else if (updatedConfig.key === captureImageConfigKey) {
            if (!canvasRecorder) throw new Error('Canvas recorder is undefined');
            canvasRecorder.saveImage();
        } else if (ParamGuards.isFunctionParamConfig(updatedConfig)) {
            throw new Error("Function params shouldn't be present in the settings panel");
        } else {
            const value = event.detail.value;
            const newState = {
                ...get(settingsStore),
                [updatedConfig.key]: value
            };
            settingsStore.set(newState);
            // todo: cookies warning
        }
    }

    // Get the properly typed initial value for a given param
    function initialValueForParam<T extends ParamConfig>(paramConfig: T): ParamValueType<T> {
        const currentSettings: Record<string, AnyParamValueType> = get(settingsStore);
        return currentSettings[paramConfig.key] as ParamValueType<T>;
    }

    // Canvas recording stuff!
    let isRecording = canvasRecorder ? canvasRecorder.isRecording : false;
    async function toggleRecording() {
        isRecording = !isRecording;
        try {
            if (!canvasRecorder) throw new Error('Canvas recorder is undefined');
            if (isRecording) {
                canvasRecorder.startVideo();
            } else {
                await canvasRecorder.stopVideo();
            }
        } catch (e) {
            console.error('Error toggling recording:', e);
            alert(
                `Error ${
                    isRecording ? 'starting' : 'stopping'
                } canvas recording. Please check the console.`
            );
            isRecording = false;
        }
    }
</script>

<div class="settings-wrapper">
    <div class="settings-grid">
        {#each settingsValueConfigs as param, i}
            <ParamItem
                config={param}
                value={initialValueForParam(param)}
                even={i % 2 === 1}
                disabled={isRecording && disableWhileRecording.includes(param.key)}
                on:update={paramUpdated}
            />
        {/each}
    </div>
    <div class="recording-header">
        Canvas Recording
        <a href="https://skbk.cc/#/necessities?id=exporting-photos-amp-videos" target="_blank">
            <i class="fa-solid fa-circle-info recording-info" />
        </a>
    </div>
    <div class="settings-grid">
        <ParamItem
            config={captureImageConfig}
            value={undefined}
            even={false}
            disabled={false}
            on:update={paramUpdated}
        />
        <ParamItem
            config={captureVideoConfig(isRecording)}
            value={undefined}
            even={true}
            disabled={false}
            on:update={paramUpdated}
        />
        <div class="frames-label-wrapper">
            <span class="frames-label">Frame Sequence</span>
        </div>
        <FrameSeqControls />
    </div>
    <div class="settings-footer">
        <div class="reset-wrapper">
            <FunctionInput
                id="reset-sketchbook"
                name={content.resetButtonLabel}
                buttonText={content.resetButtonLabel}
                on:click={resetSketchbook}
            />
        </div>
        {#if content.cookiesWarning?.length}
            <div class="cookies-warning">
                <p>{@html content.cookiesWarning}</p>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .settings-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: calc($panel-section-spacing / 2) 0;
        row-gap: $panel-section-spacing;

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
    .settings-wrapper::-webkit-scrollbar {
        display: none;
    }

    .settings-grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: $param-spacing;
        align-items: center;
    }

    .recording-header {
        width: 100%;
        display: flex;
        gap: $panel-section-spacing;
        font-size: $large-text-size;
        font-weight: bold;
        padding-left: $panel-content-inset;
    }

    .recording-info {
        color: rgba($panel-fg-color, 0.5);
    }

    .frames-label-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: left;
        overflow: hidden;

        @include parameter-item;
        padding-right: calc($param-inner-spacing / 2);
        margin-right: 0;
        border-radius: $param-border-radius 0 0 $param-border-radius;
        background-color: rgba($panel-fg-color, $param-bg-opacity-odd);
    }

    .frames-label {
        white-space: nowrap;
        text-align: left;
        pointer-events: none;
        overflow: hidden;
        text-overflow: ellipsis;

        @include parameter-label;
    }

    .settings-footer {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: $panel-section-spacing;
        margin: 0 $overlay-panel-edge-inset;
        padding-bottom: calc($panel-section-spacing - $panel-section-spacing / 2);
    }

    .cookies-warning {
        font-size: $small-text-size;
        text-align: center;
        opacity: 0.5;
        padding: 0 $overlay-panel-edge-inset; // A lil extra looks nice
    }
</style>
