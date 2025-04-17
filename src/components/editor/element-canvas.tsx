import { useContext, useState, useCallback, DragEvent } from "react";
import EditorContext from "../../context/editor-context";
import { renderElement } from "./element-render";
import AppIcon from "../ui/AppIcon";

export interface FormElement {
  id: string;
  isReadOnly?: false;
  [key: string]: any;
}

export interface EditorContextType {
  formData: FormElement[];
  setFormData: (data: FormElement[]) => void;
  updateElementPosition: (newData: FormElement[], sectionId: string) => void;
  updateElement: any;
  removeElement: any;
  isDragging: boolean;
}

export default function ElementCanvas({ elementData, sectionId }: any) {
  const { formData, updateElementPosition, isDragging } = useContext(
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
      try {
        const draggedElementId = event.dataTransfer.getData("properties");
        const targetElement = event.currentTarget;

        if (!targetElement.id || draggedElementId === targetElement.id) {
          return;
        }

        const draggedIndex = questionData.findIndex(
          (el: { id: string }) => el.id === draggedElementId
        );
        const targetIndex = questionData.findIndex(
          (el: { id: string }) => el.id === targetElement.id
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
      } catch (error) {
        console.error("Error during drag and drop:", error);
        setDraggedElement(null);
      }
    },
    [formData, sectionId, updateElementPosition]
  );

  const renderDraggableElement = useCallback(
    (element: FormElement) => (
      <div
        key={element.id}
        id={element.id}
        className={`cursor-move border p-4 w-full transition-colors rounded-lg bg-white ${
          draggedElement === element.id ? "bg-gray-100" : ""
        } ${
          draggedElement && draggedElement !== element.id
            ? "border-dashed !border-blue-300"
            : ""
        }`}
        draggable
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragStart={(e) => handleDragStart(e, element.id)}
      >
        {renderElement(element, sectionId)}
      </div>
    ),
    [draggedElement, handleDrop, handleDragOver, handleDragStart]
  );

  if (!elementData?.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 min-h-[250px]  p-10">
        Drag or click an element to display
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-y-4 relative">
      {elementData?.map(renderDraggableElement)}
      {isDragging && (
        <div className="bg-gray-50 rounded p-6 h-[120px] border-2 border-dashed flex items-center justify-center text-gray-400 opacity-70">
          <AppIcon icon="octicon:plus-16" />
        </div>
      )}
    </div>
  );
}
