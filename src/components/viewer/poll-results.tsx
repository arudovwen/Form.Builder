import React, { useState } from "react";
import AppIcon from "../ui/AppIcon";

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

export const PollResultsBreakdown: React.FC<PollResultsProps> = ({ results }) => {
  const [showResults, setShowResults] = useState(true);

  if (!results) return null;

  return (
    <div className="mt-4 w-full">
      {showResults && (
        <div className="p-4 mb-3 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm w-full transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Live Results Breakdown ({results.totalVotes} Votes)
            </h4>
          </div>
          <div className="space-y-4">
            {results.options.map((opt, idx) => (
              <div key={idx} className="w-full">
                <div className="flex justify-between items-center mb-1.5 text-sm font-semibold text-gray-800">
                  <span>{opt.label}</span>
                  <span>
                    {Math.round(opt.percentage)}% ({opt.count})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${opt.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button 
        type="button"
        onClick={() => setShowResults(!showResults)}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        <AppIcon icon={showResults ? "bx:bar-chart-alt-2" : "bx:bar-chart-alt-2"} iconClass="w-4 h-4" />
        {showResults ? "Hide Results" : "Show Results"}
      </button>
    </div>
  );
};
