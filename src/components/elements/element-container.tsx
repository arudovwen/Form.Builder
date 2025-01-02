import React, { ReactNode, useCallback, memo, useState } from "react";
import AppIcon from "../ui/AppIcon";
import EditorContext from "../../context/editor-context";
import ElementEditorModal from "./element-editor";

interface ElementType {
  id: string;
  inputLabel: string;
  [key: string]: any;
}

interface ElementContainerProps {
  element: ElementType;
  children: ReactNode;
}

const ElementContainer = memo(
  ({ element, children }: ElementContainerProps) => {
    const [isOpen, setOpen] = useState(false);
    const { removeElement }: any = React.useContext(EditorContext);

    const handleRemove = useCallback(() => {
      removeElement(element.id, element.sectionId);
    }, [element.id, removeElement]);

    return (
      <div>
        <ElementEditorModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          element={element}
        />
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{element.inputLabel}</label>
          <span className="flex gap-x-3 items-center">
            <button
              type="button"
              className="outline-none hover:opacity-80"
              onClick={() => setOpen(true)}
            >
              <AppIcon icon="circum:edit" />
            </button>
            <button
              type="button"
              className="outline-none hover:opacity-80"
              onClick={handleRemove}
            >
              <AppIcon icon="iconamoon:sign-times-fill" />
            </button>
          </span>
        </div>
        {children}
      </div>
    );
  }
);

ElementContainer.displayName = "ElementContainer";

export default ElementContainer;
