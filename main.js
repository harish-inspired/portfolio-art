/* ============================================================
   MCA ARTIST — JavaScript
   Handles: Nav scroll, mobile menu, gallery filter,
            form submit, scroll animations, file upload UI
============================================================ */

(function () {
  'use strict';

  // ─── DOM REFS ───────────────────────────────────────────
  const header      = document.getElementById('site-header');
  const navToggle   = document.getElementById('nav-toggle');
  const mainNav     = document.getElementById('main-nav');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const form        = document.getElementById('commission-form');
  const formSuccess = document.getElementById('form-success');
  const fileInput   = document.getElementById('reference-photo');
  const fileLabel   = document.querySelector('.file-label');
  const fileArea    = document.getElementById('file-upload-area');
  const navLinks    = document.querySelectorAll('.main-nav a');
  const sections    = document.querySelectorAll('section[id]');

  // ─── STICKY HEADER ───────────────────────────────────────
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────
  function updateActiveNav() {
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentSection = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // ─── MOBILE NAV TOGGLE ──────────────────────────────────
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (
      mainNav.classList.contains('open') &&
      !mainNav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ─── GALLERY FILTER ──────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach((item, i) => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.transitionDelay = `${i * 60}ms`;
        } else {
          item.classList.add('hidden');
          item.style.transitionDelay = '0ms';
        }
      });
    });
  });

  // ─── FILE UPLOAD UI ──────────────────────────────────────
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        fileLabel.textContent = fileInput.files[0].name;
        fileArea.querySelector('.file-upload-inner').style.borderStyle = 'solid';
        fileArea.querySelector('.file-upload-inner').style.borderColor = 'rgba(176,141,87,0.5)';
      }
    });

    // Drag & drop styling
    const uploadInner = fileArea.querySelector('.file-upload-inner');

    fileArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadInner.style.borderColor = 'var(--gold)';
      uploadInner.style.background = 'rgba(176,141,87,0.06)';
    });

    fileArea.addEventListener('dragleave', () => {
      uploadInner.style.borderColor = '';
      uploadInner.style.background = '';
    });

    fileArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadInner.style.borderColor = 'rgba(176,141,87,0.5)';
      uploadInner.style.borderStyle = 'solid';
      if (e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        fileLabel.textContent = e.dataTransfer.files[0].name;
      }
    });
  }

  // ─── COMMISSION FORM SUBMIT via FormSubmit.co ────────────
  // No account needed! The form action in index.html points to:
  // https://formsubmit.co/hariabi689@gmail.com
  // FormSubmit emails ALL fields + the uploaded photo directly to you.

  // ── Show success panel if redirected back with ?submitted=true ──
  if (new URLSearchParams(window.location.search).get('submitted') === 'true') {
    if (form) form.style.display = 'none';
    if (formSuccess) {
      formSuccess.style.display = 'flex';
      formSuccess.style.animation = 'fadeUp 0.5s ease both';
      // Scroll to the commission section
      setTimeout(() => {
        document.getElementById('commission').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      // Run validation first — stop submit if any required field is empty
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'rgba(220,60,60,0.6)';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) {
        e.preventDefault(); // Block submit only if invalid
        const btn = document.getElementById('form-submit-btn');
        btn.style.animation = 'shake 0.4s ease';
        btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
        return;
      }

      // ✅ Valid — update button and let the form submit naturally to FormSubmit.co
      const btn = document.getElementById('form-submit-btn');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Form submits to FormSubmit.co → emails you → redirects back with ?submitted=true
    });
  }

  // ─── SHAKE KEYFRAME (injected) ────────────────────────────
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ─── SCROLL REVEAL ───────────────────────────────────────
  function addRevealClasses() {
    // Services cards
    document.querySelectorAll('.service-card').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${i + 1}`);
    });

    // About content
    document.querySelectorAll('.about-content > *').forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 3) el.classList.add(`reveal-delay-${i + 1}`);
    });

    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
      el.classList.add('reveal');
    });

    // Process steps
    document.querySelectorAll('.process-step').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${Math.min(i + 1, 3)}`);
    });

    // Pricing cards
    document.querySelectorAll('.pricing-card').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${i + 1}`);
    });

    // Gallery items
    document.querySelectorAll('.gallery-item').forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 3) el.classList.add(`reveal-delay-${i + 1}`);
    });

    // Stats
    document.querySelectorAll('.stat').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${i + 1}`);
    });
  }

  function observeReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ─── SMOOTH ANCHOR SCROLLING ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── GALLERY: image load handling + lightbox modal ─────────
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryImgs = Array.from(document.querySelectorAll('#gallery-grid .gallery-img-wrap img'));

  // mark images as loaded for fade-in
  galleryImgs.forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));
    // ensure images decode async when supported
    try { if (img.decode) img.decode().catch(() => {}); } catch (e) {}
  });

  const modal = document.getElementById('gallery-modal');
  const gmImage = document.getElementById('gm-image');
  const gmCaption = document.getElementById('gm-caption');
  const btnClose = modal.querySelector('.gm-close');
  const btnPrev = modal.querySelector('.gm-prev');
  const btnNext = modal.querySelector('.gm-next');

  let currentIndex = 0;

  function showIndex(i) {
    currentIndex = (i + galleryImgs.length) % galleryImgs.length;
    const src = galleryImgs[currentIndex].getAttribute('src');
    const alt = galleryImgs[currentIndex].getAttribute('alt') || '';
    gmImage.style.opacity = 0;
    gmImage.src = src;
    gmImage.alt = alt;
    gmCaption.textContent = alt;
    // small zoom-in effect
    setTimeout(() => { gmImage.style.opacity = 1; }, 40);
  }

  function openModal(i) {
    showIndex(i);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus for accessibility
    btnClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    gmImage.src = '';
  }

  // attach click to each gallery item to open modal
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      // ignore clicks on inner anchor links
      if (e.target.closest('a')) return;
      openModal(i);
    });
  });

  // modal controls
  btnClose.addEventListener('click', closeModal);
  btnPrev.addEventListener('click', () => showIndex(currentIndex - 1));
  btnNext.addEventListener('click', () => showIndex(currentIndex + 1));

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
  });

  // click outside image closes
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // touch / swipe support (simple)
  let touchStartX = 0;
  let touchEndX = 0;
  gmImage.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  gmImage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) showIndex(currentIndex - 1);
      else showIndex(currentIndex + 1);
    }
  }, { passive: true });


  // ─── STAT COUNTER ANIMATION ──────────────────────────────
  function animateCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(el => {
      const target = parseInt(el.textContent.replace(/\D/g, ''));
      const suffix = el.textContent.replace(/[\d]/g, '');
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const tick = () => {
              current = Math.min(current + step, target);
              el.textContent = Math.floor(current) + suffix;
              if (current < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      counterObserver.observe(el);
    });
  }

  // ─── PARALLAX HERO ───────────────────────────────────────
  const heroImg = document.querySelector('.hero-image');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.2}px)`;
      }
    }, { passive: true });
  }

  // ─── INIT ────────────────────────────────────────────────
  addRevealClasses();
  observeReveal();
  animateCounters();

})();
