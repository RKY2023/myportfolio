"use client";

import Link from "next/link";
import { Flex, Column, Heading, Text, Card } from "@/once-ui/components";
import styles from "./page.module.scss";

export default function MyHome() {
  return (
    <Column fillWidth gap="32" align="center">
      <Flex fillWidth direction="column" gap="16" align="center">
        <Heading variant="display-strong-s" align="center">
          Welcome to Your Private Space
        </Heading>
        <Text variant="body-default-m" align="center">
          Access your personal calendar, diary entries, and location tracking in this secure, password-protected area.
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

        {/* Location Card */}
        <Link href="/my/location" className={styles.cardLink}>
          <Card padding="32" gap="16" className={styles.card}>
            <div className={styles.cardIcon}>📍</div>
            <Heading variant="heading-strong-m">Location</Heading>
            <Text variant="body-default-m">
              Track your live location on the map. Set destinations and get proximity notifications.
            </Text>
            <Button variant="primary" className={styles.cardButton}>
              Open Location →
            </Button>
          </Card>
        </Link>
      </Flex>
    </Column>
  );
}
