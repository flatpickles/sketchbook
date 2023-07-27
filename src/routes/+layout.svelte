<script lang="ts">
    import '../app.postcss';
    import 'ress';
</script>

<slot />

<style lang="scss">
    :global(body) {
        font-family: $font-family;
    }

    :global(a) {
        @include link-style;
    }
</style>
