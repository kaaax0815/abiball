export type FormErrorProps = {
  error: string | undefined | null;
};

export default function FormError({ error }: FormErrorProps) {
  if (!error) {
    return null;
  }
  return (
    <div className="text-red-500 text-sm mt-3">
      <p role="alert">{error}</p>
    </div>
  );
}
