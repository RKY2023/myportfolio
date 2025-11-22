"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Flex, Column, Text, Button } from "@/once-ui/components";
import styles from "./layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname() || "";

  const navigationItems = [
    { href: "/my", label: "Home", exact: true },
    { href: "/my/calendar", label: "Calendar" },
    { href: "/my/diary", label: "Diary" },
  ];

  return (
    <Column fillHeight gap="0">
      {/* Navigation Header */}
      <Flex
        as="nav"
        fillWidth
        padding="16"
        background="surface"
        borderBottom="neutral-weak"
        gap="24"
        align="center"
      >
        <Text variant="heading-strong-m">
          My Secret Space
        </Text>
        <Flex gap="8" align="center">
          {navigationItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== "/my";

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "primary" : "secondary"}
                  size="s"
                  className={styles.navButton}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </Flex>
      </Flex>

      {/* Breadcrumb */}
      {pathname !== "/my" && (
        <Flex
          fillWidth
          paddingY="12"
          paddingX="16"
          background="neutral-weak"
          gap="8"
        >
          <Link href="/my">
            <Text variant="body-default-m" className={styles.breadcrumb}>
              Home
            </Text>
          </Link>
          <Text variant="body-default-m">/</Text>
          <Text variant="body-strong-m">
            {pathname === "/my/calendar" ? "Calendar" : "Diary"}
          </Text>
        </Flex>
      )}

      {/* Main Content */}
      <Flex fillWidth fillHeight padding="24" overflow="auto">
        {children}
      </Flex>
    </Column>
  );
};

export default Layout;
