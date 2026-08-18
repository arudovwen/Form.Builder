type Section = {
    id: string;
    title: string;
    description: string;
    questionData?: any[];
    isDeleted?: boolean;
};
export declare function getAllQuestionData(sections: Section[]): any[];
export {};
