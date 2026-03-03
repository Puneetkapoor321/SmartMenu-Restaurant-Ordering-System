import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useStore } from "../store/useStore";

const SIZES = ["Small", "Medium", "Large"];
const MILKS = ["Whole", "Oat", "Almond", "Soy", "None"];
const EXTRAS = [
  "Extra Shot",
  "Whipped Cream",
  "Vanilla Syrup",
  "Caramel Drizzle",
];

export default function ItemSheet({ item, onClose }) {
  const addToCart = useStore((state) => state.addToCart);

  const isDrink = item.category.includes("Drinks");

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("Medium");
  const [milk, setMilk] = useState("Whole");
  const [extras, setExtras] = useState([]);
  const [notes, setNotes] = useState("");

  // Stop body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const toggleExtra = (ext) => {
    if (extras.includes(ext)) {
      setExtras(extras.filter((e) => e !== ext));
    } else {
      setExtras([...extras, ext]);
    }
  };

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
      size: isDrink ? size : null,
      milk: isDrink ? milk : null,
      extras,
      notes,
    });
    onClose();
  };

  const OptionPill = ({ label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-2xl text-[14px] font-semibold transition-all duration-300 border ${
        selected
          ? "bg-[#90353D] text-[#ffffff] border-[#90353D] shadow-[0_4px_16px_rgba(144,53,61,0.3)] scale-[1.02]"
          : "bg-[#F4F8F9] text-[#4b5563] border-[rgba(144,53,61,0.15)] hover:bg-[#eaeef0] hover:border-[rgba(144,53,61,0.3)] hover:text-[#111827]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 pointer-events-auto"
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-xl mx-auto overflow-hidden flex flex-col pointer-events-auto z-10"
        style={{
          maxHeight: "90vh",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Drag handle (Mobile) */}
        <div className="absolute top-0 left-0 w-full flex justify-center pt-4 pb-2 z-20 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[var(--color-bg-tertiary)]" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 p-3 rounded-full text-white backdrop-blur-md hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto no-scrollbar flex-1 pb-32">
          <div className="relative">
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              src={item.image}
              alt={item.name}
              className="w-full h-[300px] object-cover"
            />
            {/* Soft gradient fade for text readability */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[rgba(255,255,255,0.95)] to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="px-8 pt-4 pb-8"
          >
            <h2 className="text-[#90353D] mb-4 text-3xl font-[800] leading-tight">
              {item.name}
            </h2>
            <p className="text-[#4b5563] text-[16px] leading-[1.8] mb-8 font-medium">
              {item.description}
            </p>
            <div className="text-[32px] font-black text-[#90353D] mb-10 tracking-tight">
              ₹{item.price.toFixed(2)}
            </div>

            {isDrink && (
              <>
                <div className="mb-8">
                  <div className="caption tracking-widest text-[var(--color-text-muted)] font-bold mb-4">
                    SIZE
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {SIZES.map((s) => (
                      <OptionPill
                        key={s}
                        label={s}
                        selected={size === s}
                        onClick={() => setSize(s)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="caption tracking-widest text-[var(--color-text-muted)] font-bold mb-4">
                    MILK ALTS
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {MILKS.map((m) => (
                      <OptionPill
                        key={m}
                        label={m}
                        selected={milk === m}
                        onClick={() => setMilk(m)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="mb-10">
              <div className="caption tracking-widest text-[#9ca3af] font-bold mb-4">
                EXTRAS (OPTIONAL)
              </div>
              <div className="flex flex-wrap gap-3">
                {EXTRAS.map((e) => (
                  <OptionPill
                    key={e}
                    label={e}
                    selected={extras.includes(e)}
                    onClick={() => toggleExtra(e)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="caption tracking-widest text-[#9ca3af] font-bold mb-4">
                SPECIAL INSTRUCTIONS
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests for the barista or kitchen?"
                className="w-full h-32 bg-[#F4F8F9] text-[#111827] placeholder:text-[#9ca3af] rounded-2xl p-5 text-[16px] border border-[rgba(144,53,61,0.15)] focus:border-[#90353D] outline-none resize-none transition-all font-medium shadow-sm"
              />
            </div>
          </motion.div>
        </div>

        {/* Sticky Bottom Row */}
        <div className="absolute bottom-0 left-0 w-full bg-[#FFFFFF] border-t border-[rgba(144,53,61,0.1)] p-5 md:px-8 flex items-center justify-between gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-20">
          <div className="flex items-center justify-between bg-[#F4F8F9] px-2 py-1.5 rounded-full border border-[rgba(144,53,61,0.15)] w-[120px] shadow-sm">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFFFF] text-[#111827] shadow-sm hover:scale-105 active:scale-95 transition-all text-[#90353D]"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-8 text-center text-[#111827] font-bold text-lg">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFFFF] text-[#111827] shadow-sm hover:scale-105 active:scale-95 transition-all text-[#90353D]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 h-14 bg-gradient-to-r from-[#90353D] to-[#7A2B32] hover:to-[#5c1f25] text-[#ffffff] font-extrabold rounded-xl transition-all duration-300 flex items-center justify-between px-6 shadow-[0_8px_30px_rgba(144,53,61,0.3)] hover:shadow-[0_12px_40px_rgba(144,53,61,0.4)] hover:-translate-y-1 active:scale-[0.98] text-[16px] border border-white/10 group"
          >
            <span>Add to Cart</span>
            <span className="font-black text-[18px] group-hover:translate-x-1 transition-transform">
              ₹{(item.price * quantity).toFixed(2)}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
