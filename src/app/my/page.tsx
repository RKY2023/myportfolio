"use client";

import Link from "next/link";
import { Flex, Column, Heading, Text, Card, Button } from "@/once-ui/components";
import styles from "./page.module.scss";

export default function MyHome() {
  return (
    <Column fillWidth gap="32" align="center">
      <Flex fillWidth direction="column" gap="16" align="center">
        <Heading variant="display-strong-s" align="center">
          Welcome to Your Private Space
        </Heading>
        <Text variant="body-default-m" align="center">
          Access your personal calendar and diary entries in this secure, password-protected area.
        </Text>
      </Flex>

      {/* Navigation Cards */}
      <Flex gap="24" wrap className={styles.cardGrid}>
        {/* Calendar Card */}
        <Link href="/my/calendar" className={styles.cardLink}>
          <Card padding="32" gap="16" className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <Heading variant="heading-strong-m">Calendar</Heading>
            <Text variant="body-default-m">
              View your timeline events and milestones. Track your projects, travels, and life events.
            </Text>
            <Button variant="primary" className={styles.cardButton}>
              Open Calendar →
            </Button>
          </Card>
        </Link>

        {/* Diary Card */}
        <Link href="/my/diary" className={styles.cardLink}>
          <Card padding="32" gap="16" className={styles.card}>
            <div className={styles.cardIcon}>📔</div>
            <Heading variant="heading-strong-m">Diary</Heading>
            <Text variant="body-default-m">
              Read your personal journal entries. Explore your thoughts, moods, and daily reflections.
            </Text>
            <Button variant="primary" className={styles.cardButton}>
              Open Diary →
            </Button>
          </Card>
        </Link>
      </Flex>
    </Column>
  );
}
