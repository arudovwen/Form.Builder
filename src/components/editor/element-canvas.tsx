import {
  useContext,
  useState,
  useCallback,
  DragEvent,
  memo,
  useMemo,
  Key,
  useEffect,
} from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

import EditorContext from "../../context/editor-context";
import { RenderElement } from "./element-render";
import AppIcon from "../ui/AppIcon";
import GridInput, { GridItem } from "../elements/grid-input";
import ElementContainer from "../elements/element-container";

const STATE = "edit";

export interface FormElement {
  id: string;
  isReadOnly?: false;
  [key: string]: any;
}

export interface EditorContextType {
  formData: FormElement[];
  setFormData: (data: FormElement[]) => void;
  updateElementPosition: (newData: FormElement[], sectionId: string) => void;
  updateElement: any;
  removeElement: any;
  isDragging: boolean;
  uploadUrl?: string;
}

// ─── DropZone ────────────────────────────────────────────────────────────────
// Always mounted so pointer-events work reliably; visually small when idle,
// expands + highlights when a drag enters it.
function DropZone({
  index,
  onDrop,
  onDragEnd,
  isDragging,
}: {
  index: number;
  onDrop: (e: DragEvent<HTMLDivElement>, i: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const [over, setOver] = useState(false);

  // Height: 52px when hovered, 28px any time a drag is happening, 4px idle
  const height = over ? 52 : isDragging ? 28 : 4;

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(false);
        onDrop(e, index);
      }}
      onDragEnd={() => {
        setOver(false);
        onDragEnd();
      }}
      style={{ height: `${height}px` }}
      className={clsx(
        "w-full rounded-md flex items-center justify-center",
        "transition-all duration-150 ease-in-out overflow-hidden",
        over
          ? "bg-blue-50 border-2 border-blue-400 border-dashed"
          : isDragging
            ? "border-2 border-blue-200 border-dashed"
            : "border-2 border-transparent",
      )}
    >
      {over && (
        <span className="flex items-center gap-1 text-blue-500 text-xs font-medium select-none pointer-events-none">
          <AppIcon icon="octicon:plus-16" />
          Drop here
        </span>
      )}
    </div>
  );
}

