<script>
    import { content } from '$config/content';
    import { settingsStore } from '$lib/base/Util/AppState';
    import Panel from '../Panels/Panel.svelte';
    import PanelHeader from '../Panels/PanelHeader.svelte';
    import ModContent from './ModContent.svelte';
</script>

<Panel style={$settingsStore.overlayPanels ? 'overlay' : 'right-fill'}>
    <PanelHeader
        title={'Mod Panel'}
        description={content.settingsDescription}
        headerButtonIcon="fa-close"
        on:headeraction
    />
    <ModContent />
</Panel>
