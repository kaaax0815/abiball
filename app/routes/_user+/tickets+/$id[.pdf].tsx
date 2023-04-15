import type { LoaderArgs } from '@remix-run/node';
import { jsPDF } from 'jspdf';

import { generateAztec } from '~/services/aztec.server';
import { isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';
import { badRequest, fetchImage, forbidden, getOrigin, notFound } from '~/utils/request.server';

export async function loader({ request, params }: LoaderArgs) {
  const { userId } = await isAuthenticated(request, {
    redirectTo: '/tickets',
    checkVerified: true
  });

  if (!params.id) {
    return badRequest({ error: 'Missing ticket id' });
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
    return notFound({ error: 'Ticket not found' });
  }

  if (ticket.ownerId !== userId) {
    return forbidden({ error: 'Not allowed to access this resource' });
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    format: [210, 74]
  });
  doc.setFont('courier');

  const aztec = await generateAztec(ticket);
  doc.addImage(aztec, 'png', 10, 15, 30, 30);

  doc.setFont('courier', 'bold');
  doc.setFontSize(18);
  doc.text(ticket.firstname + ' ' + ticket.lastname, 10, 50, {
    maxWidth: 60
  });
  doc.setFont('courier', 'normal');

  doc.setFontSize(8);
  doc.text(ticket.owner.firstname + ' ' + ticket.owner.lastname, 10, 65);

  doc.setLineWidth(0.5);
  doc.line(70, 74, 70, 0);

  const logo = await fetchImage(`${getOrigin(request)}/Abimotto.png`);
  doc.addImage(logo, 'png', 75, 10, 30, 30);

  doc.setFontSize(12);
  doc.text('Abiball', 182, 10);

  doc.text('FrankenTherme Bad Königshofen', 126, 15);

  doc.setFontSize(8);
  doc.text(ticket.id, 140, 64);

  const pdf = doc.output('arraybuffer');

  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Abiball Ticket ${ticket.firstname} ${ticket.lastname}.pdf"`
    }
  });
}
