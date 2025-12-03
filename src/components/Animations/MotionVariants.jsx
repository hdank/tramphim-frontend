import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Fade up animation variants
export const fadeUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }),
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

// Scale on hover variants
export const scaleHoverVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: { scale: 0.98 }
};

// Stagger container variants
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Stagger item variants
export const staggerItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Slide in from left
export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Slide in from right
export const slideInRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Card hover animation
export const cardHoverVariants = {
  initial: { 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Image zoom on hover
export const imageZoomVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Pulse animation for loading states
export const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Text reveal animation
export const textRevealVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    clipPath: "inset(100% 0 0 0)"
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Badge pop animation
export const badgePopVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  }
};

// Animated wrapper component for fade up effect
export const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeUpVariants}
    custom={delay}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated wrapper for stagger children
export const StaggerContainer = ({ children, className = "" }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainerVariants}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated wrapper for stagger items
export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={staggerItemVariants}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated card wrapper with hover effect
export const AnimatedCard = ({ children, className = "", onClick }) => (
  <motion.div
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    variants={cardHoverVariants}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

// Scroll triggered animation wrapper
export const ScrollReveal = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Page transition wrapper
export const PageTransition = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default {
  fadeUpVariants,
  scaleHoverVariants,
  staggerContainerVariants,
  staggerItemVariants,
  slideInLeftVariants,
  slideInRightVariants,
  cardHoverVariants,
  imageZoomVariants,
  pulseVariants,
  textRevealVariants,
  badgePopVariants,
  FadeUp,
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  ScrollReveal,
  PageTransition
};
