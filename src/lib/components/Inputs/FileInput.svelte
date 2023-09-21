<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { FileParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/FileParamConfig';

    export let name: string;
    export let key: string;
    export let multiple = FileParamConfigDefaults.multiple;
    export let accept = FileParamConfigDefaults.accept;
    export let selectedFiles: FileList | undefined = undefined;
    export let disabled = false;

    const noFilesText = multiple ? 'Select files...' : 'Select file...';
    const multipleFilesText = 'Multiple selected';
    const selectionErrorText = 'Selection error';
    const faIcon = (() => {
        const acceptImage = accept?.includes('image');
        const acceptVideo = accept?.includes('video');
        const acceptAudio = accept?.includes('audio');
        if (acceptImage && !acceptVideo && !acceptAudio) return 'fa fa-file-image';
        if (!acceptImage && acceptVideo && !acceptAudio) return 'fa fa-file-video';
        if (!acceptImage && !acceptVideo && acceptAudio) return 'fa fa-file-audio';
        return 'fa-file';
    })();

    let displayedFileName: string = noFilesText;
    let nativeFileInput: HTMLInputElement;
    $: nativeInputID = key + '-file-input';
    $: textInputID = key + '-file-name-field';

    const dispatch = createEventDispatcher();
    function fileInputEvent() {
        const firstSelection = selectedFiles?.item(0)?.name;
        if (!selectedFiles || selectedFiles?.length === 0) {
            displayedFileName = noFilesText;
        } else if (selectedFiles?.length === 1 && firstSelection) {
            displayedFileName = firstSelection;
        } else if (selectedFiles?.length >= 1) {
            displayedFileName = multipleFilesText;
        } else {
            // Just in case...
            displayedFileName = selectionErrorText;
            return;
        }

        // Dispatch the update event
        dispatch('change', selectedFiles);
    }

    function nameInputClicked() {
        nativeFileInput.click();
    }
</script>

<div class="file-input-wrapper" id={name} data-testid="file-param-input">
    <input
        type="file"
        id={nativeInputID}
        class="native-file-input"
        {multiple}
        {accept}
        {disabled}
        bind:this={nativeFileInput}
        bind:files={selectedFiles}
        on:change={fileInputEvent}
        data-testid="native-file-input"
    />
    <input
        type="text"
        id={textInputID}
        class="file-name-field"
        readonly
        {disabled}
        bind:value={displayedFileName}
        on:click={nameInputClicked}
        data-testid="file-name-field"
    />
    <label
        class="file-button"
        class:disabled
        for={nativeInputID}
        data-testid="file-selector-button"
    >
        <i class="fa {faIcon}" />
    </label>
</div>

<style lang="scss">
    .file-input-wrapper {
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .file-name-field {
        @include string-parameter-input;
        width: 100%;
        border-radius: $field-input-border-radius 0 0 $field-input-border-radius;
        text-overflow: ellipsis;
    }

    .file-button {
        height: 100%;
        width: 100%;
        max-width: $param-input-item-min-width;
        border: $field-input-border;
        border-left: 0;
        border-radius: 0 $field-input-border-radius $field-input-border-radius 0;

        display: grid;
        place-items: center;
        font-size: $xs-text-size;
        background-color: $param-light-accent-color;
        color: $param-fg-color;
        cursor: pointer;
    }

    .native-file-input {
        display: none;
    }

    input:disabled {
        @include parameter-input-disabled;
    }

    label.disabled {
        @include parameter-input-disabled;
    }
</style>
