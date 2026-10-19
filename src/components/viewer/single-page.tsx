import clsx from "clsx";
import React, { useContext } from "react";
import GridInput, { GridItem } from "../elements/grid-input";
import { RenderElement } from "./elements-render";
import EditorContext from "@/context/editor-context";
import { evaluateVisibility } from "./validation";
import { getElementOptions } from "./utils";
import AppIcon from "../ui/AppIcon";

export default function SinglePage({ form_data, options }: any) {
  const { answerData } = (useContext(EditorContext) as any) || {};

  const renderGridElement = (element: any, gridChildren: any[]) => {
    if (!evaluateVisibility(element, answerData)) return null;

    const visibleChildren = gridChildren?.filter((child: any) =>
      evaluateVisibility(child, answerData),
    );

    if (!visibleChildren || visibleChildren.length === 0) return null;

    return (
      <div key={element.id} className="min-w-0 w-full bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
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
                <div className="mt-1 text-xs text-rose-600 font-medium min-h-[1rem] flex items-center gap-1">
                  <AppIcon icon="solar:danger-triangle-linear" iconClass="text-xs" />
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
          "group relative grid gap-y-2 min-w-0 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:border-gray-300 transition-colors",
          element.elementClass,
        )}
      >
        <RenderElement
          element={element}
          validationData={getElementOptions(element, options)}
        />
        {options?.errors?.[element.id]?.message && (
          <div className="mt-1 text-xs text-rose-600 font-medium min-h-[1rem] flex items-center gap-1">
            <AppIcon icon="solar:danger-triangle-linear" iconClass="text-xs" />
            {options.errors[element.id].message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-y-8">
      {form_data?.map((section: any, idx: number) => {
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
          <div key={section.id || idx} className="section_box min-w-0">
            {(section.title || section.description) && (
              <div className="py-3 px-1 mb-4 section_box__title">
                {section.title && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
                  </div>
                )}
                {section.description && (
                  <p className="text-xs text-gray-500 pl-8">{section.description}</p>
                )}
              </div>
            )}
            <div className="grid gap-y-4 section_box__content min-w-0">
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
