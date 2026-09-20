import { optimizedUnsplash } from '../../lib/images';

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width = 1200,
  sizes,
  eager = false,
  ...props
}) {
  const img = optimizedUnsplash(src, { width });

  return (
    <img
      src={img.src}
      srcSet={img.srcSet || undefined}
      sizes={sizes || img.sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      {...props}
    />
  );
}
