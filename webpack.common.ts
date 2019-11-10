import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

const ROOT_DIRECTORY = __dirname;
const BUILD_DIRECTORY = path.resolve(ROOT_DIRECTORY, "build");
const SOURCE_DIRECTORY = path.resolve(ROOT_DIRECTORY, "src");

const config: webpack.Configuration = {
  entry: {
    app: SOURCE_DIRECTORY
  },
  module: {
    rules: [
      {
        loader: "ts-loader",
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
      template: path.resolve(SOURCE_DIRECTORY, "index.html")
    })
  ],
  resolve: {
    alias: {
      "@honyaku": SOURCE_DIRECTORY
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".scss"]
  }
};

export default config;
