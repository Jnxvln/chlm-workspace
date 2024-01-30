import prisma from "@/prisma/Prisma";

export async function GET(req: Request) {
  console.log("[GET /api/drivers] Fetching drivers...");
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

  console.log("Response: ");
  console.log(drivers);

  return Response.json(drivers, { status: 200 });
}
