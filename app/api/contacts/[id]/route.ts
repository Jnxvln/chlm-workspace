import prisma from "@/prisma/Prisma";

// const parseContactUpdates = (updates: any) => {
//   if (updates && updates.endDumpPayRate) {
//     updates.endDumpPayRate = parseFloat(updates.endDumpPayRate);
//   }

//   if (updates && updates.flatBedPayRate) {
//     updates.flatBedPayRate = parseFloat(updates.flatBedPayRate);
//   }

//   if (updates && updates.ncPayRate) {
//     updates.ncPayRate = parseFloat(updates.ncPayRate);
//   }

//   if (updates && updates.dateHired) {
//     if (updates.dateHired.toString().toLowerCase() === "invalid date") {
//       updates.dateHired = null;
//     } else {
//       updates.dateHired = new Date(updates.dateHired);
//     }
//   } else {
//     updates.dateHired = null;
//   }

//   if (updates && updates.dateReleased) {
//     if (updates.dateReleased.toString().toLowerCase() === "invalid date") {
//       updates.dateReleased = null;
//     } else {
//       updates.dateReleased = new Date(updates.dateReleased);
//     }
//   } else {
//     updates.dateReleased = null;
//   }
// };

export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  const updates = await req.json();

  if (!updates)
    return Response.json(
      {
        error:
          "[PUT /api/contacts/:id] No contact updates object found in request to server",
      },
      { status: 400 }
    );

  //   parseContactUpdates(updates);

  const updContact = await prisma.contact.update({
    where: {
      id: parseInt(`${params.id}`),
    },
    data: updates,
  });

  if (!updContact)
    return Response.json(
      { error: "[PUT /api/contacts/:id] Contact update operation failed" },
      { status: 500 }
    );

  return Response.json(updContact);
}

export async function DELETE({ params }: { params: { id: number } }) {

  console.log('[DELETE /api/contacts/:id] Deleting contact with id:' + params.id);

  const delContact = await prisma.contact.delete({
    where: {
      id: parseInt(`${params.id}`),
    },
  });

  if (!delContact)
    return Response.json(
      { error: "[DELETE /api/contacts/:id] Contact delete operation failed" },
      { status: 500 }
    );

  return Response.json(delContact);
}
