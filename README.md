# @arudovwen/form-builder-react (v2.0)

A powerful, visual drag-and-drop form builder and multi-mode form viewer for React applications. Built with TypeScript, Vite, and TailwindCSS, it provides a studio-grade interface for designing simple surveys, complex multi-step wizards, interactive logic flows, and Typeform-style conversational forms.

[![npm version](https://img.shields.io/npm/v/@arudovwen/form-builder-react.svg?style=flat-square&color=indigo)](https://www.npmjs.com/package/@arudovwen/form-builder-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.x%20Ready-61DAFB.svg?style=flat-square)](https://react.dev/)

---

## 🚀 Live Demo

- **Form Builder Studio**: [Live Studio Demo](https://form-builder-inky-nine.vercel.app/)
- **Interactive Form Viewer**: [Live Viewer Demo](https://form-builder-inky-nine.vercel.app/viewer)
- **GitHub Repository**: [arudovwen/Form.Builder](https://github.com/arudovwen/Form.Builder)

---

## ✨ Features at a Glance

### 🎨 Visual Studio & Canvas
- **Drag-and-Drop Form Design**: Arrange sections and question blocks with intuitive drag grips and instant layout previews.
- **Dual View Modes (Studio & Logic Flow)**: Toggle seamlessly between the visual canvas artboard and the **Logic Flow diagram** (powered by `@xyflow/react` and `dagre`) to visualize conditional branching and step dependencies.
- **Interactive Side-by-Side Preview**: Test forms live without leaving the editor, including device switching (Desktop, Tablet, Mobile) and live conversational mode testing.

### ⚡ Redesigned Sidebar v2.0
- **Outline vs. Cards View**: Switch between an expandable outline list and a compact card grid (automatically persisted).
- **Fast Filter Chips**: Filter elements instantly by **Essentials**, **Choice**, **Layout**, **Advanced**, or **Date & Media**.
- **Keyboard Shortcut (⌘K / Ctrl+K)**: Quickly focus the component search from anywhere.
- **Starred Quick Picks**: Frequently used elements pinned at the top for 1-click addition.
- **Clear Badges**: Visual indicators for `Logic Ready`, `Nested`, `Grid`, `Formula`, `Pro`, and `API`.

### 💬 3 Form Viewer Experience Modes
- **Conversational (Typeform-style)**: Immersive, one-question-at-a-time form filling with keyboard navigation (`Enter` / arrow keys), animations, and progress indicators.
- **Multi-Step Wizard**: Paginated multi-section stepper with progress bars and section navigation.
- **Single Page Continuous**: Clean, classic single-page document layout.

### 📊 Polling & Survey Mode
- Specialized `formType="poll"` mode with dedicated polling components: Single/Multiple vote polling, Net Promoter Score (NPS 0–10), Drag-and-Drop Ranking, and Image Choice cards.
- Support for live poll results and submission data visualization.

### 📋 Productivity & Organization
- **Integrated Clipboard**: Copy and paste entire sections or individual elements across your form.
- **Deletion Controls**: Choose between permanent removal or soft-delete (preserving data mappings).
- **Global Error Handling & Request Optimization**: Built-in request deduplication and cancellation with `AbortController`, plus toast notifications via `sonner`.

---

## 📦 Installation

Install the package using your preferred package manager:

```bash
npm install @arudovwen/form-builder-react
# or
yarn add @arudovwen/form-builder-react
# or
pnpm add @arudovwen/form-builder-react
```

### Peer Dependencies

Ensure the following peer dependencies are installed in your project:

```bash
npm install @headlessui/react @hookform/resolvers axios papaparse react react-currency-input-field react-datepicker react-dom react-draggable react-hook-form react-router react-router-dom tailwindcss uuid xlsx yup
```

### Import Styles

Import the compiled stylesheet once in your application entry point (e.g., `main.tsx`, `index.tsx`, or `App.tsx`):

```tsx
import "@arudovwen/form-builder-react/style.css";
// or
import "@arudovwen/form-builder-react/dist/index.css";
```

---

## 🛠️ Quick Start

```tsx
import React, { useState } from "react";
import { FormBuilder, FormViewer } from "@arudovwen/form-builder-react";
import "@arudovwen/form-builder-react/style.css";

const initialForm = [
  {
    id: "sec-1",
    title: "General Information",
    description: "Please fill in your basic details.",
    formData: [
      {
        id: "field-name",
        sectionId: "sec-1",
        type: "textField",
        label: "Short Text",
        inputLabel: "Full Name",
        inputType: "text",
        required: true,
        placeholder: "e.g. Alex Morgan",
      },
      {
        id: "field-email",
        sectionId: "sec-1",
        type: "email",
        label: "Email",
        inputLabel: "Work Email",
        inputType: "email",
        required: true,
        placeholder: "alex@company.com",
      },
    ],
  },
];

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [activeTab, setActiveTab] = useState<"builder" | "viewer">("builder");

  const brandConfig = {
    buttonColor: "#4f46e5",
    elementColor: "#4f46e5",
    loaderColor: "#4f46e5",
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Tabs */}
      <div className="p-3 bg-white border-b flex gap-2">
        <button
          onClick={() => setActiveTab("builder")}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
            activeTab === "builder" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Form Builder
        </button>
        <button
          onClick={() => setActiveTab("viewer")}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
            activeTab === "viewer" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Form Viewer
        </button>
      </div>

      {/* Render View */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "builder" ? (
          <FormBuilder
            title="Customer Feedback Survey"
            description="We value your feedback."
            formData={formData}
            config={brandConfig}
            formSettings={{
              title: "Customer Feedback Survey",
              renderType: "conversational",
              submitText: "Submit Survey",
              buttonColor: "#4f46e5",
              showProgressBar: true,
            }}
            onChange={(updatedData, settings) => {
              setFormData(updatedData);
            }}
            onSubmit={(data, settings) => {
              console.log("Saved form schema:", data, settings);
            }}
            onPublish={(data, settings) => {
              console.log("Published form:", data, settings);
            }}
          />
        ) : (
          <FormViewer
            title="Customer Feedback Survey"
            form_data={formData}
            config={brandConfig}
            renderType="conversational"
            onSubmit={(answers) => {
              console.log("User responses:", answers);
            }}
          />
        )}
      </div>
    </div>
  );
}
```

---

## 📖 Component API Reference

### `<FormBuilder />`

The primary design studio component containing the sidebar elements palette, canvas artboard, inspector, interactive preview, and logic flow graph.

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `formData` | `any[]` | `[]` | Array of sections representing the form structure. |
| `title` | `string` | `undefined` | Form title displayed in the top bar. |
| `description` | `string` | `undefined` | Subtitle or instructions for respondents. |
| `formSettings` | `FormSettings` | `undefined` | Global settings (render mode, colors, submit text, etc.). |
| `config` | `object` | `{ buttonColor: "#4f46e5" }` | Theme tokens (`buttonColor`, `elementColor`, `loaderColor`, etc.). |
| `formType` | `'default' \| 'poll'` | `'default'` | Switches builder between standard forms and dedicated polling blocks. |
| `mode` | `'create' \| 'edit'` | auto-detected | Builder lifecycle mode. |
| `deleteMode` | `'remove' \| 'soft'` | `'remove'` | Element deletion mode (permanent delete or marked as deleted). |
| `isReadOnly` | `boolean` | `false` | Disables element editing, deletion, and additions. |
| `loading` | `boolean` | `false` | Displays a global skeleton loader over the canvas. |
| `saveLoading` | `boolean` | `false` | Shows a loading indicator on the Save button. |
| `publishLoading` | `boolean` | `false` | Shows a loading indicator on the Publish button. |
| `previewLoading` | `boolean` | `false` | Shows a loading indicator on the Preview toggle button. |
| `templates` | `any[]` | `[]` | List of custom predefined form templates. |
| `uploadUrl` | `string` | `undefined` | Base endpoint for file uploads inside the builder. |
| `onSubmit` | `(data: any, settings?: FormSettings) => void` | `undefined` | Triggered when the Save button is clicked. |
| `onPublish` | `(data: any, settings?: FormSettings) => void` | `undefined` | Triggered when the Publish button is clicked. |
| `onChange` | `(data: any, settings?: FormSettings) => void` | `undefined` | Triggered whenever any element, section, or order changes. |
| `onLogAction` | `(action: string, value: any) => void` | `undefined` | Telemetry callback invoked on builder user actions. |
| `onTitleChange` | `(title: string) => void` | `undefined` | Callback fired when the title is edited inline. |
| `onDescriptionChange` | `(desc: string) => void` | `undefined` | Callback fired when the description is edited. |
| `onFormSettingsChange` | `(settings: FormSettings) => void` | `undefined` | Callback fired when form settings are updated. |
| `goBackUrl` | `() => void` | `undefined` | Handler for the topbar back arrow button. |
| `onAddTemplate` | `() => void` | `undefined` | Callback invoked when the user selects "Add Template". |
| `onShowVersion` | `() => void` | `undefined` | Callback invoked to open the version history modal. |

---

### `<FormViewer />`

The client-facing form renderer capable of rendering forms in conversational, multi-step, or single-page modes.

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `form_data` | `any[]` | `[]` | Form schema sections to render. |
| `title` | `string` | `undefined` | Form title displayed on the header/cover. |
| `description` | `string` | `undefined` | Description text for the form. |
| `answerData` | `any` | `{}` | Pre-filled answers or draft responses. |
| `renderType` | `'multi' \| 'single' \| 'conversational'` | `'multi'` | Layout and navigation style for form filling. |
| `config` | `object` | `{ buttonColor: "#4f46e5" }` | Theme tokens (`buttonColor`, `loaderColor`, etc.). |
| `formSettings` | `FormSettings` | `undefined` | Overrides configuration settings (such as progress bar or submit button copy). |
| `onSubmit` | `(answers: any, settings?: FormSettings) => void` | `undefined` | Callback fired upon successful form validation and submission. |
| `onGetValues` | `(values: any) => void` | `undefined` | Live callback invoked as the user types or updates answers. |
| `isReadOnly` | `boolean` | `false` | Sets all form fields to read-only/disabled mode. |
| `ignoreValidation` | `boolean` | `false` | Bypasses standard field validation rules. |
| `loading` | `boolean` | `false` | Renders a loading skeleton. |
| `hideFooter` | `boolean` | `false` | Hides the default submit/stepper footer bar. |
| `submitText` | `string` | `'Submit'` | Custom label for the submission button. |
| `uploadUrl` | `string` | `undefined` | Target API URL for uploading file attachments. |
| `showResults` | `boolean` | `false` | Displays poll and survey results visualization. |
| `pollResults` | `Record<string, any>` | `{}` | Aggregated voting data for poll fields. |
| `hideInputsOnResults` | `boolean` | `false` | Hides voting controls once results are displayed. |
| `sendHiddenSectionsAsEmpty` | `boolean` | `false` | Clears responses for conditionally hidden sections upon submit. |
| `children` | `ReactNode \| RenderProp` | `undefined` | Custom footer or render-prop providing `{ isUploading, isSubmitting, hasErrors, submitText }`. |

---

## 🧩 Supported Form Elements (30+ Field Types)

Each element uses a standardized schema under `ElementKind`:

```tsx
import { ElementKind } from "@arudovwen/form-builder-react";
```

| Category | `type` (ElementKind) | Name | Description |
| -------- | -------------------- | ---- | ----------- |
| **Input Essentials** | `textField` | Short Text Input | Names, titles, handles, single-line text |
| | `longText` | Long Text Area | Multi-line text feedback and notes |
| | `phoneField` | Phone Number | International phone number with country masks |
| | `numberField` | Numeric & Stepper | Number inputs with min/max bounds |
| | `amountField` | Currency & Amount | Formatted monetary values and currency |
| | `email` | Email Address | Strict RFC email validation |
| | `password` | Password Input | Masked input with reveal/hide toggle |
| | `url` | Web URL Link | Validated HTTP/HTTPS web links |
| | `basicText` | Static Text & Title | Informational headings and copy blocks |
| **Choices & Selection** | `selectField` | Dropdown Menu | Searchable single-choice dropdown |
| | `multiSelect` | Multi-Select Tags | Tag-based multi-choice picker |
| | `cascadeSelect` | Cascade Select | Parent-child dependent select menus |
| | `checkbox` | Checkbox Group | Multi-option toggle group |
| | `radio` | Radio Buttons | Mutually exclusive circular selection |
| | `country` | Country Selector | ISO country list with flags |
| **Pickers & Files** | `date` | Date Picker | Calendar date selection with range controls |
| | `time` | Time Picker | 12h / 24h clock selection |
| | `file` | File Attachment | Drag-and-drop document & photo uploader |
| **Feedback & Ratings**| `rating` | Star Rating | 1–5 or 1–10 star satisfaction rating |
| | `matrix` | Matrix / Likert Grid | Multi-statement Likert evaluation grid |
| **Polling & Sentiment** | `polling` | Polling Option | Live voting option block |
| | `nps` | Net Promoter Score | 0–10 standard NPS scale |
| | `ranking` | Ranking Choice | Drag-and-drop preference ordering |
| | `imageChoice` | Visual Image Choice | Interactive selectable image cards |
| **Layout & Structure** | `section` | Page Section | Card container grouping question fields |
| | `grid` | Responsive Grid | 2 to 4 column responsive layout container |
| | `divider` | Horizontal Divider | Visual break line |
| | `spacer` | Vertical Spacer | Configurable vertical whitespace |
| **Advanced & Logic** | `calculatedField` | Calculated Formula | Real-time mathematical and formula evaluation |
| | `dataGrid` | Data Table Grid | Editable spreadsheet data table |
| | `tableInput` | Table Input | Dynamic repeatable line-item rows |
| | `dataLookup` | Data Lookup | REST API-driven autocomplete & remote options |

---

## 🎛️ Form Settings Object

The `formSettings` object configures high-level behavior for both the builder and the viewer:

```typescript
export interface FormSettings {
  title?: string;
  description?: string;
  renderType?: "single" | "multi" | "conversational";
  buttonColor?: string;
  submitText?: string;
  showProgressBar?: boolean;
  allowMultipleSubmissions?: boolean;
  redirectUrl?: string;
  customCss?: string;
}
```

---

## 💡 Advanced Features

### 1. Conversational Forms (Typeform Style)
Set `renderType="conversational"` on `FormViewer` to automatically transform any form into an interactive, step-by-step presentation:
- Smooth slide transitions between questions.
- Automatic focus on active field inputs.
- Keyboard shortcuts: `Enter` to advance, `Shift + Tab` / `Up Arrow` to navigate back.
- Real-time percent progress bar.

### 2. Logic Flow Diagram View
Switch the view mode in `FormBuilder` to `"flow"` or click the **Flow** toggle in the studio header to display an interactive visual diagram of your sections, logic rules, and routing paths powered by `@xyflow/react`.

### 3. Custom Viewer Submit Actions (Render Props)
Take full control over the viewer's footer buttons using the render prop pattern:

```tsx
<FormViewer form_data={formData} hideFooter={false}>
  {({ isUploading, isSubmitting, hasErrors, submitText }) => (
    <div className="flex justify-between items-center pt-4">
      <span className="text-xs text-gray-500">Auto-saved draft</span>
      <button
        type="submit"
        disabled={isUploading || isSubmitting}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : isUploading ? "Uploading files..." : submitText}
      </button>
    </div>
  )}
</FormViewer>
```

### 4. Optimized API Calls & Request Cancellation
Dynamic data lookups and remote select options utilize `AbortController` internally to cancel stale HTTP requests during rapid typing, preventing race conditions and optimizing client performance.

---

## 🛠️ Development & Contributing

To run and contribute to the library locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arudovwen/Form.Builder.git
   cd Form.Builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local demo:**
   ```bash
   npm run dev
   ```

4. **Build the library:**
   ```bash
   npm run build
   ```

5. **Run linter:**
   ```bash
   npm run lint
   ```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

## 👤 Author

Developed and maintained by **Success Ahon** ([@arudovwen](https://github.com/arudovwen)).
