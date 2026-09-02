type Section = {
  id: string;
  title: string;
  description: string;
  questionData?: any[];
  isFieldDeleted?: boolean;
};

export function getAllQuestionData(sections: Section[]): any[] {
  return (
    sections
      ?.filter((section) => !section?.isFieldDeleted)
      ?.flatMap((section) => section?.questionData ?? [])
      ?.filter((field) => !field?.isFieldDeleted) ?? []
  );
}
