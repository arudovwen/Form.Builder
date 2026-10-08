import React, { useEffect, useMemo } from "react";
import clsx from "clsx";

export default function CalculatedField({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
  state?: string;
}) {
  const { watch, setValue } = validationData || {};

  // Extract variables from the formula: {{id}} or @[display](id)
  const formula = element?.formula || "";
  
  const variableMatches = useMemo(() => {
    const matches1 = formula.match(/\{\{([^{}]+)\}\}/g) || [];
    const ids1 = matches1.map((m: string) => m.replace(/[{}]/g, ""));

    const matches2 = formula.match(/@\[.*?\]\((.*?)\)/g) || [];
    const ids2 = matches2.map((m: string) => {
      const exec = /@\[.*?\]\((.*?)\)/.exec(m);
      return exec ? exec[1] : "";
    }).filter(Boolean);

    return Array.from(new Set([...ids1, ...ids2]));
  }, [formula]);

  // Watch those specific fields if watch is available
  // If watch is not a function (e.g. in Editor view), this will return undefined for all.
  const watchedValues = watch ? watch(variableMatches) : [];

  const evaluatedResult = useMemo(() => {
    if (!formula) return "";
    let expression = formula;

    let hasMissingVariables = false;

    variableMatches.forEach((id: string, index: number) => {
      const val = watchedValues[index];
      // If the referenced field is empty or not a number, we might want to default to 0
      const numVal = Number(val);
      if (isNaN(numVal) || val === undefined || val === null || val === "") {
        hasMissingVariables = true;
      }
      // Use string replacement for both formula formats
      expression = expression.replace(new RegExp(`\\{\\{${id}\\}\\}`, 'g'), String(numVal || 0));
      expression = expression.replace(new RegExp(`@\\[.*?\\]\\(${id}\\)`, 'g'), String(numVal || 0));
    });

    if (hasMissingVariables) return "";

    try {
      // Sanitize the expression to allow only math operations and numbers
      const sanitizedExpression = expression.replace(/[^0-9+\-*/().\s]/g, "");
      if (!sanitizedExpression) return "";
      
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${sanitizedExpression}`)();
      
      // Round to 2 decimal places if it's a float
      if (!isNaN(result) && result !== null) {
         return Number.isInteger(result) ? result : Number(result.toFixed(2));
      }
      return "";
    } catch {
      return "Error";
    }
  }, [formula, variableMatches, watchedValues]);

  // Set the value back to the form state when it changes
  useEffect(() => {
    if (setValue && evaluatedResult !== "Error" && evaluatedResult !== "") {
      setValue(element.id, evaluatedResult, { shouldValidate: true, shouldDirty: true });
    }
  }, [evaluatedResult, element.id, setValue]);

  return (
    <div>
      <input
        placeholder={element?.placeholder || "Calculated result"}
        type="text"
        className={clsx("field-control bg-gray-100 cursor-not-allowed", element?.customClass)}
        value={evaluatedResult}
        readOnly
        disabled={true}
        aria-invalid={!!validationData?.errors?.[element?.id]}
      />
    </div>
  );
}
