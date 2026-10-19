import React from "react";
import { useForm, Controller } from "react-hook-form";
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
    disabled: yup.boolean().default(false),
    isHidden: yup.boolean().default(false),
    sendEmptyWhenHidden: yup.boolean().default(false),
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
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: section,
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(section);
    }
  }, [isOpen, section, reset]);

  if (!isOpen) return null;

  const onSubmit = (value: any) => {
    updateSection(value, section.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999] cursor-default p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <AppIcon icon="solar:folder-with-files-bold-duotone" iconClass="text-2xl" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Section Settings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure section title, description, and visibility rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            title="Close modal"
          >
            <AppIcon icon="tabler:x" iconClass="text-xl" />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col"
          autoComplete="off"
        >
          <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[65vh]">
            {/* Basic Info */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Basic Info
              </span>
              <DynamicInput
                label="Section Title"
                name="title"
                placeholder="e.g. Personal Information"
                register={register}
                errors={errors}
                watch={watch}
              />

              <DynamicInput
                label="Section Description"
                name="description"
                placeholder="Optional description or instructions for respondents..."
                register={register}
                errors={errors}
                watch={watch}
                type="textarea"
              />
            </div>

            {/* Section Controls */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Behavior & Visibility
              </span>

              {/* Disable Section Toggle */}
              <Controller
                name="disabled"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200/80 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-all">
                    <div className="pr-4">
                      <span className="text-xs font-semibold text-gray-800 block">
                        Disable Section
                      </span>
                      <span className="text-[11px] text-gray-500 block mt-0.5">
                        Prevents respondent interaction with all fields in this section
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        field.value ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          field.value ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>
                )}
              />

              {/* Hide Section Toggle */}
              <Controller
                name="isHidden"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200/80 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-all">
                    <div className="pr-4">
                      <span className="text-xs font-semibold text-gray-800 block">
                        Hide Section
                      </span>
                      <span className="text-[11px] text-gray-500 block mt-0.5">
                        Hides this section entirely from the respondent form view
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        field.value ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          field.value ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>
                )}
              />

              {/* Send Empty When Hidden */}
              <Controller
                name="sendEmptyWhenHidden"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200/80 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-all">
                    <div className="pr-4">
                      <span className="text-xs font-semibold text-gray-800 block">
                        Send Empty When Hidden
                      </span>
                      <span className="text-[11px] text-gray-500 block mt-0.5">
                        Submits blank values for this section's fields when hidden
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        field.value ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          field.value ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>
                )}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              style={{ background: config?.buttonColor || "#4f46e5" }}
              className="px-5 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionEditorModal;
