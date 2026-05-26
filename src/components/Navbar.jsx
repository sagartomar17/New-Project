import React from 'react'
import { Button } from 'primereact/button'
import styles from './Navbar.module.css'

/**
 * Top navigation bar — logo, home shortcut, and user menu.
 */
const Navbar = () => (
  <header className={styles.navbar}>
    {/* ── Left: logo + home ── */}
    <div className={styles.left}>
      <div className={styles.logo}>Takeda</div>
      <Button
        icon="pi pi-home"
        className={`p-button-text p-button-plain ${styles.homeBtn}`}
        aria-label="Home"
      />
    </div>

    {/* ── Right: user avatar ── */}
    <div className={styles.right}>
      <div className={styles.userArea}>
        <div className={styles.avatar}>
          <i className="pi pi-user" style={{ color: '#fff', fontSize: '14px' }} />
        </div>
        <i className="pi pi-chevron-down" style={{ color: '#4A5568', fontSize: '11px', marginLeft: '6px' }} />
      </div>
    </div>
  </header>
)

export default Navbar
