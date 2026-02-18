"use client";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useRef, useState } from "react";

interface CompareProps {
  firstComponent: React.ReactNode;
  secondComponent: React.ReactNode;
  className?: string;
  firstComponentClassName?: string;
  secondComponentClassName?: string;
  initialSliderPercentage: number;
  slideMode?: "hover" | "drag";
  autoplay?: boolean;
  autoplayDuration?: number;
}
export const Compare = ({
  firstComponent,
  secondComponent,
  className,
  firstComponentClassName,
  secondComponentClassName,
  initialSliderPercentage,
  slideMode = "hover",
  autoplay = false,
  autoplayDuration = 1000,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const [isMouseOver, setIsMouseOver] = useState(false);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = ({ to0 }: { to0: boolean }) => {
    const startTime = Date.now();
    const startPercent = sliderXPercent;
    if (to0) {
      const animateTo0 = () => {
        const elapsedTime = Date.now() - startTime;
        const percentage =
          startPercent - (elapsedTime / autoplayDuration) * 100;
        setSliderXPercent(Math.max(percentage, 0));
        if (percentage < -10) {
          stopAutoplay();
          return;
        }
        autoplayRef.current = setTimeout(animateTo0, 16); // ~60fps
      };
      animateTo0();
    } else {
      const animateTo100 = () => {
        const elapsedTime = Date.now() - startTime;
        const percentage =
          startPercent + (elapsedTime / autoplayDuration) * 100;
        setSliderXPercent(Math.min(percentage, 100));
        if (percentage > 110) {
          stopAutoplay();
          return;
        }
        autoplayRef.current = setTimeout(animateTo100, 16); // ~60fps
      };
      animateTo100();
    }
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  function mouseEnterHandler() {
    setIsMouseOver(true);
    stopAutoplay();
  }

  function mouseLeaveHandler(e: any) {
    setIsMouseOver(false);
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    const clientWidth = window.innerWidth;
    if (clientWidth > 767) {
      // flex-col-2
      if (
        e.nativeEvent.x >
        clientWidth / 2 +
          24 + // gap between the second and third components
          e.nativeEvent.fromElement.clientWidth / 4
      ) {
        startAutoplay({ to0: false });
      } else {
        startAutoplay({ to0: true });
      }
    } else {
      // flex-col-1
      if (e.nativeEvent.x > clientWidth / 4) {
        startAutoplay({ to0: false });
      } else {
        startAutoplay({ to0: true });
      }
    }
  }

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode],
  );

  const handleEnd = (e: any) => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    const clientWidth = window.innerWidth;
    if (clientWidth > 767) {
      // flex-col-2
      // do nothing it is computer version
    } else {
      // flex-col-1
      startAutoplay({ to0: false });
    }
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => handleStart(e.clientX),
    [handleStart],
  );
  const handleMouseUp = (e: any) => handleEnd(e);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleStart(e.touches[0].clientX);
      }
    },
    [handleStart, autoplay],
  );

  const handleTouchEnd = (e: any) => {
    handleEnd(e);
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove, autoplay],
  );

  return (
    <div
      ref={sliderRef}
      className={cn("relative w-full h-full", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className={cn(
            "absolute top-0 z-20 rounded-2xl w-full select-none",
            firstComponentClassName,
          )}
          style={{
            clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
          }}
          transition={{ duration: 0 }}
        >
          {firstComponent}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <motion.div
          className={cn(
            "absolute inset-0 top-0 left-0 z-[19] rounded-2xl select-none",
            secondComponentClassName,
          )}
          draggable={false}
        >
          {secondComponent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
