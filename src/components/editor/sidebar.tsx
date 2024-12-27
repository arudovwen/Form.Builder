import { Elements } from "../../utils/contants";
import AppIcon from "../ui/AppIcon";

export default function SideBar({ handleDragStart }: any) {
  return (
    <div className="w-full">
      <div className="pt-4 px-5 max-h-[70vh] overflow-y-auto">
        <div>
          <ul className="grid gap-y-[8px] mt-3">
            {Elements.map((element: any) => (
              <li
                key={element.type}
                onDragStart={handleDragStart(element)}
                style={{
                  borderColor: element?.color,
                  color: element?.color,
                }}
                className="cursor-move text-[#475467] flex justify-between items-center border border-[#98A2B3]  rounded-lg py-3 px-[14px] shadow-custom"
                draggable
              >
                <span className="flex gap-x-2 items-center">
                  <span style={{ color: element?.color }}>
                    <AppIcon icon={element.icon} iconClass="w-5 h-5" />
                  </span>
                  <span className="text-sm font-medium leading-[0]">
                    {element.label}
                  </span>
                </span>
                <span>
                  <AppIcon icon="akar-icons:drag-horizontal" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
