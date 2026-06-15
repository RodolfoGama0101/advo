/* ============================================
   ADVO Landing Page — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initFaqAccordion();
  initSmoothScroll();
  initCounterAnimation();
  initMockupBars();
});


/* ================================================
   NAVBAR
   ================================================ */

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navbar-toggle');
  const menu = document.getElementById('navbar-menu');
  const links = menu.querySelectorAll('.navbar__link');

  // Scroll effect
  let lastScroll = 0;
  const onScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Check initial state

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('navbar__menu--open');
    toggle.classList.toggle('navbar__toggle--active');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('navbar__menu--open');
      toggle.classList.remove('navbar__toggle--active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}


/* ================================================
   SCROLL REVEAL (Intersection Observer)
   ================================================ */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ================================================
   FAQ ACCORDION
   ================================================ */

function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq__question');

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all others
      questions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          const otherAnswer = q.nextElementSibling;
          otherAnswer.style.maxHeight = '0';
          otherAnswer.classList.remove('faq__answer--open');
        }
      });

      // Toggle current
      if (isOpen) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        answer.classList.remove('faq__answer--open');
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.classList.add('faq__answer--open');
      }
    });
  });
}


/* ================================================
   SMOOTH SCROLL
   ================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}


/* ================================================
   COUNTER ANIMATION
   ================================================ */

function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'), 10);
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    element.textContent = prefix + current.toLocaleString('pt-BR') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/* ================================================
   MOCKUP CHART BARS (randomized heights)
   ================================================ */

function initMockupBars() {
  const bars = document.querySelectorAll('.dashboard-mockup__bar');
  const heights = [65, 40, 80, 55, 90, 35, 70, 50, 85, 45, 75, 60];

  bars.forEach((bar, i) => {
    bar.style.height = (heights[i % heights.length]) + '%';
  });
}
