import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <React.StrictMode>
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/tv" element={<Tv />}>
            <Route path="/tv/:category/:moiveId" element={<Tv />} />
          </Route>
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Home />}>
            <Route path="/movies/:category/:movieId" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
