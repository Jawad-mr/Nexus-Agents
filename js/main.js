// ===================== NEXUS AGENTS — CORE JS =====================
const WA_NUMBER = "917204351696";
function waLink(msg) { return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg || "Hi Nexus Agents, I'd like to know more.")}`; }

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-wa-msg]').forEach(el => {
    el.setAttribute('href', waLink(el.getAttribute('data-wa-msg')));
    el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('[data-call]').forEach(el => el.setAttribute('href', 'tel:+917204351696'));

  // Mobile sidebar toggle
  const toggle = document.querySelector('.sb-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sb-overlay');
  function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('open'); }
  function openSidebar() { sidebar?.classList.add('open'); overlay?.classList.add('open'); }
  toggle?.addEventListener('click', () => {
    sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar a').forEach(a => a.addEventListener('click', closeSidebar));

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          // trigger meter fills within
          e.target.querySelectorAll('.meter-fill[data-pct]').forEach(m => {
            m.style.width = m.getAttribute('data-pct') + '%';
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => {
      el.classList.add('is-visible');
      el.querySelectorAll('.meter-fill[data-pct]').forEach(m => m.style.width = m.getAttribute('data-pct') + '%');
    });
  }
});
