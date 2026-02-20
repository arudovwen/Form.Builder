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

  useEffect(() => {
    setSelectedSection(formData[0]?.id || null);
  }, []);

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
      setActiveSections((prevSections) =>
        prevSections.filter((id) => id !== index)
      );
    } else {
      setActiveSections((prevSections) => [...prevSections, index]);
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
      className="relative flex flex-col h-full px-6 pb-5 mx-auto gap-x-4"
    >
      {isOpen && (
        <SectionEditorModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          section={tempSection.current}
        />
      )}
      <div className="relative flex flex-col flex-1 w-full py-4 gap-y-6">
        {formData?.map(
          (
            section: {
              id: string | undefined;
              title: string;
              description?: string;
              questionData: any;
            },
            index: number
          ) => (
            <div
              key={section.id}
              className={`bg-white group cursor-pointer rounded `}
            >
              <div
                className={`border border-gray-100 rounded  px-4 shadow-[rgba(149,157,165,0.2)_0px_2px_4px] transition-colors duration-200
                  ${
                    selectedSection === section.id
                      ? "border-dashed border-blue-400 bg-[#f7f8fa]"
                      : ""
                  } ${
                  activeSections.includes(index) ? "min-h-[300px] pb-6 " : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => setSelectedSection(section.id)}
                    className="flex-1 h-full py-4 cursor-pointer"
                  >
                    <h2 className="font-medium">
                      {section.title || "Section title"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-x-2">
                    <button
                      type="button"
                      className="p-1 text-xs border rounded-lg"
                      onClick={() => handleSectionEdit(section)}
                    >
                      <AppIcon icon="fluent:edit-28-regular" />
                    </button>
                    {formData.length > 1 && (
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
                  <p className="mt-2 text-sm text-gray-600 text-gray-60">
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
                    <hr className="group-last:hidden" />
                    <div className="h-full mt-4 gap-y-6">
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
              {/* <hr className="mt-6 group-last:hidden" /> */}
            </div>
          )
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
