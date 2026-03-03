import React, { useState, useRef } from "react";
import { Coffee, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Splash() {
  const [table, setTable] = useState("");
  const navigate = useNavigate();
  const setTableNumber = useStore((state) => state.setTableNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (table.trim()) {
      setTableNumber(table);
      navigate("/menu");
    }
  };

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 40]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Visual Side (Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex flex-1 relative bg-bg-secondary"
      >
        <div className="absolute inset-0 bg-[#F4F8F9] overflow-hidden">
          <motion.img
            style={{ y: backgroundY }}
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80"
            alt="Cafe Interior"
            className="w-full h-[120%] object-cover brightness-90 -top-[10%] relative"
          />
          <div
            className="absolute inset-0 animate-gradient"
            style={{
              background:
                "linear-gradient(120deg, rgba(144, 53, 61, 0.55), rgba(144, 53, 61, 0.25), rgba(0,0,0,0.2))",
              backgroundSize: "200% 200%",
            }}
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_150%)] pointer-events-none" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16 lg:p-24 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
            style={{
              background: "rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              padding: "40px 30px",
            }}
          >
            <h1 className="mb-6 leading-tight flex flex-col">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="text-[#FFFFFF] font-[600]"
                style={{ textShadow: "0 4px 20px rgba(0,0,0,0.35)" }}
              >
                Welcome to
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="inline-block text-[#90353D] font-[800] mt-2 tracking-tight"
                style={{ textShadow: "0 6px 25px rgba(0,0,0,0.4)" }}
              >
                Nestle Cafe
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl max-w-md leading-[1.7] font-medium"
              style={{
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              Experience a seamless way to order your favorite coffee and
              artisanal food right from your table.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
              className="mt-8"
            >
              <button
                onClick={() => navigate("/menu")}
                className="group w-auto px-8 h-14 bg-gradient-to-r from-[#90353D] to-[#7A2B32] hover:to-[#5c1f25] text-[#ffffff] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(144,53,61,0.3)] hover:shadow-[0_8px_30px_rgba(144,53,61,0.5)] hover:scale-[1.05] active:scale-[0.98] flex items-center justify-center text-[16px] border border-white/10"
              >
                Explore Menu
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Form Side */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 md:p-16 lg:p-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[400px] flex flex-col items-center justify-center bg-bg-secondary/50 backdrop-blur-md p-8 md:p-10 rounded-[24px] border border-border shadow-2xl"
        >
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <Coffee
              className="w-14 h-14 text-accent-green mb-5 hover:scale-110 hover:-translate-y-1 transition-all duration-300 drop-shadow-sm"
              strokeWidth={1.5}
            />
          </motion.div>

          <h2 className="text-text-primary mb-2 text-center md:hidden font-extrabold text-[#90353D] drop-shadow-sm">
            Nestle Cafe
          </h2>
          <p className="caption text-text-secondary mb-10 text-center">
            Enter table number to begin
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <input
              type="number"
              placeholder="Table #"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="w-full h-14 bg-bg-tertiary border border-border rounded-xl text-center text-text-primary text-2xl font-bold focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] outline-none transition-all placeholder:text-text-muted no-scrollbar"
              required
              min="1"
              max="999"
            />
            <button
              type="submit"
              className="group w-full h-14 bg-accent-green hover:bg-[#7A2B32] text-[#ffffff] font-bold rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(144,53,61,0.2)] hover:shadow-[0_8px_30px_rgba(144,53,61,0.4)] hover:scale-[1.05] active:scale-[0.98] flex items-center justify-center text-[16px]"
            >
              Start Ordering
              <span className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300">
                &rarr;
              </span>
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-text-muted text-[11px] mt-12 md:mt-auto font-medium uppercase tracking-[0.2em] opacity-70 flex flex-col items-center gap-1.5"
        >
          Powered by
          <span className="border-b-[1.5px] border-[#90353D]/50 text-[#90353D] pb-0.5">
            Puneet Kapoor
          </span>
        </motion.div>
      </div>
    </div>
  );
}
