import {
  useCallback,
  DragEvent,
  memo,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  CategorizedElements,
  CategorizedPollElements,
  Elements,
  FormType,
  ElementKind,
} from "../../utils/contants";
import AppIcon from "../ui/AppIcon";
import EditorContext from "../../context/editor-context";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ElementType {
  type: string;
  label: string;
  icon: string;
  color?: string;
  [key: string]: any;
}

interface ElementMetadata {
  title: string;
  desc: string;
  badge?: string;
  badgeStyle?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const ELEMENT_METADATA: Record<string, ElementMetadata> = {
  [ElementKind.TEXT]: {
    title: "Short Text Input",
    desc: "Names, job titles, handles",
    icon: "fluent:text-16-filled",
    iconBg: "bg-indigo-50/90",
    iconColor: "text-indigo-600",
  },
  [ElementKind.LONG_TEXT]: {
    title: "Long Text Area",
    desc: "Multi-line feedback & notes",
    icon: "lucide:align-left",
    iconBg: "bg-blue-50/90",
    iconColor: "text-blue-600",
  },
  [ElementKind.PHONE]: {
    title: "Phone Number",
    desc: "Country code selector & mask",
    badge: "Intl",
    badgeStyle: "bg-slate-100 text-slate-600 border border-slate-200/60",
    icon: "lucide:phone",
    iconBg: "bg-sky-50/90",
    iconColor: "text-sky-600",
  },
  [ElementKind.NUMBER]: {
    title: "Numeric & Stepper",
    desc: "Steppers, min/max bounds",
    icon: "lucide:binary",
    iconBg: "bg-cyan-50/90",
    iconColor: "text-cyan-600",
  },
  [ElementKind.AMOUNT]: {
    title: "Currency & Amount",
    desc: "Formatted prices & currency",
    icon: "lucide:dollar-sign",
    iconBg: "bg-emerald-50/90",
    iconColor: "text-emerald-600",
  },
  [ElementKind.EMAIL]: {
    title: "Email",
    desc: "Email address validation",
    badge: "RFC",
    badgeStyle: "bg-blue-50 text-blue-600 border border-blue-200/60",
    icon: "lucide:mail",
    iconBg: "bg-blue-50/90",
    iconColor: "text-blue-600",
  },
  [ElementKind.PASSWORD]: {
    title: "Password Input",
    desc: "Masked entry with toggle",
    icon: "lucide:lock",
    iconBg: "bg-violet-50/90",
    iconColor: "text-violet-600",
  },
  [ElementKind.URL]: {
    title: "Web URL Link",
    desc: "Website link with protocol",
    icon: "lucide:link-2",
    iconBg: "bg-indigo-50/90",
    iconColor: "text-indigo-600",
  },
  [ElementKind.BASIC_TEXT]: {
    title: "Static Text & Title",
    desc: "Headings, notes & copy block",
    icon: "lucide:heading",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  [ElementKind.SELECT]: {
    title: "Dropdown Menu",
    desc: "Searchable single choice list",
    badge: "Logic Ready",
    badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    icon: "lucide:chevron-down-circle",
    iconBg: "bg-purple-50/90",
    iconColor: "text-purple-600",
  },
  [ElementKind.MULTI_SELECT]: {
    title: "Multi-Select Tags",
    desc: "Tag-based multi-choice picker",
    icon: "lucide:layers",
    iconBg: "bg-fuchsia-50/90",
    iconColor: "text-fuchsia-600",
  },
  [ElementKind.CASCADE_SELECT]: {
    title: "Cascade Select",
    desc: "Parent & child dependent list",
    badge: "Nested",
    badgeStyle: "bg-purple-50 text-purple-700 border border-purple-200/70",
    icon: "lucide:git-fork",
    iconBg: "bg-purple-50/90",
    iconColor: "text-purple-600",
  },
  [ElementKind.CHECKBOX]: {
    title: "Checkbox Group",
    desc: "Multi-choice options group",
    icon: "lucide:check-square",
    iconBg: "bg-teal-50/90",
    iconColor: "text-teal-600",
  },
  [ElementKind.RADIO]: {
    title: "Radio Buttons",
    desc: "Single selection circular list",
    icon: "lucide:circle-dot",
    iconBg: "bg-amber-50/90",
    iconColor: "text-amber-600",
  },
  [ElementKind.COUNTRY]: {
    title: "Country Selector",
    desc: "Global countries with flags",
    icon: "lucide:globe",
    iconBg: "bg-blue-50/90",
    iconColor: "text-blue-600",
  },
  [ElementKind.RATING]: {
    title: "Rating & Stars",
    desc: "Satisfaction scale & stars",
    icon: "lucide:star",
    iconBg: "bg-amber-50/90",
    iconColor: "text-amber-500",
  },
  [ElementKind.MATRIX]: {
    title: "Matrix / Likert",
    desc: "Multi-dimension evaluation grid",
    badge: "Grid",
    badgeStyle: "bg-indigo-50 text-indigo-700 border border-indigo-200/70",
    icon: "lucide:layout-grid",
    iconBg: "bg-indigo-50/90",
    iconColor: "text-indigo-600",
  },
  [ElementKind.DATE]: {
    title: "Date Picker",
    desc: "Calendar picker with ranges",
    icon: "lucide:calendar",
    iconBg: "bg-rose-50/90",
    iconColor: "text-rose-600",
  },
  [ElementKind.TIME]: {
    title: "Time Picker",
    desc: "12h/24h clock selection",
    icon: "lucide:clock",
    iconBg: "bg-orange-50/90",
    iconColor: "text-orange-600",
  },
  [ElementKind.FILE]: {
    title: "File Attachment",
    desc: "Upload documents, photos, PDFs",
    icon: "lucide:upload-cloud",
    iconBg: "bg-indigo-50/90",
    iconColor: "text-indigo-600",
  },
  [ElementKind.DIVIDER]: {
    title: "Divider Line",
    desc: "Visual horizontal break line",
    icon: "lucide:minus",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  [ElementKind.SPACER]: {
    title: "Vertical Spacer",
    desc: "Configurable vertical gap",
    icon: "lucide:move-vertical",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  [ElementKind.GRID]: {
    title: "Responsive Grid",
    desc: "2-4 column layout container",
    badge: "Layout",
    badgeStyle: "bg-indigo-50 text-indigo-700 border border-indigo-200/70",
    icon: "lucide:columns-2",
    iconBg: "bg-indigo-50/90",
    iconColor: "text-indigo-600",
  },
  [ElementKind.SECTION]: {
    title: "Page Section",
    desc: "Card container for questions",
    badge: "Block",
    badgeStyle: "bg-slate-100 text-slate-700 border border-slate-200/70",
    icon: "lucide:layout-panel-top",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  [ElementKind.DATA_LOOKUP]: {
    title: "Data Lookup",
    desc: "Dynamic external REST query",
    badge: "API",
    badgeStyle: "bg-purple-50 text-purple-700 border border-purple-200/70",
    icon: "lucide:database",
    iconBg: "bg-purple-50/90",
    iconColor: "text-purple-600",
  },
  [ElementKind.DATA_GRID]: {
    title: "Data Table Grid",
    desc: "Editable spreadsheet rows",
    badge: "Pro",
    badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200/70",
    icon: "lucide:table",
    iconBg: "bg-amber-50/90",
    iconColor: "text-amber-600",
  },
  [ElementKind.TABLE_INPUT]: {
    title: "Table Input",
    desc: "Dynamic repeatable row items",
    badge: "Pro",
    badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200/70",
    icon: "lucide:sheet",
    iconBg: "bg-amber-50/90",
    iconColor: "text-amber-600",
  },
  [ElementKind.CALCULATED_FIELD]: {
    title: "Calculated Formula",
    desc: "Dynamic mathematical formula",
    badge: "Formula",
    badgeStyle: "bg-indigo-50 text-indigo-700 border border-indigo-200/70",
    icon: "lucide:calculator",
    iconBg: "bg-indigo-50/90",
    iconColor: "text-indigo-600",
  },
  [ElementKind.POLLING]: {
    title: "Polling Option",
    desc: "Quick voting & sentiment poll",
    badge: "Poll",
    badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    icon: "lucide:bar-chart-2",
    iconBg: "bg-emerald-50/90",
    iconColor: "text-emerald-600",
  },
  [ElementKind.NPS]: {
    title: "NPS Rating",
    desc: "0-10 Net Promoter Score",
    badge: "Poll",
    badgeStyle: "bg-indigo-50 text-indigo-700 border border-indigo-200/70",
    icon: "lucide:smile",
    iconBg: "bg-indigo-50/90",
    iconColor: "text-indigo-600",
  },
  [ElementKind.RANKING]: {
    title: "Ranking Choice",
    desc: "Drag items to rank preference",
    badge: "Poll",
    badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200/70",
    icon: "lucide:arrow-down-up",
    iconBg: "bg-amber-50/90",
    iconColor: "text-amber-600",
  },
  [ElementKind.IMAGE_CHOICE]: {
    title: "Image Choice",
    desc: "Visual cards with photos",
    badge: "Poll",
    badgeStyle: "bg-rose-50 text-rose-700 border border-rose-200/70",
    icon: "lucide:image",
    iconBg: "bg-rose-50/90",
    iconColor: "text-rose-600",
  },
};

const categoryTitles = [
  { key: "textFields", title: "Input & Essentials", icon: "lucide:pen-line", filterTag: "essentials" },
  { key: "selectionFields", title: "Choice & Selection", icon: "lucide:sliders-horizontal", filterTag: "choice" },
  { key: "dateAndTime", title: "Date & Time", icon: "lucide:calendar-clock", filterTag: "date" },
  { key: "fileAndMedia", title: "Files & Media", icon: "lucide:paperclip", filterTag: "date" },
  { key: "layoutAndDisplay", title: "Layout & Structure", icon: "lucide:layout-template", filterTag: "layout" },
  { key: "advancedData", title: "Advanced & Logic", icon: "lucide:code-2", filterTag: "advanced" },
];

const pollCategoryTitles = [
  { key: "pollComponents", title: "Poll Components", icon: "lucide:bar-chart-3", filterTag: "choice" },
  { key: "layoutAndInfo", title: "Layout & Info", icon: "lucide:layout-template", filterTag: "layout" },
];

const FILTER_CHIPS = [
  { id: "all", label: "All" },
  { id: "essentials", label: "Essentials" },
  { id: "choice", label: "Choice" },
  { id: "layout", label: "Layout" },
  { id: "advanced", label: "Advanced" },
  { id: "date", label: "Date & Media" },
];

const FREQUENT_ELEMENT_KINDS = [
  ElementKind.TEXT,
  ElementKind.EMAIL,
  ElementKind.SELECT,
  ElementKind.CHECKBOX,
];

const SideBar = ({ formType = "default" }: { formType?: FormType }) => {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"outline" | "cards">(() => {
    return (localStorage.getItem("form_builder_sidebar_view_mode") as "outline" | "cards") || "outline";
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [showPinned, setShowPinned] = useState(true);
  const [clipboardType, setClipboardType] = useState<"element" | "section" | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    setIsDragging,
    addElement,
    selectedSection,
    setSelectedSection,
    formData,
    pasteElement,
    pasteSection,
  }: any = useContext(EditorContext);

  // Save view mode
  const handleToggleViewMode = (mode: "outline" | "cards") => {
    setViewMode(mode);
    try {
      localStorage.setItem("form_builder_sidebar_view_mode", mode);
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut Cmd+K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Clipboard detection
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

  const getTargetSectionId = useCallback(() => {
    if (selectedSection) return selectedSection;
    if (formData && formData.length > 0) {
      const active = formData.find((s: any) => !s.isFieldDeleted && !s.isDeleted);
      if (active?.id) {
        setSelectedSection(active.id);
        return active.id;
      }
    }
    return null;
  }, [selectedSection, formData, setSelectedSection]);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLElement>, element: ElementType) => {
      const targetId = getTargetSectionId();
      if (!targetId) {
        toast.error("Please add or select a section to drag elements.");
        return;
      }
      event.dataTransfer.setData("properties", JSON.stringify(element));
      event.dataTransfer.effectAllowed = "move";
      setIsDragging(true);
    },
    [setIsDragging, getTargetSectionId],
  );

  const handleElement = useCallback(
    (element: any) => {
      const targetId = getTargetSectionId();
      if (!targetId) {
        toast.error("Please add or select a section first.");
        return;
      }
      const newElement = {
        ...element,
        id: uuidv4(),
        sectionId: targetId,
      };
      addElement(newElement, targetId);
      toast.success(`Added ${ELEMENT_METADATA[element.type]?.title || element.label}`, {
        duration: 1500,
      });
    },
    [addElement, getTargetSectionId],
  );

 
  // Filter elements by query
  const filteredElements = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Elements.filter((element: ElementType) => {
      if (!q) return true;
      const meta = ELEMENT_METADATA[element.type];
      const matchLabel = element.label.toLowerCase().includes(q);
      const matchTitle = meta?.title.toLowerCase().includes(q);
      const matchDesc = meta?.desc.toLowerCase().includes(q);
      const matchType = element.type.toLowerCase().includes(q);
      return matchLabel || matchTitle || matchDesc || matchType;
    });
  }, [query]);

  // Frequently used items
  const frequentElements = useMemo(() => {
    return FREQUENT_ELEMENT_KINDS.map((kind) => {
      return Elements.find((el) => el.type === kind);
    }).filter(Boolean) as ElementType[];
  }, []);

  const activeCategories = formType === "poll" ? pollCategoryTitles : categoryTitles;
  const activeCategorizedElements = formType === "poll" ? CategorizedPollElements : CategorizedElements;

  // Filter by category and active chip filter
  const categorizedElements = useMemo(() => {
    return activeCategories
      ?.filter((category) => {
        if (activeFilter === "all") return true;
        return category.filterTag === activeFilter;
      })
      .map((category) => {
        const allowedTypes = (activeCategorizedElements as Record<string, readonly string[]>)[category.key] || [];
        const items = filteredElements.filter((e) => allowedTypes.includes(e.type));
        return {
          title: category.title,
          icon: category.icon,
          elements: items,
        };
      })
      .filter((cat) => cat.elements.length > 0);
  }, [activeCategories, activeCategorizedElements, filteredElements, activeFilter]);

  const totalElementsCount = Elements.length;

  return (
    <aside className="w-full h-full bg-white flex flex-col overflow-hidden text-gray-800 select-none">
      {/* 1. Header with View Toggle (Cards vs Outline) */}
      <div className="p-3.5 border-b border-gray-200/80 bg-white shrink-0 space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left: [+] Add Elements & Items Pill */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
              <AppIcon icon="lucide:plus" iconClass="text-sm stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <h2 className="text-sm font-bold text-gray-900 tracking-tight leading-none whitespace-nowrap">
                Add Elements
              </h2>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-100/60 leading-none whitespace-nowrap shrink-0">
                {totalElementsCount} Items
              </span>
            </div>
          </div>

          {/* Right: View Toggle Segmented Control */}
          <div className="flex items-center bg-gray-100/90 p-0.5 rounded-lg border border-gray-200/70 text-xs shrink-0">
            <button
              type="button"
              onClick={() => handleToggleViewMode("cards")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-[11px] whitespace-nowrap transition-all ${
                viewMode === "cards"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              title="Card Grid view"
            >
              <AppIcon icon="lucide:layout-grid" iconClass="text-xs" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleViewMode("outline")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-[11px] whitespace-nowrap transition-all ${
                viewMode === "outline"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              title="Detailed Outline view"
            >
              <AppIcon icon="lucide:list-tree" iconClass="text-xs" />
              <span>Outline</span>
            </button>
          </div>
        </div>

        {/* 2. Search Bar with ⌘K Badge */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <AppIcon icon="lucide:search" iconClass="text-sm" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            className="w-full pl-9 pr-12 py-2 text-xs bg-gray-50 border border-gray-200/90 rounded-lg placeholder:text-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            placeholder="Search components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-gray-400 hover:text-gray-600 rounded pointer-events-auto"
                title="Clear"
              >
                <AppIcon icon="lucide:x" iconClass="text-xs" />
              </button>
            ) : (
              <kbd className="inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 text-[10px] font-sans font-medium text-gray-400 bg-gray-100 rounded border border-gray-200/90 select-none leading-none">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* 3. Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gray-900 text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* 4. Clipboard Action Banner (if item copied) */}
        {clipboardType === "section" && (
          <button
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors border border-indigo-200 shadow-2xs"
            onClick={() => {
              if (typeof pasteSection === "function") {
                pasteSection();
              }
            }}
            title="Paste copied section"
          >
            <AppIcon icon="lucide:clipboard-paste" iconClass="text-sm" />
            Paste Section (Ctrl+V)
          </button>
        )}
        {clipboardType === "element" && (
          <button
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors border border-indigo-200 shadow-2xs"
            onClick={() => {
              const targetId = getTargetSectionId();
              if (!targetId) {
                toast.error("Please select a section to paste the element.");
                return;
              }
              if (typeof pasteElement === "function") {
                pasteElement(targetId);
              }
            }}
            title="Paste copied element"
          >
            <AppIcon icon="lucide:clipboard-paste" iconClass="text-sm" />
            Paste Element (Ctrl+V)
          </button>
        )}
      </div>

      {/* 5. Elements Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-5">
        {/* ⭐ FREQUENTLY USED SECTION (Shown when not filtering by text search) */}
        {!query && activeFilter === "all" && showPinned && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <AppIcon icon="lucide:star" iconClass="text-amber-400 fill-amber-400 text-xs" />
                <span>Frequently Used</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPinned((p) => !p)}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Hide
              </button>
            </div>

            {/* 2x2 Grid of Frequently Used Cards */}
            <div className="grid grid-cols-2 gap-2">
              {frequentElements.map((el) => {
                const meta = ELEMENT_METADATA[el.type] || {
                  title: el.label,
                  desc: "Quick add element",
                  icon: el.icon,
                  iconBg: "bg-indigo-50",
                  iconColor: "text-indigo-600",
                };

                return (
                  <div
                    key={el.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, el)}
                    onDragEnd={() => setIsDragging(false)}
                    onClick={() => handleElement(el)}
                    className="group relative cursor-grab active:cursor-grabbing bg-white border border-gray-200/90 hover:border-indigo-400 rounded-xl p-2.5 flex items-start gap-2.5 transition-all hover:shadow-xs active:scale-[0.98]"
                    title={`Click or drag to add ${meta.title}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border border-gray-100 ${meta.iconBg} ${meta.iconColor} group-hover:scale-105 transition-transform`}
                    >
                      <AppIcon icon={meta.icon} iconClass="text-sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 truncate leading-snug">
                        {meta.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate leading-tight">
                        {meta.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CATEGORIZED SECTIONS */}
        {categorizedElements.map((category) => (
          <div key={category.title} className="space-y-2">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <AppIcon icon={category.icon} iconClass="text-xs text-gray-400" />
                <span>{category.title}</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {category.elements.length} items
              </span>
            </div>

            {/* --- VIEW MODE: OUTLINE / LIST --- */}
            {viewMode === "outline" ? (
              <div className="space-y-1.5">
                {category.elements.map((element) => {
                  const meta = ELEMENT_METADATA[element.type] || {
                    title: element.label,
                    desc: "Interactive form element",
                    icon: element.icon,
                    iconBg: "bg-indigo-50",
                    iconColor: "text-indigo-600",
                  };

                  return (
                    <div
                      key={element.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      onDragEnd={() => setIsDragging(false)}
                      onClick={() => handleElement(element)}
                      className="group relative cursor-grab active:cursor-grabbing bg-white border border-gray-200/80 hover:border-indigo-400/90 rounded-xl p-2.5 flex items-center gap-2.5 transition-all hover:bg-indigo-50/20 hover:shadow-xs active:scale-[0.99]"
                      title={`Drag onto canvas or click to add ${meta.title}`}
                    >
                      {/* Drag Grip Handle */}
                      <div className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors">
                        <AppIcon icon="lucide:grip-vertical" iconClass="text-sm" />
                      </div>

                      {/* Element Icon Box */}
                      <div
                        className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border border-gray-100/80 ${meta.iconBg} ${meta.iconColor} group-hover:scale-105 transition-transform shadow-2xs`}
                      >
                        <AppIcon icon={meta.icon} iconClass="text-base" />
                      </div>

                      {/* Title & Description */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 truncate">
                            {meta.title}
                          </span>
                          {meta.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase leading-none ${
                                meta.badgeStyle || "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {meta.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 group-hover:text-gray-500 truncate">
                          {meta.desc}
                        </p>
                      </div>

                      {/* 1-Click Quick Add Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElement(element);
                        }}
                        className="w-7 h-7 rounded-lg border border-transparent group-hover:border-indigo-200 group-hover:bg-indigo-50 text-gray-300 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-all hover:scale-110 active:scale-95"
                        title="Click to instantly add"
                      >
                        <AppIcon icon="lucide:plus" iconClass="text-sm stroke-[2.5]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* --- VIEW MODE: CARDS GRID --- */
              <div className="grid grid-cols-2 gap-2">
                {category.elements.map((element) => {
                  const meta = ELEMENT_METADATA[element.type] || {
                    title: element.label,
                    desc: "Interactive form element",
                    icon: element.icon,
                    iconBg: "bg-indigo-50",
                    iconColor: "text-indigo-600",
                  };

                  return (
                    <div
                      key={element.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      onDragEnd={() => setIsDragging(false)}
                      onClick={() => handleElement(element)}
                      className="group relative cursor-grab active:cursor-grabbing bg-white border border-gray-200/90 hover:border-indigo-400 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 transition-all hover:bg-indigo-50/20 hover:shadow-xs active:scale-[0.98]"
                      title={`Click or drag to add ${meta.title}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border border-gray-100 ${meta.iconBg} ${meta.iconColor} group-hover:scale-110 transition-transform shadow-2xs`}
                      >
                        <AppIcon icon={meta.icon} iconClass="text-lg" />
                      </div>

                      <div className="w-full">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 truncate max-w-[90%]">
                            {meta.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {meta.desc}
                        </p>
                      </div>

                      {meta.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase leading-none ${
                            meta.badgeStyle || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {meta.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {categorizedElements.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
              <AppIcon icon="lucide:search-x" iconClass="text-lg" />
            </div>
            <p className="text-xs font-semibold text-gray-700">No components found</p>
            <p className="text-[11px] text-gray-400 mt-1">
              No elements match &quot;{query}&quot;
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveFilter("all");
              }}
              className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default memo(SideBar);
