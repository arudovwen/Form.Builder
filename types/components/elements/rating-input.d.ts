import React from "react";
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
declare const Rating: React.FC<RatingProps>;
export default Rating;
