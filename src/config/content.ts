// Project list header content
const title = 'Sketchbook';
const subtitle = `Demo Content`;
const description = `This is a demo deployment of <a href="https://github.com/flatpickles/sketchbook">Sketchbook</a>. Find code for each of these demo projects <a href="https://github.com/flatpickles/sketchbook/tree/demo/src/art">here</a>!`;

// Project list footer content (use empty string to omit)
const footer = `Drive slow, code fast.`;
const leftButtonIcon = `fa-brands fa-github`;
const leftButtonLink = `https://github.com/flatpickles/sketchbook/tree/demo`;

// Show panel buttons (visible when panels are hidden)
const projectListIcon = 'fa-solid fa-bars';
const projectDetailIcon = 'fa-solid fa-sliders';

// Settings panel content
const settingsTitle = 'Demo Settings';
const settingsDescription = `In the Sketchbook demo deployment (this site), all available settings are configurable below. In your own deployment, you can choose which settings to include and which to omit.`;
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
