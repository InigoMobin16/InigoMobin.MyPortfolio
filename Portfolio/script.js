/* =========================================
   PORTFOLIO SCRIPT — Bold Creative Edition
   ========================================= */

// ── CUSTOM CURSOR ──────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on hover
document.querySelectorAll('a, button, .proj-card, .win-card, .skill-tags span').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width   = '18px';
    cursor.style.height  = '18px';
    cursor.style.background = 'rgba(255,92,0,0.6)';
    follower.style.width  = '56px';
    follower.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width   = '10px';
    cursor.style.height  = '10px';
    cursor.style.background = 'var(--c1)';
    follower.style.width  = '36px';
    follower.style.height = '36px';
  });
});

// ── NAV SCROLL ─────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER ──────────────────────────────
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const [s1, s2] = burger.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'rotate(45deg) translate(5px,6px)';
    s2.style.transform = 'rotate(-45deg) translate(5px,-6px)';
  } else {
    s1.style.transform = '';
    s2.style.transform = '';
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ── SCROLL REVEAL ──────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal') || [])];
    const i = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), i * 90);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ──────────────────────
function countUp(el) {
  const target = +el.dataset.count;
  const dur    = 1800;
  const start  = performance.now();
  const run = now => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(run);
    else el.textContent = target;
  };
  requestAnimationFrame(run);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ── PROFILE PHOTO FALLBACK ─────────────────
// Show fallback when image fails to load
document.querySelectorAll('.profile-img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const fb = document.getElementById('profileFallback');
    if (fb) fb.style.display = 'flex';
  });
});

// ── POWER AUTOMATE ENDPOINT ────────────────
const FLOW_URL = 'https://7a4523ea31d6e7049a4560bf496545.d8.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3dba03a9ba8a4bf4a6d19257122a4f0e/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9XJc0JpjFZV-_zdMSJBbKCOh82DeewlXGp4WcX7SP64';

/*
 * JSON SCHEMA for Power Automate trigger (use in "When a HTTP request is received"):
 *
 * {
 *   "type": "object",
 *   "properties": {
 *     "name":     { "type": "string" },
 *     "email":    { "type": "string" },
 *     "phone":    { "type": ["string", "null"] },
 *     "company":  { "type": ["string", "null"] },
 *     "services": { "type": ["string", "null"] },
 *     "message":  { "type": "string" }
 *   },
 *   "required": ["name", "email", "message"]
 * }
 *
 * SAMPLE PAYLOAD (with values):
 * {
 *   "name":     "John Doe",
 *   "email":    "john@company.com",
 *   "phone":    "+91 98765 43210",
 *   "company":  "Acme Corp",
 *   "services": "D365 Business Central, Power Platform",
 *   "message":  "I'd like to discuss a BC upgrade project."
 * }
 *
 * SAMPLE PAYLOAD (null fields):
 * {
 *   "name":     "Jane Smith",
 *   "email":    "jane@example.com",
 *   "phone":    null,
 *   "company":  null,
 *   "services": null,
 *   "message":  "Quick question about Power Platform."
 * }
 */

// ── CONTACT FORM ───────────────────────────
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const resetBtn   = document.getElementById('resetBtn');
const charCount  = document.getElementById('charCount');
const textarea   = document.getElementById('cf-msg');

// Service chip toggles
document.querySelectorAll('.schip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('active'));
});

// Char counter
if (textarea) {
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    charCount.textContent = `${len} / 1000`;
    if (len > 1000) textarea.value = textarea.value.slice(0, 1000);
    charCount.style.color = len > 900 ? '#ff6b35' : '';
  });
}

// Real-time validation
function validateField(input, errId, check) {
  const err = document.getElementById(errId);
  if (!err) return true;
  const ok = check(input.value.trim());
  input.classList.toggle('error', !ok);
  input.classList.toggle('valid',  ok);
  err.classList.toggle('show', !ok);
  return ok;
}

const nameInput  = document.getElementById('cf-name');
const emailInput = document.getElementById('cf-email');
const msgInput   = document.getElementById('cf-msg');

if (nameInput) nameInput.addEventListener('blur', () =>
  validateField(nameInput, 'err-name', v => v.length >= 2));

if (emailInput) emailInput.addEventListener('blur', () =>
  validateField(emailInput, 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)));

if (msgInput) msgInput.addEventListener('blur', () =>
  validateField(msgInput, 'err-msg', v => v.length >= 10));

// Submit → Power Automate
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nameOk  = validateField(nameInput,  'err-name',  v => v.length >= 2);
    const emailOk = validateField(emailInput, 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const msgOk   = validateField(msgInput,   'err-msg',   v => v.length >= 10);
    if (!nameOk || !emailOk || !msgOk) return;

    // Collect selected services
    const services = [...document.querySelectorAll('.schip.active')].map(c => c.dataset.val);

    // Build payload
    const payload = {
      name:     nameInput.value.trim(),
      email:    emailInput.value.trim(),
      phone:    (document.getElementById('cf-phone')?.value.trim()) || null,
      company:  (document.getElementById('cf-company')?.value.trim()) || null,
      services: services.length ? services.join(', ') : null,
      message:  msgInput.value.trim()
    };

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const response = await fetch(FLOW_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });

      if (response.ok || response.status === 202) {
        // Success — Power Automate returns 202 Accepted
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.classList.add('hidden');
        formSuccess.classList.add('show');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }

    } catch (err) {
      console.error('Flow submission error:', err);
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      // Show inline error under the button
      let errEl = document.getElementById('flow-error');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.id = 'flow-error';
        errEl.style.cssText = 'color:#ff6b35;font-family:var(--font-mono);font-size:.72rem;margin-top:.75rem;text-align:center;';
        submitBtn.parentElement.appendChild(errEl);
      }
      errEl.textContent = 'Something went wrong. Please try again or email directly.';
      setTimeout(() => { if (errEl) errEl.textContent = ''; }, 6000);
    }
  });
}

// Reset
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    form.reset();
    form.classList.remove('hidden');
    formSuccess.classList.remove('show');
    charCount.textContent = '0 / 1000';
    document.querySelectorAll('.schip').forEach(c => c.classList.remove('active'));
    [nameInput, emailInput, msgInput].forEach(i => {
      if (i) { i.classList.remove('error','valid'); }
    });
    document.querySelectorAll('.cfield-err').forEach(e => e.classList.remove('show'));
  });
}

// ── SMOOTH SCROLL ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-link');

// Properly observe sections
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + e.target.id) a.style.color = 'var(--c1)';
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObs.observe(s));