import React from "react";
import { motion } from "framer-motion";

const LeftHandSide = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="hidden md:block w-[25%] min-h-screen"
    >
    </motion.div>
  );
};

export default LeftHandSide;
