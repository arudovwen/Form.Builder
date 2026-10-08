export declare const defaultTemplates: ({
    id: string;
    name: string;
    description: string;
    sections: {
        id: string;
        title: string;
        description: string;
        formData: ({
            id: string;
            type: string;
            label: string;
            inputLabel: string;
            inputType: string;
        } | {
            id: string;
            type: string;
            label: string;
            inputLabel: string;
            inputType?: undefined;
        })[];
    }[];
} | {
    id: string;
    name: string;
    description: string;
    sections: {
        id: string;
        title: string;
        formData: ({
            id: string;
            type: string;
            label: string;
            inputLabel: string;
            inputType: string;
        } | {
            id: string;
            type: string;
            label: string;
            inputLabel: string;
            inputType?: undefined;
        })[];
    }[];
} | {
    id: string;
    name: string;
    description: string;
    sections: {
        id: string;
        title: string;
        formData: ({
            id: string;
            type: string;
            label: string;
            inputLabel: string;
            inputType: string;
            options?: undefined;
        } | {
            id: string;
            type: string;
            label: string;
            inputLabel: string;
            options: {
                label: string;
                value: string;
            }[];
            inputType?: undefined;
        })[];
    }[];
})[];
