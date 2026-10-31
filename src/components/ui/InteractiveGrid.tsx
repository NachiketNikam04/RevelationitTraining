"use client";

import React, { MouseEvent, useState } from "react";

interface InteractiveGridProps {
  className?: string;
  text?: string;
}

export function InteractiveGrid({
  className = "",
  text = "RiT",
}: InteractiveGridProps) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setMousePos({
      x: clientX - left,
      y: clientY - top,
    });
  };

  // Base state: subtle slate-400 (#94a3b8), uppercase bold RiT text with tracking
  const svgBase = encodeURIComponent(
    `<svg width="76" height="48" viewBox="0 0 76 48" xmlns="http://www.w3.org/2000/svg"><text x="38" y="25" text-anchor="middle" dominant-baseline="central" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" letter-spacing="0.18em" fill="#94a3b8" fill-opacity="0.32">${text}</text></svg>`
  );

  // Hover state: dark slate-900 (#0f172a), high-contrast illuminated RiT for the glow effect
  const svgHover = encodeURIComponent(
    `<svg width="76" height="48" viewBox="0 0 76 48" xmlns="http://www.w3.org/2000/svg"><text x="38" y="25" text-anchor="middle" dominant-baseline="central" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" letter-spacing="0.18em" fill="#0f172a" fill-opacity="0.9">${text}</text></svg>`
  );

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden w-full h-full pointer-events-auto select-none ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Base Grid: subtle RiT pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${svgBase}")`,
          backgroundSize: "76px 48px",
        }}
      />

      {/* Hover Reveal Grid: glowing illuminated RiT under cursor spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: `url("data:image/svg+xml,${svgHover}")`,
          backgroundSize: "76px 48px",
          maskImage: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

export default InteractiveGrid;
