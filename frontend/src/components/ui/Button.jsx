import { Link } from 'react-router-dom';

const variants = {
  primary: 'btn-luxury-solid',
  outline: 'btn-luxury',
  ghost: 'btn-ghost',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  href,
  to,
}) {
  const classes = `btn-base ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
