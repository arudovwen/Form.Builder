/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useContext,
} from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import EditorContext, { EditorProvider } from "../../context/editor-context";
import AppButton from "../ui/AppButton";
import { generateDynamicSchema } from "./validation";
import { mapIdToValue } from "../../utils/mapIdToValue";
import { getItem } from "../../utils/localStorageControl";
import SinglePage from "./single-page";
import MultiPage from "./multi-page";

export interface AnswerElement {
  id: string;
  value: any;
  [key: string]: any;
}

export type RenderType = "multi" | "single";

export interface FormRendererProps {
  form_data: any[];
  answerData?: any[];
  ignoreValidation?: boolean;
  onSubmitData?: (data: any[]) => void;
  onGetValues?: (data: any[]) => void;
  isReadOnly?: boolean;
  renderType?: RenderType;
  children?: ReactNode;
  hideFooter?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  form_data,
  answerData = [],
  ignoreValidation = false,
  onSubmitData,
  onGetValues,
  isReadOnly = false,
  renderType = "multi",
  children,
  hideFooter = false,
}: FormRendererProps) => {
  const { setAnswerData }: any = useContext(EditorContext);
  const [current, setCurrent] = useState(0);

  const totalSections = form_data?.length ?? 0;
  const config = getItem("config");

  const validationSchema = useMemo(
    () => generateDynamicSchema(form_data),
    [form_data]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
    defaultValues: {},
  });

  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = methods;

  // ✅ Use useWatch to efficiently track changes
  const watchedValues = useWatch({ control });

  // ✅ Deep memoization to avoid redundant updates
  const memoizedValues = useMemo(
    () => watchedValues,
    [JSON.stringify(watchedValues)]
  );

  // ✅ Memoize callback for parent updates
  const handleGetValues = useCallback(
    (value: any) => {
      if (onGetValues) onGetValues(value);
    },
    [onGetValues]
  );

  // ✅ Effect runs only when actual values change
  useEffect(() => {
    if (!form_data?.length || !onGetValues) return;

    const updatedData = form_data.flatMap((section) =>
      section.questionData.map((element: any) => ({
        id: element.id,
        value: memoizedValues[element.id],
        sectionId: section.id,
        type: element.type,
      }))
    );

    handleGetValues(updatedData);
    setAnswerData(memoizedValues);
  }, [memoizedValues, form_data, handleGetValues, onGetValues, setAnswerData]);

  // ✅ Answer data hydration
  useEffect(() => {
    if (answerData?.length) {
      reset(mapIdToValue(answerData));
    }
  }, [answerData, reset]);

  // ✅ Submit handler
  const onSubmit = useCallback(
    (data: Record<string, any>) => {
      const updatedData = form_data.flatMap((section) =>
        section.questionData.map((element: any) => ({
          id: element.id,
          value: data[element.id],
          sectionId: section.id,
          type: element.type,
        }))
      );

      onSubmitData?.(updatedData);
    },
    [form_data, onSubmitData]
  );

  // ✅ Navigation handlers
  const handleProceed = useCallback(async () => {
    if (!ignoreValidation) {
      const currentFields = form_data?.[current]?.questionData?.map(
        (ele: any) => ele.id
      );
      const isValid = await trigger(currentFields);
      if (!isValid) return;
    }
    setCurrent((prev) => prev + 1);
  }, [current, form_data, ignoreValidation, trigger]);

  const handleBack = useCallback(() => {
    setCurrent((prev) => prev - 1);
  }, []);

  const sharedOptions = useMemo(
    () => ({
      register,
      setValue,
      watch,
      errors,
      trigger,
      isSubmitting,
      isReadOnly,
      getValues,
    }),
    [
      register,
      setValue,
      watch,
      errors,
      trigger,
      isSubmitting,
      isReadOnly,
      getValues,
    ]
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container h-full mx-auto"
      >
        <div className="relative flex flex-col w-full py-4 gap-y-12">
          <div className="multi_section__box" key={form_data?.[current]?.id}>
            {renderType === "multi" &&
              (form_data?.[current]?.title ||
                form_data?.[current]?.description) && (
                <div className="py-4 mb-4 border-b border-gray-100 multi_section__title">
                  {form_data[current]?.title && (
                    <h2 className="text-lg font-semibold mb-[6px]">
                      {form_data[current]?.title}
                    </h2>
                  )}
                  {form_data[current]?.description && (
                    <p className="text-sm">{form_data[current]?.description}</p>
                  )}
                </div>
              )}

            {renderType === "multi" ? (
              <MultiPage
                form_data={form_data}
                options={sharedOptions}
                current={current}
              />
            ) : (
              <SinglePage form_data={form_data} options={sharedOptions} />
            )}
          </div>
        </div>

        {/* ✅ Footer Controls */}
        {!hideFooter && (
          <footer className="flex items-center justify-end gap-4 footer">
            {renderType === "multi" ? (
              <>
                {current > 0 && (
                  <AppButton
                    type="button"
                    text="Back"
                    onClick={handleBack}
                    btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-gray-200 rounded-lg"
                  />
                )}
                {current < totalSections - 1 ? (
                  <AppButton
                    type="button"
                    text="Continue"
                    onClick={handleProceed}
                    style={{ background: config?.buttonColor || "#333" }}
                    btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg continue_btn"
                  />
                ) : (
                  !ignoreValidation &&
                  (children ?? (
                    <AppButton
                      isDisabled={isSubmitting}
                      isLoading={isSubmitting}
                      type="submit"
                      text="Submit"
                      style={{ background: config?.buttonColor || "#333" }}
                      btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg submit_btn"
                    />
                  ))
                )}
              </>
            ) : (
              !ignoreValidation &&
              (children ?? (
                <AppButton
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                  text="Submit"
                  style={{ background: config?.buttonColor || "#333" }}
                  btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg submit_btn"
                />
              ))
            )}
          </footer>
        )}
      </form>
    </FormProvider>
  );
};

export default React.memo(FormRenderer);
