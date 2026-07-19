import React, { ReactNode, useCallback, memo, useState, useMemo } from "react";
import AppIcon from "../ui/AppIcon";
import EditorContext from "../../context/editor-context";
import ElementEditorModal from "./element-editor";

interface ElementType {
  id: string;
  inputLabel?: string;
  [key: string]: any;
}

interface ElementContainerProps {
  element: ElementType;
  children: ReactNode;
  state?: string;
}

const ElementContainer = memo(
  ({ state, element, children }: ElementContainerProps) => {
    const [isOpen, setOpen] = useState(false);
    const { removeElement, duplicateElement, updateElement, copyElement }: any =
      React.useContext(EditorContext);
    const acceptedFileLabels = useMemo(
      () =>
        element?.acceptedFiles?.map((i: { label: any }) => i.label).join(", "),
      [element],
    );

    const handleRemove = useCallback(() => {
      removeElement(element.id, element.sectionId);
    }, [element.id, element.sectionId, removeElement]);

    return (
      <div className="w-full min-w-0">
        {isOpen && (
          <ElementEditorModal
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            element={element}
          />
        )}
        <div className="flex items-center justify-between mb-2">
          <span>
            {" "}
            {element.inputLabel && (
              <label className="text-sm font-medium input_label">
                {element.inputLabel}{" "}
                {acceptedFileLabels && (
                  <span className="text-gray-400 text-xs">
                    ({acceptedFileLabels?.toLowerCase()})
                  </span>
                )}
              </label>
            )}
          </span>
          {state === "edit" && (
            <span className="flex items-center gap-x-3">
              {element.type?.toLowerCase() !== "spacer" && element.type?.toLowerCase() !== "divider" && (
                <label className="flex items-center gap-1 text-xs cursor-pointer text-gray-500 mr-2 hover:text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={element.isRequired || false}
                    onChange={(e) =>
                      updateElement(
                        { ...element, isRequired: e.target.checked },
                        element.sectionId
                      )
                    }
                    className="cursor-pointer"
                  />
                  <span className="mt-0.5">Required</span>
                </label>
              )}


              {
                <button
                  type="button"
                  className="text-sm outline-none hover:opacity-80 py-1 text-gray-600"
                  onClick={() => {
                    if (typeof duplicateElement === 'function') {
                      duplicateElement(element?.id, element.sectionId);
                    }
                  }}
                  title="Duplicate"
                >
                  <AppIcon icon="solar:copy-outline" iconClass="text-base" />
                </button>
              }

              {
                <button
                  type="button"
                  className="text-sm outline-none hover:opacity-80 py-1 text-gray-600"
                  onClick={() => {
                    if (typeof copyElement === 'function') {
                      copyElement(element?.id, element.sectionId);
                      // Optional: simple toast or visual feedback could go here
                    }
                  }}
                  title="Copy to Clipboard"
                >
                  <AppIcon icon="lucide:clipboard-copy" iconClass="text-base" />
                </button>
              }

              <button
                type="button"
                className="text-sm outline-none hover:opacity-80 text-gray-600 py-1"
                onClick={() => setOpen(true)}
                title="Edit"
              >
                <AppIcon icon="circum:edit" iconClass="text-base" />
              </button>

              <button
                type="button"
                className="text-sm outline-none hover:opacity-80 text-gray-600 py-1"
                onClick={handleRemove}
                title="Remove"
              >
                <AppIcon icon="iconamoon:trash" iconClass="text-base" />
              </button>
            </span>
          )}
        </div>
        
        {children}
        {element.description && (
          <small className="block text-gray-400 mt-1 text-xs">
            {element.description}
          </small>
        )}
      </div>
    );
  },
);

ElementContainer.displayName = "ElementContainer";

export default ElementContainer;
