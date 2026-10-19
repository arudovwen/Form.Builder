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
  children?:
    | ReactNode
    | ((options: {
        isUploading: boolean;
        isSubmitting: boolean;
        hasErrors: boolean;
        submitText?: string;
      }) => ReactNode);
  hideFooter?: boolean;
  uploadUrl?: string;
  pollResults?: Record<string, any>; // Add pollResults
  showResults?: boolean; // Toggle for showing results
  hideInputsOnResults?: boolean;
  sendHiddenSectionsAsEmpty?: boolean;
  preview?: boolean;
  submitText?: string;
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
  pollResults,
  showResults,
  hideInputsOnResults = false,
  sendHiddenSectionsAsEmpty = false,
  preview = false,
  submitText = "Submit",
}: FormRendererProps) => {
  const { setAnswerData, setUploadUrl, apiActivityCount }: any =
    useContext(EditorContext);
  const [current, setCurrent] = useState(0);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);

  const filteredFormData = useMemo(
    () =>
      form_data
        .filter(
          (i) =>
            (preview ? true : !i.isHidden) &&
            !i.isFieldDeleted &&
            !i.isDeleted,
        )
        .map((section) => {
          const isSectionDisabled = section.isDisabled || section.disabled;
          const activeQuestions =
            section?.formData?.filter(
              (q: any) => !q.isFieldDeleted && !q.isDeleted,
            ) || [];
          if (isSectionDisabled) {
            return {
              ...section,
              formData: activeQuestions.map((q: any) => ({
                ...q,
                isDisabled: true,
              })),
            };
          }
          return {
            ...section,
            formData: activeQuestions,
          };
        }),
    [form_data, preview],
  );
  const totalSections = filteredFormData?.length ?? 0;
  const config = getItem("config");

  const resolver = useCallback(
    async (data: any, context: any, options: any) => {
      const dynamicSchema = generateDynamicSchema({
        formData: filteredFormData,
        isReadOnly,
        ignoreValidation,
        answerData: data, // use current form data to evaluate visibility
      });
      return yupResolver(dynamicSchema)(data, context, options);
    },
    [filteredFormData, isReadOnly, ignoreValidation],
  );

  const methods = useForm({
    resolver,
    mode: "onSubmit",
    defaultValues: {},
    shouldUnregister: false,
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
      section?.formData?.forEach((element: any) => {
        if (evaluateVisibility(element, memoizedValues)) {
          if (element.type === "grid") {
            const children = section?.formData?.filter(
              (c: any) =>
                c.gridId === element.id &&
                (!c.gridPosition?.col ||
                  c.gridPosition.col <= (element.columns || 1)) &&
                evaluateVisibility(c, memoizedValues),
            );
            if (children && children.length > 0) {
              questions.push({ ...element, gridChildren: children });
            }
          } else {
            const parentGrid = element.gridId
              ? section?.formData?.find(
                  (g: any) => g.id === element.gridId && g.type === "grid",
                )
              : null;
            const isGridChild =
              parentGrid &&
              (!element.gridPosition?.col ||
                element.gridPosition.col <= (parentGrid.columns || 1));
            if (!isGridChild) {
              questions.push(element);
            }
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
    if (!form_data?.length) return;

    const currentFormValues = {
      ...(getValues ? getValues() : {}),
      ...(memoizedValues || {}),
    };

    setAnswerData?.(currentFormValues);

    if (!onGetValues) return;

    const updatedData = form_data
      .filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
      .flatMap((section: any) => {
        const isSectionHidden = preview ? false : Boolean(section?.isHidden);
        const shouldEmptyHidden = Boolean(
          sendHiddenSectionsAsEmpty ||
          section?.sendEmptyWhenHidden ||
          section?.clearWhenHidden,
        );
        const shouldSendEmpty = isSectionHidden && shouldEmptyHidden;

        return (
          section?.formData
            ?.filter((el: any) => !el?.isFieldDeleted && !el?.isDeleted)
            ?.map((element: any) => {
              const rawVal =
                currentFormValues[element.id] !== undefined
                  ? currentFormValues[element.id]
                  : element.value !== undefined && element.value !== null
                    ? element.value
                    : "";

              const metaObj =
                currentFormValues[`${element.id}_metaData`] ||
                element.metaData?.responseObject;

              return {
                id: element.id,
                value: shouldSendEmpty ? "" : (rawVal ?? ""),
                sectionId: section.id,
                type: element.type,
                metaData: {
                  prefix: element.prefix,
                  dateFormat: element.dateFormat,
                  ...(shouldSendEmpty || !metaObj
                    ? {}
                    : { responseObject: metaObj }),
                },
              };
            }) || []
        );
      });

    handleGetValues(updatedData);
  }, [
    memoizedValues,
    form_data,
    handleGetValues,
    onGetValues,
    setAnswerData,
    sendHiddenSectionsAsEmpty,
    getValues,
    preview,
  ]);

  // ✅ Answer data hydration
  useEffect(() => {
    if (answerData?.length) {
      reset(mapIdToValue(answerData));
    }
  }, [answerData, reset]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ Submit handler
  const onSubmit = useCallback(
    (data: Record<string, any>) => {
      const currentFormValues = {
        ...(getValues ? getValues() : {}),
        ...(data || {}),
      };

      const updatedData = form_data
        .filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
        .flatMap((section: any) => {
          const isSectionHidden = preview ? false : Boolean(section?.isHidden);
          const shouldEmptyHidden = Boolean(
            sendHiddenSectionsAsEmpty ||
            section?.sendEmptyWhenHidden ||
            section?.clearWhenHidden,
          );
          const shouldSendEmpty = isSectionHidden && shouldEmptyHidden;

          return (
            section?.formData
              ?.filter((el: any) => !el?.isFieldDeleted && !el?.isDeleted)
              ?.map((element: any) => {
                const rawVal =
                  currentFormValues[element.id] !== undefined
                    ? currentFormValues[element.id]
                    : element.value !== undefined && element.value !== null
                      ? element.value
                      : "";

                const metaObj =
                  currentFormValues[`${element.id}_metaData`] ||
                  element.metaData?.responseObject;

                return {
                  id: element.id,
                  value: shouldSendEmpty ? "" : (rawVal ?? ""),
                  sectionId: section.id,
                  type: element.type,
                  metaData: {
                    prefix: element.prefix,
                    dateFormat: element.dateFormat,
                    ...(shouldSendEmpty || !metaObj
                      ? {}
                      : { responseObject: metaObj }),
                  },
                };
              }) || []
          );
        });
      if (Object.keys(errors).length > 0) {
        return;
      }
      setIsSubmitted(true);
      onSubmitData?.(updatedData);
    },
    [errors, form_data, getValues, onSubmitData, sendHiddenSectionsAsEmpty, preview],
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
      const currentFields = filteredFormData?.[current]?.formData?.map(
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
      pollResults,
      showResults,
      hideInputsOnResults,
      isViewer: true,
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
      pollResults,
      showResults,
      hideInputsOnResults,
    ],
  );

  if (isSubmitted && !preview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] w-full p-8 text-center animate-in fade-in zoom-in-95 duration-500 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-100">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-sm shadow-emerald-100">
          <AppIcon icon="solar:check-circle-bold-duotone" iconClass="text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Submission Successful!
        </h2>
        <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
          Thank you for taking the time to complete this form. Your responses have been securely recorded.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            reset({});
            setCurrent(0);
            setCurrentConvIndex(0);
          }}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-xs transition-all flex items-center gap-2"
        >
          <AppIcon icon="solar:restart-linear" iconClass="text-sm" />
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <Toaster position="top-right" richColors closeButton />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full mx-auto"
      >
        <div className="relative flex flex-col w-full min-w-0 py-2">
          {/* Multi-step progress bar */}
          {renderType === "multi" && totalSections > 1 && (
            <div className="mb-6 px-1">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                <span className="uppercase tracking-wider text-[11px] text-indigo-600 font-bold">
                  Step {current + 1} of {totalSections}
                </span>
                <span>
                  {Math.round(((current + 1) / totalSections) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((current + 1) / totalSections) * 100}%`,
                    background: config?.buttonColor || "#4f46e5",
                  }}
                />
              </div>
            </div>
          )}

          <div
            className="multi_section__box min-w-0"
            key={
              renderType === "conversational"
                ? `conv-${currentConvIndex}`
                : undefined
            }
          >
            {renderType === "multi" &&
              (filteredFormData?.[current]?.title ||
                filteredFormData?.[current]?.description) && (
                <div className="py-4 mb-6 border-b border-gray-100 multi_section__title">
                  {filteredFormData[current]?.title && (
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {filteredFormData[current]?.title}
                    </h2>
                  )}
                  {filteredFormData[current]?.description && (
                    <p className="text-xs text-gray-500 leading-relaxed">
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
                submitText={submitText}
                preview={preview}
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
                        className="text-gray-400 hover:text-gray-600 font-semibold text-base flex items-center gap-1 transition-colors back_btn"
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
                  ((typeof children === "function"
                    ? children({
                        isUploading: apiActivityCount > 0,
                        isSubmitting,
                        hasErrors: Object.keys(errors).length > 0,
                        submitText: submitText || "Submit",
                      })
                    : children) ?? (
                    <AppButton
                      isDisabled={
                        isSubmitting ||
                        Object.keys(errors).length > 0 ||
                        apiActivityCount > 0
                      }
                      isLoading={isSubmitting}
                      type="submit"
                      text={submitText || "Submit"}
                      style={{ background: config?.buttonColor || "#333" }}
                      btnClass="text-gray-700 border-[#98A2B3] submit_btn !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg submit_btn"
                    />
                  ))}
              </>
            ) : (
              !ignoreValidation &&
              ((typeof children === "function"
                ? children({
                    isUploading: apiActivityCount > 0,
                    isSubmitting,
                    hasErrors: Object.keys(errors).length > 0,
                    submitText: submitText || "Submit",
                  })
                : children) ?? (
                <AppButton
                  isDisabled={
                    isSubmitting ||
                    Object.keys(errors).length > 0 ||
                    apiActivityCount > 0
                  }
                  isLoading={isSubmitting}
                  type="submit"
                  text={submitText || "Submit"}
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
