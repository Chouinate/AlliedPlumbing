/* Allied Plumbing & Heating — Main Script */

// ── Sticky header shadow on scroll ──────────────────────────────────────────
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile nav toggle ────────────────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navList   = document.getElementById('nav-list');

navToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);

  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav when a link is clicked
navList.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Active nav link on scroll ────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'nav__link--active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => observer.observe(section));

// ── Scroll-reveal animation ──────────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.service-card, .why-card, .testimonial-card, .about__image-wrap, .about__content'
);

const revealObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting);
  if (!visible.length) return;

  // Group by column (x position) so top-left & bottom-left share the same delay
  const colMap = new Map();
  visible.forEach(entry => {
    const x = Math.round(entry.target.getBoundingClientRect().left / 50) * 50;
    if (!colMap.has(x)) colMap.set(x, []);
    colMap.get(x).push(entry);
  });

  const cols = [...colMap.keys()].sort((a, b) => a - b);
  cols.forEach((x, i) => {
    colMap.get(x).forEach(entry => {
      entry.target.style.transitionDelay = `${i * 0.08}s`;
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    });
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .revealed { opacity: 1 !important; transform: none !important; }
    </style>
  `);
});

// ── Contact form ─────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const fields = contactForm.querySelectorAll('[required]');
  let valid = true;

  fields.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#ef4444';
      valid = false;
    }
  });

  if (!valid) return;

  // Simulate submission (replace with real endpoint/fetch call)
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    formSuccess.hidden = false;
    contactForm.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message →';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1000);
});

// ── Service cards → pre-select contact form dropdown ────────────────────────
document.querySelectorAll('.service-card[data-service]').forEach(card => {
  const activate = () => {
    const service = card.dataset.service;
    const select  = document.getElementById('service');
    const contact = document.getElementById('contact');
    if (select) select.value = service;
    const offset = 68;
    const top = contact.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  card.addEventListener('click', activate);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
});

// ── Footer service links → pre-select contact form dropdown ─────────────────
document.querySelectorAll('.footer__service-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const service = link.dataset.service;
    const select  = document.getElementById('service');
    const contact = document.getElementById('contact');
    if (select) select.value = service;
    const offset = 68;
    const top = contact.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Smooth anchor scroll (fallback for older browsers) ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 68; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