// ─── ElementCanvas ───────────────────────────────────────────────────────────
function ElementCanvas({ elementData, sectionId }: any) {
  const {
    formData,
    isDragging,
    setIsDragging,
    addElementInPosition,
    moveElement,
  }: any = useContext(EditorContext);

  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);

  const questionData = useMemo(
    () =>
      formData.find((s: { id: any }) => s.id === sectionId)?.questionData || [],
    [formData, sectionId],
  );

  // ── Drag lifecycle ──────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, id: string) => {
      // "elementId" key marks this as an existing element (not a sidebar item)
      e.dataTransfer.setData("elementId", id);
      // Keep "properties" set to the id string so grid-input can read it
      e.dataTransfer.setData("properties", id);
      e.dataTransfer.effectAllowed = "move";
      setDraggedElementId(id);
      setIsDragging(true);
    },
    [setIsDragging],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedElementId(null);
    setIsDragging(false);
  }, [setIsDragging]);

  // When an element is dropped INTO a grid cell, the source card is removed
  // from the DOM by React before `dragend` can fire — so handleDragEnd never
  // runs. Watch isDragging (set to false by grid-input's handleDrop) and clear
  // draggedElementId whenever isDragging goes false while it's still set.
  useEffect(() => {
    if (!isDragging && draggedElementId) {
      setDraggedElementId(null);
    }
  }, [isDragging, draggedElementId]);

  // ── Drop onto a card (reorder / eject from grid) ────────────────────────────
  // When a grid child is dropped onto a canvas card we eject it from its grid
  // (strip gridId/gridPosition) and insert it at the target's index position.
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const draggedId = e.dataTransfer.getData("elementId");
      const targetId = e.currentTarget.id;

      if (!draggedId || !targetId || draggedId === targetId) {
        handleDragEnd();
        return;
      }

      const draggedEl = questionData.find((el: any) => el.id === draggedId);
      const targetIndex = questionData.findIndex(
        (el: any) => el.id === targetId,
      );

      if (draggedEl?.gridId && targetIndex !== -1) {
        // Grid child dropped onto a canvas card → eject from grid at that position
        moveElement({ draggedId, sectionId, targetIndex });
      } else {
        // Regular canvas reorder
        moveElement({ draggedId, sectionId, targetId });
      }
      setDraggedElementId(null);
      setIsDragging(false);
    },
    [sectionId, moveElement, setIsDragging, handleDragEnd, questionData],
  );

  // ── Drop onto an insertion dropzone ─────────────────────────────────────────
  const handleMainDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // Existing element on the canvas
      const existingId = e.dataTransfer.getData("elementId");
      if (existingId) {
        moveElement({ draggedId: existingId, sectionId, targetIndex: index });
        setDraggedElementId(null);
        return;
      }

      // New element dragged from the sidebar
      try {
        const data = JSON.parse(e.dataTransfer.getData("properties"));
        if (data?.type === "section") return;
        const newElement = { ...data, id: uuidv4(), sectionId };
        addElementInPosition(newElement, sectionId, index);
        setDraggedElementId(null);
      } catch (err) {
        console.error("Drop error:", err);
      }
    },
    [addElementInPosition, sectionId, setIsDragging, moveElement],
  );

  // ── Render a draggable element card ─────────────────────────────────────────
  // insideGrid=true: omit onDragOver/onDrop so the parent cell handles the drop
  const renderDraggableElement = useCallback(
    (element: any, insideGrid = false) => (
      <div
        key={element.id}
        id={element.id}
        draggable
        onDragStart={(e) => handleDragStart(e, element.id)}
        onDragOver={
          insideGrid
            ? undefined
            : (e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
              }
        }
        onDrop={insideGrid ? undefined : handleDrop}
        onDragEnd={handleDragEnd}
        className={clsx(
          "cursor-grab active:cursor-grabbing border p-4 w-full rounded-lg",
          "transition-all duration-200 ease-in-out",
          draggedElementId === element.id
            ? "opacity-40 scale-[0.98] bg-gray-100 border-dashed border-blue-300 shadow-inner"
            : draggedElementId
              ? "bg-white border-dashed border-blue-200 shadow-sm"
              : "bg-white border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md",
        )}
      >
        {RenderElement(element, sectionId)}
      </div>
    ),
    [draggedElementId, handleDrop, sectionId, handleDragStart, handleDragEnd],
  );

  // ── Map from gridId → children (only top-level elements that have a gridId) ──
  const gridChildrenMap = useMemo(() => {
    return (
      elementData?.reduce((acc: Record<string, any[]>, el: any) => {
        if (el.gridId) {
          acc[el.gridId] = acc[el.gridId] || [];
          acc[el.gridId].push(el);
        }
        return acc;
      }, {}) || {}
    );
  }, [elementData]);

  // ── Empty canvas ─────────────────────────────────────────────────────────────
  if (!elementData?.length) {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleMainDrop(e, 0)}
        onDragEnd={handleDragEnd}
        className="w-full h-full flex items-center justify-center text-gray-400 min-h-[200px] p-10 col-span-2 border border-dashed border-gray-300 rounded-lg"
      >
        Drag or click an element to display
      </div>
    );
  }

  // ── Element list ──────────────────────────────────────────────────────────────
  // We interleave a DropZone before every top-level element, plus one after the
  // last one, so there are always valid insertion targets everywhere.
  const topLevelElements = elementData.filter((el: any) => !el.gridId);

  return (
    <div className="relative flex flex-col w-full h-full gap-2">
      {/* Leading drop zone — always rendered */}
      <DropZone
        index={0}
        isDragging={isDragging}
        onDrop={handleMainDrop}
        onDragEnd={handleDragEnd}
      />

      {topLevelElements.map((el: any) => {
        // Compute the real index inside questionData for correct insertion
        const realIndex = questionData.findIndex((q: any) => q.id === el.id);

        // ── Grid element ──────────────────────────────────────────────────────
        if (el.type === "grid") {
          const gridChildren = gridChildrenMap[el.id] || [];
          const isBeingDragged = draggedElementId === el.id;
          const otherDragging = !!draggedElementId && !isBeingDragged;

          return (
            <div key={el.id} className="flex flex-col gap-0">
              <div
                id={el.id}
                draggable
                onDragStart={(e) => handleDragStart(e, el.id)}
                onDragOver={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={clsx(
                  "w-full p-4 border rounded-lg cursor-grab active:cursor-grabbing",
                  "transition-all duration-200 ease-in-out",
                  isBeingDragged
                    ? "opacity-40 scale-[0.98] bg-gray-100 border-dashed border-blue-400 shadow-inner"
                    : otherDragging
                      ? "bg-white border-dashed border-blue-200"
                      : "bg-white border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md",
                )}
              >
                <ElementContainer element={el} state="edit">
                  <GridInput
                    element={el}
                    sectionId={sectionId}
                    state={STATE}
                    draggedElementId={draggedElementId}
                  >
                    {gridChildren?.map(
                      (child: {
                        id: Key | null | undefined;
                        gridPosition: { col: number };
                      }) => (
                        <GridItem key={child.id} col={child.gridPosition?.col}>
                          {renderDraggableElement(child, true)}
                        </GridItem>
                      ),
                    )}
                  </GridInput>
                </ElementContainer>
              </div>

              {/* Trailing drop zone after this grid */}
              <DropZone
                index={realIndex + 1}
                isDragging={isDragging}
                onDrop={handleMainDrop}
                onDragEnd={handleDragEnd}
              />
            </div>
          );
        }

        // ── Regular element ───────────────────────────────────────────────────
        return (
          <div key={el.id} className="flex flex-col gap-0">
            {renderDraggableElement(el)}

            {/* Trailing drop zone after this element */}
            <DropZone
              index={realIndex + 1}
              isDragging={isDragging}
              onDrop={handleMainDrop}
              onDragEnd={handleDragEnd}
            />
          </div>
        );
      })}
    </div>
  );
}

export default memo(ElementCanvas);
