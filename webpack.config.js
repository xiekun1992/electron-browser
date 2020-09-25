const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')

module.exports = {
  entry: './src/render/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './src/render/dist/')
  },
  devServer: {
    host: '0.0.0.0',
    port: 2000,
    compress: true,
    contentBase: path.resolve(__dirname, 'src/render/dist'),
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // 顺序不能换，不然报错：Module build failed (from ./node_modules/css-loader/dist/cjs.js): CssSyntaxError
          'css-loader',
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/render/template.html'),
      inject: true,
    }),
    new VueLoaderPlugin()
  ],
  // node: {
  //   fs: 'empty'
  // },
  // externals: {
  //   electron: 'electron'
  //   // dgram: 'empty',
  //   // net: 'empty'
  // }
}