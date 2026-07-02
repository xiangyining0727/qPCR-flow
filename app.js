const AUTO = "__auto__";
const KEY_SEP = "\u001f";

const els = {
  rawInput: document.getElementById("rawInput"),
  fileInput: document.getElementById("fileInput"),
  exampleBtn: document.getElementById("exampleBtn"),
  clearBtn: document.getElementById("clearBtn"),
  inferBtn: document.getElementById("inferBtn"),
  calculateBtn: document.getElementById("calculateBtn"),
  appStatus: document.getElementById("appStatus"),
  analysisActions: document.getElementById("analysisActions"),
  parseStatus: document.getElementById("parseStatus"),
  sampleCount: document.getElementById("sampleCount"),
  mappingBody: document.getElementById("mappingBody"),
  resultTable: document.getElementById("resultTable"),
  metrics: document.getElementById("metrics"),
  copyEmailBtn: document.getElementById("copyEmailBtn"),
  copyEmailStatus: document.getElementById("copyEmailStatus"),
  prepSection: document.getElementById("prepSection"),
  analysisSection: document.getElementById("analysisSection"),
  prepStatus: document.getElementById("prepStatus"),
  prepNote: document.getElementById("prepNote"),
  prepMetrics: document.getElementById("prepMetrics"),
  primerMixBody: document.getElementById("primerMixBody"),
  templateMixBody: document.getElementById("templateMixBody"),
  reagentTotalBody: document.getElementById("reagentTotalBody"),
  plateSummary: document.getElementById("plateSummary"),
  plateDesign: document.getElementById("plateDesign"),
  prepSampleGroups: document.getElementById("prepSampleGroups"),
  prepBioReplicates: document.getElementById("prepBioReplicates"),
  prepGeneCount: document.getElementById("prepGeneCount"),
  prepTechReplicates: document.getElementById("prepTechReplicates"),
  prepPreset: document.getElementById("prepPreset"),
  prepReactionVolume: document.getElementById("prepReactionVolume"),
  prepOverage: document.getElementById("prepOverage"),
  prepForward: document.getElementById("prepForward"),
  prepReverse: document.getElementById("prepReverse"),
  prepMix: document.getElementById("prepMix"),
  prepCdna: document.getElementById("prepCdna"),
  prepWater: document.getElementById("prepWater"),
  prepAutoWater: document.getElementById("prepAutoWater"),
  sampleColumn: document.getElementById("sampleColumn"),
  geneColumn: document.getElementById("geneColumn"),
  ctColumn: document.getElementById("ctColumn"),
  groupColumn: document.getElementById("groupColumn"),
  bioColumn: document.getElementById("bioColumn"),
  techColumn: document.getElementById("techColumn"),
  referenceGene: document.getElementById("referenceGene"),
  controlGroup: document.getElementById("controlGroup"),
  pvalueMethod: document.getElementById("pvalueMethod"),
  plotPanel: document.getElementById("plotPanel"),
  resultWrap: document.getElementById("resultWrap"),
  downloadSummary: document.getElementById("downloadSummary"),
  downloadDetail: document.getElementById("downloadDetail"),
  downloadRaw: document.getElementById("downloadRaw"),
  downloadAll: document.getElementById("downloadAll"),
};

const columnSelects = [
  "sampleColumn",
  "geneColumn",
  "ctColumn",
  "groupColumn",
  "bioColumn",
  "techColumn",
];

const prepInputIds = [
  "prepSampleGroups",
  "prepBioReplicates",
  "prepGeneCount",
  "prepTechReplicates",
  "prepPreset",
  "prepReactionVolume",
  "prepOverage",
  "prepForward",
  "prepReverse",
  "prepMix",
  "prepCdna",
  "prepWater",
  "prepAutoWater",
];

const state = {
  headers: [],
  rawRows: [],
  sampleMeta: new Map(),
  sampleOrder: [],
  activeView: "summary",
  results: null,
};

let applyingPrepPreset = false;

const headerAliases = {
  sample: ["样本名", "样品名", "样本", "sample", "samplename", "sample name", "well sample"],
  gene: ["基因名称", "基因名", "靶标", "target", "targetname", "target name", "gene", "assay"],
  ct: ["ct", "cq", "cp", "ct值", "cq值", "ct mean", "ctmean", "平均ct", "平均cq"],
  group: ["组别", "实验组", "分组", "group", "condition", "treatment"],
  bio: ["生物重复", "生物学重复", "biorep", "bio rep", "biologicalreplicate", "biological replicate"],
  tech: ["技术重复", "技术学重复", "techrep", "tech rep", "technicalreplicate", "technical replicate"],
};

const exampleData = [
  "样本名\t基因名称\t任务\t报告基因\t淬灭基团\tCT",
  "WT1\tRefGene\tUNKNOWN\tSYBR\tNone\t21.273",
  "WT1\tRefGene\tUNKNOWN\tSYBR\tNone\t21.147",
  "WT2\tRefGene\tUNKNOWN\tSYBR\tNone\t20.428",
  "WT2\tRefGene\tUNKNOWN\tSYBR\tNone\t20.173",
  "WT3\tRefGene\tUNKNOWN\tSYBR\tNone\t19.165",
  "WT3\tRefGene\tUNKNOWN\tSYBR\tNone\t19.273",
  "CKO1\tRefGene\tUNKNOWN\tSYBR\tNone\t19.260",
  "CKO1\tRefGene\tUNKNOWN\tSYBR\tNone\t18.925",
  "CKO2\tRefGene\tUNKNOWN\tSYBR\tNone\t19.183",
  "CKO2\tRefGene\tUNKNOWN\tSYBR\tNone\t19.123",
  "CKO3\tRefGene\tUNKNOWN\tSYBR\tNone\t18.608",
  "CKO3\tRefGene\tUNKNOWN\tSYBR\tNone\t18.412",
  "WT1\tTargetGene1\tUNKNOWN\tSYBR\tNone\t28.730",
  "WT1\tTargetGene1\tUNKNOWN\tSYBR\tNone\t28.601",
  "WT2\tTargetGene1\tUNKNOWN\tSYBR\tNone\t27.821",
  "WT2\tTargetGene1\tUNKNOWN\tSYBR\tNone\t27.720",
  "WT3\tTargetGene1\tUNKNOWN\tSYBR\tNone\t27.966",
  "WT3\tTargetGene1\tUNKNOWN\tSYBR\tNone\t27.781",
  "CKO1\tTargetGene1\tUNKNOWN\tSYBR\tNone\t25.183",
  "CKO1\tTargetGene1\tUNKNOWN\tSYBR\tNone\t25.047",
  "CKO2\tTargetGene1\tUNKNOWN\tSYBR\tNone\t25.612",
  "CKO2\tTargetGene1\tUNKNOWN\tSYBR\tNone\t25.405",
  "CKO3\tTargetGene1\tUNKNOWN\tSYBR\tNone\t25.358",
  "CKO3\tTargetGene1\tUNKNOWN\tSYBR\tNone\t25.229",
].join("\n");

function normalizeHeader(value) {
  return String(value ?? "")
    .replace(/^\ufeff/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-./()（）]/g, "");
}

function cleanCell(value) {
  return String(value ?? "").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function detectDelimiter(line) {
  const candidates = ["\t", ",", ";"];
  const scores = candidates.map((delimiter) => ({
    delimiter,
    count: countDelimiterOutsideQuotes(line, delimiter),
  }));
  scores.sort((a, b) => b.count - a.count);
  return scores[0].count > 0 ? scores[0].delimiter : "whitespace";
}

function countDelimiterOutsideQuotes(line, delimiter) {
  let count = 0;
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      count += 1;
    }
  }
  return count;
}

function parseLine(line, delimiter) {
  if (delimiter === "whitespace") {
    return line.trim().split(/\s+/);
  }

  const values = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values.map((cell) => cell.trim());
}

