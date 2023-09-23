<script lang="ts">
    import 'ress';
</script>

<slot />

<style lang="scss">
    :global(html) {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #000; // header on mobile safari
        box-sizing: content-box; // unset non-standard box-sizing: border-box (ress)
    }

    :global(body) {
        font-family: $font-family;
        height: 100%;
        overflow: hidden;
    }

    :global(a) {
        @include link-style;
    }
</style>
