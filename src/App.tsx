import React, {
  useRef,
  useState,
  useEffect,
  createRef,
  forwardRef,
} from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomeView from "./HomeView";

const About = () => {
  return <p>hi</p>;
};
const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
