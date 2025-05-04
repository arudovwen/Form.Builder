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

const FormBuilder = () => {
  const [isOpen, setOpen] = useState(false);
  const tempSection = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
  const {
    removeSection,
    // addElement,
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

  // const onDrop = useCallback(
  //   (event: DragEvent<HTMLDivElement>) => {
  //     try {
  //       event.preventDefault();
  //       setIsDragging(false);
  //       const targetElement = event?.currentTarget;
  //       const data = event.dataTransfer.getData("properties");
  //       if (data) {
  //         const properties = JSON.parse(data);

  //         const newElement = {
  //           id: uuidv4(),
  //           sectionId: targetElement.id,
  //           ...properties,
  //         };

  //         addElement(newElement, targetElement.id);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setIsDragging(false);
  //     }
  //   },
  //   [addElement, setIsDragging]
  // );

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

  return (
    <div
      ref={containerRef} // Attach the ref to the container
      className="flex gap-x-4 mx-auto h-full relative px-6 pb-5 flex-col no-scrollbar overflow-y-auto max-h-[86vh]"
    >
      {isOpen && (
        <SectionEditorModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          section={tempSection.current}
        />
      )}
      <div className="relative w-full flex flex-col gap-y-6 flex-1 py-4">
        {formData.map(
          (
            section: {
              id: string | undefined;
              title: string;
              description?: string;
              questionData: any;
            },
            index: number
          ) => (
            <div key={section.id} className={`group cursor-pointer rounded`}>
              <div
                className={`border border-gray-100 rounded pb-6  px-4 shadow-[rgba(149,157,165,0.2)_0px_2px_4px] transition-colors duration-200
                  ${
                    selectedSection === section.id
                      ? "border-dashed border-blue-400 bg-[#f7f8fa]"
                      : "border-transparent"
                  } ${activeSections.includes(index) ? "min-h-[300px]" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <div onClick={() => setSelectedSection(section.id)} className="h-full flex-1 cursor-pointer py-4">
                    <h2 className="font-medium">
                      {section.title || "Section title"}
                    </h2>
                  </div>

                  <div className="flex gap-x-2 items-center">
                    <button
                      type="button"
                      className="p-1 border rounded-lg text-xs"
                      onClick={() => handleSectionEdit(section)}
                    >
                      <AppIcon icon="fluent:edit-28-regular" />
                    </button>
                    {formData.length > 1 && (
                      <button
                        type="button"
                        className="p-1 border rounded-lg text-xs"
                        onClick={() => removeSection(section.id)}
                      >
                        <AppIcon icon="lets-icons:trash-duotone-line" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="p-1 rounded-lg text-xs"
                      onClick={() => toggleSection(index)}
                    >
                      <AppIcon
                        icon={
                          !activeSections.includes(index)
                            ? "octicon:plus-16"
                            : "gravity-ui:minus"
                        }
                      />
                    </button>
                  </div>
                </div>
                {section?.description && activeSections.includes(index) && (
                  <p className="text-sm text-gray-60 mt-2 text-gray-600">
                    {section?.description}
                  </p>
                )}
                {activeSections.includes(index) && (
                  <div
                    className="mt-4 transition-all duration-200 h-full"
                    id={section.id}
                    onDragOver={onDragOver}
                    onDragEnd={() => setIsDragging(false)}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <hr />
                    <div className="gap-y-6 mt-4 h-full">
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
              <hr className="mt-6 group-last:hidden" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
