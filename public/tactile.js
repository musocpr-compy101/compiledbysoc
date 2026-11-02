(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem('soc-design-' + key)); } catch { return null; } },
    set(key, value) { try { localStorage.setItem('soc-design-' + key, JSON.stringify(value)); } catch {} }
  };

  // Only programme, level and the first-week checklist are device preferences.
  let preferences = store.get('preferences') || { programme: 'all', level: 'all' };
  const programmes = ['all', 'cs', 'se', 'cy'];
  const levels = ['all', '100', '200', '300', '400'];
  if (!programmes.includes(preferences.programme) || !levels.includes(preferences.level)) preferences = { programme: 'all', level: 'all' };
  const matches = (value, choice) => choice === 'all' || value === 'all' || (value || '').split(' ').includes(choice);
  function filterStudents() {
    document.querySelectorAll('[data-programme]').forEach(select => { select.value = preferences.programme; });
    document.querySelectorAll('[data-level]').forEach(select => { select.value = preferences.level; });
    for (const [selector, statusSelector, name] of [
      ['[data-feed-card]', '[data-feed-status]', 'sample posts'],
      ['[data-study-row]', '[data-study-status]', 'sample classes'],
      ['[data-material-card]', '[data-material-status]', 'sample materials']
    ]) {
      const cards = [...document.querySelectorAll(selector)];
      let visible = 0;
      cards.forEach(card => {
        card.hidden = !(matches(card.dataset.programmes, preferences.programme) && matches(card.dataset.levels, preferences.level));
        if (!card.hidden) visible++;
      });
      const status = document.querySelector(statusSelector);
      if (status) status.textContent = visible ? visible + ' ' + name + ' for your selection.' : 'No sample entries for this selection. Try all programmes or levels.';
    }
  }
  document.querySelectorAll('[data-preference-group]').forEach(group => group.addEventListener('change', () => {
    preferences = { programme: group.querySelector('[data-programme]').value, level: group.querySelector('[data-level]').value };
    store.set('preferences', preferences);
    filterStudents();
  }));
  filterStudents();

  const carousel = document.querySelector('[data-campus-carousel]');
  if (carousel) {
    const mobileCarousel = window.matchMedia('(max-width: 768px)');
    const slides = [...carousel.querySelectorAll('[data-campus-slide]')];
    const dots = [...carousel.querySelectorAll('[data-campus-dot]')];
    const pause = carousel.querySelector('[data-campus-pause]');
    let current = 0, timer = null, userPaused = reduced.matches, pointerStart = null;
    let inView = false;
    const loadImage = index => {
      const img = slides[index].querySelector('img[data-src]');
      if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
    };
    function stop() { clearInterval(timer); timer = null; }
    function schedule() {
      stop();
      if (!mobileCarousel.matches && !userPaused && !reduced.matches && inView && !document.hidden && !carousel.contains(document.activeElement)) timer = setInterval(() => show(current + 1), 5500);
    }
    function show(index) {
      current = (index + slides.length) % slides.length;
      loadImage(current);
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
        dots[i].setAttribute('aria-pressed', String(active));
      });
      carousel.querySelector('[data-slide-position]').textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      // Preload only the next photograph after the carousel has entered view.
      if (inView) loadImage((current + 1) % slides.length);
    }
    function setPaused(value) {
      userPaused = reduced.matches || value;
      pause.disabled = reduced.matches;
      pause.textContent = reduced.matches ? 'Paused' : userPaused ? 'Play' : 'Pause';
      pause.setAttribute('aria-label', reduced.matches ? 'Autoplay paused for reduced motion' : userPaused ? 'Play carousel' : 'Pause carousel');
      schedule();
    }
    function manual(index) { setPaused(true); show(index); }
    dots.forEach((button, i) => button.addEventListener('click', () => manual(i)));
    carousel.querySelector('[data-campus-prev]').addEventListener('click', () => manual(current - 1));
    carousel.querySelector('[data-campus-next]').addEventListener('click', () => manual(current + 1));
    pause.addEventListener('click', () => setPaused(!userPaused));
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', () => requestAnimationFrame(schedule));
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', schedule);
    carousel.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); manual(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    carousel.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') { pointerStart = { x: event.clientX, y: event.clientY }; setPaused(true); }
    }, { passive: true });
    carousel.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) manual(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
    carousel.addEventListener('pointercancel', () => { pointerStart = null; });
    document.addEventListener('visibilitychange', schedule);
    const updateCarouselMode = () => {
      carousel.setAttribute('aria-label', mobileCarousel.matches ? 'Around SOC. Swipe left or right, or use the arrow keys, to browse photographs.' : 'Around SOC');
      schedule();
    };
    mobileCarousel.addEventListener('change', updateCarouselMode);
    updateCarouselMode();
    reduced.addEventListener('change', () => setPaused(true));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        if (inView) loadImage((current + 1) % slides.length);
        schedule();
      }, { threshold: .1 }).observe(carousel);
    } else { inView = true; schedule(); }
    setPaused(userPaused);
  }

  document.querySelectorAll('[data-schedule]').forEach(button => button.addEventListener('click', () => {
    const exam = button.dataset.schedule === 'exam';
    document.querySelector('[data-class-schedule]').hidden = exam;
    document.querySelector('[data-exam-schedule]').hidden = !exam;
    document.querySelector('[data-study-status]').hidden = exam;
    document.querySelectorAll('[data-schedule]').forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  }));

  document.querySelectorAll('[data-checklist]').forEach(input => {
    input.checked = store.get('check-' + input.dataset.checklist) === true;
    input.addEventListener('change', () => store.set('check-' + input.dataset.checklist, input.checked));
  });
  document.querySelectorAll('[data-demo-poll]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = form.querySelector('input:checked');
    if (!selected) return;
    form.querySelector('[data-poll-status]').textContent = 'Preview selected: ' + selected.parentElement.textContent.trim() + '. No vote has been submitted.';
    form.querySelector('button[type=submit]').textContent = 'Update preview choice';
  }));
  document.querySelector('[data-demo-rsvp]')?.addEventListener('click', event => {
    event.currentTarget.textContent = 'Preview RSVP selected';
    document.querySelector('[data-rsvp-status]').textContent = 'This is the confirmation state. No event registration or QR check-in pass has been created.';
  });
  document.querySelector('[data-demo-upvote]')?.addEventListener('click', event => {
    const button = event.currentTarget, selected = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(selected));
    button.querySelector('span').textContent = selected ? '1' : '0';
  });

  const feedback = document.querySelector('[data-feedback-preview]');
  if (feedback) {
    const type = feedback.elements.type;
    const requested = new URLSearchParams(location.search).get('type');
    if ([...type.options].some(option => option.value === requested)) type.value = requested;
    const recipients = { suggestion: 'PRO office', bug: 'PRO office', complaint: 'Welfare Officer; serious cases may be referred to the HOD under the agreed policy', welfare: 'Welfare Officer', dues: 'Financial Officer', event: 'Events team', course: 'HOD only', ict: 'ICT support through the PRO office' };
    function updateFeedback() {
      const course = type.value === 'course';
      const anonymous = feedback.querySelector('input[value=anonymous]');
      const named = feedback.querySelector('input[value=named]');
      if (course) anonymous.checked = true;
      named.disabled = course;
      feedback.querySelector('[data-feedback-name]').hidden = !named.checked;
      feedback.elements.name.required = named.checked;
      feedback.querySelector('[data-event-rating]').hidden = type.value !== 'event';
      feedback.querySelector('[data-feedback-route]').textContent = 'Intended recipient: ' + recipients[type.value] + '. ' + (course ? 'Anonymous; private to the HOD. Only aggregated results can be shown after the minimum response count.' : 'This preview sends nothing.');
    }
    type.addEventListener('change', updateFeedback);
    feedback.querySelectorAll('[name=identity]').forEach(input => input.addEventListener('change', updateFeedback));
    updateFeedback();
    feedback.addEventListener('submit', event => {
      event.preventDefault();
      const result = feedback.querySelector('[data-feedback-result]');
      result.hidden = false;
      result.replaceChildren();
      const title = document.createElement('strong'); title.textContent = 'Preview code: DEMO-1042';
      const message = document.createElement('span'); message.textContent = 'Received is the first status in this design. Nothing was sent or stored. Try this sample code in the tracker.';
      result.append(title, message);
      feedback.elements.message.value = '';
      feedback.elements.name.value = '';
    });
  }
  document.querySelector('[data-feedback-track]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const output = form.querySelector('[data-track-result]');
    output.className = 't-status-result';
    output.textContent = form.elements.code.value.trim().toUpperCase() === 'DEMO-1042'
      ? 'Demo record · Reviewing. Status journey: Received → Reviewing → Resolved. No real feedback is attached to this code.'
      : 'No live records are connected. Use DEMO-1042 to view the sample status.';
  });
  document.querySelector('[data-proof-preview]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    form.querySelector('[data-proof-status]').textContent = 'Preview complete. Your file was not uploaded and your matric number was not stored. Finance verification will happen in the live platform.';
    form.reset();
  });
  document.querySelector('[data-payment-check]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget, result = form.querySelector('[data-payment-result]');
    result.hidden = false;
    result.textContent = form.elements.matric.value.trim().toUpperCase() === 'PREVIEW-001'
      ? 'Sample status: Reviewing. Proof received, awaiting finance verification. A receipt becomes available after a real payment is approved.'
      : 'This mockup has no student payment records. Use PREVIEW-001 for the example.';
  });

  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('t-reveal'); observer.unobserve(entry.target);
    }), { threshold: .1 });
    document.querySelectorAll('.t-feed-card,.t-heading-row').forEach(node => observer.observe(node));
  }
})();

