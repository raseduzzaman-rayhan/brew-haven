import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, CheckCircle, Clock, Package, User, MoreHorizontal, Coffee as CoffeeIcon } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-warning gap-1"><Clock size={12}/> Pending</span>;
      case 'completed': return <span className="badge badge-success gap-1 text-white"><CheckCircle size={12}/> Completed</span>;
      case 'cancelled': return <span className="badge badge-error gap-1 text-white"><Package size={12}/> Cancelled</span>;
      default: return <span className="badge badge-ghost">{status}</span>;
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-primary p-8 md:p-12 rounded-[40px] text-primary-content shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">My Dashboard</h1>
          <p className="text-xl opacity-90">Welcome back, {user?.name}! {user?.role === 'admin' ? '(Administrator)' : ''}</p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="stat bg-white/10 backdrop-blur-md rounded-3xl text-white py-4 px-8 border border-white/20">
            <div className="stat-title text-white/70">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl rounded-[40px] p-8 border border-base-200 h-fit">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 text-4xl font-bold">
              {user?.name[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">{user?.name}</h2>
            <div className="space-y-4 text-base-content/70">
              <div className="flex items-center gap-3"><User size={18} /> {user?.email}</div>
              <div className="flex items-center gap-3"><ShoppingBag size={18} /> Role: {user?.role}</div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="lg:col-span-2">
          <div className="bg-base-100 rounded-[40px] shadow-xl border border-base-200 overflow-hidden">
            <div className="p-8 border-b border-base-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-serif">Recent Orders</h2>
              <button onClick={fetchOrders} className="btn btn-ghost btn-sm">Refresh</button>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-20 text-center text-base-content/40">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p>No orders found yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th>Order ID</th>
                      {user?.role === 'admin' && <th>Customer</th>}
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Items</th>
                      {user?.role === 'admin' && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <td className="font-bold">#ORD-{order.id.toString().padStart(4, '0')}</td>
                        {user?.role === 'admin' && <td>{order.user_name}</td>}
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="font-bold text-primary">${order.total_price.toFixed(2)}</td>
                        <td>{statusBadge(order.status)}</td>
                        <td>
                          <div className="dropdown dropdown-left">
                            <label tabIndex={0} className="btn btn-ghost btn-xs">View Items</label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-64 border border-base-200">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between py-1 border-b border-base-100 last:border-0">
                                  <span className="text-sm">{item.quantity}x {item.name}</span>
                                  <span className="font-bold text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                        {user?.role === 'admin' && (
                          <td>
                            <div className="dropdown dropdown-left">
                              <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm"><MoreHorizontal size={16}/></label>
                              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-200">
                                <li><button onClick={() => updateStatus(order.id, 'pending')}>Mark Pending</button></li>
                                <li><button onClick={() => updateStatus(order.id, 'completed')} className="text-success">Mark Completed</button></li>
                                <li><button onClick={() => updateStatus(order.id, 'cancelled')} className="text-error">Cancel Order</button></li>
                              </ul>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
