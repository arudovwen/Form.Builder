import { useContext, useCallback, DragEvent, useState, useRef } from "react";
import EditorContext from "../../context/editor-context";
import ElementCanvas from "./element-canvas";
import { v4 as uuidv4 } from "uuid";
import AppIcon from "../ui/AppIcon";
import SectionEditorModal from "../elements/section-editor";

const FormViewer = () => {
  const [isOpen, setOpen] = useState(false);
  const tempSection = useRef(null);
  const [activeSections, setActiveSections] = useState<number[]>([0]);
  const { removeSection, addElement, formData, setIsDragging }: any =
    useContext(EditorContext);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    try {
      event.preventDefault();
      setIsDragging(false);
      const targetElement = event?.currentTarget;
      const data = event.dataTransfer.getData("properties");
      if (data) {
        const properties = JSON.parse(data);

        const newElement = {
          id: uuidv4(),
          sectionId: targetElement.id,
          ...properties,
        };

        addElement(newElement, targetElement.id);
      }
    } catch (error) {
      setIsDragging(false);
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
  return (
    <div className="flex gap-x-4 mx-auto h-full relative px-6 pb-5 flex-col  no-scrollbar overflow-y-auto max-h-[86vh]">
      {isOpen && (
        <SectionEditorModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          section={tempSection.current}
        />
      )}
      <div className=" relative  w-full flex flex-col gap-y-6 flex-1 py-5">
        {formData.map(
          (
            section: {
              id: string | undefined;
              title: string;
              questionData: any;
            },
            index: number
          ) => (
            <div key={section.id} className="group">
              <div
                className={`border rounded-lg py-4 px-6   transition-colors duration-200 ${
                  activeSections.includes(index) ? "min-h-[300px]" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <h2>{section.title}</h2>
                  <div className="flex gap-x-4 items-center">
                    <button
                      type="button"
                      className="p-1 border rounded-lg"
                      onClick={() => handleSectionEdit(section)}
                    >
                      <AppIcon icon="fluent:edit-28-regular" />
                    </button>
                    {formData.length > 1 && (
                      <button
                        type="button"
                        className="p-1 border rounded-lg"
                        onClick={() => removeSection(section.id)}
                      >
                        <AppIcon icon="lets-icons:trash-duotone-line" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="p-1 rounded-lg"
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
                {activeSections.includes(index) && (
                  <div
                    className="mt-4 transition-all duration-200 h-full"
                    id={section.id}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                  >
                    <hr />
                    <div className=" gap-y-6 mt-4 h-full">
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

export default FormViewer;
