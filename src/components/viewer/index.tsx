import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { renderElement } from "./elements-render";
import AppButton from "../ui/AppButton";
import { generateDynamicSchema } from "./validation";
import { useEffect, useMemo, useState } from "react";
import { mapIdToValue } from "../../utils/mapIdToValue";

const FormRenderer = ({
  form_data,
  answerData,
  ignoreValidation,
  onSubmitData,
  isReadOnly,
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
  }: any = methods;

  console.table(errors);
  const onSubmit = (data: any) => {
    const tempData = form_data?.map((section: any) => {
      return {
        ...section,
        questionData: section?.questionData?.map((element: any) => {
          const value = data[element.id];
          return {
            ...element,
            value: value,
          };
        }),
      };
    });
    if (onSubmitData) {
      onSubmitData(tempData);
    }

    console.log("🚀 ~ FormRenderer ~ tempData:", tempData);
  };

  // const handleReset = () => {
  //   reset();
  // };

  useEffect(() => {
    if (answerData && answerData.length > 0) {
      const tempData = mapIdToValue(answerData);
      reset(tempData);
    }
  }, [answerData, reset]);

  async function handleProceed() {
    if (!ignoreValidation) {
      const isValid = await trigger(
        form_data?.[current].questionData?.map((ele: any) => ele.id)
      );
      if (!isValid) return;
    }

    setCurrent(current + 1);
  }
  function handleBack() {
    setCurrent(current - 1);
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto p-6">
        <div className="relative w-full flex flex-col gap-y-12 py-4">
          <div key={form_data?.[current].id}>
            <div className="mb-4">
              {form_data?.[current].title && (
                <h2 className="text-lg font-semibold mb-[6px]">
                  {form_data?.[current].title}
                </h2>
              )}
              {form_data?.[current].description && (
                <p className="text-sm">{form_data?.[current].description}</p>
              )}
            </div>
            <div className="grid gap-y-6">
              {form_data?.[current].questionData?.map(
                (element: { id: any }) => (
                  <div key={element.id}>
                    <div>
                      {renderElement(element, {
                        register,
                        setValue,
                        watch,
                        errors,
                        trigger,
                        isSubmitting,
                        isReadOnly,
                        getValues,
                      })}
                      <div className="text-xs text-red-600 mt-1">
                        {errors?.[element.id]?.message}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="pt-8 flex justify-end items-center gap-4">
          {current !== 0 && (
            <AppButton
              type="button"
              text="Back"
              btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-gray-200 rounded-lg"
              onClick={handleBack}
            />
          )}
          {current !== total - 1 ? (
            <AppButton
              type="button"
              text="Continue"
              onClick={handleProceed}
              btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg"
            />
          ) : (
            <>
              {/* <AppButton
        type="button"
        text="Reset Form"
        btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-gray-200 rounded-lg"
        onClick={handleReset}
            /> */}
              {!ignoreValidation && (
                <AppButton
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                  text="Save Form"
                  btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg"
                />
              )}
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default FormRenderer;
