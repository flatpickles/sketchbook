// Project list header content
const title = 'Sketchbook';
const subtitle = '';
const description = '';

// Project list footer content (use empty string to omit)
const footer = '';
const leftButtonIcon = 'fa-brands fa-github';
const leftButtonLink = 'https://github.com/flatpickles/sketchbook';

// Show panel buttons (visible when panels are hidden)
const projectListIcon = 'fa-solid fa-bars';
const projectDetailIcon = 'fa-solid fa-sliders';

// Settings panel content
const settingsTitle = 'Settings';
const settingsDescription = '';
const resetButtonLabel = 'Reset Sketchbook';
const cookiesWarning =
    'This site uses cookies to store settings. By changing values in the settings panel, you agree to the use of cookies.';

// Miscellany
const defaultPresetTitle = 'Default Values';

// Content used for OpenGraph tags
const openGraphContent = {
    siteName: title,
    title: title,
    description: description,
    image: 'index.png',
    url: '',
    author: '',
    locale: ''
};

// Export all content for use elsewhere in the app
export const content = {
    title,
    subtitle,
    description,
    footer,
    leftButtonIcon,
    leftButtonLink,
    projectListIcon,
    projectDetailIcon,
    settingsTitle,
    settingsDescription,
    resetButtonLabel,
    cookiesWarning,
    defaultPresetTitle,
    openGraphContent
};
