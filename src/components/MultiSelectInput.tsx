import React, { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import AppIcon from "./ui/AppIcon";
import "./CustomSelect.css"; // reuse same CSS

interface Option {
  id: string;
  label: string;
  value?: any;
}

interface MultiSelectInputProps {
  value?: Option[];
  onChange?: (value: Option[]) => void;
  options: Option[];
}

export default function MultiSelectInput({
  value = [],
  onChange,
  options,
}: MultiSelectInputProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(value);

  useEffect(() => {
    onChange?.(selectedOptions);
  }, [selectedOptions, onChange]);

  const filteredOptions = options.filter(
    (opt) => !selectedOptions.some((sel) => sel.id === opt.id)
  );

  const removeItem = (id: string) => {
    setSelectedOptions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="custom-select">
      <Listbox value={selectedOptions} onChange={setSelectedOptions} multiple>
        <div className="custom-select__wrapper">
          <Listbox.Button className="custom-select__control">
            <span className="custom-select__value">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((opt) => opt.label).join(", ")
              ) : (
                <span className="custom-select__placeholder">
                  Select options
                </span>
              )}
            </span>
            <span className="custom-select__icon">
              <AppIcon icon="lucide:chevron-down" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            anchor={{ to: "bottom start" }}
            className="custom-select__options"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    `custom-select__option ${
                      active ? "custom-select__option--active" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <span
                      className={`custom-select__option-label ${
                        selected ? "custom-select__option--selected" : ""
                      }`}
                    >
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))
            ) : (
              <div className="custom-select__empty">
                No options available
              </div>
            )}
          </Listbox.Options>
        </div>
      </Listbox>

      {selectedOptions.length > 0 && (
        <div className="custom-select__chips">
          {selectedOptions.map((opt) => (
            <span key={opt.id} className="custom-select__chip">
              {opt.label}
              <button
                type="button"
                onClick={() => removeItem(opt.id)}
                className="custom-select__chip-remove"
              >
                <AppIcon icon="humbleicons:times" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
