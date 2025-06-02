import React, { useState, useEffect, useCallback } from "react";
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
  allowValue,
} from "../../utils/contants";

import CustomSelect from "../CustomSelect";
import TableInputColumn from "../TableInputColumns";
import ApiExample from "../ApiExample";
import { getItem } from "../../utils/localStorageControl";
import axios from "axios";
import { toast } from "react-toastify";
import OptionsExample from "../OptionsExample";
import FileReaderComponent from "../FileReaderComponent";
import ColumnExample from "../ColumnExample";

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
  heading?: string;
  columns?: number;
  minAmountMessage?: string;
  value?: any;
  customClass?: string;
  elementClass?: string;
}

const schema = yup.object().shape({
  inputLabel: yup.string().nullable(),
  placeholder: yup.string().nullable(),
  description: yup.string().nullable(),
  isReadOnly: yup.boolean(),
  isDisabled: yup.boolean(),
  isRequired: yup.boolean(),
  requiredMessage: yup.string().nullable(),
  minLengthMessage: yup.string().nullable(),
  maxLengthMessage: yup.string().nullable(),
  maxLength: yup.number().typeError("Expecting a number").nullable(),
  minLength: yup.number().typeError("Expecting a number").nullable(),
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
    .when("inputType", {
      is: (inputType: string) => ["radio", "checkbox"].includes(inputType),
      then: (schema) =>
        schema.required("Options are required for radio or checkbox inputs"),
      otherwise: (schema) => schema.nullable(),
    }),
  prefix: yup.string().nullable(),
  url: yup.string().nullable(),
  method: yup.string().nullable(),
  denominators: yup.mixed().nullable(),
  responseType: yup.string().nullable(),
  minAmount: yup.string().nullable(),
  heading: yup.string().nullable(),
  minAmountMessage: yup.string().nullable(),
  columns: yup.number().nullable(),
  value: yup.mixed().nullable(),
  customClass: yup.string().nullable(),
  elementClass: yup.string().nullable(),
  apiUrl: yup.string().nullable(),
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
type optionType = "manual" | "api" | "sheet";
const ElementEditorModal: React.FC<ElementEditorModalProps> = ({
  isOpen,
  onClose,
  element,
}) => {
  const filteredTabs = tabs.filter(
    (tab) =>
      !noAllowValidation.includes(element.inputType) || tab.key !== "validation"
  );
  const { updateElement }: any = React.useContext(EditorContext);
  const [activeTab, setActiveTab] = useState("basic");
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionTypes, setOptionTypes] = useState<optionType>("manual");
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
  const values = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const {
    fields: dataFields,
    append: columnAppend,
    remove: columnRemove,
  } = useFieldArray({
    control,
    name: "dataColumns",
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

  // Fetch options from api

  const fetchOptions = useCallback(async () => {
    if (!values.apiUrl || !/^https?:\/\//.test(values.apiUrl)) {
      toast.info("Please provide a valid API URL");
      return;
    }

    try {
      setOptionsLoading(true);

      const { status, data } = await axios.get(values.apiUrl);

      if (status !== 200 || !data) {
        toast.error("Unexpected response from server.");
        return;
      }

      // Try multiple possible response shapes
      const options = data.data || data.record || data.result;

      if (!Array.isArray(options)) {
        toast.error("Expected an array in response (data, record, or result).");
        return;
      }

      // Determine where to set the data
      if (element.type?.toLowerCase() === "datagrid") {
        setValue("dataColumns", options);
      } else {
        setValue("options", options);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load options";
      toast.error(message);
    } finally {
      setOptionsLoading(false);
    }
  }, [element.type, setValue, values.apiUrl]);

  useEffect(() => {
   if(optionTypes=== 'api'){
     fetchOptions();
   }
  }, [fetchOptions, optionTypes, values.apiUrl]);
  const OptionsTypes = ["manual", "api", "sheet"];

  // Options field rendering
  const renderOptionsFields = () => (
    <div className="flex flex-col gap-y-1 justify-start">
      <div className="flex gap-x-5 items-center mb-4">
        {OptionsTypes.map((i) => (
          <label key={i} className="text-base items-center gap-x-3 capitalize">
            <input
              type="radio"
              name="optionType"
              onChange={(e) => setOptionTypes(e.target.value as optionType)}
              value={i}
            />{" "}
            <span>{i} options</span>
          </label>
        ))}
      </div>
      {optionTypes === "api" && (
        <div className="mb-4">
          {/* Load options from api  */}
          <div className="flex items-center relative w-full mb-2">
            <DynamicInput
              label="Load Options from Api"
              name="apiUrl"
              errors={errors}
              register={register}
              className="!w-full"
              placeholder="https://example.com/options"
              isFloating
            />

            {optionsLoading && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin absolute right-3 top-1/2 mt-1"></div>
            )}
          </div>
          <OptionsExample />
        </div>
      )}
      {optionTypes === "sheet" && (
        <div className="mb-4">
          <FileReaderComponent
            isFloating
            label="Load options form sheet (csv, xlsx)"
            setValue={setValue}
            name="options"
          />
        </div>
      )}
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
            disabled={fields.length === 1}
            type="button"
            className="outline-none hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
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

  // useEffect(() => {
  //   setOptionTypes("api");
  // }, [element.type]);

  // Options field rendering
  const renderColumnsFields = () => (
    <div className="flex flex-col gap-y-1 justify-start">
      <div className="flex gap-x-5 items-center mb-4">
        {OptionsTypes.map((i) => (
          <label key={i} className="text-base items-center gap-x-3 capitalize">
            <input
              type="radio"
              name="optionType"
              onChange={(e) => setOptionTypes(e.target.value as optionType)}
              value={i}
              checked={i === optionTypes}
            />{" "}
            <span>{i} options</span>
          </label>
        ))}
      </div>
      {optionTypes === "api" && (
        <div className="mb-4">
          {/* Load options from api  */}
          <div className="flex items-center relative w-full mb-2">
            <DynamicInput
              label="Load Columns from Api"
              name="apiUrl"
              errors={errors}
              register={register}
              className="!w-full"
              placeholder="https://example.com/columns"
              isFloating
            />

            {optionsLoading && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin absolute right-3 top-1/2 mt-1"></div>
            )}
          </div>
          <ColumnExample />
        </div>
      )}
      {optionTypes === "sheet" && (
        <div className="mb-4">
          <FileReaderComponent
            isFloating
            label="Load columns form sheet (csv, xlsx)"
            setValue={setValue}
            name="dataColumns"
          />
        </div>
      )}
      {dataFields.map((field, index) => (
        <div key={field.id} className="flex gap-x-4 items-center ">
          <div className="flex-1">
            <DynamicInput
              label="Field key"
              name={`dataColumns.${index}.field`}
              register={register}
              errors={errors}
              element={element}
              placeholder="Field"
              isFloating
            />
          </div>
          <div className="flex-1">
            <DynamicInput
              label="Header Name"
              name={`dataColumns.${index}.headerName`}
              register={register}
              errors={errors}
              element={element}
              placeholder="headerName"
              isFloating
            />
          </div>
          {/* <div className="flex-1 flex gap-x-3 items-center">
            <label>
              {" "}
              <input type="checkbox" name={`dataColumns.${index}.editable`} />{" "}
              <span>Is Editable</span>
            </label>
          </div> */}
          <button
            disabled={dataFields.length === 1}
            type="button"
            className="outline-none hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => columnRemove(index)}
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
          onClick={() =>
            columnAppend({
              headerName: "",
              field: "",
              editable: true,
              id: uuidv4(),
            })
          }
        >
          <AppIcon icon="qlementine-icons:plus-16" /> Add column
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999] cursor-default no-drag select-none">
      <div className="min-w-[600px] bg-white rounded-xl shadow-xl relative flex flex-col items-center max-h-[80vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="w-full px-6 pt-6 pb-5 flex flex-col items-start gap-4 z-10 mb-6">
          <h2 className="text-lg font-semibold text-[#475467] font-onest">
            {element.label} Options
          </h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="close"
            className="absolute right-4 top-4 p-2 text-[#98A2B3] hover:bg-gray-50 rounded-lg"
          >
            <AppIcon icon="tabler:x" />
          </button>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <TabsComponent
            tabs={filteredTabs}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            className="justify-start !text-left"
            btnClass="!uppercase !text-left"
          />
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className=" max-h-[800px] overflow-y-auto">
            {activeTab === "basic" && (
              <div className="w-full px-6 flex flex-col gap-5 z-10">
                {allowValue.includes(element.inputType) && (
                  <>
                    <DynamicInput
                      label="Value"
                      name="value"
                      register={register}
                      errors={errors}
                      element={element}
                    />
                  </>
                )}
                <DynamicInput
                  label="Custom Class"
                  name="customClass"
                  register={register}
                  errors={errors}
                  element={element}
                />
                {/* <DynamicInput
                label="Element Class"
                name="elementClass"
                register={register}
                errors={errors}
                element={element}
              /> */}
                {!allowValue.includes(element.inputType) &&
                  !noAllowValidation.includes(element.inputType) && (
                    <DynamicInput
                      label="Label"
                      name="inputLabel"
                      register={register}
                      errors={errors}
                      element={element}
                    />
                  )}
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
                {!allowValue.includes(element.inputType) &&
                  !noAllowValidation.includes(element.inputType) && (
                    <DynamicInput
                      label="Short Description"
                      name="description"
                      register={register}
                      errors={errors}
                      element={element}
                    />
                  )}
                {element.type.toLowerCase() === "grid" && (
                  <DynamicInput
                    label="Number of columns"
                    name="columns"
                    register={register}
                    errors={errors}
                    element={element}
                  />
                )}
                {element.type.toLowerCase() === "datagrid" &&
                  renderColumnsFields()}
                {AllowOptions.includes(element.inputType) &&
                  renderOptionsFields()}
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
          </div>
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
