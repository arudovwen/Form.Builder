import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";
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
  AllowValueSource,
  dateFormats,
  FileTypes,
} from "../../utils/contants";

import CustomSelect from "../CustomSelect";
import TableInputColumn from "../TableInputColumns";
import ApiExample from "../ApiExample";
import { getItem } from "../../utils/localStorageControl";
import axios from "axios";
import { toast } from "sonner";
import OptionsExample from "../OptionsExample";
import FileReaderComponent from "../FileReaderComponent";
import ColumnExample from "../ColumnExample";
import DocumentSignExample from "../DocumentSign";
import ValidateExample from "../ValidateExample";
import CustomDatePicker from "../CutomDatePicker";
import VisibilityEditor from "./visibility-editor";
import MultiSelectInput from "./multi-select-input";
import { normalizeGridRows, normalizeRows, slugify } from "@/utils/normalizeRows";
import FormulaMentionInput from "./formula-mention-input";
import FileUpload from "../forms/file-uploader";

interface Option {
  label?: string;
  value?: string;
  id?: string;
  key?: string;
  filterValue?: string;
  imageUrl?: string;
}

interface FormInputs {
  inputLabel?: string;
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
  selectType?: string;
  dateType?: string;
  validationUrl?: string;
  signatureLink?: string;
  isMultiple?: boolean;
  acceptedFiles?: any;
  maxFileSize?: number;
  minChecked?: number;
  requireAllChecked?: boolean;
  selectionType?: string;
  minLabel?: string;
  pattern?: string;
  patternMessage?: string;
  filterByFieldId?: string;
  clearOnFilterChange?: boolean;
}

const schema = yup.object().shape({
  inputLabel: yup.string().nullable(),
  minLabel: yup.string().nullable(),
  maxLabel: yup.string().nullable(),
  placeholder: yup.string().nullable(),
  description: yup.string().nullable(),
  isReadOnly: yup.boolean(),
  isDisabled: yup.boolean(),
  isRequired: yup.boolean(),
  requiredMessage: yup.string().nullable(),
  minLengthMessage: yup.string().nullable(),
  maxLengthMessage: yup.string().nullable(),
  pattern: yup.string().nullable(),
  patternMessage: yup.string().nullable(),
  maxLength: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    )
    .typeError("Expecting a number")
    .nullable(),
  minLength: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    )
    .typeError("Expecting a number")
    .nullable(),
  minChecked: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    )
    .typeError("Expecting a number")
    .nullable(),
  requireAllChecked: yup.boolean(),
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
        id: yup.string().nullable(),
        key: yup.string().nullable(),
        filterValue: yup.string().nullable(),
        imageUrl: yup.string().nullable(),
      }),
    )
    .when("inputType", {
      is: (inputType: string) => ["radio", "checkbox"].includes(inputType),
      then: (schema) =>
        schema.required("Options are required for radio or checkbox inputs"),
      otherwise: (schema) => schema.nullable(),
    }),
  options1: yup
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
        id: yup.string().nullable(),
        key: yup.string().nullable(),
        filterValue: yup.string().nullable(),
      }),
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
  columns: yup.number().nullable().max(4).min(2),
  value: yup.mixed().nullable(),
  customClass: yup.string().nullable(),
  elementClass: yup.string().nullable(),
  apiUrl: yup.string().nullable(),
  selectType: yup.string().default("list"),
  selectionType: yup.string().nullable().default("multiple"),
  dateType: yup.string().default("basic"),
  validationUrl: yup.string(),
  signatureLink: yup.string(),
  minDate: yup.string().nullable(),
  maxDate: yup.string().nullable(),
  canHaveDateRange: yup.boolean(),
  allowYearPicker: yup.boolean(),
  is24Hour: yup.boolean(),
  isHidden: yup.boolean(),
  visibilityDependentFields: yup.array().nullable(),
  isMultiple: yup.boolean(),
  acceptedFiles: yup.array(),
  maxFileSize: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    )
    .typeError("Expecting a number")
    .nullable(),
  showState: yup.boolean(),
  formula: yup.string().nullable(),
  fetchExternalResults: yup.boolean(),
  externalApiUrl: yup.string().nullable(),
  valueSource: yup.string().nullable(),
  sourceFieldId: yup.string().nullable(),
  filterByFieldId: yup.string().nullable(),
  clearOnFilterChange: yup.boolean(),
});

