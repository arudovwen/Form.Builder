import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { renderElement } from "./elements-render";
import AppButton from "../ui/AppButton";
import { generateDynamicSchema } from "./validation";

const FormRenderer = ({ form_data }: any) => {
  const validationSchema = generateDynamicSchema(form_data);
  console.log("🚀 ~ FormRenderer ~ validationSchema:", validationSchema);
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
    defaultValues: {},
  });

  const { register, setValue, watch,  handleSubmit, reset,formState: { errors } }: any = methods;
  console.log("🚀 ~ FormRenderer ~ errors:", errors)

  const onSubmit = (data: any) => {
    console.log("Form Data Submitted:", data);
    // Additional logic to process the form data can be added here
  };

  const handleReset = () => {
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container mx-auto p-10"
      >
        <div className="relative w-full flex flex-col gap-y-12 py-5">
          {form_data?.map(
            (section: {
              id: string | undefined;
              title: string;
              questionData: any;
              description?: string;
            }) => (
              <div key={section.id}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-[6px]">
                    {section.title}
                  </h2>
                  {section?.description && (
                    <p className="text-sm">{section?.description}</p>
                  )}
                </div>
                <div className="grid gap-y-6">
                  {section?.questionData?.map((element: { id: any }) => (
                    <div key={element.id}>
                     <div>
                     {renderElement(element, { register, setValue, watch, errors })}
                     <div className="text-xs text-red-600 mt-1">{errors?.[element.id]?.message}</div>
                     </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
        <div className="py-8 flex justify-end items-center gap-4">
          <AppButton
            type="button"
            text="Reset Form"
            btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-gray-200 rounded-lg"
            onClick={handleReset}
          />
          <AppButton
            type="submit"
            text="Save Form"
            btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormRenderer;
