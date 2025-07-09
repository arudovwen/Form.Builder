import { useCallback, DragEvent, memo, useContext, useState } from "react";
import { Elements } from "../../utils/contants";
import AppIcon from "../ui/AppIcon";
import EditorContext from "../../context/editor-context";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { getItem } from "../../utils/localStorageControl";

interface ElementType {
  type: string;
  label: string;
  icon: string;
  color?: string;
  [key: string]: any;
}

const SideBar = () => {
  const [query, setQuery] = useState("");
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

  const config = getItem("config");
  const elementColor = config?.elementColor;
  const elementBgColor = config?.elementBgColor;
  const elementBorderColor = config?.elementBorderColor;

  const filteredElements = Elements.filter((element: ElementType) =>
    element.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pt-4 pb-6">
      <div className="px-5 mb-4">
        <input
          className="field-control"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <hr />
      <div>
        <ul className="grid gap-y-[8px] mt-3 px-5 max-h-[85vh] overflow-y-auto no-scrollbar">
          {filteredElements.map((element: ElementType) => (
            <li
              key={element.type}
              onDragStart={(e) => handleDragStart(e, element)}
              onDragEnd={() => setIsDragging(false)}
              onClick={() => handleElement(element)}
              style={{
                borderColor: elementBorderColor,
                color: element.color,
                backgroundColor: elementBgColor,
              }}
              className="cursor-move text-[#475467] flex justify-between items-center h-11
                         border border-[#98A2B3] rounded-lg py-3 px-[14px] shadow-custom
                         hover:shadow-lg transition-all duratipon-200
                         active:opacity-50 element_class"
              draggable
            >
              <span className="flex items-center gap-x-3">
                 <span style={{ color: elementColor }}>
                <AppIcon icon={element.icon} iconClass="w-4 h-4" />
              </span>
                <span
                  style={{ color: elementColor }}
                  className="text-sm font-medium leading-[0]"
                >
                  {element.label}
                </span>
              </span>
            
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(SideBar);
