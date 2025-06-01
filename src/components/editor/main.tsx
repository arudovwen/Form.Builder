import EditorContext from "../../context/editor-context";
import FormBuilder from ".";
import { useContext, useEffect } from "react";

export default function MainPage({
  questionData,
}: {
  questionData: any[];
  isReadOnly?: boolean;
}) {
  const { setFormData } = useContext(EditorContext);

  useEffect(() => {
    if (questionData && questionData.length > 0) {
      setFormData(questionData);
    }
  }, [questionData, setFormData]);

  return (
    <div className="bg-white p-4 border border-[#E4E7EC] rounded-lg h-full overflow-y-auto no-scrollbar">
      <FormBuilder />
    </div>
  );
}
