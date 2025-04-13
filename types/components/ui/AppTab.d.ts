import { FC } from "react";
interface Tab {
    key: string;
    title: string;
}
interface TabsComponentProps {
    tabs: Tab[];
    className?: string;
    count?: {
        [key: string]: number;
    };
    setActiveTab: (key: string) => void;
    activeTab: string;
    btnClass?: string;
}
declare const TabsComponent: FC<TabsComponentProps>;
export default TabsComponent;
