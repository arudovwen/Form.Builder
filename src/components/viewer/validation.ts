import * as yup from "yup";

interface formData {
  id: string;
  type:
    | "textField"
    | "longText"
    | "numberField"
    | "amountField"
    | "selectField"
    | "checkbox"
    | "email"
    | "date"
    | "matrix"
    | "url";
  isRequired?: boolean;
  requiredMessage?: string;
  minLength?: number;
  maxLength?: number;
  minAmount?: number;
  maxAmount?: number;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  minAmountMessage?: string;
  maxAmountMessage?: string;
  isDisabled?: boolean;
}

interface Section {
  formData: formData[];
}

const DEFAULT_MESSAGES = {
  required: "This field is required",
  email: "Invalid email format",
  url: "Invalid url format",
  minLength: (min: number) => `Minimum length is ${min}`,
  maxLength: (max: number) => `Maximum length is ${max}`,
  minAmount: (min: number) => `Minimum amount is ${min}`,
  maxAmount: (max: number) => `Maximum amount is ${max}`,
} as const;

const getBaseSchema = (type: formData["type"]) => {
  const schemas = {
    textField: yup.string().nullable(),
    longText: yup.string().nullable(),
    numberField: yup
      .number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
    amountField: yup
      .number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
    selectField: yup.string().nullable(),
    checkbox: yup.mixed().nullable(),
    radio: yup.mixed().nullable(),
    matrix: yup.mixed().nullable(),
    email: yup
      .string()
      .nullable()
      .test("email-format", DEFAULT_MESSAGES.email, (value) => {
        // Skip validation if no value is entered
        if (!value || value.trim() === "") return true;
        return /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      }),
    date: yup
      .date()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === null) return null;
        return value;
      })
      .typeError("Invalid date"),
    url: yup
      .string()
      .nullable()
      .test("url-format", DEFAULT_MESSAGES.url, (value) => {
        // Skip validation if no value is entered
        if (!value || value.trim() === "") return true;
        return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(
          value,
        );
      }),
  };

  return schemas[type] || yup.mixed().nullable();
};

const addRequiredValidation = (
  schema: yup.Schema<any>,
  isRequired?: boolean,
  message?: string,
) => {
  if (!isRequired) return schema;

  if (schema.type === "boolean") {
    return schema.oneOf([true], message || DEFAULT_MESSAGES.required);
  }

  return schema.required(message || DEFAULT_MESSAGES.required);
};

const addTextValidations = (
  schema: yup.StringSchema,
  {
    minLength,
    maxLength,
    minLengthMessage,
    maxLengthMessage,
  }: Partial<formData>,
) => {
  let updatedSchema = schema;

  if (minLength) {
    updatedSchema = updatedSchema.min(
      minLength,
      minLengthMessage || DEFAULT_MESSAGES.minLength(minLength),
    );
  }

  if (maxLength) {
    updatedSchema = updatedSchema.max(
      maxLength,
      maxLengthMessage || DEFAULT_MESSAGES.maxLength(maxLength),
    );
  }

  return updatedSchema;
};

const addNumberValidations = (
  schema: yup.NumberSchema,
  {
    minAmount,
    maxAmount,
    minAmountMessage,
    maxAmountMessage,
  }: Partial<formData>,
) => {
  let updatedSchema = schema;

  if (minAmount) {
    updatedSchema = updatedSchema.min(
      parseFloat(String(minAmount)),
      minAmountMessage || DEFAULT_MESSAGES.minAmount(minAmount),
    );
  }

  if (maxAmount) {
    updatedSchema = updatedSchema.max(
      parseFloat(String(maxAmount)),
      maxAmountMessage || DEFAULT_MESSAGES.maxAmount(maxAmount),
    );
  }

  return updatedSchema;
};

