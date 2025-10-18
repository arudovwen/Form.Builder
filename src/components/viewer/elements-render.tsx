import React from "react";
import { elementMap } from "../editor/element-render";

export const renderElement = (element: any, validationData?: any) => {
  const ElementComponent = elementMap[element.type];
  return ElementComponent ? (
    <div>
      {element.inputLabel && (
        <label className="block text-sm font-medium mb-[5px] input_label">
          {element.inputLabel}
        </label>
      )}
      <ElementComponent
        element={element}
        state="edit"
        validationData={validationData}
      />
    </div>
  ) : null;
};
