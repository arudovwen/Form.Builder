import * as yup from "yup";

export function generateDynamicSchema(data: any[]) {
  const schemaFields = {};

  data.forEach((section: { questionData: any[]; }) => {
    section.questionData.forEach((question: { id: any; type: any; isRequired: any; requiredMessage: any; minLength: any; maxLength: any; minAmount: any; maxAmount: any; minLengthMessage: any; maxLengthMessage: any; minAmountMessage: any; maxAmountMessage: any; }) => {
      const {
        id,
        type,
        isRequired,
        requiredMessage,
        minLength,
        maxLength,
        minAmount,
        maxAmount,
        minLengthMessage,
        maxLengthMessage,
        minAmountMessage,
        maxAmountMessage,
      } = question;

      // Base validation schema for the field
      let fieldSchema = yup.mixed();

      switch (type) {
        case "textField":
        case "longText":
          fieldSchema = yup.string();
          if (isRequired) {
            fieldSchema = fieldSchema.required(
              requiredMessage || "This field is required"
            );
          }
          if (minLength) {
            fieldSchema = fieldSchema.min(
              minLength,
              minLengthMessage || `Minimum length is ${minLength}`
            );
          }
          if (maxLength) {
            fieldSchema = fieldSchema.max(
              maxLength,
              maxLengthMessage || `Maximum length is ${maxLength}`
            );
          }
          break;

        case "numberField":
        case "amountField":
          fieldSchema = yup.number();
          if (isRequired) {
            fieldSchema = fieldSchema.required(
              requiredMessage || "This field is required"
            );
          }
          if (minAmount) {
            fieldSchema = fieldSchema.min(
              parseFloat(minAmount),
              minAmountMessage || `Minimum amount is ${minAmount}`
            );
          }
          if (maxAmount) {
            fieldSchema = fieldSchema.max(
              parseFloat(maxAmount),
              maxAmountMessage || `Maximum amount is ${maxAmount}`
            );
          }
          break;

        case "selectField":
          fieldSchema = yup.string();
          if (isRequired) {
            fieldSchema = fieldSchema.required(
              requiredMessage || "This field is required"
            );
          }
          break;

        case "checkbox":
          fieldSchema = yup.boolean();
          if (isRequired) {
            fieldSchema = fieldSchema.oneOf(
              [true],
              requiredMessage || "This field is required"
            );
          }
          break;

        case "email":
          fieldSchema = yup.string().email("Invalid email format");
          if (isRequired) {
            fieldSchema = fieldSchema.required(
              requiredMessage || "This field is required"
            );
          }
          break;

        case "date":
          fieldSchema = yup.date();
          if (isRequired) {
            fieldSchema = fieldSchema.required(
              requiredMessage || "This field is required"
            );
          }
          break;

        default:
          // Default to string validation for unsupported types
          fieldSchema = yup.string();
          if (isRequired) {
            fieldSchema = fieldSchema.required(
              requiredMessage || "This field is required"
            );
          }
          break;
      }

      // Add the field schema to the overall schema
      schemaFields[id] = fieldSchema;
    });
  });

  return yup.object().shape(schemaFields);
}

