import { Routes, Route } from "react-router";
import { FormBuilder, FormViewer } from "@arudovwen/form-builder-react";
import "@arudovwen/form-builder-react/dist/index.css";

import React, { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("formData");
      setFormData(storedData ? JSON.parse(storedData) : null);
    } catch (error) {
      console.error("Error parsing formData from localStorage:", error);
      setFormData(null);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  const config = {
    buttonColor: "#333",
    loaderColor: "#333",
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <FormBuilder
            onSubmit={(e: any) => console.log(e)}
            config={config}
            loading={true}
          />
        }
      />
      <Route
        path="/viewer"
        element={
          <FormViewer
            onSubmit={(e: any) => console.log(e)}
            form_data={formData}
            config={config}
            loading={loading}
          />
        }
      />
    </Routes>
  );
}

export default App;
