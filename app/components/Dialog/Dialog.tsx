"use client";
import { useState, useEffect } from "react";
import styles from "./Dialog.module.scss";

type TDialog = {
  title?: String;
  content?: String;
  footer?: "ok" | "cancel" | "yes-no" | "yes-no-ok" | "yes-no-cancel";
  callbacks?: [Function] | undefined | null;
};

export default function Dialog({ title, content, footer }: TDialog) {
  const [visible, setVisible] = useState(true);

  const renderFooter = () => {
    switch (footer) {
      case "ok":
        return (
          <div>
            <button
              type="button"
              className={`${styles.button} ${styles.btn_ok}`}
              onClick={() => setVisible(false)}
            >
              Ok
            </button>
          </div>
        );
      case "cancel":
        return (
          <div>
            <button
              type="button"
              className={`${styles.button} ${styles.btn_cancel}`}
            >
              Cancel
            </button>
          </div>
        );
      default:
        return (
          <div>
            <button
              type="button"
              className={`${styles.button} ${styles.btn_default}`}
            >
              Uh oh!
            </button>
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.frame} ${
        visible ? styles.visible : styles.invisible
      }`}
    >
      <div className={styles.wrapper}>
        <header className={styles.header}>{title ? title : "Dialog"}</header>
        <section className={styles.content}>{content}</section>
        <footer className={styles.footer}>{renderFooter()}</footer>
      </div>
    </div>
  );
}
