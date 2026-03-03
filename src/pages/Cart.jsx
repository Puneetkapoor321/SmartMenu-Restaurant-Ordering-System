import React, { useState } from "react";
import { ArrowLeft, Trash2, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    tableNumber,
    cartTotal,
    clearCart,
    addOrder,
  } = useStore();
  const [orderNotes, setOrderNotes] = useState("");

  const fee = cartTotal * 0.05;
  const total = cartTotal + fee;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = {
      orderId: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      tableNumber,
      items: [...cartItems],
      status: "Pending",
      createdAt: Date.now(),
      notes: orderNotes,
      total,
    };

    addOrder(newOrder);
    clearCart();
    navigate("/order-confirmed", {
      state: { orderId: newOrder.orderId, prepTime: 12 },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-bg-primary"
    >
      <div className="sticky top-0 z-20 bg-bg-primary/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 md:px-8 h-[70px] md:h-[80px]">
        <button
          onClick={() => navigate(-1)}
          className="p-3 -ml-3 text-text-primary cursor-pointer hover:bg-bg-tertiary rounded-full transition-colors group flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-[16px] hidden md:block">
            Back to Menu
          </span>
        </button>
        <h2 className="text-text-primary text-[24px] m-0 font-extrabold absolute left-1/2 -translate-x-1/2">
          Checkout
        </h2>
        <div className="bg-accent-green/10 px-4 py-2 rounded-full text-accent-green font-bold text-[14px] border border-accent-green/20">
          Table {tableNumber || "?"}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-12 mt-20"
          >
            <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
              <span className="text-4xl text-text-muted">🍽</span>
            </div>
            <h3 className="text-text-primary text-2xl mb-2 font-bold">
              Your cart is empty
            </h3>
            <p className="text-text-secondary text-[16px] mb-8 max-w-sm text-center">
              Looks like you haven't added any items to your order yet.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="px-8 py-4 bg-bg-secondary border border-border rounded-full text-text-primary font-bold hover:bg-bg-tertiary transition-colors shadow-lg"
            >
              Explore Menu
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left Column: Items */}
            <div className="flex-1">
              <h3 className="text-text-primary mb-6 text-[22px] font-bold">
                Order Details
              </h3>

              <div className="flex flex-col gap-4 mb-8">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.cartId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: -50 }}
                      className="flex gap-5 p-4 bg-bg-secondary/70 backdrop-blur-lg rounded-[24px] border border-border/50 items-center group shadow-sm hover:shadow-[0_8px_30px_rgba(144,53,61,0.06)] hover:border-accent-green/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-[12px] flex-shrink-0 shadow-md"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-text-primary font-bold text-[18px] truncate pr-4">
                            {item.name}
                          </h4>
                          <span className="text-[18px] font-black text-text-primary">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="text-text-secondary text-[13px] leading-tight mb-4 font-medium flex-1">
                          {item.size && <span>{item.size}</span>}
                          {item.milk && <span> • {item.milk}</span>}
                          {item.extras?.length > 0 && (
                            <span> • {item.extras.join(", ")}</span>
                          )}
                          {item.notes && (
                            <div className="mt-1 italic opacity-80 text-warning">
                              "{item.notes}"
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2 bg-bg-tertiary rounded-full border border-border p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity - 1)
                              }
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-secondary hover:bg-[var(--color-bg-tertiary)] text-text-primary transition-colors hover:text-danger"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="w-[16px] h-[16px]" />
                              ) : (
                                <Minus className="w-[16px] h-[16px]" />
                              )}
                            </button>
                            <span className="text-text-primary text-[15px] font-bold w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity + 1)
                              }
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-secondary hover:bg-[var(--color-bg-tertiary)] text-text-primary transition-colors"
                            >
                              <Plus className="w-[16px] h-[16px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mb-8">
                <div className="caption tracking-widest text-[var(--color-text-muted)] font-bold mb-3">
                  ORDER NOTES
                </div>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions for the kitchen?"
                  className="w-full h-32 md:h-24 bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted rounded-[16px] p-4 text-[16px] focus:border-accent-green outline-none resize-none transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Right Column: Summary Card */}
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <div className="sticky top-[100px] bg-bg-secondary/80 backdrop-blur-2xl border border-border/80 rounded-[32px] p-8 shadow-[0_24px_60px_rgba(144,53,61,0.08)]">
                <h3 className="text-text-primary text-[22px] font-bold mb-6">
                  Payment Summary
                </h3>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-between items-center text-[16px] font-medium text-text-secondary">
                    <span>Subtotal</span>
                    <span className="text-text-primary">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[16px] font-medium text-text-secondary">
                    <span>Service Fee (5%)</span>
                    <span className="text-text-primary">₹{fee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-border mb-6"></div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-[20px] font-bold text-text-primary">
                    Total Amount
                  </span>
                  <span className="text-[28px] font-black text-accent-green">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="group w-full bg-accent-green hover:bg-[var(--color-accent-green-hover)] text-[#ffffff] h-16 rounded-full font-extrabold text-[18px] shadow-[0_8px_32px_rgba(144,53,61,0.2)] hover:shadow-[0_12px_40px_rgba(144,53,61,0.3)] hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Pay & Place Order{" "}
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                    &rarr;
                  </span>
                </button>
                <div className="mt-4 text-center text-[12px] text-text-muted font-medium">
                  Safe and encrypted checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
