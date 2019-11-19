import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

import { BUILD_DIRECTORY, CLIENT_DIRECTORY, COMMON_DIRECTORY } from "./paths";

const config: webpack.Configuration = {
  entry: {
    app: CLIENT_DIRECTORY
  },
  module: {
    rules: [
      {
        loader: "ts-loader",
        options: {
          configFile: path.resolve(__dirname, "./tsconfig.client.json")
        },
        test: /\.(ts|tsx)$/
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
      {
        loader: "url-loader",
        test: /\.(png|jpg)$/
      },
      {
        loader: "@svgr/webpack",
        test: /\.svg$/
      },
      {
        test: /\.md$/,
        use: ["html-loader", "markdown-loader"]
      }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: module => {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return packageName;
          },
          test: /[\\/]node_modules[\\]/
        }
      },
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0
    }
  },
  output: {
    filename: "[name].[hash].js",
    path: BUILD_DIRECTORY,
    publicPath: "/"
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(CLIENT_DIRECTORY, "index.html")
    })
  ],
  resolve: {
    alias: {
      "@client": CLIENT_DIRECTORY,
      "@common": COMMON_DIRECTORY
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".scss"]
  }
};

export default config;
