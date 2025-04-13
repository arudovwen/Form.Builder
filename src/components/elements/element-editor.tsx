import React, { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppIcon from "../ui/AppIcon";
import TabsComponent from "../ui/AppTab";
import { DynamicInput } from "../forms/dynamic-input";
import EditorContext from "../../context/editor-context";
import { v4 as uuidv4 } from "uuid";
import {
  AllowOptions,
  AllowValidationAmount,
  AllowValidationMaxMin,
  AllowValidationPlaceholder,
  AllowValidationPrefix,
  noAllowValidation,
  AllowApiOptions,
  AllowTableOptions,
} from "../../utils/contants";

import CustomSelect from "../CustomSelect";
import TableInputColumn from "../TableInputColumns";
import ApiExample from "../ApiExample";
import { getItem } from "../../utils/localStorageControl";

interface Option {
  label: string;
  value: string;
  id?: string;
}

interface FormInputs {
  inputLabel: string;
  placeholder?: string;
  description?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  requiredMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  maxLength?: number;
  minLength?: number;
  inputType?: string;
  maxAmountMessage?: string;
  maxAmount?: string;
  options?: Option[];
  prefix?: string;
  url?: string;
  method?: string;
  minAmount?: string;
  denominators?: any;
  responseType?: string;
}

const schema = yup.object().shape({
  inputLabel: yup.string().required("Label is required"),
  placeholder: yup.string().nullable(),
  description: yup.string().nullable(),
  isReadOnly: yup.boolean(),
  isDisabled: yup.boolean(),
  isRequired: yup.boolean(),
  requiredMessage: yup.string().nullable(),
  minLengthMessage: yup.string().nullable(),
  maxLengthMessage: yup.string().nullable(),
  maxLength: yup.number().nullable(),
  minLength: yup.number().nullable(),
  inputType: yup.string().nullable(),
  maxAmountMessage: yup.string().nullable(),
  maxAmount: yup.string().nullable(),
  options: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().nullable(),
        value: yup.string().when("label", {
          is: (label: string) => label && label.length > 0,
          then: (schema) =>
            schema.required("Value is required when label is present"),
          otherwise: (schema) => schema.nullable(),
        }),
      })
    )
    .nullable(),
  prefix: yup.string().nullable(),
  url: yup.string().nullable(),
  method: yup.string().nullable(),
  denominators: yup.mixed().nullable(),
  responseType: yup.string().nullable(),
  minAmount: yup.string().nullable(),
});

const tabs = [
  { title: "Basics", key: "basic" },
  { title: "Validations", key: "validation" },
];

interface ElementEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  element: any;
}

