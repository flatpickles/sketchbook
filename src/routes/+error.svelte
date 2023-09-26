<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="error-wrapper">
    <div class="error-display">
        <div class="error-header">Error</div>
        <div class="error-message">{$page.error?.message}</div>
    </div>
</div>

<style lang="scss">
    .error-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .error-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        border: 2px solid #000;
    }

    .error-header {
        padding: 0.5rem;
        font-weight: bold;
        font-size: $title-text-size;
    }

    .error-message {
        padding: 1rem;
        border-top: 2px solid #000;
        font-size: $large-text-size;
    }
</style>
