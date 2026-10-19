import React, { useContext, useMemo, useState } from "react";
import EditorContext from "../../context/editor-context";
import AppIcon from "../ui/AppIcon";
import { v4 as uuidv4 } from "uuid";
import { getItem, setItem } from "../../utils/localStorageControl";

interface InspectorProps {
  onOpenAdvancedModal?: (element: any) => void;
}

export default function Inspector({ onOpenAdvancedModal }: InspectorProps) {
  const {
    formData,
    selectedElementId,
    setSelectedElementId,
    updateElement,
    removeElement,
    duplicateElement,
    formTitle,
    setFormTitle,
    formDescription,
    setFormDescription,
    formSettings,
    updateFormSettings,
  }: any = useContext(EditorContext);

  const [activeTab, setActiveTab] = useState<"field" | "validation">("field");
  const [config, setConfigState] = useState(() => getItem("config") || {});

  // Find the selected element and its sectionId from formData
  const selectedInfo = useMemo(() => {
    if (!selectedElementId || !formData) return null;
    for (const section of formData) {
      if (section?.formData) {
        const found = section.formData.find(
          (el: any) =>
            el.id === selectedElementId && !el.isFieldDeleted && !el.isDeleted,
        );
        if (found) {
          return { element: found, sectionId: section.id };
        }
      }
    }
    return null;
  }, [formData, selectedElementId]);

  const element = selectedInfo?.element;
  const sectionId = selectedInfo?.sectionId;

  // Handler for live updates to the current element
  const handlePropChange = (key: string, value: any) => {
    if (!element || !sectionId) return;
    const updated = {
      ...element,
      [key]: value,
    };
    updateElement(updated, sectionId);
  };

  // Option handlers for choice / select / radio / checkbox / poll
  const hasOptions = useMemo(() => {
    if (!element) return false;
    const type = (element.type || element.inputType || "").toLowerCase();
    return [
      "radio",
      "checkbox",
      "selectfield",
      "select",
      "multiselect",
      "polling",
      "ranking",
      "imagechoice",
      "matrix",
    ].includes(type);
  }, [element]);

  const handleOptionLabelChange = (index: number, newLabel: string) => {
    if (!element || !sectionId) return;
    const currentOptions = [...(element.options || [])];
    if (currentOptions[index]) {
      currentOptions[index] = {
        ...currentOptions[index],
        label: newLabel,
        value: currentOptions[index].value || newLabel.toLowerCase().replace(/\s+/g, "_"),
      };
      handlePropChange("options", currentOptions);
    }
  };

  const handleAddOption = () => {
    if (!element || !sectionId) return;
    const currentOptions = [...(element.options || [])];
    const newCount = currentOptions.length + 1;
    currentOptions.push({
      id: uuidv4(),
      label: `Option ${newCount}`,
      value: `option_${newCount}`,
    });
    handlePropChange("options", currentOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (!element || !sectionId) return;
    const currentOptions = [...(element.options || [])];
    currentOptions.splice(index, 1);
    handlePropChange("options", currentOptions);
  };

  const handleColorChange = (color: string) => {
    const updatedConfig = { ...config, buttonColor: color, elementColor: color };
    setConfigState(updatedConfig);
    setItem("config", updatedConfig);
  };

  const colorPresets = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Blue", value: "#2563eb" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Slate", value: "#0f172a" },
  ];

  return (
    <aside className="w-full h-full bg-white flex flex-col overflow-hidden text-gray-800 select-none">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-gray-200/90 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
            <AppIcon
              icon={element?.icon || "solar:settings-minimalistic-bold-duotone"}
              iconClass="text-lg"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">
              {element ? element.label || "Field Settings" : "Form Settings"}
            </h3>
            <p className="text-[11px] text-gray-400 font-normal">
              {element ? "Customize question properties" : "Global appearance & title"}
            </p>
          </div>
        </div>

        {element && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenAdvancedModal?.(element)}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-100"
              title="Open full advanced modal settings"
            >
              <AppIcon icon="solar:settings-bold-duotone" iconClass="text-sm" />
              <span>Advanced</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedElementId(null)}
              className="w-7 h-7 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="Deselect field / View form settings"
            >
              <AppIcon icon="lucide:x" iconClass="text-sm" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs if an element is selected */}
      {element && (
        <div className="flex border-b border-gray-200/80 px-5 bg-gray-50/50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("field")}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === "field"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("validation")}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === "validation"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Validations
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
        {element ? (
          activeTab === "field" ? (
            /* Field Settings Tab */
            <div className="space-y-5">
              {/* Field Label */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Field Label
                </label>
                <input
                  type="text"
                  value={element.inputLabel || ""}
                  onChange={(e) => handlePropChange("inputLabel", e.target.value)}
                  placeholder="e.g. What is your full name?"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Placeholder (if applicable) */}
              {element.type !== "divider" && element.type !== "spacer" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={element.placeholder || ""}
                    onChange={(e) => handlePropChange("placeholder", e.target.value)}
                    placeholder="e.g. Enter your name here..."
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Help Text / Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Help Text / Description
                </label>
                <textarea
                  rows={2}
                  value={element.description || ""}
                  onChange={(e) => handlePropChange("description", e.target.value)}
                  placeholder="Additional helper notes for the respondent"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Toggles (Switches) */}
              <div className="pt-2 border-t border-gray-100 space-y-3.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Field Behaviors
                </span>

                {/* Required Toggle */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <span className="text-xs font-medium text-gray-800 block">
                      Required Field
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      Respondent must fill this to proceed
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!element.isRequired}
                    onChange={(e) => handlePropChange("isRequired", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                </label>

                {/* Read Only Toggle */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <span className="text-xs font-medium text-gray-800 block">
                      Read Only
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      Display value without allowing changes
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!element.isReadOnly}
                    onChange={(e) => handlePropChange("isReadOnly", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                </label>

                {/* Hidden Field Toggle */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <span className="text-xs font-medium text-gray-800 block">
                      Hidden Field
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      Hide from regular form display
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!element.isHidden}
                    onChange={(e) => handlePropChange("isHidden", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                </label>
              </div>

              {/* Choices / Options Editor */}
              {hasOptions && (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Choices / Options ({element.options?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                    >
                      <AppIcon icon="lucide:plus" iconClass="text-xs" />
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {element.options?.map((opt: any, idx: number) => (
                      <div
                        key={opt.id || idx}
                        className="flex items-center gap-2 group bg-gray-50/80 p-1.5 rounded-lg border border-gray-200/80 focus-within:border-indigo-400 focus-within:bg-white transition-all"
                      >
                        <span className="text-gray-400 cursor-grab px-1">
                          <AppIcon icon="material-symbols:drag-indicator" iconClass="text-sm" />
                        </span>
                        <input
                          type="text"
                          value={opt.label || ""}
                          onChange={(e) => handleOptionLabelChange(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 text-xs bg-transparent border-0 focus:outline-none text-gray-800"
                        />
                        {element.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete option"
                          >
                            <AppIcon icon="lucide:trash-2" iconClass="text-xs" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Scale Specifics */}
              {element.type === "rating" && (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Maximum Stars
                  </label>
                  <div className="flex gap-2">
                    {[5, 7, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePropChange("max", num)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          (element.max || 5) === num
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {num} Stars
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions at bottom of field settings */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                {onOpenAdvancedModal && (
                  <button
                    type="button"
                    onClick={() => onOpenAdvancedModal(element)}
                    className="w-full py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50/60 hover:bg-indigo-50 rounded-lg border border-indigo-200/80 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <AppIcon icon="solar:settings-bold" iconClass="text-sm" />
                    Advanced Modal Settings
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => duplicateElement(element.id, sectionId)}
                    className="flex-1 py-2 px-3 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <AppIcon icon="lucide:copy-plus" iconClass="text-xs" />
                    Duplicate
                  </button>

                  <button
                    type="button"
                    onClick={() => removeElement(element.id, sectionId)}
                    className="flex-1 py-2 px-3 text-xs font-medium text-red-600 bg-white hover:bg-red-50 rounded-lg border border-red-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <AppIcon icon="lucide:trash-2" iconClass="text-xs" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Validations Tab */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Required Error Message
                </label>
                <input
                  type="text"
                  value={element.requiredMessage || ""}
                  onChange={(e) => handlePropChange("requiredMessage", e.target.value)}
                  placeholder="This field is required"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Min Length
                  </label>
                  <input
                    type="number"
                    value={element.minLength ?? ""}
                    onChange={(e) =>
                      handlePropChange(
                        "minLength",
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={element.maxLength ?? ""}
                    onChange={(e) =>
                      handlePropChange(
                        "maxLength",
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                    placeholder="255"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Custom Validation Pattern (RegEx)
                </label>
                <input
                  type="text"
                  value={element.pattern || ""}
                  onChange={(e) => handlePropChange("pattern", e.target.value)}
                  placeholder="e.g. ^[A-Za-z]+$"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 placeholder:text-gray-400 font-mono text-xs"
                />
              </div>
            </div>
          )
        ) : (
          /* Form Settings (When no field is selected) */
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Form Title
              </label>
              <input
                type="text"
                value={formSettings?.title || formTitle || ""}
                onChange={(e) => setFormTitle?.(e.target.value)}
                placeholder="Form Title"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Form Description
              </label>
              <textarea
                rows={3}
                value={formSettings?.description || formDescription || ""}
                onChange={(e) => setFormDescription?.(e.target.value)}
                placeholder="Give your respondents a brief overview"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Display / Render Mode */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Respondent Display Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/80 rounded-xl border border-gray-200/70">
                {(
                  [
                    { key: "multi", label: "Multi-Step" },
                    { key: "single", label: "Single" },
                    { key: "conversational", label: "Chat" },
                  ] as const
                ).map((mode) => {
                  const isActive =
                    (formSettings?.renderType || "multi") === mode.key;
                  return (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() =>
                        updateFormSettings?.({ renderType: mode.key })
                      }
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Submit Button Label
              </label>
              <input
                type="text"
                value={formSettings?.submitText || "Submit"}
                onChange={(e) =>
                  updateFormSettings?.({ submitText: e.target.value })
                }
                placeholder="e.g. Submit, Send Response, Finish"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
              />
            </div>

            {/* Brand Color */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Brand / Primary Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorPresets.map((preset) => {
                  const currentColor =
                    formSettings?.buttonColor ||
                    config?.buttonColor ||
                    "#6366f1";
                  const isCurrent =
                    currentColor.toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        handleColorChange(preset.value);
                        updateFormSettings?.({ buttonColor: preset.value });
                      }}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-all ${
                        isCurrent
                          ? "border-indigo-500 bg-indigo-50/40 font-semibold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: preset.value }}
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Experience Switches */}
            <div className="pt-2 border-t border-gray-100 space-y-3.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Form Experience & Rules
              </span>

              {/* Show Progress Bar */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-xs font-medium text-gray-800 block">
                    Show Progress Bar
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    Display completion status to respondents
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings?.showProgressBar ?? true}
                  onChange={(e) =>
                    updateFormSettings?.({ showProgressBar: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              </label>

              {/* Allow Multiple Submissions */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-xs font-medium text-gray-800 block">
                    Allow Multiple Responses
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    Show option to submit another response
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings?.allowMultipleSubmissions ?? true}
                  onChange={(e) =>
                    updateFormSettings?.({
                      allowMultipleSubmissions: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              </label>

              {/* Send Hidden Sections As Empty */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-xs font-medium text-gray-800 block">
                    Send Hidden Sections As Empty
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    Zero out hidden values upon submission
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings?.sendHiddenSectionsAsEmpty ?? false}
                  onChange={(e) =>
                    updateFormSettings?.({
                      sendHiddenSectionsAsEmpty: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              </label>
            </div>

            {/* Helper callout */}
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900 flex gap-2.5 items-start">
              <AppIcon icon="lucide:info" iconClass="text-base text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Live Synced</span>
                All form settings are passed out via callbacks and saved with form submissions.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-gray-200/90 bg-gray-50/60 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live synced
        </span>
        <span className="text-gray-400">Arudovwen Builder</span>
      </div>
    </aside>
  );
}
