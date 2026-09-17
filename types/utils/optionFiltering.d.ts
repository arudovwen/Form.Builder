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
export declare function getFilteredOptions(options?: (OptionType | any)[], filterByFieldId?: string, parentFieldValue?: any): (OptionType | any)[];
/**
 * Resolves the parent field's current value from various potential state sources:
 * RHF watch -> RHF getValues -> EditorContext answerData.
 */
export declare function getParentFieldValue(filterByFieldId?: string, validationData?: any, answerData?: any): any;
/**
 * Checks if a single option value exists within the filtered options list.
 */
export declare function isValueInOptions(val: any, options: (OptionType | any)[]): boolean;
/**
 * Prunes an array of selected values (e.g. for multi-select / checkbox)
 * so that only items present in the active filtered options remain.
 */
export declare function pruneSelectedValues(selectedList: any[], filteredOptions: (OptionType | any)[]): any[];
