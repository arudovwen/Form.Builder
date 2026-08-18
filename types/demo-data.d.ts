export declare const demoPollApiResponse: {
    succeeded: boolean;
    message: string;
    errors: any;
    data: {
        formId: string;
        formName: string;
        category: string;
        totalSubmissions: number;
        submissionsData: ({
            sectionId: string;
            fieldId: string;
            type: string;
            label: string;
            totalResponses: number;
            responsesData: {
                options: {
                    optionId: string;
                    label: string;
                    value: string;
                    count: number;
                    percentage: number;
                }[];
                rows?: undefined;
                average?: undefined;
                nps?: undefined;
                rankings?: undefined;
                topRankWeight?: undefined;
                totalPoints?: undefined;
            };
        } | {
            sectionId: string;
            fieldId: string;
            type: string;
            label: string;
            totalResponses: number;
            responsesData: {
                rows: {
                    rowId: string;
                    label: string;
                    value: string;
                    totalResponses: number;
                    columns: {
                        optionId: string;
                        label: string;
                        value: string;
                        count: number;
                        percentage: number;
                    }[];
                }[];
                options?: undefined;
                average?: undefined;
                nps?: undefined;
                rankings?: undefined;
                topRankWeight?: undefined;
                totalPoints?: undefined;
            };
        } | {
            sectionId: string;
            fieldId: string;
            type: string;
            label: string;
            totalResponses: number;
            responsesData: {
                options: {
                    label: string;
                    value: string;
                    count: number;
                    percentage: number;
                }[];
                average: number;
                nps: {
                    promoters: number;
                    passives: number;
                    detractors: number;
                    score: number;
                };
                rows?: undefined;
                rankings?: undefined;
                topRankWeight?: undefined;
                totalPoints?: undefined;
            };
        } | {
            sectionId: string;
            fieldId: string;
            type: string;
            label: string;
            totalResponses: number;
            responsesData: {
                options: {
                    label: string;
                    value: string;
                    count: number;
                    percentage: number;
                }[];
                average: number;
                rows?: undefined;
                nps?: undefined;
                rankings?: undefined;
                topRankWeight?: undefined;
                totalPoints?: undefined;
            };
        } | {
            sectionId: string;
            fieldId: string;
            type: string;
            label: string;
            totalResponses: number;
            responsesData: {
                rankings: {
                    optionId: string;
                    label: string;
                    value: string;
                    count: number;
                    percentage: number;
                    averageRank: number;
                    points: number;
                    pointsPercentage: number;
                    isTopRanked: boolean;
                }[];
                topRankWeight: number;
                totalPoints: number;
                options?: undefined;
                rows?: undefined;
                average?: undefined;
                nps?: undefined;
            };
        })[];
    };
};
export declare const demoQuestionDa: {
    title: string;
    description: string;
    id: string;
    questionData: ({
        required: boolean;
        isReadOnly: boolean;
        isDisabled: boolean;
        id: string;
        sectionId: string;
        type: string;
        label: string;
        inputLabel: string;
        inputType: string;
    } | {
        options: {
            id: any;
            label: any;
            value: any;
        }[];
        options1: {
            id: any;
            label: any;
            value: any;
        }[];
        required: boolean;
        isReadOnly: boolean;
        isDisabled: boolean;
        id: string;
        sectionId: string;
        type: string;
        label: string;
        inputLabel: string;
        inputType: string;
    } | {
        options: {
            id: any;
            label: any;
            value: any;
        }[];
        required: boolean;
        isReadOnly: boolean;
        isDisabled: boolean;
        id: string;
        sectionId: string;
        type: string;
        label: string;
        inputLabel: string;
        inputType: string;
    })[];
}[];
