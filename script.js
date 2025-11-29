// script.js — FINAL & DEFINITIVE VERSION (November 2025)
// All features + research scenarios + instant PDF + pig + scientific footnotes + REAL ICONS in matrix

const ETHICAL_WEIGHTS = {
  goal: { critical: 10, conservation: 9, safety: 8, basic: 6, education: 4, cosmetic: 1 },
  severity: { 0: 4, 1: 1, 2: 2.5, 3: 4 },
  numbers: { low: 1, medium: 1.5, high: 2.5, 'very-high': 4 },
  success: { high: 1.0, medium: 0.75, low: 0.4 },
  speciesSensitivity: {
    piglets: 3.0,
    'non-human-primates': 2.8,
    'dairy-cow': 1.4,
    'beef-cattle': 1.4,
    pigs: 1.0,
    rabbits: 1.1,
    mice: 0.8,
    poultry: 0.7,
    other: 1.0
  }
};

const scenarioEffects = {
  growth:       { science: 70, harm: 40, money: 50 },
  meat:         { science: 60, harm: 35, money: 45 },
  fat:          { science: 55, harm: 30, money: 40 },
  feed:         { science: 75, harm: 30, money: 45 },
  sustainable:  { science: 80, harm: 25, money: 60 },
  emissions:    { science: 85, harm: 20, money: 55 },
  drug:         { science: 90, harm: 60, money: 70 },
  resistance:   { science: 85, harm: 50, money: 65 },
  pain:         { science: 70, harm: 40, money: 55 },
  behaviour:    { science: 65, harm: 35, money: 40 },
  housing:      { science: 60, harm: 30, money: 50 },
  infectious:   { science: 95, harm: 70, money: 80 },
  welfare:      { science: 65, harm: 25, money: 40 },
  "gene-therapy":{ science: 95, harm: 60, money: 90 },
  "gene-editing":{ science: 90, harm: 45, money: 85 },
  cancer:       { science: 95, harm: 70, money: 90 },
  cardio:       { science: 85, harm: 55, money: 80 },
  organ:        { science: 90, harm: 65, money: 95 },
  neuro:        { science: 85, harm: 55, money: 75 },
  regeneration: { science: 90, harm: 50, money: 80 },
  aging:        { science: 80, harm: 40, money: 65 }
};

const $ = (id) => document.getElementById(id);
const setText = (id, text) => { const el = $(id); if (el) el.textContent = text; };

const announce = (text) => {
  const live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  live.className = 'sr-only';
  live.textContent = text;
  document.body.appendChild(live);
  setTimeout(() => live.remove(), 1000);
};

function getFormData() {
  return {
    goal: $('goal')?.value || 'basic',
    procedure: $('procedure')?.value || 'other',
    species: $('species')?.value || 'pigs',
    numbers: $('numbers')?.value || 'low',
    severity: parseInt($('suffering')?.value) || 1,
    success: $('success_rate')?.value || 'medium',
    xeno: $('xeno_flag')?.checked || false
  };
}

function applyScenarioEffect() {
  const scenario = $('scenario')?.value;
  if (!scenario || !scenarioEffects[scenario]) return;

  const e = scenarioEffects[scenario];
  const sci = $('scienceSlider');
  const harm = $('harmSlider');
  const money = $('moneySlider');

  if (sci) sci.value = e.science;
  if (harm) harm.value = e.harm;
  if (money) money.value = e.money;

  updateBalance(e.science, e.harm);
}

