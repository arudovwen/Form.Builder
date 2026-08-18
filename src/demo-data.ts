export const demoPollApiResponse = {
    "succeeded": true,
    "message": "Poll results retrieved successfully.",
    "errors": null,
    "data": {
        "formId": "019ff3fc-c0b6-716f-a78c-04d93038034a",
        "formName": "sapa research poll",
        "category": "poll",
        "totalSubmissions": 7,
        "submissionsData": [
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "8901fc4b-69f4-49d1-8155-2b7f7f3d94dd",
                "type": "radio",
                "label": "Gender",
                "totalResponses": 3,
                "responsesData": {
                    "options": [
                        { "optionId": "3cef8982-12b4-4563-8792-f28fb3f952b0", "label": "Male", "value": "male", "count": 2, "percentage": 66.67 },
                        { "optionId": "a0c9ee9f-e336-44c3-8e8c-1895b1ad11a1", "label": "Female", "value": "female", "count": 1, "percentage": 33.33 }
                    ]
                }
            },
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "50155f15-d8c8-4e6a-9549-78bab23066f1",
                "type": "checkbox",
                "label": "What do you do for money",
                "totalResponses": 3,
                "responsesData": {
                    "options": [
                        { "optionId": "c10ca9c9-c4f7-4854-8b04-ef4d42d8cda0", "label": "Student", "value": "student", "count": 2, "percentage": 66.67 },
                        { "optionId": "a48fd53f-55a9-4f5c-98df-0970c7f55caf", "label": "Freelancer", "value": "freelancer", "count": 0, "percentage": 0 },
                        { "optionId": "6a540c0e-121a-46e6-86e8-dea6d2625a80", "label": "9-5 worker", "value": "9_5_worker", "count": 2, "percentage": 66.67 },
                        { "optionId": "3f977545-2109-478d-bc21-ca75bb6a2cc8", "label": "Entrepreneur", "value": "entrepreneur", "count": 1, "percentage": 33.33 },
                        { "optionId": "c5acc62c-5752-4b75-9acd-d612b5f8c03a", "label": "Yahoo Boy", "value": "yahoo_boy", "count": 0, "percentage": 0 }
                    ]
                }
            },
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "26481bdb-e8ae-4742-81bb-fbe2495b78fb",
                "type": "matrix",
                "label": "How broke would you say you are",
                "totalResponses": 3,
                "responsesData": {
                    "rows": [
                        {
                            "rowId": "r1", "label": "Example Row", "value": "row_1", "totalResponses": 3,
                            "columns": [
                                { "optionId": "c1", "label": "Poor", "value": "poor", "count": 0, "percentage": 0 },
                                { "optionId": "c2", "label": "Semi Poor", "value": "semi_poor", "count": 2, "percentage": 66.67 },
                                { "optionId": "c3", "label": "Normal broke", "value": "normal_broke", "count": 0, "percentage": 0 },
                                { "optionId": "c4", "label": "Pre broke", "value": "pre_broke", "count": 1, "percentage": 33.33 },
                                { "optionId": "c5", "label": "Pre rich", "value": "pre_rich", "count": 0, "percentage": 0 }
                            ]
                        }
                    ]
                }
            },
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "fe46c38b-fdca-4c42-8ab4-0d8683bb4b73",
                "type": "nps",
                "label": "How likely are you to run with Palmpay money",
                "totalResponses": 3,
                "responsesData": {
                    "options": [
                        { "label": "0", "value": "0", "count": 0, "percentage": 0 },
                        { "label": "1", "value": "1", "count": 0, "percentage": 0 },
                        { "label": "2", "value": "2", "count": 2, "percentage": 66.67 },
                        { "label": "3", "value": "3", "count": 0, "percentage": 0 },
                        { "label": "4", "value": "4", "count": 1, "percentage": 33.33 },
                        { "label": "5", "value": "5", "count": 0, "percentage": 0 },
                        { "label": "6", "value": "6", "count": 0, "percentage": 0 },
                        { "label": "7", "value": "7", "count": 0, "percentage": 0 },
                        { "label": "8", "value": "8", "count": 0, "percentage": 0 },
                        { "label": "9", "value": "9", "count": 0, "percentage": 0 },
                        { "label": "10", "value": "10", "count": 0, "percentage": 0 }
                    ],
                    "average": 2.67,
                    "nps": { "promoters": 0, "passives": 0, "detractors": 3, "score": -100 }
                }
            },
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "e3e2a3cc-1563-43af-9350-7c77f62c6252",
                "type": "rating",
                "label": "What would you rate your living standards right now",
                "totalResponses": 1,
                "responsesData": {
                    "options": [
                        { "label": "3", "value": "3", "count": 1, "percentage": 100 }
                    ],
                    "average": 3
                }
            },
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "a2500e96-0e03-48a4-bc7c-08940ef77da5",
                "type": "ranking",
                "label": "How do you rank these sources",
                "totalResponses": 2,
                "responsesData": {
                    "rankings": [
                        { "optionId": "f01c2c7f-758a-47f6-8a34-672451816e93", "label": "Borrowing from friend", "value": "borrowing_from_friend", "count": 2, "percentage": 100, "averageRank": 2, "points": 12, "pointsPercentage": 21.43, "isTopRanked": true },
                        { "optionId": "63a8fdb7-1d4e-429e-b9e7-4ee3d3260c91", "label": "Opay/Palmpay others", "value": "opaypalmpay_others", "count": 2, "percentage": 100, "averageRank": 2, "points": 12, "pointsPercentage": 21.43, "isTopRanked": true },
                        { "optionId": "994ae2d2-6d32-435e-9cee-b896cf6938b6", "label": "Sportybet", "value": "sportybet", "count": 2, "percentage": 100, "averageRank": 3, "points": 10, "pointsPercentage": 17.86, "isTopRanked": false },
                        { "optionId": "9d47a948-6f6c-4e43-8b6d-d71af0212ce8", "label": "Egbon adugbo begging", "value": "egbon_adugbo_begging", "count": 2, "percentage": 100, "averageRank": 3.5, "points": 9, "pointsPercentage": 16.07, "isTopRanked": false },
                        { "optionId": "84ecabc6-4166-4176-8cef-d1a1f1e07903", "label": "Begging parents", "value": "begging_parents", "count": 2, "percentage": 100, "averageRank": 4.5, "points": 7, "pointsPercentage": 12.5, "isTopRanked": false },
                        { "optionId": "6314e635-9548-4d2b-96fa-83bbda17cab1", "label": "Crypto", "value": "crypto", "count": 2, "percentage": 100, "averageRank": 6, "points": 4, "pointsPercentage": 7.14, "isTopRanked": false },
                        { "optionId": "e7bd1423-d9fc-46d7-9380-6f60f8c74f10", "label": "Getting a Job", "value": "getting_a_job", "count": 2, "percentage": 100, "averageRank": 7, "points": 2, "pointsPercentage": 3.57, "isTopRanked": false }
                    ],
                    "topRankWeight": 7,
                    "totalPoints": 56
                }
            },
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "931275ca-7874-40a2-b9d9-b881b2cdb8db",
                "type": "imageChoice",
                "label": "Image Choice Label",
                "totalResponses": 2,
                "responsesData": {
                    "options": [
                        { "optionId": "cc814c55-e377-4833-86f9-5ca3a75f8f32", "label": "Food", "value": "food", "count": 1, "percentage": 50 },
                        { "optionId": "b33880b7-7a2e-4471-a876-3f95ee76c508", "label": "Data sub", "value": "data_sub", "count": 1, "percentage": 50 }
                    ]
                }
            },
            {
                "sectionId": "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
                "fieldId": "8501e724-e753-42eb-bd3d-1e3eac78e776",
                "type": "selectField",
                "label": "What would you do with 2 million naira",
                "totalResponses": 3,
                "responsesData": {
                    "options": [
                        { "optionId": "608db146-df00-4fde-82b0-e31565e58e0d", "label": "Invest", "value": "invest", "count": 0, "percentage": 0 },
                        { "optionId": "c3870373-71e4-4dda-a242-a069224a6ce1", "label": "Ball", "value": "ball", "count": 2, "percentage": 66.67 },
                        { "optionId": "c388e0f1-8fca-47c4-87c9-40feffbf7c3d", "label": "Save", "value": "save", "count": 1, "percentage": 33.33 }
                    ]
                }
            }
        ]
    }
};

