// const introduction = require('./guides/introduction.js');
const quickstarts = require('./guides/quickstarts.js');
const tutorials = require('./guides/tutorials.js');
const best_practices = require('./guides/best-practices.js');

const overview = {
  title: 'Overview',
  collapsable: false,
  sidebarDepth: 0,
  children: [['/api/guides/', 'Settle API Overview']],
};

/**
 * @todo #96 @rexgnu Edit the Introductions Sidabar here. Documents are found in '/docs/api/guides/introduction'.
 */
const introduction = {
  title: 'Introduction', // required
  collapsable: false,
  sidebarDepth: 0,
  children: [
    '/api/guides/introduction/interacting',
    '/api/guides/introduction/callbacks',
    '/api/guides/introduction/error-responses',
    '/api/guides/introduction/media-type',
    '/api/guides/introduction/a-note-on-settle-api-users',
    '/api/guides/introduction/versioning',
    ['/api/guides/introduction/resiliency', 'Resiliency'],
  ],
};

module.exports = [
  overview,
  introduction,
  // quickstarts,
  tutorials,
  //   best_practices,
];

// function getGuidesSidebar() {
//     return [
//         '/guides/',
//         '/guides/authentication',
//         '/guides/callbacks',
//         '/guides/attachments',
//         '/guides/ledgers',
//         '/guides/settlements',
//         '/guides/permission-requests',
//         '/guides/qr-acceptance',
//     ];
// }
