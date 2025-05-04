import React, { ReactNode } from "react";
interface ElementType {
    id: string;
    inputLabel?: string;
    [key: string]: any;
}
interface ElementContainerProps {
    element: ElementType;
    children: ReactNode;
    state?: string;
}
declare const ElementContainer: React.MemoExoticComponent<({ state, element, children }: ElementContainerProps) => import("react/jsx-runtime").JSX.Element>;
export default ElementContainer;
