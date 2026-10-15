import clsx from "clsx";
import React, { useContext } from "react";
import GridInput, { GridItem } from "../elements/grid-input";
import { RenderElement } from "./elements-render";
import { getElementOptions } from "./utils";
import EditorContext from "@/context/editor-context";
import { evaluateVisibility } from "./validation";

export default function MultiPage({ form_data, options, current }: any) {
  const { answerData } = (useContext(EditorContext) as any) || {};

  return (
    <div className="multi_section__content min-w-0">
      {form_data?.map((section: any, index: number) => {
        const isCurrent = index === current;
        return (
          <div
            key={section.id || index}
            className={clsx("grid gap-y-3", isCurrent ? "block" : "hidden")}
          >
            {section?.formData?.map((element: any) => {
              if (element.type === "grid") {
                if (!evaluateVisibility(element, answerData)) return null;

                const gridChildren = section?.formData?.filter(
                  (child: any) =>
                    child.gridId === element.id &&
                    (!child.gridPosition?.col ||
                      child.gridPosition.col <= (element.columns || 1))
                );
                const visibleChildren = gridChildren?.filter((child: any) =>
                  evaluateVisibility(child, answerData)
                );

                if (!visibleChildren || visibleChildren.length === 0) return null;

                return (
                  <div key={element.id} className="min-w-0 w-full">
                    <GridInput
                      element={element}
                      customClass="p-0 min-h-[60px] border-none"
                    >
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
                            <div className="mt-1 text-xs text-red-600 min-h-[1rem]">
                              {options.errors[child.id].message}
                            </div>
                          )}
                        </GridItem>
                      ))}
                    </GridInput>
                  </div>
                );
              }

              const parentGrid = element.gridId
                ? section?.formData?.find(
                    (g: any) => g.id === element.gridId && g.type === "grid"
                  )
                : null;
              const isGridChild =
                parentGrid &&
                (!element.gridPosition?.col ||
                  element.gridPosition.col <= (parentGrid.columns || 1));

              if (!isGridChild) {
                if (!evaluateVisibility(element, answerData)) return null;

                return (
                  <div
                    key={element.id}
                    className={clsx(
                      "group relative grid gap-y-[6px] min-w-0",
                      element.elementClass
                    )}
                  >
                    <RenderElement
                      element={element}
                      validationData={getElementOptions(element, options)}
                    />
                    {options?.errors?.[element.id]?.message && (
                      <div className="mt-1 text-xs text-red-600 min-h-[1rem]">
                        {options.errors[element.id].message}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}
