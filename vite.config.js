export default {
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'DecisionTreeVisualizer',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: 'css/[name][extname]'
      }
    }
  }
}