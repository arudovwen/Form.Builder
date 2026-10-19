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
    const {
      removeElement,
      duplicateElement,
      updateElement,
      copyElement,
      selectedElementId,
    }: any = React.useContext(EditorContext);
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
        <div className="flex items-center justify-between mb-2.5">
          <span className="flex items-center gap-1.5 flex-wrap">
            {element.inputLabel ? (
              <label className="text-sm font-semibold text-gray-800 tracking-tight flex items-center gap-1">
                {element.inputLabel}
                {element.isRequired && (
                  <span className="text-red-500 font-bold ml-0.5" title="Required field">
                    *
                  </span>
                )}
                {acceptedFileLabels && (
                  <span className="text-gray-400 text-xs font-normal">
                    ({acceptedFileLabels?.toLowerCase()})
                  </span>
                )}
              </label>
            ) : null}
          </span>
          {state === "edit" && !selectedElementId && (
            <span className="flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {element.type?.toLowerCase() !== "spacer" && element.type?.toLowerCase() !== "divider" && (
                <>
                  {element.isDisabled && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded border border-gray-200">
                      Disabled
                    </span>
                  )}
                  {element.isReadOnly && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 rounded border border-amber-200">
                      Read Only
                    </span>
                  )}
                </>
              )}

              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                onClick={() => duplicateElement?.(element?.id, element.sectionId)}
                title="Duplicate"
              >
                <AppIcon icon="lucide:copy" iconClass="text-xs" />
              </button>

              <button
                type="button"
                className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                onClick={handleRemove}
                title="Remove"
              >
                <AppIcon icon="lucide:trash-2" iconClass="text-xs" />
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
