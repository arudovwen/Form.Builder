import { useContext, useCallback, DragEvent } from "react";
import EditorContext from "../../context/editor-context";
import ElementCanvas from "./element-canvas";
import { v4 as uuidv4 } from "uuid";
import AppIcon from "../ui/AppIcon";

const FormViewer = () => {
  const { removeSection, addElement, formData }: any =
    useContext(EditorContext);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
  }, []);

  return (
    <div className="flex gap-x-4 mx-auto h-full relative px-6 pb-5 flex-col  no-scrollbar overflow-y-auto max-h-[86vh]">
      <div className=" relative  w-full flex flex-col gap-y-6 flex-1 py-5">
        {formData.map(
          (section: {
            id: string | undefined;
            title: string;
            questionData: any;
          }) => (
            <div key={section.id} className="group">
              <div
                id={section.id}
                className="border rounded-lg py-4 px-6 min-h-[300px]   transition-colors duration-200"
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2>{section.title}</h2>
                  <div className="flex gap-x-4 items-center">
                    <button
                      type="button"
                      className="p-1 border rounded-lg"
                      onClick={() => removeSection(section.id)}
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
                  </div>
                </div>
                <hr />
                <div className=" gap-y-6 mt-4">
                  {
                    <ElementCanvas
                      elementData={section.questionData}
                      sectionId={section.id}
                    />
                  }
                </div>
              </div>
              <hr className="mt-6" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FormViewer;
