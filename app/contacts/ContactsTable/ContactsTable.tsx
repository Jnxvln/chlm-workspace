"use client";
import styles from "./ContactsTable.module.scss";
import toast from "react-hot-toast";
// import dayjs from "dayjs";
import Dialog from "@/app/components/Dialog/Dialog";
import { TContact } from "@/app/Types";
import Loading from "@/app/components/Loading/Loading";
import SuccessEmoji from "@/app/components/Emojicons/SuccessEmoji";
import ErrorEmoji from "@/app/components/Emojicons/ErrorEmoji";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CalendarReveal from "@/app/components/CalendarReveal/CalendarReveal";
import {
  getAllContacts,
  createContact,
  deleteContactById,
} from "@/app/controllers/ContactController";
import Requirement from "@/app/components/Requirement/Requirement";

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

export default function ContactsTable() {
  const queryClient = useQueryClient();

  // #region VARIABLES
  const {
    data: contacts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: getAllContacts,
  });

  const [showEditDialog, setShowEditDialog] = useState(false);

  const [selectedContact, setSelectedContact] = useState<
    TContact | undefined | null
  >();

  const locationsRef = useRef<HTMLSelectElement>(null);
  const [deleteLocationsDisabled, setDeleteLocationsDisabled] =
    useState<boolean>(true);
  const [showNewContactDialog, setShowNewContactDialog] = useState(false);
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
    locations: true,
  });
  const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);
  // #endregion

  // #region MUTATIONS
  // Create mutation
  const createContactMutation = useMutation({
    mutationKey: ["contacts"],
    mutationFn: () => createContact(form),
    onSuccess: (data) => {
      setLoading(false);
      toast("Contact created successfully", {
        icon: <SuccessEmoji />,
      });
      // Clear the forms and close all related dialogs
      setForm(emptyForm);
      setNewLocationForm(emptyLocationForm);
      setSelectedLocation("");
      setShowNewContactDialog(false);
      setShowNewLocationDialog(false);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (err) => {
      setLoading(false);
      console.log(err);
      toast("Failed to create contact", {
        icon: "❌",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationKey: ["contacts"],
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: (contactArg: TContact) =>
      deleteContactById(parseInt(`${contactArg.id}`)),
    onSuccess: (data) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      console.log(
        "[ContactsTable onSuccess()]: Contact deleted, set loading to false"
      );
      toast("Contact (and its locations) deleted successfully", {
        icon: <SuccessEmoji />,
      });
    },
    onError: (err) => {
      setLoading(false);
      console.log(err);
      toast("Failed to delete contact", {
        icon: <ErrorEmoji />,
      });
    },
  });
  // #endregion

  // #region EVENTS
  const onEditContact = (contactArg: TContact) => {
    setSelectedContact(contactArg);
    setShowEditDialog(true);
  };

  const onDeleteContact = (contactArg: TContact) => {
    console.log("onDeleteContact: ");
    console.log(contactArg);
    const conf = confirm(
      `Do you want to PERMANENTLY delete contact ${contactArg.firstName} ${contactArg.lastName} (ID: ${contactArg.id}) AND its delivery locations? This cannot be undone!`
    );

    if (conf) {
      deleteContactMutation.mutate(contactArg);
    }
  };

  const onNewContact = () => {
    setSelectedContact(null);
    setShowNewContactDialog(true);
  };

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
      locations: false,
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

    if (!form.locations || form.locations.length <= 0) {
      formErrors.locations = true;
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
      _formErrors.locations
    ) {
      toast("Missing required fields", {
        icon: <ErrorEmoji />,
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

  // #region RENDER (CONTENT)
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
                Phone(s):
                <Requirement />{" "}
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
              <td className={styles.data}>
                Location(s):
                <Requirement />{" "}
              </td>
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
            <tr style={{ padding: 0 }}>
              <td style={{ padding: 0 }}></td>
              <td style={{ padding: 0 }}>
                <small style={{ padding: 0, fontSize: "10pt" }}>
                  At least 1 location required
                </small>
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
    <div className={styles.wrapper}>
      <div className="mb-4">
        A list of contacts including name, phone, and addresses.
      </div>

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
            // Check required fields
            if (!newLocationForm.address || newLocationForm.address === "") {
              return toast("The address field is required", {
                icon: <ErrorEmoji />,
              });
            }

            // Return if address already exists
            let checkLoc = form.locations.find(
              (tmp) =>
                tmp.address.toLowerCase() ===
                newLocationForm.address.toLowerCase()
            );

            if (checkLoc)
              return toast("You already have a location with this address", {
                icon: <ErrorEmoji />,
              });

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

      <section>
        <div className="mb-4 flex gap-6 items-center">
          <div>
            <button
              type="button"
              className={styles.newContactButton}
              onClick={onNewContact}
            >
              New Contact
            </button>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>First</th>
                <th>Last</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Company</th>
                <th>Updated</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts?.map((contact: TContact) => (
                <tr key={contact.id.toString()}>
                  <td>{contact.id.toString()}</td>
                  <td>{contact.firstName ? contact.firstName : null}</td>
                  <td>{contact.lastName ? contact.lastName : null}</td>
                  <td>{contact.phone ? contact.phone : null}</td>
                  <td>{contact.email ? contact.email : null}</td>
                  <td>{contact.company ? contact.company : null}</td>
                  <td>
                    {contact.updatedAt ? (
                      <CalendarReveal date={contact.updatedAt} />
                    ) : null}
                  </td>
                  <td>
                    {contact.createdAt ? (
                      <CalendarReveal date={contact.createdAt} />
                    ) : null}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={(e) => onEditContact(contact)}
                      >
                        E
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={(e) => onDeleteContact(contact)}
                      >
                        X
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
