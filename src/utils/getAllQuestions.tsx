type Section = {
  id: string;
  title: string;
  description: string;
  formData?: any[];
  isFieldDeleted?: boolean;
  isDeleted?: boolean;
};

export function getAllformData(sections: Section[]): any[] {
  return (
    sections
      ?.filter((section) => !section?.isFieldDeleted && !section?.isDeleted)
      ?.flatMap((section) => section?.formData ?? [])
      ?.filter((field) => !field?.isFieldDeleted && !field?.isDeleted) ?? []
  );
}
