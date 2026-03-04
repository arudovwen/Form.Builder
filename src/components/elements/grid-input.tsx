import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
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
  /** Id of the element currently being dragged on the canvas (passed down so
   *  grid cells can show a "ready to receive" style even before hovering them) */
  draggedElementId?: string | null;
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
  draggedElementId,
}: GridInputProps) => {
  const {
    formData,
    addElement,
    setIsDragging,
    moveElement,
    isDragging,
    removeElement,
  } = useContext(EditorContext) as any;

  const gridItems = useMemo(
    () => Array.from({ length: element.columns }),
    [element.columns],
  );

  // Track which column index (0-based) the cursor is over
  const [activeCol, setActiveCol] = useState<number | null>(null);

  // Safety-net: reset hovered state whenever ANY drag ends on the document.
  // This covers sidebar drops, Escape cancellations, and out-of-bounds drops
  // where onDrop on the cell may not fire.
  useEffect(() => {
    const reset = () => {
      setActiveCol(null);
      setIsDragging(false);
    };
    document.addEventListener("dragend", reset);
    return () => document.removeEventListener("dragend", reset);
  }, [setIsDragging]);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, colIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "move";
      setActiveCol(colIndex);
    },
    [],
  );

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>, colIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveCol(colIndex);
    },
    [],
  );

  // Only clear activeCol when the pointer truly leaves the cell (not just
  // moves to a child element inside it).
  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>, colIndex: number) => {
      const related = e.relatedTarget as Node | null;
      if (related && (e.currentTarget as HTMLElement).contains(related)) return;
      setActiveCol((prev) => (prev === colIndex ? null : prev));
    },
    [],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, colIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setActiveCol(null);

      const currentCol = colIndex + 1; // grid-column is 1-based

      // ── Existing canvas element moved into this cell ──────────────────────
      const existingId = e.dataTransfer.getData("elementId");
      if (existingId) {
        moveElement({
          draggedId: existingId,
          sectionId,
          targetGridId: element.id,
          targetCol: currentCol,
        });
        return;
      }

      // ── New element dragged from the sidebar ──────────────────────────────
      try {
        const data = e.dataTransfer.getData("properties");
        if (!data) return;

        const properties = JSON.parse(data);

        // Prevent dropping a grid inside a grid
        if (properties?.type === "grid") return;

        const section = formData.find((s: any) => s.id === sectionId);
        const occupant = section?.questionData?.find(
          (el: any) =>
            el.gridId === element.id && el.gridPosition?.col === currentCol,
        );

        // If a different element already occupies this cell, remove it first
        if (occupant) {
          removeElement(occupant.id, sectionId);
        }

        const newElement = {
          ...properties,
          id: uuidv4(),
          sectionId,
          gridId: element.id,
          gridPosition: { col: currentCol },
        };

        addElement(newElement, sectionId);
      } catch (err) {
        console.error("Drop failed in grid:", err);
        setIsDragging(false);
      }
    },
    [addElement, element.id, formData, sectionId, setIsDragging, moveElement],
  );

  const renderGridCell = (
    index: number,
    customClass: string,
    state: string,
  ) => {
    const currentCol = index + 1;

    // Look up the child element's actual data so we can use its ID as the
    // drag payload. Form inputs absorb mousedown on the card, so the CELL
    // itself must be the drag source (not just the inner card).
    const childData = formData
      .find((s: any) => s.id === sectionId)
      ?.questionData?.find(
        (el: any) =>
          el.gridId === element.id && el.gridPosition?.col === currentCol,
      );
    const childId: string | null = childData?.id ?? null;

    const childForCol =
      Array.isArray(children) &&
      children.find((child: any) => child?.props?.col === currentCol);

    const isHovered = isDragging && activeCol === index;
    const isOccupied = !!childForCol;
    const globalDragging = isDragging && !!draggedElementId;

    // Drag handlers wired to the CELL when it has a child
    const cellDragProps =
      isOccupied && childId && state === "edit"
        ? {
            draggable: true as const,
            onDragStart: (e: DragEvent<HTMLDivElement>) => {
              // Stop bubbling so the parent grid CARD doesn't also start dragging
              e.stopPropagation();
              e.dataTransfer.setData("elementId", childId);
              e.dataTransfer.setData("properties", childId);
              e.dataTransfer.effectAllowed = "move";
              setIsDragging(true);
            },
            onDragEnd: () => {
              setActiveCol(null);
              setIsDragging(false);
            },
          }
        : {};

    return (
      <div key={index}>
        <div
          id={`grid-cell-${element.id}-${index}`}
          {...cellDragProps}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={(e) => handleDragLeave(e, index)}
          className={clsx(
            "relative border  rounded-lg min-h-[110px]",
            "flex items-center justify-center",
            "transition-all duration-200 ease-in-out",
            state === "edit" ? "py-3 " : "",
            isOccupied &&
              state === "edit" &&
              "cursor-grab active:cursor-grabbing border-none",
            customClass,

            !globalDragging &&
              !isHovered &&
              "bg-white border-gray-200 text-gray-300",
            globalDragging &&
              !isHovered &&
              !isOccupied &&
              "bg-blue-50 border-blue-200 border-dashed text-blue-300",
            globalDragging &&
              !isHovered &&
              isOccupied &&
              "bg-white border-orange-200 border-dashed",
            isHovered &&
              !isOccupied &&
              "bg-blue-100 border-blue-400 border-dashed shadow-inner scale-[1.01] text-blue-500",
            isHovered &&
              isOccupied &&
              "bg-orange-50 border-orange-400 border-dashed shadow-inner scale-[1.01] text-orange-500",
          )}
        >
          {/* Drag handle — always visible on occupied cells so there is an
              unambiguous grab target even when the cell content is an input */}
          {isOccupied && state === "edit" && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-500 cursor-grab active:cursor-grabbing transition-colors z-10 opacity-60 hover:opacity-100 pointer-events-none select-none">
              <AppIcon icon="ph:dots-six-bold" />
            </div>
          )}

          {isHovered && !isOccupied && (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-blue-400 text-xs font-medium pointer-events-none">
              <AppIcon icon="ph:plus-bold" />
              Drop here
            </span>
          )}
          {isHovered && isOccupied && (
            <span className="absolute top-1 right-1 text-xs text-orange-400 font-medium pointer-events-none px-1 py-0.5 bg-orange-50 rounded">
              Replace
            </span>
          )}

          {/* Cell content — select-none stops text-selection from blocking drag */}
          <div
            className={clsx(
              "w-full select-none",
              isHovered && "opacity-50 pointer-events-none",
            )}
          >
            {childForCol || (
              <span className="flex items-center justify-center text-gray-300">
                {state === "edit" && <AppIcon icon="ph:plus-bold" />}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div
        className="grid w-full gap-3  items-center"
        style={{
          gridTemplateColumns: `repeat(${element.columns}, 1fr)`,
        }}
      >
        {gridItems?.map((_, index) =>
          renderGridCell(index, customClass, state),
        )}
      </div>
    </div>
  );
};

export default React.memo(GridInput);
