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
  formDataLength,
  onDragOver,
  setIsDragging,
  onReorderSection,
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef(section?.questionData?.length);

  useEffect(() => {
    // Scroll to bottom when a new input is added
    if (section?.questionData?.length > prevLength.current) {
      if (scrollRef.current) {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    }
    prevLength.current = section?.questionData?.length;
  }, [section?.questionData?.length]);

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
      className={`bg-white group cursor-pointer rounded-lg  shadow-[rgba(149,157,165,0.2)_0px_2px_2px] transition-colors duration-200`}
    >
      <div
        className={` border border-gray-200 rounded-lg  px-4 transition-colors duration-200
          ${
            selectedSection === section.id
              ? " border-blue-200 bg-gray-100"
              : "bg-white"
          } ${activeSections.includes(index) ? "min-h-[300px] pb-6 " : ""}`}
      >
        <div className="flex items-center justify-between">
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("sectionid", section.id);
              e.dataTransfer.effectAllowed = "move";
              setIsDragging(true);
            }}
            onDragEnd={() => setIsDragging(false)}
            onClick={() => setSelectedSection(section.id)}
            className="flex-1 h-full py-4 cursor-grab active:cursor-grabbing flex items-center gap-2"
            title="Drag to reorder section"
          >
            <AppIcon icon="material-symbols:drag-indicator" iconClass="text-gray-400 text-lg" />
            <h2 className="font-medium">{section.title || "Section title"}</h2>
          </div>

          <div className="flex items-center gap-x-2">
            <button
              type="button"
              className="p-1 text-xs border rounded-lg"
              onClick={() => handleSectionEdit(section)}
            >
              <AppIcon icon="fluent:edit-28-regular" />
            </button>
            {formDataLength > 1 && (
              <button
                type="button"
                className="p-1 text-xs border rounded-lg"
                onClick={() => removeSection(section.id)}
              >
                <AppIcon icon="lets-icons:trash-duotone-line" />
              </button>
            )}
            <button
              type="button"
              className="p-1 text-xs rounded-lg"
              onClick={() => toggleSection(index)}
            >
              <AppIcon
                icon={
                  activeSections.includes(index)
                    ? "fa6-solid:chevron-up"
                    : "fa6-solid:chevron-down"
                }
                iconClass="text-base"
              />
            </button>
          </div>
        </div>
        {section?.description && activeSections.includes(index) && (
          <p className="mt-2 text-sm text-gray-600">{section?.description}</p>
        )}
        {activeSections.includes(index) && (
          <div
            className="h-full mt-4 transition-all duration-200"
            id={section.id}
            onDragOver={onDragOver}
            onDragEnd={() => setIsDragging(false)}
            onClick={() => setSelectedSection(section.id)}
          >
            <hr className="group-last:hidden" />
            <div className="h-full mt-4 gap-y-6 ">
              {
                <ElementCanvas
                  elementData={section?.questionData}
                  sectionId={section?.id}
                />
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormBuilder = ({ onAddTemplate, templates }: { onAddTemplate?: () => void; templates?: any[] }) => {
  const allTemplates = [...defaultTemplates, ...(templates || [])];
  const [isOpen, setOpen] = useState(false);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const tempSection = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
  const {
    removeSection,
    // addElement,
    addSection,
    formData,
    setIsDragging,
    setSelectedSection,
    selectedSection,
    activeSections,
    setActiveSections,
    setFormData,
  }: any = useContext(EditorContext);

  const prevFormDataLength = useRef(formData?.length || 0);

  useEffect(() => {
    setSelectedSection(formData[0]?.id || null);
  }, []);

  useEffect(() => {
    // Scroll to bottom when a new section is added
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

    // Scroll to the bottom of the container
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  const handleReorderSection = useCallback((draggedId: string, targetId: string) => {
    setFormData((prev: any[]) => {
      const draggedIndex = prev.findIndex((s) => s.id === draggedId);
      const targetIndex = prev.findIndex((s) => s.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return prev;
      
      const newArr = [...prev];
      const [draggedItem] = newArr.splice(draggedIndex, 1);
      newArr.splice(targetIndex, 0, draggedItem);
      return newArr;
    });
  }, [setFormData]);

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
        const newQuestions = sec.questionData?.map((q: any) => {
           const newQ = deepCloneWithNewId(q, { id: uuidv4(), sectionId: secId });
           return newQ;
        });

        // Let's make sure the grid children have the correct new gridId if they are part of a grid.
        // It's a bit complex, but for simple templates, this is a good start.
        if (newQuestions) {
           const idMap = new Map();
           sec.questionData.forEach((q: any, i: number) => {
             idMap.set(q.id, newQuestions[i].id);
           });
           newQuestions.forEach((q: any) => {
             if (q.gridId && idMap.has(q.gridId)) {
                q.gridId = idMap.get(q.gridId);
             }
           });
        }

        return deepCloneWithNewId(sec, { id: secId, questionData: newQuestions || [] });
      });
      
      const isInitialBlank = formData.length === 1 && 
                             formData[0].title === "" && 
                             formData[0].description === "" && 
                             (!formData[0]?.questionData || formData[0]?.questionData?.length === 0);

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

  const config = getItem("config");
  return (
    <div
      ref={containerRef} // Attach the ref to the container
      className="relative flex flex-col h-full pb-5 mx-auto gap-x-4 "
    >
      {isOpen && (
        <SectionEditorModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          section={tempSection.current}
        />
      )}
      <div
        id="section-container"
        className="relative flex flex-col flex-1 w-full gap-y-3 container overflow-y-auto"
      >
        {formData?.map(
          (
            section: {
              id: string;
              title: string;
              description?: string;
              questionData: any;
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
              formDataLength={formData.length}
              onDragOver={onDragOver}
              setIsDragging={setIsDragging}
              onReorderSection={handleReorderSection}
            />
          ),
        )}
        <div className="flex justify-center gap-x-4">
          <button
            type="button"
            onClick={() => addSection()}
            style={{ color: config?.buttonColor || "#333" }}
            className="text-sm font-medium"
          >
            + Add section{" "}
          </button>
          {(onAddTemplate || allTemplates?.length) ? (
            <button
              type="button"
              onClick={() => {
                if (allTemplates?.length) {
                  setTemplateModalOpen(true);
                } else if (onAddTemplate) {
                  onAddTemplate();
                }
              }}
              style={{ color: config?.buttonColor || "#333" }}
              className="text-sm font-medium"
            >
              + Add existing template
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
