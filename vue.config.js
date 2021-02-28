// const myHost = 'i3';
const WorkerPlugin = require('worker-plugin');

module.exports = {
  publicPath: '',

  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: {
    devtool: 'source-map',
    // plugins: [
    //  new GoogleFontsPlugin('./font.config.json'),
    // ],
    plugins: [
      new WorkerPlugin({
        globalObject: 'self', // <-- this is the default value
      }),
    ],
  },

  pwa: {
    name: 'KidsChess',
    themeColor: '#6dc9f7',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-icon-152x152.png',
      msTileImage: 'img/icons/ms-icon-144x144.png'
    }
  }
};
