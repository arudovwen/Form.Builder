import { useCallback, DragEvent, memo, useContext, useState, useEffect } from "react";
import { CategorizedElements, CategorizedPollElements, Elements, FormType } from "../../utils/contants";
import AppIcon from "../ui/AppIcon";
import EditorContext from "../../context/editor-context";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { getItem } from "../../utils/localStorageControl";

interface ElementType {
  type: string;
  label: string;
  icon: string;
  color?: string;
  [key: string]: any;
}

const categoryTitles = [
  { key: "textFields", title: "Text Fields" },
  { key: "selectionFields", title: "Selection Fields" },
  { key: "dateAndTime", title: "Date & Time" },
  { key: "fileAndMedia", title: "File & Media" },
  { key: "layoutAndDisplay", title: "Layout & Display" },
  { key: "advancedData", title: "Advanced / Data" },
];

const pollCategoryTitles = [
  { key: "pollComponents", title: "Poll Components" },
  { key: "layoutAndInfo", title: "Layout & Info" },
];

const SideBar = ({ formType = "default" }: { formType?: FormType }) => {
  const [query, setQuery] = useState("");
  const [clipboardType, setClipboardType] = useState<"element" | "section" | null>(null);
  const { setIsDragging, addElement, selectedSection, pasteElement, pasteSection }: any =
    useContext(EditorContext);

  useEffect(() => {
    const checkClipboard = () => {
      try {
        const sectionString = localStorage.getItem("form_builder_section_clipboard");
        if (sectionString) {
          try {
            const sectionData = JSON.parse(sectionString);
            if (sectionData?.type === "FORM_BUILDER_SECTION_CLIPBOARD" && sectionData?.section) {
              const isExpired = sectionData?.timestamp && Date.now() - sectionData.timestamp > 60000;
              if (isExpired) {
                localStorage.removeItem("form_builder_section_clipboard");
              } else {
                setClipboardType("section");
                return;
              }
            } else {
              localStorage.removeItem("form_builder_section_clipboard");
            }
          } catch {
            localStorage.removeItem("form_builder_section_clipboard");
          }
        }

        const elementString = localStorage.getItem("form_builder_clipboard");
        if (elementString) {
          try {
            const elementData = JSON.parse(elementString);
            if (elementData?.type === "FORM_BUILDER_SECTION_CLIPBOARD" && elementData?.section) {
              const isExpired = elementData?.timestamp && Date.now() - elementData.timestamp > 60000;
              if (isExpired) {
                localStorage.removeItem("form_builder_clipboard");
              } else {
                setClipboardType("section");
                return;
              }
            } else if (elementData?.type === "FORM_BUILDER_CLIPBOARD" && elementData?.element) {
              const isExpired = elementData?.timestamp && Date.now() - elementData.timestamp > 60000;
              if (isExpired) {
                localStorage.removeItem("form_builder_clipboard");
              } else {
                setClipboardType("element");
                return;
              }
            } else {
              localStorage.removeItem("form_builder_clipboard");
            }
          } catch {
            localStorage.removeItem("form_builder_clipboard");
          }
        }

        setClipboardType(null);
      } catch {
        setClipboardType(null);
      }
    };

    checkClipboard();
    const interval = setInterval(checkClipboard, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLLIElement>, element: ElementType) => {
      if (!selectedSection) {
        toast.error("Please select a section to add an element.");
        return;
      }
      event.dataTransfer.setData("properties", JSON.stringify(element));
      event.dataTransfer.effectAllowed = "move";
      setIsDragging(true);
    },
    [setIsDragging, selectedSection],
  );

  function handleElement(element: any) {
    if (!selectedSection) {
      toast.error("Please select a section to add an element.");
      return;
    }
    const newElement = {
      ...element,
      id: uuidv4(),
      sectionId: selectedSection,
    };
    addElement(newElement, selectedSection);
  }

  const config = getItem("config") || {};
  const elementColor = config.elementColor;
  const elementBgColor = config.elementBgColor;
  const elementBorderColor = config.elementBorderColor;

  const filteredElements = Elements.filter((element: ElementType) =>
    element.label.toLowerCase().includes(query.toLowerCase()),
  );

  const activeCategories = formType === "poll" ? pollCategoryTitles : categoryTitles;
  const activeCategorizedElements = formType === "poll" ? CategorizedPollElements : CategorizedElements;

  const categorizedElements = activeCategories
    ?.map((category) => ({
      title: category.title,
      elements: filteredElements.filter((e) =>
        (activeCategorizedElements as Record<string, readonly string[]>)[
          category.key
        ]?.includes(e.type),
      ),
    }))
    .filter((category) => category.elements.length > 0); // remove empty categories

  return (
    <div className="pt-4 flex flex-col gap-y-6">
      <div className="px-5">
        <input
          className="field-control"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          name="search"
          id="search"
          autoComplete="off"
        />
        {clipboardType === "section" && (
          <button
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors border border-purple-200"
            onClick={() => {
              if (typeof pasteSection === 'function') {
                pasteSection();
              }
            }}
            title="Paste copied section"
          >
            <AppIcon icon="lucide:clipboard-paste" />
            Paste Section (Ctrl+V)
          </button>
        )}
        {clipboardType === "element" && (
          <button
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors border border-blue-200"
            onClick={() => {
              if (!selectedSection) {
                toast.error("Please select a section to paste the element.");
                return;
              }
              if (typeof pasteElement === 'function') {
                pasteElement(selectedSection);
              }
            }}
            title="Paste copied element"
          >
            <AppIcon icon="lucide:clipboard-paste" />
            Paste Element (Ctrl+V)
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-100px)]">
        <ul className="grid gap-y-5 mt-3 px-5 ">
          {categorizedElements?.map((category, index) => (
            <li key={index}>
              <h4 className="mb-2 text-[11px] font-bold text-gray-500 uppercase">
                {category.title}
              </h4>
              <ul className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3">
                {category.elements?.map((element) => (
                  <li
                    key={element.type}
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={() => setIsDragging(false)}
                    onClick={() => handleElement(element)}
                    style={{
                      borderColor: elementBorderColor,

                      backgroundColor: elementBgColor,
                    }}
                    className="cursor-move text-[#475467] flex justify-between items-center 
                               border-[1.5px] border-[#98A2B3] rounded-lg py-2 px-2 shadow-custom
                               hover:shadow-lg transition-all duration-200
                               active:opacity-50 element_class"
                    draggable
                  >
                    <span className="flex flex-col items-center justify-center w-full gap-2">
                      <span style={{ color: elementColor }}>
                        <AppIcon icon={element.icon} iconClass="w-6 h-6" />
                      </span>
                      <span
                        style={{ color: elementColor }}
                        className="text-xs font-medium text-center"
                      >
                        {element.label}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(SideBar);
