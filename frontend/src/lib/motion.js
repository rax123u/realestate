import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function killTriggers(scope) {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (!scope || scope.contains(trigger.trigger) || trigger.trigger === scope) {
      trigger.kill();
    }
  });
}

export function fadeUp(targets, options = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return () => {};

  gsap.set(els, { clearProps: 'opacity,transform' });

  if (prefersReducedMotion()) {
    return () => {};
  }

  const tween = gsap.from(els, {
    autoAlpha: 0,
    y: 20,
    duration: 0.75,
    ease: 'power3.out',
    stagger: options.stagger ?? 0.08,
    immediateRender: false,
    force3D: false,
    clearProps: 'transform,opacity,visibility',
    scrollTrigger: {
      trigger: options.trigger || els[0],
      start: options.start || 'top 90%',
      once: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(els, { clearProps: 'opacity,transform,visibility' });
  };
}

export function imageClipReveal(targets, options = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;

  if (prefersReducedMotion()) {
    gsap.set(els, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
    return;
  }

  els.forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(12% 12% 12% 12%)', scale: 1.08 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        duration: 1.35,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: options.trigger || el,
          start: 'top 82%',
          once: true,
        },
      },
    );
  });
}

export function parallax(el, amount = 40) {
  if (!el || prefersReducedMotion()) return;

  gsap.to(el, {
    y: amount,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
    },
  });
}

export function horizontalMarquee(track, options = {}) {
  if (!track || prefersReducedMotion()) return;

  const distance = track.scrollWidth / 2;
  gsap.to(track, {
    x: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger || track.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
    },
  });
}

export function pinHorizontalType(section, track) {
  if (!section || !track) return () => {};

  let ctx;
  let disposed = false;

  const teardown = () => {
    ctx?.revert();
    ctx = null;
    section.classList.remove('marquee-section--run');
    gsap.set(track, { clearProps: 'transform' });
  };

  const create = () => {
    if (disposed) return;
    teardown();

    if (prefersReducedMotion()) return;

    if (window.innerWidth < 900) {
      section.classList.add('marquee-section--run');
      return;
    }

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          id: 'horizontal-type',
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 0.9, distance())}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });
    }, section);
  };

  const boot = async () => {
    try {
      if (document.fonts?.ready) await document.fonts.ready;
    } catch {
      /* use current metrics */
    }
    if (disposed) return;
    create();
    ScrollTrigger.refresh();
  };

  boot();

  let resizeTimer;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      create();
      ScrollTrigger.refresh();
    }, 160);
  };
  window.addEventListener('resize', onResize);

  return () => {
    disposed = true;
    window.removeEventListener('resize', onResize);
    window.clearTimeout(resizeTimer);
    teardown();
  };
}
