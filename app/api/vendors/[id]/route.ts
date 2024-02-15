import prisma from "@/prisma/Prisma";

// const parseVendorUpdates = (updates: any) => {
// };

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

export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  const updates = await req.json();

  if (!updates)
    return Response.json(
      {
        error:
          "[PUT /api/vendors/:id] No vendor updates object found in request to server",
      },
      { status: 400 }
    );

  parseData(updates);

  const updVendor = await prisma.vendor.update({
    where: {
      id: parseInt(`${params.id}`),
    },
    data: updates,
  });

  if (!updVendor)
    return Response.json(
      { error: "[PUT /api/vendors/:id] Vendor update operation failed" },
      { status: 500 }
    );

  return Response.json(updVendor);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: number } }
) {
  console.log("[DELETE /api/vendors/:id] ID: " + params.id.toString());

  const delVendor = await prisma.vendor.delete({
    where: {
      id: parseInt(`${params.id}`),
    },
  });

  if (!delVendor)
    return Response.json(
      { error: "[DELETE /api/vendors/:id] Vendor delete operation failed" },
      { status: 500 }
    );

  return Response.json(delVendor);
}
