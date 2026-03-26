import EditorContext from "../../context/editor-context";
import FormBuilder from ".";
import { useCallback, useContext, useEffect } from "react";
import FormPreview from "./form-preview";
import { Transition } from "@headlessui/react";

export default function MainPage({
  questionData,
  uploadUrl,
}: {
  questionData: any[];
  isReadOnly?: boolean;
  uploadUrl?: string;
}) {
  const { setFormData, addSection, setUploadUrl, showPreview }: any =
    useContext(EditorContext);

  useEffect(() => {
    if (questionData && questionData.length > 0) {
      setFormData(questionData);
    }
  }, [questionData, setFormData]);

  useEffect(() => {
    setUploadUrl(uploadUrl);
  }, [uploadUrl, setUploadUrl]);
  const handleMainDrop = useCallback((e: any) => {
    e.preventDefault();

    try {
      const data = JSON.parse(e.dataTransfer.getData("properties"));
      if (data?.type === "section") {
        addSection();
        return;
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  }, []);
  return (
    <div className="flex gap-x-6 h-full">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleMainDrop(e)}
        className=" h-full overflow-y-auto no-scrollbar max-h-[calc(100vh-80px)] flex-1 form_builder"
      >
        <FormBuilder />
      </div>
      <Transition
        show={showPreview}
        as="div"
        enter="transition-all duration-300 ease-in-out origin-right"
        enterFrom="opacity-0 w-0 translate-x-10 px-0 overflow-hidden border-transparent shadow-none"
        enterTo="opacity-100 w-2/5 translate-x-0"
        leave="transition-all duration-300 ease-in-out origin-right"
        leaveFrom="opacity-100 w-2/5 translate-x-0"
        leaveTo="opacity-0 w-0 translate-x-10 px-0 overflow-hidden border-transparent shadow-none"
        className="shrink-0 overflow-y-auto no-scrollbar max-h-[calc(100vh-70px)] form_preview w-2/5 min-w-0"
      >
        <div className="px-2 shadow_box min-w-0 bg-white border border-gray-100 rounded-lg container">
          <FormPreview />
        </div>
      </Transition>
    </div>
  );
}
