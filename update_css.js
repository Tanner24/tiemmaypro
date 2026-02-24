const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const regex = /\/\* =====================================================\r?\n   SETTINGS — New Tab Layout[\s\S]*/;

const newCss = `/* =====================================================
   SETTINGS — Clean Layout
   ===================================================== */

#page-settings {
  /* This ensures the page layout is consistent with others */
  display: flex !important;
  flex-direction: column;
  padding: 2rem 1.75rem; 
  gap: 1.5rem;
  overflow-y: auto;
}

/* ── Navbar Ngang ── */
.set-nav-horizontal {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--border);
  overflow-x: auto;
  align-items: center;
}

.set-nav-horizontal::-webkit-scrollbar {
  display: none;
}

.set-nav-horizontal .set-tab {
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 1rem 1.5rem;
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition);
  position: relative;
}

.set-nav-horizontal .set-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.set-nav-horizontal .set-tab.active {
  color: var(--purple-l);
  font-weight: 700;
  background: rgba(124, 106, 248, 0.08);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.set-nav-horizontal .set-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--purple-l);
  box-shadow: 0 -2px 10px rgba(124,106,248,0.5);
}

/* ── Content Card (Khung nội dung chính sáng sủa) ── */
.settings-content-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  min-height: 50vh;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* ── Panel Styles ── */
.set-panel {
  display: none;
  animation: fadeIn 0.3s ease;
  flex-direction: column;
  gap: 1.5rem;
}

.set-panel.active {
  display: flex;
}

.set-panel-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px dashed var(--border-light);
  padding-bottom: 1rem;
}

.set-panel-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.set-panel-header p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* ── Elements Inside Panel ── */
.set-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.gs-conn-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(13, 15, 26, 0.5); /* Sáng hơn nền tẹo */
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.gs-conn-bar.online {
  background: rgba(61, 220, 132, 0.05);
  border-color: rgba(61, 220, 132, 0.3);
}

.gs-stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.gs-stat-card {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.gs-stat-val {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--purple-l);
}

.gs-stat-lbl {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Data Grid ── */
.set-data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

.set-data-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.set-data-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
}

.set-data-card.danger:hover {
  background: rgba(255, 95, 109, 0.1);
  border-color: rgba(255, 95, 109, 0.5);
}

.set-data-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.set-data-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.set-data-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* ── About Card ── */
.set-about-card {
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  border: 1px solid var(--border);
  text-align: center;
  width: 100%;
  max-width: 500px;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
}

.set-about-logo {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.set-about-name {
  font-size: 1.6rem;
  font-weight: 800;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.set-about-tagline {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.set-about-rows {
  border-top: 1px dashed var(--border-light);
  text-align: left;
}

.set-about-row {
  display: flex;
  justify-content: space-between;
  padding: 0.85rem 0;
  border-bottom: 1px dashed var(--border-light);
  font-size: 0.95rem;
}

.set-about-row span {
  color: var(--text-secondary);
}

.set-about-row strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Helper cho Code.gs popup */
.gs-wizard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gs-step {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.gs-step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--purple);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
  font-size: 0.8rem;
}

.gs-step-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
  color: var(--purple-l);
}

.gs-step-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .set-form-grid, .gs-stat-row, .set-data-grid {
    grid-template-columns: 1fr;
  }
}
`;

if (regex.test(css)) {
    css = css.replace(regex, newCss);
    fs.writeFileSync('style.css', css);
    console.log('CSS updated successfully!');
} else {
    console.log('Regex failed to match');
}
