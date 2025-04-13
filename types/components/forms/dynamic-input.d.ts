import { UseFormRegister, FieldErrors } from "react-hook-form";
interface InputProps {
    label: string;
    name: string;
    register?: UseFormRegister<any>;
    errors?: FieldErrors;
    element?: any;
    type?: "text" | "checkbox" | "number" | "amount" | "textarea";
    placeholder?: string;
    className?: string;
    isFloating?: boolean;
    setValue?: any;
    value?: any;
    trigger?: any;
    prefix?: string;
    disabled?: boolean;
}
export declare const DynamicInput: ({ label, name, register, errors, className, type, placeholder, isFloating, setValue, value, trigger, prefix, disabled }: InputProps) => import("react/jsx-runtime").JSX.Element;
export {};
