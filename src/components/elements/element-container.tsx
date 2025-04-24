import React, { ReactNode, useCallback, memo, useState } from "react";
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
    const { removeElement }: any = React.useContext(EditorContext);

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
        <div className="flex justify-between items-center mb-2">
          <span>
            {" "}
            {element.inputLabel && (
              <label className="text-sm font-medium">
                {element.inputLabel}
              </label>
            )}
          </span>
          {state === "edit" && (
            <span className="flex gap-x-3 items-center">
           
                <button
                  type="button"
                  className="outline-none hover:opacity-80 text-sm"
                  onClick={() => setOpen(true)}
                >
                  <AppIcon icon="circum:edit" />
                </button>
             
              <button
                type="button"
                className="outline-none hover:opacity-80 text-sm"
                onClick={handleRemove}
              >
                <AppIcon icon="iconamoon:sign-times-fill" />
              </button>
            </span>
          )}
        </div>
        {children}
      </div>
    );
  }
);

ElementContainer.displayName = "ElementContainer";

export default ElementContainer;
