import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface EditorProviderProps {
  children: React.ReactNode;
  onChange?: (data: any) => void;
  onLogAction?: (action: string, value: any) => void;
}

const EditorContext = createContext<
  | {
      showPreview: boolean;
      setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
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
      copyElement: (elementId: string, sectionId: string) => void;
      pasteElement: (sectionId: string, targetIndex?: number) => void;
      apiActivityCount: number;
      setApiActivityCount: React.Dispatch<React.SetStateAction<number>>;
      /**
       * Universal element move:
       *  - canvas  → canvas  (reorder by index)
       *  - grid    → canvas  (eject; targetIndex = insertion point)
       *  - canvas  → grid    (inject into col; targetGridId + targetCol required)
       *  - grid    → grid    (transfer between cells)
       */
      moveElement: (opts: {
        draggedId: string;
        sectionId: string;
        targetIndex?: number; // canvas drop position
        targetId?: string; // canvas target element id (for reorder)
        targetGridId?: string; // grid we're dropping INTO
        targetCol?: number; // column inside that grid (1-based)
      }) => void;
      undo: () => void;
      redo: () => void;
      canUndo: boolean;
      canRedo: boolean;
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
  disabled: false,
  isHidden: false,
};
export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  onChange,
  onLogAction,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [answerData, setAnswerData] = useState({});
  const [elementData, setElementData] = useState({});
  const [formDataState, _setFormDataState] = useState<any[]>([newSection]);
  const [past, setPast] = useState<any[][]>(() => {
    try {
      const saved = sessionStorage.getItem("editor_past");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [future, setFuture] = useState<any[][]>(() => {
    try {
      const saved = sessionStorage.getItem("editor_future");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (onChange) {
      onChange(formDataState);
    }
  }, [formDataState, onChange]);

  useEffect(() => {
    try {
      sessionStorage.setItem("editor_past", JSON.stringify(past));
    } catch (e) {
      console.warn("Could not save editor_past to sessionStorage", e);
    }
  }, [past]);

  useEffect(() => {
    try {
      sessionStorage.setItem("editor_future", JSON.stringify(future));
    } catch (e) {
      console.warn("Could not save editor_future to sessionStorage", e);
    }
  }, [future]);

  const lastSaveRef = useRef<number>(Date.now());

  const setFormData = React.useCallback((newValOrUpdater: any) => {
    _setFormDataState((prev: any[]) => {
      const nextVal =
        typeof newValOrUpdater === "function"
          ? newValOrUpdater(prev)
          : newValOrUpdater;

      if (JSON.stringify(prev) !== JSON.stringify(nextVal)) {
        const now = Date.now();
        setPast((p) => {
          if (
            p.length > 0 &&
            JSON.stringify(p[p.length - 1]) === JSON.stringify(prev)
          ) {
            return p;
          }

          if (now - lastSaveRef.current < 800 && p.length > 0) {
            lastSaveRef.current = now;
            return p;
          }

          lastSaveRef.current = now;
          const newPast = [...p, prev];
          return newPast.length > 20 ? newPast.slice(newPast.length - 20) : newPast;
        });
        setFuture([]);
      }

      return nextVal;
    });
  }, []);

  const undo = React.useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([formDataState, ...future]);
    _setFormDataState(previous);
    onLogAction?.("UNDO", null);
  }, [past, future, formDataState, onLogAction]);

  const redo = React.useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setFuture(newFuture);
    setPast([...past, formDataState]);
    _setFormDataState(next);
    onLogAction?.("REDO", null);
  }, [past, future, formDataState, onLogAction]);

  const formData = formDataState;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [activeSections, setActiveSections] = useState<Array<string | number>>([
    0,
  ]);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [apiActivityCount, setApiActivityCount] = useState<number>(0);
  const handleDragStop = React.useCallback(() => {
    // Handle drag stop (implementation depends on requirements)
  }, []);

  const addSection = React.useCallback(() => {
    const id = uuidv4();
    setFormData((prevFormData) => [...prevFormData, { ...newSection, id }]);
    setSelectedSection(id);
    setActiveSections([formData.length]);
    onLogAction?.("ADD_SECTION", { sectionId: id });
  }, [formData, onLogAction, setFormData]);
  const removeSection = React.useCallback(
    (sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData.filter((i) => i.id !== sectionId),
      );

      setSelectedSection(null);
      onLogAction?.("REMOVE_SECTION", { sectionId });
    },
    [onLogAction, setFormData],
  );
  const removeElement = React.useCallback(
    (elementId: string, sectionId: string) => {
      const section = formData.find((section) => section.id === sectionId);
      const elementData = section?.questionData.find(
        (el: { id: string }) => el.id === elementId,
      );

      if (!elementData) return;

      setFormData((prevFormData) =>
        prevFormData?.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questionData: section?.questionData.filter((element: any) => {
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
      onLogAction?.("REMOVE_ELEMENT", { sectionId, elementId });
    },
    [formData, setFormData, onLogAction],
  );
  const duplicateElement = React.useCallback(
    (elementId: string, sectionId: string) => {
      const section = formData.find((sec) => sec.id === sectionId);
      if (!section) return;

      const elementIndex = section?.questionData.findIndex(
        (el: any) => el.id === elementId,
      );
      if (elementIndex === -1) return;

      const original = section?.questionData[elementIndex];

      const deepCloneWithNewId = (obj: any, overrides: any = {}) => ({
        ...JSON.parse(JSON.stringify(obj)),
        id: uuidv4(),
        ...overrides,
      });

      setFormData((prevFormData) =>
        prevFormData?.map((sec: any) => {
          if (sec.id !== sectionId) return sec;

          const qd = [...sec.questionData];

          if (original.type === "grid") {
            // Duplicate a grid and all its children
            const relatedIndices = qd
              ?.map((e, i) => ({ e, i }))
              .filter(
                ({ e }) => e.id === original.id || e.gridId === original.id,
              )
              ?.map(({ i }) => i);

            const insertAfter = relatedIndices.length
              ? Math.max(...relatedIndices) + 1
              : elementIndex + 1;

            const newGridId = uuidv4();
            const newGrid = deepCloneWithNewId(original, {});
            newGrid.id = newGridId;

            const children = qd.filter((e: any) => e.gridId === original.id);
            const newChildren = children?.map((child: any) =>
              deepCloneWithNewId(child, { gridId: newGridId }),
            );

            const newQuestionData = [
              ...qd.slice(0, insertAfter),
              newGrid,
              ...newChildren,
              ...qd.slice(insertAfter),
            ];

            return { ...sec, questionData: newQuestionData };
          } else if (original.gridId) {
            // Duplicate a grid child → eject clone to canvas (strip grid bindings)
            // so we don't have to worry about column capacity.
            // Insert it right after the last element that belongs to the same grid.
            const rest = { ...original };
            delete rest.gridId;
            delete rest.gridPosition;
            const newElement = deepCloneWithNewId(rest, {});

            // Find the last index of any element in the same grid group
            const lastGridSiblingIndex = qd.reduce(
              (last: number, el: any, i: number) =>
                el.id === original.gridId || el.gridId === original.gridId
                  ? i
                  : last,
              elementIndex,
            );

            const newQuestionData = [
              ...qd.slice(0, lastGridSiblingIndex + 1),
              newElement,
              ...qd.slice(lastGridSiblingIndex + 1),
            ];
            return { ...sec, questionData: newQuestionData };
          } else {
            // Duplicate a normal canvas element
            const newElement = deepCloneWithNewId(original, {});
            const newQuestionData = [
              ...qd.slice(0, elementIndex + 1),
              newElement,
              ...qd.slice(elementIndex + 1),
            ];
            return { ...sec, questionData: newQuestionData };
          }
        }),
      );
      onLogAction?.("DUPLICATE_ELEMENT", { sectionId, elementId });
    },
    [formData, setFormData, onLogAction],
  );

  const copyElement = React.useCallback(
    (elementId: string, sectionId: string) => {
      const section = formData.find((sec) => sec.id === sectionId);
      if (!section) return;

      const elementIndex = section?.questionData.findIndex(
        (el: any) => el.id === elementId,
      );
      if (elementIndex === -1) return;

      const original = section?.questionData[elementIndex];
      let copiedData = null;

      if (original.type === "grid") {
        const children = section.questionData.filter(
          (e: any) => e.gridId === original.id
        );
        copiedData = {
          type: "FORM_BUILDER_CLIPBOARD",
          element: original,
          children: children,
          timestamp: Date.now(),
        };
      } else if (original.gridId) {
        const rest = { ...original };
        delete rest.gridId;
        delete rest.gridPosition;
        copiedData = {
          type: "FORM_BUILDER_CLIPBOARD",
          element: rest,
          timestamp: Date.now(),
        };
      } else {
        copiedData = {
          type: "FORM_BUILDER_CLIPBOARD",
          element: original,
          timestamp: Date.now(),
        };
      }

      if (copiedData) {
        const payloadString = JSON.stringify(copiedData);
        try {
          localStorage.setItem("form_builder_clipboard", payloadString);
          
          // Also try to write to system clipboard
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(payloadString).catch(() => {
              // Silently ignore if browser denies write permission
            });
          }

          toast.success("Element copied to clipboard");
          onLogAction?.("COPY_ELEMENT", { sectionId, elementId });
        } catch (e) {
          console.warn("Could not copy element to clipboard", e);
          toast.error("Failed to copy element");
        }
      }
    },
    [formData, onLogAction],
  );

  const pasteElement = React.useCallback(
    async (sectionId: string, targetIndex?: number, directClipboardText?: string) => {
      let clipboardString = "";

      if (directClipboardText && directClipboardText.includes("FORM_BUILDER_CLIPBOARD")) {
        clipboardString = directClipboardText;
      }

      // Try system clipboard if no valid direct text was provided
      if (!clipboardString && navigator.clipboard && navigator.clipboard.readText) {
        try {
          const sysClipboard = await navigator.clipboard.readText();
          if (sysClipboard && sysClipboard.includes("FORM_BUILDER_CLIPBOARD")) {
            clipboardString = sysClipboard;
          }
        } catch (err) {
          console.warn("Could not parse clipboard data", err);
          // Ignore read errors (e.g. user denied permission) and fallback
        }
      }

      // Fallback to localStorage if system clipboard is empty or denied
      if (!clipboardString) {
        clipboardString = localStorage.getItem("form_builder_clipboard") || "";
      }

      if (!clipboardString) {
        toast.error("Nothing to paste. Copy an element first.");
        return;
      }

      try {
        const copiedData = JSON.parse(clipboardString);
        if (copiedData?.type !== "FORM_BUILDER_CLIPBOARD" || !copiedData?.element) {
          toast.error("Invalid clipboard data.");
          return;
        }

        // Check timestamp for 1-minute expiration
        if (copiedData.timestamp) {
          const isExpired = Date.now() - copiedData.timestamp > 60000;
          if (isExpired) {
            toast.error("Copied element has expired (1 minute limit).");
            localStorage.removeItem("form_builder_clipboard"); // Clean up
            return;
          }
        }

        const deepCloneWithNewId = (obj: any, overrides: any = {}) => ({
          ...JSON.parse(JSON.stringify(obj)),
          id: uuidv4(),
          ...overrides,
        });

        setFormData((prevFormData) =>
          prevFormData?.map((sec: any) => {
            if (sec.id !== sectionId) return sec;

            const qd = [...sec.questionData];
            const newQuestionData = [...qd];

            if (copiedData.element.type === "grid") {
              const newGridId = uuidv4();
              const newGrid = deepCloneWithNewId(copiedData.element, { id: newGridId, sectionId });
              
              const newChildren = (copiedData.children || []).map((child: any) =>
                deepCloneWithNewId(child, { gridId: newGridId, sectionId })
              );

              if (targetIndex !== undefined) {
                newQuestionData.splice(targetIndex, 0, newGrid, ...newChildren);
              } else {
                newQuestionData.push(newGrid, ...newChildren);
              }
            } else {
              const newElement = deepCloneWithNewId(copiedData.element, { sectionId });
              if (targetIndex !== undefined) {
                newQuestionData.splice(targetIndex, 0, newElement);
              } else {
                newQuestionData.push(newElement);
              }
            }

            return { ...sec, questionData: newQuestionData };
          })
        );
        toast.success("Element pasted successfully");
        onLogAction?.("PASTE_ELEMENT", { sectionId });
      } catch (e) {
        console.warn("Could not paste element from clipboard", e);
        toast.error("Failed to paste element");
      }
    },
    [setFormData, onLogAction],
  );

  const updateElementPosition = React.useCallback(
    (updatedQuestionData: any[], sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData?.map((section) =>
          section.id === sectionId
            ? { ...section, questionData: updatedQuestionData }
            : section,
        ),
      );
      onLogAction?.("UPDATE_ELEMENT_POSITION", { sectionId });
    },
    [setFormData, onLogAction],
  );

  const addElement = React.useCallback(
    (element: any, sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData?.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questionData: [...(section?.questionData || []), element],
              }
            : section,
        ),
      );
      onLogAction?.("ADD_ELEMENT", { sectionId, element });
    },
    [setFormData, onLogAction],
  );
  const addElementInPosition = React.useCallback(
    (element: any, sectionId: string, index: number) => {
      setFormData((prevFormData) =>
        prevFormData?.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questionData: [
                  ...(section?.questionData || []).slice(0, index),
                  element,
                  ...(section?.questionData || []).slice(index),
                ],
              }
            : section,
        ),
      );
      onLogAction?.("ADD_ELEMENT_IN_POSITION", { sectionId, element, index });
    },
    [setFormData, onLogAction],
  );
  const updateGridElement = React.useCallback(
    (gridIndex: number, element: any, sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData?.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questionData: section?.questionData?.map((question: any) =>
                  question.type === "grid" && question.gridData
                    ? {
                        ...question,
                        gridData: question.gridData
                          ?.map((grid: any, index: number) =>
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
      onLogAction?.("UPDATE_GRID_ELEMENT", { sectionId, gridIndex, element });
    },
    [setFormData, onLogAction],
  );
  const updateElement = React.useCallback(
    (value: any, sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData?.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questionData: section?.questionData?.map((ele: any) =>
                  ele.id === value.id ? { ...ele, ...value } : ele,
                ),
              }
            : section,
        ),
      );
      onLogAction?.("UPDATE_ELEMENT", { sectionId, value });
    },
    [setFormData, onLogAction],
  );

  /**
   * moveElement — handles all four cross-context drag scenarios:
   *   1. canvas  → canvas  : plain reorder
   *   2. grid    → canvas  : strip gridId / gridPosition, insert at index
   *   3. canvas  → grid    : set gridId + gridPosition, keep in questionData
   *   4. grid    → grid    : update gridId + gridPosition (same or different grid)
   */
  const moveElement = React.useCallback(
    (opts: {
      draggedId: string;
      sectionId: string;
      targetIndex?: number;
      targetId?: string;
      targetGridId?: string;
      targetCol?: number;
    }) => {
      const {
        draggedId,
        sectionId,
        targetIndex,
        targetId,
        targetGridId,
        targetCol,
      } = opts;

      setFormData((prevFormData: any[]) => {
        let dragged: any = null;
        let draggedChildren: any[] = [];
        let sourceSectionId: string | null = null;
        let sourceDraggedIdx = -1;

        for (const section of prevFormData) {
          const idx = section.questionData?.findIndex(
            (el: any) => el.id === draggedId,
          );
          if (idx !== -1) {
            dragged = section.questionData[idx];
            sourceSectionId = section.id;
            sourceDraggedIdx = idx;
            if (dragged.type === "grid") {
              draggedChildren = section.questionData.filter(
                (el: any) => el.gridId === dragged.id,
              );
            }
            break;
          }
        }

        if (!dragged) return prevFormData;

        // Block: a grid cannot be nested inside another grid
        if (targetGridId !== undefined && dragged.type === "grid") {
          return prevFormData;
        }

        const movedElement = { ...dragged, sectionId };

        return prevFormData.map((section) => {
          let qd: any[] = [...(section.questionData || [])];

          if (section.id !== sourceSectionId && section.id !== sectionId) {
            return section;
          }

          // Same section move
          if (sourceSectionId === sectionId && section.id === sectionId) {
            const draggedIdx = sourceDraggedIdx;

            // ── Scenario 3 & 4: drop INTO a grid cell ──────────────────────────
            if (targetGridId !== undefined && targetCol !== undefined) {
              const occupantIdx = qd.findIndex(
                (el: any) =>
                  el.id !== draggedId &&
                  el.gridId === targetGridId &&
                  el.gridPosition?.col === targetCol,
              );

              let newQd = qd.map((el: any) =>
                el.id === draggedId
                  ? {
                      ...movedElement,
                      gridId: targetGridId,
                      gridPosition: { col: targetCol },
                    }
                  : el,
              );

              if (occupantIdx !== -1) {
                newQd = newQd.map((el: any, i: number) => {
                  if (i !== occupantIdx) return el;
                  const ejected = { ...el };
                  delete ejected.gridId;
                  delete ejected.gridPosition;
                  return ejected;
                });
              }

              return { ...section, questionData: newQd };
            }

            // ── Scenario 2: eject from grid → canvas at targetIndex ────────────
            if (
              movedElement.gridId &&
              targetIndex !== undefined &&
              targetGridId === undefined
            ) {
              const stripped = { ...movedElement };
              delete stripped.gridId;
              delete stripped.gridPosition;
              const without = prevFormData.find(
                (s: any) => s.id === sectionId,
              )?.questionData?.filter((el: any) => el.gridId !== draggedId) || [];
              const insertAt = Math.min(targetIndex, without.length);
              without.splice(insertAt, 0, stripped);
              return { ...section, questionData: without };
            }

            // ── Scenario 1a: canvas → canvas reorder by targetIndex ──────────
            if (
              !movedElement.gridId &&
              targetIndex !== undefined &&
              targetGridId === undefined &&
              !targetId
            ) {
              qd.splice(draggedIdx, 1);
              const insertAt = Math.min(targetIndex, qd.length);
              qd.splice(insertAt, 0, movedElement);
              return { ...section, questionData: qd };
            }

            // ── Scenario 1b: canvas → canvas reorder by targetId ───────────────
            if (targetId) {
              const toIdx = qd.findIndex((el: any) => el.id === targetId);
              if (toIdx === -1) return section;
              qd.splice(draggedIdx, 1);
              qd.splice(toIdx, 0, movedElement);
              return { ...section, questionData: qd };
            }

            return section;
          }

          // Different section move - Remove from source
          if (section.id === sourceSectionId && section.id !== sectionId) {
            qd.splice(sourceDraggedIdx, 1);
            if (draggedChildren.length > 0) {
              qd = qd.filter((el: any) => el.gridId !== dragged.id);
            }
            return { ...section, questionData: qd };
          }

          // Different section move - Insert into target
          if (section.id === sectionId && section.id !== sourceSectionId) {
            const newChildren = draggedChildren.map((c: any) => ({
              ...c,
              sectionId,
            }));

            // ── Scenario 3 & 4
            if (targetGridId !== undefined && targetCol !== undefined) {
              const occupantIdx = qd.findIndex(
                (el: any) =>
                  el.gridId === targetGridId &&
                  el.gridPosition?.col === targetCol,
              );
              const newMovedElement = {
                ...movedElement,
                gridId: targetGridId,
                gridPosition: { col: targetCol },
              };

              if (occupantIdx !== -1) {
                const ejected = { ...qd[occupantIdx] };
                delete ejected.gridId;
                delete ejected.gridPosition;
                qd[occupantIdx] = ejected;
                qd.push(newMovedElement, ...newChildren);
              } else {
                qd.push(newMovedElement, ...newChildren);
              }
              return { ...section, questionData: qd };
            }

            // ── Scenario 2 & 1a
            if (
              targetIndex !== undefined &&
              targetGridId === undefined &&
              !targetId
            ) {
              const stripped = { ...movedElement };
              delete stripped.gridId;
              delete stripped.gridPosition;
              const insertAt = Math.min(targetIndex, qd.length);
              qd.splice(insertAt, 0, stripped, ...newChildren);
              return { ...section, questionData: qd };
            }

            // ── Scenario 1b
            if (targetId) {
              const stripped = { ...movedElement };
              delete stripped.gridId;
              delete stripped.gridPosition;
              const toIdx = qd.findIndex((el: any) => el.id === targetId);
              if (toIdx !== -1) {
                qd.splice(toIdx, 0, stripped, ...newChildren);
              } else {
                qd.push(stripped, ...newChildren);
              }
              return { ...section, questionData: qd };
            }

            // Fallback
            const stripped = { ...movedElement };
            delete stripped.gridId;
            delete stripped.gridPosition;
            qd.push(stripped, ...newChildren);
            return { ...section, questionData: qd };
          }

          return section;
        });
      });
      onLogAction?.("MOVE_ELEMENT", opts);
    },
    [setFormData, onLogAction],
  );

  const updateSection = React.useCallback(
    (value: any, sectionId: string) => {
      setFormData((prevFormData) =>
        prevFormData?.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                ...value,
              }
            : section,
        ),
      );
      onLogAction?.("UPDATE_SECTION", { sectionId, value });
    },
    [setFormData, onLogAction],
  );

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
      setUploadUrl,
      apiActivityCount,
      setApiActivityCount,
      duplicateElement,
      moveElement,
      showPreview,
      setShowPreview,
      undo,
      redo,
      canUndo,
      canRedo,
      copyElement,
      pasteElement,
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
      uploadUrl,
      apiActivityCount,
      duplicateElement,
      moveElement,
      showPreview,
      undo,
      redo,
      canUndo,
      canRedo,
      copyElement,
      pasteElement,
    ],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export default EditorContext;
