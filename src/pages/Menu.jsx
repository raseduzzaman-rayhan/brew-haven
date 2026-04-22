import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoffeeCard from '../components/CoffeeCard';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState(false);

  const extractProducts = (res) => {
    const d = res.data;

    console.log("🔍 API DATA:", d);

    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.products)) return d.products;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.result)) return d.result;

    console.error("❌ Unknown API format:", d);
    return [];
  };

  // 🚀 Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          'https://brew-haven-re66.onrender.com/api/products',
          { timeout: 8000 } // ⛔ infinite loading prevent
        );

        const data = extractProducts(res);

        if (!data.length) throw new Error("No valid data");

        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ API Error:", err.message);
        setError(true);

        // 🔥 fallback dummy (UI never empty)
        const dummy = [
          {
            id: 1,
            name: "Cappuccino",
            description: "Hot creamy coffee",
            category: "Coffee"
          },
          {
            id: 2,
            name: "Latte",
            description: "Smooth milk coffee",
            category: "Coffee"
          }
        ];

        setProducts(dummy);
        setFiltered(dummy);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔍 Filter Logic
  useEffect(() => {
    let result = Array.isArray(products) ? products : [];

    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    if (search) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, category, products]);

  // 🏷 Categories
  const categories = [
    'All',
    ...new Set(
      Array.isArray(products)
        ? products.map((p) => p.category).filter(Boolean)
        : []
    )
  ];

  // ⏳ Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      // style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 text-white">

        {/* ⚠ Error Notice */}
        {error && (
          <div className="mb-6 text-center text-yellow-300">
            ⚠ API problem detected — showing demo data
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4 italic text-primary">
            Our Delicious Menu
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Explore our wide selection of beverages and fresh treats.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              placeholder="Search coffee, tea..."
              className="input input-bordered w-full pl-12 rounded-full bg-white/10 text-white placeholder:text-white/50 border-white/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setCategory(cat)}
                className={`btn btn-sm rounded-full px-6 font-bold ${category === cat
                    ? 'btn-primary'
                    : 'bg-white/10 text-white border-none hover:bg-white/20'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <CoffeeCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/10 rounded-3xl backdrop-blur-md">
            <Search size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-xl font-bold text-white/70">
              No items found
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="btn btn-link text-primary mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;