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
    const { removeElement, duplicateElement }: any = React.useContext(EditorContext);
    const acceptedFileLabels = useMemo(
      () => element?.acceptedFiles?.map((i: { label: any; }) => i.label).join(", "),
      [element],
    );

    const handleRemove = useCallback(() => {
      removeElement(element.id, element.sectionId);
    }, [element.id, element.sectionId, removeElement]);

    return (
      <div className="w-full">
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
              {!element.gridPosition && <button
                type="button"
                className="text-sm outline-none hover:opacity-80"
                onClick={() => duplicateElement(element?.id, element.sectionId)}
                title="Duplicate"
              >
                <AppIcon icon="tabler:copy" iconClass="text-base" />
              </button>}

              <button
                type="button"
                className="text-sm outline-none hover:opacity-80"
                onClick={() => setOpen(true)}
                title="Edit"
              >
                <AppIcon icon="circum:edit" iconClass="text-base" />
              </button>

              <button
                type="button"
                className="text-sm outline-none hover:opacity-80"
                onClick={handleRemove}
                title="Remove"
              >
                <AppIcon icon="iconamoon:trash" iconClass="text-base" />
              </button>
            </span>
          )}
        </div>
        {children}
      </div>
    );
  },
);

ElementContainer.displayName = "ElementContainer";

export default ElementContainer;
