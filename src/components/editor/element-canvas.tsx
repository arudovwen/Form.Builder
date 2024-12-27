import { useContext, useState, useCallback } from "react";
import EditorContext from "../../context/editor-context";
import { renderElement } from "./element-render";

// Child: ElementCanvas
export default function ElementCanvas() {
  const { formData, updateElementPosition }: any = useContext(EditorContext);
  const [draggedElement, setDraggedElement] = useState<any>(null);

  // Handle the drag start event, storing the dragged element's ID
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    elementId: string
  ) => {
    event.dataTransfer.setData("properties", elementId);
    setDraggedElement(elementId); // Track the dragged element's ID
  };

  // Handle the drag over event to allow dropping
  const onDragNestedOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault(); // Allow the drop
      event.stopPropagation(); // Prevent event from propagating to parent
      event.dataTransfer.dropEffect = "move"; // Indicate move action
    },
    []
  );

  // Handle the drop event, switching the positions of elements
  const onDropNested = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent the parent drop event from firing
      const draggedElementId = event.dataTransfer.getData("properties"); // Get the dragged element ID
      const targetElement = event.target as HTMLElement; // The element where it's dropped
      const targetIndex = formData.findIndex(
        (el: any) => el.id === targetElement.id
      ); // Get the target index

      // Find the dragged element in the formData
      const draggedIndex = formData.findIndex(
        (el: any) => el.id === draggedElementId
      );
      console.log("🚀 ~ ElementCanvas ~ draggedIndex:", draggedIndex)
      console.log("🚀 ~ ElementCanvas ~ targetIndex:", targetIndex)
      if (draggedIndex === targetIndex || draggedIndex === -1) return; // If it's the same element, no need to change

      // Rearrange the elements by switching their positions
      const updatedFormData = [...formData];
      const [removed] = updatedFormData.splice(draggedIndex, 1); // Remove the dragged element
      console.log("🚀 ~ ElementCanvas ~ removed:", removed)
    
      updatedFormData.splice(targetIndex, 0, removed); // Insert it at the target index
      updateElementPosition(updatedFormData); // This function should update the state in your context
    },
    
    [formData, updateElementPosition]
  );

  return (
    <div
      className="w-full h-full flex flex-col gap-y-4 relative"
     
    >
      {formData?.map((el: any) => (
        <div
          key={el.id}
          id={el.id}
          className="cursor-move border p-4 w-full"
          draggable
          onDrop={onDropNested}
          onDragOver={onDragNestedOver}
          onDragStart={(e) => handleDragStart(e, el.id)}
        >
          {renderElement(el)}
        </div>
      ))}
    </div>
  );
}
