type Section = {
    id: string;
    title: string;
    description: string;
    questionData?: any[];
};
export declare function getAllQuestionData(sections: Section[]): any[];
export {};
