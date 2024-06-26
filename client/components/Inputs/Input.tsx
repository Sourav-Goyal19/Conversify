"use client";
import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
  placeholder,
}) => {
  return (
    <div>
      <label
        className="block text-md font-medium leading-6 text-gray-900 dark:text-accent-1 capitalize"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2 sm:w-full">
        <input
          id={id}
          className={clsx(
            ` form-input block w-full rounded-md border-0 py-1.5 shadow-sm text-gray-900 ring-1 ring-inset ring-gray-300 dark:bg-primary dark:text-accent-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6`,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
          {...register(id, { required })}
          type={type ? type : "text"}
          required={required}
          disabled={disabled}
          autoComplete={id}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
