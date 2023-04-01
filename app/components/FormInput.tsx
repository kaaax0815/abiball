export type FormInputProps = {
  id: string;
  /** @default "text" */
  type?: React.HTMLInputTypeAttribute;
  name: string;
  label: string;
  autoComplete: string;
  error: string | undefined;
  defaultValue?: string;
};

export default function FormInput({
  id,
  type,
  name,
  label,
  autoComplete,
  error,
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
        className={
          'text-sm sm:text-base relative w-full border-0 rounded placeholder-gray-400 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 py-2 pr-2 pl-2' +
          `${error ? ' ring-red-500' : ''}`
        }
        defaultValue={defaultValue}
      />
      {error ? (
        <div className="text-red-500 text-sm">
          <p role="alert">{error}</p>
        </div>
      ) : null}
    </div>
  );
}
