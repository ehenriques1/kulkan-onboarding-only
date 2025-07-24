import React from "react";

export function KulkanMessage({
  title,
  intro,
  body = [],
  question,
}: {
  title?: string;
  intro?: string;
  body?: string[];
  question: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-w-lg w-full shadow-sm">
      {title && (
        <div className="font-bold text-lg flex items-center gap-2">
          {title}
        </div>
      )}
      {intro && <p className="text-gray-700">{intro}</p>}
      {body && body.map((p, i) => (
        <p key={i} className="text-gray-700">{p}</p>
      ))}
      <div className="font-semibold text-base text-gray-900 pt-2">
        {question}
      </div>
    </div>
  );
} 