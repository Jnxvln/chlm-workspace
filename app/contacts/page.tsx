"use client";
import styles from "./Contacts.module.scss";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect, ChangeEvent } from "react";
import Dialog from "../components/Dialog/Dialog";
import { createContact } from "../controllers/ContactController";

type TLocation = {
  address: string | String;
  coordinates?: string | String;
  directions?: string | String;
};

type TForm = {
  firstName: string | String;
  lastName: string | String;
  company?: string | String | undefined | null;
  phone: string | String;
  email?: string | String | undefined | null;
  locations: Array<TLocation>;
};

export default function Contacts() {
  const locationsRef = useRef<HTMLSelectElement>(null);
  const [deleteLocationsDisabled, setDeleteLocationsDisabled] =
    useState<boolean>(true);
  const [showNewContactDialog, setShowNewContactDialog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emptyForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    email: "",
    locations: [],
  });
  const [emptyLocationForm] = useState({
    address: "1234 Someplace Dr\nTexarkana, TX 75501",
    coordinates: "12.345, 56.789",
    directions: "LT here\nRT there\nYou're there",
  });
  const [form, setForm] = useState<TForm>({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    email: "",
    locations: [],
  });
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    ""
  );
  const [newLocationForm, setNewLocationForm] = useState(emptyLocationForm);
  const [formErrors, setFormErrors] = useState({
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
  });
  const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);

  // #region MUTATIONS
  // TODO: Create mutations
  const createContactMutation = useMutation({
    mutationKey: ["contacts"],
    mutationFn: () => createContact(form),
    onSuccess: (data) => {
      setLoading(false);
      toast("Contact created successfully", {
        icon: "✔️",
      });
    },
    onError: (err) => {
      setLoading(false);
      console.log(err);
      toast("Failed to create contact", {
        icon: "❌",
      });
    },
  });
  // #endregion

  // #region EVENTS
  const onChangeNewContactForm = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const formErrors = {
      firstName: false,
      lastName: false,
      phone: false,
      email: false,
    };

    if (!form.firstName || form.firstName.length <= 0) {
      formErrors.firstName = true;
    }

    if (!form.lastName || form.lastName.length <= 0) {
      formErrors.lastName = true;
    }

    if (!form.phone || form.phone.length <= 0) {
      formErrors.phone = true;
    }

    if (!form.email || form.email.length <= 0) {
      formErrors.email = true;
    }

    return formErrors;
  };

  const onSubmitNewContact = () => {
    // Set loading state to disable submit button
    setLoading(true);

    // Validate new contact form
    const _formErrors = validateForm();
    setFormErrors(_formErrors);

    if (
      _formErrors.firstName ||
      _formErrors.lastName ||
      _formErrors.phone ||
      _formErrors.email
    ) {
      toast("Missing required fields", {
        icon: "❌",
      });
      setLoading(false);
      return;
    } else {
      createContactMutation.mutate();
    }
  };

  const onNewLocation = (e) => {
    setShowNewLocationDialog(true);
  };

  const onChangeNewLocationForm = (e) => {
    setNewLocationForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const checkDisabledDeleteLocation = () => {
    // Determine locations <select> disabled status
    if (locationsRef && locationsRef.current) {
      const length =
        locationsRef && locationsRef.current && locationsRef.current.length;
      length <= 0
        ? setDeleteLocationsDisabled(true)
        : setDeleteLocationsDisabled(false);
    }
  };

  const onDeleteLocation = (e) => {
    // Determine index of matching address in <select>
    const idx = form.locations.findIndex(
      (pred) => pred.address.toLowerCase() === selectedLocation?.toLowerCase()
    );

    // Filter out the matching address ("delete"), and update `form.locations`
    let tempLocs = form.locations.filter((loc, _idx) => _idx != idx);
    setForm((prevState) => ({
      ...prevState,
      locations: tempLocs,
    }));

    // Deselect all <select> options (otherwise error when deleting last element)
    setSelectedLocation(null);
    if (locationsRef.current) {
      locationsRef.current.selectedIndex = -1;

      // Determine delete button disabledness
      checkDisabledDeleteLocation();
    }
  };

  const onChangeLocationSelected = (e) => {
    setSelectedLocation(e.target.value);
  };
  // #endregion

  // #region RENDER CONTENT
  const Requirement = () => {
    return <span className="font-bold text-red-600 mx-1">*</span>;
  };

  const newContactForm = () => {
    return (
      <form>
        <div className="font-bold mb-3">
          Fields marked <Requirement /> are required
        </div>
        <table className={styles.newContactForm}>
          <tbody className={styles.tbody}>
            {/* First Name */}
            <tr className={styles.row}>
              <td className={styles.data}>
                First Name:
                <Requirement />{" "}
              </td>
              <td className={styles.data}>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={onChangeNewContactForm}
                  required
                  autoFocus
                />
              </td>
            </tr>

            {/* Last Name */}
            <tr className={styles.row}>
              <td className={styles.data}>
                Last Name:
                <Requirement />{" "}
              </td>
              <td className={styles.data}>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={onChangeNewContactForm}
                  required
                />
              </td>
            </tr>

            {/* Phone */}
            <tr className={styles.row}>
              <td className={styles.data}>
                Phone(s)
                <Requirement />:{" "}
              </td>
              <td className={styles.data}>
                <textarea
                  name="phone"
                  value={form.phone}
                  onChange={onChangeNewContactForm}
                  rows={2}
                  required
                ></textarea>
              </td>
            </tr>

            {/* Company */}
            <tr className={styles.row}>
              <td className={styles.data}>Company:</td>
              <td className={styles.data}>
                <textarea
                  name="company"
                  value={form.company}
                  onChange={onChangeNewContactForm}
                  rows={2}
                ></textarea>
              </td>
            </tr>

            {/* Email */}
            <tr className={styles.row}>
              <td className={styles.data}>Email(s):</td>
              <td className={styles.data}>
                <textarea
                  name="email"
                  value={form.email}
                  onChange={onChangeNewContactForm}
                  rows={2}
                ></textarea>
              </td>
            </tr>

            {/* Locations */}
            <tr className={styles.row}>
              <td className={styles.data}>Location(s): </td>
              <td className={styles.data}>
                <select
                  className={styles.data}
                  size={5}
                  ref={locationsRef}
                  value={selectedLocation}
                  onChange={onChangeLocationSelected}
                >
                  {form?.locations.map((loc, idx) => (
                    <option
                      key={idx}
                      value={`${loc.address}`}
                      style={{
                        whiteSpace: "pre",
                        fontSize: "13px",
                      }}
                    >
                      {loc.address}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  type="button"
                  className="bg-green-700 hover:bg-gray-700 text-white px-2 rounded-md ml-3"
                  onClick={onNewLocation}
                >
                  +
                </button>
                <button
                  type="button"
                  disabled={deleteLocationsDisabled}
                  className="bg-red-600 hover:bg-red-800 text-white px-2 rounded-md ml-3 disabled:bg-gray-500"
                  onClick={onDeleteLocation}
                >
                  x
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  };

  const newLocationDialogContent = () => {
    return (
      <div>
        <form>
          <table className={styles.locationDialogContent}>
            <tbody>
              <tr>
                <td>
                  Address
                  <Requirement />:{" "}
                </td>
                <td>
                  <textarea
                    name="address"
                    value={newLocationForm.address}
                    onChange={onChangeNewLocationForm}
                    required
                    rows={2}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td>Coordinates: </td>
                <td>
                  <input
                    type="text"
                    name="coordinates"
                    value={newLocationForm.coordinates}
                    onChange={onChangeNewLocationForm}
                  />
                </td>
              </tr>
              <tr>
                <td>Directions: </td>
                <td>
                  <textarea
                    name="directions"
                    value={newLocationForm.directions}
                    onChange={onChangeNewLocationForm}
                    rows={5}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  };
  // #endregion

  // #region USE-EFFECTS
  useEffect(() => {
    if (!formErrors) return;
  }, [formErrors]);

  useEffect(() => {
    if (selectedLocation) {
      console.log("Selected location changed: " + selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (form.locations) {
      console.log("`form` locations changed: ");
      console.log(form);

      // Determine locations <select> disabled status
      checkDisabledDeleteLocation();
    }
  }, [form.locations]);

  useEffect(() => {
    if (showNewLocationDialog) {
      console.log("Show new location dialog...");
    }
  }, [showNewLocationDialog]);

  useEffect(() => {
    if (newLocationForm) {
      console.log("NewLocationForm changed: ");
      console.log(newLocationForm);
    }
  }, [newLocationForm]);
  // #endregion

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-3">Contacts</h1>
      <div>A list of contacts including name, phone, and addresses.</div>

      <Dialog
        title="New Contact"
        content={newContactForm()}
        show={showNewContactDialog}
        loading={loading}
        callbacks={{
          save: () => {
            onSubmitNewContact();
          },
          cancel: () => {
            // TODO Empty form
            setForm(emptyForm);
            setShowNewContactDialog(false);
          },
        }}
      />

      <Dialog
        title="New Location"
        content={newLocationDialogContent()}
        show={showNewLocationDialog}
        loading={loading}
        callbacks={{
          save: () => {
            // Return if address already exists
            let checkLoc = form.locations.find(
              (tmp) =>
                tmp.address.toLowerCase() ===
                newLocationForm.address.toLowerCase()
            );

            if (checkLoc)
              return alert("You already have a location with this address");

            // Assemble location data and add to `form.locations`
            const loc = {
              address: newLocationForm.address || "",
              coordinates: newLocationForm.coordinates || "",
              directions: newLocationForm.directions || "",
            };
            setForm((prevState) => ({
              ...prevState,
              locations: [...prevState.locations, loc],
            }));

            // Clear the form and hide the dialog
            setNewLocationForm(emptyLocationForm);
            setShowNewLocationDialog(false);
          },
          cancel: () => {
            // Clear new location dialog form and close it
            setNewLocationForm(emptyLocationForm);
            setShowNewLocationDialog(false);
          },
        }}
      />
    </div>
  );
}
