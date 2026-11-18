"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TextRollProps {
  text: string;
  className?: string;
  duplicateClassName?: string;
}

export const TextRoll: React.FC<TextRollProps> = ({
  text,
  className,
  duplicateClassName,
}) => {
  return (
    <div className={cn("relative overflow-hidden leading-[1]", className)}>
      <div className="transition-transform duration-300 group-hover:-translate-y-full leading-[1]">
        {text}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-full transition-transform duration-300 group-hover:-translate-y-full leading-[1]",
          duplicateClassName
        )}
      >
        {text}
      </div>
    </div>
  );
};

export default TextRoll;
