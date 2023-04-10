export type ResultTextProps = {
  result: Record<string, string>;
};

export default function ResultText({ result }: ResultTextProps) {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Vorname:</span> {result.firstname}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Nachname:</span> {result.lastname}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Besitzer:</span> {result.ownerFirstname}{' '}
        {result.ownerLastname}
      </p>
    </div>
  );
}
