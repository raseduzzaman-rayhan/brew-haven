import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      await axios.post('/api/orders', 
        { 
          total_price: cartTotal, 
          items: cart.map(i => ({ product_id: i.id, quantity: i.quantity })) 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      clearCart();
    } catch (err) {
      alert("Order failed!");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-base-100 p-10 rounded-[40px] shadow-2xl">
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <ChevronRight size={40} className="rotate-[-90deg] translate-x-1" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Order Placed!</h2>
          <p className="text-base-content/60 mb-8">Thank you for your purchase. We're starting to brew your coffee right now!</p>
          <Link to="/dashboard" className="btn btn-primary w-full rounded-full">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-10 italic">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-[40px]">
          <ShoppingCart size={64} className="mx-auto text-base-content/20 mb-4" />
          <p className="text-xl font-bold text-base-content/60 mb-6">Your cart is currently empty.</p>
          <Link to="/menu" className="btn btn-primary rounded-full px-10">Browse Menu</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-base-100 rounded-3xl shadow-sm border border-base-200"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 rounded-2xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold font-serif">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-base-200 p-2 rounded-full">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-circle btn-xs btn-ghost"><Minus size={14} /></button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-circle btn-xs btn-ghost"><Plus size={14} /></button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="btn btn-ghost btn-circle text-error"><Trash2 size={20} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 p-8 rounded-[40px] shadow-xl sticky top-24 border border-base-200">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-base-content/60">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base-content/60">
                  <span>Shipping</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                <div className="divider opacity-50"></div>
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout} 
                className={`btn btn-primary w-full btn-lg rounded-full font-bold gap-2 ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {!loading && <CreditCard size={20} />}
                {loading ? 'Processing...' : `Checkout $${cartTotal.toFixed(2)}`}
              </button>
              
              {!user && (
                <p className="text-xs text-center mt-4 text-base-content/50">
                  Please <Link to="/login" className="text-primary underline">login</Link> to complete your order.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
