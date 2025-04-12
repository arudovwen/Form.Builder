import { useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import { EditorContextType } from "./element-canvas";
import { toast } from "react-toastify";
import { getItem } from "../../utils/localStorageControl";

type Props = {
  onSubmit: (e: any) => void;
};

export default function BottomBar({ onSubmit }: Props) {
  const { formData } = useContext(
    EditorContext
  ) as unknown as EditorContextType;
  const config = getItem("config");
  function handleSubmit() {
    localStorage.setItem("formData", JSON.stringify(formData));
    onSubmit(formData);
    toast.success("Saved successfully");
  }
  return (
    <div className="px-[30px] py-8 flex justify-end items-center">
      <AppButton
        onClick={() => handleSubmit()}
        text="Save Form"
        style={{ background: config.buttonColor }}
        btnClass={`text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg`}
      />
    </div>
  );
}
