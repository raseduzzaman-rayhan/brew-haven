import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoffeeCard from '../components/CoffeeCard';
import { Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://brew-haven-re66.onrender.com/api/products');
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }
    if (search) {
      result = result.filter((p) => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, category, products]);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold mb-4 italic text-primary">Our Delicious Menu</h1>
        <p className="text-base-content/60 max-w-xl mx-auto">Explore our wide selection of hand-crafted beverages and fresh-baked treats.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={20} />
          <input 
            type="text" 
            placeholder="Search coffee, tea, muffins..." 
            className="input input-bordered w-full pl-12 rounded-full focus:outline-primary border-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-sm rounded-full px-6 font-bold transition-all ${
                category === cat ? 'btn-primary' : 'btn-ghost bg-base-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CoffeeCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-base-200 rounded-[40px]">
          <Search size={48} className="mx-auto text-base-content/20 mb-4" />
          <p className="text-xl font-bold text-base-content/60">No items found matching your filter.</p>
          <button onClick={() => {setSearch(''); setCategory('All');}} className="btn btn-link text-primary mt-2">Clear all filters</button>
        </div>
      )}
    </div>
  );
};

export default Menu;
