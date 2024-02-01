"use client";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDrivers } from "@/app/controllers/DriverController";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { TDriver } from "@/app/Types";
import { TDialog } from "../../components/Dialog/Dialog";
import CalendarReveal from "@/app/components/CalendarReveal/CalendarReveal";
import Loading from "@/app/components/Loading/Loading";
import Dialog from "../../components/Dialog/Dialog";
import styles from "./DriversTable.module.scss";

export default function DriversTable() {
  const {
    data: drivers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["drivers"],
    queryFn: getAllDrivers,
  });

  const emptyForm = {
    id: "",
    firstName: "",
    lastName: "",
    defaultTruck: "",
    endDumpPayRate: 0,
    flatBedPayRate: 0,
    ncPayRate: 0,
    dateHired: undefined,
    dateReleased: undefined,
    isActive: false,
  };

  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    defaultTruck: "",
    endDumpPayRate: 0,
    flatBedPayRate: 0,
    ncPayRate: 0,
    dateHired: undefined,
    dateReleased: undefined,
    isActive: false,
  });

  const [selectedDriver, setSelectedDriver] = useState<
    TDriver | undefined | null
  >();

  const [showEditDialog, setShowEditDialog] = useState(false);

  const PerLabel = ({ label }: { label: string }) => {
    return <span className={styles.perLabel}>/{label}</span>;
  };

  const editDialogContent = (driverArg: TDriver | undefined | null) => {
    if (!driverArg) return null;
    return (
      <div>
        <header>
          <h3 className="text-xl font-bold">
            {driverArg.firstName} {driverArg.lastName}
          </h3>
        </header>
        <section>
          <form>
            <table className={styles.editDriverTable}>
              <tbody>
                {/* ID */}
                <tr>
                  <td>ID: </td>
                  <td>
                    <div>
                      <input
                        type="text"
                        tabIndex={-1}
                        value={form.id}
                        readOnly
                      />
                    </div>
                  </td>
                </tr>

                {/* First Name */}
                <tr>
                  <td>First Name: </td>
                  <td>
                    <div>
                      <input
                        type="text"
                        value={form.firstName}
                        placeholder="First Name"
                      />
                    </div>
                  </td>
                </tr>

                {/* Last Name */}
                <tr>
                  <td>Last Name: </td>
                  <td>
                    <div>
                      <input
                        type="text"
                        value={form.lastName}
                        placeholder="Last Name"
                      />
                    </div>
                  </td>
                </tr>

                {/* Default Truck */}
                <tr>
                  <td>Default Truck: </td>
                  <td>
                    <div>
                      <input
                        type="text"
                        value={form.defaultTruck}
                        placeholder="Default Truck"
                      />
                    </div>
                  </td>
                </tr>

                {/* End Dump Pay Rate */}
                <tr>
                  <td>End Dump Rate: </td>
                  <td>
                    <div>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={form.endDumpPayRate}
                      />
                    </div>
                  </td>
                </tr>

                {/* Flat Bed Pay Rate */}
                <tr>
                  <td>Flat Bed Rate: </td>
                  <td>
                    <div>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={form.flatBedPayRate}
                      />
                    </div>
                  </td>
                </tr>

                {/* NC Pay Rate */}
                <tr>
                  <td>NC Rate: </td>
                  <td>
                    <div>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={form.ncPayRate}
                      />
                    </div>
                  </td>
                </tr>

                {/* Date Hired */}
                <tr>
                  <td>Hired: </td>
                  <td>
                    <div>
                      <input
                        type="date"
                        value={form.dateHired}
                        placeholder="Date Hired"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </td>
                </tr>

                {/* Date Released */}
                <tr>
                  <td>Released: </td>
                  <td>
                    <div>
                      <input
                        type="date"
                        value={form.dateReleased}
                        placeholder="Date Released"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </td>
                </tr>

                {/* Is Active */}
                <tr>
                  <td>Active: </td>
                  <td>
                    <div>
                      <input type="checkbox" checked={form.isActive} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </section>
      </div>
    );
  };

  const onEdit = (driverArg: TDriver) => {
    console.log(driverArg);
    setSelectedDriver(driverArg);
    setShowEditDialog(true);
  };

  const onEditCallback = () => {
    setShowEditDialog(false);
  };

  const onCancelEditCallback = () => {
    setForm(emptyForm);
    setShowEditDialog(false);
  };

  useEffect(() => {
    if (selectedDriver) {
      setForm((prevState) => ({
        ...prevState,
        id: selectedDriver.id,
        firstName: selectedDriver.firstName,
        lastName: selectedDriver.lastName,
        defaultTruck: selectedDriver.defaultTruck,
        endDumpPayRate: parseFloat(selectedDriver.endDumpPayRate).toFixed(2),
        flatBedPayRate: parseFloat(selectedDriver.flatBedPayRate).toFixed(2),
        ncPayRate: parseFloat(selectedDriver.ncPayRate).toFixed(2),
        dateHired: dayjs(selectedDriver.dateHired).format("YYYY-MM-DD"),
        dateReleased: dayjs(selectedDriver.dateReleased).format("YYYY-MM-DD"),
        isActive: selectedDriver.isActive,
      }));
    }
  }, [selectedDriver]);

  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (isLoading) return <Loading />;

  return (
    <div className={styles.wrapper}>
      <Dialog
        title="Edit Driver"
        content={editDialogContent(selectedDriver)}
        show={showEditDialog}
        footer="save-cancel"
        callbacks={{
          cancel: () => {
            // Clear form & hide dialog
            setForm(emptyForm);
            setShowEditDialog(false);
          },
          save: () => alert("save edit driver"),
        }}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Truck</th>
            <th>ED Rate</th>
            <th>FB Rate</th>
            <th>NC Rate</th>
            <th>Hired</th>
            <th>Released</th>
            <th>Active</th>
            <th>Updated</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers?.map((driver: TDriver) => (
            <tr key={driver.id.toString()}>
              <td>{driver.id.toString()}</td>
              <td>{driver.firstName ? driver.firstName : null}</td>
              <td>{driver.lastName ? driver.lastName : null}</td>
              <td>{driver.defaultTruck ? driver.defaultTruck : null}</td>
              <td>
                {driver.endDumpPayRate
                  ? `$${driver.endDumpPayRate.toFixed(2).toString()}`
                  : null}
                <PerLabel label="t" />
              </td>
              <td>
                {driver.flatBedPayRate
                  ? `$${driver.flatBedPayRate.toFixed(2).toString()}`
                  : null}
                <PerLabel label="t" />
              </td>
              <td>
                $
                {driver.ncPayRate
                  ? driver.ncPayRate.toFixed(2).toString()
                  : null}
                <PerLabel label="hr" />
              </td>
              <td>
                {driver.dateHired
                  ? dayjs(driver.dateHired).format("MM/DD/YY")
                  : null}
              </td>
              <td>
                {driver.dateReleased
                  ? dayjs(driver.dateReleased).format("MM/DD/YY")
                  : null}
              </td>
              <td>
                <div className="text-center">
                  {driver.isActive ? "Yes" : "No"}
                </div>
              </td>
              <td>
                {driver.updatedAt ? (
                  <CalendarReveal date={driver.updatedAt} />
                ) : null}
              </td>
              <td>
                {driver.createdAt ? (
                  <CalendarReveal date={driver.createdAt} />
                ) : null}
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={(e) => onEdit(driver)}
                  >
                    E
                  </button>
                  <button type="button" className={styles.deleteBtn}>
                    X
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
