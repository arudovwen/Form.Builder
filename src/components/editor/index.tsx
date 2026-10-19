import {
  useContext,
  useCallback,
  DragEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import EditorContext from "../../context/editor-context";
import ElementCanvas from "./element-canvas";
import { v4 as uuidv4 } from "uuid";
import AppIcon from "../ui/AppIcon";
import SectionEditorModal from "../elements/section-editor";
import TemplateSelectorModal from "../elements/template-selector";
import { getItem } from "../../utils/localStorageControl";
import { defaultTemplates } from "../../utils/default-templates";

const SectionItem = ({
  section,
  index,
  selectedSection,
  setSelectedSection,
  activeSections,
  toggleSection,
  handleSectionEdit,
  removeSection,
  copySection,
  duplicateSection,
  formDataLength,
  onDragOver,
  setIsDragging,
  isDragging,
  onReorderSection,
  addElement,
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef(section?.formData?.length);
  const wasDragging = useRef(isDragging);

  useEffect(() => {
    // Scroll to bottom when a new input is added
    if (section?.formData?.length > prevLength.current) {
      if (!isDragging && !wasDragging.current) {
        const container = document.getElementById("section-container");
        if (container) {
          requestAnimationFrame(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          });
        }
      }
    }
    prevLength.current = section?.formData?.length;
  }, [section?.formData?.length, isDragging]);

  useEffect(() => {
    wasDragging.current = isDragging;
  }, [isDragging]);

  const isSelected = selectedSection === section.id;

  return (
    <div
      ref={scrollRef}
      key={section?.id}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("sectionid")) {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        const draggedId = e.dataTransfer.getData("sectionid");
        if (draggedId) {
          e.preventDefault();
          e.stopPropagation();
          if (onReorderSection) onReorderSection(draggedId, section.id);
        }
      }}
      className={`bg-white group rounded-2xl border transition-all duration-200 shadow-xs mb-4 overflow-hidden ${
        isSelected
          ? "border-indigo-300 ring-2 ring-indigo-500/10 shadow-sm"
          : "border-gray-200/90 hover:border-gray-300"
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("sectionid", section.id);
              e.dataTransfer.effectAllowed = "move";
              setIsDragging(true);
            }}
            onDragEnd={() => setIsDragging(false)}
            onClick={() => setSelectedSection(section.id)}
            className="flex-1 cursor-grab active:cursor-grabbing flex items-center gap-2 select-none"
            title="Drag to reorder section"
          >
            <AppIcon
              icon="material-symbols:drag-indicator"
              iconClass="text-gray-400 text-lg"
            />
            <h2 className="font-semibold text-gray-900 text-sm tracking-tight">
              {section.title || `Section ${index + 1}`}
            </h2>
          </div>

          <div className="flex items-center gap-x-1.5">
            <button
              type="button"
              className="p-1.5 text-xs rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Copy section"
              onClick={(e) => {
                e.stopPropagation();
                copySection?.(section.id);
              }}
            >
              <AppIcon icon="fluent:copy-20-regular" iconClass="text-sm" />
            </button>
            <button
              type="button"
              className="p-1.5 text-xs rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Duplicate section"
              onClick={(e) => {
                e.stopPropagation();
                duplicateSection?.(section.id);
              }}
            >
              <AppIcon icon="lucide:copy-plus" iconClass="text-sm" />
            </button>
            <button
              type="button"
              className="p-1.5 text-xs rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Edit section details"
              onClick={() => handleSectionEdit(section)}
            >
              <AppIcon icon="fluent:edit-28-regular" iconClass="text-sm" />
            </button>
            {formDataLength > 1 && (
              <button
                type="button"
                className="p-1.5 text-xs rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete section"
                onClick={() => removeSection(section.id)}
              >
                <AppIcon icon="lets-icons:trash-duotone-line" iconClass="text-sm" />
              </button>
            )}
            <button
              type="button"
              className="p-1.5 text-xs rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection(index)}
              title={activeSections.includes(index) ? "Collapse section" : "Expand section"}
            >
              <AppIcon
                icon={
                  activeSections.includes(index)
                    ? "fa6-solid:chevron-up"
                    : "fa6-solid:chevron-down"
                }
                iconClass="text-xs"
              />
            </button>
          </div>
        </div>

        {section?.description && activeSections.includes(index) && (
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            {section?.description}
          </p>
        )}

        {activeSections.includes(index) && (
          <div
            className="h-full mt-4 transition-all duration-200"
            id={section.id}
            onDragOver={onDragOver}
            onDragEnd={() => setIsDragging(false)}
            onClick={() => setSelectedSection(section.id)}
          >
            <div className="h-full gap-y-4 flex flex-col">
              <ElementCanvas
                elementData={section?.formData}
                sectionId={section?.id}
              />

              {/* Quick Add Question Dashed Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSection(section.id);
                  const newQuestion = {
                    type: "textField",
                    label: "Short Text",
                    icon: "ri:text",
                    inputLabel: "New Question",
                    inputType: "text",
                    required: false,
                    placeholder: "Type your answer here...",
                    id: uuidv4(),
                    sectionId: section.id,
                  };
                  addElement?.(newQuestion, section.id);
                }}
                className="w-full mt-2 py-3 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-gray-500 hover:text-indigo-600 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                  <AppIcon icon="lucide:plus" iconClass="text-xs" />
                </div>
                <span>Add Question</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormBuilder = ({
  onAddTemplate,
  templates,
}: {
  onAddTemplate?: () => void;
  templates?: any[];
}) => {
  const allTemplates = [...defaultTemplates, ...(templates || [])];
  const [isOpen, setOpen] = useState(false);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [hasSectionInClipboard, setHasSectionInClipboard] = useState(false);
  const tempSection = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    removeSection,
    addSection,
    formData,
    setIsDragging,
    setSelectedSection,
    selectedSection,
    activeSections,
    setActiveSections,
    setFormData,
    isDragging,
    pasteElement,
    copySection,
    pasteSection,
    duplicateSection,
    deviceView = "desktop",
    formTitle,
    formDescription,
    addElement,
  }: any = useContext(EditorContext);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const clipboardText = e.clipboardData?.getData("text") || "";
      if (clipboardText.includes("FORM_BUILDER_SECTION_CLIPBOARD")) {
        pasteSection(undefined, clipboardText);
      } else if (selectedSection) {
        pasteElement(selectedSection, undefined, clipboardText);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [selectedSection, pasteElement, pasteSection]);

  useEffect(() => {
    const checkClipboard = () => {
      try {
        const clipboardString =
          localStorage.getItem("form_builder_section_clipboard") ||
          localStorage.getItem("form_builder_clipboard");
        if (clipboardString) {
          const copiedData = JSON.parse(clipboardString);
          if (
            copiedData?.type === "FORM_BUILDER_SECTION_CLIPBOARD" &&
            copiedData?.section
          ) {
            const isExpired =
              copiedData?.timestamp &&
              Date.now() - copiedData.timestamp > 60000;
            if (isExpired) {
              localStorage.removeItem("form_builder_section_clipboard");
              localStorage.removeItem("form_builder_clipboard");
              setHasSectionInClipboard(false);
            } else {
              setHasSectionInClipboard(true);
            }
          } else {
            setHasSectionInClipboard(false);
          }
        } else {
          setHasSectionInClipboard(false);
        }
      } catch {
        setHasSectionInClipboard(false);
      }
    };

    checkClipboard();
    const interval = setInterval(checkClipboard, 1000);
    return () => clearInterval(interval);
  }, []);

  const prevFormDataLength = useRef(formData?.length || 0);

  useEffect(() => {
    if (formData && formData.length > 0 && !selectedSection) {
      setSelectedSection(formData[0]?.id || null);
    }
  }, [formData, selectedSection, setSelectedSection]);

  useEffect(() => {
    if (formData?.length > prevFormDataLength.current) {
      if (containerRef.current) {
        requestAnimationFrame(() => {
          containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    }
    prevFormDataLength.current = formData?.length || 0;
  }, [formData?.length]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleReorderSection = useCallback(
    (draggedId: string, targetId: string) => {
      setFormData((prev: any[]) => {
        const draggedIndex = prev.findIndex((s) => s.id === draggedId);
        const targetIndex = prev.findIndex((s) => s.id === targetId);
        if (
          draggedIndex === -1 ||
          targetIndex === -1 ||
          draggedIndex === targetIndex
        )
          return prev;

        const newArr = [...prev];
        const [draggedItem] = newArr.splice(draggedIndex, 1);
        newArr.splice(targetIndex, 0, draggedItem);
        return newArr;
      });
    },
    [setFormData],
  );

  function toggleSection(index: number) {
    if (activeSections.includes(index)) {
      setActiveSections((prevSections: any[]) =>
        prevSections.filter((id) => id !== index),
      );
    } else {
      setActiveSections((prevSections: any[]) => [...prevSections, index]);
    }
  }

  function handleSectionEdit(section: any) {
    tempSection.current = section;
    setOpen(true);
  }

  const handleTemplateSelect = (template: any) => {
    const deepCloneWithNewId = (obj: any, overrides: any = {}) => ({
      ...JSON.parse(JSON.stringify(obj)),
      ...overrides,
    });

    if (template.sections && Array.isArray(template.sections)) {
      const validSections = template.sections.filter(Boolean);
      const newSections = validSections.map((sec: any) => {
        const secId = uuidv4();
        const newQuestions = sec.formData?.map((q: any) => {
          const newQ = deepCloneWithNewId(q, {
            id: uuidv4(),
            sectionId: secId,
          });
          return newQ;
        });

        if (newQuestions) {
          const idMap = new Map();
          sec.formData.forEach((q: any, i: number) => {
            idMap.set(q.id, newQuestions[i].id);
          });
          newQuestions.forEach((q: any) => {
            if (q.gridId && idMap.has(q.gridId)) {
              q.gridId = idMap.get(q.gridId);
            }
          });
        }

        return deepCloneWithNewId(sec, {
          id: secId,
          formData: newQuestions || [],
        });
      });

      const isInitialBlank =
        formData.length === 1 &&
        formData[0].title === "" &&
        formData[0].description === "" &&
        (!formData[0]?.formData || formData[0]?.formData?.length === 0);

      if (isInitialBlank) {
        setFormData(newSections);
        if (newSections.length > 0) {
          setSelectedSection(newSections[0]?.id);
        }
      } else {
        setFormData((prev: any[]) => [...prev, ...newSections]);
      }
    }
  };

  const config = getItem("config") || {};

  // Responsive Artboard container width
  const artboardMaxWidthClass =
    deviceView === "mobile"
      ? "max-w-[400px]"
      : deviceView === "tablet"
        ? "max-w-[620px]"
        : "max-w-[780px]";

  return (
    <div className="relative flex flex-col h-full pb-10 w-full overflow-y-auto no-scrollbar">
      {isOpen && (
        <SectionEditorModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          section={tempSection.current}
        />
      )}

      {/* Artboard Container with smooth width transition */}
      <div
        id="section-container"
        ref={containerRef}
        className={`mx-auto w-full transition-all duration-300 ${artboardMaxWidthClass}`}
      >
        {/* Top Form Header Sheet */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8 mb-5 relative overflow-hidden select-none">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 absolute top-0 left-0" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                {formTitle || "Customer Onboarding & Product Feedback"}
              </h1>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {formDescription ||
                  "Help us improve our service by providing feedback on your recent interaction."}
              </p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        {formData
          ?.filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
          ?.map(
            (
              section: {
                id: string;
                title: string;
                description?: string;
                formData: any;
                isFieldDeleted?: boolean;
                isDeleted?: boolean;
              },
              index: number,
            ) => (
              <SectionItem
                key={section.id}
                section={section}
                index={index}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                activeSections={activeSections}
                toggleSection={toggleSection}
                handleSectionEdit={handleSectionEdit}
                removeSection={removeSection}
                copySection={copySection}
                duplicateSection={duplicateSection}
                formDataLength={
                  formData?.filter((s: any) => !s?.isFieldDeleted && !s?.isDeleted)?.length || 0
                }
                onDragOver={onDragOver}
                setIsDragging={setIsDragging}
                isDragging={isDragging}
                onReorderSection={handleReorderSection}
                addElement={addElement}
              />
            ),
          )}

        {/* Canvas Bottom Action Bar */}
        <div className="flex justify-center items-center gap-3 flex-wrap mt-4">
          <button
            type="button"
            onClick={() => addSection()}
            style={{ color: config?.buttonColor || "#4f46e5" }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <AppIcon icon="lucide:plus" iconClass="text-xs" />
            Add Section
          </button>

          {hasSectionInClipboard && (
            <button
              type="button"
              onClick={() => pasteSection()}
              style={{ color: config?.buttonColor || "#4f46e5" }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20 shadow-xs flex items-center gap-1.5 transition-all"
              title="Paste section from clipboard"
            >
              <AppIcon icon="lucide:clipboard-paste" iconClass="text-xs" />
              Paste Section
            </button>
          )}

          {onAddTemplate || allTemplates?.length ? (
            <button
              type="button"
              onClick={() => {
                if (allTemplates?.length) {
                  setTemplateModalOpen(true);
                } else if (onAddTemplate) {
                  onAddTemplate();
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-xs flex items-center gap-1.5 transition-all"
            >
              <AppIcon icon="solar:document-add-linear" iconClass="text-xs" />
              Templates
            </button>
          ) : null}
        </div>
      </div>

      {isTemplateModalOpen && (
        <TemplateSelectorModal
          isOpen={isTemplateModalOpen}
          onClose={() => setTemplateModalOpen(false)}
          templates={allTemplates}
          onSelect={handleTemplateSelect}
        />
      )}
    </div>
  );
};

export default FormBuilder;
