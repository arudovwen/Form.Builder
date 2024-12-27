import React from "react";

export default function PdfLoader() {
  return (
    <div className="bg-white h-[60vh]  justify-center flex items-center w-full lg:min-w-[800px] p-10 max-w-[800px] mx-auto">
      <span className="flex items-center justify-center flex-col gap-y-2">
        <span className="text-xs font-medium gray-400">Loading Pdf</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20"
          viewBox="0 0 300 150"
        >
          <path
            fill="none"
            stroke="#C6593C"
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray="300 385"
            strokeDashoffset="0"
            d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
          >
            <animate
              attributeName="stroke-dashoffset"
              calcMode="spline"
              dur="2"
              values="685;-685"
              keySplines="0 0 1 1"
              repeatCount="indefinite"
            ></animate>
          </path>
        </svg>
      </span>
    </div>
  );
}