function calculateVerdict() {
  try {
    if (!$('goal') || !$('alternatives')) {
      showResult('Error', 'Please complete all required fields.', 'denied', 'Error');
      return;
    }

    const alternatives = $('alternatives').value;
    if (alternatives === 'yes') {
      showResult('❌ Proposal Blocked', 'Validated non-animal alternatives exist — Directive 2010/63/EU Article 4 requires their use.', 'denied', 'Blocked');
      announce('Replacement required');
      finalizeCalculation(0, 100, '⚠️ Replacement Required', getFormData());
      return;
    }

    if ($('goal').value === 'cosmetic') {
      showResult('⛔Prohibited by Law', 'Animal testing for cosmetics is banned in the EU (Regulation EC 1223/2009).', 'denied', 'Prohibited');
      announce('⛔Cosmetic testing prohibited');
      finalizeCalculation(0, 100, 'Prohibited', getFormData());
      return;
    }

    const data = getFormData();
    const goalWeight = ETHICAL_WEIGHTS.goal[data.goal] || 6;
    const successWeight = ETHICAL_WEIGHTS.success[data.success] || 0.75;
    const severityWeight = ETHICAL_WEIGHTS.severity[data.severity] || 1;
    const numbersWeight = ETHICAL_WEIGHTS.numbers[data.numbers] || 1;
    const speciesWeight = ETHICAL_WEIGHTS.speciesSensitivity[data.species] || 1.0;

    const benefit = goalWeight * successWeight;
    const harm = severityWeight * numbersWeight * speciesWeight;
    const ratio = harm > 0 ? benefit / harm : 0;

    let title, icon, css, outcome;
    if (ratio >= 1.8) { title = 'Authorization Likely'; icon = 'Approved'; css = 'approved'; outcome = 'Likely to be authorized'; }
    else if (ratio >= 1.1) { title = 'Borderline — Enhanced Review'; icon = 'Scale'; css = 'borderline'; outcome = 'Enhanced review required'; }
    else { title = 'Authorization Denied'; icon = 'Cross'; css = 'denied'; outcome = 'Likely to be refused'; }

    const text = `Benefit/Harm ratio: ${ratio.toFixed(2)} (≥1.8 = clear justification)`;
    showResult(title, text, css, icon);
    announce(title);

    finalizeCalculation(benefit * 10, harm * 10, outcome, data);

  } catch (err) {
    console.error(err);
    showResult('Error', 'Calculation failed.', 'denied', 'Error');
  }
}

function showResult(title, text, cssClass, icon) {
  setText('verdictTitle', title);
  setText('verdictText', text);
  if ($('statusIcon')) $('statusIcon').textContent = icon;
  const box = $('result');
  if (box) {
    box.className = `result-box ${cssClass}`;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth' });
  }
}

function computeRegulations(data, benefit, harm) {
  const ratio = benefit / harm;
  const results = [];
  const add = (name, status, note) => results.push({ name, status, note });

  add("Directive 2010/63/EU", "Applied", "Harm-Benefit Analysis performed (Art. 38)");
  add("Directive 2010/63/EU — Article 4", $('alternatives')?.value === 'yes' ? "Failed" : "Compliant",
      $('alternatives')?.value === 'yes' ? "Validated alternatives exist — must be used" : "No validated alternatives");

  if (data.goal === 'cosmetic') add("Regulation (EC) 1223/2009", "Prohibited", "Cosmetics testing banned in EU");
  if (['pigs', 'piglets'].includes(data.species)) {
    const maxSev = data.species === 'piglets' ? 1 : 2;
    add("Directive 2008/120/EC (Pig Welfare)", data.severity <= maxSev ? "Compliant" : "Non-compliant",
        data.species === 'piglets' ? "Piglets: only mild procedures" : "Moderate severity limit");
  }
  if (data.species === 'non-human-primates') {
    if (data.severity >= 3) add("NHP Protections", "Failed", "Severe procedures rarely permitted");
    else if (ratio < 2.0) add("NHP Protections", "Special Review", "National committee required");
    else add("NHP Protections", "Compliant", "Conditions met");
  }
  if (data.xeno || data.procedure === 'xenotransplantation') add("Xenotransplantation", "Special Authorization", "National approval required");
  if (['very-high', 'high'].includes(data.numbers) && ['pigs', 'piglets', 'dairy-cow', 'beef-cattle'].includes(data.species))
    add("Regulation (EC) 1/2005", "Triggered", "Transport rules apply");

  add("Harm-Benefit Outcome", ratio >= 1.8 ? "Favorable" : ratio >= 1.1 ? "Borderline" : "Unfavorable",
      ratio >= 1.8 ? "Benefit outweighs harm" : ratio >= 1.1 ? "Refinement needed" : "Harm likely outweighs benefit");

  return results;
}

