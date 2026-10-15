type Section = {
    id: string;
    title: string;
    description: string;
    formData?: any[];
    isFieldDeleted?: boolean;
    isDeleted?: boolean;
};
export declare function getAllformData(sections: Section[]): any[];
export {};
