import { useCallback, DragEvent, memo } from "react";
import { Elements } from "../../utils/contants";
import AppIcon from "../ui/AppIcon";

interface ElementType {
  type: string;
  label: string;
  icon: string;
  color?: string;
  [key: string]: any;
}

const SideBar = () => {
  const handleDragStart = useCallback(
    (event: DragEvent<HTMLLIElement>, element: ElementType) => {
      event.dataTransfer.setData("properties", JSON.stringify(element));
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  return (
    <div className="w-full">
      <div className="pt-4 px-5 max-h-[70vh] overflow-y-auto">
        <div>
          <ul className="grid gap-y-[8px] mt-3">
            {Elements.map((element: ElementType) => (
              <li
                key={element.type}
                onDragStart={(e) => handleDragStart(e, element)}
                style={{
                  borderColor: element.color,
                  color: element.color,
                }}
                className="cursor-move text-[#475467] flex justify-between items-center 
                           border border-[#98A2B3] rounded-lg py-3 px-[14px] shadow-custom
                           hover:shadow-lg transition-all duration-200
                           active:opacity-50"
                draggable
              >
                <span className="flex gap-x-2 items-center">
                  <span style={{ color: element.color }}>
                    <AppIcon icon={element.icon} iconClass="w-5 h-5" />
                  </span>
                  <span className="text-sm font-medium leading-[0]">
                    {element.label}
                  </span>
                </span>
                <span className="text-gray-400">
                  <AppIcon icon="akar-icons:drag-horizontal" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(SideBar);
