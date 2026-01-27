import React, { useContext, useMemo, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import EditorContext from "@/context/editor-context";
import { getAllQuestionData } from "@/utils/getAllQuestions";
import MultiSelectInput from "@/components/elements/multi-select-input";

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
      .map((i) => {
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
    const updatedFields = visibilityDependentFields.map((item, i) =>
      i === index ? { ...item, [name]: newValue } : item,
    );
    setValue("visibilityDependentFields", updatedFields);
  };

  return (
    <div className="visibility-editor">
      <label className="label">Select Dependent Fields</label>

      <MultiSelectInput
        element={{
          options: questionData,
          id: "visibilityDependentFields",
          value: watch("visibilityDependentFields"),
        }}
        validationData={{ register, setValue, trigger, watch }}
      />

      {visibilityDependentFields.length > 0 && (
        <div className="py-1 bg-gray-100 rounded dependent-fields">
          {visibilityDependentFields.map((field, index) => (
            <div key={field.id} className="dependent-field">
              {/* Field label */}
              <input
                type="text"
                value={field.label}
                readOnly
                disabled
                className="field-label"
              />

              {/* Field type */}
              <div className="field-listbox min-w-[100px]">
                <Listbox
                  value={field.fieldType}
                  onChange={(val) => handleValueChange(index, "fieldType", val)}
                >
                  <div className="listbox-wrapper">
                    <Listbox.Button className="listbox-button">
                      {field.fieldType}
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options
                        className="listbox-options "
                        anchor="bottom"
                      >
                        {fieldTypes.map((type) => (
                          <Listbox.Option
                            key={type}
                            value={type}
                            className="listbox-option"
                          >
                            {type}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Operator */}
              <div className="field-listbox min-w-[100px]">
                <Listbox
                  value={field.operator}
                  onChange={(val) => handleValueChange(index, "operator", val)}
                >
                  <div className="listbox-wrapper">
                    <Listbox.Button className="listbox-button">
                      {field.operator.replace("_", " ")}
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options
                        className="listbox-options "
                        anchor="bottom"
                      >
                        {(field.fieldType === "number"
                          ? [...operators, ...numberOperators]
                          : operators
                        ).map((op) => (
                          <Listbox.Option
                            key={op}
                            value={op}
                            className="listbox-option"
                          >
                            {op.replace("_", " ")}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Field value */}
              {field.fieldType !== "boolean" ? (
                <input
                  type={field.fieldType}
                  value={field.fieldValue || ""}
                  onChange={(e) =>
                    handleValueChange(index, "fieldValue", e.target.value)
                  }
                  placeholder="Value"
                  className="field-value"
                />
              ) : (
                <div className="field-listbox">
                  <Listbox
                    value={field.fieldValue ?? ""}
                    onChange={(val) =>
                      handleValueChange(index, "fieldValue", val)
                    }
                  >
                    <div className="listbox-wrapper">
                      <Listbox.Button className="listbox-button">
                        {field.fieldValue === true
                          ? "True"
                          : field.fieldValue === false
                            ? "False"
                            : "Select value"}
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options
                          className="listbox-options "
                          anchor="bottom"
                        >
                          <Listbox.Option
                            value={true}
                            className="listbox-option"
                          >
                            True
                          </Listbox.Option>
                          <Listbox.Option
                            value={false}
                            className="listbox-option"
                          >
                            False
                          </Listbox.Option>
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
