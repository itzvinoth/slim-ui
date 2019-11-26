var path = require('path')
var webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    app: './src/plugin.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      // use babel-loader for js files
      { test: /\.js$/, use: 'babel-loader' },
      // use vue-loader for .vue files
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  // default for pretty much every project
  context: __dirname,
  // specify your entry/main file
  output: {
    // specify your output directory...
    path: path.resolve(__dirname, './dist/'),
    // and filename
    filename: '[name].js'
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}