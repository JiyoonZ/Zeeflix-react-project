import React from "react";
import ReactDOM from "react-dom";
import {RecoilRoot} from "recoil";
import {ThemeProvider} from "styled-components";
import App from "./App";
import {theme} from "./theme";
import GlobalStyle from "./GlobalStyle";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
