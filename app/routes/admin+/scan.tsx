import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/react';
import { useActionData } from '@remix-run/react';
import { useSubmit } from '@remix-run/react';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { useCallback, useEffect, useState } from 'react';
import { useZxing } from 'react-zxing';
import invariant from 'tiny-invariant';

import ScanResultDialog from '~/components/Scan/ScanResultDialog';
import { verifyAztec } from '~/services/aztec.server';
import { isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';

const HINTS = new Map([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.AZTEC]]]);

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Scan - Abiball' }];
};

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone();
  await isAuthenticated(request, {
    redirectTo: '/admin/scan',
    checkVerified: true,
    checkAdmin: true
  });

  const formData = await clonedRequest.formData();
  const payload = formData.get('payload');

  try {
    invariant(typeof payload === 'string', 'Ungültiger Payload');

    const data = verifyAztec(payload);

    invariant(typeof data.id === 'string', 'Ungültiger Payload');

    const ticket = await db.ticket.findUnique({
      where: {
        id: data.id
      },
      select: {
        firstname: true,
        lastname: true,
        ownerId: true
      }
    });

    invariant(ticket, 'Ticket nicht gefunden');

    invariant(ticket.ownerId === data.ownerId, 'Ungültiger Besitzer');

    const owner = await db.user.findUnique({
      where: {
        id: ticket.ownerId
      },
      select: {
        firstname: true,
        lastname: true
      }
    });

    invariant(owner, 'Besitzer nicht gefunden');

    const result = {
      firstname: ticket.firstname,
      lastname: ticket.lastname,
      ownerFirstname: owner.firstname,
      ownerLastname: owner.lastname
    };

    return json(result);
  } catch (e) {
    if (e instanceof Error) {
      return json({ data: e.message });
    }
    return json({ data: 'Unbekannter Fehler' });
  }
}

export async function loader({ request }: LoaderArgs) {
  await isAuthenticated(request, {
    redirectTo: '/admin/scan',
    checkVerified: true,
    checkAdmin: true
  });

  return null;
}

export default function Scan() {
  const [result, setResult] = useState<null | string | Record<string, string>>(null);
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!actionData) {
      return;
    }
    if (isErrorMessage(actionData)) {
      setResult(actionData.data);
    } else {
      setResult(actionData);
    }
  }, [actionData]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setResult(null);

    setIsOpen(false);
  }, []);

  const { ref } = useZxing({
    hints: HINTS,
    onResult(result) {
      openModal();
      const formData = new FormData();
      formData.append('payload', result.getText());
      submit(formData, {
        method: 'POST'
      });
    },
    paused: isOpen
  });

  return (
    <main className="flex flex-col justify-center text-center">
      <ScanResultDialog isOpen={isOpen} closeModal={closeModal} result={result} />
      <video ref={ref} className="max-h-screen w-screen" />
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isErrorMessage(obj: any): obj is { data: string } {
  if ('data' in obj) {
    if (typeof obj.data === 'string') {
      return true;
    }
  }
  return false;
}
