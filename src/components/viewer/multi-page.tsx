import clsx from "clsx";
import React from "react";
import GridInput, { GridItem } from "../elements/grid-input";
import { renderElement } from "./elements-render";
import { getElementOptions } from "./single-page";

export default function MultiPage({ form_data, options, current }) {
  return (
    <div className="grid gap-y-3 multi_section__content">
      {form_data[current].questionData?.map((element: any) => {
        if (element.type === "grid") {
          const gridChildren = form_data[current].questionData.filter(
            (child: any) => child.gridId === element.id
          );

          return (
            <GridInput
              key={element.id}
              element={element}
              customClass="p-0 min-h-[60px] border-none"
            >
              {gridChildren.map((child: any) => (
                <GridItem
                  key={child.id}
                  col={child.gridPosition?.col}
                  customClass="p-0"
                >
                  {renderElement(child, getElementOptions(child, options))}
                </GridItem>
              ))}
            </GridInput>
          );
        }

        if (!element.gridId) {
          return (
            <div
              key={element.id}
              className={clsx(
                "group relative grid gap-y-[6px]",
                element.elementClass
              )}
            >
              {renderElement(element, getElementOptions(element, options))}
              <div className="mt-1 text-xs text-red-600">
                {options?.errors?.[element.id]?.message}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
