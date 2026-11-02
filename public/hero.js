(() => {
  const hero = document.querySelector('.terminal-hero');
  if (!hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Type and delete loop for the search prompt.
  const target = hero.querySelector('[data-ask-word]');
  const words = ['SOC', 'Academics', 'Events', 'Course Information', 'Timetable', 'Dues', 'Communities', 'Freshmen'];
  if (target && !reduced.matches) {
    let w = 0, n = 0, deleting = false;
    target.textContent = '';
    const tick = () => {
      const word = words[w];
      n += deleting ? -1 : 1;
      target.textContent = word.slice(0, n);
      let wait = deleting ? 45 : 95;
      if (!deleting && n === word.length) { deleting = true; wait = 1300; }
      else if (deleting && n === 0) { deleting = false; w = (w + 1) % words.length; wait = 380; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 700);
  }

  // "You're in the right place" prints in once it scrolls into view.
  const reveal = hero.querySelector('[data-hero-reveal]');
  if (reveal) {
    if (reduced.matches || !('IntersectionObserver' in window)) reveal.classList.add('is-in');
    else new IntersectionObserver((entries, io) => entries.forEach(e => {
      if (e.isIntersecting) { reveal.classList.add('is-in'); io.disconnect(); }
    }), { threshold: .6 }).observe(reveal);
  }
})();
