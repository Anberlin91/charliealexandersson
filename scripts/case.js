// case.js — reads the JSON file for this page and builds the content

async function loadCase() {
  const page = window.location.pathname.split('/').pop().replace('.html', '');
  const res = await fetch(`data/${page}.json`);
  const d = await res.json();

  // ── TITLE & META ──────────────────────────────
  document.title = `${d.title} – Charlie Alexandersson`;
  document.getElementById('cs-title').textContent = d.title;
  document.getElementById('cs-subtitle').textContent = d.subtitle;
  document.getElementById('cs-cover').src = d.cover;
  document.getElementById('cs-cover').alt = d.title;

  document.getElementById('cs-meta-role').textContent = d.meta.role;
  document.getElementById('cs-meta-type').textContent = d.meta.type;
  document.getElementById('cs-meta-context').textContent = d.meta.context;

  const skillsEl = document.getElementById('cs-meta-skills');
  skillsEl.innerHTML = d.meta.skills.map(s => `<span class="tag">${s}</span>`).join('');

  const linksEl = document.getElementById('cs-links');
  linksEl.innerHTML = (d.links || [])
    .map(l => `<a href="${l.url}" target="_blank" class="${l.primary ? 'primary' : ''}">${l.label}</a>`)
    .join('');

  // ── SECTIONS ──────────────────────────────────
  const sectionOrder = ['intro', 'role', 'problem', 'approach', 'interactionSystem', 'controllerMap', 'outcome', 'unrealPrototyping', 'keyLearning'];
  const sectionLabels = {
    intro: 'Intro',
    role: 'Role',
    problem: 'Problem',
    approach: 'Approach',
    interactionSystem: 'Interaction System',
    controllerMap: 'Console Mapping',
    outcome: 'Outcome',
    unrealPrototyping: 'Prototyping in Unreal',
    keyLearning: 'Key Learning'
  };

  const sectionsEl = document.getElementById('cs-sections');
  sectionsEl.innerHTML = '';

  sectionOrder.forEach(key => {
    const s = d.sections[key];
    if (!s) return;

    // ── Special: controllerMap ──
    if (key === 'controllerMap') {
      const buttons = s.controls.map(c => `
        <div class="ctrl-row">
          <span class="ctrl-btn">${c.button}</span>
          <span class="ctrl-action">${c.action}</span>
        </div>`).join('');
      sectionsEl.innerHTML += `
        <section class="case-section">
          <div class="p-container">
            <p class="case-label">Console Mapping</p>
            <h2>${s.heading}</h2>
            ${s.body ? `<p>${s.body}</p>` : ''}
            <div class="ctrl-grid">${buttons}</div>
          </div>
        </section>`;
      return;
    }

    // Split body on \n\n for paragraphs
    const paragraphs = s.body
      .split('\n\n')
      .map(p => `<p>${p.trim()}</p>`)
      .join('');

    // Optional bullets
    const bullets = s.bullets
      ? `<div class="case-highlight"><ul>${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>`
      : '';

    // Optional cards (2-col or 3-col)
    let cards = '';
    if (s.cards) {
      const colClass = s.cards.length === 3 ? 'case-three-col' : 'case-two-col';
      cards = `<div class="${colClass}">${s.cards.map(c =>
        `<div class="col-block"><h4>${c.title}</h4><p>${c.body}</p></div>`
      ).join('')}</div>`;
    }

    // Optional single image
    const image = s.image
      ? `<img src="${s.image.src}" alt="${s.image.alt}" class="case-image" style="object-fit:contain;" />`
      : '';

    // Optional multiple images with captions
    const images = s.images
      ? s.images.map(img => `
          <figure style="margin-top:1.5rem;">
            <img src="${img.src}" alt="${img.alt}" class="case-image" style="object-fit:contain; margin-top:0;" />
            <figcaption style="font-size:0.72rem; letter-spacing:0.08em; color:var(--text-secondary); opacity:0.7; margin-top:0.5rem;">${img.alt}</figcaption>
          </figure>`).join('')
      : '';

    sectionsEl.innerHTML += `
      <section class="case-section">
        <div class="p-container">
          <p class="case-label">${sectionLabels[key]}</p>
          <h2>${s.heading}</h2>
          ${paragraphs}
          ${bullets}
          ${cards}
          ${image}
          ${images}
        </div>
      </section>`;
  });

  // ── NAV ───────────────────────────────────────
  const navEl = document.getElementById('cs-nav');
  navEl.innerHTML = `
    ${d.nav.prev ? `<a href="${d.nav.prev.url}">&larr; ${d.nav.prev.label}</a>` : '<span></span>'}
    ${d.nav.next ? `<a href="${d.nav.next.url}" class="next">${d.nav.next.label} &rarr;</a>` : ''}
  `;
}

loadCase();
