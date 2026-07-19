import React, { useContext, useMemo, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import EditorContext from "@/context/editor-context";
import { getAllQuestionData } from "@/utils/getAllQuestions";
import MultiSelectInput from "@/components/elements/multi-select-input";
import AppIcon from "@/components/ui/AppIcon";

const fieldTypes = ["text", "number", "boolean"];
const operators = ["equals", "not_equals", "contains", "not_contains"];
const numberOperators = ["greater", "less"];

export default function VisibilityEditor({
  register,
  setValue,
  trigger,
  watch,
  id,
}: any) {
  const { formData }: any = useContext(EditorContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const visibilityDependentFields = watch("visibilityDependentFields") || [];

  // Memoize options
  const questionData = useMemo(() => {
    return getAllQuestionData(formData)
      .filter((i) => i.id !== id)
      ?.map((i) => {
        const currentField = visibilityDependentFields.find(
          (j) => j.id === i.id,
        );
        return {
          id: i.id,
          value: i.id,
          label: i.inputLabel,
          sectionId: i.sectionId,
          fieldType: currentField?.fieldType || "text",
          operator: currentField?.operator || "equals",
          fieldValue:
            currentField?.fieldValue !== undefined
              ? currentField.fieldValue
              : "",
        };
      });
  }, [formData, visibilityDependentFields, id]);

  const handleValueChange = (index: number, name: string, newValue: any) => {
    const updatedFields = visibilityDependentFields?.map((item, i) =>
      i === index ? { ...item, [name]: newValue } : item,
    );
    setValue("visibilityDependentFields", updatedFields);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-800">Dependent Fields</label>
        <p className="text-xs text-slate-500 mb-1">Choose which fields this element's visibility should depend on.</p>
        <MultiSelectInput
          element={{
            options: questionData,
            id: "visibilityDependentFields",
            value: watch("visibilityDependentFields"),
          }}
          validationData={{ register, setValue, trigger, watch }}
        />
      </div>

      {visibilityDependentFields.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          {/* Header Row */}
          <div className="hidden sm:flex flex-wrap items-center gap-3 px-4 pt-2 pb-1">
            <div className="flex-1 min-w-[120px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field</span>
            </div>
            <div className="w-[110px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</span>
            </div>
            <div className="w-[140px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operator</span>
            </div>
            <div className="flex-1 min-w-[140px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value</span>
            </div>
          </div>

          {visibilityDependentFields?.map((field: any, index: number) => {
            const originalField = getAllQuestionData(formData).find(
              (f: any) => f.id === field.id,
            );
            const isChoiceField = [
              "selectField",
              "radio",
              "checkbox",
              "multiSelect",
              "cascadeSelect",
            ].includes(originalField?.type);
            const options = originalField?.options || [];

            return (
              <div
                key={field.id}
                className="group relative flex flex-wrap items-center gap-2 p-2 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-lg shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:border-gray-300/60 transition-all duration-300 ease-out"
              >
                {/* Field label */}
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="text"
                    id={field.label}
                    value={field.label}
                    readOnly
                    disabled
                    className="w-full px-3 py-2.5 bg-slate-100/50 border border-slate-200/80 rounded-lg text-sm text-slate-600 font-medium truncate cursor-not-allowed focus:outline-none"
                  />
                </div>

                {/* Field type */}
                <div className="w-[110px]">
                  <div className="relative">
                    <Listbox
                      value={field.fieldType}
                      onChange={(val) => handleValueChange(index, "fieldType", val)}
                    >
                      <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 shadow-sm">
                        <span className="block truncate capitalize">{field.fieldType}</span>
                        <AppIcon icon="lucide:chevron-down" iconClass="w-4 h-4 text-slate-400" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options
                          className="absolute z-[9999] w-[var(--button-width)] min-w-[120px] mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none py-1"
                          anchor="bottom start"
                        >
                          {fieldTypes?.map((type) => (
                            <Listbox.Option
                              key={type}
                              value={type}
                              className={({ active }) => `px-4 py-2 text-sm cursor-pointer capitalize transition-colors ${active ? 'bg-gray-50/80 text-gray-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              {type}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                  </div>
                </div>

                {/* Operator */}
                <div className="w-[140px]">
                  <div className="relative">
                    <Listbox
                      value={field.operator}
                      onChange={(val) => handleValueChange(index, "operator", val)}
                    >
                      <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 shadow-sm">
                        <span className="block truncate capitalize">{field.operator.replace("_", " ")}</span>
                        <AppIcon icon="lucide:chevron-down" iconClass="w-4 h-4 text-slate-400" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options
                          className="absolute z-[9999] w-[var(--button-width)] min-w-[150px] mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none py-1"
                          anchor="bottom start"
                        >
                          {(field.fieldType === "number" ? [...operators, ...numberOperators] : operators)?.map((op) => (
                            <Listbox.Option
                              key={op}
                              value={op}
                              className={({ active }) => `px-4 py-2 text-sm cursor-pointer capitalize transition-colors ${active ? 'bg-gray-50/80 text-gray-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              {op.replace("_", " ")}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                  </div>
                </div>

                {/* Field Value */}
                <div className="flex-1 min-w-[140px]">
                  {isChoiceField && options.length > 0 ? (
                    <div className="relative">
                      <Listbox
                        value={field.fieldValue ?? ""}
                        onChange={(val) => handleValueChange(index, "fieldValue", val)}
                      >
                        <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 shadow-sm">
                          <span className="block truncate pr-2">{options.find((o: any) => o.value === field.fieldValue)?.label || "Select value"}</span>
                          <AppIcon icon="lucide:chevron-down" iconClass="w-4 h-4 flex-shrink-0 text-slate-400" />
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute z-[9999] w-[var(--button-width)] min-w-[160px] mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-lg  max-h-60 overflow-auto focus:outline-none py-1"
                            anchor="bottom start"
                          >
                            {options.map((opt: any, i: number) => (
                              <Listbox.Option
                                key={i}
                                value={opt.value}
                                className={({ active }) => `px-4 py-2 text-sm cursor-pointer transition-colors ${active ? 'bg-gray-50/80 text-gray-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                              >
                                {opt.label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </Listbox>
                    </div>
                  ) : field.fieldType !== "boolean" ? (
                    <input
                      type={field.fieldType}
                      value={field.fieldValue || ""}
                      onChange={(e) => handleValueChange(index, "fieldValue", e.target.value)}
                      placeholder="Enter value..."
                      className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-colors shadow-sm placeholder-slate-400"
                    />
                  ) : (
                    <div className="relative">
                      <Listbox
                        value={field.fieldValue ?? ""}
                        onChange={(val) => handleValueChange(index, "fieldValue", val)}
                      >
                        <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 shadow-sm">
                          <span className="block truncate">{field.fieldValue === true ? "True" : field.fieldValue === false ? "False" : "Select value"}</span>
                          <AppIcon icon="lucide:chevron-down" iconClass="w-4 h-4 text-slate-400" />
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute z-[9999] w-[var(--button-width)] min-w-[150px] mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none py-1"
                            anchor="bottom start"
                          >
                            <Listbox.Option value={true} className={({ active }) => `px-4 py-2 text-sm cursor-pointer transition-colors ${active ? 'bg-gray-50/80 text-gray-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
                              True
                            </Listbox.Option>
                            <Listbox.Option value={false} className={({ active }) => `px-4 py-2 text-sm cursor-pointer transition-colors ${active ? 'bg-gray-50/80 text-gray-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
                              False
                            </Listbox.Option>
                          </Listbox.Options>
                        </Transition>
                      </Listbox>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
