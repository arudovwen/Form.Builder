import clsx from "clsx";
import React, { useContext } from "react";
import GridInput, { GridItem } from "../elements/grid-input";
import { RenderElement } from "./elements-render";
import EditorContext from "@/context/editor-context";
import { evaluateVisibility } from "./validation";

import { getElementOptions } from "./utils";

export default function SinglePage({ form_data, options }: any) {
  const { answerData } = (useContext(EditorContext) as any) || {};

  const renderGridElement = (element: any, gridChildren: any[]) => {
    if (!evaluateVisibility(element, answerData)) return null;

    const visibleChildren = gridChildren?.filter((child: any) =>
      evaluateVisibility(child, answerData),
    );

    if (!visibleChildren || visibleChildren.length === 0) return null;

    return (
      <div key={element.id} className="min-w-0 w-full">
        <GridInput element={element} customClass="p-0 min-h-[60px] border-none">
          {visibleChildren.map((child: any) => (
            <GridItem
              key={child.id}
              col={child.gridPosition?.col}
              customClass="p-0 relative"
            >
              <RenderElement
                element={child}
                validationData={getElementOptions(child, options)}
              />
              {options?.errors?.[child.id]?.message && (
                <div className="absolute -bottom-[18px] left-0 text-xs text-red-600 whitespace-nowrap">
                  {options.errors[child.id].message}
                </div>
              )}
            </GridItem>
          ))}
        </GridInput>
      </div>
    );
  };

  const renderStandardElement = (element: any) => {
    if (!evaluateVisibility(element, answerData)) return null;

    return (
      <div
        key={element.id}
        className={clsx(
          "group relative grid gap-y-[6px] min-w-0",
          element.elementClass,
        )}
      >
        <RenderElement
          element={element}
          validationData={getElementOptions(element, options)}
        />
        {options?.errors?.[element.id]?.message && (
          <div className="absolute -bottom-[18px] left-0 text-xs text-red-600 whitespace-nowrap">
            {options.errors[element.id].message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-y-10">
      {form_data?.map((section: any) => {
        const gridChildren = new Map<string, any[]>();

        // Pre-group grid children for efficient lookup
        const gridMap = new Map<string, any>();
        section?.formData?.forEach((el: any) => {
          if (el.type === "grid") gridMap.set(el.id, el);
        });

        section?.formData?.forEach((el: any) => {
          if (el.gridId) {
            const parentGrid = gridMap.get(el.gridId);
            if (
              parentGrid &&
              (!el.gridPosition?.col ||
                el.gridPosition.col <= (parentGrid.columns || 1))
            ) {
              if (!gridChildren.has(el.gridId)) {
                gridChildren.set(el.gridId, []);
              }
              gridChildren.get(el.gridId)!.push(el);
            }
          }
        });

        return (
          <div key={section.id} className="pb-6 section_box min-w-0">
            {(section.title || section.description) && (
              <div className="py-4 border-b border-gray-100 mb-7 section_box__title">
                {section.title && (
                  <h4 className="text-xl font-bold">{section.title}</h4>
                )}
                {section.description && (
                  <p className="text-sm">{section.description}</p>
                )}
              </div>
            )}
            <div className="grid gap-y-6 section_box__content min-w-0">
              {section?.formData?.map((element: any) => {
                const parentGrid = element.gridId
                  ? gridMap.get(element.gridId)
                  : null;
                const isGridChild =
                  parentGrid &&
                  (!element.gridPosition?.col ||
                    element.gridPosition.col <= (parentGrid.columns || 1));

                if (isGridChild) return null;

                if (element.type === "grid") {
                  return renderGridElement(
                    element,
                    gridChildren.get(element.id) || [],
                  );
                }

                return renderStandardElement(element);
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
