"use client";

import React from "react";

type SkeletonVariant = "text" | "rect" | "circle";

export default function Skeleton({
  variant = "rect",
  width,
  height,
  radius = 8,
  className = "",
  style,
}: {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const baseStyle: React.CSSProperties = {
    width,
    height,
    borderRadius:
      variant === "circle" ? "9999px" : typeof radius === "number" ? radius : radius,
    ...style,
  };

  return (
    <div
      aria-hidden
      className={`skeleton skeleton--${variant} ${className}`}
      style={baseStyle}
    />
  );
}

