import { useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import { EditorContextType } from "./element-canvas";

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
  }
  return (
    <div className="px-[30px] py-3 flex justify-end items-center  w-full">
      <AppButton
        onClick={() => handleSubmit()}
        text="Save Form"
        style={{ background: config?.buttonColor || "#333" }}
        btnClass={`text-gray-700 border-[#98A2B3] !font-medium !text-sm !py-[10px] px-10 bg-blue-600 text-white rounded-lg form_save__btn`}
      />
    </div>
  );
}
