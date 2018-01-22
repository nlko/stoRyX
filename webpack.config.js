const webpack = require("webpack");
const path = require("path");
//const HtmlWebpackPlugin = require("html-webpack-plugin");
// const DashboardPlugin = require("webpack-dashboard/plugin");
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

var config = {
  devtool: /*isProd ? "hidden-source-map" :*/ "source-map",
  context: path.resolve("./src"),
  entry: {
    app: "./index.ts"
    /*,
        vendor: "./vendor.ts"*/
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].bundle.js",
    sourceMapFilename: "[name].bundle.map",
    devtoolModuleFilenameTemplate: function(info) {
      return "file:///" + info.absoluteResourcePath;
    },
    library: 'libraryName',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [{
        enforce: "pre",
        test: /\.ts?$/,
        exclude: ["node_modules"],
        use: ["awesome-typescript-loader", "source-map-loader"]
      },
      /*
            {
              test: /\.html$/,
              loader: "html-loader"
            },
            {
              test: /\.css$/,
              loaders: ["style-loader", "css-loader"]
            }*/
      /*{
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }*/
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // eslint-disable-line quote-props
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    //new HtmlWebpackPlugin({
    //  title: "Typescript Webpack Starter",
    //  template: "!!ejs-loader!src/index.html"
    //}),
    /*new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
      filename: "vendor.bundle.js"
    }),*/
    /*new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),*/
    // new DashboardPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  /*devServer: {
    contentBase: path.join(__dirname, "dist/"),
    compress: true,
    port: 3000,
    hot: false
  },*/
  target: 'node',
  watch: true
};

module.exports = config;