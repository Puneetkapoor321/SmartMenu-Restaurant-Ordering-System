import React, { useState, useMemo } from "react";
import { ShoppingCart, Search, Plus, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { menuData } from "../data/menu";
import ItemSheet from "../components/ItemSheet";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "All Items",
  "Hot Beverages",
  "Cold Beverages",
  "Desserts",
  "Breakfast",
  "Main Course",
];

const ImageWithFallback = ({ src, alt, inStock }) => {
  const [error, setError] = useState(false);
  return (
    <div className="relative h-[220px] w-full overflow-hidden bg-gradient-to-br from-[#F4F8F9] to-white flex items-center justify-center border-b border-border/50">
      {!error ? (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ${inStock ? "group-hover:scale-110" : ""}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Coffee className="w-12 h-12 text-border mb-3 opacity-50" />
          <h4 className="text-accent-green text-[20px] font-extrabold leading-tight">
            {alt}
          </h4>
        </div>
      )}
      {!error && (
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.05)] via-transparent to-transparent opacity-60" />
      )}
      {!inStock && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
          <span className="bg-bg-primary border border-border text-text-primary text-[14px] font-bold px-5 py-2 rounded-full shadow-sm">
            Sold Out
          </span>
        </div>
      )}
    </div>
  );
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const cartItems = useStore((state) => state.cartItems);
  const cartTotal = useStore((state) => state.cartTotal);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const filteredItems = useMemo(() => {
    return menuData.filter((item) => {
      const matchesCategory =
        activeCategory === "All Items" || item.category === activeCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-bg-primary pb-32"
    >
      {/* Top Bar */}
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-20 bg-bg-secondary/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-8 h-[70px] md:h-[80px]"
      >
        <div className="flex items-center gap-3">
          <Coffee
            className="w-7 h-7 md:w-8 md:h-8 text-accent-green"
            strokeWidth={2.5}
          />
          <h2 className="text-text-primary m-0 text-xl md:text-2xl font-black tracking-tight">
            Nestle Cafe
          </h2>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 md:p-3 hover:bg-bg-tertiary rounded-full transition-colors group"
        >
          <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-text-primary group-hover:text-accent-green transition-colors" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.4 }}
                exit={{ scale: 0 }}
                className="absolute top-0 right-0 bg-accent-green text-[#ffffff] text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
              >
                {cartCount}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
        {/* Search & Categories Area */}
        <div className="py-6 md:py-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80 relative"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search drinks, food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-bg-secondary/70 backdrop-blur-md border border-border rounded-full pl-12 pr-4 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all shadow-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0"
          >
            <div className="flex gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-6 py-2.5 rounded-full text-[14px] whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-accent-green text-[#ffffff] font-bold shadow-[0_4px_16px_rgba(144,53,61,0.3)]"
                      : "bg-bg-secondary/70 backdrop-blur-md text-text-secondary border border-border font-medium hover:bg-bg-tertiary hover:text-text-primary shadow-sm hover:shadow"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Grid Area */}
        <div className="mt-2 md:mt-4">
          <AnimatePresence mode="popLayout">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={activeCategory + search}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredItems.map((item) => (
                <motion.div
                  variants={itemVariants}
                  key={item.id}
                  onClick={() => {
                    if (item.inStock) setSelectedItem(item);
                  }}
                  className={`bg-bg-secondary/90 backdrop-blur-lg border border-border rounded-[24px] overflow-hidden group ${item.inStock ? "cursor-pointer hover:border-accent-green/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(144,53,61,0.1)] hover:-translate-y-[5px]" : "opacity-75 grayscale-[0.2]"}`}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    inStock={item.inStock}
                  />

                  <div className="p-6">
                    <h4 className="text-[19px] font-bold text-text-primary leading-tight mb-2 group-hover:text-accent-green transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[14px] text-text-secondary line-clamp-2 leading-[1.6] mb-6 h-[44px] font-medium">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[22px] font-black text-accent-green">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <button
                        disabled={!item.inStock}
                        className="w-11 h-11 rounded-full bg-bg-primary border border-border flex items-center justify-center text-text-primary transition-all duration-300 group-hover:bg-accent-green group-hover:border-transparent group-hover:text-[#ffffff] group-hover:shadow-[0_4px_16px_rgba(144,53,61,0.3)] group-hover:scale-110 disabled:bg-bg-tertiary disabled:text-text-muted"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Cart Bar (Desktop & Mobile Wrapper) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 lg:bottom-10 left-0 right-0 w-full flex justify-center z-30 pointer-events-none px-4"
          >
            <div
              onClick={() => navigate("/cart")}
              className="bg-accent-green h-16 md:h-18 lg:h-20 rounded-full px-6 md:px-8 flex items-center w-full max-w-[400px] md:max-w-[500px] justify-between cursor-pointer shadow-[0_12px_40px_rgba(31,58,52,0.35)] hover:bg-[var(--color-accent-green-hover)] transition-all hover:scale-105 pointer-events-auto group backdrop-blur-md"
            >
              <span className="text-[#ffffff] font-bold text-[16px] md:text-[18px] flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
                <span>
                  View Cart{" "}
                  <span className="opacity-70 font-medium">({cartCount})</span>
                </span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[#ffffff] font-black text-[18px] md:text-[20px]">
                  ₹{cartTotal.toFixed(2)}
                </span>
                <span className="bg-[#ffffff] text-accent-green rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1.5 shadow-sm">
                  &rarr;
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Bottom Sheet / Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemSheet
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
