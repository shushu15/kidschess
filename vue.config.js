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



};
