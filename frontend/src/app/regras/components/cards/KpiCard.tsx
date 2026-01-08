"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";
import styles from "./KpiCard.module.scss";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
}

export default function KpiCard({ title, value, subtitle, icon }: KpiCardProps) {
  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.header}>
          <span className={styles.title}>{title}</span>
          {icon && <span className={styles.icon}>{icon}</span>}
        </Box>

        <Typography className={styles.value} variant="h5">
          {value}
        </Typography>

        {subtitle && (
          <Typography className={styles.subtitle} variant="body2">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}