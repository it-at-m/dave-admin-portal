module.exports = {
  transpileDependencies: ['vuetify', 'vue-echarts'],
  pwa: {
    name: 'DAVe Adminportal',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
};