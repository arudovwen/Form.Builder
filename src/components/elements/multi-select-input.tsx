import { Fragment, useEffect, useState, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import AppIcon from "@/components/ui/AppIcon";

export default function MultiSelectInput({
  element,
  validationData,
  placeholder,
}: {
  element: any;
  validationData: any;
  placeholder?: string;
}) {
  const [selectedValues, setSelectedValues] = useState<
    { label: string; value: any }[]
  >(element.value || []);

  const {
    register = () => ({}),
    setValue,
    isReadOnly,
  } = validationData || {};

  const displayValue = useMemo(
    () => selectedValues.map((i) => i.label).join(", "),
    [selectedValues]
  );

  /* ---------------- Register field ---------------- */
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);
console.log({selectedValues, options:element.options});

  return (
    <div className="custom-select">
    
      <Listbox
        value={selectedValues}
        onChange={(values) => {
          setSelectedValues(values);
          setValue?.(element.id, values);
        }}
        multiple
        disabled={isReadOnly}
        by="value"
      >
        <div className="custom-select__wrapper">
          <Listbox.Button
            className="custom-select__control field-control"
            disabled={isReadOnly}
          >
            <span className="custom-select__value">
              {selectedValues.length > 0 ? (
                displayValue
              ) : (
                <span className="custom-select__placeholder">
                  {placeholder ?? " Select options"}
                </span>
              )}
            </span>

            <span className="custom-select__icon">
              <AppIcon icon="lucide:chevron-down" />
            </span>
          </Listbox.Button>

          <Transition as={Fragment} leave="custom-select__transition">
            <Listbox.Options
              anchor="bottom start"
              className="custom-select__options"
            >
              {element?.options?.map(
                (option: { label: string; value: any }, index: number) => (
                  <Listbox.Option
                    key={index}
                    value={option}
                    className={({ active }) =>
                      `custom-select__option ${
                        active ? "custom-select__option--active" : ""
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="custom-select__option-row">
                        <span
                          className={`custom-select__option-label ${
                            selected ? "custom-select__option--selected" : ""
                          }`}
                        >
                          {option.label}
                        </span>

                        {selected && (
                          <span className="custom-select__check">✓</span>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ),
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
