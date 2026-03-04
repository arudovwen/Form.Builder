import React, { ReactNode } from "react";
interface GridInputProps {
    element: any;
    sectionId?: string;
    children?: ReactNode;
    customClass?: string;
    state?: string;
    /** Id of the element currently being dragged on the canvas (passed down so
     *  grid cells can show a "ready to receive" style even before hovering them) */
    draggedElementId?: string | null;
}
interface GridItemProps {
    col: number;
    children: ReactNode;
    customClass?: string;
    state?: string;
}
export declare const GridItem: ({ col, children, customClass }: GridItemProps) => import("react/jsx-runtime").JSX.Element;
declare const _default: React.MemoExoticComponent<({ element, sectionId, children, customClass, state, draggedElementId, }: GridInputProps) => import("react/jsx-runtime").JSX.Element>;
export default _default;
