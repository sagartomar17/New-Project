import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import styles from "./Navbar.module.css";

/**
 * Top navigation bar — logo and user menu.
 * Clicking the user avatar opens an OverlayPanel with:
 *   • Sign in with Google
 *   • Log out
 */
const Navbar = () => {
  const op    = useRef(null);
  const toast = useRef(null);

  const handleGoogleSignIn = () => {
    op.current?.hide();
    toast.current?.show({
      severity: "success",
      summary:  "Success",
      detail:   "Thank you for Sign In",
      life:     3000,
    });
  };

  const handleLogout = () => {
    op.current?.hide();
    toast.current?.show({
      severity: "info",
      summary:  "Logged Out",
      detail:   "You have been logged out",
      life:     3000,
    });
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />

      <header className={styles.navbar}>

        {/* ── Left: logo ── */}
        <div className={styles.left}>
          <div className={styles.logo}>
            <img src="freyrlogo.png" alt="Freyr" />
          </div>
        </div>

        {/* ── Right: user avatar + chevron ── */}
        <div className={styles.right}>
          <div className={styles.userTrigger} onClick={(e) => op.current?.toggle(e)}>
            <div className={styles.avatar}>
              <i className="pi pi-user" style={{ fontSize: "16px" }} />
            </div>
            <i className="pi pi-chevron-down" style={{ fontSize: "11px", color: "#4A5568" }} />
          </div>

          {/* Dropdown via PrimeReact OverlayPanel */}
          <OverlayPanel ref={op} style={{ width: "220px" }}>

            {/* User info */}
            <div className={styles.overlayHeader}>
              <div className={styles.avatar} style={{ width: "42px", height: "42px" }}>
                <i className="pi pi-user" style={{ fontSize: "18px" }} />
              </div>
              <span className={styles.overlayName}>Sagar Tomar</span>
            </div>

            <Divider style={{ margin: "4px 0" }} />

            <div className={styles.overlayMenu}>

              {/* Sign in with Google */}
              <button className={styles.menuItem} onClick={handleGoogleSignIn}>
                <span className={styles.googleIconWrap}>
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </span>
                Sign in with Google
              </button>

              {/* Log out */}
              <button
                className={`${styles.menuItem} ${styles.menuItemLogout}`}
                onClick={handleLogout}
              >
                <i className="pi pi-sign-out" />
                Log out
              </button>

            </div>
          </OverlayPanel>
        </div>

      </header>
    </>
  );
};

export default Navbar;
