import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import MainView from '$lib/components/MainView.svelte';
import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import Project from '$lib/base/Project/Project';

const configs = {
    Untitled: ProjectConfigDefaults
};
const projectTuple = {
    key: 'Untitled',
    project: new Project(),
    props: ProjectConfigDefaults,
    params: []
};

describe('MainView', () => {
    afterEach(cleanup);

    it('renders main wrapper', async () => {
        render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        const wrapper = screen.getByTestId('main-wrapper');
        expect(wrapper).toBeDefined();
    });
});
