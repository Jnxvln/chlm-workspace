import { TVendor, TVendorForm } from "../Types";

const API_VENDORS = "http://localhost:3000/api/vendors";

const ERR_NORESP = "[VendorController] No response from server";
const ERR_PARSE = "[VendorController] Failed to parse data from server";

export async function getAllVendors() {
  const response = await fetch(API_VENDORS, {
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

export async function createVendor(vendorData: TVendorForm) {
  if (!vendorData)
    throw new Error("[VendorController] Missing vendor data argument");

  const response = await fetch(API_VENDORS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vendorData),
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);
}

export async function updateVendorById(vendorArg: TVendor) {
  // Check for missing vendorArg
  if (!vendorArg)
    return new Error(
      "[VendorController error] Missing expected vendor updates object"
    );

  // Take out the ID (we don't want to update that)
  const { id, ...vendorUpdates } = vendorArg;

  // Make a PUT request to update the vendor
  const response = await fetch(`${API_VENDORS}/${vendorArg.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vendorUpdates),
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);

  return data;
}

export async function deleteVendorById(vendorId: any) {
  if (!vendorId)
    throw new Error("[VendorController] Cannot delete vendor without ID");

  const response = await fetch(`${API_VENDORS}/${vendorId}`, {
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
