module.exports = {
  siteMetadata: {
    title: 'cborchert.blog',
    description:
      "Chris Borchert's blog about javascript, react, and web development",
    keywords: 'javascript, react, web development, Chris, Borchert',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content`,
        name: 'content',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    `gatsby-remark-copy-linked-files`,

    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          // `Merriweather\:300,400,400i,700,700i`,
          // `Raleway\:300,400,400i,700,700i`,
          // `Lato\:300,400,400i,700,700i`,
          `Open Sans\:300,400,400i,700,700i`,

          `Playfair Display\:300,400,400i,700,700i`,
          // `Noto Serif\:300,400,400i,700,700i`,
          // `Crimson Text\:300,400,400i,700,700i`,

          // `Roboto Mono\:300,400,400i,700,700i`,
          // `Roboto Slab\:300,400,400i,700,700i`,
          // `Bree Serif\:300,400,400i,700,700i`,
          // `Slabo\:300,400,400i,700,700i`,
          // `Sanchez\:300,400,400i,700,700i`,
          // `Vidaloka\:300,400,400i,700,700i`,
          // `Martel\:300,400,400i,700,700i`,
          // `Glegoo\:300,400,400i,700,700i`,
          // `Port Lligat Slab\:300,400,400i,700,700i`,
          // `PT Mono\:300,400,400i,700,700i`,
          `Ubuntu Mono\:300,400,400i,700,700i`,
          // `IBM Plex Mono\:300,400,400i,700,700i`,
          // `Oxygen Mono\:300,400,400i,700,700i`,
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-component',
          `gatsby-remark-katex`,
          {
            resolve: 'gatsby-remark-emojis',
            options: {
              // Deactivate the plugin globally (default: true)
              active: true,
              // Add a custom css class
              class: 'emoji-icon',
              // Select the size (available size: 16, 24, 32, 64)
              size: 64,
              // Add custom styles
              styles: {
                display: 'inline',
                margin: '0',
                'margin-top': '1px',
                position: 'relative',
                top: '5px',
                width: '25px',
              },
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: null,
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers alongside the code.
              // To use it, add the following line in src/layouts/index.js
              // right after importing the prism color scheme:
              //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
              // Defaults to false.
              showLineNumbers: false,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1080,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#2980b9',
        theme_color: '#2980b9',
        display: 'minimal-ui',
        icon: 'src/assets/images/favicon-96x96.png', // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-54263803-2',
        head: false,
        anonymize: true,
        respectDNT: true,
        cookieDomain: 'cborchert.blog',
      },
    },
    {
      resolve: `gatsby-plugin-node-fields`,
      options: {
        // Your list of descriptors
        descriptors: [
          {
            predicate: node =>
              node.internal && node.internal.type === 'MarkdownRemark',
            fields: [
              {
                name: 'private',
                getter: node =>
                  node.frontmatter.draft || node.frontmatter.private,
                defaultValue: false,
              },
              {
                name: 'tags',
                getter: node => node.frontmatter.tags,
                defaultValue: null,
              },
              {
                name: 'category',
                getter: node => node.frontmatter.category,
                defaultValue: null,
              },
            ],
          },
        ],
      },
    },
  ],
}
