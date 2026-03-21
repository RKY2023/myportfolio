import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import remarkGfm from "remark-gfm";

import { SmartImage, SmartLink, Text } from "@/once-ui/components";
import { CodeBlock } from "@/once-ui/modules";
import { HeadingLink } from "@/components";

import { TextProps } from "@/once-ui/interfaces";
import { SmartImageProps } from "@/once-ui/components/SmartImage";

type TableProps = {
  data: {
    headers: string[];
    rows: string[][];
  };
};

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>);
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
  if (!src) {
    console.error("SmartImage requires a valid 'src' property.");
    return null;
  }

  return (
    <SmartImage
      className="my-20"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const CustomHeading = ({ children, ...props }: TextProps) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink
        style={{ marginTop: "var(--static-space-24)", marginBottom: "var(--static-space-12)" }}
        level={level}
        id={slug}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `Heading${level}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function MDXTable({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: "auto", marginTop: "var(--static-space-16)", marginBottom: "var(--static-space-16)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-body-s)" }}>
        {children}
      </table>
    </div>
  );
}

function MDXTh({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        padding: "var(--static-space-8) var(--static-space-12)",
        textAlign: "left",
        fontWeight: "var(--font-weight-strong)",
        borderBottom: "1px solid var(--neutral-border-medium)",
        whiteSpace: "nowrap",
        color: "var(--neutral-on-background-strong)",
      }}
    >
      {children}
    </th>
  );
}

function MDXTd({ children }: { children: ReactNode }) {
  return (
    <td
      style={{
        padding: "var(--static-space-8) var(--static-space-12)",
        borderBottom: "1px solid var(--neutral-border-weak)",
        color: "var(--neutral-on-background-medium)",
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

const components = {
  p: createParagraph as any,
  h1: createHeading(1) as any,
  h2: createHeading(2) as any,
  h3: createHeading(3) as any,
  h4: createHeading(4) as any,
  h5: createHeading(5) as any,
  h6: createHeading(6) as any,
  img: createImage as any,
  a: CustomLink as any,
  table: MDXTable as any,
  th: MDXTh as any,
  td: MDXTd as any,
  Table,
  CodeBlock,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    // @ts-ignore: Suppressing type error for MDXRemote usage
    <MDXRemote
      {...props}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
