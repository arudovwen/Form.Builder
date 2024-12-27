import "./App.css";

import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import './assets/scss/style.scss'

function App() {
  return (
    <Routes>
      <Route path="/" element={<BulderPage />} />
      <Route path="/viewer" element={<ViewerPage />} />
    </Routes>
  );
}

export default App;
