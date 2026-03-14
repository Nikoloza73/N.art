/* ============================================
   N.art — Main Script (with EN / KA switcher)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== MOBILE MENU =====
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ===== ACTIVE NAV LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
  }

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.querySelector('img').src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }
  function closeLightbox() {
    if (lightbox) { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  }

  // ===== GALLERY FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-full-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  // ===== CONTACT FORM =====
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const lang = localStorage.getItem('nart_lang') || 'en';
      showToast(lang === 'ka'
        ? '✨ გმადლობთ! მალე დაგიკავშირდებით.'
        : '✨ Thank you! We\'ll be in touch soon.');
      form.reset();
    });
  }

  // ===== TOAST =====
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ===== SMOOTH ANCHOR SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ============================================
  //   LANGUAGE SWITCHER  (EN / KA)
  // ============================================

  const LANG_KEY = 'nart_lang';
  const savedLang = localStorage.getItem(LANG_KEY) || 'en';
  applyLanguage(savedLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      localStorage.setItem(LANG_KEY, lang);
      applyLanguage(lang);
    });
  });

  function applyLanguage(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
      const val = lang === 'ka' ? el.getAttribute('data-ka') : el.getAttribute('data-en');
      if (val === null) return;
      if (el.getAttribute('data-html') === 'true') {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    // placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
      el.placeholder = lang === 'ka'
        ? (el.getAttribute('data-placeholder-ka') || '')
        : (el.getAttribute('data-placeholder-en') || '');
    });

    // select options
    document.querySelectorAll('select[data-options-en]').forEach(sel => {
      const opts = lang === 'ka'
        ? JSON.parse(sel.getAttribute('data-options-ka'))
        : JSON.parse(sel.getAttribute('data-options-en'));
      const current = sel.value;
      sel.innerHTML = '';
      opts.forEach((opt, i) => {
        const o = document.createElement('option');
        o.value = i === 0 ? '' : opt;
        o.textContent = opt;
        sel.appendChild(o);
      });
      sel.value = current;
    });

    // switcher button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'ka' ? 'ka' : 'en';
  }

});
