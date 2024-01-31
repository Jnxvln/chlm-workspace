"use client";
import { useState, useEffect, ReactElement } from "react";
import styles from "./Dialog.module.scss";

type TDialog = {
  title?: String;
  content?: String | ReactElement<any, any> | JSX.Element | undefined | null;
  footer?: "ok" | "cancel" | "yes-no" | "yes-no-ok" | "yes-no-cancel";
  callbacks?: [Function] | undefined | null;
  show?: Boolean;
};

export default function Dialog({
  title,
  content,
  footer,
  show,
  callbacks,
}: TDialog) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [show]);

  const renderFooter = () => {
    switch (footer) {
      case "ok":
        return (
          <div>
            <button
              type="button"
              className={`${styles.button} ${styles.btn_ok}`}
              onClick={(e) => {
                setVisible(false);
                if (callbacks && callbacks.length > 0) {
                  callbacks[0]();
                }
              }}
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
              onClick={() => setVisible(false)}
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
              onClick={(e) => {
                setVisible(false);
                if (callbacks && callbacks.length > 0) {
                  callbacks[0]();
                }
              }}
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
