<div class="panel-container">
    <slot />
</div>

<style lang="scss">
    .panel-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        padding: 1rem;
        max-width: 10rem;
        width: 100%;

        background-color: #f0f;
        border-radius: 1rem;
        box-shadow: 0 0 1rem #777;
    }
</style>
