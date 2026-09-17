import MainPage from "./main";
import SideBar from "./sidebar";
import TopBar from "./topbar";
import { EditorProvider, DeleteMode, BuilderMode } from "../../context/editor-context";
import Loader from "../Loader";
import { Toaster } from "sonner";
import { useState } from "react";

export interface BuilderProps {
  onSubmit?: (e: any) => void; // Function to handle form submission
  onChange?: (data: any) => void; // Function to stream form data updates
  onLogAction?: (action: string, value: any) => void; // Logger for user actions
  formData?: any; // Data for the questions in the form
  isReadOnly?: boolean; // Flag to indicate if the form is read-only
  config?: any; // Configuration for the form
  deleteMode?: DeleteMode; // Setting for removing deleted fields or marking them as deleted ("remove" | "isFieldDeleted" | "isDeleted" | "soft" | "hard")
  mode?: BuilderMode; // Builder mode ("create" | "edit")
  title?: string;
  loading?: boolean;
  goBackUrl?: () => void;
  onPublish?: (e: any) => void;
  previewLoading?: boolean;
  saveLoading?: boolean;
  publishLoading?: boolean;
  onTitleChange?: (string) => void;
  uploadUrl?: string;
  onAddTemplate?: () => void;
  templates?: any[];
  onShowVersion?: () => void;
  formType?: "default" | "poll"; // Type of form being built
}

export default function Layout({
  onSubmit,
  onChange,
  onLogAction,
  formData,
  deleteMode,
  mode,
  config,
  title,
  goBackUrl,
  loading,
  onPublish,
  previewLoading,
  saveLoading,
  publishLoading,
  onTitleChange,
  uploadUrl,
  onAddTemplate,
  templates,
  onShowVersion,
  formType = "default",
}: BuilderProps) {
  const [viewMode, setViewMode] = useState<"canvas" | "flow">("canvas");

  const resolvedMode: BuilderMode =
    mode ||
    config?.mode ||
    (formData && Array.isArray(formData) && formData.length > 0
      ? "edit"
      : "create");

  return (
    <EditorProvider
      onChange={onChange}
      onLogAction={onLogAction}
      deleteMode={deleteMode || config?.deleteMode || "remove"}
      mode={resolvedMode}
    >
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full h-full bg-[#F8F9FC] flex flex-col">
        <div className="flex flex-1 ">
          {viewMode === "canvas" && (
            <div>
              <div className="w-[290px] h-screen border-r border-[#E4E7EC] bg-white ">
                <SideBar formType={formType} />
              </div>
            </div>
          )}
          <div
            className={`flex-1 h-full max-h-full z-[1] ${viewMode === "canvas" ? "w-[calc(100%-250px)]" : "w-full"}`}
          >
            <div className=" h-[70px]">
              <TopBar
                title={title}
                goBackUrl={goBackUrl}
                onSubmit={onSubmit}
                onPublish={onPublish}
                previewLoading={previewLoading}
                saveLoading={saveLoading}
                publishLoading={publishLoading}
                onTitleChange={onTitleChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onShowVersion={onShowVersion}
              />
            </div>
            <div className="p-6 h-[calc(100vh-70px)]">
              {!loading ? (
                <MainPage
                  initialFormData={formData}
                  uploadUrl={uploadUrl}
                  onAddTemplate={onAddTemplate}
                  templates={templates}
                  viewMode={viewMode}
                />
              ) : (
                <Loader loadingClass="!w-full !h-[800px]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}
