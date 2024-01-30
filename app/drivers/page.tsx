import Heading from "../components/Heading/Heading";
import DriversTable from "./DriversTable/DriversTable";
import Dialog from "../components/Dialog/Dialog";

export default function Drivers() {
  return (
    <div>
      <Heading title="Drivers" />
      <br />
      <Dialog content="This is my first dialog" footer="ok" />
      <br />
      <DriversTable />
    </div>
  );
}
