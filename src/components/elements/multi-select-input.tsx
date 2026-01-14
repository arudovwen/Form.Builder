import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import AppIcon from "@/components/ui/AppIcon";

export default function MultiSelectInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const [selectedValues, setSelectedValues] = useState<
    { label: string; value: any }[]
  >(element.value || []);

  const {
    register = () => ({}),
    setValue,
    watch,
    isReadOnly,
  } = validationData || {};

  const registeredValue = watch?.(element?.id);

  /* ---------------- Register field ---------------- */
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  /* ---------------- Sync value ---------------- */
  useEffect(() => {
    setValue?.(element.id, selectedValues);
  }, [element.id, selectedValues, setValue]);

  /* ---------------- Restore value ---------------- */
  useEffect(() => {
    if (registeredValue?.length && !selectedValues.length) {
      setSelectedValues(registeredValue);
    }
  }, [registeredValue, selectedValues.length]);

  return (
    <div className="custom-select">
      <Listbox
        value={selectedValues}
        onChange={setSelectedValues}
        multiple
        disabled={isReadOnly}
      >
        <div className="custom-select__wrapper">
          <Listbox.Button
            className="custom-select__control field-control"
            disabled={isReadOnly}
          >
            <span className="custom-select__value">
              {selectedValues.length > 0 ? (
                selectedValues.map((i) => i.label).join(", ")
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
                )
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
