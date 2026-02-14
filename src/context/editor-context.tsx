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
      sectionId: string,
    ) => void;
    addElement: (element: any, sectionId: string) => void;
    addElementInPosition: (
      element: any,
      sectionId: string,
      index: any,
    ) => void;
    updateElement: (value: any, sectionId: string) => void;
    updateSection: (value: any, sectionId: string) => void;
    setIsDragging: (value: boolean) => void;
    isDragging: boolean;
    uploadUrl: string;
    setUploadUrl: (e: string) => void;
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
  const [answerData, setAnswerData] = useState({});
  const [elementData, setElementData] = useState({});
  const [formData, setFormData] = useState<any[]>([newSection]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [activeSections, setActiveSections] = useState<Array<string | number>>([
    0,
  ]);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const handleDragStop = React.useCallback(() => {
    // Handle drag stop (implementation depends on requirements)
  }, []);

  const addSection = React.useCallback(() => {
    const id = uuidv4();
    setFormData((prevFormData) => [...prevFormData, { ...newSection, id }]);
    setSelectedSection(id);
    setActiveSections([formData.length]);
  }, [formData]);
  const removeSection = React.useCallback((sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.filter((i) => i.id !== sectionId),
    );

    setSelectedSection(null);
  }, []);
  const removeElement = React.useCallback(
    (elementId: string, sectionId: string) => {
      const section = formData.find((section) => section.id === sectionId);
      const elementData = section?.questionData.find(
        (el) => el.id === elementId,
      );

      if (!elementData) return;

      setFormData((prevFormData) =>
        prevFormData.map((section) =>
          section.id === sectionId
            ? {
              ...section,
              questionData: section.questionData.filter((element: any) => {
                if (elementData.type === "grid") {
                  // remove both the grid and its children
                  return (
                    element.gridId !== elementData.id &&
                    element.id !== elementData.id
                  );
                }
                // normal element removal
                return element.id !== elementId;
              }),
            }
            : section,
        ),
      );
    },
    [formData, setFormData],
  );
  const duplicateElement = React.useCallback(
    (elementId: string, sectionId: string) => {
      const section = formData.find((sec) => sec.id === sectionId);
      if (!section) return;

      const elementIndex = section.questionData.findIndex((el: any) => el.id === elementId);
      if (elementIndex === -1) return;

      const original = section.questionData[elementIndex];

      const deepCloneWithNewId = (obj: any, overrides: any = {}) => ({
        ...JSON.parse(JSON.stringify(obj)),
        id: uuidv4(),
        ...overrides,
      });

      setFormData((prevFormData) =>
        prevFormData.map((sec: any) => {
          if (sec.id !== sectionId) return sec;

          const qd = [...sec.questionData];

          if (original.type === "grid") {
            // Duplicate a grid and all its children
            const relatedIndices = qd
              .map((e, i) => ({ e, i }))
              .filter(({ e }) => e.id === original.id || e.gridId === original.id)
              .map(({ i }) => i);

            const insertAfter = relatedIndices.length ? Math.max(...relatedIndices) + 1 : elementIndex + 1;

            const newGridId = uuidv4();
            const newGrid = deepCloneWithNewId(original, {});
            newGrid.id = newGridId;

            const children = qd.filter((e: any) => e.gridId === original.id);
            const newChildren = children.map((child: any) =>
              deepCloneWithNewId(child, { gridId: newGridId })
            );

            const newQuestionData = [
              ...qd.slice(0, insertAfter),
              newGrid,
              ...newChildren,
              ...qd.slice(insertAfter),
            ];

            return { ...sec, questionData: newQuestionData };
          } else {
            // Duplicate a normal element
            const newElement = deepCloneWithNewId(original, original.gridId ? { gridId: original.gridId } : {});
            const newQuestionData = [
              ...qd.slice(0, elementIndex + 1),
              newElement,
              ...qd.slice(elementIndex + 1),
            ];
            return { ...sec, questionData: newQuestionData };
          }
        })
      );
    },
    [formData, setFormData],
  );
  const updateElementPosition = React.useCallback(
    (updatedQuestionData: any[], sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData.map((section) =>
          section.id === sectionId
            ? { ...section, questionData: updatedQuestionData }
            : section,
        ),
      );
    },
    [],
  );

  const addElement = React.useCallback((element: any, sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questionData: [...section.questionData, element],
          }
          : section,
      ),
    );
  }, []);
  const addElementInPosition = React.useCallback(
    (element: any, sectionId: string, index: any) => {
      setFormData((prevFormData) =>
        prevFormData.map((section) =>
          section.id === sectionId
            ? {
              ...section,
              questionData: [
                ...section.questionData.slice(0, index),
                element,
                ...section.questionData.slice(index),
              ],
            }
            : section,
        ),
      );
    },
    [],
  );
  const updateGridElement = React.useCallback(
    (gridIndex: number, element: any, sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData.map((section) =>
          section.id === sectionId
            ? {
              ...section,
              questionData: section.questionData.map((question: any) =>
                question.type === "grid" && question.gridData
                  ? {
                    ...question,
                    gridData: question.gridData
                      .map((grid: any, index: number) =>
                        index === gridIndex
                          ? {
                            ...grid,
                            ...element,
                          }
                          : grid,
                      )
                      .concat(
                        gridIndex >= question.gridData.length
                          ? { ...element }
                          : [],
                      ),
                  }
                  : question,
              ),
            }
            : section,
        ),
      );
    },
    [],
  );
  const updateElement = React.useCallback((value: any, sectionId: string) => {
    setFormData((prevFormData) =>
      prevFormData.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questionData: section.questionData.map((ele: any) =>
              ele.id === value.id ? { ...ele, ...value } : ele,
            ),
          }
          : section,
      ),
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
          : section,
      ),
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
      addElementInPosition,
      updateElement,
      addSection,
      removeSection,
      updateSection,
      isDragging,
      setIsDragging,
      selectedSection,
      setSelectedSection,
      activeSections,
      setActiveSections,
      updateGridElement,
      answerData,
      setAnswerData,
      uploadUrl,
      setUploadUrl, duplicateElement
    }),
    [
      formData,
      handleDragStop,
      removeElement,
      elementData,
      updateElementPosition,
      addElement,
      addElementInPosition,
      updateElement,
      addSection,
      removeSection,
      updateSection,
      isDragging,
      selectedSection,
      activeSections,
      updateGridElement,
      answerData,
      uploadUrl, duplicateElement
    ],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export default EditorContext;
