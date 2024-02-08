import { TDriverForm } from "../Types";

const API_DRIVERS = "http://localhost:3000/api/drivers";

const ERR_NORESP = "[DriverController] No response from server";
const ERR_PARSE = "[DriverController] Failed to parse data from server";

export async function getAllDrivers() {
  const response = await fetch(API_DRIVERS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);

  return data;
}

export async function createDriver(driverData: TDriverForm) {
  if (!driverData)
    throw new Error("[DriverController] Missing driver data argument");

  const response = await fetch(API_DRIVERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(driverData),
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);
}

export async function updateDriverById(driverArg: TDriverForm) {
  // Check for missing driverArg
  if (!driverArg)
    return new Error(
      "[DriverController error] Missing expected driver updates object"
    );

  // Take out the ID (we don't want to update that)
  const { id, ...driverUpdates } = driverArg;

  // Make a PUT request to update the driver
  const response = await fetch(`${API_DRIVERS}/${driverArg.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(driverUpdates),
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);

  return data;
}

export async function deleteDriverById(driverId: any) {
  if (!driverId)
    throw new Error("[DriverController] Cannot delete driver without ID");

  const response = await fetch(`${API_DRIVERS}/${driverId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);

  return data;
}
