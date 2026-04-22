import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  QrCode, Smartphone, Zap, Globe, Shield, BarChart3,
  ArrowRight, Check, Star, Sparkles, CreditCard, Share2,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  { icon: <QrCode size={22} />, title: 'QR Code Generator', desc: 'Auto-generate high-res QR codes linked to your digital card. Perfect for print materials.' },
  { icon: <Smartphone size={22} />, title: 'Mobile-First Design', desc: 'Cards load instantly on any device with smooth animations and touch-optimized CTAs.' },
  { icon: <Globe size={22} />, title: 'Custom URLs', desc: 'Claim your personalized slug like phygital.app/card/yourname for easy sharing.' },
  { icon: <Zap size={22} />, title: 'Live Preview', desc: 'See your card update in real-time as you build it — no guesswork required.' },
  { icon: <BarChart3 size={22} />, title: 'Analytics Dashboard', desc: 'Track views, QR scans, link clicks, and contact saves with detailed insights.' },
  { icon: <CreditCard size={22} />, title: 'Printable Cards', desc: 'Export high-resolution 300 DPI PNG cards ready to send to any print shop.' },
];

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['1 digital card', 'QR code generation', 'Public card URL', 'Basic analytics', 'vCard download'],
    cta: 'Get Started',
    variant: 'secondary',
  },
  {
    name: 'Pro',
    price: '₹299',
    period: 'per month',
    highlight: true,
    features: ['Unlimited cards', 'Custom slug URLs', 'Advanced analytics', 'Image gallery', 'Video sections', 'Printable cards', 'Priority support'],
    cta: 'Start Free Trial',
    variant: 'primary',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-primary-400 mb-8 border border-primary-500/20"
          >
            <Sparkles size={14} />
            Digital + Physical. One card.
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Your identity,{' '}
            <span className="gradient-text">everywhere</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create stunning digital business cards with QR codes. Share your professional profile
            via link, QR, or high-quality printable cards — all in minutes.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="xl" iconRight={<ArrowRight size={18} />} onClick={() => navigate('/register')}>
              Create Your Card Free
            </Button>
            <Button size="xl" variant="secondary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </motion.div>

          {/* Demo card mockup */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-20 relative max-w-sm mx-auto"
          >
            <div className="glass-card border border-primary-500/20 shadow-glow text-left">
              <div className="relative h-24 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden bg-gradient-brand opacity-60" />
              <div className="flex items-end gap-4 -mt-12 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-brand border-2 border-surface flex items-center justify-center text-2xl font-bold text-white shadow-glow">
                  J
                </div>
                <div>
                  <h3 className="text-white font-semibold">John Doe</h3>
                  <p className="text-white/50 text-sm">Product Designer @ Acme</p>
                </div>
              </div>
              <p className="text-white/40 text-sm mb-4">Crafting digital experiences that matter. Based in Mumbai.</p>
              <div className="flex gap-2">
                <span className="glass px-3 py-1.5 rounded-lg text-xs text-primary-400">📞 Call</span>
                <span className="glass px-3 py-1.5 rounded-lg text-xs text-green-400">💬 WhatsApp</span>
                <span className="glass px-3 py-1.5 rounded-lg text-xs text-blue-400">✉️ Email</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="gradient-text">stand out</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Build, customize, and share professional cards that leave a lasting impression.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="glass-card border border-white/5 hover:border-primary-500/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 mb-4 group-hover:bg-primary-500/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Simple, honest pricing</h2>
            <p className="text-white/50 text-lg">No hidden fees. Start free, upgrade when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.15}
                className={`glass-card border relative ${
                  plan.highlight
                    ? 'border-primary-500/40 shadow-glow'
                    : 'border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-brand text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/40 text-sm">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <Check size={14} className="text-primary-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={plan.variant}
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card border border-primary-500/20 shadow-glow"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to go Phygital?</h2>
            <p className="text-white/50 text-lg mb-8">
              Join thousands of professionals sharing their identity smarter.
            </p>
            <Button size="xl" iconRight={<ArrowRight size={18} />} onClick={() => navigate('/register')}>
              Create Your Card — It's Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-white/40 text-sm">Phygital © 2025</span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">Privacy</Link>
            <Link to="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
