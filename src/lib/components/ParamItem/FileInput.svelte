<script lang="ts">
    import { FileParamConfigDefaults } from '$lib/base/ParamConfig/FileParamConfig';

    export let multiple = FileParamConfigDefaults.multiple;
    export let accept = FileParamConfigDefaults.accept;

    const noFilesText = 'No selection';
    const multipleFilesText = 'Multiple selected';
    const selectionErrorText = 'Selection error';

    let selectedFiles: FileList;
    let displayedFileName: string = noFilesText;

    function changed() {
        if (selectedFiles.length === 0) {
            displayedFileName = noFilesText;
        } else if (selectedFiles.length === 1) {
            displayedFileName = selectedFiles.item(0)?.name ?? selectionErrorText;
        } else {
            displayedFileName = multipleFilesText;
        }
    }
</script>

<div class="file-input-wrapper">
    <input
        id="native-file-input"
        type="file"
        bind:files={selectedFiles}
        on:change={changed}
        {multiple}
        {accept}
    />
    <input class="file-name-field" type="text" bind:value={displayedFileName} readonly />
    <label class="file-button" for="native-file-input"><i class="fa fa-file" /></label>
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
    }

    #native-file-input {
        display: none;
    }
</style>
