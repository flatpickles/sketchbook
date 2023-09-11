<script>
    import SettingsContent from './SettingsContent.svelte';
    import PanelHeader from '../PanelHeader.svelte';
    import Panel from '../Panel.svelte';
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
