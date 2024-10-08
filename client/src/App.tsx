import { Routes, Route } from "react-router-dom";

import UploadDropzone from "@/components/dropzone";
import FilePage from "@/file";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadDropzone />} />
      <Route path="/:id" element={<FilePage />} />
    </Routes>
  );
}
