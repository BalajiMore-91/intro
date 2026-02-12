/**
 * Portfolio - Modular JavaScript
 * Theme toggle, scroll reveal, typed tagline, nav, form, parallax
 */

(function () {
  'use strict';

  // --- Theme Toggle ---
  const THEME_KEY = 'portfolio-theme';
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    setTheme(getPreferredTheme());
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  initTheme();

  // --- Mobile Nav Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navToggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Scroll Reveal ---
  const revealSelector = '.reveal';
  const revealOffset = 80;
  const revealThreshold = 0.1;

  function revealOnScroll() {
    const elements = document.querySelectorAll(revealSelector);
    const windowHeight = window.innerHeight;

    elements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < windowHeight - revealOffset && rect.bottom > 0;
      if (inView) el.classList.add('revealed');
    });
  }

  function throttle(fn, delay) {
    let last = 0;
    return function () {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn();
      }
    };
  }

  window.addEventListener('scroll', throttle(revealOnScroll, 100), { passive: true });
  window.addEventListener('resize', throttle(revealOnScroll, 100));
  revealOnScroll();

  // --- Section Entrance Animation ---
  const sectionNodes = document.querySelectorAll('main .section');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && sectionNodes.length) {
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
      });

      sectionNodes.forEach(function (section, index) {
        if (section.id === 'hero') return;
        section.classList.add('section-entrance');
        section.style.setProperty('--section-delay', Math.min(index * 45, 180) + 'ms');
        sectionObserver.observe(section);
      });
    } else {
      // Fallback: show sections immediately if observer is unavailable
      sectionNodes.forEach(function (section) {
        if (section.id === 'hero') return;
        section.classList.add('section-visible');
      });
    }
  }

  // --- Typed Tagline ---
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    let dataStrings = [];
    try {
      dataStrings = JSON.parse(typedEl.getAttribute('data-strings') || '[]');
    } catch (e) {
      dataStrings = ['Software Engineer'];
    }

    if (dataStrings.length) {
      let index = 0;
      let charIndex = 0;
      let isDeleting = false;
      const typeSpeed = 80;
      const deleteSpeed = 50;
      const pauseEnd = 2000;
      const pauseStart = 800;

      function type() {
        const current = dataStrings[index];
        if (isDeleting) {
          if (charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % dataStrings.length;
            setTimeout(type, pauseStart);
            return;
          }
          charIndex--;
          typedEl.textContent = current.substring(0, charIndex);
          setTimeout(type, deleteSpeed);
        } else {
          typedEl.textContent = current.substring(0, charIndex + 1);
          charIndex++;
          if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(type, pauseEnd);
          } else {
            setTimeout(type, typeSpeed);
          }
        }
      }

      setTimeout(type, 500);
    }
  }

  // Parallax: handled by CSS gradient-orb animation for performance

  // --- Contact Form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      if (!email || !message) return;
      if (!email.value.trim() || !message.value.trim()) {
        email.setCustomValidity('Please fill in email and message.');
        contactForm.reportValidity();
        return;
      }
      email.setCustomValidity('');
      // In production: send to backend or mailto
      const mailto = 'mailto:balajimore9193@gmail.com?subject=Portfolio%20Contact&body=' +
        encodeURIComponent('From: ' + email.value + '\n\n' + message.value);
      window.location.href = mailto;
      contactForm.reset();
    });
  }

  // --- Footer Year ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Lazy loading for images below the fold (optional) ---
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      img.src = img.getAttribute('data-src') || img.src;
    });
  }
})();
