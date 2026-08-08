import React from "react";
export interface PollResultsProps {
    results: {
        totalVotes: number;
        options: {
            label: string;
            percentage: number;
            count: number;
        }[];
    };
}
export declare const PollResultsBreakdown: React.FC<PollResultsProps>;
