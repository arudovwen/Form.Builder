import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "FormBuilder",
      fileName: (format) => `form-builder.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "react-router",
        "react-hook-form",
        "yup",
        "axios",
        "@headlessui/react",
        "@hookform/resolvers",
        "react-toastify",
        "react-datepicker",
        "react-draggable",
        "react-currency-input-field",
        "uuid",
        "xlsx",
        "papaparse"
      ],
      output: {
        globals: {
          react: "React",         // Ensure that React is provided globally
          "react-dom": "ReactDOM" // Same for ReactDOM
        }
      }
    },
    target: "es2018",
    minify: "esbuild", // Use esbuild to minify for better performance
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 0, // Ensure assets like images aren't inlined
    emptyOutDir: true     // Clear output directory before build
  },
  optimizeDeps: {
    // No need to exclude react and react-dom here
  }
});
