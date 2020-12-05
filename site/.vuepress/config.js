module.exports = {
  themeConfig: {
    nav: [
      { text: 'Blog', link: '/' },
      { text: 'Cooking', link: '/cooking/' },
      { text: 'About Me', link: '/about/' },
    ]
  },
  configureWebpack: (config, isServer) => {
    if (!isServer) {
      config.node.process = true;
      config.node.global = true;
    }
  },
};
