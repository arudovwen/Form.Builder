import React from "react";
import FormRenderer from "../../components/viewer";

export default function Viewer() {
  let form_data;

  // Safely parse formData from localStorage
  try {
    const storedData = localStorage.getItem("formData");
    form_data = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error parsing formData from localStorage:", error);
    form_data = null;
  }

  // Render fallback if form_data is unavailable
  if (!form_data) {
    return (
      <div>
        <p>Error: No form data available. Please ensure the form data is saved correctly.</p>
      </div>
    );
  }

  return (
    <div>
      <FormRenderer form_data={form_data} />
    </div>
  );
}
