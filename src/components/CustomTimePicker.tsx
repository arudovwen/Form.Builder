import React, { useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import AppIcon from "./ui/AppIcon";
import clsx from "clsx";
import { getItem } from "../utils/localStorageControl";

interface CustomTimePickerProps {
  value?: string | null;
  onGetValue?: (name: string, time: string | null) => void;
  readOnly?: boolean;
  name: string;
  placeholder?: string;
  is24Hour?: boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value = null,
  onGetValue,
  readOnly = false,
  name,
  placeholder = "Select time",
  is24Hour = false,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(value || null);
  const config = getItem("config");
  const primaryColor = config?.buttonColor || "#7F56D9";
  
  useEffect(() => {
    if (value !== selectedTime) {
      setSelectedTime(value || null);
    }
  }, [value]);

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    if (onGetValue) {
      onGetValue(name, newTime);
    }
  };

  const hours = is24Hour ? Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) : Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ["AM", "PM"];

  // Parsing current selected time
  let currentHour = "12";
  let currentMinute = "00";
  let currentPeriod = "AM";

  if (selectedTime) {
    const [time, period] = selectedTime.split(" ");
    if (time) {
      const [h, m] = time.split(":");
      if (h) currentHour = h.padStart(2, '0');
      if (m) currentMinute = m.padStart(2, '0');
    }
    if (period) {
      currentPeriod = period.toUpperCase();
    }
  }

  const updateTime = (h: string, m: string, p: string) => {
    const newTime = is24Hour ? `${h}:${m}` : `${h}:${m} ${p}`;
    handleTimeChange(newTime);
  };

  return (
    <div className="relative w-full">
      <style>{`
        .hide-time-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-time-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Popover className="relative w-full">
        {({ open }) => (
          <>
            <Popover.Button
              disabled={readOnly}
              className={clsx(
                " !flex items-center justify-between field-control w-full text-left bg-white transition-all",
                readOnly ? "opacity-60 cursor-not-allowed bg-gray-50" : "hover:border-purple-300",
                !selectedTime && "text-gray-400"
              )}
            >
              <span>{selectedTime || placeholder}</span>
              <AppIcon icon="mdi:clock-outline" iconClass="text-gray-400 text-lg inline" />
            </Popover.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-1 scale-95"
            >
              <Popover.Panel anchor="bottom start" className="z-[9999] mt-2 w-[280px] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl overflow-hidden p-4 flex flex-col gap-3">
                <div className="text-sm font-semibold text-gray-700 px-1 border-b border-gray-100 pb-2">Select Time</div>
                <div className="flex gap-2 h-48 justify-center items-stretch">
                  {/* Hours */}
                  <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto hide-time-scrollbar">
                    {hours.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => updateTime(h, currentMinute, currentPeriod)}
                        style={currentHour === h ? { backgroundColor: primaryColor } : {}}
                        className={clsx(
                          "w-full py-2 text-center rounded-xl text-sm transition-all duration-200 focus:outline-none flex-shrink-0",
                          currentHour === h ? "text-white font-medium shadow-md shadow-gray-200" : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-center font-bold text-gray-300 text-lg">:</div>
                  {/* Minutes */}
                  <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto hide-time-scrollbar">
                    {minutes.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => updateTime(currentHour, m, currentPeriod)}
                        style={currentMinute === m ? { backgroundColor: primaryColor } : {}}
                        className={clsx(
                          "w-full py-2 text-center rounded-xl text-sm transition-all duration-200 focus:outline-none flex-shrink-0",
                          currentMinute === m ? "text-white font-medium shadow-md shadow-gray-200" : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  {/* AM/PM */}
                  {!is24Hour && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 pl-1 border-l border-gray-100 ml-1">
                      {periods.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateTime(currentHour, currentMinute, p)}
                          style={currentPeriod === p ? { backgroundColor: primaryColor } : {}}
                          className={clsx(
                            "w-full py-3 text-center rounded-xl text-sm transition-all duration-200 focus:outline-none flex items-center justify-center font-medium",
                            currentPeriod === p ? "text-white shadow-md shadow-gray-200" : "text-gray-500 bg-gray-50 hover:bg-gray-100"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default CustomTimePicker;
