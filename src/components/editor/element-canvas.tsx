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

import EditorContext, { DeleteMode } from "../../context/editor-context";
import { RenderElement } from "./element-render";
import AppIcon from "../ui/AppIcon";
import GridInput, { GridItem } from "../elements/grid-input";
import ElementContainer from "../elements/element-container";

const STATE = "edit";

export interface FormElement {
  id: string;
  isReadOnly?: false;
  isFieldDeleted?: boolean;
  isDeleted?: boolean;
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
  deleteMode?: DeleteMode;
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

  useEffect(() => {
    if (!isDragging) {
      setOver(false);
    }
  }, [isDragging]);

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
        e.dataTransfer.dropEffect = "move";
        setOver(true);
      }}
      onDragLeave={(e) => {
        const related = e.relatedTarget as Node | null;
        if (related && (e.currentTarget as HTMLElement).contains(related))
          return;
        setOver(false);
      }}
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
          ? "bg-blue-50 border-2 border-blue-300 border-dashed"
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
    selectedElementId,
    setSelectedElementId,
    duplicateElement,
    copyElement,
    removeElement,
    openAdvancedModal,
  }: any = useContext(EditorContext);

  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);

  const sectionElements = useMemo(
    () => formData.find((s: { id: any }) => s.id === sectionId)?.formData || [],
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
  // ── Drop onto a card (reorder / eject from grid / insert new element) ───────
  // When a grid child is dropped onto a canvas card we eject it from its grid
  // (strip gridId/gridPosition) and insert it at the target's index position.
  // When a new element from sidebar is dropped onto a card, insert before or after it.
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const draggedId = e.dataTransfer.getData("elementId");
      const targetId = e.currentTarget.id;

      if (!targetId) {
        handleDragEnd();
        return;
      }

      // Check if this is a new element from the sidebar dropped directly onto a card
      if (!draggedId) {
        try {
          const rawProps = e.dataTransfer.getData("properties");
          if (rawProps) {
            const data = JSON.parse(rawProps);
            if (data?.type === "section") {
              handleDragEnd();
              return;
            }

            const targetIndex = sectionElements.findIndex(
              (el: any) => el.id === targetId,
            );

            if (targetIndex !== -1) {
              const targetEl = sectionElements[targetIndex];
              const rect = e.currentTarget.getBoundingClientRect();
              const isTopHalf = e.clientY < rect.top + rect.height / 2;

              let insertIndex: number;
              if (isTopHalf) {
                insertIndex = targetIndex;
              } else {
                if (targetEl.type === "grid") {
                  const relatedIndices = sectionElements
                    .map((item: any, idx: number) => ({ item, idx }))
                    .filter(
                      ({ item }: any) =>
                        item.id === targetEl.id || item.gridId === targetEl.id,
                    )
                    .map(({ idx }: any) => idx);
                  insertIndex = relatedIndices.length
                    ? Math.max(...relatedIndices) + 1
                    : targetIndex + 1;
                } else {
                  insertIndex = targetIndex + 1;
                }
              }

              const newElement = { ...data, id: uuidv4(), sectionId };
              addElementInPosition(newElement, sectionId, insertIndex);
              setDraggedElementId(null);
              setIsDragging(false);
              return;
            }
          }
        } catch (err) {
          console.error("Drop error on card:", err);
        }
        handleDragEnd();
        return;
      }

      if (draggedId === targetId) {
        handleDragEnd();
        return;
      }

      const draggedEl = sectionElements.find((el: any) => el.id === draggedId);
      const targetIndex = sectionElements.findIndex(
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
    [
      sectionId,
      moveElement,
      setIsDragging,
      handleDragEnd,
      sectionElements,
      addElementInPosition,
    ],
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
        const rawProps = e.dataTransfer.getData("properties");
        if (!rawProps) return;
        const data = JSON.parse(rawProps);
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
    (element: any, insideGrid = false) => {
      const isSelected = selectedElementId === element.id;

      return (
        <div
          key={element.id}
          id={element.id}
          draggable
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElementId?.(element.id);
          }}
          onDragStart={(e) => handleDragStart(e, element.id)}
          onDragOver={
            insideGrid
              ? undefined
              : (e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = "move";
                }
          }
          onDrop={insideGrid ? undefined : handleDrop}
          onDragEnd={handleDragEnd}
          className={clsx(
            "relative cursor-grab active:cursor-grabbing border p-5 w-full rounded-xl select-none",
            "transition-all duration-200 ease-in-out",
            draggedElementId === element.id
              ? "opacity-40 scale-[0.98] bg-gray-50 border-dashed border-indigo-400 shadow-inner"
              : isSelected
                ? "bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                : "bg-white border-gray-200/90 shadow-2xs hover:border-gray-300 hover:shadow-xs",
          )}
        >
          {/* Floating Action Pill Toolbar when selected */}
          {isSelected && (
            <div className="absolute -top-3.5 right-4 z-30 flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-lg text-[11px] font-medium animate-fadeIn">
              <span className="text-gray-300 px-1 border-r border-gray-700/90">
                {element.label || element.type}
              </span>
              {element.isRequired && (
                <span className="text-amber-400 text-[10px] uppercase font-bold pr-1 border-r border-gray-700/90">
                  Required
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateElement?.(element.id, sectionId);
                }}
                className="p-0.5 text-gray-300 hover:text-white transition-colors"
                title="Duplicate field"
              >
                <AppIcon icon="lucide:copy" iconClass="text-xs" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyElement?.(element.id, sectionId);
                }}
                className="p-0.5 text-gray-300 hover:text-white transition-colors"
                title="Copy field to clipboard"
              >
                <AppIcon icon="lucide:clipboard-copy" iconClass="text-xs" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openAdvancedModal?.(element);
                }}
                className="p-0.5 text-gray-300 hover:text-indigo-400 transition-colors"
                title="Advanced Settings"
              >
                <AppIcon icon="solar:settings-bold-duotone" iconClass="text-xs" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement?.(element.id, sectionId);
                }}
                className="p-0.5 text-gray-300 hover:text-red-400 transition-colors"
                title="Delete field"
              >
                <AppIcon icon="lucide:trash-2" iconClass="text-xs" />
              </button>
            </div>
          )}

          {RenderElement(element, sectionId)}
        </div>
      );
    },
    [
      draggedElementId,
      handleDrop,
      sectionId,
      handleDragStart,
      handleDragEnd,
      selectedElementId,
      setSelectedElementId,
      duplicateElement,
      copyElement,
      removeElement,
    ],
  );

  // ── Active elements ─────────────────────────────────────────────────────────
  const activeElements = useMemo(
    () =>
      elementData?.filter(
        (el: any) => !el.isFieldDeleted && !el.isDeleted,
      ) || [],
    [elementData],
  );

  const gridMap = useMemo(() => {
    const map = new Map<string, any>();
    activeElements.forEach((el: any) => {
      if (el.type === "grid") {
        map.set(el.id, el);
      }
    });
    return map;
  }, [activeElements]);

  // ── Map from gridId → children (only elements with a valid parent grid and column in bounds) ──
  const gridChildrenMap = useMemo(() => {
    return (
      elementData?.reduce((acc: Record<string, any[]>, el: any) => {
        if (el.gridId && !el.isFieldDeleted && !el.isDeleted) {
          const parentGrid = gridMap.get(el.gridId);
          if (
            parentGrid &&
            (!el.gridPosition?.col ||
              el.gridPosition.col <= (parentGrid.columns || 1))
          ) {
            acc[el.gridId] = acc[el.gridId] || [];
            acc[el.gridId].push(el);
          }
        }
        return acc;
      }, {}) || {}
    );
  }, [elementData, gridMap]);

  // ── Element list ──────────────────────────────────────────────────────────────
  // Top-level elements: elements without a gridId OR whose grid is missing/overflowing
  const topLevelElements = useMemo(
    () =>
      activeElements.filter((el: any) => {
        if (!el.gridId) return true;
        const parentGrid = gridMap.get(el.gridId);
        if (!parentGrid) return true;
        if (
          el.gridPosition?.col &&
          el.gridPosition.col > (parentGrid.columns || 1)
        ) {
          return true;
        }
        return false;
      }),
    [activeElements, gridMap],
  );

  const firstTopLevelIndex = useMemo(() => {
    if (!topLevelElements.length) return 0;
    const idx = sectionElements.findIndex(
      (q: any) => q.id === topLevelElements[0].id,
    );
    return idx === -1 ? 0 : idx;
  }, [sectionElements, topLevelElements]);

  // ── Empty canvas ─────────────────────────────────────────────────────────────
  if (!activeElements.length) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => handleMainDrop(e, 0)}
        onDragEnd={handleDragEnd}
        className="w-full h-full flex items-center justify-center text-gray-400 min-h-[200px] p-10 col-span-2 border border-dashed border-gray-300 rounded-lg"
      >
        Drag or click an element to display
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full h-full gap-2">
      {/* Leading drop zone — always rendered */}
      <DropZone
        index={firstTopLevelIndex}
        isDragging={isDragging}
        onDrop={handleMainDrop}
        onDragEnd={handleDragEnd}
      />

      {topLevelElements.map((el: any, i: number) => {
        const nextTopLevel = topLevelElements[i + 1];
        const dropIndex = nextTopLevel
          ? sectionElements.findIndex((q: any) => q.id === nextTopLevel.id)
          : sectionElements.length;

        // ── Grid element ──────────────────────────────────────────────────────
        if (el.type === "grid") {
          const gridChildren = gridChildrenMap[el.id] || [];
          const isBeingDragged = draggedElementId === el.id;
          const otherDragging = !!draggedElementId && !isBeingDragged;
          const isSelected = selectedElementId === el.id;

          return (
            <div key={el.id} className="flex flex-col gap-0">
              <div
                id={el.id}
                draggable
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElementId?.(el.id);
                }}
                onDragStart={(e) => handleDragStart(e, el.id)}
                onDragOver={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={clsx(
                  "relative w-full p-5 border rounded-xl cursor-grab active:cursor-grabbing",
                  "transition-all duration-200 ease-in-out select-none",
                  isBeingDragged
                    ? "opacity-40 scale-[0.98] bg-gray-50 border-dashed border-indigo-400 shadow-inner"
                    : isSelected
                      ? "bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                      : otherDragging
                        ? "bg-white border-dashed border-indigo-200"
                        : "bg-white border-gray-200/90 shadow-2xs hover:border-gray-300 hover:shadow-xs",
                )}
              >
                {isSelected && (
                  <div className="absolute -top-3.5 right-4 z-30 flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-lg text-[11px] font-medium animate-fadeIn">
                    <span className="text-gray-300 px-1 border-r border-gray-700/90">
                      Grid Layout ({el.columns || 2} Cols)
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateElement?.(el.id, sectionId);
                      }}
                      className="p-0.5 text-gray-300 hover:text-white transition-colors"
                      title="Duplicate grid"
                    >
                      <AppIcon icon="lucide:copy" iconClass="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAdvancedModal?.(el);
                      }}
                      className="p-0.5 text-gray-300 hover:text-indigo-400 transition-colors"
                      title="Advanced Grid Settings"
                    >
                      <AppIcon icon="solar:settings-bold-duotone" iconClass="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeElement?.(el.id, sectionId);
                      }}
                      className="p-0.5 text-gray-300 hover:text-red-400 transition-colors"
                      title="Delete grid"
                    >
                      <AppIcon icon="lucide:trash-2" iconClass="text-xs" />
                    </button>
                  </div>
                )}
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
                index={dropIndex}
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
              index={dropIndex}
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
