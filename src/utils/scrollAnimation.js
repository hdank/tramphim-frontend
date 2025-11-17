export function initScrollFadeIn() {
  const elements = document.querySelectorAll("[effect-fade-in]");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach(el => {
    el.classList.add("effect-fade-in");
    observer.observe(el);
  });
}
