import React, {
  useContext,
  useCallback,
  DragEvent,
  useMemo,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";

import EditorContext from "../../context/editor-context";
import AppIcon from "../ui/AppIcon";

interface GridInputProps {
  element: any;
  sectionId?: string;
  children?: ReactNode;
  customClass?: string;
  state?: string;
}

interface GridItemProps {
  col: number;
  children: ReactNode;
  customClass?: string;
  state?: string;
}

export const GridItem = ({ col, children, customClass }: GridItemProps) => (
  <div
    className={clsx("w-full bg-white", customClass)}
    style={{ gridColumn: col }}
  >
    {children}
  </div>
);

const GridInput = ({
  element,
  sectionId,
  children,
  customClass,
  state,
}: GridInputProps) => {
  const { formData, addElement, setIsDragging } = useContext(
    EditorContext
  ) as any;

  const gridItems = useMemo(
    () => Array.from({ length: element.columns }),
    [element.columns]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, colIndex: number) => {
      e.preventDefault();
      setIsDragging(false);

      try {
        const data = e.dataTransfer.getData("properties");
        if (!data) return;

        const properties = JSON.parse(data);

        // prevent dropping a grid inside a grid
        if (properties?.type === "grid") return;
        const currentPositon = colIndex + 1;
        const hasElementInPosition = formData
          .find((s) => s.id === sectionId)
          ?.questionData?.some(
            (el) =>
              el.gridId === element.id &&
              el.gridPosition?.col === currentPositon
          );
        if (hasElementInPosition) return;
        const newElement = {
          ...properties,
          id: uuidv4(),
          sectionId,
          gridId: element.id,
          gridPosition: { col: currentPositon }, // grid-column is 1-based
        };

        addElement(newElement, sectionId);
      } catch (err) {
        console.error("Drop failed in grid:", err);
        setIsDragging(false);
      }
    },
    [addElement, element.id, formData, sectionId, setIsDragging]
  );

  const renderGridCell = (
    index: number,
    customClass: string,
    state: string
  ) => {
    // Find child in this column (grid is 1-indexed)
    const childForCol =
      Array.isArray(children) &&
      children.find(
        (child: any) => child?.props?.col === index + 1 // because grid-column is 1-based
      );

    return (
      <div key={index}>
        <div
          id={index.toString()}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
          className={clsx(
            "border rounded-lg min-h-[110px] bg-white ",
            "flex items-center justify-center text-gray-400 transition-colors",
            `${state === "edit" ? "p-3" : ""}`,
            customClass
          )}
        >
          {childForCol || (
            <span>{state === "edit" && <AppIcon icon="ph:plus-bold" />}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div
        className="grid w-full gap-3"
        style={{
          gridTemplateColumns: `repeat(${element.columns}, 1fr)`,
        }}
      >
        {gridItems.map((_, index) => renderGridCell(index, customClass, state))}
      </div>
    </div>
  );
};

export default React.memo(GridInput);
