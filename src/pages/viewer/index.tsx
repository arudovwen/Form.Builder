import { ReactNode, useEffect, useCallback, useState } from "react";
import Loader from "../../components/Loader";
import FormRenderer from "../../components/viewer";
import { setItem } from "../../utils/localStorageControl";
import {
  EditorProvider,
  DeleteMode,
  FormSettings,
} from "@/context/editor-context";
import AppIcon from "@/components/ui/AppIcon";
import { Link } from "react-router";

export interface RenderProps {
  onSubmit?: (data: any, settings?: FormSettings) => void;
  answerData?: any;
  isReadOnly?: boolean;
  form_data?: any;
  ignoreValidation?: boolean;
  loading?: boolean;
  config?: any;
  renderType?: "multi" | "single" | "conversational";
  children?:
    | ReactNode
    | ((options: {
        isUploading: boolean;
        isSubmitting: boolean;
        hasErrors: boolean;
        submitText?: string;
      }) => ReactNode);
  hideFooter?: boolean;
  onGetValues?: (e: any) => void;
  uploadUrl?: string;
  pollResults?: Record<string, any>;
  showResults?: boolean;
  hideInputsOnResults?: boolean;
  sendHiddenSectionsAsEmpty?: boolean;
  preview?: boolean;
  deleteMode?: DeleteMode;
  submitText?: string;
  title?: string;
  description?: string;
  formSettings?: FormSettings;
}

