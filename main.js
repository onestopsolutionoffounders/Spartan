/* ============================================
   SPARTAN CALISTHENICS PARK — main.js
   ============================================ */

/* ---- 1. AOS INIT ---- */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});


/* ---- 2. PARTICLE CANVAS ---- */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(0.8, 2.2),
      dx: randomBetween(-0.3, 0.3),
      dy: randomBetween(-0.5, -0.1),
      alpha: randomBetween(0.2, 0.7),
      color: Math.random() > 0.7 ? '#C8A84B' : '#E63329',
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      // Wrap around edges
      if (p.y < -4)  p.y = H + 4;
      if (p.x < -4)  p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ---- 3. NAVBAR SCROLL BEHAVIOUR ---- */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ---- 4. HAMBURGER MOBILE MENU ---- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
})();


/* ---- 5. HERO GLITCH TEXT ---- */
(function () {
  const el = document.querySelector('[data-glitch]');
  if (!el) return;

  setInterval(() => {
    el.classList.add('glitching');
    setTimeout(() => el.classList.remove('glitching'), 300);
  }, 3500);
})();


/* ---- 6. SHIELD SVG DRAW ANIMATION ---- */
(function () {
  const outline = document.querySelector('.shield-outline');
  if (!outline) return;

  // Animate stroke-dashoffset from 600 → 0 once hero is visible
  setTimeout(() => {
    outline.style.transition = 'stroke-dashoffset 1.8s ease forwards';
    outline.style.strokeDashoffset = '0';
  }, 400);
})();


/* ---- 7. COUNTER ANIMATION ---- */
(function () {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach((el) => observer.observe(el));
})();


/* ---- 8. HERO LINE STAGGER ANIMATION ---- */
(function () {
  const lines = document.querySelectorAll('.hero-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(40px)';
    line.style.transition = `opacity 0.7s ease ${0.15 + i * 0.15}s, transform 0.7s ease ${0.15 + i * 0.15}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });
    });
  });

  // Fade in hero sub-elements
  ['.hero-eyebrow', '.hero-sub', '.hero-badges', '.hero-cta-row'].forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${0.6 + i * 0.12}s, transform 0.6s ease ${0.6 + i * 0.12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
})();


/* ---- 9. PROGRAM CARD TILT / HOVER EFFECT ---- */
(function () {
  const cards = document.querySelectorAll('.program-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 6;
      const rotateX = -((y - cy) / cy) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ---- 10. BACK TO TOP BUTTON ---- */
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ---- 11. SMOOTH SCROLL for anchor links (fallback) ---- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ---- 12. ACTIVE NAV LINK HIGHLIGHT (scroll spy) ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navItems.length) return;

  const navH = document.getElementById('navbar')?.offsetHeight || 70;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - navH - 20) {
        current = sec.id;
      }
    });
    navItems.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
})();


/* ---- 13. LAUNCH BANNER PULSE ---- */
(function () {
  const pulse = document.querySelector('.launch-pulse');
  if (!pulse) return;
  // CSS handles the animation; we just make sure it's running.
  // Extra JS: add a glow flicker every few seconds
  setInterval(() => {
    pulse.style.transform = 'scale(1.3)';
    setTimeout(() => { pulse.style.transform = ''; }, 300);
  }, 4000);
})();


/* ---- 14. ABOUT CARD STACK HOVER ---- */
(function () {
  const stack = document.querySelector('.about-card-stack');
  if (!stack) return;

  stack.addEventListener('mouseenter', () => {
    stack.querySelectorAll('.about-card').forEach((c, i) => {
      c.style.transition = `transform 0.4s ease ${i * 0.06}s`;
    });
  });
})();
