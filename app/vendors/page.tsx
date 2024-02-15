import Heading from "../components/Heading/Heading";
import VendorsTable from "./VendorsTable/VendorsTable";
import Dialog from "../components/Dialog/Dialog";

export default function Vendors() {
  return (
    <div className="p-4">
      <Heading title="Vendors" />
      <br />
      <VendorsTable />
    </div>
  );
}
