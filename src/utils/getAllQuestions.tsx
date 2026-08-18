type Section = {
  id: string;
  title: string;
  description: string;
  questionData?: any[];
  isDeleted?: boolean;
};

export function getAllQuestionData(sections: Section[]): any[] {
  return (
    sections
      ?.filter((section) => !section?.isDeleted)
      ?.flatMap((section) => section?.questionData ?? [])
      ?.filter((field) => !field?.isDeleted) ?? []
  );
}
