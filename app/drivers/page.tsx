import Heading from "../components/Heading/Heading";
import DriversTable from "./DriversTable/DriversTable";
import Dialog from "../components/Dialog/Dialog";

export default function Drivers() {
  return (
    <div className="p-4">
      <Heading title="Drivers" />
      <br />
      <DriversTable />
    </div>
  );
}
