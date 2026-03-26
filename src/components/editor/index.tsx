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
// import { v4 as uuidv4 } from "uuid";
import AppIcon from "../ui/AppIcon";
import SectionEditorModal from "../elements/section-editor";
import { getItem } from "../../utils/localStorageControl";

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
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef(section.questionData.length);

  useEffect(() => {
    // Scroll to bottom when a new input is added
    if (section.questionData.length > prevLength.current) {
      if (scrollRef.current) {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    }
    prevLength.current = section.questionData.length;
  }, [section.questionData.length]);

  return (
    <div
      ref={scrollRef}
      key={section.id}
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
            onClick={() => setSelectedSection(section.id)}
            className="flex-1 h-full py-4 cursor-pointer"
          >
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
                  elementData={section.questionData}
                  sectionId={section.id}
                />
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormBuilder = () => {
  const [isOpen, setOpen] = useState(false);
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
            />
          ),
        )}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => addSection()}
            style={{ color: config?.buttonColor || "#333" }}
            className="text-sm font-medium"
          >
            + Add section{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