export default function Viewer({
  answerData,
  form_data,
  ignoreValidation,
  onSubmit,
  isReadOnly = false,
  loading = false,
  config = { buttonColor: "#4f46e5" },
  renderType = "multi",
  children,
  hideFooter,
  onGetValues,
  uploadUrl,
  pollResults,
  showResults,
  hideInputsOnResults = false,
  sendHiddenSectionsAsEmpty = false,
  preview = false,
  deleteMode,
  submitText = "Submit",
  title,
  description,
  formSettings: externalFormSettings,
}: RenderProps) {
  const [activeFormSettings] = useState<FormSettings>(() => {
    if (externalFormSettings) return externalFormSettings;
    try {
      const saved = localStorage.getItem("formSettings");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const effectiveRenderType =
    activeFormSettings?.renderType || renderType || "multi";
  const [activeRenderType, setActiveRenderType] = useState<
    "multi" | "single" | "conversational"
  >(effectiveRenderType);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  useEffect(() => {
    if (renderType) setActiveRenderType(renderType);
  }, [renderType]);

  // ✅ Store config in localStorage only when it changes
  useEffect(() => {
    if (config) setItem("config", config);
  }, [config]);

  // ✅ Stabilize onGetValues reference
  const stableOnGetValues = useCallback(
    (vals: any) => {
      if (onGetValues) onGetValues(vals);
    },
    [onGetValues],
  );

  if (loading) return <Loader />;

  if (preview) {
    return (
      <div className="w-full h-full min-w-0">
        <div id="root-portal"></div>
        <EditorProvider deleteMode={deleteMode}>
          <FormRenderer
            form_data={form_data}
            answerData={answerData}
            ignoreValidation={ignoreValidation}
            onSubmitData={(data) => onSubmit?.(data, activeFormSettings)}
            onGetValues={stableOnGetValues}
            isReadOnly={isReadOnly}
            renderType={activeRenderType}
            hideFooter={hideFooter}
            uploadUrl={uploadUrl}
            pollResults={pollResults}
            showResults={showResults}
            hideInputsOnResults={hideInputsOnResults}
            sendHiddenSectionsAsEmpty={sendHiddenSectionsAsEmpty}
            preview={preview}
            submitText={submitText}
          >
            {children}
          </FormRenderer>
        </EditorProvider>
      </div>
    );
  }

  if (!form_data || !form_data.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-4 shadow-xs">
          <AppIcon icon="solar:document-linear" iconClass="text-2xl" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          No form data available
        </h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm">
          The requested form could not be loaded or has no published questions.
        </p>
        <Link
          to="/"
          className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-all flex items-center gap-1.5"
        >
          <AppIcon icon="solar:arrow-left-linear" iconClass="text-sm" />
          Back to Builder
        </Link>
      </div>
    );
  }

  const formHeading =
    title ||
    form_data?.[0]?.title ||
    "Form Preview";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100/70 via-gray-50 to-indigo-50/30 flex flex-col items-center">
      <div id="root-portal"></div>

      {/* Top Floating Control Bar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3 sticky top-0 z-40 flex items-center justify-between gap-4 shadow-xs">
        {/* Left: Brand & Back to Studio */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs font-semibold group px-2 py-1.5 rounded-lg hover:bg-gray-100"
            title="Return to Builder studio"
          >
            <AppIcon
              icon="solar:arrow-left-linear"
              iconClass="text-sm group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="hidden sm:inline">Studio</span>
          </Link>

          <span className="text-gray-300">|</span>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-xs shadow-indigo-300">
              <AppIcon icon="solar:document-text-bold" iconClass="text-xs" />
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {formHeading}
            </h1>
          </div>
        </div>

        {/* Center: Render Mode Switcher */}
        <div className="hidden md:flex items-center bg-gray-100/90 p-1 rounded-xl border border-gray-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveRenderType("single")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRenderType === "single"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <AppIcon icon="solar:document-text-linear" iconClass="text-sm" />
            Single Page
          </button>
          <button
            type="button"
            onClick={() => setActiveRenderType("multi")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRenderType === "multi"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <AppIcon icon="solar:layers-linear" iconClass="text-sm" />
            Multi-Step
          </button>
          <button
            type="button"
            onClick={() => setActiveRenderType("conversational")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRenderType === "conversational"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <AppIcon icon="solar:chat-round-line-linear" iconClass="text-sm" />
            Conversational
          </button>
        </div>

        {/* Right: Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl border border-gray-200/80">
          <button
            type="button"
            onClick={() => setDeviceView("desktop")}
            className={`p-1.5 rounded-lg transition-all ${
              deviceView === "desktop"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-gray-400 hover:text-gray-700"
            }`}
            title="Desktop view"
          >
            <AppIcon icon="solar:laptop-minimalistic-linear" iconClass="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("tablet")}
            className={`p-1.5 rounded-lg transition-all ${
              deviceView === "tablet"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-gray-400 hover:text-gray-700"
            }`}
            title="Tablet view"
          >
            <AppIcon icon="solar:tablet-linear" iconClass="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("mobile")}
            className={`p-1.5 rounded-lg transition-all ${
              deviceView === "mobile"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-gray-400 hover:text-gray-700"
            }`}
            title="Mobile view"
          >
            <AppIcon icon="solar:smartphone-linear" iconClass="text-sm" />
          </button>
        </div>
      </header>

      {/* Respondent Canvas Stage */}
      <main className="w-full flex-1 flex flex-col items-center justify-start py-8 sm:py-12 px-4">
        <div
          className={`w-full transition-all duration-300 ease-out ${
            deviceView === "mobile"
              ? "max-w-[420px]"
              : deviceView === "tablet"
                ? "max-w-[640px]"
                : "max-w-[780px]"
          }`}
        >
          {activeRenderType !== "conversational" ? (
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-10 relative">
              <EditorProvider deleteMode={deleteMode}>
                <FormRenderer
                  form_data={form_data}
                  answerData={answerData}
                  ignoreValidation={ignoreValidation}
                  onSubmitData={(data) => onSubmit?.(data, activeFormSettings)}
                  isReadOnly={isReadOnly}
                  renderType={activeRenderType}
                  hideFooter={hideFooter}
                  onGetValues={stableOnGetValues}
                  uploadUrl={uploadUrl}
                  pollResults={pollResults}
                  showResults={showResults}
                  hideInputsOnResults={hideInputsOnResults}
                  sendHiddenSectionsAsEmpty={sendHiddenSectionsAsEmpty}
                  preview={preview}
                  submitText={activeFormSettings?.submitText || submitText}
                >
                  {children}
                </FormRenderer>
              </EditorProvider>
            </div>
          ) : (
            <EditorProvider deleteMode={deleteMode}>
              <FormRenderer
                form_data={form_data}
                answerData={answerData}
                ignoreValidation={ignoreValidation}
                onSubmitData={(data) => onSubmit?.(data, activeFormSettings)}
                isReadOnly={isReadOnly}
                renderType={activeRenderType}
                hideFooter={hideFooter}
                onGetValues={stableOnGetValues}
                uploadUrl={uploadUrl}
                pollResults={pollResults}
                showResults={showResults}
                hideInputsOnResults={hideInputsOnResults}
                sendHiddenSectionsAsEmpty={sendHiddenSectionsAsEmpty}
                preview={preview}
                submitText={activeFormSettings?.submitText || submitText}
              >
                {children}
              </FormRenderer>
            </EditorProvider>
          )}

          {/* Respondent Security & Attribution Footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
            <AppIcon icon="solar:shield-check-linear" iconClass="text-sm text-emerald-500" />
            <span>256-bit encrypted submission • Powered by Form.Builder</span>
          </div>
        </div>
      </main>
    </div>
  );
}
