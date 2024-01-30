import styles from "./ErrorMessage.module.scss";

export default function ErrorMessage({
  name,
  message,
}: {
  name?: string;
  message?: string;
}) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <strong>{name}</strong>
      </header>
      <div className={styles.message}>{message}</div>
    </div>
  );
}
