# React Form Builder

The **Form Builder Package** is a reusable library designed to simplify the creation and management of dynamic forms in web applications. It provides a robust API and customizable components to streamline form-building workflows.

> **Note**: This package is still in development.

## Features

- **Drag-and-Drop Support**: Easily add and arrange form elements.
- **Customizable Components**: Modify form elements to suit your needs.
- **Dynamic Rendering**: Automatically update forms based on user input or configuration.
- **TypeScript Support**: Fully typed for better developer experience.
- **Lightweight and Fast**: Built with modern tools for optimal performance.

## Installation

Install the package via npm:

```bash
npm install @arudovwen/form-builder-react
```

## Demo

Explore the live demo of the Form Builder Package:

- [Form Builder Demo](https://form-builder-inky-nine.vercel.app/)
- [Form Viewer](https://form-builder-inky-nine.vercel.app/viewer)

## GitHub Repository

Find the source code and contribute to the project on GitHub:  
[Form Builder GitHub Repository](https://github.com/arudovwen/Form.Builder)

## Usage

Here’s a quick example of how to use the Form Builder Package:

```tsx
import React, { useState, useEffect } from "react";
import { FormBuilder, FormViewer } from "@arudovwen/form-builder-react";
import '@arudovwen/form-builder-react/style.css';

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
    <>
      <FormBuilder
        onSubmit={(form_data: any) => console.log(form_data)}
        config={config}
        title="My Form Title"
        questionData={formData} // Pass in existing configuration
      />
      <FormViewer
        onSubmit={(e: any) => console.log(e)}
        form_data={formData}
        answerData={[]}
        config={config}
        loading={loading}
      />
    </>
  );
}

export default App;
```

### Props for `FormBuilder`

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `title` | `string` | Title of the form (optional). |
| `questionData` | `FormElement[]` | Array of form elements to render initially in the builder. |
| `config` | `object` | Configuration object (e.g., `buttonColor`, `loaderColor`). |
| `onSubmit` | `(data: any) => void` | Callback function triggered when the save button is clicked. |
| `isReadOnly` | `boolean` | Determines if the builder is rendered in read-only mode. |
| `loading` | `boolean` | Indicates whether the component is in a loading state. |
| `goBackUrl` | `() => void` | Function triggered by a back button to navigate somewhere locally. |
| `onPublish` | `(data: any) => void` | Callback function triggered when the publish button is clicked. |
| `previewLoading` | `boolean` | Shows loading icon on the preview button. |
| `saveLoading` | `boolean` | Shows loading icon on the save button. |
| `publishLoading` | `boolean` | Shows loading icon on the publish button. |
| `onTitleChange` | `(newTitle: string) => void` | Callback function triggered when the form title is renamed. |
| `uploadUrl` | `string` | Base URL used for uploading files inside the builder/viewer. |

### Props for `FormViewer`

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `form_data` | `FormElement[]` | Array of form elements to render for the user to complete. |
| `answerData` | `any` | Initial answers/state for the form elements. |
| `config` | `object` | Configuration object (e.g., `buttonColor`, `loaderColor`). |
| `onSubmit` | `(data: any) => void` | Callback function triggered when the form viewer is submitted. |
| `ignoreValidation` | `boolean` | Whether form validation rules should be bypassed or enforced. |
| `isReadOnly` | `boolean` | Determines if the viewer is read-only (fields cannot be interacted with). |
| `loading` | `boolean` | Indicates whether the form viewer is in a loading state. |
| `renderType` | `'single' \| 'multi'` | Determines how the form renders (single page or multi-step pages). |
| `children` | `React.ReactNode` | Children to append inside the form wrapper. |
| `hideFooter` | `boolean` | Hides the default Submit actions footers when set to true. |
| `onGetValues` | `(data: any) => void` | Callback triggered to fetch form values dynamically as they change. |
| `uploadUrl` | `string` | Base URL used for uploading files. |

### Form Element Types

The `FormElement` type supports the following core fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `string` | Unique identifier for the form element. |
| `type` | `string` | Type of the input (e.g., `text`, `email`, `select`). |
| `label` | `string` | Label for the form element seen in the sidebar. |
| `placeholder` | `string` | Placeholder text for the input. |

## Development

To contribute or modify the package:

1. Clone the repository:

   ```bash
   git clone https://github.com/arudovwen/Form.Builder.git
   cd Form.Builder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the package:

   ```bash
   npm run build
   ```

4. Run tests:

   ```bash
   npm test
   ```

## Scripts

- `npm run build`: Build the package for production.
- `npm test`: Run unit tests.
- `npm run lint`: Check code quality with ESLint.

## License

This package is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

---

Happy form building!
