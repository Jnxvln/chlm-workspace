import prisma from "@/prisma/Prisma";

// function parseData(data: any) {
//   if (!data) return;
//   if (data.endDumpPayRate) {
//     data.endDumpPayRate = parseFloat(data.endDumpPayRate);
//   }

//   if (data.flatBedPayRate) {
//     data.flatBedPayRate = parseFloat(data.flatBedPayRate);
//   }

//   if (data.ncPayRate) {
//     data.ncPayRate = parseFloat(data.ncPayRate);
//   }

//   if (data.dateHired) {
//     data.dateHired = new Date(data.dateHired);
//   } else {
//     data.dateHired = null;
//   }

//   if (data.dateReleased) {
//     data.dateReleased = new Date(data.dateReleased);
//   } else {
//     data.dateReleased = null;
//   }
// }

export async function GET(req: Request) {
  const contacts = await prisma.contact.findMany({
    orderBy: [
      {
        lastName: "asc",
      },
    ],
  });

  if (!contacts)
    return Response.json(
      {
        error: "No response from server [Contacts]",
      },
      { status: 500 }
    );

  return Response.json(contacts, { status: 200 });
}

export async function POST(req: Request) {
  const reqBody = await req.json();

  if (!reqBody)
    return Response.json(
      {
        error: "Server failed to process creation of new Contact",
      },
      { status: 400 }
    );

  //   parseData(reqBody);

  console.log("[API /contacts POST] reqBody: ");
  console.log(reqBody);

  // TODO: Separate out the `locations` property, create the contact, THEN add locations?
  const {locations, ...bodyWithoutLocs} = reqBody

  console.log('bodyWithoutLocs: ')
  console.log(bodyWithoutLocs)

  const contact = await prisma.contact.create({
    data: bodyWithoutLocs,
  });

  if (!contact)
    return Response.json({
      error: "Server failed to create Contact",
    });


  // Add locations to the contact
  const contactWithLocs = await prisma.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      locations: {
        create: reqBody.locations,
      },
    },
  })

  return Response.json(contact, { status: 200 });
}
