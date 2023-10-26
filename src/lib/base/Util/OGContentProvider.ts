import type { ProjectConfig } from '../ConfigModels/ProjectConfig';
import { content } from '$config/content';

export type OGContent = {
    title: string;
    siteName: string;
    locale?: string;
    description?: string;
    image?: string;
    url?: string;
    author?: string;
};

export default class OGContentProvider {
    static top(requestUrl: string): OGContent {
        const baseUrl = this.#getBaseUrl(content.openGraphContent.url ?? requestUrl);
        const imageUrl = content.openGraphContent.image
            ? baseUrl + '/og/' + content.openGraphContent.image
            : undefined;

        return {
            title: content.openGraphContent.title,
            description: this.#removeHtml(content.openGraphContent.description),
            url: baseUrl,
            image: imageUrl,
            siteName: content.openGraphContent.siteName,
            locale: content.openGraphContent.locale,
            author: content.openGraphContent.author
        };
    }

    static project(
        requestUrl: string,
        projectKey: string,
        projectConfig: ProjectConfig
    ): OGContent {
        const baseUrl = this.#getBaseUrl(content.openGraphContent.url ?? requestUrl);
        const projectUrl = baseUrl + '/' + projectKey;
        const imageUrl = projectConfig.ogImage
            ? baseUrl + '/og/' + projectConfig.ogImage
            : undefined;

        return {
            title: projectConfig.title,
            description: projectConfig.description
                ? this.#removeHtml(projectConfig.description)
                : undefined,
            url: projectUrl,
            image: imageUrl,
            siteName: content.openGraphContent.siteName,
            locale: content.openGraphContent.locale,
            author: content.openGraphContent.author
        };
    }

    static #getBaseUrl(fullUrl: string): string {
        const noProtocol = fullUrl.replace(/^.*\/\//, '');
        const noPath = noProtocol.replace(/\/.*$/, '');
        return 'http://' + noPath;
    }

    static #removeHtml(html: string): string {
        return html.replace(/<[^>]*>?/gm, '');
    }
}
