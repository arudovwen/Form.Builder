import MainPage from "./main";
import SideBar from "./sidebar";
import TopBar from "./topbar";
import Inspector from "./inspector";
import FormPreview from "./form-preview";
import ElementEditorModal from "../elements/element-editor";
import {
  EditorProvider,
  DeleteMode,
  BuilderMode,
  FormSettings,
} from "../../context/editor-context";
import EditorContext from "../../context/editor-context";
import Loader from "../Loader";
import { Toaster } from "sonner";
import { useState, useContext, useEffect } from "react";
import AppIcon from "../ui/AppIcon";

export interface BuilderProps {
  onSubmit?: (data: any, settings?: FormSettings) => void;
  onChange?: (data: any, settings?: FormSettings) => void;
  onLogAction?: (action: string, value: any) => void;
  formData?: any;
  isReadOnly?: boolean;
  config?: any;
  deleteMode?: DeleteMode;
  mode?: BuilderMode;
  title?: string;
  description?: string;
  formSettings?: FormSettings;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onFormSettingsChange?: (settings: FormSettings) => void;
  loading?: boolean;
  goBackUrl?: () => void;
  onPublish?: (data: any, settings?: FormSettings) => void;
  previewLoading?: boolean;
  saveLoading?: boolean;
  publishLoading?: boolean;
  uploadUrl?: string;
  onAddTemplate?: () => void;
  templates?: any[];
  onShowVersion?: () => void;
  formType?: "default" | "poll";
}

function LayoutInner({
  onSubmit,
  formData,
  title,
  description,
  formSettings: externalFormSettings,
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
  const [previewMode, setPreviewMode] = useState<
    "multi" | "single" | "conversational"
  >("multi");
  const [previewExpanded, setPreviewExpanded] = useState<boolean>(false);
  const {
    showPreview,
    setShowPreview,
    setFormTitle,
    setFormDescription,
    updateFormSettings,
    modalElement,
    setModalElement,
  }: any = useContext(EditorContext);

  useEffect(() => {
    if (title) {
      setFormTitle?.(title);
    }
  }, [title, setFormTitle]);

  useEffect(() => {
    if (description) {
      setFormDescription?.(description);
    }
  }, [description, setFormDescription]);

  useEffect(() => {
    if (externalFormSettings) {
      updateFormSettings?.(externalFormSettings);
      if (externalFormSettings.renderType) {
        setPreviewMode(externalFormSettings.renderType);
      }
    }
  }, [externalFormSettings, updateFormSettings]);

  const previewWidthClass = !showPreview
    ? "w-[320px] xl:w-[360px]"
    : previewExpanded
      ? "w-[720px] xl:w-[840px] 2xl:w-[960px]"
      : previewMode === "conversational"
        ? "w-[560px] xl:w-[660px] 2xl:w-[740px]"
        : "w-[440px] xl:w-[500px]";

  return (
    <div className="w-full h-screen bg-[#F8FAFC] flex flex-col overflow-hidden text-gray-800 font-sans">
      {/* TopBar spans the entire window */}
      <div className="h-[58px] shrink-0 border-b border-gray-200/90 bg-white z-20">
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

      {/* Main 3-Column Studio Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === "canvas" ? (
          <>
            {/* Column 1: Left Elements Palette */}
            <div className="w-[340px] xl:w-[360px] border-r border-gray-200/90 bg-white h-full shrink-0 z-10 flex flex-col">
              <SideBar formType={formType} />
            </div>

            {/* Column 2: Center Artboard Canvas */}
            <main className="flex-1 h-full overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 min-w-0">
              {!loading ? (
                <MainPage
                  initialFormData={formData}
                  uploadUrl={uploadUrl}
                  onAddTemplate={onAddTemplate}
                  templates={templates}
                  viewMode={viewMode}
                />
              ) : (
                <Loader loadingClass="!w-full !h-full min-h-[400px]" />
              )}
            </main>

            {/* Column 3: Right Inspector Panel / Interactive Preview */}
            <div
              className={`${previewWidthClass} border-l border-gray-200/90 bg-white h-full shrink-0 z-10 flex flex-col transition-all duration-300 ease-in-out`}
            >
              {showPreview ? (
                <div className="flex flex-col h-full w-full">
                  <div className="px-4 py-2.5 bg-gray-50/90 border-b border-gray-200/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Form Preview
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewExpanded((p) => !p)}
                        className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-200/70 transition-colors"
                        title={previewExpanded ? "Narrow preview" : "Widen preview"}
                      >
                        <AppIcon
                          icon={
                            previewExpanded
                              ? "solar:minimize-square-linear"
                              : "solar:maximize-square-linear"
                          }
                          iconClass="text-xs"
                        />
                        <span className="hidden sm:inline">
                          {previewExpanded ? "Narrow" : "Widen"}
                        </span>
                      </button>
                      <a
                        href="/viewer"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-200/70 transition-colors"
                        title="Open in new tab"
                      >
                        <AppIcon icon="solar:square-top-down-linear" iconClass="text-xs" />
                        <span>Pop out</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-indigo-50 transition-colors"
                      >
                        <AppIcon icon="lucide:arrow-left" iconClass="text-xs" />
                        Back to Editor
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <FormPreview
                      activeMode={previewMode}
                      onModeChange={setPreviewMode}
                    />
                  </div>
                </div>
              ) : (
                <Inspector onOpenAdvancedModal={(el) => setModalElement(el)} />
              )}
            </div>
          </>
        ) : (
          /* Logic Flow View Mode */
          <div className="flex-1 h-full w-full">
            {!loading ? (
              <MainPage
                initialFormData={formData}
                uploadUrl={uploadUrl}
                onAddTemplate={onAddTemplate}
                templates={templates}
                viewMode={viewMode}
              />
            ) : (
              <Loader loadingClass="!w-full !h-full min-h-[400px]" />
            )}
          </div>
        )}
      </div>

      {/* Advanced Modal Editor if triggered */}
      {modalElement && (
        <ElementEditorModal
          isOpen={!!modalElement}
          onClose={() => setModalElement(null)}
          element={modalElement}
        />
      )}
    </div>
  );
}

export default function Layout(props: BuilderProps) {
  const resolvedMode: BuilderMode =
    props.mode ||
    props.config?.mode ||
    (props.formData &&
    Array.isArray(props.formData) &&
    props.formData.length > 0
      ? "edit"
      : "create");

  return (
    <EditorProvider
      onChange={props.onChange}
      onLogAction={props.onLogAction}
      deleteMode={props.deleteMode || props.config?.deleteMode || "remove"}
      mode={resolvedMode}
      initialTitle={props.title}
      initialDescription={props.description}
      initialFormSettings={props.formSettings}
      onTitleChange={props.onTitleChange}
      onDescriptionChange={props.onDescriptionChange}
      onFormSettingsChange={props.onFormSettingsChange}
    >
      <Toaster position="top-right" richColors closeButton />
      <LayoutInner {...props} />
    </EditorProvider>
  );
}
