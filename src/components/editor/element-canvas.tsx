import { useContext, useState, useCallback, DragEvent } from "react";
import EditorContext from "../../context/editor-context";
import { renderElement } from "./element-render";

interface FormElement {
  id: string;
  [key: string]: any;
}

export interface EditorContextType {
  formData: FormElement[];
  updateElementPosition: (newData: FormElement[], sectionId: string) => void;
  updateElement: any;
  removeElement: any;
}

export default function ElementCanvas({ elementData, sectionId }: any) {
  const { formData, updateElementPosition } = useContext(
    EditorContext
  ) as unknown as EditorContextType;
  const [draggedElement, setDraggedElement] = useState<string | null>(null);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, elementId: string) => {
      event.dataTransfer.setData("properties", elementId);
      setDraggedElement(elementId);
    },
    
    []
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const questionData = formData.find(
        (section) => section.id === sectionId
      )?.questionData;
      const draggedElementId = event.dataTransfer.getData("properties");
      const targetElement = event.currentTarget;

      if (!targetElement.id || draggedElementId === targetElement.id) {
        return;
      }
    
      const draggedIndex = questionData.findIndex(
        (el: { id: string; }) => el.id === draggedElementId
      );
      const targetIndex = questionData.findIndex(
        (el: { id: string; }) => el.id === targetElement.id
      );

      if (draggedIndex === -1 || targetIndex === -1) {
        return;
      }
     
      // Create a new array and swap the elements
      if (questionData.length) {
        const updatedFormData = [...questionData];
        [updatedFormData[draggedIndex], updatedFormData[targetIndex]] = [
          updatedFormData[targetIndex],
          updatedFormData[draggedIndex],
        ];

        updateElementPosition(updatedFormData, sectionId);
        setDraggedElement(null);
      }
    },
    [formData, updateElementPosition]
  );
    
  const renderDraggableElement = useCallback(
    (element: FormElement) => (
      <div
        key={element.id}
        id={element.id}
        className={`cursor-move border p-4 w-full transition-colors rounded-lg ${
          draggedElement === element.id ? "bg-gray-100" : ""
        } ${
          draggedElement && draggedElement !== element.id
            ? "border-dashed border-blue-300"
            : ""
        }`}
        draggable
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragStart={(e) => handleDragStart(e, element.id)}
      >
        {renderElement(element)}
      </div>
    ),
    [draggedElement, handleDrop, handleDragOver, handleDragStart]
  );

  if (!elementData?.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No input to display
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-y-4 relative">
      {elementData?.map(renderDraggableElement)}
    </div>
  );
}
