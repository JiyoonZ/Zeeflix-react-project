import ReactDOM from "react-dom/client";
import {RecoilRoot} from "recoil";
import {ThemeProvider} from "styled-components";
import App from "./App";
import {theme} from "./theme";
import GlobalStyle from "./GlobalStyle";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
