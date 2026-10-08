import React, { useContext, useMemo, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import EditorContext from "@/context/editor-context";
import { getAllformData } from "@/utils/getAllQuestions";
import MultiSelectInput from "@/components/elements/multi-select-input";
import AppIcon from "@/components/ui/AppIcon";

const fieldTypes = ["text", "number", "boolean"] as const;
type FieldType = (typeof fieldTypes)[number];

const operatorLabels: Record<string, string> = {
  equals: "Equals",
  not_equals: "Not equals",
  greater: "Greater than",
  less: "Less than",
  contains: "Contains",
  not_contains: "Not contain",
};

export const inferFieldType = (question: any): FieldType => {
  if (!question) return "text";
  const type = (question.type || "").toLowerCase();
  const inputType = (question.inputType || "").toLowerCase();

  if (
    type === "number" ||
    inputType === "number" ||
    type === "rating" ||
    type === "nps"
  ) {
    return "number";
  }
  if (
    type === "checkbox" &&
    (!question.options || question.options.length <= 1)
  ) {
    return "boolean";
  }
  return "text";
};

export const getOperatorsForType = (type: FieldType | string): string[] => {
  if (type === "number") {
    return ["equals", "not_equals", "greater", "less"];
  }
  if (type === "boolean") {
    return ["equals", "not_equals"];
  }
  return ["equals", "not_equals", "contains", "not_contains"];
};

export interface VisibilityRule {
  id: string;
  value: string;
  label: string;
  sectionId?: string;
  fieldType: FieldType;
  operator: string;
  fieldValue: any;
}

const normalizeField = (
  raw: any,
  availableQuestions: any[],
): VisibilityRule | null => {
  const fieldId = typeof raw === "object" ? raw?.id || raw?.value : raw;
  const question = availableQuestions.find((q) => q.id === fieldId);
  if (!question) return null; // Referenced field was deleted or does not exist

  const inferredType = inferFieldType(question);
  const rawType = typeof raw === "object" ? raw?.fieldType : undefined;
  const fieldType: FieldType =
    rawType === "text" || rawType === "number" || rawType === "boolean"
      ? rawType
      : inferredType;

  const validOperators = getOperatorsForType(fieldType);
  let operator =
    typeof raw === "object" && raw?.operator ? raw.operator : "equals";
  if (!validOperators.includes(operator)) {
    operator = "equals";
  }

  let fieldValue = typeof raw === "object" ? raw?.fieldValue : "";
  if (fieldType === "boolean") {
    if (fieldValue === true || fieldValue === false) {
      // already boolean
    } else if (fieldValue === "true") {
      fieldValue = true;
    } else if (fieldValue === "false") {
      fieldValue = false;
    } else {
      fieldValue = true;
    }
  } else if (fieldValue === undefined || fieldValue === null) {
    fieldValue = "";
  }

  return {
    id: question.id,
    value: question.id,
    label: question.inputLabel || question.label || "Untitled Field",
    sectionId: question.sectionId,
    fieldType,
    operator,
    fieldValue,
  };
};

export default function VisibilityEditor({
  register,
  setValue,
  trigger,
  watch,
  id,
}: any) {
  const { formData }: any = useContext(EditorContext);
  const rawVisibilityFields = watch("visibilityDependentFields");
  const visibilityDependentFields: any[] = useMemo(
    () => (Array.isArray(rawVisibilityFields) ? rawVisibilityFields : []),
    [rawVisibilityFields],
  );

  // Available candidate questions from formData
  const availableQuestions = useMemo(() => {
    return getAllformData(formData).filter(
      (i) => i && !i.isFieldDeleted && !i.isDeleted && i.id !== id,
    );
  }, [formData, id]);

  // Revalidate and normalize visibility dependent fields on mount or when questions change
  useEffect(() => {
    if (!Array.isArray(rawVisibilityFields) || rawVisibilityFields.length === 0)
      return;

    const normalizedList: VisibilityRule[] = [];
    let hasChanges = false;

    for (const item of rawVisibilityFields) {
      const normalized = normalizeField(item, availableQuestions);
      if (!normalized) {
        // Field was deleted or missing; mark change so it gets purged
        hasChanges = true;
      } else {
        if (
          typeof item !== "object" ||
          item.id !== normalized.id ||
          item.value !== normalized.value ||
          item.label !== normalized.label ||
          item.fieldType !== normalized.fieldType ||
          item.operator !== normalized.operator ||
          item.fieldValue !== normalized.fieldValue
        ) {
          hasChanges = true;
        }
        normalizedList.push(normalized);
      }
    }

    if (hasChanges || normalizedList.length !== rawVisibilityFields.length) {
      setValue("visibilityDependentFields", normalizedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      trigger?.("visibilityDependentFields");
    }
  }, [availableQuestions, rawVisibilityFields, setValue, trigger]);

  // Memoize options for the MultiSelectInput
  const fieldOptions = useMemo(() => {
    return availableQuestions.map((q) => {
      const existing = visibilityDependentFields.find((j: any) => {
        const jId = typeof j === "object" ? j?.id || j?.value : j;
        return jId === q.id;
      });
      const inferredType = inferFieldType(q);
      return {
        id: q.id,
        value: q.id,
        label: q.inputLabel || q.label || "Untitled Field",
        sectionId: q.sectionId,
        fieldType: existing?.fieldType || inferredType,
        operator: existing?.operator || "equals",
        fieldValue:
          existing?.fieldValue !== undefined
            ? existing?.fieldValue
            : inferredType === "boolean"
              ? true
              : "",
      };
    });
  }, [availableQuestions, visibilityDependentFields]);

  const handleValueChange = (index: number, name: string, newValue: any) => {
    const updatedFields = visibilityDependentFields.map((item: any, i: number) => {
      if (i !== index) return item;

      const normalizedItem =
        typeof item === "object"
          ? { ...item }
          : { id: item, value: item };

      const updated = { ...normalizedItem, [name]: newValue };

      // Field type changes: reset operator and value if incompatible
      if (name === "fieldType") {
        const allowedOps = getOperatorsForType(newValue);
        if (!allowedOps.includes(updated.operator)) {
          updated.operator = "equals";
        }
        if (newValue === "boolean") {
          updated.fieldValue = true;
        } else if (typeof updated.fieldValue === "boolean") {
          updated.fieldValue = "";
        }
      }

      return updated;
    });

    setValue("visibilityDependentFields", updatedFields, {
      shouldDirty: true,
      shouldValidate: true,
    });
    trigger?.("visibilityDependentFields");
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = visibilityDependentFields.filter(
      (_: any, i: number) => i !== index,
    );
    setValue("visibilityDependentFields", updatedFields, {
      shouldDirty: true,
      shouldValidate: true,
    });
    trigger?.("visibilityDependentFields");
  };

  const handleClearAll = () => {
    setValue("visibilityDependentFields", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
    trigger?.("visibilityDependentFields");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Field Selector */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800">
            Dependent Fields
          </label>
          {visibilityDependentFields.length > 0 && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {visibilityDependentFields.length}{" "}
              {visibilityDependentFields.length === 1 ? "rule" : "rules"} active
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Choose which fields this element's visibility should depend on. This
          element will be visible only when all configured rules match.
        </p>

        <div className="mt-1">
          <MultiSelectInput
            element={{
              options: fieldOptions,
              id: "visibilityDependentFields",
              value: visibilityDependentFields,
              returnObjects: true,
            }}
            validationData={{ register, setValue, trigger, watch }}
            placeholder="Select dependent fields..."
          />
        </div>
      </div>

      {/* Rules Editor Section */}
      {visibilityDependentFields.length > 0 ? (
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Visibility Rules (Condition Logic)
            </h4>
            {visibilityDependentFields.length > 1 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-rose-500 hover:text-rose-600 hover:underline font-medium transition-colors cursor-pointer"
              >
                Clear all rules
              </button>
            )}
          </div>

          {/* Header Row */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50/80 rounded-lg border border-slate-200/60">
            <div className="flex-1 min-w-[130px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Field
              </span>
            </div>
            <div className="w-[110px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Type
              </span>
            </div>
            <div className="w-[140px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Operator
              </span>
            </div>
            <div className="flex-1 min-w-[140px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Expected Value
              </span>
            </div>
            <div className="w-8 flex justify-center">
              <span className="sr-only">Actions</span>
            </div>
          </div>

          {/* Rules List */}
          <div className="flex flex-col gap-2">
            {visibilityDependentFields.map((rawField: any, index: number) => {
              const fieldId =
                typeof rawField === "object"
                  ? rawField?.id || rawField?.value
                  : rawField;
              const originalField = availableQuestions.find(
                (f: any) => f.id === fieldId,
              );

              // Field metadata fallbacks
              const fieldLabel =
                originalField?.inputLabel ||
                originalField?.label ||
                rawField?.label ||
                "Unknown Field";
              const currentFieldType: FieldType =
                rawField?.fieldType ||
                inferFieldType(originalField) ||
                "text";
              const currentOperator = rawField?.operator || "equals";
              const currentValue = rawField?.fieldValue;

              const isChoiceField =
                [
                  "selectField",
                  "radio",
                  "checkbox",
                  "multiSelect",
                  "cascadeSelect",
                  "country",
                  "imageChoice",
                  "polling",
                  "ranking",
                ].includes(originalField?.type) ||
                Boolean(originalField?.options?.length);
              const options = originalField?.options || [];
              const availableOperators = getOperatorsForType(currentFieldType);
              const selectedChoiceValues: any[] = Array.isArray(currentValue)
                ? currentValue
                : currentValue !== undefined &&
                    currentValue !== null &&
                    currentValue !== ""
                  ? [currentValue]
                  : [];

              return (
                <div
                  key={fieldId || index}
                  className="group relative flex flex-wrap items-center gap-2.5 p-2.5 bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg shadow-sm transition-all duration-200"
                >
                  {/* Field Label Badge */}
                  <div className="flex-1 min-w-[130px]">
                    <div
                      title={fieldLabel}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium truncate select-none flex items-center gap-2"
                    >
                      <AppIcon
                        icon="lucide:sliders-horizontal"
                        iconClass="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                      />
                      <span className="truncate">{fieldLabel}</span>
                    </div>
                  </div>

                  {/* Field Type Selector */}
                  <div className="w-[110px]">
                    <div className="relative">
                      <Listbox
                        value={currentFieldType}
                        onChange={(val) =>
                          handleValueChange(index, "fieldType", val)
                        }
                      >
                        <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm">
                          <span className="block truncate capitalize">
                            {currentFieldType}
                          </span>
                          <AppIcon
                            icon="lucide:chevron-down"
                            iconClass="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                          />
                        </Listbox.Button>
                        <Transition
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute z-[9999] w-[var(--button-width)] min-w-[120px] mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto focus:outline-none py-1"
                            anchor="bottom start"
                          >
                            {fieldTypes.map((type) => (
                              <Listbox.Option
                                key={type}
                                value={type}
                                className={({ active, selected }) =>
                                  `px-3 py-1.5 text-sm cursor-pointer capitalize transition-colors flex items-center justify-between ${
                                    selected
                                      ? "bg-blue-50 text-blue-700 font-semibold"
                                      : active
                                        ? "bg-slate-50 text-slate-800"
                                        : "text-slate-700"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>{type}</span>
                                    {selected && (
                                      <AppIcon
                                        icon="lucide:check"
                                        iconClass="w-3.5 h-3.5 text-blue-600"
                                      />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </Listbox>
                    </div>
                  </div>

                  {/* Operator Selector */}
                  <div className="w-[140px]">
                    <div className="relative">
                      <Listbox
                        value={currentOperator}
                        onChange={(val) =>
                          handleValueChange(index, "operator", val)
                        }
                      >
                        <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm">
                          <span className="block truncate">
                            {operatorLabels[currentOperator] ||
                              currentOperator.replace("_", " ")}
                          </span>
                          <AppIcon
                            icon="lucide:chevron-down"
                            iconClass="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                          />
                        </Listbox.Button>
                        <Transition
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute z-[9999] w-[var(--button-width)] min-w-[150px] mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto focus:outline-none py-1"
                            anchor="bottom start"
                          >
                            {availableOperators.map((op) => (
                              <Listbox.Option
                                key={op}
                                value={op}
                                className={({ active, selected }) =>
                                  `px-3 py-1.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                                    selected
                                      ? "bg-blue-50 text-blue-700 font-semibold"
                                      : active
                                        ? "bg-slate-50 text-slate-800"
                                        : "text-slate-700"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>
                                      {operatorLabels[op] || op.replace("_", " ")}
                                    </span>
                                    {selected && (
                                      <AppIcon
                                        icon="lucide:check"
                                        iconClass="w-3.5 h-3.5 text-blue-600"
                                      />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </Listbox>
                    </div>
                  </div>

                  {/* Field Value Input / Selector */}
                  <div className="flex-1 min-w-[140px]">
                    {isChoiceField && options.length > 0 ? (
                      <div className="relative">
                        <Listbox
                          value={selectedChoiceValues}
                          onChange={(val: any[]) =>
                            handleValueChange(index, "fieldValue", val)
                          }
                          multiple
                        >
                          <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm">
                            <div className="flex items-center gap-1.5 truncate pr-2">
                              {selectedChoiceValues.length === 0 ? (
                                <span className="text-slate-400">
                                  Select expected value(s)...
                                </span>
                              ) : selectedChoiceValues.length === 1 ? (
                                <span className="truncate">
                                  {options.find(
                                    (o: any) =>
                                      String(o.value) ===
                                      String(selectedChoiceValues[0]),
                                  )?.label || selectedChoiceValues[0]}
                                </span>
                              ) : (
                                <>
                                  <span className="truncate max-w-[110px]">
                                    {options.find(
                                      (o: any) =>
                                        String(o.value) ===
                                        String(selectedChoiceValues[0]),
                                    )?.label || selectedChoiceValues[0]}
                                  </span>
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-full flex-shrink-0">
                                    +{selectedChoiceValues.length - 1}
                                  </span>
                                </>
                              )}
                            </div>
                            <AppIcon
                              icon="lucide:chevron-down"
                              iconClass="w-3.5 h-3.5 flex-shrink-0 text-slate-400"
                            />
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              className="absolute z-[9999] w-[var(--button-width)] min-w-[180px] mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto focus:outline-none py-1"
                              anchor="bottom start"
                            >
                              {options.map((opt: any, optIdx: number) => {
                                const isSelected = selectedChoiceValues.some(
                                  (v: any) => String(v) === String(opt.value),
                                );
                                return (
                                  <Listbox.Option
                                    key={optIdx}
                                    value={opt.value}
                                    className={({ active }) =>
                                      `px-3 py-1.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                                        isSelected
                                          ? "bg-blue-50 text-blue-700 font-semibold"
                                          : active
                                            ? "bg-slate-50 text-slate-800"
                                            : "text-slate-700"
                                      }`
                                    }
                                  >
                                    {() => (
                                      <div className="flex items-center gap-2 truncate w-full">
                                        <div
                                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                            isSelected
                                              ? "bg-blue-600 border-blue-600 text-white"
                                              : "border-slate-300 bg-white"
                                          }`}
                                        >
                                          {isSelected && (
                                            <AppIcon
                                              icon="lucide:check"
                                              iconClass="w-3 h-3 stroke-[3]"
                                            />
                                          )}
                                        </div>
                                        <span className="truncate">
                                          {opt.label}
                                        </span>
                                      </div>
                                    )}
                                  </Listbox.Option>
                                );
                              })}
                            </Listbox.Options>
                          </Transition>
                        </Listbox>
                      </div>
                    ) : currentFieldType === "boolean" ? (
                      <div className="relative">
                        <Listbox
                          value={currentValue}
                          onChange={(val) =>
                            handleValueChange(index, "fieldValue", val)
                          }
                        >
                          <Listbox.Button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm">
                            <span className="block truncate">
                              {currentValue === true
                                ? "True (Checked)"
                                : currentValue === false
                                  ? "False (Unchecked)"
                                  : "Select state..."}
                            </span>
                            <AppIcon
                              icon="lucide:chevron-down"
                              iconClass="w-3.5 h-3.5 text-slate-400"
                            />
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              className="absolute z-[9999] w-[var(--button-width)] min-w-[140px] mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto focus:outline-none py-1"
                              anchor="bottom start"
                            >
                              <Listbox.Option
                                value={true}
                                className={({ active, selected }) =>
                                  `px-3 py-1.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                                    selected
                                      ? "bg-blue-50 text-blue-700 font-semibold"
                                      : active
                                        ? "bg-slate-50 text-slate-800"
                                        : "text-slate-700"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>True (Checked)</span>
                                    {selected && (
                                      <AppIcon
                                        icon="lucide:check"
                                        iconClass="w-3.5 h-3.5 text-blue-600"
                                      />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                              <Listbox.Option
                                value={false}
                                className={({ active, selected }) =>
                                  `px-3 py-1.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                                    selected
                                      ? "bg-blue-50 text-blue-700 font-semibold"
                                      : active
                                        ? "bg-slate-50 text-slate-800"
                                        : "text-slate-700"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>False (Unchecked)</span>
                                    {selected && (
                                      <AppIcon
                                        icon="lucide:check"
                                        iconClass="w-3.5 h-3.5 text-blue-600"
                                      />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            </Listbox.Options>
                          </Transition>
                        </Listbox>
                      </div>
                    ) : (
                      <input
                        type={currentFieldType === "number" ? "number" : "text"}
                        value={currentValue ?? ""}
                        onChange={(e) =>
                          handleValueChange(
                            index,
                            "fieldValue",
                            currentFieldType === "number"
                              ? e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                              : e.target.value,
                          )
                        }
                        placeholder={
                          currentFieldType === "number"
                            ? "e.g. 10"
                            : "Enter expected value..."
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm placeholder-slate-400"
                      />
                    )}
                  </div>

                  {/* Remove Rule Action Button */}
                  <div className="w-8 flex items-center justify-center">
                    <button
                      type="button"
                      title="Remove condition"
                      onClick={() => handleRemoveField(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <AppIcon icon="lucide:trash-2" iconClass="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-lg flex items-start gap-3">
          <AppIcon
            icon="lucide:eye-off"
            iconClass="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-slate-700">
              No visibility rules added yet
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              When toggled hidden without rules, this element is hidden by default.
              Select one or more dependent fields above to show this element only
              when specific user inputs or choices match.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
