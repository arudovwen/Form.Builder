import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router";
import axios from "axios";
import { errorResponse } from "./utils/errorResponse";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const customDefaultMessage = error?.config?.defaultMessage;
    errorResponse(error, customDefaultMessage);
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
