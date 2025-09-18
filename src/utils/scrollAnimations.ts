export function initScrollAnimations() {
  const sections = document.querySelectorAll<HTMLElement>(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.2 } // 20% of section visible before triggering
  );

  sections.forEach((section) => observer.observe(section));
}
