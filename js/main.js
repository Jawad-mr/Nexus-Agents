// ===================================================================
// NEXUS AGENTS — DASHBOARD JS (ROBUST FRONTEND INTERACTION & AGENT SIMULATION)
// ===================================================================

const WA_NUMBER = "917204351696";

function formatWaLink(customMessage) {
  const defaultMsg = "Hi Nexus Agents team, I would like to discuss custom AI agent development for our business.";
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

document.addEventListener('DOMContentLoaded', () => {

  // 0. Theme Manager (Default dark theme with smooth toggle)
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }

  const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
  setTheme(savedTheme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  });

  // 1. Mobile Sidebar Navigation System
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sb-overlay');
  const sbToggles = document.querySelectorAll('.sb-toggle, .mbb-toggle');

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  sbToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  });

  overlay?.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
      closeSidebar();
    }
  });

  // 2. Format WhatsApp & Phone Links
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
  const findingCards = document.querySelectorAll('.finding-card, .finding-row');
  const searchInput = document.querySelector('.findings-search input, .topbar-search input');

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
        card.style.display = card.classList.contains('finding-row') ? 'flex' : 'block';
        card.style.opacity = '1';
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

  if (window.location.pathname.includes('findings.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || '';
    if (q && searchInput) {
      searchInput.value = q;
      filterFindings();
    }
  }

  // 6. Comprehensive Product & Playground Agent Simulator
  const agentItems = document.querySelectorAll('.agent-select-item');
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.querySelector('.chat-input-area input');
  const chatSendBtn = document.querySelector('.chat-input-area button');

  const agentResponses = {
    'support': () => ({
      ticket_id: "TICK-" + Math.floor(1000 + Math.random() * 9000),
      sentiment: "Urgent Customer Inquiry",
      intent: "Order Tracking & Refund Policy",
      routed_department: "Tier-1 Customer Support",
      confidence: 0.994,
      suggested_action: "Provide automated tracking link & dispatch return authorization form.",
      latency_ms: 142
    }),
    'sales': () => ({
      lead_score: 94,
      qualification_tier: "Enterprise Target",
      estimated_budget: "$25,000 / yr",
      matched_crm_deal: "DEAL-8832",
      next_best_action: "Schedule Founder Discovery Call via Calendly",
      latency_ms: 188
    }),
    'voice': () => ({
      call_status: "Transcribed & Answered",
      caller_intent: "Appointment Reschedule",
      sentiment_score: 0.96,
      speech_latency_ms: 110,
      action_taken: "Updated Google Calendar slot to Friday 3:00 PM and sent SMS confirmation."
    }),
    'content': () => ({
      content_type: "SEO Blog Post & Social Snippets",
      seo_optimization_score: "98/100",
      readability: "Grade 8 (High Engagement)",
      keywords_matched: ["AI Automation", "Workflow Engines", "n8n Agents"],
      latency_ms: 290
    }),
    'resume': () => ({
      match_score: "92%",
      key_skills_found: ["Python", "n8n Workflows", "REST APIs", "LLM Fine-Tuning"],
      gap_analysis: "Consider adding AWS / Cloud deployment certification.",
      interview_readiness: "High"
    }),
    'shopping': () => ({
      cart_analysis: "3 Items Selected",
      cross_sell_recommendations: ["Matching Leather Belt", "Slim Wallet"],
      discount_applied: "SAVE10",
      checkout_friction_score: "Low (0.04)"
    }),
    'study': () => ({
      document_parsed: "Chapter 4 — Quantum Mechanics.pdf",
      key_concepts_extracted: ["Wave-particle duality", "Schrödinger Equation", "Heisenberg Uncertainty"],
      quiz_generated: "5 Flashcards & 3 Practice MCQs ready."
    }),
    'legal': () => ({
      document_type: "Master Services Agreement (MSA)",
      risk_flags: ["Indemnity Cap Exceeded in Sec 8.2", "Non-compete term set to 36 months"],
      compliance_rating: "Requires Revision"
    }),
    'clinic': () => ({
      patient_triage_level: "Moderate (Non-Emergency)",
      matched_symptoms: ["Mild Fever", "Seasonal Allergies"],
      suggested_slot: "Tomorrow at 10:30 AM with Dr. Smith",
      hipaa_compliance: "Verified 100%"
    }),
    'finance': () => ({
      audit_status: "Approved",
      extracted_vendor: "Stripe Invoice #9021",
      tax_deductible: true,
      anomaly_detected: false,
      reconciliation_latency_ms: 95
    }),
    'website': () => ({
      site_template: "Modern Obsidian Agency",
      pages_generated: ["Home", "Features", "Pricing", "Contact"],
      seo_meta_tags: "Configured automatically",
      build_time_s: 1.4
    }),
    'meetings': () => ({
      meeting_title: "Product Roadmap Sync",
      action_items: ["Finalize v2.0 boxy redesign", "Deploy webhook triggers to production"],
      transcript_summary: "Approved sharp n8n aesthetic and full product fleet linking."
    }),
    'recruitment': () => ({
      candidate_name: "Sarah Jenkins",
      resume_fit: "Senior Full-Stack Engineer",
      parsed_experience: "6 Years (React, Node, Python)",
      screening_quiz_result: "Passed (18/20)"
    }),
    'email': () => ({
      email_intent: "Cold Outreach / Partnership Inquiry",
      spam_score: "0.01 (Inbox Ready)",
      suggested_followup_days: 3,
      tone_analysis: "Professional & High Value"
    })
  };

  // Determine current active product or simulator
  const pageSimulator = document.querySelector('[data-agent-type]');
  let currentAgent = pageSimulator ? pageSimulator.getAttribute('data-agent-type') : 'support';

  agentItems.forEach(item => {
    item.addEventListener('click', () => {
      agentItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentAgent = item.getAttribute('data-agent-id') || item.getAttribute('data-agent-type') || 'support';
      
      const agentName = item.querySelector('h4, h3')?.textContent || 'Agent';
      addChatMessage('system', `Switched active agent simulation to: ${agentName}`);
    });
  });

  function addChatMessage(sender, content) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;

    if (typeof content === 'object') {
      msgDiv.innerHTML = `<strong>Structured Output (${currentAgent.toUpperCase()} AGENT):</strong><pre style="margin-top:6px; font-family:var(--font-mono); font-size:0.8rem; background:rgba(0,0,0,0.2); padding:8px;">${JSON.stringify(content, null, 2)}</pre>`;
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
      const responseFn = agentResponses[currentAgent] || agentResponses['support'];
      const result = responseFn();
      addChatMessage('agent', result);
    }, 300);
  }

  chatSendBtn?.addEventListener('click', handleUserMessage);
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserMessage();
  });

  // 5. Lovable-inspired Homepage Prompt Console Logic
  const homeForm = document.getElementById('homePromptForm');
  const homeInput = document.getElementById('homePromptInput');
  const agentSelect = document.getElementById('agentSelectType');
  const shortcutTags = document.querySelectorAll('.lovable-shortcut-tag');

  shortcutTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const promptText = tag.getAttribute('data-prompt');
      const agentType = tag.getAttribute('data-type');
      if (homeInput && promptText) homeInput.value = promptText;
      if (agentSelect && agentType) agentSelect.value = agentType;
    });
  });

  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const promptText = homeInput?.value.trim();
      const selectedType = agentSelect?.value || 'support';

      if (!promptText) return;

      sessionStorage.setItem('nexus_initial_prompt', promptText);
      
      const targetPage = `${selectedType}.html`;
      window.location.href = targetPage;
    });
  }

  // Auto-fill prompt if navigated from homepage prompt box
  const savedPrompt = sessionStorage.getItem('nexus_initial_prompt');
  if (savedPrompt && chatInput) {
    chatInput.value = savedPrompt;
    sessionStorage.removeItem('nexus_initial_prompt');
  }
});

