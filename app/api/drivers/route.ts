import prisma from "@/prisma/Prisma";

function parseData(data: any) {
  if (!data) return;
  if (data.endDumpPayRate) {
    data.endDumpPayRate = parseFloat(data.endDumpPayRate);
  }

  if (data.flatBedPayRate) {
    data.flatBedPayRate = parseFloat(data.flatBedPayRate);
  }

  if (data.ncPayRate) {
    data.ncPayRate = parseFloat(data.ncPayRate);
  }

  if (data.dateHired) {
    data.dateHired = new Date(data.dateHired);
  } else {
    data.dateHired = null;
  }

  if (data.dateReleased) {
    data.dateReleased = new Date(data.dateReleased);
  } else {
    data.dateReleased = null;
  }
}

export async function GET(req: Request) {
  const drivers = await prisma.driver.findMany({
    orderBy: [
      {
        lastName: "asc",
      },
    ],
  });

  if (!drivers)
    return Response.json(
      {
        error: "No response from server [Drivers]",
      },
      { status: 500 }
    );

  return Response.json(drivers, { status: 200 });
}

export async function POST(req: Request) {
  const reqBody = await req.json();

  if (!reqBody)
    return Response.json(
      {
        error: "Server failed to process creation of new driver",
      },
      { status: 400 }
    );

  parseData(reqBody);

  const driver = await prisma.driver.create({
    data: reqBody,
  });

  if (!driver)
    return Response.json({
      error: "Server failed to create driver",
    });

  return Response.json(driver, { status: 200 });
}
