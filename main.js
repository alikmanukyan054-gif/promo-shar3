/* =============================================
   PROMO SHAR — main.js
   Scroll reveal + smooth interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. SCROLL REVEAL ---- */
  const revealTargets = [
    '.stats__item',
    '.partners__logo',
    '.why__card',
    '.callback__content',
    '.callback__visual',
    '.map-section__info',
  ];

  // Add reveal class to elements
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Add stagger class to parent containers
  ['.stats__container', '.partners__logos', '.why__grid'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.classList.add('stagger-children');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  /* ---- 2. HEADER SHADOW ON SCROLL ---- */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
    }
  }, { passive: true });


  /* ---- 3. COUNTER ANIMATION for stats ---- */
  function animateCounter(el, target, suffix = '', duration = 1400) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = Math.round(ease * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.stats__number');
        numbers.forEach(numEl => {
          const raw = numEl.textContent.trim();
          // Extract number and suffix
          const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
          if (match) {
            const num = parseFloat(match[1]);
            const suffix = match[2] || '';
            if (num === 4.9) {
              // Special case: decimal
              let start = null;
              const d = 1200;
              const step = (ts) => {
                if (!start) start = ts;
                const prog = Math.min((ts - start) / d, 1);
                const ease = 1 - Math.pow(1 - prog, 3);
                numEl.textContent = (ease * 4.9).toFixed(1) + suffix;
                if (prog < 1) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
            } else {
              animateCounter(numEl, num, suffix);
            }
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);


  /* ---- 4. FORM SUBMISSION (feedback) ---- */
  const callbackBtn = document.querySelector('.callback__btn');
  if (callbackBtn) {
    callbackBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.callback__input');
      const name = inputs[0]?.value.trim();
      const phone = inputs[1]?.value.trim();

      if (!name) {
        inputs[0].style.borderColor = '#ff4d6d';
        inputs[0].focus();
        inputs[0].addEventListener('input', () => {
          inputs[0].style.borderColor = '';
        }, { once: true });
        return;
      }
      if (!phone) {
        inputs[1].style.borderColor = '#ff4d6d';
        inputs[1].focus();
        inputs[1].addEventListener('input', () => {
          inputs[1].style.borderColor = '';
        }, { once: true });
        return;
      }

      // Success state
      callbackBtn.textContent = '✓ Заявка принята!';
      callbackBtn.style.background = 'linear-gradient(90deg, #43e97b, #38f9d7)';
      callbackBtn.disabled = true;

      inputs.forEach(inp => {
        inp.value = '';
        inp.style.borderColor = '#9de563';
      });

      setTimeout(() => {
        callbackBtn.textContent = 'Заказать звонок';
        callbackBtn.style.background = '';
        callbackBtn.disabled = false;
        inputs.forEach(inp => inp.style.borderColor = '');
      }, 3500);
    });
  }


  /* ---- 5. PHONE INPUT MASK ---- */
  const phoneInput = document.querySelectorAll('.callback__input')[1];
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (val.startsWith('7')) {
        val = '+7 (' + val.slice(1, 4) + ') ' + val.slice(4, 7) + '-' + val.slice(7, 9) + '-' + val.slice(9, 11);
      }
      e.target.value = val.trim();
    });
  }


  /* ---- 6. BALLOON HOVER INTERACTION ---- */
  document.querySelectorAll('.balloon').forEach(b => {
    b.addEventListener('mouseenter', () => {
      b.style.filter = 'brightness(1.15) saturate(1.2)';
      b.style.zIndex = '10';
    });
    b.addEventListener('mouseleave', () => {
      b.style.filter = '';
      b.style.zIndex = '';
    });
  });


  /* ---- 7. SMOOTH ANCHOR SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('.header')?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ---- 8. BALLOON PARALLAX on mouse move (hero) ---- */
  const heroSection = document.querySelector('.hero');
  const balloonCluster = document.querySelector('.balloon-cluster');
  if (heroSection && balloonCluster) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top - cy) / cy;
      balloonCluster.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      balloonCluster.style.transform = '';
    });
  }

});
