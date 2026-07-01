"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Flex, Column, Text, Icon, LetterFx } from "@/once-ui/components";
import styles from "./layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { href: "/my", label: "Home", icon: "home", exact: true },
  { href: "/my/calendar", label: "Calendar", icon: "calendar" },
  { href: "/my/diary", label: "Diary", icon: "book" },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname() || "";

  return (
    <Column fillHeight gap="0">
      {/* Navigation Header */}
      <Flex
        as="nav"
        fillWidth
        padding="16"
        horizontal="space-between"
        vertical="center"
        className={styles.glassNav}
      >
        <Text variant="heading-strong-m" className={styles.navTitle}>
          <LetterFx trigger="hover" speed="fast">My Secret Space</LetterFx>
        </Text>
        <Flex gap="4" className={styles.navPill}>
          {navigationItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                <Flex
                  gap="8"
                  vertical="center"
                  paddingX="16"
                  paddingY="8"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                >
                  <Icon name={item.icon} size="s" />
                  <Text variant="label-strong-s">{item.label}</Text>
                </Flex>
              </Link>
            );
          })}
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex fillWidth fillHeight padding="24" overflow="auto">
        {children}
      </Flex>
    </Column>
  );
};

export default Layout;
