import type { ProjectConfig } from '../ConfigModels/ProjectConfig';
import { content } from '$config/content';

// Vite's meta.glob function doesn't allow for dynamic paths, so we import all potential images
const topLevelImageImport = import.meta.glob('/src/art/*.(png|jpg|jpeg|gif)', {
    as: 'url',
    eager: true
});
const projectImageImport = import.meta.glob('/src/art/*/*.(png|jpg|jpeg|gif)', {
    as: 'url',
    eager: true
});

// The top image is used as the default OG image, and fall-back for project images
let topImageUrl: string | undefined = undefined;
for (const entry of Object.entries(topLevelImageImport)) {
    const imageUrlComponents = entry[0].split('/').slice(-1);
    if (imageUrlComponents.length < 1) continue;
    const imageName = imageUrlComponents[0];
    if (imageName.includes(content.openGraphContent.imageName)) {
        topImageUrl = entry[0];
    }
}

// Project images are used as the OG image for each project
const projectImageUrls: Record<string, string> = {};
for (const entry of Object.entries(projectImageImport)) {
    const imageUrlComponents = entry[0].split('/').slice(-2);
    if (imageUrlComponents.length < 2) continue;
    const projectKey = imageUrlComponents[0];
    const imageName = imageUrlComponents[1];
    if (imageName.includes(content.openGraphContent.imageName)) {
        projectImageUrls[projectKey] = entry[0];
    }
}

export type OGContent = {
    title: string;
    siteName: string;
    locale?: string;
    description?: string;
    image?: string;
    url?: string;
    author?: string;
};

export default class OGContentGen {
    static top(): OGContent {
        return {
            title: content.openGraphContent.title,
            description: content.openGraphContent.description,
            url: content.openGraphContent.url,
            image: topImageUrl,
            siteName: content.openGraphContent.siteName,
            locale: content.openGraphContent.locale,
            author: content.openGraphContent.author
        };
    }

    static project(projectKey: string, projectConfig: ProjectConfig): OGContent {
        return {
            title: projectConfig.title,
            description: projectConfig.description,
            url: content.openGraphContent.url,
            image: projectImageUrls[projectKey],
            siteName: content.openGraphContent.siteName,
            locale: content.openGraphContent.locale,
            author: content.openGraphContent.author
        };
    }
}
