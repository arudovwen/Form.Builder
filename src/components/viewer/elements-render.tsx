import React, { useContext, useMemo } from "react";
import { elementMap } from "../elements/element-map";
import EditorContext from "@/context/editor-context";

import { evaluateVisibility } from "./validation";
import { PollResultsBreakdown } from "./poll-results";

export const RenderElement = ({ element, validationData }: { element: any; validationData?: any }) => {
  const ElementComponent = elementMap[element.type];
  const { answerData }: any = useContext(EditorContext);
  const acceptedFileLabels = useMemo(
    () =>
      element?.acceptedFiles?.map((i: { label: any }) => i.label).join(", "),
    [element],
  );

  // Compute visibility based on dependent fields
  const isVisible = useMemo(() => {
    return evaluateVisibility(element, answerData);
  }, [answerData, element]);

  if (!ElementComponent) return null;

  return (
    <div className={`${!isVisible ? "hidden" : ""} min-w-0 w-full`}>
      <div className="mb-1.5 min-w-0">
        {element.inputLabel && (
          <label className="block text-sm font-medium  input_label">
            {element.inputLabel}{" "}
            {acceptedFileLabels && (
              <span className="text-gray-400 text-xs">
                ({acceptedFileLabels?.toLowerCase()})
              </span>
            )}
          </label>
        )}
      </div>
      <ElementComponent
        element={element}
        state="view"
        validationData={{
          ...validationData,
          isReadOnly:
            validationData?.isReadOnly ||
            element.isReadOnly ||
            element.readOnly ||
            element.isDisabled ||
            element.disabled,
          isDisabled:
            validationData?.isDisabled ||
            element.isDisabled ||
            element.disabled,
        }}
      />
      {element.description && (
        <small className="block text-gray-400 mt-0.5 text-xs">
          {element.description}
        </small>
      )}
      
      {/* Poll Results Rendering */}
      {validationData?.showResults && validationData?.pollResults?.[element.id] && (
        <PollResultsBreakdown results={validationData.pollResults[element.id]} />
      )}
    </div>
  );
};
