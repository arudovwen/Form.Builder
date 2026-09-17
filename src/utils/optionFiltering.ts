import { OptionType } from "./contants";

/**
 * Filter an options array based on the parent field's current value.
 *
 * Rules:
 * 1. If no filterByFieldId is configured, all options are returned.
 * 2. If parentFieldValue is empty (undefined, null, "", or []), all options are returned as default.
 * 3. If parentFieldValue is an array (e.g. parent is checkbox/multiSelect), options
 *    whose filterValue/key is included in that array (or has no filter condition) are returned.
 * 4. If parentFieldValue is a string/number/object, options whose filterValue/key matches
 *    (case-insensitive) OR options with no filter condition are returned.
 */
export function getFilteredOptions(
  options?: (OptionType | any)[],
  filterByFieldId?: string,
  parentFieldValue?: any,
): (OptionType | any)[] {
  if (!options || !Array.isArray(options)) return [];
  if (!filterByFieldId || filterByFieldId.trim() === "") return options;

  // Extract raw value if parentFieldValue is an object like { label, value }
  const rawParentVal =
    typeof parentFieldValue === "object" &&
    parentFieldValue !== null &&
    !Array.isArray(parentFieldValue) &&
    "value" in parentFieldValue
      ? parentFieldValue.value
      : parentFieldValue;

  const isParentEmpty =
    rawParentVal === undefined ||
    rawParentVal === null ||
    rawParentVal === "" ||
    (Array.isArray(rawParentVal) && rawParentVal.length === 0);

  if (isParentEmpty) {
    // If the dependent parent field is not selected yet, return the entire options as default
    return options;
  }

  // If parent value is an array (e.g. from checkbox or multiSelect)
  if (Array.isArray(rawParentVal)) {
    const parentValStrings = rawParentVal.map((v) => {
      const inner =
        typeof v === "object" && v !== null && "value" in v ? v.value : v;
      return String(inner).trim().toLowerCase();
    });

    return options.filter((opt) => {
      const fVal = opt?.filterValue ?? opt?.key;
      if (
        fVal === undefined ||
        fVal === null ||
        String(fVal).trim() === ""
      ) {
        return true; // No filter condition -> always visible
      }
      return parentValStrings.includes(String(fVal).trim().toLowerCase());
    });
  }

  // Scalar / Primitive parent value comparison
  const normalizedParentStr = String(rawParentVal).trim().toLowerCase();

  return options.filter((opt) => {
    const fVal = opt?.filterValue ?? opt?.key;
    if (
      fVal === undefined ||
      fVal === null ||
      String(fVal).trim() === ""
    ) {
      return true; // No filter condition -> always visible
    }
    return String(fVal).trim().toLowerCase() === normalizedParentStr;
  });
}

/**
 * Resolves the parent field's current value from various potential state sources:
 * RHF watch -> RHF getValues -> EditorContext answerData.
 */
export function getParentFieldValue(
  filterByFieldId?: string,
  validationData?: any,
  answerData?: any,
): any {
  if (!filterByFieldId) return undefined;

  const { watch, getValues } = validationData || {};

  if (typeof watch === "function") {
    const watchedVal = watch(filterByFieldId);
    if (watchedVal !== undefined) return watchedVal;
  }

  if (typeof getValues === "function") {
    const formVal = getValues(filterByFieldId);
    if (formVal !== undefined) return formVal;
  }

  if (answerData && typeof answerData === "object") {
    const ctxVal = answerData[filterByFieldId];
    if (ctxVal !== undefined) return ctxVal;
  }

  return undefined;
}

/**
 * Checks if a single option value exists within the filtered options list.
 */
export function isValueInOptions(
  val: any,
  options: (OptionType | any)[],
): boolean {
  if (val === undefined || val === null || val === "") return true;
  const raw =
    typeof val === "object" && val !== null && "value" in val
      ? val.value
      : val;
  const targetStr = String(raw).trim().toLowerCase();
  return options.some((opt) => {
    const optVal =
      typeof opt === "object" && opt !== null && "value" in opt
        ? opt.value
        : opt;
    return String(optVal).trim().toLowerCase() === targetStr;
  });
}

/**
 * Prunes an array of selected values (e.g. for multi-select / checkbox)
 * so that only items present in the active filtered options remain.
 */
export function pruneSelectedValues(
  selectedList: any[],
  filteredOptions: (OptionType | any)[],
): any[] {
  if (!Array.isArray(selectedList)) return selectedList;
  return selectedList.filter((item) => isValueInOptions(item, filteredOptions));
}