/* Freshers section: a zig-zag path. Curved lines draw as you scroll; each card lights up when a line reaches it. */
(() => {
  const sec = document.querySelector('.t-fresh');
  const path = sec && sec.querySelector('[data-fresh-path]');
  if (!path) return;
  const cards = [...path.querySelectorAll('.t-fresh-card')];
  const svg = path.querySelector('.t-fresh-lines');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  let segs = [];

  const build = () => {
    svg.innerHTML = '';
    const W = path.clientWidth, H = path.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    segs = cards.slice(0, -1).map((a, i) => {
      const b = cards[i + 1];
      const fromLeft = a.offsetLeft + a.offsetWidth / 2 < W / 2;
      const ex = b.offsetLeft + b.offsetWidth / 2, ey = b.offsetTop;
      const inside = ex > a.offsetLeft + 24 && ex < a.offsetLeft + a.offsetWidth - 24;
      let d, sx, sy;
      if (inside) {
        sx = a.offsetLeft + a.offsetWidth * (fromLeft ? .72 : .28); sy = a.offsetTop + a.offsetHeight;
        d = `M${sx},${sy} C${sx},${sy + (ey - sy) * .7} ${ex},${ey - (ey - sy) * .7} ${ex},${ey}`;
      } else {
        sx = fromLeft ? a.offsetLeft + a.offsetWidth : a.offsetLeft; sy = a.offsetTop + a.offsetHeight / 2;
        const dir = fromLeft ? 1 : -1, reach = Math.max(70, Math.abs(ex - sx) * .6);
        d = `M${sx},${sy} C${sx + dir * reach},${sy} ${ex},${ey - (ey - sy) * .55} ${ex},${ey}`;
      }
      const track = document.createElementNS(NS, 'path');
      track.setAttribute('d', d); track.setAttribute('class', 'fresh-track');
      const line = document.createElementNS(NS, 'path');
      line.setAttribute('d', d); line.setAttribute('class', 'fresh-line');
      const len = line.getTotalLength();
      line.style.strokeDasharray = len; line.style.strokeDashoffset = reduced ? 0 : len;
      const head = document.createElementNS(NS, 'circle');
      head.setAttribute('r', 6); head.setAttribute('class', 'fresh-head');
      svg.append(track, line, head);
      return { line, head, len, sy, ey };
    });
    update();
  };

  const light = (card, on) => {
    if (on && !card.classList.contains('is-lit')) {
      card.classList.add('is-in', 'is-lit', 'is-flash');
      setTimeout(() => card.classList.remove('is-flash'), 1100);
    } else if (!on) card.classList.remove('is-lit');
  };

  function update() {
    if (reduced) { cards.forEach(c => c.classList.add('is-in', 'is-lit')); return; }
    const top = path.getBoundingClientRect().top, read = innerHeight * .66;
    light(cards[0], top + cards[0].offsetTop < innerHeight * .8);
    segs.forEach((s, i) => {
      const a = top + s.sy, b = top + s.ey;
      const t = clamp((read - a) / (b - a));
      s.line.style.strokeDashoffset = s.len * (1 - t);
      if (t > 0 && t < 1) {
        const pt = s.line.getPointAtLength(s.len * t);
        s.head.setAttribute('cx', pt.x); s.head.setAttribute('cy', pt.y); s.head.style.opacity = 1;
      } else s.head.style.opacity = 0;
      light(cards[i + 1], t >= .985);
    });
  }

  const photo = sec.querySelector('.t-fresh-photo');
  if (photo && !reduced && 'IntersectionObserver' in window) {
    photo.addEventListener('transitionend', e => { if (e.propertyName === 'transform') photo.classList.add('is-done'); });
    new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting) { photo.classList.add('is-in'); io.disconnect(); } }), { threshold: .2 }).observe(photo);
  } else if (photo) photo.classList.add('is-in');
  if (!reduced) sec.classList.add('is-armed');
  cards.forEach(c => c.addEventListener('transitionend', e => { if (e.propertyName === 'transform' && c.classList.contains('is-in')) c.classList.add('is-done'); }));
  let queued = false;
  const tick = () => { if (!queued) { queued = true; requestAnimationFrame(() => { update(); queued = false; }); } };
  addEventListener('scroll', tick, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(build).observe(path); else addEventListener('resize', build);
  addEventListener('load', build);
  build();

  // Floating background shapes drift with scroll.
  const shapes = [...sec.querySelectorAll('.t-shape,.t-ico')];
  if (!reduced) addEventListener('scroll', () => requestAnimationFrame(() => {
    const r = sec.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
    shapes.forEach(sh => sh.style.setProperty('--p', p.toFixed(3)));
  }), { passive: true });
})();
