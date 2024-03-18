"use client"
import { TContact } from "@/app/Types";
import CalendarReveal from "@/app/components/CalendarReveal/CalendarReveal";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllContacts } from "@/app/controllers/ContactController";
import styles from './ContactsTable.module.scss'

export default function ContactsTable () {
	const queryClient = useQueryClient();

	// #region VARIABLES
	const {
		data: contacts,
        isLoading,
        error,
	} = useQuery({
		queryKey: ['contacts'],
		queryFn: getAllContacts
	})
	// #endregion

	// #region EVENTS
	const onEdit = (driverArg: TContact) => {
		// setSelectedDriver(driverArg);
		// setShowEditDialog(true);
	};
	
	  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setForm((prevState) => ({
		  ...prevState,
		  [e.target.name]: e.target.value,
		}));
	  };
	// #endregion

	return (
		<div>
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
					{contacts?.map((contact: TContact) => (
						<tr key={contact.id.toString()}>
						<td>{contact.id.toString()}</td>
						<td>{contact.firstName ? contact.firstName : null}</td>
						<td>{contact.lastName ? contact.lastName : null}</td>
						<td>{contact.phone ? contact.phone : null}</td>
						<td>{contact.email ? contact.email : null}</td>
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

						<td>
							<div className="flex gap-2">
							<button
								type="button"
								className={styles.editBtn}
								onClick={(e) => onEdit(contact)}
							>
								E
							</button>
							<button
								type="button"
								className={styles.deleteBtn}
								// onClick={() => onDelete(contact.id)}
								onClick={(e) => onDelete(contact)}
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
	)
}