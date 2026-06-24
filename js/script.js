/* ============================================
   ACTUDENT LANDING PAGE — INTERACTIVITY
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initTabSwitcher();
  initPricingToggle();
  initFaqAccordion();
  initScrollAnimations();
  initCounterAnimation();
  initSmdbAnimation();
});

/* ---------- Sticky Navbar ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu?.querySelectorAll('.navbar__link');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileLinks?.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ---------- Smooth Scroll for Anchor Links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ---------- Tab Switcher (Solutions Section) ---------- */
function initTabSwitcher() {
  const tabs = document.querySelectorAll('.solutions__tab');
  const panels = document.querySelectorAll('.solutions__panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === target) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/* ---------- Pricing Hosting Toggle ---------- */
function initPricingToggle() {
  const toggleBtns = document.querySelectorAll('.pricing__toggle-btn');
  const panels = document.querySelectorAll('.pricing__panel');
  const indicator = document.querySelector('.pricing__toggle-indicator');

  if (!toggleBtns.length || !panels.length) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hosting = btn.dataset.hosting;

      // Update active button
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Move indicator
      if (indicator) {
        if (hosting === 'cloud') {
          indicator.style.transform = 'translateX(100%)';
        } else {
          indicator.style.transform = 'translateX(0)';
        }
      }

      // Switch panels
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `pricing-panel-${hosting}`) {
          panel.classList.add('active');
        }
      });

      // Re-initialize Lucide icons for the newly visible panel
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  });
}

/* ---------- FAQ Accordion ---------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ---------- Scroll-Triggered Reveal Animations ---------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Counter Animation ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');

  if (!counters.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const startTime = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const currentValue = Math.round(target * easedProgress);

    el.textContent = prefix + currentValue.toLocaleString('id-ID') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ---------- SMDB Live Simulation Animation ---------- */
function initSmdbAnimation() {
  const svg = document.getElementById('smdb-svg');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  let animationRunning = false;
  let animFrameId = null;
  const dots = [];

  // Lines config: pathId, color, duration (ms), delay offset, isBroken
  const lineConfigs = [
    { pathId: 'line-nilai',  color: '#4F6EF7', duration: 2800, delay: 0,    broken: false },
    { pathId: 'line-perpus', color: '#4F6EF7', duration: 2400, delay: 600,  broken: false },
    { pathId: 'line-hadir',  color: '#4F6EF7', duration: 2200, delay: 1200, broken: false },
    { pathId: 'line-bus',    color: '#4F6EF7', duration: 2600, delay: 1800, broken: false },
    { pathId: 'line-lab',    color: '#F59E0B', duration: 3000, delay: 2400, broken: true  },
    { pathId: 'line-guru',   color: '#4F6EF7', duration: 2500, delay: 3000, broken: false },
    { pathId: 'line-parent', color: '#00B894', duration: 1800, delay: 500,  broken: false },
  ];

  // Create dot elements for each line
  lineConfigs.forEach(config => {
    const path = document.getElementById(config.pathId);
    if (!path) return;

    const pathLength = path.getTotalLength();

    // Glow circle
    const glow = document.createElementNS(NS, 'circle');
    glow.setAttribute('r', '12');
    glow.setAttribute('fill', config.color);
    glow.setAttribute('opacity', '0');
    glow.style.filter = 'blur(4px)';
    svg.appendChild(glow);

    // Main dot
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('r', config.pathId === 'line-parent' ? '4' : '5');
    dot.setAttribute('fill', config.color);
    dot.setAttribute('opacity', '0');
    svg.appendChild(dot);

    dots.push({
      dot,
      glow,
      path,
      pathLength,
      color: config.color,
      duration: config.duration,
      delay: config.delay,
      broken: config.broken,
      startTime: null,
      active: false,
    });
  });

  function animateDots(timestamp) {
    if (!animationRunning) return;

    dots.forEach(d => {
      if (!d.startTime) {
        d.startTime = timestamp + d.delay;
      }

      const elapsed = timestamp - d.startTime;
      if (elapsed < 0) return; // Still in delay

      // Each dot loops with a gap between cycles
      const cycleTime = d.duration + 800; // 800ms gap between cycles
      const cycleElapsed = elapsed % cycleTime;

      if (cycleElapsed > d.duration) {
        // In the gap — hide dot
        d.dot.setAttribute('opacity', '0');
        d.glow.setAttribute('opacity', '0');
        return;
      }

      let progress = cycleElapsed / d.duration;

      // For broken link: dot travels 60% then fades
      if (d.broken) {
        if (progress > 0.6) {
          const fadeProgress = (progress - 0.6) / 0.4;
          d.dot.setAttribute('opacity', String(Math.max(0, 1 - fadeProgress * 2)));
          d.glow.setAttribute('opacity', String(Math.max(0, 0.15 - fadeProgress * 0.3)));
          progress = 0.6 + (progress - 0.6) * 0.3; // slow down at end
        } else {
          // Fade in at start
          const fadeIn = Math.min(1, progress * 5);
          d.dot.setAttribute('opacity', String(fadeIn));
          d.glow.setAttribute('opacity', String(fadeIn * 0.15));
        }
      } else {
        // Normal: fade in at start, fade out at end
        let opacity = 1;
        if (progress < 0.1) opacity = progress / 0.1;
        else if (progress > 0.85) opacity = (1 - progress) / 0.15;
        d.dot.setAttribute('opacity', String(Math.max(0, opacity)));
        d.glow.setAttribute('opacity', String(Math.max(0, opacity * 0.15)));
      }

      // Ease function for smooth movement
      const eased = easeInOutCubic(Math.min(progress, 1));
      const point = d.path.getPointAtLength(eased * d.pathLength);

      d.dot.setAttribute('cx', point.x);
      d.dot.setAttribute('cy', point.y);
      d.glow.setAttribute('cx', point.x);
      d.glow.setAttribute('cy', point.y);
    });

    animFrameId = requestAnimationFrame(animateDots);
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function startAnimation() {
    if (animationRunning) return;
    animationRunning = true;
    dots.forEach(d => d.startTime = null);
    animFrameId = requestAnimationFrame(animateDots);
  }

  function stopAnimation() {
    animationRunning = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    dots.forEach(d => {
      d.dot.setAttribute('opacity', '0');
      d.glow.setAttribute('opacity', '0');
    });
  }

  // Use IntersectionObserver to only animate when visible
  const smdbVisual = document.getElementById('smdb-visual');
  if (smdbVisual) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(smdbVisual);
  }
}
