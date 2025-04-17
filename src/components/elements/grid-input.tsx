import { useContext, useCallback, DragEvent, useMemo } from "react";
import EditorContext from "../../context/editor-context";
import React from "react";
import AppIcon from "../ui/AppIcon";
import { v4 as uuidv4 } from "uuid";
import { renderElement } from "../editor/element-render";

interface GridInputProps {
  element: {
    grid: number;
    gridData: any[];
  };
  sectionId?: string;
}

const GridInput = ({ element, sectionId }: GridInputProps) => {
  console.log("GridInput Rendered", element);
  const gridItems = useMemo(
    () => Array.from({ length: element.grid }, (_, i) => i),
    [element.grid]
  );
  const { updateGridElement, setIsDragging }: any = useContext(EditorContext);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      try {
        event.preventDefault();
        setIsDragging(false);
        const targetElement = event?.currentTarget;
        const data = event.dataTransfer.getData("properties");
        if (data) {
          const properties = JSON.parse(data);
          if(properties.type === 'grid') return
          const newElement = {
            id: uuidv4(),
            sectionId,
            gridIndex: targetElement.id,
            ...properties,
          };
          updateGridElement(targetElement.id, newElement, sectionId);
        }
      } catch (error) {
        console.log(error);
        setIsDragging(false);
      }
    },
    [updateGridElement, sectionId, setIsDragging]
  );

  function getInputData(index) {
    const gridData = element.gridData?.find(
      (grid: any) => parseInt(grid.gridIndex, 10) == index
    );
    return gridData;
  }
  function hasGridData(index) {
    return element.gridData?.some(
      (grid: any) => parseInt(grid.gridIndex, 10) == index
    );
  }
  return (
    <div className="relative z-10">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${element.grid}, 1fr)`,
          gap: "8px",
        }}
      >
        {gridItems?.map((data, index) => (
          <div key={index}>
            <div
              className="border border-dashed bg-gray-50 rounded p-2 min-h-[110px] transition-colors justify-center items-center flex text-gray-400"
              id={index.toString()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {!hasGridData(index) && <AppIcon icon="ph:plus-bold" />}
              {hasGridData(index) && (
                <div className="bg-white rounded-lg p-2 w-full">
                  {renderElement(getInputData(index), sectionId)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(GridInput);
