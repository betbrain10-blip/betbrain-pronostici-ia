import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Match from "./pages/Match";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/:id" element={<Match />} />
      </Routes>
    </HashRouter>
  );
}
