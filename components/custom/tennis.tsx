import { AnimatePresence, motion } from "motion/react";

const Ball = () => (
  <svg width="40" height="40" viewBox="0 0 100 100">
    <circle
      cx="50"
      cy="50"
      r="48"
      fill="#ccff00"
      stroke="#a2cc00"
      strokeWidth="2"
    />
    <path
      d="M20,20 Q50,50 20,80"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M80,20 Q50,50 80,80"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export interface BallInstance {
  id: number;
  initialPoint: { x: number; y: number };
  finalPoint: { x: number; y: number };
  arcHeight: number;
  duration: number;
  ratio2TrajectoryParts: number;
}

export const TennisBall = ({
  balls,
  setBalls,
}: {
  balls: BallInstance[];
  setBalls: React.Dispatch<React.SetStateAction<BallInstance[]>>;
}) => {
  return (
    <div className="z-50 h-full bg-transparent overflow-hidden absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {balls.map(
          ({
            id,
            initialPoint,
            finalPoint,
            arcHeight,
            duration,
            ratio2TrajectoryParts,
          }) => (
            <motion.div
              key={id}
              initial={{ ...initialPoint, scale: 0.5 }}
              animate={{
                x: finalPoint.x,
                y: [initialPoint.y, initialPoint.y - arcHeight, finalPoint.y],
                rotate: 360,
                scale: 0.5,
              }}
              transition={{
                x: {
                  duration,
                  ease: "linear",
                },
                y: {
                  duration,
                  times: [0, ratio2TrajectoryParts, 1],
                  ease: ["easeOut", "easeIn"],
                },
              }}
              style={{
                position: "absolute",
                width: 40,
                height: 40,
                zIndex: 50,
              }}
              onAnimationComplete={() => {
                setBalls((prev) => prev.filter((b) => b.id !== id));
              }}
            >
              <Ball />
            </motion.div>
          ),
        )}
      </AnimatePresence>
    </div>
  );
};

export const handlePageClick = (
  e: React.MouseEvent,
  setBalls: React.Dispatch<React.SetStateAction<BallInstance[]>>,
) => {
  const getPlusOrMinus = () => (Math.random() < 0.5 ? -1 : 1);
  const AVERAGE_BALL_SPEED = 1200;
  const pageHeight =
    document.getElementById("pool-page")?.clientHeight || window.innerHeight;

  const initialPoint = { x: e.clientX, y: e.clientY + window.scrollY };
  const finalPoint = {
    x:
      getPlusOrMinus() * window.innerWidth * 2 * Math.random() + initialPoint.x,
    y: pageHeight + 100,
  };
  const arcHeight = (Math.random() + 1) * window.innerHeight * 0.2;
  const firstHalfDistance = Math.sqrt(
    Math.pow(finalPoint.x / 2 - initialPoint.x, 2) + Math.pow(arcHeight, 2),
  );
  const secondHalfDistance = Math.sqrt(
    Math.pow(finalPoint.x / 2 - finalPoint.x, 2) +
      Math.pow(initialPoint.y - arcHeight - finalPoint.y, 2),
  );
  const distance = firstHalfDistance + secondHalfDistance;
  const duration = distance / AVERAGE_BALL_SPEED;
  const ratio2TrajectoryParts = firstHalfDistance / distance;
  const newBall = {
    id: Date.now(),
    initialPoint,
    finalPoint,
    arcHeight,
    duration,
    ratio2TrajectoryParts,
  };
  setBalls((prev) => [...prev, newBall]);
};
