import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/motion';

gsap.registerPlugin(ScrollTrigger);

export default function PixelReveal({ src, alt, className = '' }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imgRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !image || !wrap) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false });
    let frame = { t: 0 };
    let trigger;

    const draw = (progress) => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;

      const maxCell = 48;
      const minCell = 2;
      const cell = Math.max(minCell, Math.round(maxCell * (1 - progress)));

      ctx.imageSmoothingEnabled = progress > 0.92;
      try {
        ctx.clearRect(0, 0, w, h);
        if (progress >= 1) {
          ctx.drawImage(image, 0, 0, w, h);
          return;
        }

        for (let y = 0; y < h; y += cell) {
          for (let x = 0; x < w; x += cell) {
            const jitter = progress < 0.7 ? Math.floor(Math.random() * 3) : 0;
            ctx.drawImage(
              image,
              x,
              y,
              cell,
              cell,
              x + jitter,
              y,
              cell,
              cell,
            );
          }
        }
      } catch {
        canvas.style.opacity = '0';
        image.style.opacity = '1';
      }
    };

    const sizeCanvas = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      draw(frame.t);
    };

    const start = () => {
      sizeCanvas();
      if (prefersReducedMotion()) {
        frame.t = 1;
        draw(1);
        canvas.style.opacity = '0';
        image.style.opacity = '1';
        return;
      }

      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(frame, {
            t: 1,
            duration: 1.6,
            ease: 'power2.inOut',
            onUpdate: () => draw(frame.t),
            onComplete: () => {
              canvas.style.opacity = '0';
              image.style.opacity = '1';
            },
          });
        },
      });
    };

    if (image.complete) start();
    else image.addEventListener('load', start, { once: true });

    window.addEventListener('resize', sizeCanvas);

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      trigger?.kill();
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={`pixel-reveal ${className}`}>
      <img ref={imgRef} src={src} alt={alt} className="pixel-reveal__img" crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="pixel-reveal__canvas" aria-hidden="true" />
    </div>
  );
}
