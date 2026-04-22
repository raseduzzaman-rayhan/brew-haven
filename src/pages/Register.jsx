import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, UserPlus, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-base-100 p-8 rounded-[40px] shadow-2xl border border-base-200"
      >
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Coffee size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold">Join the Brew</h2>
          <p className="text-base-content/60">Create your Brew Haven account</p>
        </div>

        {error && (
          <div className="alert alert-error mb-6 rounded-2xl">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="label font-bold text-sm">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input 
                type="text" 
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:outline-primary"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label font-bold text-sm">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input 
                type="email" 
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:outline-primary"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label font-bold text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input 
                type="password" 
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:outline-primary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary w-full rounded-2xl h-14 font-bold text-lg gap-2 mt-4 ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && <UserPlus size={20} />}
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-8 text-base-content/60">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in now</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
