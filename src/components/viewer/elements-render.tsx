import React, { useContext, useMemo } from "react";
import { elementMap } from "../editor/element-render";
import EditorContext from "@/context/editor-context";

export const RenderElement = (element: any, validationData?: any) => {
  const ElementComponent = elementMap[element.type];
  const { answerData }: any = useContext(EditorContext);
  const acceptedFileLabels = useMemo(
    () => element?.acceptedFiles?.map((i) => i.label).join(", "),
    [element],
  );
  const fields = useMemo(
    () => element?.visibilityDependentFields || [],
    [element],
  );

  // Compute visibility based on dependent fields
  const isVisible = useMemo(() => {
    if (!fields.length) return true; // No dependencies, always visible

    return fields.every((field) => {
      const value = answerData?.[field.id];
      const valA = field.fieldValue;
      const valB = value;

      switch (field.operator) {
        case "equals":
          return String(valA).toLowerCase() === String(valB).toLowerCase();
        case "not_equals":
          return String(valA).toLowerCase() !== String(valB).toLowerCase();
        case "greater":
          return Number(valB) > Number(valA);
        case "less":
          return Number(valB) < Number(valA);
        case "contains":
          return String(valB)
            .toLowerCase()
            .includes(String(valA).toLowerCase());
        case "not_contains":
          return !String(valB)
            .toLowerCase()
            .includes(String(valA).toLowerCase());
        default:
          return true; // fallback: show
      }
    });
  }, [fields, answerData]);

  if (!ElementComponent) return null;

  return (
    <div className={!isVisible ? "invisible h-0" : ""}>
      {element.inputLabel && (
        <label className="block text-sm font-medium mb-[5px] input_label">
          {element.inputLabel}{" "}
         {acceptedFileLabels && <span className="text-gray-400 text-xs">({acceptedFileLabels?.toLowerCase()})</span>}
        </label>
      )}
      <ElementComponent
        element={element}
        state="edit"
        validationData={validationData}
      />
    </div>
  );
};
