import type { HTMLInputTypeAttribute } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  autoComplete?: string;
  options?: readonly { value: string; label: string }[];
  error?: string;
}

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  options,
  error,
}: FormFieldProps) => {
  const errorId = name + "-error";

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {options ? (
        <select id={name} name={name} value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      {error && <p id={errorId} className="field-error">{error}</p>}
    </div>
  );
};

export default FormField;
