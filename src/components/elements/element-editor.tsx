import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppIcon from "../ui/AppIcon";
import TabsComponent from "../ui/AppTab";
import { DynamicInput } from "../forms/dynamic-input";
import EditorContext from "../../context/editor-context";
import {
  AllowValidationAmount,
  AllowValidationMaxMin,
  AllowValidationPlaceholder,
  noAllowValidation,
} from "../../utils/contants";

const schema = yup
  .object({
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
  })

  .required();

type FormInputs = yup.InferType<typeof schema>;
const tabs = [
  {
    title: "Basics",
    key: "basic",
  },
  {
    title: "Validations",
    key: "validation",
  },
];
const ElementEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  element: any;
}> = ({ isOpen, onClose, element }) => {
  const { updateElement }: any = React.useContext(EditorContext);

  const [activeTab, setActiveTab] = useState("basic");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: element,
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (value: any) => {
    updateElement(value, element.sectionId);
    onClose();
    console.log("🚀 ~ onSubmit ~ value:", value);
  };
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999] cursor-default no-drag select-none"
    >
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

              <DynamicInput
                label="Short Description"
                name="description"
                register={register}
                errors={errors}
                element={element}
              />
              {element.type === "grid" && (
                <DynamicInput
                  label="No of Grids"
                  name="grid"
                  register={register}
                  errors={errors}
                  element={element}
                />
              )}
              {!noAllowValidation.includes(element.type.toLowerCase()) && (
                <div className="flex gap-x-6 items-center">
                  <DynamicInput
                    label="Read Only"
                    name="isReadOnly"
                    register={register}
                    errors={errors}
                    element={element}
                    type="checkbox"
                  />
                  <DynamicInput
                    label="Disabled"
                    name="isDisabled"
                    register={register}
                    errors={errors}
                    element={element}
                    type="checkbox"
                  />
                </div>
              )}
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
              className={`flex-1 px-4 py-2.5 ${
                !isValid || isSubmitting ? "bg-[#F2F4F7]" : "bg-[#C6593C]"
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
