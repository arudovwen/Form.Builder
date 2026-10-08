import React, { useState, useRef, useCallback, useEffect } from "react";

interface MentionField {
  id: string;
  display: string;
}

type Token =
  | { type: "operator"; value: string }
  | { type: "field"; id: string; display: string };

interface FormulaMentionInputProps {
  value: string;
  onChange: (value: string) => void;
  fields: MentionField[];
  placeholder?: string;
}

// Convert raw @[display](id) formula string → token array
function parseFormula(formula: string): Token[] {
  const tokens: Token[] = [];
  const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(formula)) !== null) {
    const before = formula.slice(lastIndex, match.index);
    if (before) tokens.push({ type: "operator", value: before });
    tokens.push({ type: "field", id: match[2], display: match[1] });
    lastIndex = match.index + match[0].length;
  }

  const remaining = formula.slice(lastIndex);
  if (remaining) tokens.push({ type: "operator", value: remaining });

  return tokens;
}

// Convert token array → raw formula string
function serializeFormula(tokens: Token[]): string {
  return tokens
    .map((t) =>
      t.type === "field" ? `@[${t.display}](${t.id})` : t.value
    )
    .join("");
}

export default function FormulaMentionInput({
  value,
  onChange,
  fields,
  placeholder,
}: FormulaMentionInputProps) {
  const [tokens, setTokens] = useState<Token[]>(() => parseFormula(value));
  const [activeOpIndex, setActiveOpIndex] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickerInsertAt, setPickerInsertAt] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const opInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  // Sync from outside value changes only on mount
  useEffect(() => {
    const parsed = parseFormula(value);
    setTokens(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = useCallback(
    (newTokens: Token[]) => {
      onChange(serializeFormula(newTokens));
    },
    [onChange]
  );

  const updateOperator = (index: number, val: string) => {
    const next = [...tokens];
    next[index] = { type: "operator", value: val };
    setTokens(next);
    emitChange(next);
  };

  const removeToken = (index: number) => {
    const next = tokens.filter((_, i) => i !== index);
    // If we removed a field, merge adjacent operators
    setTokens(next);
    emitChange(next);
  };

  const openPickerAt = (insertTokenIndex: number) => {
    setPickerInsertAt(insertTokenIndex);
    setPickerQuery("");
    setShowPicker(true);
  };

  const insertField = (field: MentionField, explicitInsertAt?: number) => {
    // Use explicit value if provided (for quick-insert buttons which can't rely on async state),
    // fall back to the state value set by the picker modal.
    const insertAt = explicitInsertAt !== undefined ? explicitInsertAt : (pickerInsertAt ?? tokens.length);
    const next = [...tokens];

    const before = next.slice(0, insertAt);
    const after = next.slice(insertAt);

    const newTokens: Token[] = [
      ...before,
      { type: "field", id: field.id, display: field.display },
      ...after,
    ];

    // Ensure there is always an operator slot between / before / after field tokens
    const withGaps = ensureOperatorGaps(newTokens);
    setTokens(withGaps);
    emitChange(withGaps);
    setShowPicker(false);
    setPickerInsertAt(null);
  };

  // Ensure every field token has operator tokens on both sides
  function ensureOperatorGaps(tkns: Token[]): Token[] {
    const result: Token[] = [];
    if (tkns.length === 0) return [{ type: "operator", value: "" }];

    if (tkns[0].type === "field") result.push({ type: "operator", value: "" });

    for (let i = 0; i < tkns.length; i++) {
      result.push(tkns[i]);
      if (
        tkns[i].type === "field" &&
        (i + 1 >= tkns.length || tkns[i + 1].type === "field")
      ) {
        result.push({ type: "operator", value: "" });
      }
    }

    return result;
  }

  const filteredFields = fields.filter((f) =>
    f.display.toLowerCase().includes(pickerQuery.toLowerCase())
  );

  const isEmpty = tokens.every(
    (t) => t.type === "operator" && t.value.trim() === ""
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Token editor */}
      <div
        className="field-control flex flex-wrap items-center gap-1 min-h-[44px] cursor-text"
        style={{ padding: "6px 10px" }}
        onClick={() => {
          // Click on empty space → focus last operator or add new
          const lastOp = [...tokens].reverse().findIndex((t) => t.type === "operator");
          if (lastOp !== -1) {
            const idx = tokens.length - 1 - lastOp;
            opInputRefs.current.get(idx)?.focus();
          }
        }}
      >
        {isEmpty && (
          <span className="text-gray-400 text-sm pointer-events-none select-none">
            {placeholder || "Build your formula..."}
          </span>
        )}

        {tokens.map((token, i) => {
          if (token.type === "field") {
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full font-medium select-none"
              >
                {token.display}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    removeToken(i);
                  }}
                  className="text-blue-400 hover:text-blue-700 leading-none ml-0.5"
                  aria-label={`Remove ${token.display}`}
                >
                  ×
                </button>
              </span>
            );
          }

          // Operator token — editable
          return (
            <input
              key={i}
              ref={(el) => {
                if (el) opInputRefs.current.set(i, el);
                else opInputRefs.current.delete(i);
              }}
              type="text"
              value={token.value}
              onChange={(e) => updateOperator(i, e.target.value)}
              onFocus={() => setActiveOpIndex(i)}
              onBlur={() => setActiveOpIndex(null)}
              className="border-none outline-none bg-transparent text-sm font-mono p-0 m-0"
              style={{
                width: `${Math.max(token.value.length * 9 + 8, activeOpIndex === i ? 40 : 14)}px`,
                minWidth: "14px",
                maxWidth: "200px",
              }}
              placeholder={i === 0 && isEmpty ? "" : ""}
              aria-label={`Operator at position ${i}`}
            />
          );
        })}

        {/* Add field button always at end */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            openPickerAt(tokens.length);
          }}
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1.5 py-0.5 rounded transition-colors"
          title="Insert a field"
        >
          <span className="text-base leading-none">@</span>
        </button>
      </div>
 {/* Preview */}
      {!isEmpty && (
        <div className="mt-2 text-xs bg-blue-50 text-blue-800 border border-blue-100 rounded px-2 py-1.5 font-mono break-words">
          <span className="font-sans font-semibold text-blue-500 uppercase tracking-wide mr-1">
            Preview:
          </span>
          {tokens
            .map((t) => (t.type === "field" ? `[${t.display}]` : t.value))
            .join("")}
        </div>
      )}
      {/* Field picker dropdown */}
      {showPicker && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onMouseDown={() => setShowPicker(false)}
          />
          <div
            ref={pickerRef}
            className="absolute left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
            style={{ top: "calc(100% + 4px)" }}
          >
            <div className="p-2 border-b border-gray-100">
              <input
                autoFocus
                type="text"
                placeholder="Search fields..."
                value={pickerQuery}
                onChange={(e) => setPickerQuery(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-gray-200 rounded outline-none focus:border-blue-300"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowPicker(false);
                  if (e.key === "Enter" && filteredFields.length > 0) {
                    insertField(filteredFields[0]);
                  }
                }}
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredFields.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-3">
                  No matching fields
                </p>
              )}
              {filteredFields.map((field) => (
                <div
                  key={field.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertField(field);
                  }}
                  className="px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-blue-50 group"
                >
                  <span className="font-medium text-gray-800">
                    {field.display}
                  </span>
                  <span className="text-xs text-gray-400 font-mono group-hover:text-blue-400">
                    {field.id.slice(0, 8)}...
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Helper: quick-insert buttons below */}
      {fields.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {fields.map((f) => (
            <button
              key={f.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                // Pass tokens.length directly — do NOT rely on async setState
                insertField(f, tokens.length);
              }}
              className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border text-gray-600 px-2 py-0.5 rounded-full transition-colors"
            >
              + {f.display}
            </button>
          ))}
        </div>
      )}

     
    </div>
  );
}
