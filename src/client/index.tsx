import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { createRedux } from "./redux/store";
import Application from "./ui/Application";

import "reset-css";

const reduxStore = createRedux();

ReactDOM.render(
  <Provider store={reduxStore}>
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