function parseRawText(text) {
  const lines = text
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (!lines.length) {
    return { headers: [], rows: [] };
  }

  const delimiter = detectDelimiter(lines[0]);
  const records = lines.map((line) => parseLine(line, delimiter));
  const headers = records[0].map((header) => header.replace(/^\ufeff/, "").trim());
  const rows = records.slice(1).map((values, index) => {
    const padded = [...values];
    while (padded.length < headers.length) {
      padded.push("");
    }
    return {
      rowNumber: index + 2,
      values: padded.slice(0, headers.length),
    };
  });

  return { headers, rows };
}

function findColumnIndex(kind, headers = state.headers) {
  const aliases = new Set(headerAliases[kind].map(normalizeHeader));
  const normalizedHeaders = headers.map(normalizeHeader);
  const exact = normalizedHeaders.findIndex((header) => aliases.has(header));
  if (exact >= 0) {
    return exact;
  }

  return normalizedHeaders.findIndex((header) => {
    return [...aliases].some((alias) => header.includes(alias) || alias.includes(header));
  });
}

function option(label, value) {
  const element = document.createElement("option");
  element.value = value;
  element.textContent = label;
  return element;
}

function numberInputValue(id, fallback = 0) {
  const value = Number(els[id].value);
  return Number.isFinite(value) ? value : fallback;
}

function integerInputValue(id, fallback = 1) {
  return Math.max(1, Math.round(numberInputValue(id, fallback)));
}

function formatVolume(value) {
  if (!Number.isFinite(value)) return "";
  if (value === 0) return "0";
  if (value < 10) return value.toFixed(2).replace(/\.?0+$/g, "");
  return value.toFixed(1).replace(/\.?0+$/g, "");
}

function reactionLabel(baseReactions, overagePercent) {
  const planned = baseReactions * (1 + overagePercent / 100);
  return `${baseReactions} × ${formatNumber(1 + overagePercent / 100, 2)} = ${formatVolume(planned)}`;
}

function setActiveSection(section) {
  const normalized = section === "analysis" ? "analysis" : "prep";
  document.querySelectorAll(".module-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === normalized);
  });

  els.prepSection.hidden = normalized !== "prep";
  els.analysisSection.hidden = normalized !== "analysis";
  els.analysisActions.hidden = normalized !== "analysis";
}

function applyPrepPreset(preset) {
  if (preset === "custom") {
    renderPrepPlan();
    return;
  }

  const volume = Number(preset);
  if (!Number.isFinite(volume) || volume <= 0) {
    return;
  }

  const scale = volume / 10;
  applyingPrepPreset = true;
  els.prepReactionVolume.value = formatVolume(volume);
  els.prepForward.value = formatVolume(0.5 * scale);
  els.prepReverse.value = formatVolume(0.5 * scale);
  els.prepMix.value = formatVolume(5 * scale);
  els.prepCdna.value = formatVolume(1 * scale);
  els.prepAutoWater.checked = true;
  applyingPrepPreset = false;
  renderPrepPlan();
}

function syncPrepWaterToReaction() {
  const autoWater = els.prepAutoWater.checked;
  els.prepWater.disabled = autoWater;

  if (!autoWater) {
    return;
  }

  const reactionVolume = Math.max(0, numberInputValue("prepReactionVolume", 10));
  const usedWithoutWater =
    Math.max(0, numberInputValue("prepForward", 0.5)) +
    Math.max(0, numberInputValue("prepReverse", 0.5)) +
    Math.max(0, numberInputValue("prepMix", 5)) +
    Math.max(0, numberInputValue("prepCdna", 1));
  const water = Math.max(0, reactionVolume - usedWithoutWater);
  els.prepWater.value = formatVolume(water);
}

function calculatePrepPlan() {
  const sampleGroups = integerInputValue("prepSampleGroups");
  const bioReplicates = integerInputValue("prepBioReplicates");
  const geneCount = integerInputValue("prepGeneCount");
  const techReplicates = integerInputValue("prepTechReplicates");
  const reactionVolume = Math.max(0, numberInputValue("prepReactionVolume", 10));
  const overagePercent = Math.max(0, numberInputValue("prepOverage", 10));
  const forward = Math.max(0, numberInputValue("prepForward", 0.5));
  const reverse = Math.max(0, numberInputValue("prepReverse", 0.5));
  const mix = Math.max(0, numberInputValue("prepMix", 5));
  const cdna = Math.max(0, numberInputValue("prepCdna", 1));
  const water = Math.max(0, numberInputValue("prepWater", 3));

  const cdnaSamples = sampleGroups * bioReplicates;
  const totalWells = cdnaSamples * geneCount * techReplicates;
  const reactionsPerGene = cdnaSamples * techReplicates;
  const reactionsPerTemplate = geneCount * techReplicates;
  const overageFactor = 1 + overagePercent / 100;
  const reactionsPerGeneWithOverage = reactionsPerGene * overageFactor;
  const reactionsPerTemplateWithOverage = reactionsPerTemplate * overageFactor;
  const perWellTotal = forward + reverse + mix + cdna + water;

  const primerMix = {
    reactions: reactionsPerGene,
    reactionsWithOverage: reactionsPerGeneWithOverage,
    perWell: forward + reverse + mix,
    forward: forward * reactionsPerGeneWithOverage,
    reverse: reverse * reactionsPerGeneWithOverage,
    mix: mix * reactionsPerGeneWithOverage,
  };
  primerMix.total = primerMix.forward + primerMix.reverse + primerMix.mix;

  const templateMix = {
    reactions: reactionsPerTemplate,
    reactionsWithOverage: reactionsPerTemplateWithOverage,
    perWell: cdna + water,
    cdna: cdna * reactionsPerTemplateWithOverage,
    water: water * reactionsPerTemplateWithOverage,
  };
  templateMix.total = templateMix.cdna + templateMix.water;

  return {
    sampleGroups,
    bioReplicates,
    geneCount,
    techReplicates,
    reactionVolume,
    overagePercent,
    cdnaSamples,
    totalWells,
    reactionsPerGene,
    reactionsPerTemplate,
    perWellTotal,
    primerMix,
    templateMix,
    totals: {
      forward: primerMix.forward * geneCount,
      reverse: primerMix.reverse * geneCount,
      mix: primerMix.mix * geneCount,
      cdna: templateMix.cdna * cdnaSamples,
      water: templateMix.water * cdnaSamples,
    },
  };
}

