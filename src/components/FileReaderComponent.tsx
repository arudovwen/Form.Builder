import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { normalizeGridRows, normalizeRows } from "../utils/normalizeRows";
import { getItem } from "@/utils/localStorageControl";

// headerName, field
const FileReaderComponent = ({
  setValue,
  name,
  isFloating,
  label,
  type,
}: {
  setValue: (e: string, n: any) => void;
  name: string;
  isFloating?: boolean;
  label: string;
  type?: string;
}) => {
  const [fileName, setFileName] = useState("");
  const config = getItem("config");
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (event) => {
        const csv = event.target.result;
        const parsed = Papa.parse(csv, { header: true });
        setValue(
          name,
          (type === "dataGrid" ? normalizeGridRows : normalizeRows)(
            parsed.data,
          ),
        );
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
        setValue(
          name,
          (type === "dataGrid" ? normalizeGridRows : normalizeRows)(json),
        );
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Unsupported file type. Please upload a CSV or Excel file.");
    }
  };

  return (
    <div>
      <div className="relative">
        <label
          className={`block text-sm font-medium text-[#344054] font-onest mb-1.5`}
        >
          {label}
        </label>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="mb-4 field-control file:bg-gray-600 file:text-white file:text-sm file:rounded file:border-gray-600 file:outline-none"
        />
        {fileName && (
          <p className="text-xs text-gray-600 mb-2">Uploaded: {fileName}</p>
        )}
      </div>
      <a
        download
        href={
          type === "dataGrid"
            ? "https://res.cloudinary.com/arudovwen-me/raw/upload/v1775419737/table_sheet_bu7l6g.xlsx"
            : "https://res.cloudinary.com/arudovwen-me/raw/upload/v1775419737/list_sheet_1_pi6bwv.xlsx"
        }
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: config?.buttonColor || "#333" }}
        className="text-xs text-gray-600 mb-2 cursor-pointer font-medium"
      >
        Download Sample File
      </a>
    </div>
  );
};

export default FileReaderComponent;
