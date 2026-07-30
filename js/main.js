// ===================================================================
// NEXUS AGENTS — CORE JAVASCRIPT
// Handles navigation drawer, WhatsApp link prefilling, findings search/filter,
// and interactive agent playground simulation.
// ===================================================================

const WA_NUMBER = "917204351696";

function formatWaLink(customMessage) {
  const defaultMsg = "Hi Nexus Agents team, I would like to discuss deploying custom AI agents for our business.";
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 2. WhatsApp & Phone links
  document.querySelectorAll('[data-wa-msg]').forEach(el => {
    const msg = el.getAttribute('data-wa-msg');
    el.setAttribute('href', formatWaLink(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  document.querySelectorAll('[data-call]').forEach(el => {
    el.setAttribute('href', 'tel:+917204351696');
  });

  // 3. Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Findings Filtering & Search
  const filterBtns = document.querySelectorAll('.filter-btn');
  const findingCards = document.querySelectorAll('.finding-card');
  const searchInput = document.querySelector('.findings-search input');

  function filterFindings() {
    if (!findingCards.length) return;
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const query = searchInput?.value.toLowerCase().trim() || '';

    findingCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const content = card.textContent.toLowerCase();

      const matchesCat = (activeFilter === 'all' || category.includes(activeFilter));
      const matchesSearch = !query || content.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = 'block';
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

  // 5. Interactive Playground Agent Simulation
  const agentItems = document.querySelectorAll('.agent-select-item');
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.querySelector('.chat-input-area input');
  const chatSendBtn = document.querySelector('.chat-input-area button');

  const agentResponses = {
    'support-router': (query) => ({
      ticket_id: "TICK-9042",
      sentiment: "Urgent",
      intent: "Billing Discrepancy",
      routed_department: "Tier-2 Financial Ops",
      confidence: 0.984,
      suggested_action: "Issue partial refund for transaction TX-88201",
      latency_ms: 182
    }),
    'lead-qualifier': (query) => ({
      lead_score: 94,
      qualification_tier: "Enterprise Target",
      estimated_acv: "$36,000",
      matched_profile: "B2B SaaS > 100 Employees",
      next_best_action: "Schedule Founder Discovery Call",
      latency_ms: 215
    }),
    'data-extractor': (query) => ({
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
    'meeting-summarizer': (query) => ({
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
      currentAgent = item.getAttribute('data-agent-id');
      
      const agentName = item.querySelector('h4')?.textContent || 'Agent';
      addChatMessage('system', `Switched active agent to: ${agentName}`);
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

    // Simulate Agent execution output
    setTimeout(() => {
      const responseFn = agentResponses[currentAgent] || agentResponses['support-router'];
      const result = responseFn(text);
      addChatMessage('agent', result);
    }, 400);
  }

  chatSendBtn?.addEventListener('click', handleUserMessage);
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserMessage();
  });
});
