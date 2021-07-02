const { description } = require('../../package');
require('dotenv').config({
  path: '.env.local',
});
// require('dotenv').config()
const moment = require('moment');
// console.log(process.env.GITHUB_TOKEN);

const sidebar = require('./nav/sidebars.js');
// console.log('Sidebar Rest: ', sidebar.rest());

console.log('Sidebar Guides: ', sidebar.guides());
// console.log('Sidebar: ', sidebar.bar());

module.exports = (ctx) => ({
  chainWebpack: (config) => {
    config.module
      .rule('yaml')
      .test(/\.ya?ml?$/)
      .use('json-loader')
      .loader('json-loader')
      .end()
      .use('yaml-loader')
      .loader('yaml-loader');
  },
  head: [
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/icons/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/icons/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/icons/favicon-16x16.png',
      },
    ],
    // ['link', {
    //   rel: 'manifest',
    //   href: 'icons/site.webmanifest'
    // }],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: '#ff4731',
      },
    ],
    [
      'link',
      {
        rel: 'shortcut icon',
        href: '/icons/favicon.ico',
      },
    ],
    [
      'meta',
      {
        name: 'msapplication-TileColor',
        content: '#ff4731',
      },
    ],
    [
      'meta',
      {
        name: 'msapplication-config',
        content: '/icons/browserconfig.xml',
      },
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ff4731',
      },
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
  ],
  extend: '@vuepress/theme-default',
  // markdown: {
  //   extractHeaders: ['h2', 'h3', 'h4']
  // },
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Settle Developer Docs',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,
  // base: '/docs/',
  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: '/logo.svg',
    repo: 'SettleAPI/settle-developer-docs',
    docsBranch: 'dev',
    docsDir: 'docs',
    repoLabel: 'Contribute',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    searchPlaceholder: 'Press "/" to search..',
    // lastUpdated: true,
    smoothScroll: true,
    nav: require('./nav/top/mainNav.js'),
    sidebar: {
      '/api/reference/rest/': sidebar.rest(),
      '/api/guides/': sidebar.guides(),
      '/': sidebar.support(),
    },
  },
  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  // plugins: [require('./plugins/getTypes.js')],
  plugins: [
    // [require('./plugins/getTypes.js')],
    // [require('./plugins/getResource.js')],
    [require('./plugins/getOpenAPI.js')],
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    '@vuepress/nprogress',
    [
      'vuepress-plugin-clean-urls',
      {
        normalSuffix: '/',
        indexSuffix: '/',
        notFoundPath: '/404.html',
      },
    ],
    // [
    //   'vuepress-plugin-right-anchor',
    //   {
    //     showDepth: 1,
    //     ignore: [
    //       '/',
    //       '/$discovery/',
    //       // more...
    //     ],
    //     expand: {
    //       default: true,
    //       trigger: 'hover',
    //     },
    //     customClass: 'onThisPageMenu',
    //     disableGlobalUI: false,
    //   },
    // ],
    [
      '@silvanite/markdown-classes',
      {
        prefix: 'md',
        rules: [
          'api_reference_FiraCode',
          'api_reference_method_heading',
          'api_reference_request_heading',
          'api_reference_types_heading',
        ],
      },
    ],
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // Don't forget to install moment yourself
          const moment = require('moment');
          moment.locale(lang);
          return moment(timestamp).fromNow();
        },
      },
    ],
    ['vuepress-plugin-code-copy', true],
    'redirect-frontmatter',
    'img-lazy',
  ],
  extraWatchFiles: [
    // Navigation
    '.vuepress/nav/top/mainNav.js',
    // Sidebars
    '.vuepress/nav/sidebars.js',
    '.vuepress/nav/left/guides.js',
    '.vuepress/nav/left/rest/rest.js',
    '.vuepress/nav/left/rest/v1/summary.js',
    '.vuepress/nav/left/rest/v1/resources.js',
    '.vuepress/nav/left/rest/v1/models/models.js',
    '.vuepress/nav/left/rest/v1/reference/merchant.js',
    '.vuepress/nav/left/rest/v1/reference/oauth2.js',
    '.vuepress/nav/left/rest/v1/reference/users.js',
    // Plugins
    '.vuepress/plugins/getOpenAPI.js',
  ],
});
