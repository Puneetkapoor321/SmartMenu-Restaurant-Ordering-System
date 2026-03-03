import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { motion } from "framer-motion";

export default function OrderConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useStore();

  const orderId = location.state?.orderId;
  const prepTime = location.state?.prepTime || 12;
  const order = orders.find((o) => o.orderId === orderId);

  if (!orderId || !order) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary px-6 py-12 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-green/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-8 relative z-10"
      >
        <svg
          fill="none"
          viewBox="0 0 100 100"
          className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]"
        >
          <circle cx="50" cy="50" r="48" stroke="#1A1A1A" strokeWidth="4" />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            stroke="var(--color-accent-green)"
            strokeWidth="4"
            strokeDasharray="302"
            initial={{ strokeDashoffset: 302 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
          <motion.path
            d="M32 52L44 64L69 39"
            stroke="var(--color-accent-green)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60"
            initial={{ strokeDashoffset: 60 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-text-primary text-center mb-3 text-4xl md:text-5xl font-black relative z-10"
      >
        Order Received
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="text-text-secondary text-[16px] md:text-[18px] mb-10 text-center relative z-10 font-medium max-w-[400px]"
      >
        We've started preparing your order. You'll receive a notification when
        it's ready.
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6, type: "spring" }}
        className="flex flex-col items-center gap-6 relative z-10 w-full max-w-[480px]"
      >
        <div className="bg-bg-secondary border border-border px-8 py-4 rounded-[20px] shadow-lg flex items-center gap-4 w-full justify-center">
          <span className="text-text-muted text-[16px] uppercase tracking-widest font-bold">
            ORDER NO.
          </span>
          <span className="text-[24px] md:text-[28px] font-black text-text-primary">
            {order.orderId}
          </span>
        </div>

        <div className="bg-accent-green/10 text-accent-green border border-accent-green/20 px-8 py-4 rounded-[20px] font-bold text-[16px] md:text-[18px] flex items-center justify-center gap-3 w-full shadow-[0_4px_20px_rgba(47,208,107,0.1)]">
          <span className="text-[20px] animate-pulse">⏱</span> Ready in ~
          {prepTime} minutes
        </div>

        <div className="w-full bg-bg-secondary border border-border rounded-[24px] p-6 mb-8 mt-2 overflow-y-auto max-h-[25vh] md:max-h-[35vh] no-scrollbar shadow-xl">
          <h3 className="text-text-muted caption tracking-widest font-bold mb-4">
            ORDER DETAILS
          </h3>
          <div className="flex flex-col gap-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex gap-3">
                  <span className="text-text-secondary font-bold text-[15px]">
                    {item.quantity}x
                  </span>
                  <span className="text-text-primary text-[15px] font-semibold">
                    {item.name}
                  </span>
                </div>
                <span className="text-text-secondary text-[15px] font-medium">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-[1px] bg-border my-5"></div>
          <div className="flex justify-between items-center font-bold">
            <span className="text-text-primary text-[16px]">Total Paid</span>
            <span className="text-accent-green text-[20px] font-black">
              ₹{order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/menu")}
          className="w-[240px] h-[54px] border border-border hover:border-text-secondary rounded-full text-text-primary font-bold hover:bg-bg-tertiary transition-all hover:scale-105 active:scale-95 text-[16px]"
        >
          Return to Menu
        </button>
      </motion.div>
    </div>
  );
}
