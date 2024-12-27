import React, { FC } from "react";
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
    "flex gap-x-3 mb-8 w-full no-scrollbar overflow-x-auto border-b border-[#EAECF0] darks:border-gray-500",
    className
  );

  return (
    <div className={containerClass}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const tabCount = count[tab.key] || 0;
        
        // Base class for each tab button
        const baseBtnClass = clsx(
          "capitalize text-xs whitespace-nowrap no-scrollbar md:text-sm font-semibold pb-[14px] border-b-2 px-6 flex items-center justify-center gap-x-1 flex-1 text-center",
          btnClass
        );

        // Conditional classes based on whether the tab is active
        const activeClasses = clsx({
          "border-primary darks:border-white !text-primary darks:!text-white": isActive,
          "border-transparent text-[#667085] darks:!text-white/60": !isActive,
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
