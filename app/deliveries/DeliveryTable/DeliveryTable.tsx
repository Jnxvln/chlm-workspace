import styles from "./DeliveryTable.module.scss";

export default function DeliveryTable() {
  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>ContactID</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Coords</th>
            <th>Product(s)</th>
            <th>Qty</th>
            <th>Completed</th>
            <th>Paid</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>3/1/24</td>
            <td>12345</td>
            <td>111-222-3333</td>
            <td>
              4321 Someplace Ave.
              <br />
              Texarkana, TX 75501
            </td>
            <td>33.123456, -93.654321</td>
            <td>Premium Compost</td>
            <td>6 yds</td>
            <td>True</td>
            <td>True</td>
            <td>3/1/24</td>
            <td>3/1/24</td>
            <td>
              <div className="flex gap-2">
                <button type="button" className={styles.editBtn}>
                  E
                </button>
                <button type="button" className={styles.deleteBtn}>
                  X
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
