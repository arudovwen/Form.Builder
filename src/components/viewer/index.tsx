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

import EditorContext, { EditorProvider } from "@/context/editor-context";
import AppButton from "../ui/AppButton";
import AppIcon from "../ui/AppIcon";
import { generateDynamicSchema, evaluateVisibility } from "./validation";
import { getItem } from "@/utils/localStorageControl";
import SinglePage from "./single-page";
import MultiPage from "./multi-page";
import ConversationalPage from "./conversational-page";
import { mapIdToValue } from "@/utils/mapIdToValue";
import { Toaster } from "sonner";

export interface AnswerElement {
  id: string;
  value: any;
  [key: string]: any;
}

export type RenderType = "multi" | "single" | "conversational";

export interface FormRendererProps {
  form_data: any[];
  answerData?: any[];
  ignoreValidation?: boolean;
  onSubmitData?: (data: any[]) => void;
  onGetValues?: (data: any[]) => void;
  isReadOnly?: boolean;
  renderType?: RenderType;
  children?: ReactNode | ((options: { isUploading: boolean; isSubmitting: boolean; hasErrors: boolean }) => ReactNode);
  hideFooter?: boolean;
  uploadUrl?: string;
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
  uploadUrl,
}: FormRendererProps) => {
  const { setAnswerData, setUploadUrl, apiActivityCount }: any =
    useContext(EditorContext);
  const [current, setCurrent] = useState(0);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);

  const filteredFormData = useMemo(
    () =>
      form_data
        .filter((i) => !i.isHidden)
        .map((section) => {
          const isSectionDisabled = section.isDisabled || section.disabled;
          if (isSectionDisabled) {
            return {
              ...section,
              questionData: section?.questionData?.map((q: any) => ({
                ...q,
                isDisabled: true,
              })),
            };
          }
          return section;
        }),
    [form_data],
  );
  const totalSections = filteredFormData?.length ?? 0;
  const config = getItem("config");

  const resolver = useCallback(
    async (data: any, context: any, options: any) => {
      const dynamicSchema = generateDynamicSchema({
        formData: filteredFormData,
        isReadOnly,
        answerData: data, // use current form data to evaluate visibility
      });
      return yupResolver(dynamicSchema)(data, context, options);
    },
    [filteredFormData, isReadOnly],
  );

  const methods = useForm({
    resolver,
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
    setError,
    clearErrors,
  } = methods;

  // ✅ Use useWatch to efficiently track changes
  const watchedValues = useWatch({ control });

  // ✅ Deep memoization to avoid redundant updates
  const memoizedValues = useMemo(
    () => watchedValues,
    [JSON.stringify(watchedValues)],
  );

  // ✅ Compute flattened visible questions for Conversational mode
  const visibleQuestions = useMemo(() => {
    if (renderType !== "conversational") return [];
    const questions: any[] = [];
    filteredFormData.forEach((section) => {
      section?.questionData?.forEach((element: any) => {
        if (evaluateVisibility(element, memoizedValues)) {
          if (element.type === "grid") {
            const children = section?.questionData?.filter(
              (c: any) => c.gridId === element.id,
            );
            questions.push({ ...element, gridChildren: children });
          } else if (!element.gridId) {
            questions.push(element);
          }
        }
      });
    });
    return questions;
  }, [filteredFormData, memoizedValues, renderType]);

  // ✅ Memoize callback for parent updates
  const handleGetValues = useCallback(
    (value: any) => {
      if (onGetValues) onGetValues(value);
    },
    [onGetValues],
  );

  useEffect(() => {
    setUploadUrl(uploadUrl);
  }, [setUploadUrl, uploadUrl]);
  // ✅ Effect runs only when actual values change
  useEffect(() => {
    if (!filteredFormData?.length || !onGetValues) return;

    const updatedData = filteredFormData.flatMap((section) =>
      section?.questionData?.map((element: any) => ({
        id: element.id,
        value: memoizedValues[element.id] || "",
        sectionId: section.id,
        type: element.type,
        metaData: {
          prefix: element.prefix,
          dateFormat: element.dateFormat,
        },
      })),
    );

    handleGetValues(updatedData);
    setAnswerData(memoizedValues);
  }, [
    memoizedValues,
    filteredFormData,
    handleGetValues,
    onGetValues,
    setAnswerData,
  ]);

  // ✅ Answer data hydration
  useEffect(() => {
    if (answerData?.length) {
      reset(mapIdToValue(answerData));
    }
  }, [answerData, reset]);

  // ✅ Submit handler
  const onSubmit = useCallback(
    (data: Record<string, any>) => {
      const updatedData = filteredFormData.flatMap((section) =>
        section?.questionData?.map((element: any) => ({
          id: element.id,
          value: data[element.id] || "",
          sectionId: section.id,
          type: element.type,
          metaData: {
            prefix: element.prefix,
            dateFormat: element.dateFormat,
          },
        })),
      );
      if (Object.keys(errors).length > 0) {
        return;
      }
      onSubmitData?.(updatedData);
    },
    [errors, filteredFormData, onSubmitData],
  );

  // ✅ Navigation handlers
  const handleProceed = useCallback(async () => {
    if (renderType === "conversational") {
      if (!ignoreValidation) {
        const currentField = visibleQuestions[currentConvIndex];
        if (!currentField) return;
        const fieldsToValidate = currentField.gridChildren
          ? currentField.gridChildren.map((c: any) => c.id)
          : [currentField.id];
        const isValid = await trigger(fieldsToValidate);
        if (!isValid) return;
      }
      if (currentConvIndex < visibleQuestions.length - 1) {
        setCurrentConvIndex((prev) => prev + 1);
      } else {
        handleSubmit(onSubmit)();
      }
      return;
    }

    if (!ignoreValidation) {
      const currentFields = filteredFormData?.[current]?.questionData?.map(
        (ele: any) => ele.id,
      );
      const isValid = await trigger(currentFields);
      if (!isValid) return;
    }
    setCurrent((prev) => prev + 1);
  }, [
    current,
    currentConvIndex,
    visibleQuestions,
    filteredFormData,
    ignoreValidation,
    trigger,
    renderType,
    handleSubmit,
    onSubmit,
  ]);

  const handleBack = useCallback(() => {
    if (renderType === "conversational") {
      setCurrentConvIndex((prev) => Math.max(0, prev - 1));
      return;
    }
    setCurrent((prev) => prev - 1);
  }, [renderType]);

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
      setError,
      clearErrors,
      apiActivityCount,
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
      setError,
      clearErrors,
      apiActivityCount,
    ],
  );

  return (
    <FormProvider {...methods}>
      <Toaster position="top-right" richColors closeButton />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container h-full mx-auto"
      >
        <div className="relative flex flex-col w-full min-w-0 py-4 gap-y-12">
          <div
            className="multi_section__box min-w-0"
            key={
              renderType === "conversational"
                ? `conv-${currentConvIndex}`
                : filteredFormData?.[current]?.id
            }
          >
            {renderType === "multi" &&
              (filteredFormData?.[current]?.title ||
                filteredFormData?.[current]?.description) && (
                <div className="py-4 mb-4 border-b border-gray-100 multi_section__title">
                  {filteredFormData[current]?.title && (
                    <h2 className="text-lg font-semibold mb-[6px]">
                      {filteredFormData[current]?.title}
                    </h2>
                  )}
                  {filteredFormData[current]?.description && (
                    <p className="text-sm">
                      {filteredFormData[current]?.description}
                    </p>
                  )}
                </div>
              )}

            {renderType === "multi" ? (
              <MultiPage
                form_data={filteredFormData}
                options={sharedOptions}
                current={current}
              />
            ) : renderType === "conversational" ? (
              <ConversationalPage
                element={visibleQuestions[currentConvIndex]}
                options={sharedOptions}
                onNext={handleProceed}
                onPrev={handleBack}
                isFirst={currentConvIndex === 0}
                isLast={currentConvIndex === visibleQuestions.length - 1}
                isReadOnly={isReadOnly}
              />
            ) : (
              <SinglePage
                form_data={filteredFormData}
                options={sharedOptions}
              />
            )}
          </div>
        </div>

        {/* ✅ Footer Controls */}
        {!hideFooter && renderType !== "conversational" && (
          <footer className="flex items-center justify-end gap-4 footer flex-wrap">
            {renderType === "multi" ? (
              <>
                <div className="flex gap-x-4 justify-between navigation_container w-full">
                  <div>
                    {" "}
                    {current > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="text-gray-400 hover:text-gray-600 font-medium text-sm flex items-center gap-1 transition-colors back_btn"
                      >
                        <AppIcon
                          icon="material-symbols:arrow-upward-rounded"
                          iconClass="text-lg"
                        />
                        Back
                      </button>
                    )}
                  </div>
                  {current < totalSections - 1 && (
                    <AppButton
                      type="button"
                      text="Next"
                      onClick={handleProceed}
                      style={{ background: config?.buttonColor || "#333" }}
                      btnClass="text-gray-700 next_btn text-sm border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg continue_btn"
                    />
                  )}
                </div>
                {(current === totalSections - 1 || isReadOnly) &&
                  !ignoreValidation &&
                  ((typeof children === 'function' 
                    ? children({ isUploading: apiActivityCount > 0, isSubmitting, hasErrors: Object.keys(errors).length > 0 }) 
                    : children) ?? (
                    <AppButton
                      isDisabled={
                        isSubmitting ||
                        Object.keys(errors).length > 0 ||
                        apiActivityCount > 0
                      }
                      isLoading={isSubmitting}
                      type="submit"
                      text="Submit"
                      style={{ background: config?.buttonColor || "#333" }}
                      btnClass="text-gray-700 border-[#98A2B3] submit_btn !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg submit_btn"
                    />
                  ))}
              </>
            ) : (
              !ignoreValidation &&
              ((typeof children === 'function' 
                ? children({ isUploading: apiActivityCount > 0, isSubmitting, hasErrors: Object.keys(errors).length > 0 }) 
                : children) ?? (
                <AppButton
                  isDisabled={
                    isSubmitting ||
                    Object.keys(errors).length > 0 ||
                    apiActivityCount > 0
                  }
                  isLoading={isSubmitting}
                  type="submit"
                  text="Submit"
                  style={{ background: config?.buttonColor || "#333" }}
                  btnClass="text-gray-700 border-[#98A2B3] submit_btn !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg submit_btn"
                />
              ))
            )}
          </footer>
        )}

        {/* ✅ Progress bar for Conversational Mode */}
        {renderType === "conversational" && visibleQuestions.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{
                width: `${((currentConvIndex + 1) / visibleQuestions.length) * 100}%`,
                background: config?.buttonColor || "#2563EB",
              }}
            />
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default React.memo(FormRenderer);
