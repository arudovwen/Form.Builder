import * as yup from "yup";

interface QuestionData {
  id: string;
  type: 'textField' | 'longText' | 'numberField' | 'amountField' | 'selectField' | 'checkbox' | 'email' | 'date';
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
}

interface Section {
  questionData: QuestionData[];
}

const DEFAULT_MESSAGES = {
  required: "This field is required",
  email: "Invalid email format",
  minLength: (min: number) => `Minimum length is ${min}`,
  maxLength: (max: number) => `Maximum length is ${max}`,
  minAmount: (min: number) => `Minimum amount is ${min}`,
  maxAmount: (max: number) => `Maximum amount is ${max}`,
} as const;

const getBaseSchema = (type: QuestionData['type']) => {
  const schemas = {
    textField: yup.string().nullable(),
    longText: yup.string().nullable(),
    numberField: yup.number().nullable().transform((value) => 
      isNaN(value) ? null : value
    ),
    amountField: yup.number().nullable().transform((value) => 
      isNaN(value) ? null : value
    ),
    selectField: yup.string().nullable(),
    checkbox: yup.mixed().nullable(),
    radio: yup.mixed().nullable(),
    email: yup.string().nullable().email(DEFAULT_MESSAGES.email),
    date: yup.date().typeError('Invalid date').nullable(),
  };

  return schemas[type] || yup.mixed().nullable();
};

const addRequiredValidation = (schema: yup.Schema<any>, isRequired?: boolean, message?: string) => {
  if (!isRequired) return schema;
  
  if (schema.type === 'boolean') {
    return schema.oneOf([true], message || DEFAULT_MESSAGES.required);
  }
  
  return schema.required(message || DEFAULT_MESSAGES.required);
};

const addTextValidations = (
  schema: yup.StringSchema,
  { minLength, maxLength, minLengthMessage, maxLengthMessage }: Partial<QuestionData>
) => {
  let updatedSchema = schema;
  
  if (minLength) {
    updatedSchema = updatedSchema.min(
      minLength,
      minLengthMessage || DEFAULT_MESSAGES.minLength(minLength)
    );
  }
  
  if (maxLength) {
    updatedSchema = updatedSchema.max(
      maxLength,
      maxLengthMessage || DEFAULT_MESSAGES.maxLength(maxLength)
    );
  }
  
  return updatedSchema;
};

const addNumberValidations = (
  schema: yup.NumberSchema,
  { minAmount, maxAmount, minAmountMessage, maxAmountMessage }: Partial<QuestionData>
) => {
  let updatedSchema = schema;
  
  if (minAmount) {
    updatedSchema = updatedSchema.min(
      parseFloat(String(minAmount)),
      minAmountMessage || DEFAULT_MESSAGES.minAmount(minAmount)
    );
  }
  
  if (maxAmount) {
    updatedSchema = updatedSchema.max(
      parseFloat(String(maxAmount)),
      maxAmountMessage || DEFAULT_MESSAGES.maxAmount(maxAmount)
    );
  }
  
  return updatedSchema;
};

export function generateDynamicSchema(data: Section[]) {
  const schemaFields: Record<string, yup.Schema<any>> = {};

  data.forEach(({ questionData }) => {
    questionData.forEach((question) => {
      const { id, type, isRequired, requiredMessage } = question;
      
      let fieldSchema = getBaseSchema(type);
      
      // Add required validation
      fieldSchema = addRequiredValidation(fieldSchema, isRequired, requiredMessage);
      
      // Add specific validations based on type
      if (type === 'textField' || type === 'longText' || type === 'email') {
        fieldSchema = addTextValidations(fieldSchema as yup.StringSchema, question);
      } else if (type === 'numberField' || type === 'amountField') {
        fieldSchema = addNumberValidations(fieldSchema as yup.NumberSchema, question);
      }

      schemaFields[id] = fieldSchema;
    });
  });

  return yup.object().shape(schemaFields);
}