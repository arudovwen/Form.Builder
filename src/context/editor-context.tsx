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
      updateSection: (value: any, sectionId: string) => void;
      setIsDragging: (value: boolean) => void;
    }
  | undefined
>(undefined);

// interface ElementType {
//   id: string;
//   type: string;
//   label: string;
// }
const newSection = {
  title: "",
  description: "",
  id: uuidv4(),
  questionData: [],
};
export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [elementData, setElementData] = useState({});
  const [formData, setFormData] = useState<any[]>([newSection]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const handleDragStop = React.useCallback(() => {
    // Handle drag stop (implementation depends on requirements)
  }, []);

  const addSection = React.useCallback(() => {
    const id = uuidv4();
    setFormData((prevFormData) => [...prevFormData, { ...newSection, id }]);
    setSelectedSection(id);
  }, []);
  const removeSection = React.useCallback((sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.filter((i) => i.id !== sectionId)
    );
  }, []);
  const removeElement = React.useCallback(
    (elementId: any, sectionId: string) => {
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
    },
    []
  );

  const updateElementPosition = React.useCallback(
    (updatedQuestionData: any[], sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData.map((section) =>
          section.id === sectionId
            ? { ...section, questionData: updatedQuestionData }
            : section
        )
      );
    },
    []
  );

  const addElement = React.useCallback((element: any, sectionId: string) => {
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
  }, []);

  const updateElement = React.useCallback((value: any, sectionId: string) => {
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
  }, []);
  const updateSection = React.useCallback((value: any, sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              ...value,
            }
          : section
      )
    );
  }, []);

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
      updateSection,
      isDragging,
      setIsDragging,
      selectedSection,
      setSelectedSection,
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
      updateSection,
      isDragging,
      selectedSection,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export default EditorContext;
