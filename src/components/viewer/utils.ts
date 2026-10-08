export const getElementOptions = (element: any, options: any) => {
  if (!element?.allowEdit) return options;
  return { ...options, isReadOnly: false };
};
