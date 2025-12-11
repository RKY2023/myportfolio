"use client";

import Link from "next/link";
import { Flex, Column, Heading, Text, Card } from "@/once-ui/components";
import styles from "./page.module.scss";

export default function MyHome() {
  return (
    <Column fillWidth gap="24">
      <Column gap="8">
        <Heading variant="heading-strong-l">My Private Space</Heading>
        <Text variant="body-default-m" color="secondary">
          Personal calendar, diary, and location tracking.
        </Text>
      </Column>

      {/* Navigation Cards */}
      <div className={styles.cardGrid}>
        <Link href="/my/calendar" className={styles.cardLink}>
          <Card padding="24" gap="12" className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <Heading variant="heading-strong-m">Calendar</Heading>
            <Text variant="body-default-m" color="secondary">
              Timeline events and milestones
            </Text>
          </Card>
        </Link>

        <Link href="/my/diary" className={styles.cardLink}>
          <Card padding="24" gap="12" className={styles.card}>
            <div className={styles.cardIcon}>📔</div>
            <Heading variant="heading-strong-m">Diary</Heading>
            <Text variant="body-default-m" color="secondary">
              Personal journal and reflections
            </Text>
          </Card>
        </Link>

        <Link href="/my/location" className={styles.cardLink}>
          <Card padding="24" gap="12" className={styles.card}>
            <div className={styles.cardIcon}>📍</div>
            <Heading variant="heading-strong-m">Location</Heading>
            <Text variant="body-default-m" color="secondary">
              Live tracking and destinations
            </Text>
          </Card>
        </Link>
      </div>
    </Column>
  );
}
