import React, { useState, useEffect } from "react";
import clsx from "clsx";
import AppIcon from "../ui/AppIcon";

interface PollingInputProps {
  element: any;
  validationData?: any;
  state?: string;
}

export default function PollingInput({
  element,
  validationData,
  state,
}: PollingInputProps) {
  const { register, watch, setValue } = validationData || {};
  const [results, setResults] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);

  const currentValue = watch ? watch(element.id) : null;
  const hasVoted = Boolean(currentValue || (state && state !== "edit"));

  // Poll external API for results
  useEffect(() => {
    if (!element.fetchExternalResults || !element.externalApiUrl) return;


    const fetchResults = async () => {
      try {
        const response = await fetch(element.externalApiUrl);
        if (!response.ok) return;
        const data = await response.json();

        // Support formats: { "option_1": 45, "option_2": 10 } OR [{ value: "option_1", count: 45 }]
        let parsedResults: Record<string, number> = {};
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            const key = item.value || item.id || item.option;
            const count = item.count || item.votes || item.value || 0;
            if (key) parsedResults[key] = Number(count);
          });
        } else if (typeof data === "object") {
          parsedResults = data;
        }

        setResults(parsedResults);
        const total = Object.values(parsedResults).reduce((a: number, b: any) => a + Number(b), 0);
        setTotalVotes(total);
      } catch (err) {
        console.error("Failed to fetch polling results", err);
      }
    };

    fetchResults(); // Initial fetch
    const intervalId = setInterval(fetchResults, 10000); // Poll every 10s

    return () => clearInterval(intervalId);
  }, [element.fetchExternalResults, element.externalApiUrl]);

  // If not fetching external results, mock results based on the local vote
  useEffect(() => {
    if (element.fetchExternalResults) return;

    if (currentValue) {
      setResults({ [currentValue]: 1 });
      setTotalVotes(1);
    } else {
      setResults({});
      setTotalVotes(0);
    }
  }, [currentValue, element.fetchExternalResults]);

  const handleSelect = (val: string) => {
    if (validationData?.isReadOnly) return; // Prevent changing vote when readonly
    if (setValue) {
      setValue(element.id, val, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="w-full">
      <div className="grid gap-y-3">
        {element.options?.map((option: any) => {
          const votes = results[option.value] || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isSelected = currentValue === option.value;

          return (
            <div
              key={option.id || option.value}
              onClick={() => handleSelect(option.value)}
              className={clsx(
                "relative flex items-center justify-between p-3 border rounded-lg overflow-hidden transition-all duration-200",
                !validationData?.isReadOnly ? "cursor-pointer hover:border-blue-400 hover:bg-blue-50/50" : "cursor-default",
                isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
              )}
            >
              {/* Progress Bar Background (only show if voted) */}
              {hasVoted && (
                <div
                  className="absolute top-0 left-0 bottom-0 bg-blue-100/60 transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Option Content */}
              <div className="relative z-10 flex items-center gap-3">
                {/* Custom Radio Button */}
                <div
                  className={clsx(
                    "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"
                  )}
                >
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                <span
                  className={clsx(
                    "font-medium text-sm",
                    isSelected ? "text-blue-900" : "text-gray-700"
                  )}
                >
                  {option.label || option.name || option.option || option.value || "Unknown Option"}
                </span>
              </div>

              {/* Vote Percentage (only show if voted) */}
              {hasVoted && (
                <div className="relative z-10 flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {percentage}%
                  </span>
                  {isSelected && (
                    <AppIcon icon="material-symbols:check-circle" iconClass="text-blue-500 text-lg" />
                  )}
                </div>
              )}

              {/* Hidden native radio for form submission */}
              <input
                type="radio"
                value={option.value}
                className="hidden"
                {...(register ? register(element.id) : {})}
              />
            </div>
          );
        })}
      </div>
      
      {hasVoted && (
        <div className="mt-3 text-xs text-gray-500 text-right flex justify-between items-center">
          <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total</span>
          {element.fetchExternalResults && element.externalApiUrl && (
             <span className="flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
             </span>
          )}
        </div>
      )}
    </div>
  );
}
