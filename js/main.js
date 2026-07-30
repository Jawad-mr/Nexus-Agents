// ===================================================================
// NEXUS AGENTS — CORE JS (ROBUST FRONTEND INTERACTION)
// ===================================================================

const WA_NUMBER = "917204351696";

function formatWaLink(customMessage) {
  const defaultMsg = "Hi Nexus Agents team, I would like to discuss deploying custom AI agents for our business.";
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation System
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }

  mobileToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-drawer a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 2. Format WhatsApp & Direct Call Links
  document.querySelectorAll('[data-wa-msg]').forEach(el => {
    const msg = el.getAttribute('data-wa-msg');
    el.setAttribute('href', formatWaLink(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  document.querySelectorAll('[data-call]').forEach(el => {
    el.setAttribute('href', 'tel:+917204351696');
  });

  // 3. Settings Switch Toggles
  document.querySelectorAll('.toggle').forEach(t => {
    t.setAttribute('role', 'switch');
    t.setAttribute('aria-checked', t.classList.contains('on') ? 'true' : 'false');
    t.addEventListener('click', () => {
      t.classList.toggle('on');
      t.setAttribute('aria-checked', t.classList.contains('on') ? 'true' : 'false');
    });
  });

  // 4. Scroll Reveal Intersection Observer
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // 5. Findings Research Log Search & Filtering
  const filterBtns = document.querySelectorAll('.filter-btn, .filter-tab');
  const findingCards = document.querySelectorAll('.finding-card');
  const searchInput = document.querySelector('.findings-search input');

  function filterFindings() {
    if (!findingCards.length) return;
    const activeBtn = document.querySelector('.filter-btn.active, .filter-tab.active');
    const activeFilter = activeBtn?.getAttribute('data-filter') || 'all';
    const query = searchInput?.value.toLowerCase().trim() || '';

    findingCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const content = card.textContent.toLowerCase();

      const matchesCat = (activeFilter === 'all' || category.includes(activeFilter));
      const matchesSearch = !query || content.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterFindings();
    });
  });

  searchInput?.addEventListener('input', filterFindings);

  // Apply URL query params on findings page if present
  if (window.location.pathname.includes('findings.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || '';
    if (q && searchInput) {
      searchInput.value = q;
      filterFindings();
    }
  }

  // 6. Interactive Playground Agent Simulator
  const agentItems = document.querySelectorAll('.agent-select-item');
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.querySelector('.chat-input-area input');
  const chatSendBtn = document.querySelector('.chat-input-area button');

  const agentResponses = {
    'support-router': () => ({
      ticket_id: "TICK-9042",
      sentiment: "Urgent",
      intent: "Billing Discrepancy",
      routed_department: "Tier-2 Financial Ops",
      confidence: 0.994,
      suggested_action: "Issue partial refund for transaction TX-88201",
      latency_ms: 184
    }),
    'lead-qualifier': () => ({
      lead_score: 95,
      qualification_tier: "Enterprise Target",
      estimated_acv: "$36,000",
      matched_profile: "B2B SaaS > 100 Employees",
      next_best_action: "Schedule Founder Discovery Call",
      latency_ms: 215
    }),
    'data-extractor': () => ({
      extracted_entities: {
        vendor: "Acme Corp",
        invoice_no: "INV-2026-99",
        line_items: 4,
        total_amount: "$4,290.00",
        tax_id: "XX-902910"
      },
      schema_validation: "Passed 100%",
      latency_ms: 145
    }),
    'meeting-summarizer': () => ({
      action_items: [
        "Deploy Lead Qualifier to staging by Thursday",
        "Review API latency benchmarks with CTO"
      ],
      key_decisions: "Approved Fleet Tier expansion for Q3",
      sentiment_score: 0.92,
      latency_ms: 310
    })
  };

  let currentAgent = 'support-router';

  agentItems.forEach(item => {
    item.addEventListener('click', () => {
      agentItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentAgent = item.getAttribute('data-agent-id') || 'support-router';
      
      const agentName = item.querySelector('h4')?.textContent || 'Agent';
      addChatMessage('system', `Switched active agent simulation to: ${agentName}`);
    });
  });

  function addChatMessage(sender, content) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;

    if (typeof content === 'object') {
      msgDiv.innerHTML = `<strong>Structured Output (${currentAgent}):</strong><pre>${JSON.stringify(content, null, 2)}</pre>`;
    } else {
      msgDiv.textContent = content;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserMessage() {
    const text = chatInput?.value.trim();
    if (!text) return;

    addChatMessage('user', text);
    chatInput.value = '';

    setTimeout(() => {
      const responseFn = agentResponses[currentAgent] || agentResponses['support-router'];
      const result = responseFn();
      addChatMessage('agent', result);
    }, 350);
  }

  chatSendBtn?.addEventListener('click', handleUserMessage);
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserMessage();
  });
});
