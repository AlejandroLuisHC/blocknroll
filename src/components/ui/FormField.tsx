import type React from "react";
import type { ChangeEvent } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  options,
  rows = 4,
  className = "",
  pattern,
  inputMode,
}: FormFieldProps) => {
  const baseClasses = type === "select" ? "form-select" : "form-control";

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseClasses} ${className}`}
            placeholder={placeholder}
            rows={rows}
          />
        );
      case "select":
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${baseClasses} ${className}`}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseClasses} ${className}`}
            placeholder={placeholder}
            pattern={pattern}
            inputMode={inputMode}
          />
        );
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-medium">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {renderInput()}
    </div>
  );
};

export default FormField;
