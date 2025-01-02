import { useContext, useCallback } from "react";
import EditorContext from "../../context/editor-context";
import ElementCanvas from "./element-canvas";
import { v4 as uuidv4 } from "uuid";

const FormViewer = () => {
  const { addElement }: any = useContext(EditorContext);

  const onDragOver = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { dropEffect: string };
    }) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const onDrop = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { getData: (arg0: string) => string };
    }) => {
      event.preventDefault();

      const properties = JSON.parse(event.dataTransfer.getData("properties"));
      const newElement = {
        id: uuidv4(),
        ...properties,
      };

      addElement(newElement);
    },
    []
  );

  return (
    <div
      className="flex gap-x-4 mx-auto h-full relative p-10"
      // @ts-ignore
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className=" relative  !min-h-[600px] no-scrollbar w-full">
        {<ElementCanvas />}
      </div>
    </div>
  );
};

export default FormViewer;
