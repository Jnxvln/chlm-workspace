"use client";
import dayjs, { Dayjs } from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDrivers } from "@/app/controllers/DriverController";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { TDriver } from "@/app/Types";
import CalendarReveal from "@/app/components/CalendarReveal/CalendarReveal";
import Loading from "@/app/components/Loading/Loading";
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

  const PerLabel = ({ label }: { label: string }) => {
    return <span className={styles.perLabel}>/{label}</span>;
  };

  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (isLoading) return <Loading />;

  return (
    <div className={styles.wrapper}>
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
                  <button type="button" className={styles.editBtn}>
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
