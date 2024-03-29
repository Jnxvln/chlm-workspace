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
import { TDriver } from "@/app/Types";
import toast from "react-hot-toast";
import Requirement from "@/app/components/Requirement/Requirement";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import SuccessEmoji from "@/app/components/Emojicons/SuccessEmoji";
import ErrorEmoji from "@/app/components/Emojicons/ErrorEmoji";
import CalendarReveal from "@/app/components/CalendarReveal/CalendarReveal";
import Loading from "@/app/components/Loading/Loading";
import Dialog from "../../components/Dialog/Dialog";
import styles from "./DriversTable.module.scss";

type TDriverForm = {
  id?: string | number | undefined | null;
  firstName: string;
  lastName: string;
  defaultTruck?: string | undefined | null;
  endDumpPayRate: number;
  flatBedPayRate: number;
  ncPayRate: number;
  dateHired?: Date | string | undefined | null;
  dateReleased?: Date | string | undefined | null;
  isActive?: boolean | undefined | null;
};

export default function DriversTable() {
  const queryClient = useQueryClient();

  // #region VARIABLES
  const {
    data: drivers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["drivers"],
    queryFn: getAllDrivers,
  });

  const emptyForm: TDriverForm = {
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

  const emptyNewDriverForm: TDriverForm = {
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

  const [form, setForm] = useState<TDriverForm>({
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

  const [newDriverForm, setNewDriverForm] = useState<TDriverForm>({
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

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    endDumpPayRate: false,
    flatBedPayRate: false,
    ncPayRate: false,
  });

  const [selectedDriver, setSelectedDriver] = useState<
    TDriver | undefined | null
  >();

  const [showUnits, setShowUnits] = useState(false);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewDriverDialog, setShowNewDriverDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [inputConfirmDriverName, setInputConfirmDriverName] = useState("");
  // #endregion

  // #region MUTATIONS
  const createDriverMutation = useMutation({
    mutationKey: ["drivers"],
    mutationFn: () => createDriver(newDriverForm),
    onSuccess: (data) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setNewDriverForm(emptyNewDriverForm);
      setShowNewDriverDialog(false);
      toast("Driver added", {
        icon: <SuccessEmoji />,
      });
    },
    onError: (error) => {
      setLoading(false);
      if (error && error.message) {
        console.log(error.message);
        console.error(error);
        toast(error.message, {
          icon: <ErrorEmoji />,
        });
      } else {
        console.log(
          "[DriversTable createDriverMutation] onError: Failed to create new driver!"
        );
        console.error(error);
        toast("Failed to create new driver", {
          icon: <ErrorEmoji />,
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
        icon: <SuccessEmoji />,
      });
    },
    onError: (error) => {
      setLoading(false);
      if (error?.message) {
        console.log(error.message);
      }
      console.error(error);
      toast("Failed to update driver", {
        icon: <ErrorEmoji />,
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
        icon: <SuccessEmoji />,
      });
    },
    onError: (error) => {
      setLoading(false);
      setInputConfirmDriverName("");
      toast("Error deleting driver", {
        icon: <ErrorEmoji />,
      });
      console.log("Error deleting driver");
      if (error?.message) {
        console.log(error.message);
      }
      console.error(error);
    },
  });

  // #endregion Mutations

  // #region CONTENT (RENDERING)
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
              {/* Row 1: First Name */}
              <tr>
                <td>
                  First Name: <Requirement />
                </td>
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

              {/* Row 2: Last Name*/}
              <tr>
                <td>
                  Last Name: <Requirement />
                </td>
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

              {/* Row 3: Default Truck */}
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

              {/* Row 4: End Dump Rate */}
              <tr>
                <td>
                  End Dump Rate: <Requirement />
                </td>
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

              {/* Row 5: Flat Bed Rate */}
              <tr>
                <td>
                  Flat Bed Rate: <Requirement />
                </td>
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

              {/* Row 6:  NC Pay Rate*/}
              <tr>
                <td>
                  NC Pay Rate: <Requirement />
                </td>
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

              {/* Row 7: Date Hired */}
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

              {/* Row 8: Date Released */}
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

              {/* Row 9: Is Active */}
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
  // #endregion

  // #region EVENTS

  const validateNewDriverForm = () => {
    console.log("[DriversTable validateNewDriverForm] Validating form...");

    const formErrors = {
      firstName: false,
      lastName: false,
      endDumpPayRate: false,
      flatBedPayRate: false,
      ncPayRate: false,
    };

    if (!newDriverForm.firstName || newDriverForm.firstName.length <= 0) {
      formErrors.firstName = true;
    }

    if (!newDriverForm.lastName || newDriverForm.lastName.length <= 0) {
      formErrors.lastName = true;
    }

    if (newDriverForm.endDumpPayRate < 0) {
      formErrors.endDumpPayRate = true;
    }

    if (newDriverForm.flatBedPayRate < 0) {
      formErrors.flatBedPayRate = true;
    }

    if (newDriverForm.ncPayRate < 0) {
      formErrors.ncPayRate = true;
    }

    console.log("Errors detected: ");
    console.log(formErrors);

    return formErrors;
  };

  const createNewDriver = () => {
    // Set loading state to disable submit button
    setLoading(true);

    // Validate new contact form
    const _formErrors = validateNewDriverForm();
    setFormErrors(_formErrors);

    if (
      _formErrors.firstName ||
      _formErrors.lastName ||
      _formErrors.endDumpPayRate ||
      _formErrors.flatBedPayRate ||
      _formErrors.ncPayRate
    ) {
      toast("Missing required fields", {
        icon: <ErrorEmoji />,
      });
      setLoading(false);
      return;
    } else {
      createDriverMutation.mutate();
    }
  };

  const onEditDriver = (driverArg: TDriver) => {
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

  const onDeleteDriver = (driverArg: any) => {
    if (!driverArg) return;

    // Confirm delete
    setShowConfirmDialog(true);

    setSelectedDriver(driverArg);

    // deleteDriverMutation.mutate(driverId);
  };

  const onToggleUnits = (e: ChangeEvent<HTMLInputElement>) => {
    setShowUnits(e.target.checked);
    localStorage.setItem("drivers-showUnits", e.target.checked);
  };
  // #endregion Events

  // #region USE-EFFECTS
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

  useEffect(() => {
    if (localStorage && localStorage.getItem("drivers-showUnits")) {
      const val = localStorage.getItem("drivers-showUnits");
      if (val?.toString().toLowerCase() === "true") {
        setShowUnits(true);
      } else {
        setShowUnits(false);
      }
    }
  }, []);
  // #endregion

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
        {/* New Driver button */}
        <div>
          <button
            type="button"
            className={styles.newDriverButton}
            onClick={onNewDriver}
          >
            New Driver
          </button>
        </div>

        {/* Show Units Toggle */}
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="showUnits"
            checked={showUnits}
            onChange={onToggleUnits}
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
          {/* Drivers table */}
          {drivers?.map((driver: TDriver) => (
            <tr key={driver.id.toString()}>
              {/* Driver ID */}
              <td>{driver.id.toString()}</td>

              {/* First Name */}
              <td>{driver.firstName ? driver.firstName : null}</td>

              {/* Last Name */}
              <td>{driver.lastName ? driver.lastName : null}</td>

              {/* Default Truck */}
              <td>{driver.defaultTruck ? driver.defaultTruck : null}</td>

              {/* End Dump Pay Rate */}
              <td>
                {driver.endDumpPayRate
                  ? `$${driver.endDumpPayRate.toFixed(2).toString()}`
                  : null}
                {showUnits ? <PerLabel label="t" /> : null}
              </td>

              {/* Flat Bed Pay Rate */}
              <td>
                {driver.flatBedPayRate
                  ? `$${driver.flatBedPayRate.toFixed(2).toString()}`
                  : null}
                {showUnits ? <PerLabel label="t" /> : null}
              </td>

              {/* NC Pay Rate */}
              <td>
                $
                {driver.ncPayRate
                  ? driver.ncPayRate.toFixed(2).toString()
                  : null}
                {showUnits ? <PerLabel label="hr" /> : null}
              </td>

              {/* Date Hired */}
              <td>
                {driver.dateHired
                  ? dayjs(driver.dateHired).format("MM/DD/YY")
                  : null}
              </td>

              {/* Date Released */}
              <td>
                {driver.dateReleased
                  ? dayjs(driver.dateReleased).format("MM/DD/YY")
                  : null}
              </td>

              {/* Active */}
              <td>
                <div className="text-center">
                  {driver.isActive ? "Yes" : "No"}
                </div>
              </td>

              {/* Updated At */}
              <td>
                {driver.updatedAt ? (
                  <CalendarReveal date={driver.updatedAt} />
                ) : null}
              </td>

              {/* Created At */}
              <td>
                {driver.createdAt ? (
                  <CalendarReveal date={driver.createdAt} />
                ) : null}
              </td>

              {/* Action Buttons */}
              <td>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={(e) => onEditDriver(driver)}
                  >
                    E
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={(e) => onDeleteDriver(driver)}
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
