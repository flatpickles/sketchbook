<script lang="ts">
    import '../app.postcss';
    import 'ress';
</script>

<div class="page-wrapper">
    <slot />
</div>

<style lang="scss">
    .page-wrapper {
        font-family: $font-family;
    }
</style>
