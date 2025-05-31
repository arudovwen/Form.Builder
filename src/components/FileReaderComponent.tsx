import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const FileReaderComponent = ({
  setValue,
  name,
  isFloating,
  label,
}: {
  setValue: (e: string, n: any) => void;
  name: string;
  isFloating: boolean;
  label: string;
}) => {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (event) => {
        const csv = event.target.result;
        const parsed = Papa.parse(csv, { header: true });
        setValue(name, parsed.data);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      reader.onload = (event) => {
        // @ts-expect-error sort later
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setValue(name, json);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Unsupported file type. Please upload a CSV or Excel file.");
    }
  };

  return (
    <div className="relative">
      <label
        className={`block text-sm font-medium text-[#344054] font-onest ${
          isFloating
            ? "z-[40] absolute block text-[#667085] bg-white  py-[2px] px-1 -top-[10px] left-3"
            : "relative"
        }`}
      >
        {label}
      </label>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
        className="mb-4 input-control file:bg-gray-600 file:text-white file:text-sm file:rounded file:border-gray-600 file:outline-none"
      />
      {fileName && (
        <p className="text-xs text-gray-600 mb-2">Uploaded: {fileName}</p>
      )}
    </div>
  );
};

export default FileReaderComponent;
