import EditorContext from "../../context/editor-context";
import FormBuilder from ".";
import { useCallback, useContext, useEffect } from "react";

export default function MainPage({
  questionData,
}: {
  questionData: any[];
  isReadOnly?: boolean;
}) {
  const { setFormData, addSection }: any = useContext(EditorContext);

  useEffect(() => {
    if (questionData && questionData.length > 0) {
      setFormData(questionData);
    }
  }, [questionData, setFormData]);
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
    <div
       onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleMainDrop(e)}
      className="bg-white p-4 border border-[#E4E7EC] h-full overflow-y-auto no-scrollbar max-h-[calc(100vh-60px)]"
    >
      <FormBuilder />
    </div>
  );
}
