import React, { useState, useEffect } from "react";
import AppIcon from "../ui/AppIcon";

const RankingInput = ({ element, state, validationData }: any) => {
  const { isReadOnly, register, watch, setValue } = validationData || {};
  
  // Default to element options if value not set
  const currentValue = typeof watch === 'function' ? watch(element.id) : undefined;
  const [items, setItems] = useState<any[]>(currentValue || element.options || []);

  useEffect(() => {
    if (currentValue && Array.isArray(currentValue) && currentValue.length > 0) {
      setItems(currentValue);
    } else if (element.options && element.options.length > 0) {
      setItems(element.options);
    }
  }, [currentValue, element.options]);

  const moveUp = (index: number) => {
    if (isReadOnly || state === "edit" || index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    if (typeof setValue === 'function') {
      setValue(element.id, newItems, { shouldValidate: true, shouldDirty: true });
    }
  };

  const moveDown = (index: number) => {
    if (isReadOnly || state === "edit" || index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    if (typeof setValue === 'function') {
      setValue(element.id, newItems, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      {items.map((opt: any, index: number) => (
        <div
          key={opt.id}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex flex-col text-gray-400">
            <button 
              type="button" 
              onClick={() => moveUp(index)} 
              disabled={isReadOnly || state === "edit" || index === 0}
              className="hover:text-[#6366f1] disabled:opacity-30 disabled:hover:text-gray-400"
            >
              <AppIcon icon="mdi:chevron-up" iconClass="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={() => moveDown(index)} 
              disabled={isReadOnly || state === "edit" || index === items.length - 1}
              className="hover:text-[#6366f1] disabled:opacity-30 disabled:hover:text-gray-400"
            >
              <AppIcon icon="mdi:chevron-down" iconClass="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 text-sm font-medium text-gray-700">
            {opt.label}
          </div>
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-[#6366f1]">
            {index + 1}
          </div>
        </div>
      ))}
      {typeof register === 'function' && (
        <input type="hidden" {...register(element.id)} />
      )}
    </div>
  );
};

export default RankingInput;
