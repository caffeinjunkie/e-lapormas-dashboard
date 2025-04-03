"use client";

import { Button, ButtonProps } from "@heroui/button";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";

interface LongPressButtonProps extends ButtonProps {
  onPressFinished: () => void;
}

const LongPressButton = ({
  onPressFinished,
  className,
  ...props
}: LongPressButtonProps) => {
  const [progress, setProgress] = useState(0);

  const pressDuration = 2000;

  const handleMouseDown = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 100 / (pressDuration / 50);
      });
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
    }, pressDuration);
  };

  const handleMouseUp = () => {
    if (progress === 100) {
      onPressFinished();
    }
    setTimeout(() => {
      setProgress(0);
    }, 500);
  };

  return (
    <Button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={clsx("focus:outline-none relative", className)}
      {...props}
    >
      <div className="absolute top-0 w-full h-full">
        <motion.div
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full bg-success-400"
        />
      </div>
      <div className="z-10">{props.children}</div>
    </Button>
  );
};

export default LongPressButton;
