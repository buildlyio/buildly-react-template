const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: ["babel-polyfill", "./src/index.js"] ,
    mode: "development",
    devtool: 'inline-source-map',
    module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.(ts|tsx)?$/,
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.(js|jsx)$/,
        use: 'react-hot-loader/webpack',
        include: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
              disable: true,
            },
          },
        ],
      },
        {
            test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    alias: {
      midgard: path.resolve(__dirname, './src/midgard'),
      store: path.resolve(__dirname, './src/store'),
      environment$: path.resolve(__dirname, './environment.js'),
      styles$: path.resolve(__dirname, './src/styles.scss'),
      colors$: path.resolve(__dirname, './src/styles/colors.js'),
    }
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
      publicPath: '/',
      filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
      port: 3000,
      publicPath: "http://localhost:3000/",
      historyApiFallback: true,
      hotOnly: true
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebPackPlugin({
          template: "./src/index.html",
          filename: "./index.html",
          favicon: './src/assets/favicon.ico',
      }),
      new CopyPlugin([
          { from: 'prod-environment.js', to: 'environment.js' },
      ]),
  ],
};
