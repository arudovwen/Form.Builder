/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";

import { EditorProvider } from "../../context/editor-context";
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
  isReadOnly?: boolean;
  renderType?: RenderType;
}
const FormRenderer = ({
  form_data,
  answerData,
  ignoreValidation,
  onSubmitData,
  isReadOnly,
  renderType = "multi",
}: any) => {
  const [current, setCurrent] = useState(0);
  const total = useMemo(() => form_data.length, [form_data]);
  const validationSchema = generateDynamicSchema(form_data);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
    defaultValues: {},
  });

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
    trigger,
  } = methods;

  const config = getItem("config");

  const onSubmit = (data: any) => {
    const updatedData = form_data.flatMap((section: any) =>
      section.questionData.map((element: any) => ({
        id: element.id,
        value: data[element.id],
        sectionId: section.id,
        type: element.type,
      }))
    );

    onSubmitData?.(updatedData);
  };

  useEffect(() => {
    if (answerData?.length) {
      const tempData = mapIdToValue(answerData)
      reset(tempData)
    }
  }, [answerData, reset]);

  async function handleProceed() {
    if (!ignoreValidation) {
      const isValid = await trigger(
        form_data?.[current].questionData?.map((ele: any) => ele.id)
      );
      if (!isValid) return;
    }
    setCurrent((prev) => prev + 1);
  }

  function handleBack() {
    setCurrent((prev) => prev - 1);
  }

  return (
    <EditorProvider>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container mx-auto p-6"
        >
          <div className="relative w-full flex flex-col gap-y-12 py-4">
            <div key={form_data?.[current].id}>
              <div className="mb-4">
                {form_data?.[current].title && (
                  <h2 className="text-lg font-semibold mb-[6px]">
                    {form_data[current].title}
                  </h2>
                )}
                {form_data?.[current].description && (
                  <p className="text-sm">{form_data[current].description}</p>
                )}
              </div>

              {renderType === "multi" ? (
                <MultiPage
                  form_data={form_data}
                  options={{
                    register,
                    setValue,
                    watch,
                    errors,
                    trigger,
                    isSubmitting,
                    isReadOnly,
                    getValues,
                  }}
                  current={current}
                />
              ) : (
                <SinglePage
                  form_data={form_data}
                  options={{
                    register,
                    setValue,
                    watch,
                    errors,
                    trigger,
                    isSubmitting,
                    isReadOnly,
                    getValues,
                  }}
                />
              )}
            </div>
          </div>

          <div className="pt-8 flex justify-end items-center gap-4">
            {current !== 0 && (
              <AppButton
                type="button"
                text="Back"
                onClick={handleBack}
                btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-gray-200 rounded-lg"
              />
            )}

            {current !== total - 1 ? (
              <AppButton
                type="button"
                text="Continue"
                onClick={handleProceed}
                style={{ background: config?.buttonColor || "#333" }}
                btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg"
              />
            ) : (
              !ignoreValidation && (
                <AppButton
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                  text="Submit"
                  style={{ background: config?.buttonColor || "#333" }}
                  btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg"
                />
              )
            )}
          </div>
        </form>
      </FormProvider>
    </EditorProvider>
  );
};

export default FormRenderer;