function renderPrepPlan() {
  syncPrepWaterToReaction();
  const plan = calculatePrepPlan();
  const volumeDiff = Math.abs(plan.perWellTotal - plan.reactionVolume);
  const noteLevel = volumeDiff > 0.01 ? "warn" : "normal";
  const autoWater = els.prepAutoWater.checked;

  els.prepStatus.textContent = `${formatVolume(plan.reactionVolume)} µL 体系`;
  els.prepNote.textContent =
    noteLevel === "warn"
      ? `当前单孔组分合计 ${formatVolume(plan.perWellTotal)} µL，和设定体系 ${formatVolume(plan.reactionVolume)} µL 不一致。`
      : autoWater
        ? `已按 ${formatVolume(plan.reactionVolume)} µL 体系自动补 ddH2O = ${formatVolume(numberInputValue("prepWater"))} µL/孔；配液按 ${formatVolume(plan.overagePercent)}% 余量计算。`
        : `单孔组分合计 ${formatVolume(plan.perWellTotal)} µL；配液按 ${formatVolume(plan.overagePercent)}% 余量计算。`;
  els.prepNote.className = `inline-note${noteLevel === "warn" ? " warn" : ""}`;

  const metricRows = [
    ["cDNA 样本", plan.cdnaSamples],
    ["总孔数", plan.totalWells],
    ["每基因孔数", plan.reactionsPerGene],
    ["每样本孔数", plan.reactionsPerTemplate],
  ];
  els.prepMetrics.innerHTML = metricRows
    .map(
      ([label, value]) => `
        <div class="metric">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");

  els.primerMixBody.innerHTML = `
    <tr>
      <td>每个基因</td>
      <td>${escapeHtml(reactionLabel(plan.primerMix.reactions, plan.overagePercent))}</td>
      <td class="numeric">${formatVolume(plan.primerMix.forward)}</td>
      <td class="numeric">${formatVolume(plan.primerMix.reverse)}</td>
      <td class="numeric">${formatVolume(plan.primerMix.mix)}</td>
      <td class="numeric">${formatVolume(plan.primerMix.perWell)}</td>
      <td class="numeric">${formatVolume(plan.primerMix.total)}</td>
    </tr>
  `;

  els.templateMixBody.innerHTML = `
    <tr>
      <td>每个 cDNA 样本</td>
      <td>${escapeHtml(reactionLabel(plan.templateMix.reactions, plan.overagePercent))}</td>
      <td class="numeric">${formatVolume(plan.templateMix.cdna)}</td>
      <td class="numeric">${formatVolume(plan.templateMix.water)}</td>
      <td class="numeric">${formatVolume(plan.templateMix.perWell)}</td>
      <td class="numeric">${formatVolume(plan.templateMix.total)}</td>
    </tr>
  `;

  const totals = [
    ["Forward primer", plan.totals.forward],
    ["Reverse primer", plan.totals.reverse],
    ["Mix", plan.totals.mix],
    ["cDNA", plan.totals.cdna],
    ["ddH2O", plan.totals.water],
    ["全部反应液", Object.values(plan.totals).reduce((sum, value) => sum + value, 0)],
  ];
  els.reagentTotalBody.innerHTML = totals
    .map(
      ([label, value]) => `
        <tr>
          <td>${escapeHtml(label)}</td>
          <td class="numeric">${formatVolume(value)}</td>
        </tr>
      `,
    )
    .join("");

  renderPlateDesign(plan);
}

function plateGroupInfo(index) {
  const palette = [
    { prefix: "C", label: "对照 (C)", bg: "#dbeeff", fg: "#355c7d" },
    { prefix: "K", label: "处理组 (K)", bg: "#ffd9e4", fg: "#a34f69" },
    { prefix: "G3", label: "实验组 3", bg: "#dbf5ec", fg: "#447b6b" },
    { prefix: "G4", label: "实验组 4", bg: "#eadfff", fg: "#6c5a92" },
    { prefix: "G5", label: "实验组 5", bg: "#fff0c9", fg: "#8f6f26" },
  ];
  return palette[index] || {
    prefix: `G${index + 1}`,
    label: `实验组 ${index + 1}`,
    bg: "#eaf5ff",
    fg: "#56728c",
  };
}

function buildPlateWells(plan) {
  const wells = [];
  for (let groupIndex = 0; groupIndex < plan.sampleGroups; groupIndex += 1) {
    const group = plateGroupInfo(groupIndex);
    for (let bio = 1; bio <= plan.bioReplicates; bio += 1) {
      for (let tech = 1; tech <= plan.techReplicates; tech += 1) {
        wells.push({
          groupIndex,
          group,
          bio,
          tech,
          label: `${group.prefix}${bio}-${tech}`,
        });
      }
    }
  }
  return wells;
}

function geneNameForPlate(index) {
  if (index === 0) return "内参基因";
  return `目标基因 ${index}`;
}

function renderPlateDesign(plan) {
  const wellsPerGene = plan.sampleGroups * plan.bioReplicates * plan.techReplicates;
  const genesOnPlate = Math.min(plan.geneCount, 8);
  const canUseRowLayout = wellsPerGene <= 12;
  const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const wells = buildPlateWells(plan);
  const maxGenes = canUseRowLayout ? 8 : Math.floor(96 / wellsPerGene);
  const warning =
    !canUseRowLayout
      ? `当前每个基因需要 ${wellsPerGene} 孔，超过 12 列；这版行式示意图放不下，需要拆板或减少组数/重复数。`
      : plan.geneCount > 8
        ? `当前设置 ${plan.geneCount} 个基因，96 孔板行式布局最多显示 8 个；其余基因需要第二块板。`
        : "";

  els.plateSummary.textContent = warning
    ? warning
    : `${plan.sampleGroups} 组 × ${plan.bioReplicates} 个生物学重复 × ${plan.techReplicates} 个技术重复 = 每个基因 ${wellsPerGene} 孔；当前可放 ${genesOnPlate} 个基因。`;
  els.plateSummary.className = `plate-summary${warning ? " warn" : ""}`;

  const header = [
    '<div class="plate-cell plate-corner"></div>',
    '<div class="plate-cell plate-corner">基因</div>',
    ...Array.from({ length: 12 }, (_, index) => `<div class="plate-cell plate-col">${index + 1}</div>`),
  ].join("");

  const groupBars = [
    '<div class="plate-cell plate-corner"></div>',
    '<div class="plate-cell plate-corner">分组</div>',
    ...Array.from({ length: 12 }, (_, column) => {
      const well = canUseRowLayout ? wells[column] : null;
      if (!well) return '<div class="plate-cell plate-group-bar plate-empty-well"></div>';
      return `<div class="plate-cell plate-group-bar" style="background:${well.group.bg}; color:${well.group.fg}">${escapeHtml(well.group.label)}</div>`;
    }),
  ].join("");

  const bioBars = [
    '<div class="plate-cell plate-corner"></div>',
    '<div class="plate-cell plate-corner">生物重复</div>',
    ...Array.from({ length: 12 }, (_, column) => {
      const well = canUseRowLayout ? wells[column] : null;
      return well
        ? `<div class="plate-cell plate-bio-bar">B${well.bio}</div>`
        : '<div class="plate-cell plate-bio-bar plate-empty-well"></div>';
    }),
  ].join("");

  const techBars = [
    '<div class="plate-cell plate-corner"></div>',
    '<div class="plate-cell plate-corner">技术重复</div>',
    ...Array.from({ length: 12 }, (_, column) => {
      const well = canUseRowLayout ? wells[column] : null;
      return well
        ? `<div class="plate-cell plate-tech-bar">T${well.tech}</div>`
        : '<div class="plate-cell plate-tech-bar plate-empty-well"></div>';
    }),
  ].join("");

  const rows = rowLetters
    .map((letter, rowIndex) => {
      const activeGene = rowIndex < genesOnPlate && canUseRowLayout;
      const rowTint = `plate-row-tint-${rowIndex % 8}`;
      const geneLabel = activeGene ? geneNameForPlate(rowIndex) : "";
      const cells = Array.from({ length: 12 }, (_, column) => {
        const well = activeGene ? wells[column] : null;
        if (!well) {
          return '<div class="plate-cell plate-well plate-empty-well"></div>';
        }
        return `
          <div class="plate-cell plate-well ${rowTint}" style="color:${well.group.fg}">
            <span class="plate-dot">${escapeHtml(well.label)}</span>
          </div>
        `;
      }).join("");
      return `
        <div class="plate-cell plate-row">${letter}</div>
        <div class="plate-cell plate-gene ${rowTint}">${escapeHtml(geneLabel)}</div>
        ${cells}
      `;
    })
    .join("");

  const footer = `
    <div class="plate-cell plate-corner"></div>
    <div class="plate-cell plate-corner">说明</div>
    <div class="plate-cell plate-bio-bar" style="grid-column: span 12; justify-content: flex-start; padding: 0 12px;">
      C = 对照；K/G = 实验组；数字前半为生物学重复，后半为技术重复。若需要 NTC，可减少目标基因数或另占一行/一列。
    </div>
  `;

  els.plateDesign.innerHTML = `
    <div class="plate-grid">
      ${header}
      ${groupBars}
      ${bioBars}
      ${techBars}
      ${rows}
      ${footer}
    </div>
  `;
}

function populateColumnSelects(force = false) {
  const inferred = {
    sampleColumn: findColumnIndex("sample"),
    geneColumn: findColumnIndex("gene"),
    ctColumn: findColumnIndex("ct"),
    groupColumn: findColumnIndex("group"),
    bioColumn: findColumnIndex("bio"),
    techColumn: findColumnIndex("tech"),
  };

  const optionalLabels = {
    groupColumn: "自动推断",
    bioColumn: "自动推断",
    techColumn: "自动编号",
  };

  columnSelects.forEach((id) => {
    const select = els[id];
    const previous = select.value;
    select.innerHTML = "";

    if (["groupColumn", "bioColumn", "techColumn"].includes(id)) {
      select.appendChild(option(optionalLabels[id], AUTO));
    }

    if (!state.headers.length) {
      select.appendChild(option("无数据", ""));
      select.value = ["groupColumn", "bioColumn", "techColumn"].includes(id) ? AUTO : "";
      return;
    }

    state.headers.forEach((header, index) => {
      select.appendChild(option(header || `Column ${index + 1}`, String(index)));
    });

    const inferredValue = inferred[id] >= 0 ? String(inferred[id]) : AUTO;
    if (!force && previous && [...select.options].some((item) => item.value === previous)) {
      select.value = previous;
    } else if (["groupColumn", "bioColumn", "techColumn"].includes(id)) {
      select.value = inferred[id] >= 0 ? String(inferred[id]) : AUTO;
    } else {
      select.value = inferred[id] >= 0 ? inferredValue : "";
    }
  });
}

function selectedColumn(id) {
  const value = els[id].value;
  if (value === AUTO || value === "") {
    return null;
  }
  const index = Number(value);
  return Number.isInteger(index) ? index : null;
}

function cell(row, columnIndex) {
  if (columnIndex === null || columnIndex === undefined) {
    return "";
  }
  return cleanCell(row.values[columnIndex]);
}

function inferSampleParts(sampleName) {
  const sample = cleanCell(sampleName);
  // 你可以在这里调整样本名拆分规则；当前支持 WT1、CKO_2、Group-3 这类末尾数字格式。
  const match = sample.match(/^(.+?)[\s_-]*([0-9]+)$/);
  if (match) {
    return {
      group: match[1].replace(/[\s_-]+$/g, "") || sample,
      bio: match[2],
    };
  }
  return { group: sample || "Group", bio: sample || "1" };
}

function rebuildSampleMeta(forceInfer = false) {
  const sampleCol = selectedColumn("sampleColumn");
  const geneCol = selectedColumn("geneColumn");
  const groupCol = selectedColumn("groupColumn");
  const bioCol = selectedColumn("bioColumn");
  const nextMeta = new Map();
  const nextOrder = [];

  state.rawRows.forEach((row) => {
    const sample = cell(row, sampleCol);
    if (!sample) {
      return;
    }

    const gene = cell(row, geneCol);
    const inferred = inferSampleParts(sample);
    const group = groupCol !== null ? cell(row, groupCol) || inferred.group : inferred.group;
    const bio = bioCol !== null ? cell(row, bioCol) || inferred.bio : inferred.bio;
    const previous = state.sampleMeta.get(sample);
    const existing = nextMeta.get(sample);

    if (!existing) {
      const meta =
        !forceInfer && previous
          ? { sample, group: previous.group, bio: previous.bio, genes: new Set() }
          : { sample, group, bio, genes: new Set() };
      nextMeta.set(sample, meta);
      nextOrder.push(sample);
    }

    if (gene) {
      nextMeta.get(sample).genes.add(gene);
    }
  });

  state.sampleMeta = nextMeta;
  state.sampleOrder = nextOrder;
}

function parseCt(value) {
  const cleaned = cleanCell(value);
  if (!cleaned || /undetermined|n\/a|na|null/i.test(cleaned)) {
    return null;
  }
  const numeric = Number(cleaned.replace(",", "."));
  return Number.isFinite(numeric) ? numeric : null;
}

function preparedRows() {
  const sampleCol = selectedColumn("sampleColumn");
  const geneCol = selectedColumn("geneColumn");
  const ctCol = selectedColumn("ctColumn");
  const techCol = selectedColumn("techColumn");
  const rows = state.rawRows.map((row) => {
    const sample = cell(row, sampleCol);
    const gene = cell(row, geneCol);
    const ctText = cell(row, ctCol);
    const ct = parseCt(ctText);
    const inferred = inferSampleParts(sample);
    const meta = state.sampleMeta.get(sample) || {
      group: inferred.group,
      bio: inferred.bio,
    };
    const tech = techCol !== null ? cell(row, techCol) : "";
    const notes = [];

    if (!sample) notes.push("missing_sample");
    if (!gene) notes.push("missing_gene");
    if (ct === null) notes.push("invalid_ct");
    if (!meta.group) notes.push("missing_group");
    if (!meta.bio) notes.push("missing_bio_replicate");

    return {
      raw_row: row.rowNumber,
      sample,
      group: meta.group,
      bio_replicate: meta.bio,
      gene,
      ct,
      ct_raw: ctText,
      tech_replicate: tech,
      valid: notes.length === 0,
      note: notes.join(";"),
    };
  });

  const counters = new Map();
  rows.forEach((row) => {
    if (!row.valid || row.tech_replicate) {
      return;
    }
    const key = [row.group, row.bio_replicate, row.gene].join(KEY_SEP);
    const next = (counters.get(key) || 0) + 1;
    counters.set(key, next);
    row.tech_replicate = String(next);
  });

  return rows;
}

function uniqueValues(values) {
  return [...new Set(values.filter((value) => cleanCell(value).length > 0))];
}

function refreshGeneAndGroupControls() {
  const geneCol = selectedColumn("geneColumn");
  const genes = uniqueValues(state.rawRows.map((row) => cell(row, geneCol)));
  const previousReference = els.referenceGene.value;
  els.referenceGene.innerHTML = "";

  if (!genes.length) {
    els.referenceGene.appendChild(option("无可用基因", ""));
  } else {
    genes.forEach((gene) => els.referenceGene.appendChild(option(gene, gene)));
    const defaultReference =
      genes.find((gene) => /gapdh|actb|18s|hprt|tbp|b2m|gusb/i.test(gene)) || genes[0];
    els.referenceGene.value = genes.includes(previousReference) ? previousReference : defaultReference;
  }

  const groups = uniqueValues(state.sampleOrder.map((sample) => state.sampleMeta.get(sample)?.group));
  const previousControl = els.controlGroup.value;
  els.controlGroup.innerHTML = "";

  if (!groups.length) {
    els.controlGroup.appendChild(option("无可用组别", ""));
  } else {
    groups.forEach((group) => els.controlGroup.appendChild(option(group, group)));
    const defaultControl =
      groups.find((group) => /^(wt|control|ctrl|normal|vehicle|mock)$/i.test(group)) ||
      groups.find((group) => /wt|control|ctrl/i.test(group)) ||
      groups[0];
    els.controlGroup.value = groups.includes(previousControl) ? previousControl : defaultControl;
  }
}

function renderMappingTable() {
  els.sampleCount.textContent = `${state.sampleOrder.length} samples`;

  if (!state.sampleOrder.length) {
    els.mappingBody.innerHTML = '<tr><td colspan="4" class="empty-cell">暂无样本</td></tr>';
    return;
  }

  els.mappingBody.innerHTML = state.sampleOrder
    .map((sample, index) => {
      const meta = state.sampleMeta.get(sample);
      const genes = [...meta.genes].join(", ");
      return `
        <tr data-index="${index}">
          <td>${escapeHtml(sample)}</td>
          <td><input class="meta-group" type="text" value="${escapeHtml(meta.group)}" /></td>
          <td><input class="meta-bio" type="text" value="${escapeHtml(meta.bio)}" /></td>
          <td>${escapeHtml(genes)}</td>
        </tr>
      `;
    })
    .join("");
}

function setParseStatus(message, level = "normal") {
  els.parseStatus.textContent = message;
  els.parseStatus.className = `inline-note${level === "warn" ? " warn" : ""}${level === "error" ? " error" : ""}`;
}

function refreshFromRaw(forceColumns = false, forceInfer = false) {
  const parsed = parseRawText(els.rawInput.value);
  state.headers = parsed.headers;
  state.rawRows = parsed.rows;
  populateColumnSelects(forceColumns);
  rebuildSampleMeta(forceInfer);
  refreshGeneAndGroupControls();
  renderMappingTable();

  if (!state.headers.length) {
    state.results = null;
    setParseStatus("粘贴机器导出的表格后会自动识别列。");
    setAppStatus("等待输入");
    renderEmptyResults("完成设置后点击计算。");
    updateDownloads();
    return;
  }

  const missing = [];
  if (selectedColumn("sampleColumn") === null) missing.push("样本列");
  if (selectedColumn("geneColumn") === null) missing.push("基因列");
  if (selectedColumn("ctColumn") === null) missing.push("CT 列");

  if (missing.length) {
    state.results = null;
    setParseStatus(`缺少 ${missing.join("、")}。`, "error");
    setAppStatus("列未完整");
    renderEmptyResults("请先补齐必需列。");
    updateDownloads();
    return;
  }

  setParseStatus(`已读取 ${state.rawRows.length} 行，识别到 ${state.sampleOrder.length} 个样本。`);
  setAppStatus("已读取");
  calculateAndRender(false);
}

function setAppStatus(message) {
  els.appStatus.textContent = message;
}

function updateMetaFromTable(event) {
  const input = event.target;
  if (!input.classList.contains("meta-group") && !input.classList.contains("meta-bio")) {
    return;
  }

  const row = input.closest("tr");
  const index = Number(row?.dataset.index);
  const sample = state.sampleOrder[index];
  const meta = state.sampleMeta.get(sample);
  if (!meta) {
    return;
  }

  if (input.classList.contains("meta-group")) {
    meta.group = input.value.trim();
  } else {
    meta.bio = input.value.trim();
  }

  refreshGeneAndGroupControls();
  calculateAndRender(false);
}

function mean(values) {
  const finite = values.filter(Number.isFinite);
  if (!finite.length) return null;
  return finite.reduce((sum, value) => sum + value, 0) / finite.length;
}

function sampleSd(values) {
  const finite = values.filter(Number.isFinite);
  if (finite.length < 2) return null;
  const avg = mean(finite);
  const variance = finite.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (finite.length - 1);
  return Math.sqrt(variance);
}

function round(value, digits = 6) {
  if (!Number.isFinite(value)) return null;
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function makeKey(...parts) {
  return parts.join(KEY_SEP);
}

function splitKey(key) {
  return key.split(KEY_SEP);
}

function calculateResults() {
  const normalized = preparedRows();
  const validRows = normalized.filter((row) => row.valid);
  const issues = [];
  const referenceGene = els.referenceGene.value;
  const controlGroup = els.controlGroup.value;
  const method = els.pvalueMethod.value;

  if (!validRows.length) {
    return { normalized, technical: [], detail: [], summary: [], issues: ["没有可计算的 CT 行。"] };
  }
  if (!referenceGene) {
    issues.push("未选择内参基因。");
  }
  if (!controlGroup) {
    issues.push("未选择对照组。");
  }

  const invalidCount = normalized.length - validRows.length;
  if (invalidCount > 0) {
    issues.push(`${invalidCount} 行原始数据未参与计算。`);
  }

  const bioGeneMap = new Map();
  validRows.forEach((row) => {
    const key = makeKey(row.group, row.bio_replicate, row.gene);
    if (!bioGeneMap.has(key)) {
      bioGeneMap.set(key, {
        group: row.group,
        bio_replicate: row.bio_replicate,
        gene: row.gene,
        samples: new Set(),
        cts: [],
        raw_rows: [],
      });
    }
    const item = bioGeneMap.get(key);
    item.samples.add(row.sample);
    item.cts.push(row.ct);
    item.raw_rows.push(row.raw_row);
  });

  const technical = [...bioGeneMap.values()]
    .map((item) => ({
      group: item.group,
      bio_replicate: item.bio_replicate,
      gene: item.gene,
      samples: [...item.samples].join(";"),
      tech_n: item.cts.length,
      ct_mean: mean(item.cts),
      ct_sd: sampleSd(item.cts),
      ct_values: item.cts.map((value) => round(value, 4)).join(";"),
      raw_rows: item.raw_rows.join(";"),
    }))
    .sort(compareGroupBioGene);

  const refByBio = new Map();
  technical.forEach((row) => {
    if (row.gene === referenceGene) {
      refByBio.set(makeKey(row.group, row.bio_replicate), row);
    }
  });

  const genes = uniqueValues(validRows.map((row) => row.gene));
  const targetGenes = genes.filter((gene) => gene !== referenceGene);
  const details = [];

  targetGenes.forEach((gene) => {
    technical
      .filter((row) => row.gene === gene)
      .forEach((targetRow) => {
        const bioKey = makeKey(targetRow.group, targetRow.bio_replicate);
        const refRow = refByBio.get(bioKey);
        if (!refRow) {
          issues.push(`${targetRow.group}/${targetRow.bio_replicate}/${gene} 缺少内参 ${referenceGene}。`);
          return;
        }
        details.push({
          gene,
          group: targetRow.group,
          bio_replicate: targetRow.bio_replicate,
          samples: targetRow.samples,
          target_ct_mean: targetRow.ct_mean,
          target_ct_sd: targetRow.ct_sd,
          target_tech_n: targetRow.tech_n,
          reference_gene: referenceGene,
          reference_ct_mean: refRow.ct_mean,
          reference_ct_sd: refRow.ct_sd,
          reference_tech_n: refRow.tech_n,
          delta_ct: targetRow.ct_mean - refRow.ct_mean,
          control_mean_delta_ct: null,
          delta_delta_ct: null,
          fold_change: null,
        });
      });
  });

  const controlMeanByGene = new Map();
  targetGenes.forEach((gene) => {
    const controlDeltas = details
      .filter((row) => row.gene === gene && row.group === controlGroup)
      .map((row) => row.delta_ct);
    const controlMean = mean(controlDeltas);
    if (controlMean === null) {
      issues.push(`${gene} 在对照组 ${controlGroup} 中没有可用 ΔCt。`);
    } else {
      controlMeanByGene.set(gene, controlMean);
    }
  });

  details.forEach((row) => {
    const controlMean = controlMeanByGene.get(row.gene);
    if (controlMean === undefined) {
      return;
    }
    row.control_mean_delta_ct = controlMean;
    row.delta_delta_ct = row.delta_ct - controlMean;
    row.fold_change = 2 ** (-row.delta_delta_ct);
  });

  const summaryMap = new Map();
  details
    .filter((row) => Number.isFinite(row.fold_change))
    .forEach((row) => {
      const key = makeKey(row.gene, row.group);
      if (!summaryMap.has(key)) {
        summaryMap.set(key, []);
      }
      summaryMap.get(key).push(row);
    });

  const summary = [...summaryMap.entries()]
    .map(([key, rows]) => {
      const [gene, group] = splitKey(key);
      const deltaValues = rows.map((row) => row.delta_ct);
      const deltaDeltaValues = rows.map((row) => row.delta_delta_ct);
      const foldValues = rows.map((row) => row.fold_change);
      const controlValues = details
        .filter((row) => row.gene === gene && row.group === controlGroup)
        .map((row) => row.delta_ct);
      const groupMeanDelta = mean(deltaValues);
      const controlMeanDelta = controlMeanByGene.get(gene);
      const pValue =
        group === controlGroup ? null : calculatePValue(deltaValues, controlValues, method);

      return {
        gene,
        group,
        n_bio: rows.length,
        mean_delta_ct: groupMeanDelta,
        sd_delta_ct: sampleSd(deltaValues),
        mean_delta_delta_ct: mean(deltaDeltaValues),
        sd_delta_delta_ct: sampleSd(deltaDeltaValues),
        mean_fold_change: mean(foldValues),
        sd_fold_change: sampleSd(foldValues),
        fold_change_from_mean_delta_ct:
          Number.isFinite(groupMeanDelta) && Number.isFinite(controlMeanDelta)
            ? 2 ** (-(groupMeanDelta - controlMeanDelta))
            : null,
        p_value: pValue,
        pvalue_method: method === "welch" ? "Welch t-test on delta Ct" : "Student t-test on delta Ct",
      };
    })
    .sort(compareGeneGroup);

  return {
    normalized,
    technical,
    detail: details.sort(compareGroupBioGene),
    summary,
    issues: uniqueValues(issues),
  };
}

function compareGroupBioGene(a, b) {
  return (
    String(a.group).localeCompare(String(b.group), "zh-Hans-CN", { numeric: true }) ||
    String(a.bio_replicate).localeCompare(String(b.bio_replicate), "zh-Hans-CN", { numeric: true }) ||
    String(a.gene).localeCompare(String(b.gene), "zh-Hans-CN", { numeric: true })
  );
}

function compareGeneGroup(a, b) {
  return (
    String(a.gene).localeCompare(String(b.gene), "zh-Hans-CN", { numeric: true }) ||
    String(a.group).localeCompare(String(b.group), "zh-Hans-CN", { numeric: true })
  );
}

function calculatePValue(groupValues, controlValues, method) {
  const group = groupValues.filter(Number.isFinite);
  const control = controlValues.filter(Number.isFinite);
  if (group.length < 2 || control.length < 2) {
    return null;
  }

  return method === "student" ? studentTTest(group, control) : welchTTest(group, control);
}

function welchTTest(sampleA, sampleB) {
  const nA = sampleA.length;
  const nB = sampleB.length;
  const meanA = mean(sampleA);
  const meanB = mean(sampleB);
  const varA = sampleVariance(sampleA);
  const varB = sampleVariance(sampleB);
  const seSquared = varA / nA + varB / nB;

  if (seSquared === 0) {
    return meanA === meanB ? 1 : 0;
  }

  const t = (meanA - meanB) / Math.sqrt(seSquared);
  const numerator = seSquared ** 2;
  const denominator = (varA / nA) ** 2 / (nA - 1) + (varB / nB) ** 2 / (nB - 1);
  const df = numerator / denominator;
  return twoSidedT(t, df);
}

function studentTTest(sampleA, sampleB) {
  const nA = sampleA.length;
  const nB = sampleB.length;
  const meanA = mean(sampleA);
  const meanB = mean(sampleB);
  const varA = sampleVariance(sampleA);
  const varB = sampleVariance(sampleB);
  const pooled = ((nA - 1) * varA + (nB - 1) * varB) / (nA + nB - 2);
  const seSquared = pooled * (1 / nA + 1 / nB);

  if (seSquared === 0) {
    return meanA === meanB ? 1 : 0;
  }

  const t = (meanA - meanB) / Math.sqrt(seSquared);
  return twoSidedT(t, nA + nB - 2);
}

function sampleVariance(values) {
  const avg = mean(values);
  return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1);
}

function twoSidedT(t, df) {
  if (!Number.isFinite(t) || !Number.isFinite(df) || df <= 0) {
    return null;
  }
  const cdf = studentTCdf(Math.abs(t), df);
  return Math.max(0, Math.min(1, 2 * (1 - cdf)));
}

function studentTCdf(t, df) {
  const x = df / (df + t * t);
  const ibeta = regularizedIncompleteBeta(x, df / 2, 0.5);
  return t >= 0 ? 1 - ibeta / 2 : ibeta / 2;
}

function regularizedIncompleteBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x),
  );
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betaContinuedFraction(a, b, x)) / a;
  }
  return 1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b;
}

function betaContinuedFraction(a, b, x) {
  const maxIterations = 100;
  const eps = 3e-7;
  const fpmin = 1e-30;
  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < fpmin) d = fpmin;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < eps) break;
  }

  return h;
}

function logGamma(z) {
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  }

  let value = 0.9999999999998099;
  const shifted = z - 1;
  coefficients.forEach((coefficient, index) => {
    value += coefficient / (shifted + index + 1);
  });
  const t = shifted + coefficients.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(t) - t + Math.log(value);
}

function calculateAndRender(userTriggered = true) {
  if (!state.headers.length) {
    renderEmptyResults("完成设置后点击计算。");
    return;
  }

  state.results = calculateResults();
  renderMetrics();
  renderResultsTable();
  updateDownloads();
  setAppStatus(state.results.issues.length ? "已计算，有提示" : "已计算");

  if (userTriggered && state.results.summary.length === 0) {
    setParseStatus("已读取数据，但没有生成目的基因结果。", "warn");
  }
}

function renderMetrics() {
  const results = state.results;
  const validCount = results?.normalized.filter((row) => row.valid).length || 0;
  const targetCount = uniqueValues(results?.detail.map((row) => row.gene) || []).length;
  const bioCount = uniqueValues(
    results?.detail.map((row) => makeKey(row.group, row.bio_replicate)) || [],
  ).length;
  const warningCount = results?.issues.length || 0;

  const metrics = [
    ["有效 CT", validCount],
    ["目的基因", targetCount],
    ["生物重复", bioCount],
    ["警告", warningCount],
  ];

  els.metrics.innerHTML = metrics
    .map(
      ([label, value]) => `
        <div class="metric">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");
}

function formatNumber(value, digits = 4) {
  if (!Number.isFinite(value)) return "";
  return Number(value).toFixed(digits).replace(/\.?0+$/g, "");
}

function formatPValue(value) {
  if (!Number.isFinite(value)) return "";
  if (value < 0.0001) return value.toExponential(2);
  return value.toFixed(4).replace(/\.?0+$/g, "");
}

function showTableView() {
  els.resultWrap.hidden = false;
  els.plotPanel.hidden = true;
}

function showPlotView() {
  els.resultWrap.hidden = true;
  els.plotPanel.hidden = false;
}

function renderResultsTable() {
  if (!state.results) {
    renderEmptyResults("完成设置后点击计算。");
    return;
  }

  if (state.activeView === "plot") {
    showPlotView();
    renderFoldPlot();
    return;
  }

  showTableView();

  if (state.activeView === "detail") {
    renderDataTable(
      [
        ["gene", "基因"],
        ["group", "组别"],
        ["bio_replicate", "生物重复"],
        ["samples", "样本"],
        ["target_ct_mean", "目的 CT mean", "number"],
        ["reference_ct_mean", "内参 CT mean", "number"],
        ["delta_ct", "ΔCt", "number"],
        ["delta_delta_ct", "ΔΔCt", "number"],
        ["fold_change", "2^-ΔΔCt", "number"],
      ],
      state.results.detail,
    );
    return;
  }

  if (state.activeView === "technical") {
    renderDataTable(
      [
        ["group", "组别"],
        ["bio_replicate", "生物重复"],
        ["gene", "基因"],
        ["samples", "样本"],
        ["tech_n", "技术重复 n", "integer"],
        ["ct_mean", "CT mean", "number"],
        ["ct_sd", "CT SD", "number"],
        ["ct_values", "CT values"],
      ],
      state.results.technical,
    );
    return;
  }

  if (state.activeView === "qc") {
    const issueRows = state.results.issues.length
      ? state.results.issues.map((issue, index) => ({ index: index + 1, issue }))
      : [{ index: "", issue: "未发现阻断计算的问题。" }];
    renderDataTable(
      [
        ["index", "#"],
        ["issue", "提示"],
      ],
      issueRows,
    );
    return;
  }

  renderDataTable(
    [
      ["gene", "基因"],
      ["group", "组别"],
      ["n_bio", "n", "integer"],
      ["mean_delta_ct", "mean ΔCt", "number"],
      ["sd_delta_ct", "SD ΔCt", "number"],
      ["mean_fold_change", "mean fold", "number"],
      ["sd_fold_change", "SD fold", "number"],
      ["fold_change_from_mean_delta_ct", "fold from mean ΔCt", "number"],
      ["p_value", "p value", "pvalue"],
    ],
    state.results.summary,
  );
}

function renderFoldPlot() {
  const results = state.results;
  const summaryRows = results?.summary || [];
  const detailRows = results?.detail || [];

  if (!summaryRows.length || !detailRows.length) {
    els.plotPanel.innerHTML = '<div class="plot-empty">暂无可绘制的 fold change。</div>';
    return;
  }

  const palette = ["#8ecae6", "#e9a6bd", "#9fd8ca", "#c9b8e8", "#f0c987", "#a8c7e8"];
  const groups = orderGroupsForPlot(uniqueValues(summaryRows.map((row) => row.group)), els.controlGroup.value);
  const groupColors = new Map(groups.map((group, index) => [group, palette[index % palette.length]]));
  const genes = uniqueValues(summaryRows.map((row) => row.gene));
  const clusters = genes
    .map((gene) => ({
      gene,
      bars: groups
        .map((group) => summaryRows.find((summary) => summary.gene === gene && summary.group === group))
        .filter(Boolean)
        .map((summary) => ({
          ...summary,
          points: detailRows.filter((row) => row.gene === summary.gene && row.group === summary.group),
        })),
    }))
    .filter((cluster) => cluster.bars.length > 0);
  const positioned = positionPlotBars(clusters);
  const bars = positioned.bars;

  const margin = { top: 70, right: 28, bottom: 82, left: 62 };
  const width = Math.max(620, positioned.width + margin.right);
  const height = 380;
  const plotHeight = height - margin.top - margin.bottom;
  const maxObserved = Math.max(
    1,
    ...bars.flatMap((bar) => [
      bar.mean_fold_change + (bar.sd_fold_change || 0),
      ...bar.points.map((point) => point.fold_change),
    ]),
  );
  const yMax = niceCeil(maxObserved * 1.18);
  const yTicks = buildTicks(yMax, 5);
  const barWidth = 46;
  const yScale = (value) => margin.top + plotHeight - (Math.max(0, value) / yMax) * plotHeight;
  const zeroY = yScale(0);

  const grid = yTicks
    .map((tick) => {
      const y = yScale(tick);
      return `
        <line class="plot-grid" x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" />
        <text class="plot-label" x="${margin.left - 10}" y="${y + 4}" text-anchor="end">${formatNumber(tick, 2)}</text>
      `;
    })
    .join("");

  const barsSvg = bars
    .map((bar) => {
      const centerX = bar.centerX;
      const color = groupColors.get(bar.group) || palette[0];
      const meanY = yScale(bar.mean_fold_change);
      const barHeight = Math.max(0, zeroY - meanY);
      const sd = bar.sd_fold_change || 0;
      const errorTopY = yScale(bar.mean_fold_change + sd);
      const errorBottomY = yScale(Math.max(0, bar.mean_fold_change - sd));
      const points = bar.points
        .map((point, pointIndex) => {
          const jitter = pointOffset(pointIndex, bar.points.length);
          const x = centerX + jitter;
          const y = yScale(point.fold_change);
          const label = `${point.samples || point.bio_replicate}: ${formatNumber(point.fold_change)}`;
          return `
            <circle class="plot-point" cx="${x}" cy="${y}" r="4.6" stroke="${color}">
              <title>${escapeHtml(label)}</title>
            </circle>
          `;
        })
        .join("");
      const pLabel =
        Number.isFinite(bar.p_value) && bar.group !== els.controlGroup.value
          ? `<text class="plot-label" x="${centerX}" y="${Math.max(margin.top + 14, errorTopY - 12)}" text-anchor="middle">p=${formatPValue(bar.p_value)}</text>`
          : "";

      return `
        <rect class="plot-bar" x="${centerX - barWidth / 2}" y="${meanY}" width="${barWidth}" height="${barHeight}" rx="3" fill="${color}" />
        <line class="plot-error" x1="${centerX}" y1="${errorTopY}" x2="${centerX}" y2="${errorBottomY}" />
        <line class="plot-error-cap" x1="${centerX - 13}" y1="${errorTopY}" x2="${centerX + 13}" y2="${errorTopY}" />
        <line class="plot-error-cap" x1="${centerX - 13}" y1="${errorBottomY}" x2="${centerX + 13}" y2="${errorBottomY}" />
        ${points}
        ${pLabel}
        <text class="plot-label" x="${centerX}" y="${height - 48}" text-anchor="middle">${escapeHtml(bar.group)}</text>
      `;
    })
    .join("");

  const geneLabels = positioned.clusters
    .map(
      (cluster) => `
        <text class="plot-label" x="${cluster.centerX}" y="${height - 25}" text-anchor="middle">${escapeHtml(cluster.gene)}</text>
      `,
    )
    .join("");

  const legend = groups
    .map((group, index) => {
      const x = margin.left + index * 92;
      const color = groupColors.get(group);
      return `
        <rect x="${x}" y="44" width="12" height="12" rx="2" fill="${color}" opacity="0.78" />
        <text class="plot-label" x="${x + 18}" y="55">${escapeHtml(group)}</text>
      `;
    })
    .join("");
  const plotRows = buildPlotFoldRows(bars);

  els.plotPanel.innerHTML = `
    <div class="plot-toolbar" style="width: ${width}px">
      <span class="plot-toolbar-title">柱子 = mean fold，误差线 = SD fold，散点 = 每个生物学重复 fold</span>
      <div class="plot-toolbar-actions">
        <button class="ghost-btn compact" type="button" data-plot-export="png">导出 PNG</button>
        <button class="ghost-btn compact" type="button" data-plot-export="svg">导出 SVG</button>
      </div>
    </div>
    <div class="plot-card" style="width: ${width}px">
      <svg class="qpcr-plot" viewBox="0 0 ${width} ${height}" role="img" aria-label="qPCR fold change with biological replicate points">
        <text class="plot-title" x="${margin.left}" y="30">Relative expression · 2^(-ΔΔCt)</text>
        ${legend}
        ${grid}
        <line class="plot-axis" x1="${margin.left}" y1="${zeroY}" x2="${width - margin.right}" y2="${zeroY}" />
        <line class="plot-axis" x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${zeroY}" />
        <text class="plot-label" transform="translate(20 ${margin.top + plotHeight / 2}) rotate(-90)" text-anchor="middle">Relative expression</text>
        ${barsSvg}
        ${geneLabels}
      </svg>
    </div>
    ${renderPlotFoldTable(plotRows)}
  `;
}

function buildPlotFoldRows(bars) {
  return bars.flatMap((bar) => {
    const points = [...bar.points].sort((a, b) =>
      String(a.bio_replicate).localeCompare(String(b.bio_replicate), "zh-Hans-CN", { numeric: true }),
    );
    return points.map((point) => ({
      gene: bar.gene,
      group: bar.group,
      bio_replicate: point.bio_replicate,
      samples: point.samples,
      point_fold_change: point.fold_change,
      mean_fold_change: bar.mean_fold_change,
      sd_fold_change: bar.sd_fold_change,
      delta_delta_ct: point.delta_delta_ct,
    }));
  });
}

function renderPlotFoldTable(rows) {
  if (!rows.length) {
    return '<div class="plot-data-card"><div class="plot-empty">暂无绘图 fold 明细。</div></div>';
  }

  const columns = [
    ["gene", "基因"],
    ["group", "组别"],
    ["bio_replicate", "生物重复"],
    ["samples", "样本"],
    ["point_fold_change", "散点 fold", "number"],
    ["mean_fold_change", "柱子 mean fold", "number"],
    ["sd_fold_change", "误差线 SD fold", "number"],
    ["delta_delta_ct", "ΔΔCt", "number"],
  ];
  const head = columns.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join("");
  const body = rows
    .map((row) => {
      const cells = columns
        .map(([key, , type]) => {
          const value = type === "number" ? formatNumber(row[key]) : row[key];
          const className = type === "number" ? ' class="numeric"' : "";
          return `<td${className}>${escapeHtml(value)}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div class="plot-data-card">
      <div class="plot-data-head">
        <span>绘图 fold 值</span>
        <span>${rows.length} points</span>
      </div>
      <div class="plot-data-wrap">
        <table>
          <thead><tr>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>
  `;
}

function downloadPlotSvg() {
  const svgText = serializePlotSvg();
  if (!svgText) return;
  downloadBlob("qpcr_fold_plot.svg", new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
}

async function downloadPlotPng() {
  const svgText = serializePlotSvg();
  const svg = els.plotPanel.querySelector(".qpcr-plot");
  if (!svgText || !svg) return;

  const { width, height } = svgViewBoxSize(svg);
  const scale = 2;
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(scale, scale);
    context.drawImage(image, 0, 0, width, height);

    const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
    if (pngBlob) {
      downloadBlob("qpcr_fold_plot.png", pngBlob);
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}

function serializePlotSvg() {
  const svg = els.plotPanel.querySelector(".qpcr-plot");
  if (!svg) return "";

  const clone = svg.cloneNode(true);
  const { width, height } = svgViewBoxSize(svg);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
    .qpcr-plot { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; }
    .plot-axis, .plot-grid { stroke: #bfd0df; stroke-width: 1; }
    .plot-grid { opacity: 0.55; }
    .plot-label { fill: #667586; font-size: 12px; font-weight: 700; }
    .plot-title { fill: #355c7d; font-size: 15px; font-weight: 850; }
    .plot-bar { fill-opacity: 0.82; }
    .plot-error, .plot-error-cap { stroke: #405064; stroke-width: 1.6; stroke-linecap: round; }
    .plot-point { fill: #fff; stroke-width: 2; }
  `;
  clone.insertBefore(style, clone.firstChild);

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}

function svgViewBoxSize(svg) {
  const [, , width, height] = (svg.getAttribute("viewBox") || "0 0 620 380")
    .split(/\s+/)
    .map(Number);
  return {
    width: Number.isFinite(width) ? width : 620,
    height: Number.isFinite(height) ? height : 380,
  };
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyContactEmail() {
  const email = "xiangyining0727@gmail.com";
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email);
    } else {
      const input = document.createElement("textarea");
      input.value = email;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    els.copyEmailStatus.textContent = "已复制";
    window.setTimeout(() => {
      els.copyEmailStatus.textContent = "";
    }, 1800);
  } catch {
    els.copyEmailStatus.textContent = "复制失败";
  }
}

function orderGroupsForPlot(groups, controlGroup) {
  const cleanControl = cleanCell(controlGroup);
  return [...groups].sort((a, b) => {
    if (a === cleanControl && b !== cleanControl) return -1;
    if (b === cleanControl && a !== cleanControl) return 1;
    return String(a).localeCompare(String(b), "zh-Hans-CN", { numeric: true });
  });
}

function positionPlotBars(clusters) {
  const left = 114;
  const groupGap = 72;
  const geneGap = 112;
  const minClusterWidth = 86;
  const bars = [];
  const clusterPositions = [];
  let cursor = left;

  clusters.forEach((cluster) => {
    const clusterWidth = Math.max(minClusterWidth, (cluster.bars.length - 1) * groupGap);
    const startX = cursor + (clusterWidth - (cluster.bars.length - 1) * groupGap) / 2;
    const centers = cluster.bars.map((bar, index) => {
      const centerX = startX + index * groupGap;
      bars.push({ ...bar, centerX });
      return centerX;
    });
    clusterPositions.push({
      gene: cluster.gene,
      centerX: mean(centers),
      startX: Math.min(...centers),
      endX: Math.max(...centers),
    });
    cursor += clusterWidth + geneGap;
  });

  return {
    bars,
    clusters: clusterPositions,
    width: Math.max(620, cursor - geneGap + 86),
  };
}

function niceCeil(value) {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const scaled = value / power;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return nice * power;
}

function buildTicks(maxValue, count) {
  const ticks = [];
  const step = maxValue / count;
  for (let index = 0; index <= count; index += 1) {
    ticks.push(step * index);
  }
  return ticks;
}

function pointOffset(index, total) {
  if (total <= 1) return 0;
  const spread = Math.min(30, 9 * (total - 1));
  return -spread / 2 + (spread * index) / (total - 1);
}

function renderDataTable(columns, rows) {
  if (!rows.length) {
    renderEmptyResults("暂无可显示结果。");
    return;
  }

  const headerHtml = columns.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join("");
  const bodyHtml = rows
    .map((row) => {
      const cells = columns
        .map(([key, , type]) => {
          let value = row[key];
          if (type === "number") value = formatNumber(value);
          if (type === "integer") value = Number.isFinite(value) ? String(value) : "";
          if (type === "pvalue") value = formatPValue(value);
          const className = ["number", "integer", "pvalue"].includes(type) ? ' class="numeric"' : "";
          return `<td${className}>${escapeHtml(value)}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  els.resultTable.innerHTML = `<thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody>`;
}

function renderEmptyResults(message) {
  renderMetrics();
  showTableView();
  els.resultTable.innerHTML = `<tbody><tr><td class="empty-cell">${escapeHtml(message)}</td></tr></tbody>`;
}

function updateDownloads() {
  const hasResults = Boolean(state.results);
  [els.downloadAll, els.downloadSummary, els.downloadDetail, els.downloadRaw].forEach((button) => {
    button.disabled = !hasResults;
  });
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const lines = [headers.map(csvEscape).join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  });
  return lines.join("\n");
}

function normalizeForCsv(rows) {
  return rows.map((row) => {
    const normalized = {};
    Object.entries(row).forEach(([key, value]) => {
      normalized[key] = typeof value === "number" ? round(value, 8) : value;
    });
    return normalized;
  });
}

function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const csv = `\ufeff${toCsv(normalizeForCsv(rows))}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function combinedExportRows(results) {
  if (!results) return [];
  const addTable = (table, rows) => rows.map((row) => ({ table, ...row }));
  return [
    ...addTable("normalized_raw", results.normalized),
    ...addTable("technical_ct_mean", results.technical),
    ...addTable("delta_ct_detail", results.detail),
    ...addTable("summary", results.summary),
  ];
}

function attachEvents() {
  els.copyEmailBtn.addEventListener("click", copyContactEmail);

  document.querySelectorAll(".module-tab").forEach((button) => {
    button.addEventListener("click", () => setActiveSection(button.dataset.section));
  });

  prepInputIds.forEach((id) => {
    const eventName = els[id].type === "checkbox" ? "change" : "input";
    els[id].addEventListener(eventName, () => {
      if (id === "prepPreset") {
        applyPrepPreset(els.prepPreset.value);
        return;
      }

      if (
        !applyingPrepPreset &&
        ["prepReactionVolume", "prepForward", "prepReverse", "prepMix", "prepCdna", "prepWater", "prepAutoWater"].includes(id)
      ) {
        els.prepPreset.value = "custom";
      }

      renderPrepPlan();
    });
  });

  els.rawInput.addEventListener("input", () => refreshFromRaw(false, false));

  els.fileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      els.rawInput.value = String(reader.result || "");
      refreshFromRaw(true, true);
      els.fileInput.value = "";
    };
    reader.readAsText(file);
  });

  els.exampleBtn.addEventListener("click", () => {
    els.rawInput.value = exampleData;
    refreshFromRaw(true, true);
  });

  els.clearBtn.addEventListener("click", () => {
    els.rawInput.value = "";
    state.sampleMeta.clear();
    refreshFromRaw(true, true);
  });

  els.inferBtn.addEventListener("click", () => {
    els.groupColumn.value = AUTO;
    els.bioColumn.value = AUTO;
    rebuildSampleMeta(true);
    refreshGeneAndGroupControls();
    renderMappingTable();
    calculateAndRender(false);
  });

  columnSelects.forEach((id) => {
    els[id].addEventListener("change", () => refreshFromRaw(false, false));
  });

  [els.referenceGene, els.controlGroup, els.pvalueMethod].forEach((select) => {
    select.addEventListener("change", () => calculateAndRender(false));
  });

  els.mappingBody.addEventListener("input", updateMetaFromTable);
  els.plotPanel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-plot-export]");
    if (!button) return;

    if (button.dataset.plotExport === "svg") {
      downloadPlotSvg();
      return;
    }

    downloadPlotPng();
  });
  els.calculateBtn.addEventListener("click", () => {
    setActiveSection("analysis");
    calculateAndRender(true);
  });

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".segment").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.activeView = button.dataset.view;
      renderResultsTable();
    });
  });

  els.downloadSummary.addEventListener("click", () => {
    downloadCsv("qpcr_summary.csv", state.results?.summary || []);
  });

  els.downloadDetail.addEventListener("click", () => {
    downloadCsv("qpcr_detail.csv", state.results?.detail || []);
  });

  els.downloadRaw.addEventListener("click", () => {
    downloadCsv("qpcr_normalized_raw.csv", state.results?.normalized || []);
  });

  els.downloadAll.addEventListener("click", () => {
    downloadCsv("qpcr_all_results.csv", combinedExportRows(state.results));
  });
}

attachEvents();
setActiveSection("prep");
renderPrepPlan();
refreshFromRaw(true, true);
