import clsx from "clsx";
import React from "react";
import GridInput, { GridItem } from "../elements/grid-input";
import { RenderElement } from "./elements-render";
import { getElementOptions } from "./single-page";
import { Transition } from "@headlessui/react";
import AppButton from "../ui/AppButton";
import AppIcon from "../ui/AppIcon";
import { getItem } from "@/utils/localStorageControl";

const config = getItem("config");

export default function ConversationalPage({ element, options, onNext, onPrev, isFirst, isLast, isReadOnly }: any) {
  if (!element) {
    return (
      <div className="flex items-center justify-center min-h-[500px] text-gray-500">
        No questions available.
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onNext();
    }
  };

  const renderGridElement = (el: any) => (
    <div key={el.id} className="min-w-0 w-full">
      <GridInput
        element={el}
        customClass="p-0 min-h-[60px] border-none w-full"
      >
      {el.gridChildren?.map((child: any) => (
        <GridItem
          key={child.id}
          col={child.gridPosition?.col}
          customClass="p-0"
        >
          <RenderElement
            element={child}
            validationData={getElementOptions(child, options)}
          />
          {options?.errors?.[child.id]?.message && (
            <div className="mt-1 text-xs text-red-600">
              {options.errors[child.id].message}
            </div>
          )}
        </GridItem>
      ))}
      </GridInput>
    </div>
  );

  const renderStandardElement = (el: any) => (
    <div
      key={el.id}
      className={clsx("group relative grid gap-y-[6px] min-w-0 w-full", el.elementClass)}
    >
      <RenderElement
        element={el}
        validationData={getElementOptions(el, options)}
      />
      {options?.errors?.[el.id]?.message && (
        <div className="mt-1 text-xs text-red-600">
          {options.errors[el.id].message}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[500px] w-full p-4 sm:p-8 outline-none" 
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Transition
        as="div"
        key={element.id}
        show={true}
        appear={true}
        enter="transition-all duration-500 ease-out"
        enterFrom="opacity-0 translate-y-8"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-300 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-8"
        className="w-full max-w-2xl"
      >
        <div className="text-left w-full mb-8">
           {element.type === "grid" ? renderGridElement(element) : renderStandardElement(element)}
        </div>
        
        {!isReadOnly && (
          <div className="flex items-center gap-4 mt-8">
            <AppButton
              type="button"
              text={isLast ? (options?.isSubmitting ? "Submitting..." : "Submit") : "OK"}
              onClick={onNext}
              style={{ background: config?.buttonColor || "#333" }}
              btnClass={`text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg ${isLast ? 'submit_btn' : 'continue_btn next_btn text-sm'}`}
            />
            {!isLast && <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">press Enter ↵</span>}
            
            {!isFirst && (
               <button type="button" onClick={onPrev} className="text-gray-400 hover:text-gray-600 font-medium text-sm ml-auto flex items-center gap-1 transition-colors">
                 <AppIcon icon="material-symbols:arrow-upward-rounded" iconClass="text-lg" />
                 Back
               </button>
            )}
          </div>
        )}
      </Transition>
    </div>
  );
}
