module.exports = {
  siteMetadata: {
    siteTitle: 'Mujahids personal corner of the internet',
    siteDescription: 'Personal website that belongs to a solidity engineer who lives in Kano, Nigeria.',
    siteImage: '/banner.png', // main image of the site for metadata
    siteUrl: 'https://chronoblog.now.sh/',
    pathPrefix: '/',
    siteLanguage: 'en',
    ogLanguage: `en_US`,
    author: 'Mujahid Bappai', // for example - 'Ivan Ganev'
    authorDescription: 'A solidity engineer writing well documented smart contracts on the ethereums blockchain', // short text about the author
    avatar: '/avatar.jpg',
    twitterSite: 'mbappaicom', // website account on twitter
    twitterCreator: 'Mbappai', // creator account on twitter
    social: [
      {
        icon: `at`,
        url: `mailto:mujahid.bappai@yahoo.com`,
      },
      {
        icon: `twitter`,
        url: `https://twitter.com/mbappai`,
      },
      {
        icon: `github`,
        url: `https://github.com/mbappai`,
      }
    ],
  },
  plugins: [
    {
      resolve: 'gatsby-theme-chronoblog',
      options: {
        uiText: {
          // ui text fot translate
          feedShowMoreButton: 'show more',
          feedSearchPlaceholder: 'search',
          cardReadMoreButton: 'read more →',
          allTagsButton: 'all tags',
        },
        feedItems: {
          // global settings for feed items
          limit: 50,
          yearSeparator: true,
          itemsFormat: `compact`,
          yearSeparatorSkipFirst: true,
          contentTypes: {
            links: {
              beforeTitle: '🔗 ',
            },
          },
        },
        feedSearch: {
          symbol: '🔍',
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Chronoblog Gatsby Theme`,
        short_name: `Chronoblog`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#3a5f7d`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        trackingId: 'G-LD1BSQ597X',
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        // replace "chronoblog-1" with your own disqus shortname
        shortname: `chronoblog-1`,
      },
    },
  ],
};
