"use client";
import styles from "./Contacts.module.scss";
import toast from "react-hot-toast";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect, ChangeEvent } from "react";
import Dialog from "../components/Dialog/Dialog";
import { createContact } from "../controllers/ContactController";

export default function Contacts() {
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
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
  });

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
                ></textarea>
              </td>
            </tr>

            {/* Email */}
            <tr className={styles.row}>
              <td className={styles.data}>
                Email(s):
                <Requirement />{" "}
              </td>
              <td className={styles.data}>
                <textarea
                  name="email"
                  value={form.email}
                  onChange={onChangeNewContactForm}
                  rows={2}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  };
  // #endregion

  // #region USE-EFFECTS
  useEffect(() => {
    if (!formErrors) return;
  }, [formErrors]);
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
    </div>
  );
}
