import { cn } from "@/lib/utils";
import {
  Accessibility,
  Car,
  Droplets,
  Tv,
  Users,
  Users2,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";
import { CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
// cspell: disable

export const CustomHoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    image: string[];
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  xl:mx-auto xl:w-3/4 py-10",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-[rgba(231,205,220)] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle className="mb-6 mt-0">{item.title}</CardTitle>
            <CardContent className="p-0 justify-center flex items-center">
              <Carousel
                className="w-full max-w-xs hover:cursor-grab active:cursor-grabbing flex flex-col items-center"
                opts={{ loop: true }}
                orientation={"horizontal"}
              >
                <CarouselContent>
                  {item.image.map((path, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <img
                          src={path}
                          alt={item.title + " image " + (index + 1)}
                          className="h-full w-full flex items-center justify-center border border-transparent rounded-lg object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  className="-left-6 sm:hidden size-6"
                  variant="secondary"
                />
                <CarouselNext
                  className="-right-6 sm:hidden size-6"
                  variant="secondary"
                />
                <CarouselNext className="hidden sm:flex" />
                <CarouselPrevious className="hidden sm:flex" />
              </Carousel>
            </CardContent>
            <CardDescription className="text-center">
              {item.description}
            </CardDescription>
          </Card>
        </div>
      ))}
      <div
        key={3}
        className="relative group block p-2 h-full md:col-span-2 md:max-w-md md:mx-auto md:w-full"
        onMouseEnter={() => setHoveredIndex(3)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <AnimatePresence>
          {hoveredIndex === 3 && (
            <motion.span
              className="absolute inset-0 h-full w-full bg-[rgba(231,205,220)] block rounded-3xl"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.15 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.2 },
              }}
            />
          )}
        </AnimatePresence>
        <Card>
          <CardTitle>Équipements</CardTitle>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
              <Tv className="h-5 w-5 text-blue-400" />
              <span className="text-xs font-medium">Télévision</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
              <Wifi className="h-5 w-5 text-green-400" />
              <span className="text-xs font-medium">WiFi</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-xs font-medium">Vestiaire</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
              <Car className="h-5 w-5 text-orange-400" />
              <span className="text-xs font-medium">Parking</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
              <Droplets className="h-5 w-5 text-cyan-400" />
              <span className="text-xs font-medium">Douche</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
              <Users2 className="h-5 w-5 text-pink-400" />
              <span className="text-xs font-medium">Sanitaire</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-emerald-800/20 border border-emerald-600/30">
              <Accessibility className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                Accès PMR
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-5",
        className,
      )}
    >
      <div className="relative z-10">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className,
      )}
    >
      {children}
    </p>
  );
};
