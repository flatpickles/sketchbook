<script lang="ts">
    import { frameRecorderStore } from '$lib/base/Util/AppState';
    import { FrameRecorder } from '$lib/base/Util/FrameRecorder';
    import { getContext, onMount } from 'svelte';
    import FunctionInput from '../Inputs/FunctionInput.svelte';
    import NumberInput from '../Inputs/NumberInput.svelte';

    const frameRecorder: FrameRecorder | undefined = getContext('frameRecorder');

    $: framesToRecord = ($frameRecorderStore.durationMs / 1000) * $frameRecorderStore.fps;
    let recording = false;

    onMount(() => {
        if (frameRecorder) {
            frameRecorder.onStart(() => {
                recording = true;
            });
            frameRecorder.onStop(() => {
                recording = false;
            });
        }
    });

    function start() {
        if (frameRecorder) {
            frameRecorder.startRecording(framesToRecord);
        }
    }
</script>

<div class="frame-recorder-container">
    <div class="frame-recorder-controls">
        <div class="frame-recorder-control">
            <div class="frame-recorder-control-label">Start (ms):</div>
            <div>
                <NumberInput
                    id="start-time"
                    name="Start Time"
                    min={0}
                    max={1000000}
                    step={1}
                    showSlider={false}
                    disabled={recording}
                    bind:value={$frameRecorderStore.startTimeMs}
                />
            </div>
        </div>
        <div class="frame-recorder-control">
            <div class="frame-recorder-control-label">Duration:</div>
            <div>
                <NumberInput
                    id="duration"
                    name="Duration"
                    min={0}
                    max={1000000}
                    step={1}
                    showSlider={false}
                    disabled={recording}
                    bind:value={$frameRecorderStore.durationMs}
                />
            </div>
        </div>
        <div class="frame-recorder-control">
            <div class="frame-recorder-control-label">FPS:</div>
            <div>
                <NumberInput
                    id="framerate"
                    name="Framerate"
                    min={1}
                    max={100}
                    step={1}
                    showSlider={false}
                    disabled={recording}
                    bind:value={$frameRecorderStore.fps}
                />
            </div>
        </div>
        <div>
            <FunctionInput
                id="frame-recorder-function"
                name="Frame Recorder Function"
                disabled={recording}
                on:click={start}
                buttonText="Go!"
            />
        </div>
    </div>
</div>

<style lang="scss">
    .frame-recorder-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $panel-header-spacing;

        @include parameter-item;
        padding-left: calc($param-inner-spacing / 2);
        margin-left: 0;
        border-radius: 0 $param-border-radius $param-border-radius 0;
        background-color: rgba($panel-fg-color, $param-bg-opacity-odd);
    }

    .frame-recorder-controls {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: $param-padding;
    }

    .frame-recorder-control {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .frame-recorder-control-label {
        @include parameter-label;
        font-size: $xs-text-size;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
