import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

// Define the props for the component
interface AnimatedFeatureCardProps extends Omit<HTMLMotionProps<"div">, "title"> {
  /** The numerical index to display, e.g., "001" */
  index: string;
  /** The tag or category label */
  tag: string;
  /** The main title or description */
  title: React.ReactNode;
  /** The URL for the central image */
  imageSrc?: string;
  /** Custom graphic to render instead of image */
  customGraphic?: React.ReactNode;
  /** The color variant which determines the gradient and tag color */
  color: "orange" | "purple" | "blue";
}

// Define HSL color values for each variant
const colorVariants = {
  orange: {
    '--feature-color': 'hsl(35, 91%, 55%)',
    '--feature-color-light': 'hsl(41, 100%, 85%)',
    '--feature-color-dark': 'hsl(24, 98%, 15%)',
  },
  purple: {
    '--feature-color': 'hsl(262, 85%, 60%)',
    '--feature-color-light': 'hsl(261, 100%, 87%)',
    '--feature-color-dark': 'hsl(264, 100%, 15%)',
  },
  blue: {
    '--feature-color': 'hsl(211, 100%, 60%)',
    '--feature-color-light': 'hsl(210, 100%, 83%)',
    '--feature-color-dark': 'hsl(216, 100%, 15%)',
  },
};

const AnimatedFeatureCard = React.forwardRef<
  HTMLDivElement,
  AnimatedFeatureCardProps
>(({ className, index, tag, title, imageSrc, customGraphic, color, ...props }, ref) => {
  const cardStyle = colorVariants[color] as React.CSSProperties;

  return (
    <motion.div
      ref={ref}
      style={cardStyle}
      className={`relative flex h-[380px] w-full max-w-sm flex-col justify-end overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 shadow-xl ${className || ''}`}
      whileHover="hover"
      initial="initial"
      variants={{
        initial: { y: 0 },
        hover: { y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      {...props}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 30%, var(--feature-color-light) 0%, transparent 70%)`
        }}
      />
      
      {/* Index Number */}
      <div className="absolute top-6 left-6 font-mono text-lg font-bold text-white/30">
        {index}
      </div>

      {/* Main Image */}
      <motion.div 
        className="absolute inset-0 z-10 flex items-center justify-center"
        variants={{
            initial: { scale: 1, y: 0 },
            hover: { scale: 1.05, y: -10 },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {customGraphic ? (
          customGraphic
        ) : (
          imageSrc && (
            <img
              src={imageSrc}
              alt={tag}
              className="w-48 h-48 object-contain drop-shadow-2xl"
            />
          )
        )}
      </motion.div>
      
      {/* Content */}
      {(tag || title) && (
        <div className="relative z-20 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
          {tag && (
            <span
              className={`${title ? 'mb-2' : ''} inline-block rounded-full px-3 py-1 text-xs font-semibold`}
              style={{ 
                backgroundColor: 'var(--feature-color-dark)', 
                color: 'var(--feature-color)' 
              }}
            >
              {tag}
            </span>
          )}
          {title && <p className="text-base text-gray-200">{title}</p>}
        </div>
      )}
    </motion.div>
  );
});
AnimatedFeatureCard.displayName = "AnimatedFeatureCard";

export { AnimatedFeatureCard };
