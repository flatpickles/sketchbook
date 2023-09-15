<script lang="ts">
    import 'ress';
</script>

<slot />

<style lang="scss">
    :global(html) {
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: content-box; // unset non-standard box-sizing: border-box (ress)
        background-color: black; // for header on mobile safari, and behind transparent canvases
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
