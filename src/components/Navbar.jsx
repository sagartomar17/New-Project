import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import styles from "./Navbar.module.css";

/**
 * Top navigation bar — logo, home shortcut, and user menu.
 * Clicking the user avatar opens a dropdown with:
 *   • Sign in with Google
 *   • Log out
 */
const Navbar = () => {
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Toast ref
  const toast = useRef(null);

  /* ── close dropdown when clicking outside ── */
  useEffect(() => {
    if (!dropOpen) return;

    const handleOutsideClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropOpen]);

  const handleGoogleSignIn = () => {
    setDropOpen(false);

    // Popup message
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Thank you for Sign In",
      life: 3000,
    });
  };

  const handleLogout = () => {
    setDropOpen(false);

    // Popup message
    toast.current.show({
      severity: "info",
      summary: "Logged Out",
      detail: "You have been logged out",
      life: 3000,
    });
  };

  return (
    <>
      {/* Toast */}
      <Toast ref={toast} position="top-right" />

      <header className={styles.navbar}>
        {/* ── Left: logo + home ── */}
        <div className={styles.left}>
          <div className={styles.logo}>
            <img src="freyrlogo.png" alt="freyr logo" />
          </div>

          <Button
            icon="pi pi-home"
            className={`p-button-text p-button-plain ${styles.homeBtn}`}
            aria-label="Home"
          />
        </div>

        {/* ── Right: user avatar + dropdown ── */}
        <div className={styles.right}>
          <div ref={dropRef} className={styles.userWrapper}>
            {/* trigger */}
            <div
              className={`${styles.userArea} ${
                dropOpen ? styles.userAreaActive : ""
              }`}
              onClick={() => setDropOpen((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={dropOpen}
              onKeyDown={(e) =>
                e.key === "Enter" && setDropOpen((prev) => !prev)
              }
            >
              <div className={styles.avatar}>
                <span className={styles.initials}>S T</span>
              </div>

              <i
                className={`pi pi-chevron-down ${styles.chevron} ${
                  dropOpen ? styles.chevronUp : ""
                }`}
              />
            </div>

            {/* dropdown menu */}
            {dropOpen && (
              <div className={styles.dropdownMenu} role="menu">
                {/* Sign in with Google */}
                <button
                  className={styles.dropdownItem}
                  onClick={handleGoogleSignIn}
                  role="menuitem"
                >
                  <span className={styles.itemIconGoogle}>
                    {/* Google colour "G" icon */}
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </span>
                  Sign in with Google
                </button>

                <div className={styles.divider} />

                {/* Log out */}
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <i className="pi pi-sign-out" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
