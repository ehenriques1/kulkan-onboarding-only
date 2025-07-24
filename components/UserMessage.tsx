import React from "react";

export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end w-full">
      <div className="bg-green-100 text-green-900 rounded-lg px-4 py-2 text-right max-w-xs w-fit font-medium shadow">
        {content}
      </div>
    </div>
  );
} 