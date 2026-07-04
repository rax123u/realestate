import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-luxury-solid',
  outline: 'btn-luxury',
  ghost: 'text-luxury-cream hover:text-luxury-gold tracking-[0.2em] uppercase font-semibold text-[11px]',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  href,
}) {
  const base =
    'inline-flex items-center justify-center px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] rounded transition-all duration-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    if (href.startsWith('#')) {
      return (
        <motion.a
          href={href}
          className={classes}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.a>
      );
    }
    // External or React Router handling can be regular link
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  );
}
