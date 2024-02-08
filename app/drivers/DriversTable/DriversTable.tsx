"use client";
import { useState, useEffect, ChangeEvent } from "react";
import dayjs from "dayjs";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getAllDrivers,
  createDriver,
  updateDriverById,
  deleteDriverById,
} from "@/app/controllers/DriverController";
import toast from "react-hot-toast";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { TDriver } from "@/app/Types";
import CalendarReveal from "@/app/components/CalendarReveal/CalendarReveal";
import Loading from "@/app/components/Loading/Loading";
import Dialog from "../../components/Dialog/Dialog";
import styles from "./DriversTable.module.scss";

export default function DriversTable() {
  const queryClient = useQueryClient();

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

  const emptyNewDriverForm = {
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

  const [newDriverForm, setNewDriverForm] = useState({
    firstName: "",
    lastName: "",
    defaultTruck: "",
    endDumpPayRate: 0,
    flatBedPayRate: 0,
    ncPayRate: 0,
    dateHired: undefined,
    dateReleased: undefined,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState<
    TDriver | undefined | null
  >();

  const [showUnits, setShowUnits] = useState(true);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewDriverDialog, setShowNewDriverDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [inputConfirmDriverName, setInputConfirmDriverName] = useState("");

  // #region Mutations
  const newDriverMutation = useMutation({
    mutationKey: ["drivers"],
    mutationFn: () => createDriver(newDriverForm),
    onSuccess: (data) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setNewDriverForm(emptyNewDriverForm);
      setShowNewDriverDialog(false);
      toast("Driver added", {
        icon: "✔️",
      });
    },
    onError: (error) => {
      setLoading(false);
      if (error && error.message) {
        console.log(error.message);
        console.error(error);
        toast(error.message, {
          icon: "❌",
        });
      } else {
        console.log(
          "[DriversTable newDriverMutation] onError: Failed to create new driver!"
        );
        console.error(error);
        toast("Failed to create new driver", {
          icon: "❌",
        });
      }
    },
  });

  const updateDriverMutation = useMutation({
    mutationKey: ["drivers"],
    mutationFn: updateDriverById,
    onSuccess: (data) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setForm(emptyForm);
      setShowEditDialog(false);
      toast(`${data.firstName} updated!`, {
        icon: "✔️",
      });
    },
    onError: (error) => {
      setLoading(false);
      if (error?.message) {
        console.log(error.message);
      }
      console.error(error);
      toast("Failed to update driver", {
        icon: "❌",
      });
    },
  });

  const deleteDriverMutation = useMutation({
    mutationKey: ["drivers"],
    mutationFn: (driverId) => deleteDriverById(driverId),
    onSuccess: (data) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setShowConfirmDialog(false);
      setInputConfirmDriverName("");
      toast("Driver deleted", {
        icon: "✔️",
      });
    },
    onError: (error) => {
      setLoading(false);
      setInputConfirmDriverName("");
      toast("Error deleting driver", {
        icon: "❌",
      });
      console.log("Error deleting driver");
      if (error?.message) {
        console.log(error.message);
      }
      console.error(error);
    },
  });

  // #endregion Mutations

  // #region Content (render)
  const PerLabel = ({ label }: { label: string }) => {
    return <span className={styles.perLabel}>/{label}</span>;
  };

  const editDialogContent = (driverArg: TDriver | undefined | null) => {
    if (!driverArg) return null;
    return (
      <div>
        <header>
          <h3 className="text-xl font-bold text-center">
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
                        name="id"
                        tabIndex={-1}
                        value={form.id}
                        readOnly
                        style={{ backgroundColor: "transparent" }}
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
                        name="firstName"
                        value={form.firstName}
                        onChange={onChange}
                        placeholder="First Name"
                        required
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
                        name="lastName"
                        value={form.lastName}
                        onChange={onChange}
                        placeholder="Last Name"
                        required
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
                        name="defaultTruck"
                        value={form.defaultTruck}
                        onChange={onChange}
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
                        name="endDumpPayRate"
                        min={0}
                        step={0.01}
                        value={form.endDumpPayRate}
                        onChange={onChange}
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
                        name="flatBedPayRate"
                        min={0}
                        step={0.01}
                        value={form.flatBedPayRate}
                        onChange={onChange}
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
                        name="ncPayRate"
                        min={0}
                        step={0.01}
                        value={form.ncPayRate}
                        onChange={onChange}
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
                        name="dateHired"
                        value={form.dateHired}
                        onChange={onChange}
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
                        name="dateReleased"
                        value={form.dateReleased}
                        onChange={onChange}
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
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={onChangeCheckbox}
                      />
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

  const confirmDialogContent = (driverArg: TDriver | undefined | null) => {
    if (!driverArg) return null;
    return (
      <div>
        <div>
          You&apos;re about to{" "}
          <strong className="text-red-600">
            delete {driverArg.firstName} {driverArg.lastName}
          </strong>
          .
          <div>
            <strong>This cannot be undone!</strong>
          </div>
          <div className="mt-4">
            Type the driver's first and last name to confirm
          </div>
        </div>
        <div>
          <input
            type="text"
            value={inputConfirmDriverName}
            onChange={(e) => setInputConfirmDriverName(e.target.value)}
          />
        </div>
      </div>
    );
  };

  const newDriverDialogContent = () => {
    return (
      <div>
        <form>
          <table className={styles.editDriverTable}>
            <tbody>
              <tr>
                <td>First Name: </td>
                <td>
                  <input
                    type="text"
                    name="firstName"
                    value={newDriverForm.firstName}
                    onChange={onChangeNewDriverForm}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Last Name: </td>
                <td>
                  <input
                    type="text"
                    name="lastName"
                    value={newDriverForm.lastName}
                    onChange={onChangeNewDriverForm}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Default Truck: </td>
                <td>
                  <input
                    type="text"
                    name="defaultTruck"
                    value={newDriverForm.defaultTruck}
                    onChange={onChangeNewDriverForm}
                  />
                </td>
              </tr>
              <tr>
                <td>End Dump Rate: </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    name="endDumpPayRate"
                    value={newDriverForm.endDumpPayRate}
                    onChange={onChangeNewDriverForm}
                  />
                </td>
              </tr>
              <tr>
                <td>Flat Bed Rate: </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    name="flatBedPayRate"
                    value={newDriverForm.flatBedPayRate}
                    onChange={onChangeNewDriverForm}
                  />
                </td>
              </tr>
              <tr>
                <td>NC Pay Rate: </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    name="ncPayRate"
                    value={newDriverForm.ncPayRate}
                    onChange={onChangeNewDriverForm}
                  />
                </td>
              </tr>
              <tr>
                <td>Date Hired: </td>
                <td>
                  <input
                    type="date"
                    name="dateHired"
                    value={newDriverForm.dateHired}
                    onChange={onChangeNewDriverForm}
                  />
                </td>
              </tr>
              <tr>
                <td>Date Released: </td>
                <td>
                  <input
                    type="date"
                    name="dateReleased"
                    value={newDriverForm.dateReleased}
                    onChange={onChangeNewDriverForm}
                  />
                </td>
              </tr>
              <tr>
                <td>Is Active: </td>
                <td>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newDriverForm.isActive}
                    onChange={onChangeNewDriverCheckbox}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  };
  // #endregion Content (render)

  // #region Events
  const createNewDriver = () => {
    newDriverMutation.mutate(newDriverForm);
  };

  const onEdit = (driverArg: TDriver) => {
    setSelectedDriver(driverArg);
    setShowEditDialog(true);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeNewDriverForm = (e: ChangeEvent<HTMLInputElement>) => {
    setNewDriverForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => ({
      ...prevState,
      isActive: e.target.checked,
    }));
  };

  const onChangeNewDriverCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setNewDriverForm((prevState) => ({
      ...prevState,
      isActive: e.target.checked,
    }));
  };

  const onNewDriver = () => {
    setSelectedDriver(null);
    setShowNewDriverDialog(true);
  };

  const onSubmit = () => {
    setLoading(true);
    updateDriverMutation.mutate(form);
  };

  const onDelete = (driverArg: any) => {
    if (!driverArg) return;

    // Confirm delete
    setShowConfirmDialog(true);

    setSelectedDriver(driverArg);

    // deleteDriverMutation.mutate(driverId);
  };
  // #endregion Events

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
        loading={loading}
        callbacks={{
          cancel: () => {
            // Clear form & hide dialog
            setForm(emptyForm);
            setShowEditDialog(false);
          },
          save: () => onSubmit(),
        }}
      />

      <Dialog
        title="Confirm"
        content={confirmDialogContent(selectedDriver)}
        show={showConfirmDialog}
        loading={loading}
        callbacks={{
          yes: () => {
            if (!selectedDriver)
              return new Error("No driver selected to delete");

            if (!inputConfirmDriverName || inputConfirmDriverName.length === 0)
              return alert(
                "You must enter the driver's name to confirm deletion"
              );

            if (
              inputConfirmDriverName.toLowerCase() !==
              `${selectedDriver.firstName} ${selectedDriver.lastName}`.toLowerCase()
            ) {
              return alert(
                "The names do not match, try again (case doesn't matter)"
              );
            }

            deleteDriverMutation.mutate(selectedDriver.id);
          },
          no: () => {
            setInputConfirmDriverName("");
            setShowConfirmDialog(false);
          },
        }}
      />

      <Dialog
        title="New Driver"
        content={newDriverDialogContent()}
        show={showNewDriverDialog}
        loading={loading}
        callbacks={{
          save: () => createNewDriver(),
          cancel: () => {
            // Clear the form and hide the dialog
            setNewDriverForm(emptyNewDriverForm);
            setShowNewDriverDialog(false);
          },
        }}
      />

      <div className="mb-4 flex gap-6 items-center">
        <div>
          <button
            type="button"
            className={styles.newDriverButton}
            onClick={onNewDriver}
          >
            New Driver
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="showUnits"
            checked={showUnits}
            onChange={(e) => {
              setShowUnits(!showUnits);
              localStorage.setItem("drivers-showUnits", showUnits.toString());
            }}
          />
          <label htmlFor="showUnits">Show Units</label>
        </div>
      </div>

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
                {showUnits ? <PerLabel label="t" /> : null}
              </td>
              <td>
                {driver.flatBedPayRate
                  ? `$${driver.flatBedPayRate.toFixed(2).toString()}`
                  : null}
                {showUnits ? <PerLabel label="t" /> : null}
              </td>
              <td>
                $
                {driver.ncPayRate
                  ? driver.ncPayRate.toFixed(2).toString()
                  : null}
                {showUnits ? <PerLabel label="hr" /> : null}
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
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    // onClick={() => onDelete(driver.id)}
                    onClick={(e) => onDelete(driver)}
                  >
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
