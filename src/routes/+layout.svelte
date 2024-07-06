<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import MainView from '$lib/components/MainView/MainView.svelte';
    import 'ress';
    import { onMount, setContext } from 'svelte';
    import type { LayoutData } from './$types';

    export let data: LayoutData;
    $: selectedProjectKey = $page.url.pathname.split('/')[1];

    // Set a context flag if page was redirected via URL param
    let pageRedirected = $page.url.searchParams.get('redirect') != undefined;
    setContext('pageRedirected', pageRedirected);

    // Remove redirect param
    onMount(() => {
        if (pageRedirected) {
            const url = new URL($page.url);
            url.searchParams.delete('redirect');
            goto(url.toString(), { replaceState: true });
        }
    });
</script>

<MainView projectConfigs={data.projects} {selectedProjectKey}>
    <slot />
</MainView>

<style lang="scss">
    :global(html) {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: $container-bg-color;
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

    :global(textarea, input, select, button) {
        @include input-style;
    }
</style>
