"use client";
import { useState, useEffect, ReactElement } from "react";
import styles from "./Dialog.module.scss";

export type TDialog = {
  title?: String;
  content?: String | ReactElement<any, any> | JSX.Element | undefined | null;
  callbacks: {
    ok?: Function | undefined | null;
    cancel?: Function | undefined | null;
    yes?: Function | undefined | null;
    no?: Function | undefined | null;
    save?: Function | undefined | null;
    default?: Function | undefined | null;
  };
  show?: Boolean;
  loading: Boolean;
};

export default function Dialog({
  title,
  content,
  show,
  loading,
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
      disabled={loading}
      onClick={(e) => {
        setVisible(false);
        if (callbacks && callbacks.ok) {
          callbacks.ok();
        }
      }}
    >
      {loading ? "⏳" : "Ok"}
    </button>
  );

  const btn_cancel = () => (
    <button
      type="button"
      className={`${styles.button} ${styles.btn_cancel}`}
      onClick={(e) => {
        setVisible(false);
        if (callbacks && callbacks.cancel) {
          callbacks.cancel();
        }
      }}
    >
      Cancel
    </button>
  );

  const btn_yes = () => (
    <button
      type="button"
      className={`${styles.button} ${styles.btn_yes}`}
      disabled={loading}
      onClick={(e) => {
        if (callbacks && callbacks.yes) {
          callbacks.yes();
        }
      }}
    >
      {loading ? "⏳" : "Yes"}
    </button>
  );

  const btn_no = () => (
    <button
      type="button"
      className={`${styles.button} ${styles.btn_no}`}
      disabled={loading}
      onClick={(e) => {
        if (callbacks && callbacks.no) {
          callbacks.no();
        }
      }}
    >
      {loading ? "⏳" : "No"}
    </button>
  );

  const btn_save = () => (
    <button
      type="button"
      className={`${styles.button} ${styles.btn_save}`}
      disabled={loading}
      onClick={(e) => {
        if (callbacks && callbacks.save) {
          callbacks.save();
        }
      }}
    >
      {loading ? "⏳" : "Save"}
    </button>
  );

  const renderFooter = () => {
    if (callbacks) {
      return (
        <div className="flex gap-4">
          {callbacks?.cancel ? btn_cancel() : null}
          {callbacks?.no ? btn_no() : null}
          {callbacks?.ok ? btn_ok() : null}
          {callbacks?.yes ? btn_yes() : null}
          {callbacks?.save ? btn_save() : null}
        </div>
      );
    } else {
      return <></>;
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
