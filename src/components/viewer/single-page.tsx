import clsx from "clsx";
import GridInput, { GridItem } from "../elements/grid-input";
import { renderElement } from "./elements-render";

export default function SinglePage({ form_data, options }) {
  return (
    <div className="grid gap-y-10">
      {form_data.flatMap((section: any) => (
        <div key={section.id} className="pb-6 border-b border-gray-100 last:border-none">
          <div className="mb-4">
            {section.title && (
              <h2 className="text-lg font-semibold mb-[4px]">
                {section?.title}
              </h2>
            )}
            {section.description && (
              <p className="text-sm">{section?.description}</p>
            )}
          </div>
          <div className="grid gap-y-6">
            {section.questionData?.map((element: any) => {
              if (element.type === "grid") {
                const gridChildren = section.questionData.filter(
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
                        {renderElement(child, options)}
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
                    {renderElement(element, options)}
                    <div className="mt-1 text-xs text-red-600">
                      {options?.errors?.[element.id]?.message}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
