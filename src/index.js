import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";
import ContextWrapper from "./context/ContextWrapper";

ReactDOM.render(
  <React.StrictMode>
    <ContextWrapper>
      <Router>
        <App />
      </Router>
    </ContextWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
