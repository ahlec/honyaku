import * as webpack from "webpack";
import "webpack-dev-server"; // Needed to add `devServer` to config schema
import merge from "webpack-merge";

import commonConfig from "./webpack.common";

export default merge(
  {
    devServer: {
      historyApiFallback: true,
      hot: true,
      open: true,
      overlay: true,
      port: 7000
    },
    devtool: "inline-source-map",
    mode: "development",
    plugins: [new webpack.HotModuleReplacementPlugin()]
  },
  commonConfig
);
