export type FormErrorProps = {
  error: string | undefined | null;
};

export default function FormError({ error }: FormErrorProps) {
  if (!error) {
    return null;
  }
  return (
    <div className="mt-3 text-sm text-red-500">
      <p role="alert">{error}</p>
    </div>
  );
}
