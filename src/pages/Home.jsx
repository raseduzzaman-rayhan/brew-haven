import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Coffee, ShieldCheck, Truck, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920" 
            alt="Coffee Hero" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              Start Your Day with a <span className="text-primary italic">Perfect</span> Brew
            </h1>
            <p className="text-xl text-gray-200 mb-8 font-light leading-relaxed">
              Experience the art of coffee making. From farm to cup, we ensure every sip tells a story of quality and passion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn btn-primary btn-lg rounded-full px-10 font-bold gap-2">
                Order Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg rounded-full px-10 text-white border-white hover:bg-white hover:text-black">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: <Coffee />, title: "High Quality", desc: "Premium beans sourced from the best estates." },
          { icon: <ShieldCheck />, title: "Safe Order", desc: "Secure payments and contactless pickup." },
          { icon: <Truck />, title: "Fast Delivery", desc: "Fresh coffee delivered to your doorstep." },
          { icon: <Clock />, title: "24/7 Support", desc: "We are here to help you anytime." }
        ].map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center p-8 bg-base-200 rounded-3xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              {React.cloneElement(f.icon, { size: 32 })}
            </div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-base-content/60">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Specialty Section */}
      <section className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <img 
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800" 
            alt="Crafting Coffee" 
            className="rounded-[40px] shadow-2xl w-full"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 italic text-primary">Made with Love, Crafted with Precision</h2>
          <p className="text-lg text-base-content/70 mb-6 leading-relaxed">
            Our baristas are artists. Each cup is a masterpiece of temperature, timing, and technique. From the precise grind size to the delicate milk froth, we obsess over every detail so you can enjoy the perfect moment.
          </p>
          <ul className="space-y-4 mb-8 font-medium">
            <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary" /> Ethically Sourced Coffee Beans</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary" /> House-Made Syrups & Flavors</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary" /> Expertly Trained Master Baristas</li>
          </ul>
          <Link to="/about" className="btn btn-primary rounded-full px-8">Discover More</Link>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="bg-primary rounded-[40px] p-10 md:p-20 text-primary-content text-center overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Join the Brew Haven Family</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Subscribe for exclusive offers, new arrivals, and coffee tips delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="input input-lg bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 rounded-full w-full" />
              <button className="btn btn-lg bg-white text-primary border-none hover:bg-gray-100 rounded-full font-bold px-10">Subscribe</button>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-3xl" />
        </div>
      </section>
    </div>
  );
};

export default Home;
