import clsx from "clsx";
import React, { useContext } from "react";
import GridInput, { GridItem } from "../elements/grid-input";
import { RenderElement } from "./elements-render";
import { getElementOptions } from "./utils";
import { Transition } from "@headlessui/react";
import AppButton from "../ui/AppButton";
import AppIcon from "../ui/AppIcon";
import { getItem } from "@/utils/localStorageControl";
import EditorContext from "@/context/editor-context";
import { evaluateVisibility } from "./validation";

const config = getItem("config");

export default function ConversationalPage({
  element,
  options,
  onNext,
  onPrev,
  isFirst,
  isLast,
  isReadOnly,
  submitText = "Submit",
  preview = false,
}: any) {
  const { answerData } = (useContext(EditorContext) as any) || {};

  if (!element) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 py-12">
        <AppIcon icon="solar:document-linear" iconClass="text-4xl mb-2 text-gray-300" />
        <p className="text-sm font-medium">No questions available.</p>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onNext();
    }
  };

  const renderGridElement = (el: any) => {
    const visibleChildren = el.gridChildren?.filter((child: any) =>
      evaluateVisibility(child, answerData),
    );
    if (!visibleChildren || visibleChildren.length === 0) return null;

    return (
      <div key={el.id} className="min-w-0 w-full">
        <GridInput
          element={el}
          customClass="p-0 min-h-[60px] border-none w-full"
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

  const renderStandardElement = (el: any) => {
    if (!evaluateVisibility(el, answerData)) return null;

    return (
      <div
        key={el.id}
        className={clsx("group relative grid gap-y-2 min-w-0 w-full", el.elementClass)}
      >
        <RenderElement
          element={el}
          validationData={getElementOptions(el, options)}
        />
        {options?.errors?.[el.id]?.message && (
          <div className="mt-1.5 text-xs text-rose-600 font-medium min-h-[1rem] flex items-center gap-1">
            <AppIcon icon="solar:danger-triangle-linear" iconClass="text-xs" />
            {options.errors[el.id].message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center w-full outline-none transition-all",
        preview ? "min-h-[300px] p-0" : "min-h-[460px] p-4 sm:p-10"
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Transition
        as="div"
        key={element.id}
        show={true}
        appear={true}
        enter="transition-all duration-400 ease-out"
        enterFrom="opacity-0 translate-y-6 scale-[0.98]"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition-all duration-250 ease-in"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 -translate-y-6 scale-[0.98]"
        className={clsx(
          "w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-100/60 transition-all",
          preview ? "p-5 sm:p-8 max-w-full" : "p-6 sm:p-10 max-w-3xl"
        )}
      >
        {/* Question Header & Content */}
        <div className="text-left w-full mb-8">
          {element.type === "grid" ? renderGridElement(element) : renderStandardElement(element)}
        </div>

        {/* Action Controls */}
        {!isReadOnly && (
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <AppButton
              type="button"
              text={
                isLast
                  ? options?.isSubmitting
                    ? "Submitting..."
                    : submitText || "Submit"
                  : "OK"
              }
              onClick={onNext}
              style={{ background: config?.buttonColor || "#4f46e5" }}
              btnClass={`!font-semibold !py-2.5 px-8 text-white rounded-xl shadow-xs hover:opacity-90 transition-all ${
                isLast ? "submit_btn" : "continue_btn next_btn text-sm"
              }`}
              isDisabled={options?.apiActivityCount > 0 || (isLast && options?.isSubmitting)}
            />

            {!isLast && (
              <span className="text-xs text-gray-400 font-medium hidden sm:inline-flex items-center gap-1">
                press <kbd className="px-1.5 py-0.5 text-[10px] bg-gray-100 border border-gray-200 rounded font-mono text-gray-600">Enter ↵</kbd>
              </span>
            )}

            {!isFirst && (
              <button
                type="button"
                onClick={onPrev}
                className="text-gray-400 hover:text-gray-700 font-medium text-xs ml-auto flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <AppIcon icon="material-symbols:arrow-upward-rounded" iconClass="text-base" />
                Previous Question
              </button>
            )}
          </div>
        )}
      </Transition>
    </div>
  );
}