export const demoQuestionDa = [
    {
        title: "Sapa Research Poll",
        description: "Checking living standards.",
        id: "66a6abf3-d700-44aa-bc25-c5c919e2fb29",
        questionData: demoPollApiResponse.data.submissionsData.map(result => {
            const baseProps = {
                required: false,
                isReadOnly: false,
                isDisabled: false,
                id: result.fieldId,
                sectionId: result.sectionId,
                type: result.type,
                label: result.label,
                inputLabel: result.label,
                inputType: result.type,
            };

            if (result.type === 'matrix') {
                return {
                    ...baseProps,
                    options: result.responsesData.rows.map((r: any) => ({ id: r.rowId, label: r.label, value: r.value })),
                    options1: result.responsesData.rows[0]?.columns?.map((c: any) => ({ id: c.optionId, label: c.label, value: c.value })) || []
                };
            }

            if (result.type === 'ranking') {
                return {
                    ...baseProps,
                    options: result.responsesData.rankings.map((r: any) => ({ id: r.optionId, label: r.label, value: r.value }))
                };
            }

            if (['radio', 'checkbox', 'imageChoice', 'selectField'].includes(result.type)) {
                return {
                    ...baseProps,
                    options: result.responsesData.options?.map((o: any) => ({ id: o.optionId, label: o.label, value: o.value })) || []
                };
            }

            return baseProps;
        })
    }
];
