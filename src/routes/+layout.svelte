<script lang="ts">
    import 'ress';
</script>

<slot />

<style lang="scss">
    :global(html) {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    :global(body) {
        font-family: $font-family;
        height: 100%;
    }

    :global(a) {
        @include link-style;
    }
</style>