const tabs = [
  { title: "Configurations", key: "basic", icon: "solar:tuning-2-bold-duotone" },
  { title: "Validations", key: "validation", icon: "solar:shield-check-bold-duotone" },
  { title: "Conditional Logic", key: "logic", icon: "solar:branching-paths-up-bold-duotone" },
  { title: "Data & Code", key: "advanced", icon: "solar:code-bold-duotone" },
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
      !noAllowValidation.includes(element.inputType) ||
      tab.key !== "validation",
  );
  const { updateElement, formData, deleteMode, mode = "edit" }: any =
    React.useContext(EditorContext);
  const [activeTab, setActiveTab] = useState("basic");
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionTypes, setOptionTypes] = useState<optionType>("manual");

  const fieldCount =
    formData
      ?.filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
      ?.flatMap((section: any) => section?.formData || [])
      ?.filter((f: any) => !f?.isFieldDeleted && !f?.isDeleted)?.length || 0;

  const mentionData = React.useMemo(() => {
    return (
      formData
        ?.filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
        ?.flatMap((section: any) => section?.formData || [])
        .filter(
          (f: any) =>
            !f?.isFieldDeleted &&
            !f?.isDeleted &&
            f.id !== element?.id &&
            !["spacer", "divider", "section", "grid"].includes(
              f.type?.toLowerCase(),
            ),
        )
        .map((f: any) => ({
          id: f.id,
          display: f.inputLabel || f.label || "Unnamed",
        })) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldCount, element?.id]);

  const availableFilterFields = React.useMemo(() => {
    return (
      formData
        ?.filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
        ?.flatMap((section: any) => section?.formData || [])
        .filter(
          (f: any) =>
            !f?.isFieldDeleted &&
            !f?.isDeleted &&
            f.id !== element?.id &&
            !["spacer", "divider", "section", "grid"].includes(
              f.type?.toLowerCase(),
            ),
        ) || []
    );
  }, [fieldCount, element?.id, formData]);

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
      selectionType: element.selectionType || "multiple",
      options: element.options || [],
      visibilityDependentFields: element.visibilityDependentFields || [],
      filterByFieldId: element.filterByFieldId || "",
      clearOnFilterChange: element.clearOnFilterChange ?? true,
    },
  });
  const values = watch();

  const selectedFilterField = React.useMemo(() => {
    const filterId = values.filterByFieldId;
    if (!filterId) return null;
    return availableFilterFields.find((f: any) => f.id === filterId);
  }, [values.filterByFieldId, availableFilterFields]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const {
    fields: fields1,
    append: append1,
    remove: remove1,
  } = useFieldArray({
    control,
    name: "options1",
  });

  const {
    fields: dataFields,
    append: columnAppend,
    remove: columnRemove,
  } = useFieldArray({
    control,
    name: "dataColumns",
  });

  // Track initial IDs of columns/options that already existed when modal opened
  const initialDataColumnIdsRef = useRef<Set<string>>(new Set());
  const initialOptionIdsRef = useRef<Set<string>>(new Set());
  const initialOption1IdsRef = useRef<Set<string>>(new Set());

  // Track row IDs where the user has manually edited the field key or option value
  const manuallyEditedColumnsRef = useRef<Set<string>>(new Set());
  const manuallyEditedOptionsRef = useRef<Set<string>>(new Set());
  const manuallyEditedOptions1Ref = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      initialDataColumnIdsRef.current = new Set(
        (element?.dataColumns || [])
          .map((c: any) => c.id || c.field)
          .filter(Boolean),
      );
      initialOptionIdsRef.current = new Set(
        (element?.options || [])
          .map((o: any) => o.id || o.value)
          .filter(Boolean),
      );
      initialOption1IdsRef.current = new Set(
        (element?.options1 || [])
          .map((o: any) => o.id || o.value)
          .filter(Boolean),
      );
      manuallyEditedColumnsRef.current.clear();
      manuallyEditedOptionsRef.current.clear();
      manuallyEditedOptions1Ref.current.clear();
    }
  }, [isOpen, element]);

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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOptions = useCallback(async () => {
    if (!values.apiUrl || !/^https?:\/\//.test(values.apiUrl)) {
      toast.info("Please provide a valid API URL");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setOptionsLoading(true);

      const token = getItem("token");
      const axiosconfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
        defaultMessage: "Unable to load options",
      } as any;

      const { status, data } = await axios.get(values.apiUrl, axiosconfig);

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
        setValue("dataColumns", normalizeGridRows(options));
      } else {
        setValue("options", normalizeRows(options));
      }
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        console.error(error);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setOptionsLoading(false);
      }
    }
  }, [element.type, setValue, values.apiUrl]);

  const OptionsTypes = ["manual", "api", "sheet"];

  function loadApi() {
    if (optionTypes === "api") {
      fetchOptions();
    }
  }
  // Options field rendering
  // Options field rendering
  const renderOptionsFields = () => (
    <div className="flex flex-col justify-start gap-y-1">
      {/* Cascading / Dependent Option Filter Configuration */}
      {element.type?.toLowerCase() !== "cascadeselect" && (
        <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <AppIcon
              icon="material-symbols:filter-alt-outline"
              iconClass="text-lg text-[#6366f1]"
            />
            <h4 className="text-sm font-semibold text-gray-800">
              Filter Options by Field (Cascading Options)
            </h4>
          </div>
          <p className="text-xs text-gray-500">
            Dynamically filter which options appear in this field based on the selected value of another field in the form.
          </p>

          <CustomSelect
            label="Parent / Source Field"
            options={[
              { label: "None (Show all options)", value: "" },
              ...availableFilterFields.map((f: any) => ({
                label: `${f.inputLabel || f.label || f.id} (${f.type})`,
                value: f.id,
              })),
            ]}
            register={register}
            name="filterByFieldId"
            setValue={setValue}
            trigger={trigger}
            value={watch("filterByFieldId") || ""}
          />

          {Boolean(watch("filterByFieldId")) && (
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <DynamicInput
                  watch={watch}
                  label="Clear selection when parent field value changes"
                  name="clearOnFilterChange"
                  register={register}
                  errors={errors}
                  element={element}
                  type="checkbox"
                  value={values.clearOnFilterChange}
                />
              </div>

              {selectedFilterField?.options &&
                selectedFilterField.options.length > 0 && (
                  <div className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700 block mb-1">
                      Parent field available options (click/copy values below):
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedFilterField.options.map((pOpt: any) => (
                        <span
                          key={pOpt.id || pOpt.value}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200"
                          title={`Value: ${pOpt.value}`}
                        >
                          {pOpt.label}: <strong className="ml-1 text-[#6366f1]">{pOpt.value}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          Options Source
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: "manual", label: "Manual Options", icon: "fluent:edit-16-regular" },
            { id: "api", label: "API Endpoint", icon: "lucide:globe" },
            { id: "sheet", label: "Sheet (CSV/XLSX)", icon: "tabler:file-spreadsheet" },
          ].map((item) => {
            const isSelected = optionTypes === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOptionTypes(item.id as optionType)}
                className={clsx(
                  "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer select-none",
                  isSelected
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                )}
              >
                <AppIcon
                  icon={item.icon}
                  iconClass={clsx(
                    "text-sm transition-colors shrink-0",
                    isSelected ? "text-blue-600" : "text-slate-400"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {optionTypes === "api" && (
        <div className="mb-4">
          {/* Load options from api  */}
          <div className="flex items-center gap-x-2">
            <div className="relative flex items-center w-full mb-2">
              <DynamicInput
                watch={watch}
                label="Load Options from Api"
                name="apiUrl"
                errors={errors}
                register={register}
                className="!w-full"
                placeholder="https://example.com/options"
                isFloating
              />

              {optionsLoading && (
                <div className="absolute w-4 h-4 mt-1 border-2 border-blue-500 rounded-full border-t-transparent animate-spin right-3 top-1/2"></div>
              )}
            </div>
            {!(
              element.type === "multiSelect" || element.type === "selectField"
            ) && (
              <button
                onClick={loadApi}
                className="px-3 py-1 text-xs text-white bg-gray-600 rounded"
                type="button"
              >
                Load
              </button>
            )}
          </div>
          {element.type === "multiSelect" || element.type === "selectField" ? (
            <p className="text-xs text-blue-500 mb-2">
              Options will be loaded dynamically at runtime.
            </p>
          ) : (
            <OptionsExample />
          )}
        </div>
      )}
      {optionTypes === "sheet" && (
        <div className="mb-4">
          <FileReaderComponent
            type={element.type}
            label="Load options form sheet (csv, xlsx)"
            setValue={setValue}
            name="options"
          />
        </div>
      )}
      {optionTypes === "manual" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-500 font-semibold">
              {element?.type?.toLowerCase() === "matrix"
                ? "Rows Options"
                : "Parent Options"}
            </h3>
            {Boolean(watch("filterByFieldId")) && (
              <span className="text-[11px] text-gray-400">
                Options without a Filter Value are always visible.
              </span>
            )}
          </div>
          {fields?.map((field, index) => (
            <div
              key={field.id}
              className="mb-3 pb-3 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0"
            >
              <div className="flex items-start gap-x-4">
                <div className="flex-1">
                  <DynamicInput
                    watch={watch}
                    label={index === 0 ? "Label" : ""}
                    name={`options.${index}.label`}
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="Label"
                    onChange={(e) => {
                      const text = e.target.value;
                      const optId = values.options?.[index]?.id || field.id;
                      const isExisting =
                        initialOptionIdsRef.current.has(optId) ||
                        Boolean(element.options?.[index]?.value);

                      const shouldAutoUpdate =
                        mode === "create" ||
                        (!isExisting &&
                          !manuallyEditedOptionsRef.current.has(optId));

                      if (shouldAutoUpdate) {
                        setValue(`options.${index}.value`, slugify(text), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <DynamicInput
                    watch={watch}
                    label={index === 0 ? "Value" : ""}
                    name={`options.${index}.value`}
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="Value"
                    onChange={() => {
                      const optId = values.options?.[index]?.id || field.id;
                      manuallyEditedOptionsRef.current.add(optId);
                    }}
                  />
                </div>

                {Boolean(watch("filterByFieldId")) && (
                  <div className="flex-1">
                    <DynamicInput
                      watch={watch}
                      label={index === 0 ? "Filter Value" : ""}
                      name={`options.${index}.filterValue`}
                      register={register}
                      errors={errors}
                      element={element}
                      placeholder="Parent Value"
                      onChange={(e) => {
                        setValue(`options.${index}.key`, e.target.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </div>
                )}

                <button
                  disabled={fields.length === 1}
                  type="button"
                  className={`outline-none hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed ${
                    index === 0 ? "mt-[34px]" : "mt-[10px]"
                  }`}
                  onClick={() => remove(index)}
                >
                  <AppIcon
                    icon="iconamoon:sign-times-fill"
                    iconClass="text-gray-400 hover:text-red-500 text-lg transition-colors"
                  />
                </button>
              </div>

              {element.inputType === "imageChoice" && (
                <div className="mt-3 pr-[36px]">
                  {index === 0 && (
                    <label className="block text-sm font-medium text-[#344054] font-onest mb-1.5">
                      Image Upload
                    </label>
                  )}
                  <div className="flex gap-2">
                    <FileUpload
                      multiple={false}
                      accept={[
                        { value: "image/*", label: "All Images" },
                        { value: "image/jpeg", label: "JPEG" },
                        { value: "image/png", label: "PNG" },
                        { value: "image/gif", label: "GIF" },
                        { value: "image/webp", label: "WebP" },
                        { value: "image/svg+xml", label: "SVG" },
                      ]}
                      onFileLoaded={(files) => {
                        if (files && files.length > 0) {
                          setValue(
                            `options.${index}.imageUrl`,
                            files[0].base64,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          );
                        } else {
                          setValue(`options.${index}.imageUrl`, "", {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }
                      }}
                      list={
                        watch(`options.${index}.imageUrl`)
                          ? [
                              {
                                base64: watch(`options.${index}.imageUrl`),
                                name: "Uploaded Image",
                                type: "image",
                              },
                            ]
                          : []
                      }
                    />
                    <div className="flex-1 hidden">
                      <DynamicInput
                        watch={watch}
                        label=""
                        name={`options.${index}.imageUrl`}
                        register={register}
                        errors={errors}
                        element={element}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}{" "}
          <div>
            {" "}
            <button
              type="button"
              className="flex items-center mt-2 text-sm font-medium text-gray-700 gap-x-1"
              onClick={() =>
                append({
                  label: "",
                  value: "",
                  filterValue: "",
                  key: "",
                  id: uuidv4(),
                })
              }
            >
              <AppIcon icon="qlementine-icons:plus-16" /> Add Option
            </button>
          </div>
        </div>
      )}
      {["cascadeselect", "matrix"].includes(element.type.toLowerCase()) && (
        <>
          <hr className="my-5" />
          <div>
            {" "}
            <h3 className="mb-4 text-sm text-gray-500 font-semibold">
              {element?.type?.toLowerCase() === "matrix"
                ? "Columns Options"
                : "Child Options"}
            </h3>
            {fields1?.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center mb-1 gap-x-4 last:mb-0"
              >
                <div className="flex-1">
                  <DynamicInput
                    watch={watch}
                    label={index === 0 ? "Label" : ""}
                    name={`options1.${index}.label`}
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="Label"
                    onChange={(e) => {
                      const text = e.target.value;
                      const optId = values.options1?.[index]?.id || field.id;
                      const isExisting =
                        initialOption1IdsRef.current.has(optId) ||
                        Boolean(element.options1?.[index]?.value);

                      const shouldAutoUpdate =
                        mode === "create" ||
                        (!isExisting &&
                          !manuallyEditedOptions1Ref.current.has(optId));

                      if (shouldAutoUpdate) {
                        setValue(`options1.${index}.value`, slugify(text), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <DynamicInput
                    watch={watch}
                    label={index === 0 ? "Value" : ""}
                    name={`options1.${index}.value`}
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="Value"
                    onChange={() => {
                      const optId = values.options1?.[index]?.id || field.id;
                      manuallyEditedOptions1Ref.current.add(optId);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <DynamicInput
                    watch={watch}
                    label={index === 0 ? "Key" : ""}
                    name={`options1.${index}.key`}
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="Key"
                  />
                </div>
                <button
                  disabled={fields1.length === 1}
                  type="button"
                  className="outline-none hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => remove1(index)}
                >
                  <AppIcon icon="iconamoon:sign-times-fill" />
                </button>
              </div>
            ))}
            <div>
              {" "}
              <button
                type="button"
                className="flex items-center mt-2 text-sm font-medium text-gray-700 gap-x-1"
                onClick={() =>
                  append1({ label: "", value: "", key: "", id: uuidv4() })
                }
              >
                <AppIcon icon="qlementine-icons:plus-16" /> Add Option
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Options field rendering
  const renderColumnsFields = () => (
    <div className="flex flex-col justify-start gap-y-1">
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          Columns Source
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: "manual", label: "Manual Columns", icon: "fluent:edit-16-regular" },
            { id: "api", label: "API Endpoint", icon: "lucide:globe" },
            { id: "sheet", label: "Sheet (CSV/XLSX)", icon: "tabler:file-spreadsheet" },
          ].map((item) => {
            const isSelected = optionTypes === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOptionTypes(item.id as optionType)}
                className={clsx(
                  "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer select-none",
                  isSelected
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                )}
              >
                <AppIcon
                  icon={item.icon}
                  iconClass={clsx(
                    "text-sm transition-colors shrink-0",
                    isSelected ? "text-blue-600" : "text-slate-400"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {optionTypes === "api" && (
        <div className="mb-4">
          {/* Load options from api  */}
          <div className="flex items-center gap-x-2">
            <div className="relative flex items-center w-full mb-2">
              <DynamicInput
                watch={watch}
                label="Load Columns from Api"
                name="apiUrl"
                errors={errors}
                register={register}
                className="!w-full"
                placeholder="https://example.com/columns"
              />

              {optionsLoading && (
                <div className="absolute w-4 h-4 mt-1 border-2 border-blue-500 rounded-full border-t-transparent animate-spin right-3 top-1/2"></div>
              )}
            </div>{" "}
            <button
              onClick={loadApi}
              className="px-3 py-1 text-xs text-white bg-gray-600 rounded"
              type="button"
            >
              Load
            </button>
          </div>
          <ColumnExample />
        </div>
      )}
      {optionTypes === "sheet" && (
        <div className="mb-4">
          <FileReaderComponent
            type={element.type}
            label="Load columns form sheet (csv, xlsx)"
            setValue={setValue}
            name="dataColumns"
          />
        </div>
      )}
      <div className="grid gap-y-3">
        {dataFields?.map((field, index) => {
          const isFieldDeleted =
            values.dataColumns?.[index]?.isColumnDeleted ||
            values.dataColumns?.[index]?.isFieldDeleted ||
            values.dataColumns?.[index]?.isDeleted ||
            (field as any)?.isColumnDeleted ||
            (field as any)?.isFieldDeleted ||
            (field as any)?.isDeleted;

          if (isFieldDeleted) return null;

          const firstVisibleIndex = dataFields.findIndex((f, idx) => {
            const isDel =
              values.dataColumns?.[idx]?.isColumnDeleted ||
              values.dataColumns?.[idx]?.isFieldDeleted ||
              values.dataColumns?.[idx]?.isDeleted ||
              (f as any)?.isColumnDeleted ||
              (f as any)?.isFieldDeleted ||
              (f as any)?.isDeleted;
            return !isDel;
          });

          const activeDataFieldsCount = dataFields.filter((f, idx) => {
            const isDel =
              values.dataColumns?.[idx]?.isColumnDeleted ||
              values.dataColumns?.[idx]?.isFieldDeleted ||
              values.dataColumns?.[idx]?.isDeleted ||
              (f as any)?.isColumnDeleted ||
              (f as any)?.isFieldDeleted ||
              (f as any)?.isDeleted;
            return !isDel;
          }).length;

          return (
            <div
              key={field.id}
              className="flex flex-col gap-2 border-b border-gray-100 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0"
            >
              <div className="flex items-center gap-x-4">
                <div className="min-w-[140px]">
                  <CustomSelect
                    label={index === firstVisibleIndex ? "Type" : ""}
                    options={[
                      {
                        label: "Text",
                        value: "text",
                      },
                      {
                        label: "Number",
                        value: "number",
                      },
                      {
                        label: "Checkbox",
                        value: "checkbox",
                      },
                      {
                        label: "Select",
                        value: "select",
                      },
                    ]}
                    register={register}
                    name={`dataColumns.${index}.type`}
                    setValue={setValue}
                    trigger={trigger}
                    value={values.dataColumns?.[index]?.type}
                  />
                </div>

                <div className="flex-1">
                  <DynamicInput
                    watch={watch}
                    label={index === firstVisibleIndex ? "Display header" : ""}
                    name={`dataColumns.${index}.headerName`}
                    register={register}
                    onChange={(e) => {
                      const text = e.target.value;
                      const colId = values.dataColumns?.[index]?.id || field.id;
                      const isExisting =
                        initialDataColumnIdsRef.current.has(colId) ||
                        Boolean(element.dataColumns?.[index]?.field);

                      const shouldAutoUpdate =
                        mode === "create" ||
                        (!isExisting &&
                          !manuallyEditedColumnsRef.current.has(colId));

                      if (shouldAutoUpdate) {
                        setValue(`dataColumns.${index}.field`, slugify(text), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                    errors={errors}
                    element={element}
                    placeholder="header"
                  />
                </div>

                <div className="flex-1">
                  <DynamicInput
                    watch={watch}
                    label={index === firstVisibleIndex ? "Field key" : ""}
                    name={`dataColumns.${index}.field`}
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="fieldKey"
                    onChange={() => {
                      const colId = values.dataColumns?.[index]?.id || field.id;
                      manuallyEditedColumnsRef.current.add(colId);
                    }}
                  />
                </div>

                <button
                  disabled={activeDataFieldsCount <= 1}
                  type="button"
                  className="outline-none hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (
                      deleteMode === "isFieldDeleted" ||
                      deleteMode === "isDeleted" ||
                      deleteMode === "soft"
                    ) {
                      setValue(`dataColumns.${index}.isColumnDeleted`, true, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    } else {
                      columnRemove(index);
                    }
                  }}
                >
                  <AppIcon icon="iconamoon:sign-times-fill" />
                </button>
              </div>

              {values.dataColumns?.[index]?.type === "select" && (
                <div className="flex items-center gap-x-4">
                  <div className="flex-1">
                    <DynamicInput
                      watch={watch}
                      label="Options API URL"
                      name={`dataColumns.${index}.optionsUrl`}
                      register={register}
                      errors={errors}
                      element={element}
                      placeholder="https://api.example.com/options"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        {" "}
        <button
          type="button"
          className="flex items-center mt-2 text-sm font-medium text-gray-700 gap-x-1"
          onClick={() =>
            columnAppend({
              headerName: "",
              field: "",
              editable: true,
              id: uuidv4(),
              type: "text",
              validate: false,
            })
          }
        >
          <AppIcon icon="qlementine-icons:plus-16" /> Add column
        </button>
      </div>
    </div>
  );

  const [copiedId, setCopiedId] = useState(false);
  const handleCopyId = () => {
    if (element?.id) {
      navigator.clipboard.writeText(element.id);
      setCopiedId(true);
      toast.success("Field ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const regexPresets = [
    { label: "Email", pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", message: "Must be a valid email address" },
    { label: "URL", pattern: "^https?:\\/\\/.*$", message: "Must be a valid URL starting with http:// or https://" },
    { label: "Numbers only", pattern: "^[0-9]+$", message: "Only numeric digits are allowed" },
    { label: "Alphanumeric", pattern: "^[a-zA-Z0-9]+$", message: "Only letters and numbers are allowed" },
    { label: "Phone", pattern: "^\\+?[0-9\\s\\-()]{7,20}$", message: "Must be a valid phone number" },
  ];

  const modalContent = (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end z-[999] cursor-default animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="w-full sm:w-[580px] lg:w-[680px] xl:w-[740px] bg-white h-full shadow-2xl flex flex-col border-l border-gray-200/90 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-200/80 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
              <AppIcon
                icon={element?.icon || "solar:widget-2-bold-duotone"}
                iconClass="text-xl"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {watch("inputLabel") || element.label || "Element Settings"}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold uppercase tracking-wider border border-indigo-100">
                  {element.type || element.inputType}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="group flex items-center gap-1 text-[11px] font-mono text-gray-500 hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors border border-gray-200/60"
                  title="Click to copy field ID"
                >
                  <span>ID: {element.id}</span>
                  <AppIcon
                    icon={copiedId ? "solar:check-circle-bold" : "lucide:copy"}
                    iconClass={clsx(
                      "text-[10px]",
                      copiedId ? "text-emerald-600" : "text-gray-400 group-hover:text-indigo-600",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Close (Esc)"
          >
            <AppIcon icon="lucide:x" iconClass="text-base" />
          </button>
        </div>

        {/* Modern Segmented Navigation Tabs */}
        <div className="px-6 py-2.5 bg-gray-50/80 border-b border-gray-200/80 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex bg-gray-200/70 p-1 rounded-xl text-xs font-semibold gap-1 min-w-max">
            {filteredTabs.map((tab: any) => {
              const isTabActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all select-none cursor-pointer",
                    isTabActive
                      ? "bg-white text-indigo-600 font-bold shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50",
                  )}
                >
                  <AppIcon
                    icon={tab.icon || "solar:settings-linear"}
                    iconClass={clsx(
                      "text-sm",
                      isTabActive ? "text-indigo-600" : "text-gray-400",
                    )}
                  />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex-1 flex flex-col min-h-0"
          autoComplete="off"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* ── TAB 1: BASIC CONFIGURATIONS ───────────────────────────────── */}
            {activeTab === "basic" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {allowValue.includes(element.inputType) && (
                  <DynamicInput
                    watch={watch}
                    label="Value"
                    name="value"
                    register={register}
                    errors={errors}
                    element={element}
                  />
                )}

                {!allowValue.includes(element.inputType) &&
                  !noAllowValidation.includes(element.inputType) && (
                    <>
                      <DynamicInput
                        watch={watch}
                        label="Field Label"
                        name="inputLabel"
                        register={register}
                        errors={errors}
                        element={element}
                        placeholder="e.g. Full Name"
                      />

                      {element.type.toLowerCase() === "cascadeselect" && (
                        <DynamicInput
                          watch={watch}
                          label="Child Dropdown Label"
                          name="childLabel"
                          register={register}
                          errors={errors}
                          element={element}
                          placeholder="e.g. City / District"
                        />
                      )}

                      {element.inputType === "nps" && (
                        <div className="grid grid-cols-2 gap-3">
                          <DynamicInput
                            watch={watch}
                            label="Low Rating Label"
                            name="minLabel"
                            register={register}
                            errors={errors}
                            element={element}
                            placeholder="Not at all likely"
                          />
                          <DynamicInput
                            watch={watch}
                            label="High Rating Label"
                            name="maxLabel"
                            register={register}
                            errors={errors}
                            element={element}
                            placeholder="Extremely likely"
                          />
                        </div>
                      )}
                    </>
                  )}

                {AllowValidationPlaceholder.includes(element.inputType) && (
                  <DynamicInput
                    watch={watch}
                    label="Placeholder Text"
                    name="placeholder"
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="e.g. Enter details..."
                  />
                )}

                {!allowValue.includes(element.inputType) &&
                  !noAllowValidation.includes(element.inputType) && (
                    <DynamicInput
                      watch={watch}
                      label="Helper Text / Subtext"
                      name="description"
                      register={register}
                      errors={errors}
                      element={element}
                      placeholder="Brief guidance for respondent..."
                    />
                  )}

                {AllowValidationPrefix.includes(element.inputType) && (
                  <DynamicInput
                    watch={watch}
                    label="Prefix / Symbol"
                    name="prefix"
                    register={register}
                    errors={errors}
                    element={element}
                    placeholder="e.g. $, €, #"
                  />
                )}

                {/* Date options */}
                {element.type.toLowerCase() === "date" && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-4">
                    <CustomSelect
                      label="Date Format"
                      options={dateFormats}
                      register={register}
                      name="dateFormat"
                      setValue={setValue}
                      trigger={trigger}
                      value={watch("dateFormat")}
                    />

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-gray-700">Allow Date Range</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(values.canHaveDateRange)}
                        onClick={() => setValue("canHaveDateRange", !values.canHaveDateRange, { shouldDirty: true })}
                        className={clsx(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          values.canHaveDateRange ? "bg-indigo-600" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={clsx(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            values.canHaveDateRange ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    {values?.canHaveDateRange && (
                      <div className="grid grid-cols-2 gap-3">
                        <CustomDatePicker
                          name="minDate"
                          value={values?.minDate}
                          onGetValue={setValue}
                          placeholder="Select min date"
                        />
                        <CustomDatePicker
                          name="maxDate"
                          value={values?.minDate}
                          onGetValue={setValue}
                          placeholder="Select max date"
                          minDate={values?.minDate}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                      <span className="text-xs font-semibold text-gray-700">Allow Year Picker</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(values.allowYearPicker)}
                        onClick={() => setValue("allowYearPicker", !values.allowYearPicker, { shouldDirty: true })}
                        className={clsx(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          values.allowYearPicker ? "bg-indigo-600" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={clsx(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            values.allowYearPicker ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Time 24-hr */}
                {element.type.toLowerCase() === "time" && (
                  <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/80">
                    <span className="text-xs font-semibold text-gray-800">24-Hour Format</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(values.is24Hour)}
                      onClick={() => setValue("is24Hour", !values.is24Hour, { shouldDirty: true })}
                      className={clsx(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        values.is24Hour ? "bg-indigo-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={clsx(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                          values.is24Hour ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                )}

                {/* Country allow states */}
                {element.type.toLowerCase() === "country" && (
                  <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/80">
                    <span className="text-xs font-semibold text-gray-800">Include State / Region Selector</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(values.showState)}
                      onClick={() => setValue("showState", !values.showState, { shouldDirty: true })}
                      className={clsx(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        values.showState ? "bg-indigo-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={clsx(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                          values.showState ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                )}

                {/* Select Type */}
                {element.type.toLowerCase() === "selectfield" && (
                  <CustomSelect
                    label="Dropdown Style"
                    options={[
                      { label: "Standard Dropdown List", value: "list" },
                      { label: "Searchable Combobox", value: "Combobox" },
                    ]}
                    register={register}
                    name="selectType"
                    setValue={setValue}
                    trigger={trigger}
                    value={watch("selectType") || "list"}
                  />
                )}

                {/* Checkbox Selection Mode */}
                {element.type.toLowerCase() === "checkbox" && (
                  <CustomSelect
                    label="Checkbox Mode"
                    options={[
                      { label: "Multiple Checkboxes Allowed", value: "multiple" },
                      { label: "Single Exclusive Check (Radio-style)", value: "single" },
                    ]}
                    register={register}
                    name="selectionType"
                    setValue={setValue}
                    trigger={trigger}
                    value={watch("selectionType") || "multiple"}
                  />
                )}

                {/* Grid columns */}
                {element.type.toLowerCase() === "grid" && (
                  <DynamicInput
                    watch={watch}
                    label="Number of Columns (1 to 4)"
                    name="columns"
                    register={register}
                    errors={errors}
                    element={element}
                    max={4}
                    min={1}
                    type="number"
                  />
                )}

                {/* File Upload settings */}
                {element.type.toLowerCase() === "file" && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800">Allow Multiple Files</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(values.isMultiple)}
                        onClick={() => setValue("isMultiple", !values.isMultiple, { shouldDirty: true })}
                        className={clsx(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          values.isMultiple ? "bg-indigo-600" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={clsx(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            values.isMultiple ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    <MultiSelectInput
                      element={{
                        options: FileTypes,
                        id: "acceptedFiles",
                        value: values?.acceptedFiles,
                      }}
                      validationData={{ register, setValue, trigger, watch }}
                      placeholder="Choose allowed file types"
                    />

                    <DynamicInput
                      watch={watch}
                      label="Max File Size (MB)"
                      name="maxFileSize"
                      register={register}
                      errors={errors}
                      element={element}
                      type="number"
                      placeholder="e.g. 10"
                    />
                  </div>
                )}

                {/* Options field manager */}
                {AllowOptions.includes(element.inputType) && renderOptionsFields()}
              </div>
            )}

            {/* ── TAB 2: VALIDATIONS & RULES ─────────────────────────────────── */}
            {activeTab === "validation" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Required switch */}
                <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Required Question</span>
                      <span className="text-[11px] text-gray-400">Respondent must answer this field before submitting</span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(values.isRequired)}
                      onClick={() => setValue("isRequired", !values.isRequired, { shouldDirty: true })}
                      className={clsx(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        values.isRequired ? "bg-indigo-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={clsx(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                          values.isRequired ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {values.isRequired && (
                    <div className="pt-2 border-t border-gray-200/60">
                      <DynamicInput
                        watch={watch}
                        label="Custom Required Error Message"
                        name="requiredMessage"
                        register={register}
                        errors={errors}
                        element={element}
                        placeholder="e.g. This question is required"
                      />
                    </div>
                  )}
                </div>

                {/* Read Only & Disabled switches */}
                {!["spacer", "divider", "section", "grid"].includes(element.type?.toLowerCase()) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-gray-800 block">Read Only</span>
                        <span className="text-[10px] text-gray-400">Viewable, not editable</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(values.isReadOnly)}
                        onClick={() => setValue("isReadOnly", !values.isReadOnly, { shouldDirty: true })}
                        className={clsx(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          values.isReadOnly ? "bg-indigo-600" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={clsx(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            values.isReadOnly ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-gray-800 block">Disabled</span>
                        <span className="text-[10px] text-gray-400">Inactive on form</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(values.isDisabled)}
                        onClick={() => setValue("isDisabled", !values.isDisabled, { shouldDirty: true })}
                        className={clsx(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          values.isDisabled ? "bg-indigo-600" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={clsx(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            values.isDisabled ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Min / Max Length */}
                {AllowValidationMaxMin.includes(element.inputType) && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Character Length Limits</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DynamicInput
                        watch={watch}
                        label="Min Length"
                        name="minLength"
                        register={register}
                        errors={errors}
                        element={element}
                        type="number"
                        placeholder="e.g. 3"
                      />
                      <DynamicInput
                        watch={watch}
                        label="Max Length"
                        name="maxLength"
                        register={register}
                        errors={errors}
                        element={element}
                        type="number"
                        placeholder="e.g. 100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <DynamicInput
                        watch={watch}
                        label="Min Length Message"
                        name="minLengthMessage"
                        register={register}
                        errors={errors}
                        element={element}
                        placeholder="e.g. Must be at least 3 chars"
                      />
                      <DynamicInput
                        watch={watch}
                        label="Max Length Message"
                        name="maxLengthMessage"
                        register={register}
                        errors={errors}
                        element={element}
                        placeholder="e.g. Cannot exceed 100 chars"
                      />
                    </div>
                  </div>
                )}

                {/* Min / Max Amount */}
                {AllowValidationAmount.includes(element.inputType) && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Numeric / Amount Limits</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DynamicInput
                        watch={watch}
                        label="Min Amount"
                        name="minAmount"
                        register={register}
                        errors={errors}
                        element={element}
                        type="amount"
                        placeholder="e.g. 10"
                      />
                      <DynamicInput
                        watch={watch}
                        label="Max Amount"
                        name="maxAmount"
                        register={register}
                        errors={errors}
                        element={element}
                        type="amount"
                        placeholder="e.g. 50000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <DynamicInput
                        watch={watch}
                        label="Min Amount Message"
                        name="minAmountMessage"
                        register={register}
                        errors={errors}
                        element={element}
                        placeholder="e.g. Minimum amount is 10"
                      />
                      <DynamicInput
                        watch={watch}
                        label="Max Amount Message"
                        name="maxAmountMessage"
                        register={register}
                        errors={errors}
                        element={element}
                        placeholder="e.g. Maximum amount is 50,000"
                      />
                    </div>
                  </div>
                )}

                {/* Min Checked for checkbox / multiselect */}
                {["multiselect", "checkbox"].includes(element.type.toLowerCase()) &&
                  (watch("selectionType") || element.selectionType) !== "single" && (
                    <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Checkbox Selection Constraints</h4>
                      <DynamicInput
                        watch={watch}
                        label="Minimum Options Checked"
                        name="minChecked"
                        register={register}
                        errors={errors}
                        element={element}
                        type="number"
                        placeholder="e.g. 2"
                      />
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                        <div>
                          <span className="text-xs font-semibold text-gray-800 block">Require All Options Checked</span>
                          <span className="text-[10px] text-gray-400">All available options must be marked</span>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={Boolean(values.requireAllChecked)}
                          onClick={() => setValue("requireAllChecked", !values.requireAllChecked, { shouldDirty: true })}
                          className={clsx(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            values.requireAllChecked ? "bg-indigo-600" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={clsx(
                              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                              values.requireAllChecked ? "translate-x-4" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                {/* NEW FEATURE: Custom Regex Pattern Validation */}
                {["textField", "longText", "email", "url", "numberField"].includes(element.type) && (
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AppIcon icon="solar:code-scan-bold-duotone" iconClass="text-indigo-600 text-lg" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">Custom Regex Pattern</h4>
                          <p className="text-[11px] text-gray-500">Validate input against a custom regular expression</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 self-center mr-1">Presets:</span>
                      {regexPresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setValue("pattern", preset.pattern, { shouldDirty: true, shouldValidate: true });
                            setValue("patternMessage", preset.message, { shouldDirty: true, shouldValidate: true });
                          }}
                          className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-700 text-[10px] font-medium shadow-2xs transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <DynamicInput
                      watch={watch}
                      label="Regular Expression Pattern"
                      name="pattern"
                      register={register}
                      errors={errors}
                      element={element}
                      placeholder="e.g. ^[0-9]{5}$"
                    />

                    <DynamicInput
                      watch={watch}
                      label="Pattern Failure Error Message"
                      name="patternMessage"
                      register={register}
                      errors={errors}
                      element={element}
                      placeholder="e.g. Please enter a valid 5-digit postal code"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: CONDITIONAL LOGIC & RULES ───────────────────────────── */}
            {activeTab === "logic" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Initial Visibility Switch */}
                <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Initially Hidden</span>
                      <span className="text-[11px] text-gray-400">
                        Hide this field by default until conditional logic criteria are met
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(values.isHidden)}
                      onClick={() => setValue("isHidden", !values.isHidden, { shouldDirty: true })}
                      className={clsx(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        values.isHidden ? "bg-indigo-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={clsx(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                          values.isHidden ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {values.isHidden && (
                    <div className="pt-3 border-t border-gray-200/70">
                      <VisibilityEditor
                        register={register}
                        setValue={setValue}
                        trigger={trigger}
                        watch={watch}
                        id={element?.id}
                      />
                    </div>
                  )}
                </div>

                {/* Calculated formula */}
                {element.type.toLowerCase() === "calculatedfield" && (
                  <div className="p-4 bg-white rounded-2xl border border-gray-200/80 space-y-3 shadow-xs">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Calculation Formula
                    </label>
                    <p className="text-xs text-gray-400">
                      Type <strong>@</strong> to mention other numeric fields in your calculation (e.g. <code>@Price * @Quantity</code>).
                    </p>
                    <FormulaMentionInput
                      value={watch("formula") || ""}
                      onChange={(val) =>
                        setValue("formula", val, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      fields={mentionData}
                      placeholder="e.g. @Question1 + @Question2"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: DATA & CODE ─────────────────────────────────────────── */}
            {activeTab === "advanced" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Field ID */}
                <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2">
                  <label className="block text-xs font-bold text-gray-900">Unique Field Identifier (ID)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={element.id || ""}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-600 select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <AppIcon icon="lucide:copy" iconClass="text-xs" />
                      <span>{copiedId ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Used for conditional logic, calculations, API submissions, and custom webhook payloads.
                  </p>
                </div>

                {/* Custom CSS Class */}
                <DynamicInput
                  watch={watch}
                  label="Custom CSS Class Name"
                  name="customClass"
                  register={register}
                  errors={errors}
                  element={element}
                  placeholder="e.g. my-custom-field w-full md:w-1/2"
                />

                {/* Value Source */}
                {AllowValueSource.includes(element.inputType) && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                    <CustomSelect
                      label="Value Source"
                      options={[
                        { label: "Manual Input", value: "manual" },
                        { label: "Populate from Another Field", value: "field" },
                      ]}
                      register={register}
                      name="valueSource"
                      setValue={setValue}
                      trigger={trigger}
                      value={watch("valueSource") || "manual"}
                    />
                    {watch("valueSource") === "field" && (
                      <CustomSelect
                        label="Source Field"
                        options={mentionData.map((m: any) => ({
                          label: m.display,
                          value: m.id,
                        }))}
                        register={register}
                        name="sourceFieldId"
                        setValue={setValue}
                        trigger={trigger}
                        value={watch("sourceFieldId")}
                      />
                    )}
                  </div>
                )}

                {/* API Integration for Dynamic Values */}
                {AllowApiOptions.includes(element.inputType) && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                    <ApiExample />
                    <DynamicInput
                      watch={watch}
                      label="API Endpoint URL"
                      name="url"
                      register={register}
                      errors={errors}
                      element={element}
                      placeholder="https://api.example.com/options"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <CustomSelect
                        label="HTTP Method"
                        options={[
                          { label: "GET", value: "GET" },
                          { label: "POST", value: "POST" },
                        ]}
                        register={register}
                        name="method"
                        setValue={setValue}
                        trigger={trigger}
                        value={watch("method") || "GET"}
                      />
                      <CustomSelect
                        label="Response Format"
                        options={[
                          { label: "String Array", value: "string" },
                          { label: "Object Key/Value", value: "object" },
                        ]}
                        register={register}
                        name="responseType"
                        setValue={setValue}
                        trigger={trigger}
                        value={watch("responseType") || "object"}
                      />
                    </div>
                  </div>
                )}

                {/* DataGrid columns */}
                {element.type.toLowerCase() === "datagrid" && renderColumnsFields()}

                {/* Table denominators */}
                {AllowTableOptions.includes(element.inputType) && (
                  <TableInputColumn
                    onChange={(newValues: any) => {
                      setValue("denominators", newValues);
                    }}
                    value={watch("denominators")}
                  />
                )}

                {/* Polling External Results */}
                {element.type.toLowerCase() === "polling" && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800">Fetch Results from External API</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(values.fetchExternalResults)}
                        onClick={() => setValue("fetchExternalResults", !values.fetchExternalResults, { shouldDirty: true })}
                        className={clsx(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          values.fetchExternalResults ? "bg-indigo-600" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={clsx(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            values.fetchExternalResults ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    {values.fetchExternalResults && (
                      <DynamicInput
                        watch={watch}
                        label="External Poll API URL"
                        name="externalApiUrl"
                        register={register}
                        errors={errors}
                        element={element}
                        placeholder="https://api.example.com/poll/results"
                      />
                    )}
                  </div>
                )}

                {/* Document Signing Links */}
                {element.type.toLowerCase() === "document" && (
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                    <DynamicInput
                      watch={watch}
                      label="Document Options URL"
                      name="url"
                      register={register}
                      errors={errors}
                      element={element}
                    />
                    <DynamicInput
                      watch={watch}
                      label="Document Validation URL"
                      name="validationUrl"
                      register={register}
                      errors={errors}
                      element={element}
                    />
                    <DynamicInput
                      watch={watch}
                      label="Signature Page URL"
                      name="signatureLink"
                      register={register}
                      errors={errors}
                      element={element}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-gray-200/80 flex items-center justify-between gap-3 shrink-0">
            <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 text-[10px] bg-gray-100 border border-gray-200 rounded font-mono text-gray-600">Esc</kbd> to close
            </span>
            <div className="flex items-center gap-2.5 ml-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                style={{ background: config?.buttonColor || "#4f46e5" }}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <AppIcon icon="solar:check-circle-bold" iconClass="text-sm" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return document.body
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default ElementEditorModal;
