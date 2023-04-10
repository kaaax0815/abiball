export type ErrorTextProps = {
  result: string;
};

export default function ErrorText({ result }: ErrorTextProps) {
  return (
    <p className="text-sm text-gray-500">
      <span className="font-semibold">Fehler:</span> {result}
    </p>
  );
}
