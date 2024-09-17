import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./index";
import FilePage from "./file";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:id" element={<FilePage />} />
      </Routes>
    </Router>
  );
}
