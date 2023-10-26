# Content & Copy

Sketchbook ships with reasonable defaults, but you may wish to customize assorted text and other content that is displayed throughout the app. An example of customizable content is the title, subtitle, and description in the [demo deployment](https://demo.skbk.cc):

<img src="media/demo-content.png" style="width: 300px" />

App text, [Font Awesome](https://fontawesome.com/) icons, and other content can be customized within `src/config/content.ts`. See the `content.ts` file [on GitHub](https://github.com/flatpickles/sketchbook/blob/main/src/config/content.ts) or in your code editor for commented descriptions of each option, and configure your preferences by editing this file in your Sketchbook.

### Open Graph Content

Properties in `content.ts` are relatively self-explanatory, though perhaps with the exception of `openGraphContent`. Here you can set options that will be used for link previews in messaging and social platforms, using the [Open Graph protocol](https://ogp.me/). Options are follows:

-   **`siteName`**: The title of the whole site, e.g. "Sketchbook".
-   **`title`**: The title of the home page, returned only for the root URL. On project pages, this value will be overridden with the project's title.
-   **`description`**: A description of the home page, returned only for the root URL. On project pages, the project's description will be used instead.
-   **`image`**: An image file name for the link preview image. Sketchbook will look in the `static/og/` directory for an image with this name, and will serve that as the root URL's `og:image`, if the file exists. On project pages, the project's `ogImage` property will be used instead, as noted in the [project config docs](project-config.md).
-   **`url`**: The canonical base URL where your Sketchbook is deployed. Project-specific URLs will be generated with this base. If unspecified, request URLs will be parsed and used as Open Graph metadata.
-   **`author`**: Your name, if you'd like it to be available for project link previews.
-   **`locale`**: Your locale, if you'd like to specify.

### Favicon

You may also wish to change your Sketchbook's favicon from the default [OpenMoji icon](https://openmoji.org/library/emoji-1F5BC/). To do so, replace the related icon files in the `static` directory, following the helpful advice on [this page](https://medium.com/swlh/are-you-using-svg-favicons-yet-a-guide-for-modern-browsers-836a6aace3df).
