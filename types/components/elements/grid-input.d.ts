import React, { ReactNode } from "react";
interface GridInputProps {
    element: any;
    sectionId?: string;
    children?: ReactNode;
    customClass?: string;
    state?: string;
}
interface GridItemProps {
    col: number;
    children: ReactNode;
    customClass?: string;
    state?: string;
}
export declare const GridItem: ({ col, children, customClass }: GridItemProps) => import("react/jsx-runtime").JSX.Element;
declare const _default: React.MemoExoticComponent<({ element, sectionId, children, customClass, state, }: GridInputProps) => import("react/jsx-runtime").JSX.Element>;
export default _default;
