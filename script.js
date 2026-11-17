/* =========================================================
   DREAM SMILE DENTAL CLINIC — MAIN SCRIPT
   Author: Saadia's Web Studio
   Pure Vanilla JS — no libraries
   ========================================================= */

(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  const WHATSAPP_NUMBER = '923254888111';   // Pakistan format, no +, no spaces
  const DOCTOR_NAME     = 'Dr. Arfeen Kiran';
  const CLINIC_NAME     = 'Dream Smile Dental Clinic';

  /* ---------- HELPERS ---------- */
  const $  = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

  /* =========================================================
     1. AUTO YEAR IN FOOTER
     ========================================================= */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     2. MOBILE MENU TOGGLE
     ========================================================= */
  const hamburger = $('#hamburger');
  const mainNav   = $('#mainNav');

  function openMenu() {
    hamburger.classList.add('active');
    mainNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    hamburger.classList.contains('active') ? closeMenu() : openMenu();
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', toggleMenu);

    // Close on nav link click
    $$('.nav-link', mainNav).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mainNav.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) closeMenu();
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* =========================================================
     3. STICKY HEADER SHADOW ON SCROLL
     ========================================================= */
  const header = $('#siteHeader');

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* =========================================================
     4. ACTIVE NAV LINK (Scroll Spy)
     ========================================================= */
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function highlightNav() {
    const scrollPos = window.scrollY + 140;

    let currentId = '';
    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* =========================================================
     5. SMOOTH SCROLL FOR IN-PAGE ANCHORS
     ========================================================= */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 10;

      window.scrollTo({ top, behavior: 'smooth' });

      if (mainNav && mainNav.classList.contains('open')) closeMenu();
    });
  });

  /* =========================================================
     6. SCROLL REVEAL ANIMATIONS
     ========================================================= */
  const revealTargets = [
    '.service-card',
    '.why-card',
    '.testimonial-card',
    '.contact-card',
    '.about-image',
    '.about-content',
    '.appointment-form',
    '.appointment-content',
    '.doctor-image',
    '.doctor-content',
    '.section-header',
  ];

  revealTargets.forEach((sel) => {
    $$(sel).forEach((el) => el.classList.add('reveal'));
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('active');
            }, index * 60);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('active'));
  }

  /* =========================================================
     7. APPOINTMENT FORM → WHATSAPP
     ========================================================= */
  const appointmentForm = $('#appointmentForm');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = $('#name').value.trim();
      const phone   = $('#phone').value.trim();
      const service = $('#service').value;
      const date    = $('#date').value;
      const message = $('#message').value.trim();

      if (!name || !phone || !service || !date) {
        alert('Please fill in all required fields (Name, Phone, Service, Date).');
        return;
      }

      // Format date
      let formattedDate = date;
      try {
        formattedDate = new Date(date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } catch (_) { /* keep raw */ }

      // Build WhatsApp message
      const waMessage =
        `*🦷 New Appointment Request*\n\n` +
        `👨‍⚕️ *Doctor:* ${DOCTOR_NAME}\n` +
        `👤 *Patient Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🩺 *Service:* ${service}\n` +
        `📅 *Preferred Date:* ${formattedDate}\n` +
        (message ? `📝 *Message:* ${message}\n` : '') +
        `\n— Sent from ${CLINIC_NAME} website`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

      // Open WhatsApp
      window.open(waUrl, '_blank', 'noopener');

      // Button feedback
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '✅ Opening WhatsApp...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          appointmentForm.reset();
        }, 2500);
      }
    });
  }

  /* =========================================================
     8. SCROLL-TO-TOP BUTTON
     ========================================================= */
  const scrollTopBtn = $('#scrollTop');

  function toggleScrollTopBtn() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('show', window.scrollY > 500);
  }

  if (scrollTopBtn) {
    window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleScrollTopBtn();
  }

  /* =========================================================
     9. DATE INPUT — MIN = TODAY
     ========================================================= */
  const dateInput = $('#date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* =========================================================
     10. PHONE INPUT SANITIZATION
     ========================================================= */
  const phoneInput = $('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^\d+\-\s()]/g, '');
    });
  }

  /* =========================================================
     11. CONSOLE BRANDING
     ========================================================= */
  console.log(
    '%c🦷 Dream Smile Dental Clinic — Dr. Arfeen Kiran',
    'background:linear-gradient(135deg,#0a2540,#14b8a6);color:#fff;padding:8px 16px;border-radius:50px;font-weight:bold;font-size:14px;'
  );
  console.log(
    "%cWebsite by Saadia's Web Studio",
    'color:#64748b;font-size:12px;'
  );

})();