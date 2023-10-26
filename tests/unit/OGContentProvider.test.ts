import { describe, it, expect, vi } from 'vitest';
import OGContentProvider from '$lib/base/Util/OGContentProvider';
import { content } from '$config/content';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';

// Mock OGContentProvider.allOgImages
const allOgImages = ['image.png', 'image2.png'];
OGContentProvider.allOgImages = vi.fn(() => allOgImages);

describe('OGContentProvider', () => {
    it('returns top-level content when everything is defined', () => {
        content.openGraphContent.siteName = 'siteName';
        content.openGraphContent.title = 'title';
        content.openGraphContent.description = 'description';
        content.openGraphContent.image = 'image.png';
        content.openGraphContent.url = 'https://example.com';
        content.openGraphContent.author = 'author';
        content.openGraphContent.locale = 'locale';

        const topContent = OGContentProvider.top('https://example.com');
        expect(topContent.siteName).toBe('siteName');
        expect(topContent.title).toBe('title');
        expect(topContent.description).toBe('description');
        expect(topContent.image).toBe('https://example.com/og/image.png');
        expect(topContent.url).toBe('https://example.com');
        expect(topContent.author).toBe('author');
        expect(topContent.locale).toBe('locale');
        expect(topContent.publishedTime).toBeUndefined();
    });

    it('returns top-level content when only some things are defined', () => {
        content.openGraphContent.siteName = 'siteName';
        content.openGraphContent.title = 'title';
        content.openGraphContent.description = 'description';
        content.openGraphContent.image = 'notAnImage.png';
        content.openGraphContent.url = '';
        content.openGraphContent.author = '';
        content.openGraphContent.locale = '';

        const topContent = OGContentProvider.top('http://example.com');
        expect(topContent.siteName).toBe('siteName');
        expect(topContent.title).toBe('title');
        expect(topContent.description).toBe('description');
        expect(topContent.image).toBeUndefined();
        expect(topContent.url).toBe('http://example.com');
        expect(topContent.author).toBeUndefined();
        expect(topContent.locale).toBeUndefined();
        expect(topContent.publishedTime).toBeUndefined();
    });

    it('returns project-level content when everything is defined', () => {
        content.openGraphContent.siteName = 'siteName';
        content.openGraphContent.title = 'title';
        content.openGraphContent.description = 'description';
        content.openGraphContent.image = 'image.png';
        content.openGraphContent.url = 'https://example.com';
        content.openGraphContent.author = 'author';
        content.openGraphContent.locale = 'locale';

        const projectDate = new Date();
        const projectConfig = {
            ...ProjectConfigDefaults,
            title: 'projectTitle',
            description: 'projectDescription',
            ogImage: 'image2.png',
            date: projectDate
        };
        const projectContent = OGContentProvider.project(
            'https://example.com',
            'projectKey',
            projectConfig
        );
        expect(projectContent.siteName).toBe('siteName');
        expect(projectContent.title).toBe('projectTitle');
        expect(projectContent.description).toBe('projectDescription');
        expect(projectContent.image).toBe('https://example.com/og/image2.png');
        expect(projectContent.url).toBe('https://example.com/projectKey');
        expect(projectContent.author).toBe('author');
        expect(projectContent.locale).toBe('locale');
        expect(projectContent.publishedTime).toBe(projectDate.toISOString());
    });

    it('returns project-level content when only some things are defined', () => {
        content.openGraphContent.siteName = 'siteName';
        content.openGraphContent.title = 'title';
        content.openGraphContent.description = 'description';
        content.openGraphContent.image = 'notAnImage1.png';
        content.openGraphContent.url = '';
        content.openGraphContent.author = '';
        content.openGraphContent.locale = '';

        const projectConfig = {
            ...ProjectConfigDefaults,
            title: 'projectTitle',
            ogImage: 'notAnImage2.png'
        };
        const projectContent = OGContentProvider.project(
            'http://example.com/projectKey?query=string',
            'projectKey',
            projectConfig
        );
        expect(projectContent.siteName).toBe('siteName');
        expect(projectContent.title).toBe('projectTitle');
        expect(projectContent.description).toBeUndefined();
        expect(projectContent.image).toBeUndefined();
        expect(projectContent.url).toBe('http://example.com/projectKey');
        expect(projectContent.author).toBeUndefined();
        expect(projectContent.locale).toBeUndefined();
        expect(projectContent.publishedTime).toBeUndefined();
    });
});
