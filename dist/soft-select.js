/* Soft dropdowns: replaces the browser's native select menu with a styled listbox.
   The real <select> stays in the page (hidden), so forms, validation and other scripts keep working. */
(() => {
  const CHEVRON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  let uid = 0, openInstance = null;

  function enhance(select) {
    if (select.dataset.softReady || select.multiple) return;
    select.dataset.softReady = '1';
    const id = 'soft-select-' + (++uid);
    const wrap = document.createElement('div');
    wrap.className = 'soft-select';
    select.parentNode.insertBefore(wrap, select);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'soft-select__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', id);
    const label = select.getAttribute('aria-label') || (select.labels && select.labels[0] && select.labels[0].firstChild && select.labels[0].firstChild.textContent.trim());
    if (label) btn.setAttribute('aria-label', label);
    btn.innerHTML = '<span class="soft-select__value"></span><span class="soft-select__chev">' + CHEVRON + '</span>';

    const menu = document.createElement('ul');
    menu.className = 'soft-select__menu';
    menu.id = id; menu.setAttribute('role', 'listbox'); menu.tabIndex = -1;

    wrap.append(btn, menu, select);
    select.classList.add('soft-select__native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    let items = [], active = -1;
    const build = () => {
      menu.innerHTML = '';
      items = [...select.options].map((opt, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.id = id + '-' + i;
        li.dataset.index = i;
        if (opt.disabled) li.setAttribute('aria-disabled', 'true');
        if (!opt.value) li.classList.add('is-placeholder');
        li.innerHTML = '<span></span><i>' + CHECK + '</i>';
        li.firstChild.textContent = opt.textContent;
        menu.appendChild(li);
        return li;
      });
    };
    const sync = () => {
      const opt = select.options[select.selectedIndex];
      btn.querySelector('.soft-select__value').textContent = opt ? opt.textContent : '';
      btn.classList.toggle('is-placeholder', !!opt && !opt.value);
      btn.classList.remove('is-invalid');
      items.forEach((li, i) => li.setAttribute('aria-selected', String(i === select.selectedIndex)));
    };
    const highlight = (i, scroll = true) => {
      active = i;
      items.forEach((li, k) => li.classList.toggle('is-active', k === i));
      if (i >= 0) { btn.setAttribute('aria-activedescendant', items[i].id); if (scroll) items[i].scrollIntoView({ block: 'nearest' }); }
    };
    const step = (from, dir) => {
      for (let i = from + dir; i >= 0 && i < items.length; i += dir) if (!select.options[i].disabled) return i;
      return from;
    };
    const open = () => {
      if (select.disabled) return;
      if (openInstance && openInstance !== close) openInstance();
      build(); sync();
      const r = btn.getBoundingClientRect();
      wrap.classList.toggle('is-up', innerHeight - r.bottom < 300 && r.top > innerHeight - r.bottom);
      wrap.classList.remove('is-end');
      wrap.classList.add('is-open');
      const mr = menu.getBoundingClientRect();
      if (mr.right > innerWidth - 12) wrap.classList.add('is-end');
      btn.setAttribute('aria-expanded', 'true');
      highlight(select.selectedIndex >= 0 ? select.selectedIndex : step(-1, 1));
      openInstance = close;
    };
    function close(refocus) {
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.removeAttribute('aria-activedescendant');
      if (openInstance === close) openInstance = null;
      if (refocus === true) btn.focus();
    }
    const choose = i => {
      if (i < 0 || select.options[i].disabled) return;
      const changed = select.selectedIndex !== i;
      select.selectedIndex = i;
      sync(); close(true);
      if (changed) {
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    btn.addEventListener('click', () => wrap.classList.contains('is-open') ? close(true) : open());
    menu.addEventListener('mousedown', e => e.preventDefault());
    menu.addEventListener('click', e => { const li = e.target.closest('[role=option]'); if (li) choose(+li.dataset.index); });
    menu.addEventListener('mousemove', e => { const li = e.target.closest('[role=option]'); if (li && !li.hasAttribute('aria-disabled')) highlight(+li.dataset.index, false); });
    let typed = '', typedTimer;
    btn.addEventListener('keydown', e => {
      const isOpen = wrap.classList.contains('is-open');
      const k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) return open();
        highlight(step(active, k === 'ArrowDown' ? 1 : -1));
      } else if (k === 'Home' || k === 'End') {
        if (!isOpen) return;
        e.preventDefault(); highlight(k === 'Home' ? step(-1, 1) : step(items.length, -1));
      } else if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        if (isOpen) choose(active); else open();
      } else if (k === 'Escape' || k === 'Tab') {
        if (isOpen) close(k === 'Escape');
      } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!isOpen) open();
        typed += k.toLowerCase(); clearTimeout(typedTimer); typedTimer = setTimeout(() => typed = '', 600);
        const hit = [...select.options].findIndex(o => !o.disabled && o.textContent.trim().toLowerCase().startsWith(typed));
        if (hit >= 0) highlight(hit);
      }
    });
    btn.addEventListener('blur', () => setTimeout(() => { if (!wrap.contains(document.activeElement)) close(); }, 0));

    select.addEventListener('change', sync);
    select.addEventListener('invalid', () => { btn.classList.add('is-invalid'); });
    if (select.form) select.form.addEventListener('reset', () => setTimeout(sync, 0));
    // Other scripts set select.value directly; keep the visible label in step.
    Object.defineProperty(select, 'value', {
      configurable: true,
      get() { return descriptor.get.call(this); },
      set(v) { descriptor.set.call(this, v); sync(); }
    });
    build(); sync();
  }

  const init = () => document.querySelectorAll('select').forEach(enhance);
  document.addEventListener('click', e => { if (openInstance && !e.target.closest('.soft-select')) openInstance(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
