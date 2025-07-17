import clsx from "clsx";
import AppIcon from "../ui/AppIcon";
import { getItem } from "../../utils/localStorageControl";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

type SignDocumentProps = {
  element: {
    id: string;
    placeholder?: string;
    inputType?: string;
    customClass?: string;
    validationUrl: string;
    documentObj: string;
  };
  validationData: {
    register?: (id: string) => any;
    isReadOnly?: boolean;
  };
};

export default function SignDocument({
  element,
  validationData,
}: SignDocumentProps) {
  const { register = () => ({}), isReadOnly } = validationData || {};
  const { validationUrl, documentObj, signatureLink } = element;
  const config = useMemo(() => getItem("config"), []);

  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);

  const checkSignStatus = useCallback(async () => {
    if (!validationUrl || !documentObj) return;
    try {
      setChecking(true);
      const { data } = await axios.get(`${validationUrl}/${documentObj}`);
      const signed = Boolean(data?.data?.isSigned ?? data?.isSigned);
      setIsSigned(signed);
      return signed;
    } catch (error) {
      console.error("Failed to check sign status", error);
    } finally {
      setChecking(false);
    }
  }, [validationUrl, documentObj]);

  // Poll until signed
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = async () => {
      const signed = await checkSignStatus();
      if (!signed) {
        intervalId = setInterval(async () => {
          const stillSigned = await checkSignStatus();
          if (stillSigned && intervalId) {
            clearInterval(intervalId);
          }
        }, 2000);
      }
    };

    if (!isSigned && documentObj && validationUrl) {
      startPolling();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkSignStatus, isSigned, documentObj, validationUrl]);

  return (
    <div className="flex items-center gap-x-2">
      <input
        placeholder={element.placeholder}
        type={element.inputType}
        className={clsx("field-control", element.customClass)}
        {...register(element.id)}
        disabled={isReadOnly}
      />

      <a href={isSigned ? "#" : signatureLink}>
        <button
          type="button"
          onClick={checkSignStatus}
          disabled={checking || isSigned}
          style={{ background: config?.buttonColor || "#333" }}
          className={clsx(
            "flex items-center gap-x-1 rounded-lg border border-gray-200 bg-gray-200 px-3 py-[10px] text-sm text-white",
            { "!opacity-60": checking }
          )}
        >
          <AppIcon
            icon={
              checking
                ? "solar:refresh-outline" // replace with spinner icon if you want
                : isSigned
                ? "solar:check-circle-bold"
                : "solar:pen-2-line-duotone"
            }
            iconClass={checking ? "animate-spin" : ""}
          />
          {checking ? "Checking..." : isSigned ? "Signed" : "Sign"}
        </button>
      </a>
    </div>
  );
}
