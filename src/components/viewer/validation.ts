import * as yup from "yup";

interface QuestionData {
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
  questionData: QuestionData[];
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

const getBaseSchema = (type: QuestionData["type"], isReadOnly: boolean = false) => {
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
        return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value);
      }),
    date: yup
      .date()
      .nullable()
      .transform((value, originalValue) => {
        if (isReadOnly && originalValue === "") return null;
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
  }: Partial<QuestionData>,
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
  }: Partial<QuestionData>,
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
  if (!question.isHidden) return true;
  const fields = question.visibilityDependentFields || [];
  if (!fields.length) return true;

  return fields.every((field: any) => {
    const value = answerData?.[field.id];
    const valA = field.fieldValue;
    const valB = value;

    switch (field.operator) {
      case "equals":
        return String(valA).toLowerCase() === String(valB).toLowerCase();
      case "not_equals":
        return String(valA).toLowerCase() !== String(valB).toLowerCase();
      case "greater":
        return Number(valB) > Number(valA);
      case "less":
        return Number(valB) < Number(valA);
      case "contains":
        return String(valB).toLowerCase().includes(String(valA).toLowerCase());
      case "not_contains":
        return !String(valB).toLowerCase().includes(String(valA).toLowerCase());
      default:
        return true;
    }
  });
};

export function generateDynamicSchema({formData, isReadOnly, answerData}: {formData: Section[], isReadOnly: boolean, answerData?: any}) {
  const schemaFields: Record<string, yup.Schema<any>> = {};

  formData.forEach(({ questionData }) => {
    questionData?.forEach((question: any) => {
      // If the field is conditionally hidden, skip validating it
      if (!evaluateVisibility(question, answerData)) {
        return;
      }

      const { id, type, isRequired, requiredMessage, isDisabled } = question;

      let fieldSchema = getBaseSchema(type, isReadOnly);

      // Add required validation
      fieldSchema = addRequiredValidation(
        fieldSchema,
        isDisabled ? false : isReadOnly ? false : isRequired,
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
      if (question.requireAllChecked) {
        fieldSchema = fieldSchema.test(
          "require-all-checked",
          "All options must be selected",
          (value) => {
            const isEmpty = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
              return !!isRequired ? false : true;
            }
            const allOptionsCount = question.options?.length || 0;
            if (Array.isArray(value)) return value.length >= allOptionsCount;
            return allOptionsCount <= 1;
          }
        );
      } else if (question.minChecked) {
        fieldSchema = fieldSchema.test(
          "min-checked",
          `Please select at least ${question.minChecked} option(s)`,
          (value) => {
            const isEmpty = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
              return !!isRequired ? false : true;
            }
            if (Array.isArray(value)) return value.length >= question.minChecked;
            return 1 >= question.minChecked;
          }
        );
      }

      schemaFields[id] = fieldSchema;
    });
  });

  return yup.object().shape(schemaFields);
}