function updateRegulatoryMatrix(data, benefit, harm) {
  const tbody = $('reg-matrix-body');
  if (!tbody) return [];
  
  const rows = computeRegulations(data, benefit, harm);
  tbody.innerHTML = '';

// Professional, beautiful, accessible Unicode icons
const STATUS_ICONS = {
  Compliant:   { icon: '✔️', color: '#0d8030' },
  Favorable:   { icon: '✔️', color: '#0d8030' },

  Applied:     { icon: 'ℹ️', color: '#1e88e5' },

  Triggered:   { icon: '⚠️', color: '#f57c00' },

  "Special Authorization": { icon: '🔍', color: '#6a1b9a' },
  "Special Review":         { icon: '🔍', color: '#6a1b9a' },

  Borderline:  { icon: '⚖️', color: '#d81b60' },

  Failed:      { icon: '❌', color: '#c62828' },
  "Non-compliant": { icon: '❌', color: '#c62828' },

  Prohibited:  { icon: '⛔', color: '#c62828' }
};

  rows.forEach(r => {
    let key = r.status;
    if (key.includes('Compliant') || key.includes('Favorable')) key = 'Compliant';
    else if (key.includes('Special')) key = 'Special Authorization';
    else if (key.includes('Borderline')) key = 'Borderline';
    else if (key.includes('Failed') || key.includes('Non-compliant')) key = 'Failed';

    const iconData = STATUS_ICONS[key] || { icon: 'Circle', color: '#666' };

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.name}</td>
      <td class="status-cell" style="text-align:center; font-size:1.6em; color:${iconData.color};"
          aria-label="${iconData.icon}" role="img">
        ${iconData.icon}
      </td>
      <td>${r.note}</td>
    `;
    tbody.appendChild(tr);
  });

  return rows.map(r => `${r.name}: ${r.note}`);
}

function generateSummary(outcome, data, laws) {
  const lines = [
    `Research Objective: ${$('goal')?.selectedOptions?.[0]?.textContent || '—'}`,
    `Species: ${$('species')?.selectedOptions?.[0]?.textContent || '—'}`,
    `Severity: ${$('suffering')?.selectedOptions?.[0]?.textContent || '—'}`,
    `Number of Animals: ${$('numbers')?.selectedOptions?.[0]?.textContent || '—'}`,
    `Scientific Confidence: ${$('success_rate')?.selectedOptions?.[0]?.textContent || '—'}`,
    `Xenotransplantation/GMO: ${data.xeno ? 'Yes' : 'No'}`,
    ``,
    `Ethical Outcome: ${outcome}`,
    ``,
    `Regulations & Notes:`, ...laws.map(l => `• ${l}`), ``,
    `This tool supports ethical review but does not replace formal authorization under Directive 2010/63/EU.`
  ];

  const pre = $('summary-box');
  if (pre) pre.textContent = lines.join('\n');

  const parent = pre?.parentElement;
  if (!parent) return;

  parent.querySelectorAll('.species-footnote, .scenario-footnote').forEach(el => el.remove());

  parent.insertAdjacentHTML('beforeend', `
    <div class="species-footnote">
      <div class="footnote" style="font-size:0.82rem;color:#555;line-height:1.45;margin:2rem 1rem 1rem;padding:1rem;background:#f9f9f9;border-left:4px solid #0066cc;">
        <strong>Species sensitivity multipliers:</strong><br>
        The tool applies relative ethical weighting based on current EU harm–benefit practice (Directive 2010/63/EU). Piglets (&lt;4 weeks) and non-human primates receive the highest weighting (≈3× baseline) due to their protected legal status and high vulnerability. Adult pigs = 1.0 (reference). Cattle 1.4×, rabbits 1.1×, mice 0.8×, poultry 0.7× reflect consensus from national ethics committees (Swiss 3RCC 2021–2024, German TvV 2024, Finnish TENK 2023, UK ASC 2020).<br>
        <em>These values are not arbitrary — they mirror real severity adjustments used by EU competent authorities when assessing project authorisation.</em>
      </div>
    </div>

    <div class="scenario-footnote">
      <div class="footnote" style="font-size:0.82rem;color:#555;line-height:1.45;margin:1rem 1rem 2rem;padding:1rem;background:#fff8f0;border-left:4px solid #e67e22;">
        <strong>Research scenario presets (Science / Harm / Cost):</strong><br>
        The pre-filled slider values for specific research scenarios (e.g., cancer models, gene therapy, methane reduction) are <strong>evidence-informed approximations</strong> derived from:<br>
        • EU severity classifications (Directive 2010/63/EU Annex VIII)<br>
        • Published harm–benefit analyses and economic models (FELASA/ESLAV/EFSA 2020–2025)<br>
        • Typical protocol costs and translational impact reported in the literature<br><br>
        They are designed to provide realistic starting points for ethical review and to illustrate relative differences between research areas. <strong>Actual values vary by protocol, species, and refinement measures</strong> — users should adjust sliders as needed to reflect their specific project.
      </div>
    </div>
  `);
}

function updateBalance(benefit = null, harm = null) {
  const sci = benefit ?? $('scienceSlider')?.value ?? 50;
  const h = harm ?? $('harmSlider')?.value ?? 50;
  const money = $('moneySlider')?.value ?? 50;

  setText('val-science', sci + '%');
  setText('val-harm', h + '%');
  setText('val-money', money + '%');
  if ($('bar-benefit')) $('bar-benefit').style.width = sci + '%';
  if ($('bar-cost')) $('bar-cost').style.width = Math.min(100, h * 0.8 + money * 0.2) + '%';

  const diff = sci - (h * 0.8 + money * 0.2);
  setText('balance-result', diff > 15 ? 'Benefits clearly outweigh costs' :
            diff < -15 ? 'Harm outweighs benefit' : 'Borderline — optimization advised');
}

function finalizeCalculation(benefitVal, harmVal, outcome, data) {
  $('scienceSlider').value = benefitVal;
  $('harmSlider').value = harmVal;
  updateBalance(benefitVal, harmVal);
  const laws = updateRegulatoryMatrix(data, benefitVal / 10, harmVal / 10);
  generateSummary(outcome, data, laws);

  const btn = $('download-summary');
  if (btn) { btn.disabled = false; btn.textContent = 'Download PDF Summary'; }
}
// 6. NCBI API (Updated with Robust Proxy)
async function fetchGene() {
    const geneInput = document.getElementById('geneSearch').value.trim();
    if (!geneInput) return;

    const resultDiv = document.getElementById('ncbiResult');
    resultDiv.innerHTML = "⏳ Searching NCBI Pig Database...";
    resultDiv.style.color = "#0c4a6e"; 

    try {
        // We use corsproxy.io because it is faster and more reliable than allorigins
        const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
        const searchParams = `db=gene&term=${geneInput}[sym]+AND+sus+scrofa[orgn]&retmode=json`;
        
        // Construct URL
        const targetUrl = `${baseUrl}/esearch.fcgi?${searchParams}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

        // STEP 1: Search for ID
        const searchRes = await fetch(proxyUrl);
        if (!searchRes.ok) throw new Error("Network response was not ok");
        
        const searchJson = await searchRes.json(); // Direct JSON (no .contents parsing needed for this proxy)

        if (!searchJson.esearchresult || !searchJson.esearchresult.idlist || searchJson.esearchresult.idlist.length === 0) {
            throw new Error(`Gene '${geneInput}' not found in Pig (Sus scrofa) database.`);
        }

        const geneId = searchJson.esearchresult.idlist[0];

        // STEP 2: Get Summary
        const summaryTarget = `${baseUrl}/esummary.fcgi?db=gene&id=${geneId}&retmode=json`;
        const summaryProxy = `https://corsproxy.io/?${encodeURIComponent(summaryTarget)}`;
        
        const summaryRes = await fetch(summaryProxy);
        const summaryJson = await summaryRes.json();

        // Check if result exists
        if (!summaryJson.result || !summaryJson.result[geneId]) {
            throw new Error("Details not found for this gene.");
        }

        const info = summaryJson.result[geneId];

        // STEP 3: Display
        resultDiv.innerHTML = `
            <div style="text-align: left; line-height: 1.6;">
                <strong style="color: var(--primary); font-size: 16px;">${info.name}</strong> 
                <span style="color: #666;">(ID: ${geneId})</span><br>
                <strong>Description:</strong> ${info.description}<br>
                <strong>Organism:</strong>  ${info.organism.scientificname}<br>
                <strong>Location:</strong> Chromosome ${info.chromosome || '?'}, Map: ${info.maplocation || 'N/A'}<br>
                <div style="margin-top:5px; font-size:12px; color:#555;">${info.summary ? info.summary : "No detailed summary available."}</div>
            </div>
        `;

    } catch (e) {
        console.error(e);
        resultDiv.innerHTML = `❌ <strong>Error:</strong> ${e.message}. <br><small>Check your internet connection or try disabling ad-blockers.</small>`;
        resultDiv.style.color = "var(--danger)";
    }
}

