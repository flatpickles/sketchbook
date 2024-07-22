<script>
    import { content } from '$config/content';
    import Panel from '../Panels/Panel.svelte';
    import PanelHeader from '../Panels/PanelHeader.svelte';
    import SettingsContent from './SettingsContent.svelte';
</script>

<Panel>
    <PanelHeader
        title={content.settingsTitle}
        description={content.settingsDescription}
        headerButtonIcon="fa-close"
        on:headeraction
    />
    <SettingsContent />
</Panel>
