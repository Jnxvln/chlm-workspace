"use client";
import ContactsTable from "./ContactsTable/ContactsTable";
import Heading from "../components/Heading/Heading";

export default function Contacts() {
  return (
    <div className="p-4">
      <Heading title="Contacts" />
      <ContactsTable />
    </div>
  );
}
