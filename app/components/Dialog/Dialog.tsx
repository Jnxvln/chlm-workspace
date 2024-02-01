"use client";
import { useState, useEffect, ReactElement } from "react";
import styles from "./Dialog.module.scss";

export type TDialog = {
  title?: String;
  content?: String | ReactElement<any, any> | JSX.Element | undefined | null;
  footer?:
    | "ok"
    | "cancel"
    | "yes-no"
    | "yes-no-ok"
    | "yes-no-cancel"
    | "save"
    | "save-cancel"
    | "default";
  callbacks: {
    ok?: Function | undefined | null;
    cancel?: Function | undefined | null;
    yes?: Function | undefined | null;
    no?: Function | undefined | null;
    save?: Function | undefined | null;
    default?: Function | undefined | null;
  };
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

  const btn_ok = () => (
    <button
      type="button"
      className={`${styles.button} ${styles.btn_ok}`}
      onClick={(e) => {
        setVisible(false);
        if (footer && footer === "ok" && callbacks && callbacks.ok) {
          callbacks.ok();
        }
      }}
    >
      Ok
    </button>
  );

  const btn_cancel = () => (
    <button
      type="button"
      className={`${styles.button} ${styles.btn_cancel}`}
      onClick={(e) => {
        setVisible(false);
        if (footer && footer === "cancel" && callbacks && callbacks.cancel) {
          callbacks.cancel();
        }
      }}
    >
      Cancel
    </button>
  );

  const btn_saveCancel = () => (
    <div className="flex gap-5">
      <button
        type="button"
        className={`${styles.button} ${styles.btn_cancel}`}
        onClick={(e) => {
          if (callbacks && callbacks.cancel) {
            callbacks.cancel();
          }
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.btn_save}`}
        onClick={(e) => {
          if (callbacks && callbacks.save) {
            callbacks.save();
          }
        }}
      >
        Save
      </button>
    </div>
  );

  const btn_unknown = () => (
    <button
      type="button"
      className={`${styles.button} ${styles.btn_default}`}
      onClick={(e) => {
        setVisible(false);
        if (callbacks && callbacks.default) {
          callbacks.default();
        }
      }}
    >
      Default Action
    </button>
  );

  const btn_save = () => (
    <button type="button" className={`${styles.button} ${styles.btn_save}`}>
      Save
    </button>
  );

  const renderFooter = () => {
    switch (footer) {
      case "ok":
        return <div>{btn_ok()}</div>;
      case "cancel":
        return <div>{btn_cancel()}</div>;
      case "save-cancel":
        return <div>{btn_saveCancel()}</div>;
      default:
        return <div>{btn_unknown()}</div>;
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
