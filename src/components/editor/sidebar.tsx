import { useCallback, DragEvent, memo, useContext } from "react";
import { Elements } from "../../utils/contants";
import AppIcon from "../ui/AppIcon";
import EditorContext from "../../context/editor-context";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

interface ElementType {
  type: string;
  label: string;
  icon: string;
  color?: string;
  [key: string]: any;
}

const SideBar = () => {
  const { setIsDragging, addElement, selectedSection }: any =
    useContext(EditorContext);
  const handleDragStart = useCallback(
    (event: DragEvent<HTMLLIElement>, element: ElementType) => {
      event.dataTransfer.setData("properties", JSON.stringify(element));
      event.dataTransfer.effectAllowed = "move";
      setIsDragging(true);
    },
    [setIsDragging]
  );
  function handleElement(element: any) {
    console.log(selectedSection);
    if (!selectedSection) {
      toast.error("Please select a section to add an element to.");
      return;
    }
    const newElement = {
      ...element,
      id: uuidv4(),
      sectionId: selectedSection,
    };

    addElement(newElement, selectedSection);
  }
  return (
    <div className="w-full">
      <div className="py-4 px-5 max-h-[80vh] overflow-y-auto">
        <div>
          <ul className="grid gap-y-[8px] mt-3">
            {Elements.map((element: ElementType) => (
              <li
                key={element.type}
                onDragStart={(e) => handleDragStart(e, element)}
                onDragEnd={() => setIsDragging(false)}
                onClick={() => handleElement(element)}
                style={{
                  borderColor: element.color,
                  color: element.color,
                }}
                className="cursor-move text-[#475467] flex justify-between items-center  h-11
                           border border-[#98A2B3] rounded-lg py-3 px-[14px] shadow-custom
                           hover:shadow-lg transition-all duration-200
                           active:opacity-50"
                draggable
              >
                <span className="flex gap-x-2 items-center">
                  <span className="text-gray-400">
                    <AppIcon icon="akar-icons:drag-vertical" />
                  </span>

                  <span className="text-sm font-medium leading-[0]">
                    {element.label}
                  </span>
                </span>
                <span style={{ color: element.color }}>
                  <AppIcon icon={element.icon} iconClass="w-4 h-4" />
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
