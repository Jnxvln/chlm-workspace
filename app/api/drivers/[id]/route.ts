import prisma from "@/prisma/Prisma";

const parseDriverUpdates = (updates: any) => {
  if (updates && updates.endDumpPayRate) {
    updates.endDumpPayRate = parseFloat(updates.endDumpPayRate);
  }

  if (updates && updates.flatBedPayRate) {
    updates.flatBedPayRate = parseFloat(updates.flatBedPayRate);
  }

  if (updates && updates.ncPayRate) {
    updates.ncPayRate = parseFloat(updates.ncPayRate);
  }

  if (updates && updates.dateHired) {
    if (updates.dateHired.toString().toLowerCase() === "invalid date") {
      updates.dateHired = null;
    } else {
      updates.dateHired = new Date(updates.dateHired);
    }
  } else {
    updates.dateHired = null;
  }

  if (updates && updates.dateReleased) {
    if (updates.dateReleased.toString().toLowerCase() === "invalid date") {
      updates.dateReleased = null;
    } else {
      updates.dateReleased = new Date(updates.dateReleased);
    }
  } else {
    updates.dateReleased = null;
  }
};

export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  const updates = await req.json();

  if (!updates)
    return Response.json(
      {
        error:
          "[PUT /api/drivers/:id] No driver updates object found in request to server",
      },
      { status: 400 }
    );

  parseDriverUpdates(updates);

  const updDriver = await prisma.driver.update({
    where: {
      id: parseInt(`${params.id}`),
    },
    data: updates,
  });

  if (!updDriver)
    return Response.json(
      { error: "[PUT /api/drivers/:id] Driver update operation failed" },
      { status: 500 }
    );

  return Response.json(updDriver);
}

export async function DELETE({ params }: { params: { id: number } }) {
  const delDriver = await prisma.driver.delete({
    where: {
      id: parseInt(`${params.id}`),
    },
  });

  if (!delDriver)
    return Response.json(
      { error: "[DELETE /api/drivers/:id] Driver delete operation failed" },
      { status: 500 }
    );

  return Response.json(delDriver);
}
