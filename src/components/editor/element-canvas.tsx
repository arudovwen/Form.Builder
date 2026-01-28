import {
  useContext,
  useState,
  useCallback,
  DragEvent,
  memo,
  useMemo,
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
  uploadUrl?: string
}

function ElementCanvas({ elementData, sectionId }: any) {
  const {
    formData,
    updateElementPosition,
    isDragging,
    setIsDragging,
    addElementInPosition,
  }: any = useContext(EditorContext);

  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOverTargetId, setDragOverTargetId] = useState<string | null>(null);

  const questionData = useMemo(
    () => formData.find((s) => s.id === sectionId)?.questionData || [],
    [formData, sectionId]
  );

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, id: string) => {
      e.dataTransfer.setData("properties", id);
      setDraggedElementId(id);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverTargetId(id);
    },
    []
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const draggedId = e.dataTransfer.getData("properties");
      const targetId = e.currentTarget.id;

      if (!targetId || draggedId === targetId) return;

      const fromIndex = questionData.findIndex((el) => el.id === draggedId);
      const toIndex = questionData.findIndex((el) => el.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return;

      const updated = [...questionData];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      updateElementPosition(updated, sectionId);
      setDraggedElementId(null);
    },
    [questionData, sectionId, updateElementPosition]
  );

  const handleMainDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      setIsDragging(false);

      try {
        const data = JSON.parse(e.dataTransfer.getData("properties"));
        console.log({ data });
        if (data?.type === "section") {
          // addSection()
          return;
        }
        const newElement = { ...data, id: uuidv4(), sectionId };
        addElementInPosition(newElement, sectionId, index);
      } catch (err) {
        console.error("Drop error:", err);
      }
    },
    [addElementInPosition, sectionId, setIsDragging]
  );

  const renderDropZone = useCallback(
    (index: number) => (
      <div
        key={`drop-${index}`}
        className="transition rounded hover:bg-blue-300"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleMainDrop(e, index)}
        onDragEnd={() => setIsDragging(false)}
      >
        <div className="bg-blue-50 rounded p-6 h-[60px] border-2 border-blue-300 border-dashed flex items-center justify-center text-gray-400 opacity-70">
          <AppIcon icon="octicon:plus-16" />
        </div>
      </div>
    ),
    [handleMainDrop, setIsDragging]
  );

  const renderDraggableElement = useCallback(
    (element: any) => (
      <div
        key={element.id}
        id={element.id}
        className={clsx(
          "cursor-move border p-4 w-full rounded-lg transition-colors bg-white",
          {
            "bg-gray-100": draggedElementId === element.id,
            "border-dashed border-blue-300":
              draggedElementId && draggedElementId !== element.id,
          }
        )}
        draggable
        onDragStart={(e) => handleDragStart(e, element.id)}
        onDragOver={(e) => handleDragOver(e, element.id)}
        onDrop={handleDrop}
        onDragEnd={() => setDraggedElementId(null)}
      >
        {RenderElement(element, sectionId)}
      </div>
    ),
    [draggedElementId, handleDrop, handleDragOver, sectionId, handleDragStart]
  );

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

  if (!elementData?.length) {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleMainDrop(e, 0)}
        onDragEnd={() => setIsDragging(false)}
        className="w-full h-full flex items-center justify-center text-gray-400 min-h-[200px] p-10 col-span-2 border border-dashed border-gray-300 rounded-lg"
      >
        Drag or click an element to display
      </div>
    );
  }

  return (
    <div className="relative grid w-full h-full grid-cols-1 gap-4">
      {elementData.map((el: any, index: number) => {
        if (el.type === "grid") {
          const gridChildren = gridChildrenMap[el.id] || [];

          return (
            <div
              key={el.id}
              draggable
              onDragStart={(e) => handleDragStart(e, el.id)}
              onDragOver={(e) => handleDragOver(e, el.id)}
              onDrop={handleDrop}
              onDragEnd={() => setDraggedElementId(null)}
              className="w-full p-4 transition-colors bg-white border rounded-lg cursor-move"
            >
              <ElementContainer element={el} state="edit">
                <GridInput element={el} sectionId={sectionId} state={STATE}>
                  {gridChildren.map((child) => (
                    <GridItem key={child.id} col={child.gridPosition?.col}>
                      {RenderElement(child, sectionId)}
                    </GridItem>
                  ))}
                </GridInput>
              </ElementContainer>
            </div>
          );
        }

        if (!el.gridId) {
          return (
            <div
              key={el.id}
              className={clsx(
                "group relative grid gap-y-[6px]",
                el.elementClass
              )}
            >
              {isDragging &&
                dragOverTargetId === el.id &&
                renderDropZone(index)}
              <div className="group">{renderDraggableElement(el)}</div>
              {isDragging &&
                dragOverTargetId === el.id &&
                renderDropZone(index + 1)}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default memo(ElementCanvas);