const ElementEditorModal: React.FC<ElementEditorModalProps> = ({
  isOpen,
  onClose,
  element,
}) => {
  const { updateElement }: any = React.useContext(EditorContext);
  const [activeTab, setActiveTab] = useState("basic");
  const config = getItem("config");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...element,
      options: element.options || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (values: FormInputs) => {
    updateElement(values, element.sectionId);
    onClose();
  };

  // Options field rendering
  const renderOptionsFields = () => (
    <div className="flex flex-col gap-y-1 justify-start">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-x-4 items-center ">
          <div className="flex-1">
            <DynamicInput
              label="Label"
              name={`options.${index}.label`}
              register={register}
              errors={errors}
              element={element}
              placeholder="Label"
              isFloating
            />
          </div>
          <div className="flex-1">
            <DynamicInput
              label="Value"
              name={`options.${index}.value`}
              register={register}
              errors={errors}
              element={element}
              placeholder="Value"
              isFloating
            />
          </div>{" "}
          <button
            type="button"
            className="outline-none hover:opacity-80"
            onClick={() => remove(index)}
          >
            <AppIcon icon="iconamoon:sign-times-fill" />
          </button>
        </div>
      ))}
      <div>
        {" "}
        <button
          type="button"
          className="mt-2  text-gray-700 font-medium text-sm  flex gap-x-1 items-center"
          onClick={() => append({ label: "", value: "", id: uuidv4() })}
        >
          <AppIcon icon="qlementine-icons:plus-16" /> Add Option
        </button>
      </div>
    </div>
  );

  // Rest of your component remains the same
  // ... (keeping the same JSX structure for the form)

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999] cursor-default no-drag select-none">
      <div className="min-w-[600px] bg-white rounded-xl shadow-xl relative flex flex-col items-center">
        {/* Header */}
        <div className="w-full px-6 pt-6 pb-5 flex flex-col items-start gap-4 z-10 mb-6">
          <h2 className="text-lg font-semibold text-[#475467] font-onest">
            {element.label}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-[#98A2B3] hover:bg-gray-50 rounded-lg"
          >
            <AppIcon icon="tabler:x" />
          </button>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <TabsComponent
            tabs={tabs}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            className="justify-start !text-left"
            btnClass="!uppercase !text-left"
          />
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {activeTab === "basic" && (
            <div className="w-full px-6 flex flex-col gap-5 z-10">
              <DynamicInput
                label="Label"
                name="inputLabel"
                register={register}
                errors={errors}
                element={element}
              />
              {AllowValidationPlaceholder.includes(element.inputType) && (
                <DynamicInput
                  label="Placeholder"
                  name="placeholder"
                  register={register}
                  errors={errors}
                  element={element}
                />
              )}
              {AllowValidationPrefix.includes(element.inputType) && (
                <DynamicInput
                  label="Prefix"
                  name="prefix"
                  register={register}
                  errors={errors}
                  element={element}
                />
              )}
              {AllowApiOptions.includes(element.inputType) && (
                <>
                <ApiExample />
                  <DynamicInput
                    label="Api Url"
                    name="url"
                    register={register}
                    errors={errors}
                    element={element}
                  />
                  <CustomSelect
                    label="Api Method"
                    options={[
                      {
                        label: "GET",
                        value: "GET",
                      },
                      {
                        label: "POST",
                        value: "POST",
                      },
                    ]}
                    register={register}
                    name={"method"}
                    setValue={setValue}
                    trigger={trigger}
                    value={watch("method")}
                  />
                  <CustomSelect
                    label="Api Response type"
                    options={[
                      {
                        label: "String",
                        value: "string",
                      },
                      {
                        label: "Object",
                        value: "object",
                      },
                    ]}
                    register={register}
                    name={"responseType"}
                    setValue={setValue}
                    trigger={trigger}
                    value={watch("responseType")}
                  />
                </>
              )}
              {AllowTableOptions.includes(element.inputType) && (
                <TableInputColumn
                  onChange={(newValues) => {
                    setValue("denominators", newValues);
                  }}
                  value={watch("denominators")}
                />
              )}
              <DynamicInput
                label="Short Description"
                name="description"
                register={register}
                errors={errors}
                element={element}
              />
              {AllowOptions.includes(element.inputType) &&
                renderOptionsFields()}
              {/* Add other basic fields here */}
            </div>
          )}

          {!noAllowValidation.includes(element.type.toLowerCase()) &&
            activeTab === "validation" && (
              <div className="w-full px-6 flex flex-col gap-5 z-10">
                <div className="flex gap-x-6 items-center">
                  <div className="w-[150px]">
                    <DynamicInput
                      label="Required"
                      name="isRequired"
                      register={register}
                      errors={errors}
                      element={element}
                      type="checkbox"
                    />
                  </div>{" "}
                  <div className="flex-1">
                    <DynamicInput
                      label="Error message text"
                      name="requiredMessage"
                      register={register}
                      errors={errors}
                      element={element}
                    />
                  </div>
                </div>
                {AllowValidationMaxMin.includes(element.inputType) && (
                  <>
                    <div className="flex gap-x-6 items-center">
                      <div className="w-[150px]">
                        <DynamicInput
                          label="Min Length"
                          name="minLength"
                          register={register}
                          errors={errors}
                          element={element}
                          type="number"
                        />
                      </div>{" "}
                      <div className="flex-1">
                        <DynamicInput
                          label="Error message text"
                          name="minLengthMessage"
                          register={register}
                          errors={errors}
                          element={element}
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-6 items-center">
                      <div className="w-[150px]">
                        <DynamicInput
                          label="Max Length"
                          name="maxLength"
                          register={register}
                          errors={errors}
                          element={element}
                          type="number"
                        />
                      </div>{" "}
                      <div className="flex-1">
                        <DynamicInput
                          label="Error message text"
                          name="maxLengthMessage"
                          register={register}
                          errors={errors}
                          element={element}
                        />
                      </div>
                    </div>
                  </>
                )}
                {AllowValidationAmount.includes(element.inputType) && (
                  <>
                    <div className="flex gap-x-6 items-center">
                      <div className="w-[150px]">
                        <DynamicInput
                          label="Min Amount"
                          name="minAmount"
                          register={register}
                          errors={errors}
                          element={element}
                          type="amount"
                        />
                      </div>{" "}
                      <div className="flex-1">
                        <DynamicInput
                          label="Error message text"
                          name="minAmountMessage"
                          register={register}
                          errors={errors}
                          element={element}
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-6 items-center">
                      <div className="w-[150px]">
                        <DynamicInput
                          label="Max Amount"
                          name="maxAmount"
                          register={register}
                          errors={errors}
                          element={element}
                          type="amount"
                        />
                      </div>{" "}
                      <div className="flex-1">
                        <DynamicInput
                          label="Error message text"
                          name="maxAmountMessage"
                          register={register}
                          errors={errors}
                          element={element}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

          {/* Actions */}
          <div className="w-full px-6 pt-8 pb-6 flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-[#D0D5DD] rounded-lg shadow-xs font-semibold text-[#344054] font-onest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              style={{ background: config?.buttonColor || "#333" }}
              className={`flex-1 px-4 py-2.5 ${
                !isValid || isSubmitting ? "bg-[#F2F4F7]" : "bg-[#2563EB]"
              } ${
                !isValid || isSubmitting ? "text-[#98A2B3]" : "text-white"
              } rounded-lg shadow-xs font-semibold font-onest disabled:opacity-50`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElementEditorModal;