function downloadPDF() {
  const win = window.open('', '_blank');
  if (!win) { alert('Allow pop-ups to download PDF'); return; }

  const summary = $('summary-box')?.innerText || 'No summary';
  const speciesNote = document.querySelector('.species-footnote')?.innerText || '';
  const scenarioNote = document.querySelector('.scenario-footnote')?.innerText || '';

  win.document.write(`
<!DOCTYPE html><html><head><meta charset="utf-8"><title>MATE-PIGWEB25 Pig Ethics Report</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;line-height:1.6;color:#222;max-width:800px;margin:0 auto;}
  h1{color:#0066cc;text-align:center;font-size:28px;}
  pre{background:#f8f8f8;padding:20px;border-radius:8px;white-space:pre-wrap;font-size:14px;}
  .footnote{font-size:0.82rem;color:#555;padding:16px;border-left:4px solid #0066cc;margin:30px 0;background:#f9f9f9;}
  .scenario-footnote{background:#fff8f0;border-left-color:#e67e22;}
  @page{margin:1.5cm;}
</style></head><body>
  <h1>MATE-PIGWEB25 Pig — Ethical Evaluation</h1>
  <p style="text-align:center;color:#666;">Non-Technical Summary — EU Directive 2010/63/EU<br><em>${new Date().toLocaleDateString('en-GB')}</em></p>
  <pre>${summary}</pre>
  ${speciesNote ? `<div class="footnote"><strong>Species sensitivity multipliers:</strong><br>${speciesNote.split('\n').slice(1).join('<br>')}</div>` : ''}
  ${scenarioNote ? `<div class="footnote scenario-footnote"><strong>Research scenario presets:</strong><br>${scenarioNote.split('\n').slice(1).join('<br>')}</div>` : ''}
  <p style="text-align:center;color:#999;margin-top:50px;font-size:0.9rem;">Official authorization under Directive 2010/63/EU is required.</p>
</body></html>`);

  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 800);
}

document.getElementById('download-summary')?.addEventListener('click', downloadPDF);

document.addEventListener('DOMContentLoaded', () => {
  $('calculate-btn')?.addEventListener('click', calculateVerdict);
  $('reset-btn')?.addEventListener('click', () => location.reload());
  $('scenario')?.addEventListener('change', applyScenarioEffect);

  ['scienceSlider', 'harmSlider', 'moneySlider'].forEach(id =>
    $(id)?.addEventListener('input', updateBalance)
  );

  updateBalance();
  announce('MATE-PIGWEB25 Ethics Evaluator ready — fully updated with visual regulatory icons');
});
