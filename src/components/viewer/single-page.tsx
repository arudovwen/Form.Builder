import clsx from "clsx";
import GridInput, { GridItem } from "../elements/grid-input";
import { RenderElement } from "./elements-render";

 export  const getElementOptions = (element: any, options: any) => {
    if (!element?.allowEdit) return options;
    return { ...options, isReadOnly: false };
  };

export default function SinglePage({ form_data, options }) {

  const renderGridElement = (element: any, gridChildren: any[]) => (
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
          {RenderElement(child, getElementOptions(child, options))}
        </GridItem>
      ))}
    </GridInput>
  );

  const renderStandardElement = (element: any) => (
    <div
      key={element.id}
      className={clsx("group relative grid gap-y-[6px]", element.elementClass)}
    >
      {RenderElement(element, getElementOptions(element, options))}
      {options?.errors?.[element.id]?.message && (
        <div className="mt-1 text-xs text-red-600">
          {options.errors[element.id].message}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid gap-y-10">
      {form_data.map((section: any) => {
        const gridChildren = new Map<string, any[]>();
        
        // Pre-group grid children for efficient lookup
        section.questionData?.forEach((el: any) => {
          if (el.gridId) {
            if (!gridChildren.has(el.gridId)) {
              gridChildren.set(el.gridId, []);
            }
            gridChildren.get(el.gridId)!.push(el);
          }
        });

        return (
          <div key={section.id} className="pb-6 section_box">
            {(section.title || section.description) && (
              <div className="py-4 border-b border-gray-100 mb-7 section_box__title">
                {section.title && (
                  <h2 className="text-lg font-semibold mb-[4px]">
                    {section.title}
                  </h2>
                )}
                {section.description && (
                  <p className="text-sm">{section.description}</p>
                )}
              </div>
            )}
            <div className="grid gap-y-3 section_box__content">
              {section.questionData?.map((element: any) => {
                if (element.gridId) return null;
                
                if (element.type === "grid") {
                  return renderGridElement(
                    element,
                    gridChildren.get(element.id) || []
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