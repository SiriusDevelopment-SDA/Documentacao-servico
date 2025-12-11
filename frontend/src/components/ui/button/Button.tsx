"use client";
import { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
