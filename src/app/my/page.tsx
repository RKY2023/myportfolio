"use client";

import Link from "next/link";
import { Flex, Column, Heading, Text, Icon, RevealFx, TiltFx, Background } from "@/once-ui/components";
import styles from "./page.module.scss";

const cards = [
  {
    href: "/my/calendar",
    emoji: "📅",
    title: "Calendar",
    description: "View your timeline events and milestones. Track your projects, travels, and life events.",
    cta: "Open Calendar",
    glowClass: "glowBlue",
  },
  {
    href: "/my/diary",
    emoji: "📔",
    title: "Diary",
    description: "Read your personal journal entries. Explore your thoughts, moods, and daily reflections.",
    cta: "Open Diary",
    glowClass: "glowAmber",
  },
  {
    href: "/my/location",
    emoji: "📍",
    title: "Location",
    description: "Track your live location on the map. Set destinations and get proximity notifications.",
    cta: "Open Location",
    glowClass: "glowTeal",
  },
];

export default function MyHome() {
  return (
    <Column fillWidth gap="32" horizontal="center">
      <RevealFx speed="fast" delay={0} translateY="8">
        <Column gap="16" horizontal="center" maxWidth={640}>
          <Heading variant="display-strong-s" align="center" className={styles.heroHeading}>
            Welcome to Your Private Space
          </Heading>
          <Text variant="body-default-m" align="center" onBackground="neutral-weak">
            Access your personal calendar, diary entries, and location tracking in this secure,
            password-protected area.
          </Text>
        </Column>
      </RevealFx>

      {/* Navigation Cards */}
      <div className={styles.cardGrid}>
        {cards.map((card, i) => (
          <RevealFx key={card.href} speed="medium" delay={i * 0.15} translateY="8">
            <Link href={card.href} className={styles.cardLink}>
              <TiltFx fillWidth radius="l" className={styles.tiltWrapper}>
                <Flex direction="column" className={`${styles.card} ${styles[card.glowClass]}`} fillHeight>
                  {/* Icon zone */}
                  <Flex
                    horizontal="center"
                    vertical="center"
                    className={`${styles.iconZone} ${styles[`iconZone_${card.glowClass}`]}`}
                  >
                    <Background
                      position="absolute"
                      dots={{ display: true, opacity: 20, color: "neutral-on-background-weak", size: "16" }}
                    />
                    <span className={styles.iconEmoji}>{card.emoji}</span>
                  </Flex>
                  {/* Body */}
                  <Column gap="16" padding="24" fillWidth className={styles.cardBody}>
                    <Heading variant="heading-strong-m">{card.title}</Heading>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {card.description}
                    </Text>
                    <Flex gap="8" vertical="center" className={styles.cardCta}>
                      <Text variant="label-strong-s" className={styles.ctaText}>{card.cta}</Text>
                      <Icon name="arrowRight" size="s" className={styles.ctaIcon} />
                    </Flex>
                  </Column>
                </Flex>
              </TiltFx>
            </Link>
          </RevealFx>
        ))}
      </div>
    </Column>
  );
}
