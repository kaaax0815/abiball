import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { generateAztec } from '~/services/aztec.server';
import { isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';
import { badRequest, success } from '~/utils/request.server';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (data.type === 'error') {
    return [
      {
        title: 'Fehler - Tickets - Abiball'
      }
    ];
  } else {
    return [
      {
        title: `${data.ticket.firstname} ${data.ticket.lastname} - Tickets - Abiball`
      }
    ];
  }
};

export async function loader({ request, params }: LoaderArgs) {
  const { userId } = await isAuthenticated(request, {
    redirectTo: '/tickets',
    checkVerified: true
  });

  if (!params.id) {
    return badRequest({ error: 'Ticket Id nicht angegeben' });
  }

  const ticket = await db.ticket.findUnique({
    where: {
      id: params.id
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      ownerId: true,
      owner: {
        select: {
          firstname: true,
          lastname: true
        }
      }
    }
  });

  if (!ticket) {
    return badRequest({ error: 'Ticket nicht gefunden' });
  }

  if (ticket.ownerId !== userId) {
    return badRequest({ error: 'Du darfst dieses Ticket nicht betrachten' });
  }

  const aztec = await generateAztec(ticket);
  const base64Url = `data:image/png;base64,${aztec.toString('base64')}`;

  return success({ ticket, base64Url });
}

export default function Ticket() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex min-w-[15rem] max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          {loaderData.type === 'error' ? (
            <div className="text-center text-red-500">{loaderData.error}</div>
          ) : (
            <>
              <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                {loaderData.ticket.firstname} {loaderData.ticket.lastname}
              </h2>
              <img src={loaderData.base64Url} alt="Aztec Code" className="h-64 w-64" />
              <p className="text-sm text-gray-600">
                Gekauft von: {loaderData.ticket.owner.firstname} {loaderData.ticket.owner.lastname}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
