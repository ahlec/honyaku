import merge from "webpack-merge";

import commonConfig from "./webpack.common";

export default merge(
  {
    mode: "production"
  },
  commonConfig
);
