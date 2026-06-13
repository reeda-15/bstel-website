"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { contact, navLinks } from "@/lib/site-data";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="topbar">
        <span>IP-1 Licensed Telecom Infrastructure Provider</span>
        <div>
          <a href={contact.phoneHref}>{contact.phone}</a>
          <a href={contact.emailHref}>{contact.email}</a>
        </div>
      </div>
      <div className="navbar">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <Image src="/assets/logo-0.png" alt="BSTEL" width={44} height={42} priority />
          <span>
            <strong>BSTEL</strong>
            <small>DIGITAL SOLUTIONS PVT. LTD.</small>
          </span>
        </Link>
        <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>
        <nav className={open ? "navlinks open" : "navlinks"}>
          {navLinks.map((item) => (
            <Link
              key={item.href}
              className={pathname === item.href ? "active" : ""}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="nav-cta" href="/contact" onClick={() => setOpen(false)}>
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
