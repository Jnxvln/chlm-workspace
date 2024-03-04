"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const pathname = usePathname();

  const urls = [
    {
      id: "home",
      href: "/",
      label: "Home",
    },
    {
      id: "drivers",
      href: "/drivers",
      label: "Drivers",
    },
    {
      id: "deliveries",
      href: "/deliveries",
      label: "Deliveries",
    },
    {
      id: "hauls",
      href: "/hauls",
      label: "Hauls",
    },
    {
      id: "vendors",
      href: "/vendors",
      label: "Vendors",
    },
    {
      id: "materials",
      href: "/materials",
      label: "Materials",
    },
    {
      id: "contacts",
      href: "/contacts",
      label: "Contacts",
    },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>C&amp;H</div>
      {urls.map((url) => (
        <Link
          key={url.id}
          href={url.href}
          className={`${styles.link} ${
            pathname === url.href ? styles.active : null
          }`}
        >
          <div className={styles.linkContent}>{url.label}</div>
        </Link>
      ))}
    </nav>
  );
}
