"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import styles from "./KpiCard.module.scss";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function KpiCard({ title, value, subtitle }: Props) {
  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography className={styles.title} variant="subtitle2">
          {title}
        </Typography>

        <Typography className={styles.value} variant="h4">
          {value}
        </Typography>

        {subtitle && (
          <Typography className={styles.subtitle} variant="caption">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
