import { useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import { EditorContextType } from "./element-canvas";
import { toast } from "react-toastify";

export default function BottomBar() {
  const { formData } = useContext(
    EditorContext
  ) as unknown as EditorContextType;
  function handleSubmit() {
    console.log("🚀 ~ BottomBar ~ formData:", formData);
    localStorage.setItem("formData", JSON.stringify(formData))
    toast.success("Saved successfully")
  }
  return (
    <div className="px-[30px] py-8 flex justify-end items-center">
      <AppButton
        onClick={() => handleSubmit()}
        text="Save Form"
        btnClass="text-gray-700 border-[#98A2B3] !font-medium !py-[10px] px-10 bg-blue-600 text-white rounded-lg"
      />
    </div>
  );
}
