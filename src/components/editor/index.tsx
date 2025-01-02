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

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const targetElement = event?.currentTarget;
    console.log("🚀 ~ onDrop ~ targetElement:", targetElement);
    console.log(
      "🚀 ~ onDrop ~ event.dataTransfer:",
      event.dataTransfer.getData("properties")
    );
    // const properties = JSON.parse(event.dataTransfer.getData("properties"));

    // const newElement = {
    //   id: uuidv4(),
    //   sectionId: targetElement.id,
    //   ...properties,
    // };

    // addElement(newElement, targetElement.id);
  };

  return (
    <div className="flex gap-x-4 mx-auto h-full relative px-6 py-5 flex-col">
      <div className="relative  !min-h-[600px] no-scrollbar w-full flex flex-col gap-y-6 flex-1">
        {formData.map(
          (section: {
            id: string | undefined;
            title: string;
            questionData: any;
          }) => (
            <div
              id={section.id}
              className="border rounded-lg py-4 px-6 min-h-[300px] flex-1"
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
          )
        )}
      </div>
    </div>
  );
};

export default FormViewer;
