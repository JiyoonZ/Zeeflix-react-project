import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./Components/Header";
import Loading from "./Components/Loading";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  const [isFirst, setIsFirst] = useState(false);
  useEffect(() => {
    setIsFirst(true);
    setTimeout(() => {
      setIsFirst(false);
    }, 3600);
  }, []);
  return (
    <React.StrictMode>
      <Router basename={process.env.PUBLIC_URL}>
        {isFirst && <Loading />}
        {!isFirst && <Header />}
        <Routes>
          <Route path="/tv" element={<Tv />}>
            <Route path="/tv/:category/:moiveId" element={<Tv />} />
          </Route>
          <Route path="/search" element={<Search />}>
            <Route path="/search/:movieId" element={<Search />} />
          </Route>
          <Route path="/" element={<Home />}>
            <Route path="/movies/:category/:movieId" element={<Home />} />
          </Route>
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
