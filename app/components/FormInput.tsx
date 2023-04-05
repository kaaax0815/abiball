export type FormInputProps = {
  id: string;
  /** @default "text" */
  type?: React.HTMLInputTypeAttribute;
  name: string;
  label: string;
  autoComplete: AutoComplete;
  defaultValue?: string;
};

/** @author <https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete> */
export type AutoComplete =
  | 'on'
  | 'name'
  | 'given-name'
  | 'family-name'
  | 'email'
  | 'username'
  | 'new-password'
  | 'current-password';

export default function FormInput({
  id,
  type,
  name,
  label,
  autoComplete,
  defaultValue
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        required
        type={type ?? 'text'}
        id={id}
        name={name}
        autoComplete={autoComplete}
        className="relative w-full rounded border-0 p-2 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base"
        defaultValue={defaultValue}
      />
    </div>
  );
}
