import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppIcon from "../ui/AppIcon";

import { DynamicInput } from "../forms/dynamic-input";
import EditorContext from "../../context/editor-context";
import { getItem } from "../../utils/localStorageControl";

const schema = yup
  .object({
    title: yup.string(),
    description: yup.string(),
  })

  .required();

type FormInputs = yup.InferType<typeof schema>;

 const config = getItem("config");
const SectionEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  section: any;
}> = ({ isOpen, onClose, section }) => {
  const { updateSection }: any = React.useContext(EditorContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: section,
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (value: any) => {
    updateSection(value, section.id);
    onClose();
  };

  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999] cursor-default no-drag select-none">
      <div className="min-w-[600px] bg-white rounded-xl shadow-xl relative flex flex-col items-center">
        {/* Header */}
        <div className="w-full px-6 pt-6 pb-5 flex flex-col items-start gap-4 z-10 mb-6">
          <h2 className="text-lg font-semibold text-[#475467] font-onest">
            Update Section Information
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-[#98A2B3] hover:bg-gray-50 rounded-lg"
          >
            <AppIcon icon="tabler:x" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full px-6 flex flex-col gap-5 z-10">
            <DynamicInput
              label="Title"
              name="title"
              register={register}
              errors={errors}
            />

            <DynamicInput
              label="Description"
              name="description"
              register={register}
              errors={errors}
            />
          </div>

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

export default SectionEditorModal;
