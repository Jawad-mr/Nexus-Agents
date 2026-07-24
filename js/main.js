// ===================== NEXUS AGENTS — CORE JS =====================
const WA_NUMBER = "917204351696";
function waLink(msg) { return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg || "Hi Nexus Agents, I'd like to know more.")}`; }

document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Manager (Default to rich warm light mode)
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }
  const savedTheme = localStorage.getItem('nexus-theme') || 'light';
  setTheme(savedTheme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      setTheme(next);
    });
  });

  // 1. WhatsApp & Phone link builders
  document.querySelectorAll('[data-wa-msg]').forEach(el => {
    el.setAttribute('href', waLink(el.getAttribute('data-wa-msg')));
    el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('[data-call]').forEach(el => el.setAttribute('href', 'tel:+917204351696'));

  // 2. Mobile sidebar toggle & body lock
  const toggle = document.querySelector('.sb-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sb-overlay');
  
  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
  
  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('open');
    document.body.classList.add('nav-open');
    toggle?.setAttribute('aria-expanded', 'true');
  }

  document.querySelectorAll('.sb-toggle, .mbb-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  });
  overlay?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar a').forEach(a => a.addEventListener('click', closeSidebar));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
      closeSidebar();
    }
  });

  // 3. Settings Toggles
  document.querySelectorAll('.toggle').forEach(t => {
    t.setAttribute('role', 'switch');
    t.setAttribute('aria-checked', t.classList.contains('on') ? 'true' : 'false');
    t.addEventListener('click', () => {
      t.classList.toggle('on');
      t.setAttribute('aria-checked', t.classList.contains('on') ? 'true' : 'false');
    });
  });

  // 4. Interactive Topbar Search
  const searchInput = document.querySelector('.topbar-search input');
  if (searchInput) {
    // If URL has ?q= query param, set initial search
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') || '';
    if (initialQuery) {
      searchInput.value = initialQuery;
    }

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      filterFindings(q);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (!window.location.pathname.includes('findings.html')) {
          window.location.href = `findings.html?q=${encodeURIComponent(q)}`;
        }
      }
    });
  }

  // 5. Findings Filtering Logic
  const filterTabs = document.querySelectorAll('.filter-tab');
  const findingCards = document.querySelectorAll('.finding-card');

  function filterFindings(query = '', category = 'all') {
    if (!findingCards.length) return;
    const activeTab = document.querySelector('.filter-tab.active');
    const activeCategory = category !== 'all' ? category : (activeTab?.getAttribute('data-filter') || 'all');

    findingCards.forEach(card => {
      const cardCat = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();
      const matchCat = (activeCategory === 'all' || cardCat.includes(activeCategory));
      const matchQuery = !query || text.includes(query.toLowerCase());

      if (matchCat && matchQuery) {
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 20);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => { card.style.display = 'none'; }, 150);
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter') || 'all';
      const q = searchInput?.value.trim() || '';
      filterFindings(q, cat);
    });
  });

  // Apply initial filter if query parameter exists on findings page
  if (window.location.pathname.includes('findings.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || '';
    if (q) filterFindings(q);
  }

  // 6. Scroll reveal & Confidence Meters
  const revealEls = document.querySelectorAll('.reveal');
  const triggerMeterFills = (container) => {
    container.querySelectorAll('.meter-fill[data-pct]').forEach(m => {
      m.style.width = m.getAttribute('data-pct') + '%';
    });
  };

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          triggerMeterFills(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => {
      el.classList.add('is-visible');
      triggerMeterFills(el);
    });
  }
});

