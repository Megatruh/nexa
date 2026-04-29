/**
 * Card - Container kartu dengan style NEXA space-theme
 */

import React from "react";

export function Card({ children, className = "", hover = true, onClick }) {
  return (
    <div
      className={`
        nexa-card p-5
        ${hover ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`mt-4 pt-4 border-t border-purple-500/20 ${className}`}>
      {children}
    </div>
  );
}
