type Section = {
  id: string;
  title: string;
  description: string;
  questionData?: any[];
};

export function getAllQuestionData(sections: Section[]): any[] {
  return sections.flatMap(section => section.questionData ?? []);
}