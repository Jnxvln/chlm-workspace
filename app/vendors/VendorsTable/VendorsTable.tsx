"use client";
import { useState, useEffect, ChangeEvent } from "react";
import dayjs from "dayjs";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getAllVendors,
  createVendor,
  updateVendorById,
  deleteVendorById,
} from "@/app/controllers/VendorController";
import toast from "react-hot-toast";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { TVendor } from "@/app/Types";
import CalendarReveal from "@/app/components/CalendarReveal/CalendarReveal";
import Loading from "@/app/components/Loading/Loading";
import Dialog from "../../components/Dialog/Dialog";
import styles from "./VendorsTable.module.scss";

export default function VendorsTable() {
  const queryClient = useQueryClient();

  const {
    data: vendors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vendors"],
    queryFn: getAllVendors,
  });

  const emptyForm = {
    id: "",
    name: "",
    shortName: "",
    chtFuelSurcharge: 0,
    vendorFuelSurcharge: 0,
    isActive: false,
  };

  const emptyNewVendorForm = {
    name: "",
    shortName: "",
    chtFuelSurcharge: 0,
    vendorFuelSurcharge: 0,
    isActive: false,
  };

  const [form, setForm] = useState(emptyForm);

  const [newVendorForm, setNewVendorForm] = useState({
    name: "",
    shortName: "",
    chtFuelSurcharge: 0,
    vendorFuelSurcharge: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState<
    TVendor | undefined | null
  >();

  const [showUnits, setShowUnits] = useState(false);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewVendorDialog, setShowNewVendorDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [inputConfirmVendorName, setInputConfirmVendorName] = useState("");

  // #region Mutations
  const newVendorMutation = useMutation({
    mutationKey: ["vendors"],
    mutationFn: () => createVendor(newVendorForm),
    onMutate: (data) => {
      console.log("[VendorsTable newVendorMutation onMutate] onMutate data: ");
      console.log(data);
    },
    onSuccess: (data) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setNewVendorForm(emptyNewVendorForm);
      setShowNewVendorDialog(false);
      toast("Vendor added", {
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
          "[VendorsTable newVendorMutation] onError: Failed to create new vendor!"
        );
        console.error(error);
        toast("Failed to create new vendor", {
          icon: "❌",
        });
      }
    },
  });

  const updateVendorMutation = useMutation({
    mutationKey: ["vendors"],
    mutationFn: updateVendorById,
    onSuccess: (data) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setForm(emptyForm);
      setShowEditDialog(false);
      toast(`${data.name} updated!`, {
        icon: "✔️",
      });
    },
    onError: (error) => {
      setLoading(false);
      if (error?.message) {
        console.log(error.message);
      }
      console.error(error);
      toast("Failed to update vendor", {
        icon: "❌",
      });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationKey: ["vendors"],
    mutationFn: (vendorId) => deleteVendorById(vendorId),
    onSuccess: (data) => {
      setLoading(false);
      setShowConfirmDialog(false);
      setInputConfirmVendorName("");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast("Vendor deleted", {
        icon: "✔️",
      });
    },
    onError: (error) => {
      setLoading(false);
      setInputConfirmVendorName("");
      toast("Error deleting vendor", {
        icon: "❌",
      });
      console.log("Error deleting vendor");
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

  const editDialogContent = (vendorArg: TVendor | undefined | null) => {
    if (!vendorArg) return null;
    return (
      <div>
        <header>
          <h3 className="text-xl font-bold text-center">
            {vendorArg.name} ({vendorArg.shortName})
          </h3>
        </header>
        <section>
          <form>
            <table className={styles.editVendorTable}>
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
                        style={{ backgroundColor: "transparent" }}
                        readOnly
                      />
                    </div>
                  </td>
                </tr>

                {/* Name */}
                <tr>
                  <td>Name: </td>
                  <td>
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Name"
                        required
                      />
                    </div>
                  </td>
                </tr>

                {/* Short Name */}
                <tr>
                  <td>Short Name: </td>
                  <td>
                    <div>
                      <input
                        type="text"
                        name="shortName"
                        value={form.shortName}
                        onChange={onChange}
                        placeholder="Short Name"
                        required
                      />
                    </div>
                  </td>
                </tr>

                {/* CHT Fuel Surcharge */}
                <tr>
                  <td>CHT Surcharge: </td>
                  <td>
                    <div>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        name="chtFuelSurcharge"
                        value={form.chtFuelSurcharge}
                        onChange={onChange}
                        placeholder="CHT Surcharge"
                      />
                    </div>
                  </td>
                </tr>

                {/* Vendor Fuel Surcharge */}
                <tr>
                  <td>Vendor Surcharge: </td>
                  <td>
                    <div>
                      <input
                        type="number"
                        name="vendorFuelSurcharge"
                        min={0}
                        step={0.01}
                        value={form.vendorFuelSurcharge}
                        onChange={onChange}
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

  const confirmDialogContent = (vendorArg: TVendor | undefined | null) => {
    if (!vendorArg) return null;
    return (
      <div>
        <div>
          You&apos;re about to{" "}
          <strong className="text-red-600">delete {vendorArg.name}</strong>.
          <div>
            <strong>This cannot be undone!</strong>
          </div>
          <div className="mt-4">
            Type the vendor's name as shown above to confirm
          </div>
        </div>
        <div>
          <input
            type="text"
            value={inputConfirmVendorName}
            onChange={(e) => setInputConfirmVendorName(e.target.value)}
          />
        </div>
      </div>
    );
  };

  const newVendorDialogContent = () => {
    return (
      <div>
        <form>
          <table className={styles.editVendorTable}>
            <tbody>
              <tr>
                <td>Name: </td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newVendorForm.name}
                    onChange={onChangeNewVendorForm}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Short Name: </td>
                <td>
                  <input
                    type="text"
                    name="shortName"
                    value={newVendorForm.shortName}
                    onChange={onChangeNewVendorForm}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>CHT Fuel Surcharge: </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    name="chtFuelSurcharge"
                    value={newVendorForm.chtFuelSurcharge}
                    onChange={onChangeNewVendorForm}
                  />
                </td>
              </tr>
              <tr>
                <td>Vendor Fuel Surcharge: </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    name="vendorFuelSurcharge"
                    value={newVendorForm.vendorFuelSurcharge}
                    onChange={onChangeNewVendorForm}
                  />
                </td>
              </tr>
              <tr>
                <td>Is Active: </td>
                <td>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newVendorForm.isActive}
                    onChange={onChangeNewVendorCheckbox}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  };

  const EmptySurcharge = () => {
    return <span className={styles.emptySurcharge}>$0.00</span>;
  };
  // #endregion Content (render)

  // #region Events
  const createNewVendor = () => {
    newVendorMutation.mutate(newVendorForm);
  };

  const onEdit = (vendorArg: TVendor) => {
    setSelectedVendor(vendorArg);
    setShowEditDialog(true);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeNewVendorForm = (e: ChangeEvent<HTMLInputElement>) => {
    setNewVendorForm((prevState) => ({
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

  const onChangeNewVendorCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setNewVendorForm((prevState) => ({
      ...prevState,
      isActive: e.target.checked,
    }));
  };

  const onNewVendor = () => {
    setSelectedVendor(null);
    setShowNewVendorDialog(true);
  };

  const onSubmit = () => {
    setLoading(true);
    updateVendorMutation.mutate(form);
  };

  const onDelete = (vendorArg: any) => {
    if (!vendorArg) return;

    // Confirm delete
    setSelectedVendor(vendorArg);
    setShowConfirmDialog(true);
  };

  const onToggleUnits = (e: ChangeEvent<HTMLInputElement>) => {
    setShowUnits(e.target.checked);
    localStorage.setItem("vendors-showUnits", e.target.checked);
  };
  // #endregion Events

  useEffect(() => {
    if (selectedVendor) {
      setForm((prevState) => ({
        ...prevState,
        id: selectedVendor.id,
        name: selectedVendor.name,
        shortName: selectedVendor.shortName,
        chtFuelSurcharge: parseFloat(selectedVendor.chtFuelSurcharge).toFixed(
          2
        ),
        vendorFuelSurcharge: parseFloat(
          selectedVendor.vendorFuelSurcharge
        ).toFixed(2),
        isActive: selectedVendor.isActive,
      }));
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (localStorage && localStorage.getItem("vendors-showUnits")) {
      const val = localStorage.getItem("vendors-showUnits");
      if (val?.toString().toLowerCase() === "true") {
        setShowUnits(true);
      } else {
        setShowUnits(false);
      }
    }
  }, []);

  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (isLoading) return <Loading />;

  return (
    <div className={styles.wrapper}>
      <Dialog
        title="Edit Vendor"
        content={editDialogContent(selectedVendor)}
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
        content={confirmDialogContent(selectedVendor)}
        show={showConfirmDialog}
        loading={loading}
        callbacks={{
          yes: () => {
            if (!selectedVendor)
              return new Error("No vendor selected to delete");

            if (!inputConfirmVendorName || inputConfirmVendorName.length === 0)
              return alert(
                "You must enter the vendor's name to confirm deletion"
              );

            if (
              inputConfirmVendorName.toLowerCase() !==
              selectedVendor.name.toLowerCase()
            ) {
              return alert(
                "The names do not match, try again (case doesn't matter)"
              );
            }

            deleteVendorMutation.mutate(selectedVendor.id);
          },
          no: () => {
            setInputConfirmVendorName("");
            setShowConfirmDialog(false);
          },
        }}
      />

      <Dialog
        title="New Vendor"
        content={newVendorDialogContent()}
        show={showNewVendorDialog}
        loading={loading}
        callbacks={{
          save: () => createNewVendor(),
          cancel: () => {
            // Clear the form and hide the dialog
            setNewVendorForm(emptyNewVendorForm);
            setShowNewVendorDialog(false);
          },
        }}
      />

      <div className="mb-4 flex gap-6 items-center">
        <div>
          <button
            type="button"
            className={styles.newVendorButton}
            onClick={onNewVendor}
          >
            New Vendor
          </button>
        </div>
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
            <th>Name</th>
            <th>Short Name</th>
            <th>CHT Fschg</th>
            <th>Vendor Fschg</th>
            <th>Active</th>
            <th>Updated</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors?.map((vendor: TVendor) => (
            <tr key={vendor.id.toString()}>
              <td>{vendor.id.toString()}</td>
              <td>{vendor.name ? vendor.name : null}</td>
              <td>{vendor.shortName ? vendor.shortName : null}</td>
              <td>
                {vendor.chtFuelSurcharge ? (
                  `$${vendor.chtFuelSurcharge.toFixed(2).toString()}`
                ) : (
                  <EmptySurcharge />
                )}
                {showUnits ? <PerLabel label="t" /> : null}
              </td>
              <td>
                {vendor.vendorFuelSurcharge ? (
                  `$${vendor.vendorFuelSurcharge.toFixed(2).toString()}`
                ) : (
                  <EmptySurcharge />
                )}
                {showUnits ? <PerLabel label="t" /> : null}
              </td>
              <td>
                <div className="text-center">
                  {vendor.isActive ? "Yes" : "No"}
                </div>
              </td>
              <td>
                {vendor.updatedAt ? (
                  <CalendarReveal date={vendor.updatedAt} />
                ) : null}
              </td>
              <td>
                {vendor.createdAt ? (
                  <CalendarReveal date={vendor.createdAt} />
                ) : null}
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={(e) => onEdit(vendor)}
                  >
                    E
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    // onClick={() => onDelete(vendor.id)}
                    onClick={(e) => onDelete(vendor)}
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
