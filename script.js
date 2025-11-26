// script.js - interactions: nav toggle, smooth scroll, intersection reveals, carousel, accordion, form validation

document.addEventListener('DOMContentLoaded', function() {
  // NAV hamburger toggle (mobile)
  const hamburger = document.getElementById('hamburger');
  const navList = document.querySelector('.nav-list');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      if (navList) navList.style.display = expanded ? 'none' : 'flex';
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // IntersectionObserver reveal
  const revealEls = document.querySelectorAll('.section, .treatment-card, .feature-card, .testimonial-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, {threshold: 0.12});
  revealEls.forEach(el => io.observe(el));

  // Simple testimonials horizontal carousel
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (track) {
    prevBtn && prevBtn.addEventListener('click', () => { track.scrollBy({left:-220, behavior:'smooth'}); });
    nextBtn && nextBtn.addEventListener('click', () => { track.scrollBy({left:220, behavior:'smooth'}); });
  }


(function initFAQ() {
  const faqButtons = document.querySelectorAll('.faq-q');

  if (!faqButtons.length) return;

  function closeAllExcept(exceptBtn) {
    faqButtons.forEach(btn => {
      if (btn === exceptBtn) return;
      if (btn.getAttribute('aria-expanded') === 'true') {
        btn.setAttribute('aria-expanded', 'false');
        const icon = btn.querySelector('.faq-icon');
        if (icon) icon.textContent = '+';
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = true;
        }
      }
    });
  }

  faqButtons.forEach(btn => {
    // ensure aria-expanded exists
    if (!btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // close other items (single-open behavior)
      if (!isOpen) closeAllExcept(btn);

      // toggle current
      btn.setAttribute('aria-expanded', String(!isOpen));
      const icon = btn.querySelector('.faq-icon');
      if (icon) icon.textContent = isOpen ? '+' : '−'; // plus when closed, minus when open

      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : btn.nextElementSibling;
      if (panel) {
        panel.hidden = !panel.hidden;
      }
    });


  });
})();


  // Form validation - main appointment form
  const form = document.getElementById('appointment-form');
  const captchaValue = document.getElementById('captcha-value')?.textContent?.trim() || '1514';
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = form.querySelector('#name');
      const phone = form.querySelector('#phone');
      const captcha = form.querySelector('#captcha');
      const consent = form.querySelector('#consent');

      // basic validation
      let ok = true;
      [name, phone, captcha].forEach(input => {
        if (!input.value.trim()) {
          input.style.outline = '2px solid #f48b2f33';
          ok = false;
        } else input.style.outline = 'none';
      });

      if (!consent.checked) {
        consent.style.outline = '2px solid rgba(244,139,47,0.3)';
        ok = false;
      } else consent.style.outline = 'none';

      if (captcha.value.trim() !== captchaValue) {
        captcha.style.outline = '2px solid rgba(220,0,0,0.3)';
        ok = false;
      }

      if (!ok) {
        alert('Please complete the form correctly. (Captcha is ' + captchaValue + ' for demo)');
        return;
      }

      // show success overlay / toast
      const toast = document.createElement('div');
      toast.textContent = 'Thank you! Your request has been received. We will contact you shortly.';
      toast.style.position = 'fixed';
      toast.style.right = '18px';
      toast.style.bottom = '18px';
      toast.style.background = 'var(--brand-brown)';
      toast.style.color = '#fff';
      toast.style.padding = '14px';
      toast.style.borderRadius = '8px';
      toast.style.zIndex = 9999;
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(),3500);
      form.reset();
    });
  }

  // strip form - mimic behaviour
  document.getElementById('strip-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('strip-name').value;
      const phone = document.getElementById('strip-phone').value;
      const captcha = document.getElementById('strip-captcha').value;
      const consent = document.getElementById('strip-consent').checked;
      
      if (!name || !phone || !captcha) {
        alert('Please fill in all fields');
        return;
      }
      
      if (!consent) {
        alert('Please agree to the terms and privacy policy');
        return;
      }
      
      if (captcha !== '1514') {
        alert('Invalid captcha');
        return;
      }
      
      alert('Appointment request submitted successfully!');
      this.reset();
    });

  // keyboard accessible focus outlines (simple)
  document.addEventListener('keydown', function(e){
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  });

});
