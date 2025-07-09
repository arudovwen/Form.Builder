import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface RatingProps {
  value?: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
  className?: string;
  element: any;
  validationData: any;
}

const Rating: React.FC<RatingProps> = ({
  value = 0,
  max = 5,
  readOnly = false,
  onChange,
  size = 24,
  className = "",
  element,
  validationData,
}) => {
  const {
    register = () => ({}),
    trigger,
    setValue,
    watch,
    isReadOnly,
  } = validationData || {};

  const fieldValue = watch?.(element.id) ?? 0;
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    // Initialize default value if not already set
    if (fieldValue === undefined || fieldValue === null) {
      setValue?.(element.id, value);
    }
  }, []);

  const handleClick = (index: number) => {
    if (!readOnly && !isReadOnly) {
      const newValue = index + 1;
      setValue?.(element.id, newValue);
      trigger?.(element.id);
      onChange?.(newValue);
    }
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      <input type="hidden" {...register(element.id)} />
      {Array.from({ length: max }, (_, i) => {
        const filled = hovered !== null ? i <= hovered : i < fieldValue;
        return (
          <Icon
            key={i}
            icon={filled ? "mdi:star" : "mdi:star-outline"}
            className={`cursor-pointer transition-colors ${
              filled ? "text-yellow-400" : "text-gray-300"
            }`}
            width={size}
            height={size}
            onMouseEnter={() => !(readOnly || isReadOnly) && setHovered(i)}
            onMouseLeave={() => !(readOnly || isReadOnly) && setHovered(null)}
            onClick={() => handleClick(i)}
          />
        );
      })}
    </div>
  );
};

export default Rating;
