import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = ["Pending", "In Progress", "Ready"];

export default function Admin() {
  const { orders, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState("Pending"); // for mobile view

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const completedOrders = orders.filter((o) => o.status === "Archived").length;
  const totalOrders = orders.length;

  const handleNextStatus = (orderId, currentStatus) => {
    if (currentStatus === "Pending") updateOrderStatus(orderId, "In Progress");
    if (currentStatus === "In Progress") updateOrderStatus(orderId, "Ready");
    if (currentStatus === "Ready") updateOrderStatus(orderId, "Archived");
  };

  const Column = ({ title, status, count }) => {
    const colOrders = orders.filter((o) => o.status === status);

    return (
      <div className="flex flex-col bg-bg-secondary/40 backdrop-blur-md rounded-[32px] border border-border/50 p-5 h-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-text-primary text-[18px] font-bold">{title}</h3>
          <span className="bg-bg-tertiary text-text-secondary text-[12px] font-bold px-3 py-1 rounded-full">
            {count}
          </span>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar pb-4 flex-1">
          <AnimatePresence>
            {colOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-text-muted py-12 font-medium"
              >
                No active orders
              </motion.div>
            ) : (
              colOrders.map((order) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order.orderId}
                  className="bg-bg-secondary border border-border/60 shadow-sm rounded-[24px] p-5 flex flex-col group hover:border-accent-green/30 hover:shadow-[0_12px_30px_rgba(144,53,61,0.08)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[16px] text-text-primary">
                        {order.orderId}
                      </span>
                      <span className="bg-bg-tertiary px-3 py-1 rounded-full text-[13px] font-bold text-text-primary border border-[var(--color-border)]">
                        Table {order.tableNumber}
                      </span>
                    </div>
                    <div className="text-[12px] text-text-muted flex items-center gap-1.5 font-medium">
                      <Clock className="w-[14px] h-[14px]" />
                      {Math.floor((Date.now() - order.createdAt) / 60000)}m ago
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-6 bg-bg-primary/50 backdrop-blur-sm p-4 rounded-[16px] border border-border/50">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 text-[14px] text-text-secondary"
                      >
                        <span className="font-black text-text-primary">
                          {item.quantity}x
                        </span>
                        <span className="font-medium">
                          {item.name}
                          {(item.size ||
                            item.milk ||
                            item.extras?.length > 0 ||
                            item.notes) && (
                            <div className="text-[13px] pl-3 border-l-2 border-border mt-1 mb-1 italic opacity-90 text-text-muted">
                              {[item.size, item.milk, ...(item.extras || [])]
                                .filter(Boolean)
                                .join(" • ")}
                              {item.notes && (
                                <div className="text-warning mt-1">
                                  "{item.notes}"
                                </div>
                              )}
                            </div>
                          )}
                        </span>
                      </div>
                    ))}
                    {order.notes && (
                      <div className="mt-2 text-[13px] text-warning bg-warning/10 p-3 rounded-[8px] border border-warning/20 font-medium">
                        <span className="font-bold">Instructions:</span>{" "}
                        {order.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    {order.status === "Pending" && (
                      <span className="text-[12px] font-bold px-4 py-1.5 rounded-full bg-[rgba(245,158,11,0.15)] text-[#F59E0B]">
                        Pending
                      </span>
                    )}
                    {order.status === "In Progress" && (
                      <span className="text-[12px] font-bold px-4 py-1.5 rounded-full bg-[rgba(59,130,246,0.15)] text-[#3B82F6]">
                        In Progress
                      </span>
                    )}
                    {order.status === "Ready" && (
                      <span className="text-[12px] font-bold px-4 py-1.5 rounded-full bg-[rgba(99,102,241,0.15)] text-[#6366f1]">
                        Ready
                      </span>
                    )}

                    <button
                      onClick={() =>
                        handleNextStatus(order.orderId, order.status)
                      }
                      className="bg-bg-primary hover:bg-accent-green text-text-primary hover:text-white px-6 py-2 rounded-full text-[14px] font-bold transition-all duration-300 flex items-center gap-2 border border-border hover:border-transparent group-hover:shadow-[0_8px_20px_rgba(144,53,61,0.2)] hover:-translate-y-0.5"
                    >
                      {order.status === "Pending"
                        ? "Start Prep →"
                        : order.status === "In Progress"
                          ? "Mark Ready ✓"
                          : "Archive"}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-bg-primary"
    >
      <div className="sticky top-0 z-20 bg-bg-secondary/80 backdrop-blur-xl border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 gap-4 md:gap-0">
        <h2 className="text-text-primary text-[24px] md:text-[28px] m-0 font-extrabold flex items-center gap-3">
          Kitchen Dashboard
        </h2>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 hidden sm:flex">
            <div className="text-right">
              <div className="text-text-muted text-[11px] uppercase tracking-wider font-bold mb-0.5">
                Total Daily
              </div>
              <div className="text-text-primary text-[16px] font-black">
                {totalOrders} Orders
              </div>
            </div>
            <div className="w-[1px] h-8 bg-border"></div>
            <div className="text-right">
              <div className="text-text-muted text-[11px] uppercase tracking-wider font-bold mb-0.5">
                Completed
              </div>
              <div className="text-accent-green text-[16px] font-black">
                {completedOrders} Orders
              </div>
            </div>
          </div>
          <div className="bg-bg-tertiary px-4 py-2 rounded-full text-text-primary font-bold text-[14px]">
            Live Sync •{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Mobile Tab View */}
      <div className="md:hidden px-4 mt-6 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {STATUSES.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-all duration-300 border ${
                activeTab === status
                  ? "bg-accent-green text-white border-transparent shadow-[0_4px_12px_rgba(144,53,61,0.3)]"
                  : "bg-bg-secondary/70 backdrop-blur-md text-text-secondary border-border/50 hover:bg-bg-tertiary hover:shadow-sm"
              }`}
            >
              {status} <span className="opacity-60 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
        {/* Mobile List View */}
        <div className="md:hidden">
          <Column
            title={activeTab}
            status={activeTab}
            count={orders.filter((o) => o.status === activeTab).length}
          />
        </div>

        {/* Desktop Kanban View */}
        <div className="hidden md:grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          <Column
            title="Pending"
            status="Pending"
            count={orders.filter((o) => o.status === "Pending").length}
          />
          <Column
            title="In Progress"
            status="In Progress"
            count={orders.filter((o) => o.status === "In Progress").length}
          />
          <Column
            title="Ready"
            status="Ready"
            count={orders.filter((o) => o.status === "Ready").length}
          />
        </div>
      </div>
    </motion.div>
  );
}
