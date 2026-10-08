import React from "react";
import ElementContainer from "../elements/element-container";
import { elementMap } from "../elements/element-map";
const state = "edit"; // This can be passed as a prop or context value
export const RenderElement = (element: any, sectionId: string) => {
  const ElementComponent = elementMap[element.type];
  
  if (!ElementComponent) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
        <span className="text-sm font-medium">Unsupported element type: {element.type}</span>
      </div>
    );
  }

  return (
    <ElementContainer element={element} state={state}>
      <div className="relative w-full">
        {element.type?.toLowerCase() !== "grid" && (
          <div className="absolute top-0 left-0 z-20 w-full h-full" />
        )}
        <ElementComponent
          element={element}
          state={state}
          sectionId={sectionId}
        />
      </div>
    </ElementContainer>
  );
};
