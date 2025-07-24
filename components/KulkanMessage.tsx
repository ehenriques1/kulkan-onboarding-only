import React from "react";

export function KulkanMessage({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 space-y-2 max-w-lg w-full shadow-sm ${className}`}>
      {children}
    </div>
  );
} 