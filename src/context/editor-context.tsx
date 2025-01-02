import React, { createContext, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface EditorProviderProps {
  children: React.ReactNode;
}

const EditorContext = createContext<
  | {
      formData: any;
      setFormData: React.Dispatch<React.SetStateAction<any>>;
      handleDragStop: (e: any, elementId: string) => void;
      removeElement: (elementId: string, sectionId: string) => void;
      updateElementPosition: (
        updatedFormData: any[],
        sectionId: string
      ) => void;
      addElement: (element: any, sectionId: string) => void;
      updateElement: (value: any, sectionId: string) => void;
    }
  | undefined
>(undefined);

interface ElementType {
  id: string;
  type: string;
  label: string;
}
const newSection = {
  title: "Section name",
  id: uuidv4(),
  questionData: [],
};
export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [elementData, setElementData] = useState({});
  const [formData, setFormData] = useState<any[]>([newSection]);

  const handleDragStop = (e: any, elementId: string) => {
    // Handle drag stop (implementation depends on requirements)
  };

  const addSection = () => {
    setFormData([...formData, { ...newSection, id: uuidv4() }]);
  };
  const removeSection = (sectionId: string) => {
    setFormData(formData.filter((i) => i.id !== sectionId));
  };
  const removeElement = (elementId: any, sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questionData: section.questionData.filter(
                (element: any) => element.id !== elementId
              ),
            }
          : section
      )
    );
  };

  const updateElementPosition = (
    updatedQuestionData: any[],
    sectionId: string
  ) => {
    setFormData((prevFormData) =>
      prevFormData.map((section) =>
        section.id === sectionId
          ? { ...section, questionData: updatedQuestionData }
          : section
      )
    );
  };

  const addElement = (element: any, sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questionData: [...section.questionData, element],
            }
          : section
      )
    );
  };

  const updateElement = (value: any, sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questionData: section.questionData.map((ele: any) =>
                ele.id === value.id ? { ...ele, ...value } : ele
              ),
            }
          : section
      )
    );
  };

  const value = useMemo(
    () => ({
      formData,
      setFormData,
      handleDragStop,
      removeElement,
      elementData,
      setElementData,
      updateElementPosition,
      addElement,
      updateElement,
      addSection,
      removeSection,
    }),
    [
      formData,
      handleDragStop,
      removeElement,
      elementData,
      updateElementPosition,
      addElement,
      updateElement,
      addSection,
      removeSection,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export default EditorContext;
