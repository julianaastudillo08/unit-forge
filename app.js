const FX = { COP: 1, USD: 0.00024, EUR: 0.00022 };

const CATEGORIES = {
  length: {
    label: "Length",
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
    defaultFrom: "m",
    defaultTo: "ft",
  },
  mass: {
    label: "Mass",
    units: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
    defaultFrom: "kg",
    defaultTo: "lb",
  },
  temp: {
    label: "Temperature",
    convert(from, to, val) {
      let c = val;
      if (from === "F") c = ((val - 32) * 5) / 9;
      else if (from === "K") c = val - 273.15;
      else if (from === "C") c = val;
      if (to === "F") return (c * 9) / 5 + 32;
      if (to === "K") return c + 273.15;
      return c;
    },
    units: { C: "C", F: "F", K: "K" },
    defaultFrom: "C",
    defaultTo: "F",
  },
  data: {
    label: "Data",
    units: { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 },
    defaultFrom: "MB",
    defaultTo: "GB",
  },
  currency: {
    label: "Currency",
    units: FX,
    defaultFrom: "COP",
    defaultTo: "USD",
    note: "Mock rates for demo — not live FX.",
  },
};

let active = "length";

const tabsEl = document.getElementById("tabs");
const panelEl = document.getElementById("panel");

function convertStandard(cat, from, to, val) {
  const u = cat.units;
  const base = val * u[from];
  return base / u[to];
}

function renderTabs() {
  tabsEl.innerHTML = "";
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const btn = document.createElement("button");
    btn.textContent = cat.label;
    btn.className = key === active ? "active" : "";
    btn.addEventListener("click", () => {
      active = key;
      renderTabs();
      renderPanel();
    });
    tabsEl.appendChild(btn);
  }
}

function renderPanel() {
  const cat = CATEGORIES[active];
  panelEl.innerHTML = `
    <div class="field">
      <label>Value</label>
      <div class="field-row">
        <input type="number" id="val" value="1" step="any" />
        <select id="from">${Object.keys(cat.units).map((u) => `<option value="${u}">${u}</option>`).join("")}</select>
      </div>
    </div>
    <div class="field">
      <label>Convert to</label>
      <select id="to">${Object.keys(cat.units).map((u) => `<option value="${u}">${u}</option>`).join("")}</select>
    </div>
    <div class="result" id="out">—</div>
    ${cat.note ? `<p class="fx-note">${cat.note}</p>` : ""}
  `;
  document.getElementById("from").value = cat.defaultFrom;
  document.getElementById("to").value = cat.defaultTo;
  const update = () => {
    const val = Number(document.getElementById("val").value);
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    if (Number.isNaN(val)) {
      document.getElementById("out").textContent = "—";
      return;
    }
    let result;
    if (cat.convert) result = cat.convert(from, to, val);
    else result = convertStandard(cat, from, to, val);
    const formatted = active === "currency"
      ? result.toLocaleString(undefined, { maximumFractionDigits: 4 })
      : result.toLocaleString(undefined, { maximumFractionDigits: 8 });
    document.getElementById("out").textContent = `${val} ${from} = ${formatted} ${to}`;
  };
  panelEl.querySelectorAll("input, select").forEach((el) => el.addEventListener("input", update));
  update();
}

renderTabs();
renderPanel();
