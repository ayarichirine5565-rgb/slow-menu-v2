// ===========================================================
// SLOW — Menu digital — interactions
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 350);
  });
  // fallback in case load event already fired / is slow
  setTimeout(() => loader.classList.add('hide'), 1800);

  /* ---------- Mobile category nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const catNav = document.getElementById('catNav');
  navToggle.addEventListener('click', () => {
    const isOpen = catNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // close mobile nav after choosing a category
  catNav.querySelectorAll('.cat-link').forEach(link => {
    link.addEventListener('click', () => {
      catNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Active category highlighting on scroll ---------- */
  const categories = document.querySelectorAll('.category');
  const links = document.querySelectorAll('.cat-link');

  const linkById = {};
  links.forEach(l => { linkById[l.getAttribute('href').slice(1)] = l; });

  const catObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = linkById[id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        // keep active pill in view within the scrollable nav
        link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  categories.forEach(cat => { if (cat.id) catObserver.observe(cat); });

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-count');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => statObserver.observe(el));

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
