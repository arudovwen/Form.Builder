import { Routes, Route } from "react-router";
import { FormBuilder, FormViewer } from "@arudovwen/form-builder-react";
import "@arudovwen/form-builder-react/dist/index.css";

import React from "react";

function App() {
  let form_data;
  let loading = true;
  try {
    const storedData = localStorage.getItem("formData");
    form_data = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error parsing formData from localStorage:", error);
    form_data = null;
  }
  const config = {
    buttonColor: "#333",
    loaderColor: "#333",
  };

  setTimeout(() => {
    loading = false;
  }, 2000);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <FormBuilder
            onSubmit={function (e: any): void {
              console.log(e);
            }}
            config={config}
          />
        }
      />
      <Route
        path="/viewer"
        element={
          <FormViewer
            onSubmit={function (e: any): void {
              console.log(e);
            }}
            form_data={form_data}
            config={config}
            loading={loading}
          />
        }
      />
    </Routes>
  );
}

export default App;
