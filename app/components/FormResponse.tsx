export type FormResponseProps = {
  response: string | undefined | null;
  type?: 'error' | 'success';
};

export default function FormResponse({ type, response }: FormResponseProps) {
  if (!response) {
    return null;
  }
  return (
    <div className={`mt-3 text-sm ${type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
      <p role="alert">{response}</p>
    </div>
  );
}

export type ActionFormResponseProps = {
  actionData:
    | {
        message: string;
        type: 'error' | 'success';
      }
    | undefined;
};

export function ActionFormResponse({ actionData }: ActionFormResponseProps) {
  if (!actionData) {
    return null;
  }
  return <FormResponse type={actionData.type} response={actionData.message} />;
}
