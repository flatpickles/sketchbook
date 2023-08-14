<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { FileParamConfigDefaults } from '$lib/base/ParamConfig/FileParamConfig';

    export let name: string;
    export let key: string;
    export let multiple = FileParamConfigDefaults.multiple;
    export let accept = FileParamConfigDefaults.accept;
    export let selectedFiles: FileList | undefined = undefined;

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
        id={nativeInputID}
        class="native-file-input"
        data-testid="native-file-input"
        type="file"
        {multiple}
        {accept}
        bind:files={selectedFiles}
        bind:this={nativeFileInput}
        on:change={fileInputEvent}
    />
    <input
        class="file-name-field"
        data-testid="file-name-field"
        type="text"
        readonly
        bind:value={displayedFileName}
        on:click={nameInputClicked}
    />
    <label class="file-button" data-testid="file-selector-button" for={nativeInputID}>
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
</style>
