import React, { createContext, useState, useMemo } from "react";

interface EditorProviderProps {
  children: React.ReactNode;
}

const EditorContext = createContext<
  | {
      formData: any;
      setFormData: React.Dispatch<React.SetStateAction<any>>;
    }
  | undefined
>(undefined);

interface ElementType {
  id: string;
  type: string;
  label: string;
}
export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [elementData, setElementData] = useState({});
  const [formData, setFormData] = useState<any[]>([]);

  const handleDragStop = (e: any, elementId: string) => {};

  const removeElement = (elementId: string) => {
    setFormData((prevFormData) =>
      prevFormData.filter((element) => element.id !== elementId)
    );
  };

  const updateElementPosition = (updatedFormData: any[]) => {
    setFormData(updatedFormData);
  };

  const addElement = (element: any) => {
    setFormData((prevFormData) => [...prevFormData, element]);
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
    }),
    [
      formData,
      handleDragStop,
      removeElement,
      elementData,
      updateElementPosition,
      addElement,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export default EditorContext;
