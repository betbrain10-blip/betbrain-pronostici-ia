import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Match from "./pages/Match";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/match/:id" element={<Match />} />

      {/* fallback per GitHub Pages */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
