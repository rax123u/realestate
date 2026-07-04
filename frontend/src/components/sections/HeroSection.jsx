import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-luxury-black pt-20"
    >
      {/* Background Visual Layer */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt="Luxury Mansion Background"
          className="w-full h-full object-cover"
        />
        {/* Dark radial fade and linear overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/80 to-luxury-black" />
        {/* Technical/SaaS Grid Overlay */}
        <div className="absolute inset-0 grid-bg opacity-40 z-10" />
      </div>

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-luxury-gold/10 blur-[120px] pointer-events-none z-0 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[150px] pointer-events-none z-0 animate-pulse duration-[12000ms]" />

      {/* Main Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 text-center px-6 max-w-5xl flex flex-col items-center mt-8"
      >
        {/* Micro-badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-6 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-ping" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-luxury-gold">
            Aurelius
          </span>
        </motion.div>

        {/* Cinematic Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-display text-luxury-cream mb-6 select-none max-w-4xl"
        >
          Discover Luxury <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-luxury-cream to-luxury-gold font-normal">Living</span>
        </motion.h1>

        {/* Sub-text */}
        <motion.p 
          variants={itemVariants}
          className="text-sm md:text-base text-luxury-silver/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed tracking-wider font-sans"
        >
          An elite marketplace for high-end architectural masterpieces. Driven by bespoke luxury intelligence and curated by master advisors worldwide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button href="#featured" className="shadow-[0_0_20px_var(--color-luxury-gold-glow)]">
            Explore Properties
          </Button>
          <Button href="#contact" variant="outline">
            Speak to Advisor
          </Button>
        </motion.div>

        {/* Floating SaaS Analytics Indicators */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl border-t border-white/5 pt-10"
        >
          {[
            { value: '$12.8B+', label: 'Volume Traded' },
            { value: '450+', label: 'Exclusive Estates' },
            { value: '99.4%', label: 'Advisor Rating' },
            { value: '24/7', label: 'Bespoke Support' },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-serif text-luxury-cream tracking-wider font-light">
                {stat.value}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver mt-1.5">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Decorative side accent lines */}
      <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden lg:block" />
      <div className="absolute right-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden lg:block" />
    </section>
  );
}