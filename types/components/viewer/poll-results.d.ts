import React from "react";
export interface PollResultsProps {
    results: {
        type: "polling" | "ranking" | "nps" | string;
        totalResponses: number;
        responsesData: any;
    };
    hideInputs: boolean;
}
export declare const PollResultsBreakdown: React.FC<PollResultsProps>;
