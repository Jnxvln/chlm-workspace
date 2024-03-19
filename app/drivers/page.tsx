import Heading from "../components/Heading/Heading";
import DriversTable from "./DriversTable/DriversTable";
import Dialog from "../components/Dialog/Dialog";

export default function Drivers() {
  return (
    <div className="p-4">
      <Heading title="Drivers" />
      <div className="mb-4">A list of current and past truck drivers</div>

      <br />
      <DriversTable />
    </div>
  );
}
