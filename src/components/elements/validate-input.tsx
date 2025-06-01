import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import AppIcon from "../ui/AppIcon";
import { isValidImage } from "../../utils/isValidImage";
import ImageViewer from "../ImageViewer";
import clsx from "clsx";

export default function ValidateInput({
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

  useEffect(() => {
    setValueState(registeredValue);
  }, [registeredValue]);

  const [result, setResult] = useState<any>("");
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  const { url, method, responseType } = element || {};

  const validateInput = useCallback(
    async (value: string) => {
      if (!url || !method) return;
      setLoading(true);
      try {
        let response;
        if (method.toLowerCase() === "get") {
          const mappedUrl = `${url}?value=${value}`;
          response = await axios.get(mappedUrl);
        } else if (method.toLowerCase() === "post") {
          response = await axios.post(url, { value });
        } else {
          throw new Error("Unsupported HTTP method");
        }

        if (response.status === 200) {
          if (
            (response?.data?.data?.status || response?.data?.status) === true
          ) {
            setIsValid(true);

            if (responseType === "string") {
              setMessage(
                response?.data?.data?.description ||
                  response?.data?.description ||
                  "Validation successful"
              );
            } else {
              setResult(
                response?.data?.data?.description ||
                  response?.data?.description ||
                  {}
              );
            }
          } else {
            console.error("Invalid input:", value);
            setMessage("Unable to validate input");
            setIsValid(false);
          }
        }
      } catch (error) {
        console.error("Error validating input:", error);
        setMessage(
          error?.response?.data?.message || "Unable to validate input"
        );
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    },
    [method, responseType, url]
  );

  useEffect(() => {
    if (value) {
      const timeoutId = setTimeout(() => {
        validateInput(value);
      }, 700);
      return () => clearTimeout(timeoutId);
    }
  }, [validateInput, value]);
  return (
    <div>
      <div className="relative flex items-center">
        <input
          placeholder={element?.placeholder || ""}
          type={element?.inputType || "text"}
          className={clsx("input-control", element?.customClass)}
          {...register(element?.id)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValueState(e.target.value);
            setValue(element?.id, e.target.value);
          }}
          disabled={element.isReadOnly}
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
            <span className="text-green-600 text-lg pr-3 block">
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

      {responseType === "object" && (
        <div className="grid grid-cols-2 gap-6 text-sm text-gray-600 mt-2">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex items-center gap-x-2">
              <span className="font-semibold">{key}:</span>
              {isValidImage(value) ? (
                <ImageViewer imageUrl={value} />
              ) : (
                <span>{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
