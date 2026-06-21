/* ============================================================
   CAROL'S RESTAURANT — GSAP-Powered Interactions v2
   Skills: Luxury Frontend + Kaopu + GSAP Animation
   Tier: L2 (Scroll Reveal + Parallax + Nav State + Stagger)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────────
  // 0. Register GSAP Plugins
  // ──────────────────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ──────────────────────────────────────────────
  // 1. Mobile Navigation
  // ──────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  const navOverlay = document.getElementById('nav-overlay');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => closeNav());
    }

    mainNav.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => closeNav());
    });

    function closeNav() {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ──────────────────────────────────────────────
  // 2. L2 Header — Scroll-Aware State Change
  // ──────────────────────────────────────────────
  const header = document.getElementById('site-header');

  if (header) {
    const updateHeader = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Init state
  }

  // ──────────────────────────────────────────────
  // 3. Active Nav Link
  // ──────────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ──────────────────────────────────────────────
  // 4. Spotlight Card Hover (mouse-tracking glow)
  // ──────────────────────────────────────────────
  const spotlightCards = document.querySelectorAll('.info-card');

  if (window.matchMedia('(hover: hover)').matches) {
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  // ──────────────────────────────────────────────
  // 5. Contact Form Handler
  // ──────────────────────────────────────────────
  window.handleFormSubmit = function(event) {
    event.preventDefault();
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');

    if (form && successMsg) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'SENDING...';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      }

      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          gsap.to(form, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              form.style.display = 'none';
              successMsg.style.display = 'block';
              gsap.from(successMsg, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
            }
          });
        } else {
          form.style.display = 'none';
          successMsg.style.display = 'block';
        }
      }, 800);
    }
  };

  // ──────────────────────────────────────────────
  // GSAP ANIMATIONS (only if GSAP is loaded)
  // ──────────────────────────────────────────────
  if (typeof gsap === 'undefined' || prefersReducedMotion) {
    // Fallback: just show everything
    document.querySelectorAll('.gs-reveal, .gs-reveal-left, .gs-reveal-right, .gs-reveal-scale').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // ──────────────────────────────────────────────
  // 6. WOW #1 — Hero Entrance Timeline
  // ──────────────────────────────────────────────
  const heroContent = document.querySelector('.hero-content');
  const heroMotif = document.querySelector('.hero-motif');
  const heroH1 = document.querySelector('.hero h1');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroCtas = document.querySelector('.hero-cta-group');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (heroContent) {
    const heroTl = gsap.timeline({ delay: 0.3 });

    if (heroMotif) {
      heroTl.from(heroMotif, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out'
      });
    }

    if (heroH1) {
      heroTl.from(heroH1, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.4');
    }

    if (heroTagline) {
      heroTl.from(heroTagline, {
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.5');
    }

    if (heroCtas) {
      heroTl.from(heroCtas, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3');
    }

    if (scrollIndicator) {
      heroTl.from(scrollIndicator, {
        opacity: 0,
        duration: 1,
        ease: 'power1.out'
      }, '-=0.2');
    }
  }

  // ──────────────────────────────────────────────
  // 7. Hero Parallax (subtle bg shift on scroll)
  // ──────────────────────────────────────────────
  const heroBgImg = document.querySelector('.hero-bg img');
  if (heroBgImg) {
    gsap.to(heroBgImg, {
      y: '15%',
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }

  // ──────────────────────────────────────────────
  // 8. ScrollTrigger Reveal — gs-reveal elements
  // ──────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.gs-reveal');
  revealElements.forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      delay: (i % 4) * 0.1, // stagger within visible groups
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // gs-reveal-left
  document.querySelectorAll('.gs-reveal-left').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // gs-reveal-right
  document.querySelectorAll('.gs-reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // gs-reveal-scale
  document.querySelectorAll('.gs-reveal-scale').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // ──────────────────────────────────────────────
  // 9. Staggered Grid Reveals (info cards, gallery, promo)
  // ──────────────────────────────────────────────
  const staggerGroups = [
    '.info-cards-grid .info-card',
    '.food-gallery-grid .food-gallery-item',
    '.promo-grid .promo-card',
    '.values-grid .value-card'
  ];

  staggerGroups.forEach(selector => {
    const items = document.querySelectorAll(selector);
    if (items.length > 0) {
      gsap.from(items, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  // ──────────────────────────────────────────────
  // 10. Dish Spotlight Parallax Reveals
  // ──────────────────────────────────────────────
  document.querySelectorAll('.dish-spotlight').forEach((spotlight, i) => {
    const img = spotlight.querySelector('.dish-spotlight-img');
    const text = spotlight.querySelector('.dish-spotlight-text');

    if (img) {
      gsap.from(img, {
        opacity: 0,
        x: i % 2 === 0 ? -50 : 50,
        duration: 1,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        scrollTrigger: {
          trigger: spotlight,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    if (text) {
      gsap.from(text, {
        opacity: 0,
        x: i % 2 === 0 ? 50 : -50,
        duration: 1,
        delay: 0.15,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        scrollTrigger: {
          trigger: spotlight,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  // ──────────────────────────────────────────────
  // 11. Section Header Reveals
  // ──────────────────────────────────────────────
  document.querySelectorAll('.section-header').forEach(header => {
    const eyebrow = header.querySelector('.eyebrow');
    const h2 = header.querySelector('h2');
    const line = header.querySelector('.accent-line');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 15, duration: 0.6, ease: 'power2.out' });
    if (h2) tl.from(h2, { opacity: 0, y: 25, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    if (line) tl.from(line, { scaleX: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
  });

  // ──────────────────────────────────────────────
  // 12. Menu Page — Menu Image Reveal
  // ──────────────────────────────────────────────
  const menuImg = document.querySelector('.menu-image-section img');
  if (menuImg) {
    gsap.from(menuImg, {
      opacity: 0,
      scale: 0.96,
      duration: 1,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      scrollTrigger: {
        trigger: menuImg,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  // ──────────────────────────────────────────────
  // 13. Page Hero Text Reveal (About, Contact, Location)
  // ──────────────────────────────────────────────
  const pageHeroContent = document.querySelector('.page-hero-content');
  if (pageHeroContent) {
    const eyebrow = pageHeroContent.querySelector('.eyebrow');
    const h1 = pageHeroContent.querySelector('h1');

    const tl = gsap.timeline({ delay: 0.3 });
    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 15, duration: 0.6, ease: 'power2.out' });
    if (h1) tl.from(h1, { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }, '-=0.3');
  }

  // Location/Menu hero
  const locationHero = document.querySelector('.location-hero, .menu-hero');
  if (locationHero && !pageHeroContent) {
    const eyebrow = locationHero.querySelector('.eyebrow');
    const h1 = locationHero.querySelector('h1');
    const p = locationHero.querySelector('p');
    const cta = locationHero.querySelector('.cta-btn');

    const tl = gsap.timeline({ delay: 0.3 });
    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 15, duration: 0.6, ease: 'power2.out' });
    if (h1) tl.from(h1, { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }, '-=0.3');
    if (p) tl.from(p, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    if (cta) tl.from(cta, { opacity: 0, y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }

  // ──────────────────────────────────────────────
  // 14. Marquee Speed Adjust on Scroll
  // ──────────────────────────────────────────────
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    ScrollTrigger.create({
      trigger: '.marquee-section',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const speed = 25 - (self.progress * 10);
        marqueeTrack.style.animationDuration = speed + 's';
      }
    });
  }

  // ──────────────────────────────────────────────
  // 15. Footer Reveal
  // ──────────────────────────────────────────────
  const footerInner = document.querySelector('.footer-inner');
  if (footerInner) {
    const cols = footerInner.children;
    gsap.from(cols, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      scrollTrigger: {
        trigger: footerInner,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }

});
