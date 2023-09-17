<script>
    import SettingsContent from './SettingsContent.svelte';
    import PanelHeader from '../Panels/PanelHeader.svelte';
    import Panel from '../Panels/Panel.svelte';
    import { content } from '../../../config/content';
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
