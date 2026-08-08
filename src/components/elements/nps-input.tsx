import React from "react";
import clsx from "clsx";

const NpsInput = ({ element, state, validationData }: any) => {
  const { isReadOnly, register, watch, setValue } = validationData || {};
  const selectedValue = typeof watch === 'function' ? watch(element.id) : undefined;

  const handleSelect = (num: number) => {
    if (isReadOnly || state === "edit") return;
    if (typeof setValue === 'function') {
      setValue(element.id, num, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mt-2 gap-1 overflow-x-auto pb-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleSelect(num)}
            disabled={isReadOnly || state === "edit"}
            className={clsx(
              "flex-1 min-w-[36px] h-10 px-1 rounded-md border font-medium transition-colors disabled:opacity-50",
              selectedValue === num 
                ? "border-[#6366f1] bg-[#6366f1] text-white" 
                : "border-gray-200 bg-white text-gray-700 hover:border-[#6366f1] hover:text-[#6366f1]"
            )}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>{element.minLabel || "Not at all likely"}</span>
        <span>{element.maxLabel || "Extremely likely"}</span>
      </div>
      {typeof register === 'function' && (
        <input type="hidden" {...register(element.id)} />
      )}
    </div>
  );
};

export default NpsInput;
