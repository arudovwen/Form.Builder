import React, { useState } from "react";
import AppIcon from "../ui/AppIcon";

export interface PollResultsProps {
  results: {
    type: "polling" | "ranking" | "nps" | string;
    totalResponses: number;
    responsesData: any;
  };
}

const parseRankingLabel = (labelStr: string) => {
  try {
    const arr = JSON.parse(labelStr);
    if (Array.isArray(arr)) {
      return arr.map(item => item.label).join(" > ");
    }
  } catch (e) {
    // Ignore error and fall back to returning the original string
  }
  return labelStr;
};

export const PollResultsBreakdown: React.FC<PollResultsProps> = ({ results }) => {
  const [showResults, setShowResults] = useState(true);

  if (!results) return null;

  return (
    <div className="mt-4 w-full">
      {showResults && (
        <div className="p-4 mb-3 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm w-full transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Live Results Breakdown ({results.totalResponses} Responses)
            </h4>
          </div>

          <div className="space-y-4">
            {/* MULTI-CHOICE OPTIONS (Polling, Checkbox, Radio, ImageChoice) */}
            {["polling", "checkbox", "radio", "imageChoice"].includes(results.type) && results.responsesData?.options && (
              results.responsesData.options.map((opt: any, idx: number) => (
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
              ))
            )}

            {/* RATING */}
            {results.type === "rating" && results.responsesData?.options && (
              <>
                {results.responsesData?.average !== undefined && (
                  <div className="mb-4 p-3 bg-white rounded-lg border text-center w-32 mx-auto">
                    <div className="text-xs text-gray-500 uppercase">Average Rating</div>
                    <div className="text-2xl font-bold text-yellow-500">{results.responsesData.average}</div>
                  </div>
                )}
                {results.responsesData.options.map((opt: any, idx: number) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between items-center mb-1.5 text-sm font-semibold text-gray-800">
                      <span>{opt.label}</span>
                      <span>
                        {Math.round(opt.percentage)}% ({opt.count})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${opt.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* MATRIX */}
            {results.type === "matrix" && results.responsesData?.rows && (
              <div className="space-y-6">
                {results.responsesData.rows.map((row: any, rowIdx: number) => (
                  <div key={rowIdx} className="w-full bg-white p-3 rounded-lg border">
                    <h5 className="font-semibold text-gray-800 mb-3 text-sm">{row.label} <span className="text-gray-400 font-normal text-xs ml-1">({row.totalResponses} Responses)</span></h5>
                    <div className="space-y-3">
                      {row.columns?.map((col: any, colIdx: number) => (
                        <div key={colIdx} className="w-full">
                          <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
                            <span>{col.label}</span>
                            <span>
                              {Math.round(col.percentage)}% ({col.count})
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-1 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${col.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RANKING */}
            {results.type === "ranking" && results.responsesData?.rankings && (
              <>
                <div className="flex items-center justify-between mb-1 text-xs text-gray-500">
                  <span className="font-medium">Rankings</span>
                  <span>{results.totalResponses} total responses</span>
                </div>
                {[...results.responsesData.rankings]
                  .sort((a: any, b: any) => (a.averageRank ?? Infinity) - (b.averageRank ?? Infinity))
                  .map((rank: any, idx: number) => (
                    <div key={idx} className="w-full flex items-center gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                        {rank.averageRank ?? idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5 text-sm font-semibold text-gray-800">
                          <span className="truncate pr-2" title={parseRankingLabel(rank.label)}>
                            {parseRankingLabel(rank.label)}
                          </span>
                          <span className="shrink-0 text-xs text-gray-500 font-normal">
                            {rank.points != null ? `${rank.points} pts` : ""} · {rank.count} responses
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${rank.pointsPercentage ?? rank.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </>
            )}

            {/* NPS */}
            {results.type === "nps" && (
              <>
                {results.responsesData?.nps && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-4">
                    <div className="p-3 bg-white rounded-lg border text-center">
                      <div className="text-xs text-gray-500 uppercase">NPS Score</div>
                      <div className="text-xl font-bold text-blue-600">{results.responsesData.nps.score}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border text-center">
                      <div className="text-xs text-green-500 uppercase">Promoters</div>
                      <div className="text-xl font-bold text-gray-800">{results.responsesData.nps.promoters}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border text-center">
                      <div className="text-xs text-yellow-500 uppercase">Passives</div>
                      <div className="text-xl font-bold text-gray-800">{results.responsesData.nps.passives}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border text-center">
                      <div className="text-xs text-red-500 uppercase">Detractors</div>
                      <div className="text-xl font-bold text-gray-800">{results.responsesData.nps.detractors}</div>
                    </div>
                  </div>
                )}
                {results.responsesData?.options && (
                  <div className="grid grid-cols-11 gap-1">
                    {results.responsesData.options.map((opt: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center group relative">
                        <div 
                          className="w-full bg-blue-100 rounded-t-sm flex items-end justify-center transition-all"
                          style={{ height: '60px' }}
                        >
                          <div 
                            className="w-full bg-blue-500 rounded-t-sm transition-all duration-500" 
                            style={{ height: `${opt.percentage}%` }}
                            title={`${opt.percentage}% (${opt.count} votes)`}
                          ></div>
                        </div>
                        <div className="text-xs font-medium text-gray-600 mt-1">{opt.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
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
