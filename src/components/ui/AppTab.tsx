import { FC } from "react";
import clsx from "clsx";

interface Tab {
  key: string;
  title: string;
}

interface TabsComponentProps {
  tabs: Tab[];
  className?: string;
  count?: { [key: string]: number };
  setActiveTab: (key: string) => void; // Improved type for setActiveTab
  activeTab: string;
  btnClass?: string;
}

const TabsComponent: FC<TabsComponentProps> = ({
  tabs,
  className = "",
  count = {},
  setActiveTab,
  activeTab,
  btnClass = "",
}) => {
  // Class name for the container
  const containerClass = clsx(
    "flex gap-x-3 mb-8 w-full no-scrollbar overflow-x-auto border-b-2 border-[#EAECF0] darks:border-gray-500",
    className
  );

  return (
    <div className={containerClass}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const tabCount = count[tab.key] || 0;
        
        // Base class for each tab button
        const baseBtnClass = clsx(
          "capitalize text-sm  whitespace-nowrap no-scrollbar font-semibold pb-[14px] border-b-2 border-[#EAECF0] px-6 flex items-center  gap-x-1 flex-1 text-center",`${tabs.length===1?'justify-start':'justify-center'}`,
          btnClass
        );

        // Conditional classes based on whether the tab is active
        const activeClasses = clsx({
          "border-gray-500 border-primary border-primary-500  text-primary text-primary-500": isActive,
          "border-transparent text-gray-400 ": !isActive,
        });

        // Conditional count display
        const countBubble = tabCount > 0 && (
          <span className="text-xs h-6 min-w-[24px] rounded-full flex justify-center items-center border border-[#EAECF0] darks:border-gray-500 bg-[#F9FAFB] darks:bg-gray-800 text-[#454745] darks:text-white/80">
            {tabCount}
          </span>
        );

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(baseBtnClass, activeClasses)}
            aria-selected={isActive} // Added accessibility
            role="tab"
            type="button"
          >
            {tab.title}
            {countBubble}
          </button>
        );
      })}
    </div>
  );
};

export default TabsComponent;