export const evaluateVisibility = (question: any, answerData: any) => {
  if (question?.isFieldDeleted || question?.isDeleted) return false;
  if (!question.isHidden) return true;
  const fields = question.visibilityDependentFields || [];
  if (!fields.length) return true;

  return fields.every((field: any) => {
    const fieldId = typeof field === "object" ? (field?.id || field?.value) : field;
    if (!fieldId) return true;

    const value = answerData?.[fieldId];
    const valA = typeof field === "object" ? field?.fieldValue : "";
    const valB = value;

    const toStr = (v: any) => {
      if (v === undefined || v === null) return "";
      if (typeof v === "object" && "value" in v)
        return String(v.value ?? "").toLowerCase();
      return String(v).toLowerCase();
    };

    if (valB === undefined || valB === null || valB === "") {
      if (field?.operator === "not_equals") {
        if (Array.isArray(valA)) return valA.length > 0;
        return valA !== undefined && valA !== null && valA !== "";
      }
      if (field?.operator === "equals") {
        if (Array.isArray(valA)) return valA.length === 0;
        return valA === undefined || valA === null || valA === "";
      }
      return false;
    }

    // When expected value valA is an array (multiple values selected in visibility rule)
    if (Array.isArray(valA)) {
      const valAStrings = valA.map(toStr).filter((s) => s !== "");

      if (valAStrings.length === 0) {
        return field?.operator === "not_equals";
      }

      // If answered value valB is also an array (e.g. multiSelect, checkbox)
      if (Array.isArray(valB)) {
        const valBStrings = valB.map(toStr);
        switch (field?.operator) {
          case "equals":
            return valBStrings.some((b) => valAStrings.includes(b));
          case "not_equals":
            return !valBStrings.some((b) => valAStrings.includes(b));
          case "contains":
            return valBStrings.some((b) =>
              valAStrings.some((a) => b.includes(a)),
            );
          case "not_contains":
            return !valBStrings.some((b) =>
              valAStrings.some((a) => b.includes(a)),
            );
          default:
            return true;
        }
      }

      // Answered value valB is a single value (e.g. dropdown selectField)
      const strB = toStr(valB);
      switch (field?.operator) {
        case "equals":
          return valAStrings.includes(strB);
        case "not_equals":
          return !valAStrings.includes(strB);
        case "contains":
          return valAStrings.some((a) => strB.includes(a));
        case "not_contains":
          return !valAStrings.some((a) => strB.includes(a));
        default:
          return true;
      }
    }

    // Handle array values in answerData (e.g. multiSelect, checkbox)
    if (Array.isArray(valB)) {
      const targetStr = toStr(valA);
      switch (field?.operator) {
        case "equals":
          return valB.some((item) => toStr(item) === targetStr);
        case "not_equals":
          return !valB.some((item) => toStr(item) === targetStr);
        case "contains":
          return valB.some((item) => toStr(item).includes(targetStr));
        case "not_contains":
          return !valB.some((item) => toStr(item).includes(targetStr));
        default:
          return true;
      }
    }

    switch (field?.operator) {
      case "equals":
        return toStr(valA) === toStr(valB);
      case "not_equals":
        return toStr(valA) !== toStr(valB);
      case "greater": {
        const numA = Number(valA);
        const numB = Number(valB);
        return !isNaN(numA) && !isNaN(numB) ? numB > numA : false;
      }
      case "less": {
        const numA = Number(valA);
        const numB = Number(valB);
        return !isNaN(numA) && !isNaN(numB) ? numB < numA : false;
      }
      case "contains":
        return toStr(valB).includes(toStr(valA));
      case "not_contains":
        return !toStr(valB).includes(toStr(valA));
      default:
        return true;
    }
  });
};

export function generateDynamicSchema({
  formData,
  isReadOnly,
  ignoreValidation = false,
  answerData,
}: {
  formData: Section[];
  isReadOnly: boolean;
  ignoreValidation?: boolean;
  answerData?: any;
}) {
  const schemaFields: Record<string, yup.Schema<any>> = {};

  formData.forEach((section: any) => {
    if (section?.isFieldDeleted || section?.isDeleted) return;
    section?.formData?.forEach((question: any) => {
      if (question?.isFieldDeleted || question?.isDeleted) return;
      // If the field is conditionally hidden, skip validating it
      if (!evaluateVisibility(question, answerData)) {
        return;
      }

      const { id, type, isRequired, requiredMessage } = question;

      const isFieldDisabled = Boolean(question.isDisabled || question.disabled);
      const isFieldReadOnly = Boolean(
        isReadOnly || question.isReadOnly || question.readOnly,
      );

      // If the field is disabled, readonly, or validation is ignored, bypass all validation rules
      if (isFieldDisabled || isFieldReadOnly || ignoreValidation) {
        schemaFields[id] = yup.mixed().notRequired().nullable();
        return;
      }

      let fieldSchema = getBaseSchema(type);

      // Add required validation
      fieldSchema = addRequiredValidation(
        fieldSchema,
        isRequired,
        requiredMessage,
      );

      // Add specific validations based on type
      if (
        type === "textField" ||
        type === "longText" ||
        type === "email" ||
        type === "url"
      ) {
        fieldSchema = addTextValidations(
          fieldSchema as yup.StringSchema,
          question,
        );
      } else if (type === "numberField" || type === "amountField") {
        fieldSchema = addNumberValidations(
          fieldSchema as yup.NumberSchema,
          question,
        );
      }

      // Add array/multi-select validation for minChecked or requireAllChecked
      const isSingleCheck = question.selectionType === "single" || question.isMultiple === false;
      if (!isSingleCheck) {
        if (question.requireAllChecked) {
          fieldSchema = fieldSchema.test(
            "require-all-checked",
            "All options must be selected",
            (value) => {
              const isEmpty =
                value === undefined ||
                value === null ||
                value === "" ||
                (Array.isArray(value) && value.length === 0);
              if (isEmpty) {
                return !isRequired;
              }
              const allOptionsCount = question.options?.length || 0;
              if (Array.isArray(value)) return value.length >= allOptionsCount;
              return allOptionsCount <= 1;
            },
          );
        } else if (question.minChecked) {
          fieldSchema = fieldSchema.test(
            "min-checked",
            `Please select at least ${question.minChecked} option(s)`,
            (value) => {
              const isEmpty =
                value === undefined ||
                value === null ||
                value === "" ||
                (Array.isArray(value) && value.length === 0);
              if (isEmpty) {
                return !isRequired;
              }
              if (Array.isArray(value))
                return value.length >= question.minChecked;
              return 1 >= question.minChecked;
            },
          );
        }
      }

      schemaFields[id] = fieldSchema;
    });
  });

  return yup.object().shape(schemaFields);
}
