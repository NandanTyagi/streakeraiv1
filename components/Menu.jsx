"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RegisterLink, LoginLink, LogoutLink } from "@/components/auth/AuthLinks";
import { usePathname } from "next/navigation";
import PanelSwitcher from "./v1/PanelSwitcher";
import { LogOut, LogIn, Target, ListChecks, LayoutDashboard, History, Info, Settings } from "lucide-react";
import styles from "./Menu.module.css";

const navigationItems = [
  { href: "/generategoals", label: "Identify", icon: Target },
  { href: "/panel", label: "Track", icon: ListChecks },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requiresUser: true },
  { href: "/history", label: "My History", icon: History, requiresUser: true },
  { href: "/about", label: "About", icon: Info, divider: true },
  { href: "/profile", label: "Profile & settings", icon: Settings, requiresUser: true },
];

export default function Menu({ user, setIsMenuOpen }) {
  const pathname = usePathname();
  return (
    <div className={styles.menu}>
      <div className={styles.inner}>
        <div className={styles.toolbar}>
          <h2 className={styles.heading}>Menu</h2>
          <div className={styles.account}>
            {user ? (
              <LogoutLink className={styles.accountLink}>
                <LogOut size={17} strokeWidth={1.75} aria-hidden="true" />Log out
              </LogoutLink>
            ) : (
              <>
                <LoginLink className={styles.accountLink}>
                  <LogIn size={17} strokeWidth={1.75} aria-hidden="true" />Log in
                </LoginLink>
                <RegisterLink className={styles.accountLink}>Sign up</RegisterLink>
              </>
            )}
          </div>
        </div>
        <nav aria-label="Main navigation">
          <ul className={styles.items}>
            {navigationItems.filter(item => !item.requiresUser || user).map(({ href, label, icon: Icon, divider }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href} className={divider ? styles.divider : undefined}>
                  <Link href={href} onClick={() => setIsMenuOpen()} aria-current={active ? "page" : undefined} className={styles.link}>
                    <Icon size={22} strokeWidth={1.75} className={styles.icon} aria-hidden="true" />
                    <span>{label}</span>
                    {active && <span className={styles.activeDot} aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={styles.bottom}>
          {user && (
            <section className={styles.panel} aria-labelledby="menu-panel-heading">
              <h3 id="menu-panel-heading" className={styles.panelHeading}>Switch panel</h3>
              <PanelSwitcher />
            </section>
          )}
          <div className={styles.credit}>
            <a href="https://www.devnty.com" aria-label="DEVNTY Websolutions">
              <Image src="/devnty-logo-svg-mini.svg" alt="DEVNTY Websolutions" width={109} height={36} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
