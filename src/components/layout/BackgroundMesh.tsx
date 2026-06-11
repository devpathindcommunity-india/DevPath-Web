'use client';

import styles from './BackgroundMesh.module.css';

export default function BackgroundMesh() {
  return (
    <div className={styles.meshContainer}>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={styles.grid} />
    </div>
  );
}
