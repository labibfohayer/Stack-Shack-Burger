"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const springTransition = {
  type: "spring",
  stiffness: 260,
  damping: 14,
  mass: 0.8,
};

export interface NudgeOnLeaveProps {
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}

export const NudgeOnLeave: React.FC<NudgeOnLeaveProps> = ({
  rotate = 0,
  className,
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const offsetAngle = rotate < 0 ? -3 : 3;

  return (
    <motion.div
      initial={false}
      animate={
        isHovered
          ? { rotate: rotate + offsetAngle, y: -4 }
          : { rotate, y: 0 }
      }
      transition={springTransition}
      onPointerEnter={(e) => {
        if (!shouldReduceMotion && e.pointerType === "mouse") {
          setIsHovered(true);
        }
      }}
      onPointerLeave={() => setIsHovered(false)}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default NudgeOnLeave;
