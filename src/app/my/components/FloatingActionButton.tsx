"use client";

import { Button } from "@/once-ui/components";
import styles from "./FloatingActionButton.module.scss";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

export default function FloatingActionButton({
  onClick,
  label = "Add",
}: FloatingActionButtonProps) {
  return (
    <button
      className={styles.fab}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <span className={styles.icon}>+</span>
    </button>
  );
}
