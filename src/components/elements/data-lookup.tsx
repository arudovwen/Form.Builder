import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import AppIcon from "../ui/AppIcon";
import { isValidImage } from "../../utils/isValidImage";
import ImageViewer from "../ImageViewer";
import clsx from "clsx";
import { getItem } from "../../utils/localStorageControl";

const formatKey = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/[:,;]/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function DataLookup({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const { register = () => ({}), setValue, watch } = validationData || {};
  const [value, setValueState] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const registeredValue = watch && watch(element?.id);

  const sourceValue =
    element.valueSource === "field" &&
    element.sourceFieldId &&
    typeof watch === "function"
      ? watch(element.sourceFieldId)
      : undefined;

  useEffect(() => {
    if (element.valueSource === "field") {
      setValueState(sourceValue);
      if (typeof setValue === "function") {
        setValue(element.id, sourceValue);
      }
    } else {
      setValueState(registeredValue);
    }
  }, [registeredValue, sourceValue, element.valueSource, element.id, setValue]);

  const [result, setResult] = useState<any>("");
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  const { url, method, responseType } = element || {};
  const abortControllerRef = useRef<AbortController | null>(null);

  const dataLookup = useCallback(
    async (value: string) => {
      if (!url || typeof url !== "string" || !url.trim() || !method) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setMessage("");
      setIsValid(false);

      try {
        let response;
        const axiosconfig = {
          headers: {
            Authorization: `Bearer ${getItem("token")}`,
          },
          signal: controller.signal,
        };

        if (method.toLowerCase() === "get") {
          const mappedUrl = `${url}?value=${value}`;
          response = await axios.get(mappedUrl, axiosconfig);
        } else if (method.toLowerCase() === "post") {
          response = await axios.post(url, { value }, axiosconfig);
        } else {
          throw new Error("Unsupported HTTP method");
        }

        if (response.status === 200) {
          const hasExplicitFalseStatus =
            response?.data?.data?.status === false ||
            response?.data?.status === false;

          if (!hasExplicitFalseStatus) {
            setIsValid(true);

            if (responseType === "string") {
              let msg =
                response?.data?.data?.description ||
                response?.data?.description ||
                response?.data?.data ||
                response?.data ||
                "Validation successful";
              if (typeof msg === "object" && msg !== null) {
                msg = JSON.stringify(msg);
              }
              setMessage(msg);
            } else {
              const resData =
                response?.data?.data?.description ||
                response?.data?.description ||
                response?.data?.data ||
                response?.data ||
                {};
              setResult(resData);
              if (typeof resData === "object" && resData !== null) {
                if (typeof setValue === "function") {
                  setValue(`${element?.id}_metaData`, resData);
                }
              }
            }
          } else {
            console.error("Invalid input:", value);
            setMessage("Unable to validate input");
            setIsValid(false);
          }
        }
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.error("Error validating input:", error);
          let errMsg =
            error?.response?.data?.message ||
            error?.response?.data ||
            "Unable to validate input";
          if (typeof errMsg === "object" && errMsg !== null) {
            errMsg = JSON.stringify(errMsg);
          }
          setMessage(errMsg);
          setIsValid(false);
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [method, responseType, url]
  );

  useEffect(() => {
    if (value) {
      const timeoutId = setTimeout(() => {
        dataLookup(value);
      }, 700);
      return () => clearTimeout(timeoutId);
    }
  }, [dataLookup, value]);
  return (
    <div>
      <div className="relative flex items-center">
        <input
          placeholder={element?.placeholder || ""}
          type={element?.inputType || "text"}
          className={clsx("field-control", element?.customClass, {
            "bg-gray-100 text-gray-500": element.valueSource === "field",
          })}
          {...register(element?.id)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (element.valueSource !== "field") {
              setValueState(e.target.value);
              if (typeof setValue === "function") {
                setValue(element?.id, e.target.value);
              }
            }
          }}
          readOnly={element.valueSource === "field"}
          disabled={
            validationData?.isReadOnly || element.valueSource === "field"
          }
        />

        <span className="absolute right-0">
          {loading && (
            <span>
              {" "}
              <svg
                className={`animate-spin -ml-1 mr-3 h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          )}

          {isValid && !loading && (
            <span className="block pr-3 text-lg text-green-600">
              <AppIcon icon="gg:check-o" />
            </span>
          )}
        </span>
      </div>
      {message && responseType === "string" && (
        <span
          className={`${isValid ? "text-green-600" : "text-red-600"} text-sm`}
        >
          {message}
        </span>
      )}

      {responseType === "object" && result && (
        <div className="grid grid-cols-2 gap-6 mt-6 text-sm text-gray-600">
          {Object.entries(result)?.map(([key, value]) => (
            <div key={key} className="flex flex-col gap-y-1">
              <span className="font-semibold">{formatKey(key)}</span>
              {isValidImage(value) ? (
                <ImageViewer imageUrl={value} />
              ) : (
                <input
                  type="text"
                  readOnly
                  className="field-control"
                  value={String(value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
