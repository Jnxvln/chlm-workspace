import prisma from "@/prisma/Prisma";

function parseData(data: any) {
  if (!data) return;
  if (!data.chtFuelSurcharge || data.chtFuelSurcharge === "") {
    data.chtFuelSurcharge = 0.0;
  } else {
    data.chtFuelSurcharge = parseFloat(data.chtFuelSurcharge);
  }

  if (!data.vendorFuelSurcharge || data.vendorFuelSurcharge === "") {
    data.vendorFuelSurcharge = 0.0;
  } else {
    data.vendorFuelSurcharge = parseFloat(data.vendorFuelSurcharge);
  }
}

export async function GET(req: Request) {
  const vendors = await prisma.vendor.findMany({
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  if (!vendors)
    return Response.json(
      {
        error: "No response from server [Vendors]",
      },
      { status: 500 }
    );

  return Response.json(vendors, { status: 200 });
}

export async function POST(req: Request) {
  const reqBody = await req.json();

  if (!reqBody)
    return Response.json(
      {
        error: "Server failed to process creation of new vendor",
      },
      { status: 400 }
    );

  parseData(reqBody);

  console.log("[POST /api/vendors] Parsed req body: ");
  console.log(reqBody);

  const vendor = await prisma.vendor.create({
    data: reqBody,
  });

  if (!vendor)
    return Response.json({
      error: "Server failed to create vendor",
    });

  return Response.json(vendor, { status: 200 });
}
