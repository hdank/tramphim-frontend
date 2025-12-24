import React, { createContext, useEffect, useRef } from 'react';

export const FocusContext = createContext({
  focusKey: null,
  setFocusKey: () => {}
});

export default function FocusProvider({ children }) {
  // Very small focus management scaffold for D-Pad navigation.
  const rootRef = useRef(null);

  useEffect(() => {
    let lastKeyTime = 0;
    function getFocusableItems() {
      return Array.from(document.querySelectorAll('.tv-item'));
    }

    function focusItem(el) {
      try {
        el && el.focus && el.focus();
      } catch (err) {}
    }

    function onKey(e) {
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Backspace'];
      if (!keys.includes(e.key)) return;

      const now = Date.now();
      if (e.repeat && now - lastKeyTime < 40) return;
      lastKeyTime = now;

      // handle enter/backspace specially
      if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active && typeof active.click === 'function') {
          e.preventDefault();
          active.click();
        }
        return;
      }

      if (e.key === 'Backspace') {
        try {
          if (window.history && window.history.length > 1) {
            e.preventDefault();
            window.history.back();
          }
        } catch (err) {}
        return;
      }

      e.preventDefault();
      const active = document.activeElement;
      const items = getFocusableItems();
      if (!items.length) return;

      // If nothing focused or body, focus first item
      if (!active || active === document.body || !active.classList || !active.classList.contains('tv-item')) {
        focusItem(items[0]);
        return;
      }

      const row = parseInt(active.getAttribute('data-row') || '0', 10);
      const col = parseInt(active.getAttribute('data-col') || '0', 10);

      if (e.key === 'ArrowLeft') {
        const target = items.find((it) => parseInt(it.getAttribute('data-row')||'0',10) === row && parseInt(it.getAttribute('data-col')||'0',10) === col - 1);
        if (target) focusItem(target);
        else {
          // scroll container left a bit
          const container = active.closest('.tv-row');
          if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        const target = items.find((it) => parseInt(it.getAttribute('data-row')||'0',10) === row && parseInt(it.getAttribute('data-col')||'0',10) === col + 1);
        if (target) focusItem(target);
        else {
          const container = active.closest('.tv-row');
          if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
        }
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const rowDelta = e.key === 'ArrowUp' ? -1 : 1;
        const targetRowIndex = row + rowDelta;
        // find items in target row
        const candidates = items.filter((it) => parseInt(it.getAttribute('data-row')||'0',10) === targetRowIndex);
        if (candidates.length === 0) {
          // no row above/below, try to focus header or do nothing
          return;
        }
        // pick candidate with closest horizontal center to currently focused element
        const activeRect = active.getBoundingClientRect();
        const activeCenterX = activeRect.left + activeRect.width / 2;
        let best = null;
        let bestDist = Infinity;
        candidates.forEach((c) => {
          const r = c.getBoundingClientRect();
          const centerX = r.left + r.width / 2;
          const d = Math.abs(centerX - activeCenterX);
          if (d < bestDist) {
            bestDist = d;
            best = c;
          }
        });
        if (best) {
          focusItem(best);
          // ensure row scrolled so item visible
          const container = best.closest('.tv-row');
          if (container) {
            const rect = best.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            if (rect.left < contRect.left || rect.right > contRect.right) {
              container.scrollBy({ left: rect.left - contRect.left - 20, behavior: 'smooth' });
            }
          }
        }
      }
    }

    // initial focus
    function initFocus() {
      const items = getFocusableItems();
      if (items.length) {
        try { items[0].tabIndex = 0; items[0].focus(); } catch {}
      }
    }

    window.addEventListener('keydown', onKey);
    setTimeout(initFocus, 250);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <FocusContext.Provider value={{}}>
      <div ref={rootRef} className="tv-focus-root" tabIndex={0}>
        {children}
      </div>
    </FocusContext.Provider>
  );
}


