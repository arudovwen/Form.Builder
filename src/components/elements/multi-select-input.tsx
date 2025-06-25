import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

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

  const { register = () => ({}), setValue, watch } = validationData || {};
  const registeredValue = watch && watch(element?.id);
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  useEffect(() => {
    if (setValue) {
      setValue(element.id, selectedValues);
    }
  }, [element.id, selectedValues, setValue]);
  useEffect(() => {
    if (registeredValue?.length && !selectedValues?.length) {
      setSelectedValues(registeredValue);
    }
  }, [registeredValue, selectedValues?.length]);

  return (
    <div className="w-full z-10">
      <Listbox value={selectedValues} onChange={setSelectedValues} multiple  disabled={validationData?.isReadOnly}>
        <div className="relative">
          <Listbox.Button
            className="w-full py-2 pl-3 pr-10 text-left bg-white input-control cursor-default "
            disabled={validationData?.isReadOnly}
          >
            {selectedValues?.length > 0
              ? selectedValues?.map((i) => i.label).join(", ")
              : "Select options"}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1  grid gap-y-[1px] bg-white rounded-md shadow-lg  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {element?.options?.map(
                (option: { label: string; value: any }, index: number) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `cursor-default select-none relative  w-full flex justify-between ${
                        active ? "text-gray-700 bg-gray-100" : "text-gray-700"
                      }`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <div
                        className={`flex items-center justify-between py-2 pl-4 pr-4 w-full ${
                          selected ? "bg-gray-100" : ""
                        }`}
                      >
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option?.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 right-3 flex items-center pl-3 text-gray-600">
                            ✓
                          </span>
                        ) : null}
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
