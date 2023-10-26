import type { ProjectConfig } from '../ConfigModels/ProjectConfig';
import { content } from '$config/content';

export type OGContent = {
    title: string;
    siteName: string;
    url: string;
    locale?: string;
    description?: string;
    image?: string;
    author?: string;
    publishedTime?: string;
};

export default class OGContentProvider {
    static allOgImages(): string[] {
        const staticOgImageImport = import.meta.glob('/static/og/*.(png|jpg|jpeg|gif)', {
            as: 'url',
            eager: true
        });
        const allOgImages = Object.keys(staticOgImageImport).map((path) => {
            const pathComponents = path.split('/');
            return pathComponents.pop() || path;
        });
        return allOgImages;
    }

    static top(requestUrl: string): OGContent {
        const baseUrl = this.#getBaseUrl(
            content.openGraphContent.url.length > 0 ? content.openGraphContent.url : requestUrl
        );
        const imageUrl =
            content.openGraphContent.image &&
            this.allOgImages().includes(content.openGraphContent.image)
                ? baseUrl + '/og/' + content.openGraphContent.image
                : undefined;

        return {
            title: content.openGraphContent.title,
            siteName: content.openGraphContent.siteName,
            url: baseUrl,
            locale: this.#undefinedIfEmpty(content.openGraphContent.locale),
            description: this.#removeHtml(content.openGraphContent.description),
            image: imageUrl,
            author: this.#undefinedIfEmpty(content.openGraphContent.author)
        };
    }

    static project(
        requestUrl: string,
        projectKey: string,
        projectConfig: ProjectConfig
    ): OGContent {
        const baseUrl = this.#getBaseUrl(
            content.openGraphContent.url.length > 0 ? content.openGraphContent.url : requestUrl
        );
        const projectUrl = baseUrl + '/' + projectKey;
        const imageUrl =
            projectConfig.ogImage && this.allOgImages().includes(projectConfig.ogImage)
                ? baseUrl + '/og/' + projectConfig.ogImage
                : undefined;

        return {
            title: projectConfig.title,
            siteName: content.openGraphContent.siteName,
            url: projectUrl,
            locale: this.#undefinedIfEmpty(content.openGraphContent.locale),
            description: projectConfig.description
                ? this.#removeHtml(projectConfig.description)
                : undefined,
            image: imageUrl,
            author: this.#undefinedIfEmpty(content.openGraphContent.author),
            publishedTime: projectConfig.date?.toISOString()
        };
    }

    static #undefinedIfEmpty(value: string): string | undefined {
        return value === '' ? undefined : value;
    }

    static #getBaseUrl(fullUrl: string): string {
        const noProtocol = fullUrl.replace(/^.*\/\//, '');
        const protocol = fullUrl.replace(noProtocol, '');
        const noPath = noProtocol.replace(/\/.*$/, '');
        return protocol + noPath;
    }

    static #removeHtml(html: string): string {
        return html.replace(/<[^>]*>?/gm, '');
    }
}
