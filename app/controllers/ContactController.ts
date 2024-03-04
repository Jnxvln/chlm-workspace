import { TContactForm } from "../Types";

const API_CONTACTS = "http://localhost:3000/api/contacts";

const ERR_NORESP = "[ContactController] No response from server";
const ERR_PARSE = "[ContactController] Failed to parse data from server";

export async function getAllContacts() {
  const response = await fetch(API_CONTACTS, {
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

export async function createContact(contactData: TContactForm) {
  if (!contactData)
    throw new Error("[ContactController] Missing contact data argument");

  const response = await fetch(API_CONTACTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);
}

export async function updateContactById(contactArg: TContactForm) {
  // Check for missing contactArg
  if (!contactArg)
    return new Error(
      "[ContactController error] Missing expected contact updates object"
    );

  // Take out the ID (we don't want to update that)
  const { id, ...contactUpdates } = contactArg;

  // Make a PUT request to update the driver
  const response = await fetch(`${API_CONTACTS}/${contactArg.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactUpdates),
  });

  if (!response) return new Error(ERR_NORESP);

  const data = await response.json();

  if (!data) return new Error(ERR_PARSE);

  return data;
}

export async function deleteContactById(contactId: any) {
  if (!contactId)
    throw new Error("[ContactController] Cannot delete contact without ID");

  const response = await fetch(`${API_CONTACTS}/${contactId}`, {
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
