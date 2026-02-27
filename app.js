/* ═══════════════════════════════════════════════════════════
   MECHANISM — app.js
   Engine + Registry + Track 1 (15 modules) + Track 2 (15 modules)
   ═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────
   ENGINE
   ───────────────────────────────────────────── */
const Engine = {
  current: null,
  _running: false,
  _tid: null,
  _stepN: 0,
  _tickMs: 600,

  mount(mod) {
    this.halt();
    this._stepN = 0;
    document.getElementById("stage").innerHTML =
      `<div class="sim-content">${mod.template()}</div>`;
    document.getElementById("dynamic-controls").innerHTML = mod.controls();
    document.getElementById("failure-controls").innerHTML = mod.failures();
    document.getElementById("state-dump").textContent = "—";
    document.getElementById("event-log").innerHTML = "";
    document.getElementById("step-counter").textContent = "step 0";
    this.current = mod;
    mod.init();
    this.renderState();
  },

  step() {
    if (!this.current) return;
    this.current.step(this._stepN++);
    this.renderState();
    document.getElementById("step-counter").textContent = `step ${this._stepN}`;
  },

  run() {
    this._running = !this._running;
    const btn = document.getElementById("btn-run");
    if (this._running) {
      btn.textContent = "⏸ Pause";
      btn.classList.add("running");
      this._loop();
    } else {
      btn.textContent = "▶ Run";
      btn.classList.remove("running");
      clearTimeout(this._tid);
    }
  },

  _loop() {
    if (!this._running) return;
    this.step();
    this._tid = setTimeout(() => this._loop(), this._tickMs);
  },

  halt() {
    this._running = false;
    clearTimeout(this._tid);
    const btn = document.getElementById("btn-run");
    btn.textContent = "▶ Run";
    btn.classList.remove("running");
  },

  reset() {
    this.halt();
    this._stepN = 0;
    document.getElementById("step-counter").textContent = "step 0";
    document.getElementById("event-log").innerHTML = "";
    if (this.current) {
      this.current.init();
      this.renderState();
    }
  },

  renderState() {
    if (!this.current) return;
    try {
      document.getElementById("state-dump").textContent = JSON.stringify(
        this.current.state,
        null,
        2,
      );
    } catch (e) {}
  },

  log(msg, cls = "") {
    const el = document.getElementById("event-log");
    const li = document.createElement("li");
    li.textContent = `[${this._stepN}] ${msg}`;
    if (cls) li.className = cls;
    el.prepend(li);
    if (el.children.length > 80) el.lastChild.remove();
  },
};

/* ─────────────────────────────────────────────
   REGISTRY
   ───────────────────────────────────────────── */
const Registry = { t1: [], t2: [] };

function register(track, mod) {
  Registry[track].push(mod);
}

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
function hex(n, w = 2) {
  return n.toString(16).toUpperCase().padStart(w, "0");
}
function bin(n, w = 8) {
  return (n >>> 0).toString(2).padStart(w, "0");
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function el(id) {
  return document.getElementById(id);
}
function set(id, v) {
  const e = el(id);
  if (e) e.textContent = v;
}
function setHtml(id, v) {
  const e = el(id);
  if (e) e.innerHTML = v;
}

/* colour a cell by bit value */
function bitClass(v) {
  return v === 1 ? "bit-1" : v === 0 ? "bit-0" : "bit-x";
}

/* generic slider builder */
function slider(label, id, min, max, val, unit = "", oninput = "") {
  return `<div class="ctrl-group">
    <div class="ctrl-row">
      <span class="ctrl-label">${label}</span>
      <span class="ctrl-val" id="${id}-lbl">${val}${unit}</span>
    </div>
    <input type="range" class="ctrl-slider" id="${id}" min="${min}" max="${max}" value="${val}"
      oninput="el('${id}-lbl').textContent=this.value+'${unit}';${oninput}">
  </div>`;
}

function btn(label, onclick, cls = "ctrl-btn") {
  return `<button class="${cls}" onclick="${onclick}">${label}</button>`;
}

/* ═══════════════════════════════════════════════════════════
   TRACK 1 MODULES
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   T1-01  BITS & SIGNAL STABILITY
   ────────────────────────────────────────────── */
const M_Bits = {
  id: "t1_bits",
  title: "01 · Bits & Signal Stability",
  state: {},
  init() {
    this.state = {
      voltage: [4.8, 0.2, 4.7, 0.1, 3.9, 1.2, 4.5, 0.3],
      noise: 0,
      threshold: 2.5,
      read: [1, 0, 1, 0, 1, 0, 1, 0],
      glitches: 0,
      byte_value: 0,
    };
    this._render();
  },
  step() {
    const s = this.state;
    const n = s.noise;
    for (let i = 0; i < 8; i++) {
      if (!s._stuck || s._stuck[i] === undefined) {
        s.voltage[i] = clamp(
          s.voltage[i] + (Math.random() - 0.5) * n * 2,
          0,
          5,
        );
      }
      const was = s.read[i];
      s.read[i] = s.voltage[i] >= s.threshold ? 1 : 0;
      if (was !== s.read[i]) {
        s.glitches++;
        Engine.log(`Glitch on bit ${i}!`, "fault");
      }
    }
    s.byte_value = s.read.reduce((a, b, i) => a | (b << (7 - i)), 0);
    this._render();
  },
  _render() {
    const s = this.state;
    for (let i = 0; i < 8; i++) {
      const c = el(`bit-v-${i}`);
      if (!c) return;
      const pct = ((s.voltage[i] / 5) * 100).toFixed(0);
      c.style.height = pct + "%";
      c.style.background = s.read[i] ? "var(--bit-1)" : "var(--bit-0)";
      el(`bit-r-${i}`).className = "bit-cell " + bitClass(s.read[i]);
      el(`bit-r-${i}`).textContent = s.read[i];
    }
    set("byte-hex", "0x" + hex(s.byte_value));
    set("glitch-count", s.glitches);
  },
  template() {
    let voltBars = "",
      bitCells = "";
    for (let i = 0; i < 8; i++) {
      voltBars += `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;width:38px">
        <span style="font-size:9px;color:var(--text-dim)">V${i}</span>
        <div style="height:80px;width:14px;background:var(--bg3);border-radius:3px;position:relative;border:1px solid var(--border)">
          <div id="bit-v-${i}" style="position:absolute;bottom:0;width:100%;border-radius:2px;transition:all .15s"></div>
          <div style="position:absolute;bottom:50%;left:0;right:0;height:1px;background:var(--yellow);opacity:.5"></div>
        </div>
      </div>`;
      bitCells += `<div id="bit-r-${i}" class="bit-cell bit-1">1</div>`;
    }
    return `<div class="sim-title">Bits &amp; Signal Stability</div>
    <div class="sim-desc">Information is voltage crossing a threshold — not abstract 1s and 0s. Noise perturbs voltages; when a voltage crosses the threshold mid-operation, a glitch occurs.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box">
        <h4>Voltage Levels (0–5V, threshold=2.5V)</h4>
        <div style="display:flex;gap:6px;align-items:flex-end;height:110px;padding-bottom:8px">
          ${voltBars}
        </div>
      </div>
      <div class="sim-box">
        <h4>Decoded Bits (after threshold)</h4>
        <div class="bit-row" style="margin-bottom:14px">${bitCells}</div>
        <div class="metric-row"><span class="metric-label">Byte value</span><span class="metric-val" id="byte-hex">0x00</span></div>
        <div class="metric-row"><span class="metric-label">Total glitches</span><span class="metric-val bad" id="glitch-count">0</span></div>
      </div>
    </div>`;
  },
  controls() {
    return (
      slider(
        "Noise amplitude",
        "noise-amp",
        0,
        10,
        0,
        "",
        `M_Bits.state.noise=+this.value*.3`,
      ) +
      `<div class="ctrl-group"><span class="ctrl-label">Toggle individual bits</span>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${[
        0, 1, 2, 3, 4, 5, 6, 7,
      ]
        .map(
          (i) =>
            `<button class="ctrl-btn" onclick="M_Bits.state.voltage[${i}]=M_Bits.state.voltage[${i}]>2.5?0.2:4.8;M_Bits.step()">B${i}</button>`,
        )
        .join("")}</div></div>`
    );
  },
  failures() {
    return `${btn("Stuck-high bit 3", 'M_Bits.state._stuck={3:4.9};M_Bits.state.voltage[3]=4.9;Engine.log("FAULT: bit 3 stuck HIGH","fault")', "ctrl-btn fault-btn")}
    ${btn("Floating bus", 'for(let i=0;i<8;i++)M_Bits.state.voltage[i]=2.5+Math.random()*.2-.1;Engine.log("FAULT: floating bus — all lines near threshold","fault")', "ctrl-btn fault-btn")}
    ${btn("Noise burst", 'M_Bits.state.noise=3;setTimeout(()=>M_Bits.state.noise=0,3000);Engine.log("FAULT: noise burst 3s","fault")', "ctrl-btn fault-btn")}
    ${btn("Clear faults", 'M_Bits.state._stuck={};M_Bits.state.noise=0;Engine.log("Faults cleared","ok")', "ctrl-btn")}`;
  },
};
register("t1", M_Bits);

/* ──────────────────────────────────────────────
   T1-02  LOGIC GATES
   ────────────────────────────────────────────── */
const M_Gates = {
  id: "t1_gates",
  title: "02 · Logic Gates",
  state: {},
  _gateTypes: ["AND", "OR", "NOT", "NAND", "XOR", "NOR"],
  init() {
    this.state = {
      inputs: [0, 0, 0, 0], // A,B,C,D
      gates: [
        { type: "AND", a: 0, b: 1, out: 0, delay: 0, settling: 0 },
        { type: "OR", a: 0, b: 1, out: 0, delay: 0, settling: 0 },
        { type: "XOR", a: 2, b: 3, out: 0, delay: 0, settling: 0 },
        { type: "NAND", a: 0, b: 1, out: 0, delay: 0, settling: 0 },
      ],
      propagation_delay: 0,
      glitch_injected: false,
    };
    this._compute();
    this._render();
  },
  _evaluate(type, a, b) {
    switch (type) {
      case "AND":
        return a & b;
      case "OR":
        return a | b;
      case "NOT":
        return a ? 0 : 1;
      case "NAND":
        return a & b ? 0 : 1;
      case "NOR":
        return a | b ? 0 : 1;
      case "XOR":
        return a ^ b;
      default:
        return 0;
    }
  },
  _compute() {
    const s = this.state;
    for (const g of s.gates) {
      const a = s.inputs[g.a] ?? 0;
      const b = s.inputs[g.b] ?? 0;
      g.out = this._evaluate(g.type, a, b);
    }
  },
  step() {
    this._compute();
    if (this.state.glitch_injected) {
      const g = this.state.gates[rand(0, 3)];
      g.out = g.out ? 0 : 1;
      Engine.log("Glitch: gate output flipped for 1 tick", "fault");
      this.state.glitch_injected = false;
    }
    this._render();
  },
  _render() {
    const s = this.state;
    for (let i = 0; i < 4; i++) {
      const c = el(`gi-${i}`);
      if (c) {
        c.className = "bit-cell " + bitClass(s.inputs[i]);
        c.textContent = s.inputs[i];
      }
    }
    for (let i = 0; i < s.gates.length; i++) {
      const g = s.gates[i];
      const out = el(`go-${i}`);
      if (out) {
        out.className = "bit-cell " + bitClass(g.out);
        out.textContent = g.out;
      }
      const lbl = el(`gt-${i}`);
      if (lbl) lbl.textContent = g.type;
    }
  },
  template() {
    const inputs = [0, 1, 2, 3]
      .map(
        (i) =>
          `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="color:var(--text-dim);font-size:11px;min-width:18px">I${i}</span>
        <div id="gi-${i}" class="bit-cell bit-0" onclick="M_Gates.state.inputs[${i}]^=1;M_Gates.step()">0</div>
        <span style="font-size:10px;color:var(--text-dim)">click to toggle</span>
      </div>`,
      )
      .join("");
    const gates = [0, 1, 2, 3]
      .map(
        (i) =>
          `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <span class="phase-badge" id="gt-${i}" style="min-width:52px">AND</span>
        <span style="color:var(--text-dim);font-size:11px">→</span>
        <div id="go-${i}" class="bit-cell bit-0">0</div>
      </div>`,
      )
      .join("");
    return `<div class="sim-title">Logic Gates &amp; Composition</div>
    <div class="sim-desc">Logic gates are voltage routers. Click inputs to toggle. Output updates through propagation delay. Chain gates to build combinational circuits.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box"><h4>Inputs (click to toggle)</h4>${inputs}</div>
      <div class="sim-box"><h4>Gate Outputs</h4>${gates}
        <div class="metric-row"><span class="metric-label">Propagation delay</span>
          <span class="metric-val" id="pdly">0 ticks</span></div>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Change gate types</span>
    ${[0, 1, 2, 3]
      .map(
        (i) => `
      <div class="ctrl-row" style="margin-top:4px">
        <span style="color:var(--text-dim);font-size:11px;min-width:28px">G${i}</span>
        <select class="ctrl-select" onchange="M_Gates.state.gates[${i}].type=this.value;M_Gates.step()">
          ${M_Gates._gateTypes.map((t) => `<option${t === M_Gates.state.gates[i]?.type ? " selected" : ""}>${t}</option>`).join("")}
        </select>
      </div>`,
      )
      .join("")}
    </div>`;
  },
  failures() {
    return `${btn("Glitch injection", 'M_Gates.state.glitch_injected=true;Engine.log("FAULT: glitch scheduled","fault")', "ctrl-btn fault-btn")}
    ${btn("Stuck AND gate", 'M_Gates.state.gates[0].type="AND";M_Gates.state.inputs[0]=0;M_Gates.state.inputs[1]=0;Engine.log("FAULT: AND gate inputs stuck LOW","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_Gates);

/* ──────────────────────────────────────────────
   T1-03  LATCHES & CLOCK
   ────────────────────────────────────────────── */
const M_Latch = {
  id: "t1_latch",
  title: "03 · Latches & Clock Cycles",
  state: {},
  init() {
    this.state = {
      S: 0,
      R: 0,
      Q: 0,
      Q_bar: 1,
      clock: 0,
      tick: 0,
      period: 4,
      D: 0,
      mode: "SR",
      metastable: false,
      transitions: 0,
    };
    this._render();
  },
  step() {
    const s = this.state;
    s.tick++;
    if (s.tick % s.period === 0) s.clock ^= 1;
    const edge = s.tick % s.period === 0 && s.clock === 1;
    if (s.mode === "SR") {
      if (s.S && s.R) {
        s.metastable = true;
        s.Q = Math.random() > 0.5 ? 1 : 0;
        Engine.log("FAULT: metastable — S=R=1", "fault");
      } else if (s.S) {
        s.Q = 1;
        s.Q_bar = 0;
        s.metastable = false;
      } else if (s.R) {
        s.Q = 0;
        s.Q_bar = 1;
        s.metastable = false;
      }
    } else {
      if (edge) {
        s.Q = s.D;
        s.Q_bar = s.D ? 0 : 1;
        s.metastable = false;
      }
    }
    s.transitions++;
    this._render();
    Engine.log(`CLK=${s.clock} Q=${s.Q} Q̄=${s.Q_bar}`);
  },
  _render() {
    const s = this.state;
    ["S", "R", "D", "Q", "Q_bar", "clock"].forEach((k) => {
      const e = el("latch-" + k);
      if (e) {
        e.className = "bit-cell " + bitClass(s[k]);
        e.textContent = k === "Q_bar" ? s[k] : s[k];
      }
    });
    const mb = el("latch-meta");
    if (mb) {
      mb.className = "phase-badge" + (s.metastable ? " fault" : "");
      mb.textContent = s.metastable ? "METASTABLE" : "STABLE";
    }
    set("latch-mode", s.mode);
    set("latch-period", s.period);
  },
  template() {
    const sig = (
      k,
    ) => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span style="min-width:28px;color:var(--accent);font-family:monospace;font-size:12px">${k}</span>
      <div id="latch-${k}" class="bit-cell bit-0">0</div></div>`;
    return `<div class="sim-title">Latches &amp; Clock Cycles</div>
    <div class="sim-desc">An SR latch stores one bit via feedback. A D flip-flop adds clock gating — output only changes on clock edge. Set S=R=1 to trigger metastability.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box">
        <h4>Inputs</h4>
        ${sig("S")}${sig("R")}${sig("D")}
        <hr style="border-color:var(--border);margin:8px 0">
        <div onclick="M_Latch.state.S^=1;M_Latch.step()" style="cursor:pointer">${sig("clock").replace("latch-clock", "latch-clock-x")}</div>
        <div id="latch-clock" class="bit-cell bit-0" style="display:none"></div>
      </div>
      <div class="sim-box">
        <h4>Outputs</h4>
        ${sig("Q")}${sig("Q_bar")}
        <div class="metric-row"><span class="metric-label">Mode</span><span class="metric-val" id="latch-mode">SR</span></div>
        <div class="metric-row"><span class="metric-label">Clock period</span><span class="metric-val" id="latch-period">4 ticks</span></div>
        <div id="latch-meta" class="phase-badge" style="margin-top:8px">STABLE</div>
      </div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      ${["S", "R", "D"].map((k) => `<button class="ctrl-btn" onclick="M_Latch.state.${k}^=1;el('latch-${k}').className='bit-cell '+bitClass(M_Latch.state.${k});el('latch-${k}').textContent=M_Latch.state.${k}">Toggle ${k}</button>`).join("")}
    </div>`;
  },
  controls() {
    return (
      `<div class="ctrl-group">
      <span class="ctrl-label">Mode</span>
      <select class="ctrl-select" onchange="M_Latch.state.mode=this.value;set('latch-mode',this.value)">
        <option>SR</option><option>D</option>
      </select>
    </div>` +
      slider(
        "Clock period",
        "latch-period",
        1,
        10,
        4,
        " ticks",
        "M_Latch.state.period=+this.value",
      )
    );
  },
  failures() {
    return `${btn("Force S=R=1 (metastable)", "M_Latch.state.S=1;M_Latch.state.R=1;M_Latch.step()", "ctrl-btn fault-btn")}
    ${btn("Power glitch (random Q flip)", 'M_Latch.state.Q=Math.random()>.5?1:0;M_Latch.state.Q_bar^=1;Engine.log("FAULT: power glitch","fault");M_Latch._render()', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_Latch);

/* ──────────────────────────────────────────────
   T1-04  REGISTERS & DATA PATHS
   ────────────────────────────────────────────── */
const M_Regs = {
  id: "t1_regs",
  title: "04 · Registers & Data Paths",
  state: {},
  init() {
    this.state = {
      regs: new Array(8).fill(0),
      bus: null,
      WE: [...new Array(8).fill(false)],
      OE: [...new Array(8).fill(false)],
      contention: false,
      clock_edge: false,
      input_val: 0,
    };
    this._render();
  },
  step() {
    const s = this.state;
    const oe_active = s.OE.filter(Boolean).length;
    if (oe_active > 1) {
      s.contention = true;
      s.bus = null;
      Engine.log("FAULT: bus contention", "fault");
    } else if (oe_active === 1) {
      s.contention = false;
      const src = s.OE.indexOf(true);
      s.bus = s.regs[src];
    } else {
      s.bus = null;
    }
    s.clock_edge = true;
    for (let i = 0; i < 8; i++) {
      if (s.WE[i] && s.clock_edge && s.bus !== null) {
        s.regs[i] = s.bus;
        Engine.log(`R${i} ← 0x${hex(s.bus)}`, "ok");
      }
    }
    s.clock_edge = false;
    this._render();
  },
  _render() {
    const s = this.state;
    for (let i = 0; i < 8; i++) {
      set(`reg-val-${i}`, `0x${hex(s.regs[i])} (${bin(s.regs[i])})`);
      const we = el(`we-${i}`);
      if (we) we.className = "ctrl-btn" + (s.WE[i] ? " active" : "");
      const oe = el(`oe-${i}`);
      if (oe) oe.className = "ctrl-btn" + (s.OE[i] ? " active" : "");
    }
    const bd = el("bus-display");
    if (bd) {
      if (s.contention) {
        bd.textContent = "BUS: CONTENTION";
        bd.style.color = "var(--red)";
      } else if (s.bus !== null) {
        bd.textContent = `BUS: 0x${hex(s.bus)}`;
        bd.style.color = "var(--accent)";
      } else {
        bd.textContent = "BUS: floating";
        bd.style.color = "var(--text-dim)";
      }
    }
  },
  template() {
    const rows = [0, 1, 2, 3, 4, 5, 6, 7]
      .map(
        (i) => `
      <div class="reg-row">
        <span class="reg-name">R${i}</span>
        <span class="reg-val" id="reg-val-${i}">0x00</span>
        <button id="we-${i}" class="ctrl-btn" onclick="M_Regs.state.WE[${i}]^=true;M_Regs._render()" style="font-size:10px;padding:2px 6px">WE</button>
        <button id="oe-${i}" class="ctrl-btn" onclick="M_Regs.state.OE[${i}]^=true;M_Regs._render()" style="font-size:10px;padding:2px 6px">OE</button>
      </div>`,
      )
      .join("");
    return `<div class="sim-title">Registers &amp; Data Paths</div>
    <div class="sim-desc">Registers are clocked flip-flop arrays sharing a bus. WE=Write Enable, OE=Output Enable. Enable OE on two registers simultaneously to trigger bus contention.</div>
    <div style="display:grid;grid-template-columns:1fr 220px;gap:16px">
      <div class="sim-box"><h4>Register File</h4>${rows}</div>
      <div class="sim-box">
        <h4>Bus</h4>
        <div id="bus-display" style="font-family:monospace;font-size:14px;padding:8px 0;color:var(--text-dim)">BUS: floating</div>
        <hr style="border-color:var(--border);margin:8px 0">
        <div class="ctrl-group">
          <span class="ctrl-label">Load value into input</span>
          <input type="number" min="0" max="255" value="0" class="ctrl-select" id="reg-input"
            oninput="M_Regs.state.input_val=+this.value&255">
          <button class="ctrl-btn" onclick="const s=M_Regs.state;const oe=s.OE.indexOf(true);if(oe>=0)s.regs[oe]=s.input_val;M_Regs._render()">Write to OE register</button>
        </div>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">WE = Write Enable on clock edge<br>OE = Output to bus<br>Step to trigger clock edge</span></div>`;
  },
  failures() {
    return `${btn("Force contention (OE 0+1)", "M_Regs.state.OE[0]=true;M_Regs.state.OE[1]=true;M_Regs.step()", "ctrl-btn fault-btn")}
    ${btn("Floating bus", 'M_Regs.state.OE=new Array(8).fill(false);M_Regs._render();Engine.log("FAULT: floating bus","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_Regs);

/* ──────────────────────────────────────────────
   T1-05  ALU OPERATIONS
   ────────────────────────────────────────────── */
const M_ALU = {
  id: "t1_alu",
  title: "05 · ALU Operations",
  state: {},
  init() {
    this.state = {
      A: 0x0f,
      B: 0x01,
      op: "ADD",
      result: 0,
      flags: { Z: 0, N: 0, C: 0, V: 0 },
      carry_chain: [0, 0, 0, 0, 0, 0, 0, 0],
      step_bit: 0,
      mode: "instant",
      fault: null,
    };
    this._compute();
    this._render();
  },
  _compute() {
    const s = this.state;
    let r = 0,
      carry = 0;
    switch (s.op) {
      case "ADD":
        r = s.A + s.B;
        s.carry_chain = [];
        for (let i = 0; i < 8; i++) {
          const a = (s.A >> i) & 1,
            b = (s.B >> i) & 1;
          const sum = a + b + carry;
          s.carry_chain[i] = sum >> 1;
          carry = sum >> 1;
          r = (s.A + s.B) & 0xff;
        }
        s.flags.C = s.A + s.B > 0xff ? 1 : 0;
        s.flags.V = ~(s.A ^ s.B) & (s.A ^ (s.A + s.B)) & 0x80 ? 1 : 0;
        break;
      case "SUB":
        r = (s.A - s.B + 256) & 0xff;
        s.flags.C = s.A < s.B ? 1 : 0;
        break;
      case "AND":
        r = s.A & s.B;
        s.flags.C = 0;
        break;
      case "OR":
        r = s.A | s.B;
        s.flags.C = 0;
        break;
      case "XOR":
        r = s.A ^ s.B;
        s.flags.C = 0;
        break;
      case "SHL":
        r = (s.A << 1) & 0xff;
        s.flags.C = (s.A >> 7) & 1;
        break;
      case "SHR":
        r = (s.A >> 1) & 0xff;
        s.flags.C = s.A & 1;
        break;
    }
    if (s.fault === "carry_stuck") {
      r ^= 1 << 3;
      s.carry_chain[2] = 0;
      Engine.log("FAULT: carry bit 2 stuck 0", "fault");
    }
    s.result = r;
    s.flags.Z = r === 0 ? 1 : 0;
    s.flags.N = (r >> 7) & 1;
  },
  step() {
    if (this.state.mode === "ripple") {
      this.state.step_bit = Math.min(this.state.step_bit + 1, 7);
      Engine.log(
        `Ripple carry: bit ${this.state.step_bit} carry_out=${this.state.carry_chain[this.state.step_bit]}`,
      );
    } else {
      this._compute();
    }
    this._render();
  },
  _render() {
    const s = this.state;
    set(
      "alu-result",
      `0x${hex(s.result)} = ${bin(s.result)} (dec: ${s.result})`,
    );
    ["Z", "N", "C", "V"].forEach((f) => {
      const e = el("flag-" + f);
      if (e) {
        e.className = "bit-cell " + (s.flags[f] ? "bit-1" : "bit-0");
        e.textContent = s.flags[f];
      }
    });
    const chain = el("carry-chain");
    if (chain && s.carry_chain)
      chain.innerHTML = s.carry_chain
        .map(
          (c, i) =>
            `<div class="bit-cell ${i <= s.step_bit || s.mode === "instant" ? bitClass(c) : "bit-x"}" style="width:28px;height:28px;font-size:10px">C${i}</div>`,
        )
        .join("");
  },
  template() {
    return `<div class="sim-title">ALU Operations</div>
    <div class="sim-desc">The ALU is combinational logic for arithmetic. In ripple mode, carry propagates bit-by-bit — step to watch it advance. Flags Z/N/C/V reflect the result properties.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box">
        <h4>Operands</h4>
        <div class="ctrl-group" style="margin-bottom:8px">
          <div class="ctrl-row"><span class="ctrl-label">A (hex)</span>
            <input type="text" maxlength="2" value="0F" class="ctrl-select" style="width:50px" id="alu-a"
              oninput="M_ALU.state.A=parseInt(this.value,16)||0;M_ALU._compute();M_ALU._render()"></div>
          <div class="ctrl-row"><span class="ctrl-label">B (hex)</span>
            <input type="text" maxlength="2" value="01" class="ctrl-select" style="width:50px" id="alu-b"
              oninput="M_ALU.state.B=parseInt(this.value,16)||0;M_ALU._compute();M_ALU._render()"></div>
          <div class="ctrl-row"><span class="ctrl-label">Operation</span>
            <select class="ctrl-select" onchange="M_ALU.state.op=this.value;M_ALU._compute();M_ALU._render()">
              ${["ADD", "SUB", "AND", "OR", "XOR", "SHL", "SHR"].map((o) => `<option>${o}</option>`).join("")}
            </select></div>
        </div>
        <div style="color:var(--text-dim);font-size:11px;margin-bottom:6px">Carry chain (ripple mode):</div>
        <div id="carry-chain" class="bit-row"></div>
      </div>
      <div class="sim-box">
        <h4>Result &amp; Flags</h4>
        <div style="font-family:monospace;font-size:13px;color:var(--accent);margin-bottom:12px" id="alu-result">—</div>
        <div class="bit-row" style="gap:12px">
          ${["Z", "N", "C", "V"].map((f) => `<div style="text-align:center"><div class="bit-cell bit-0" id="flag-${f}">${0}</div><div style="font-size:10px;color:var(--text-dim);margin-top:3px">${f}</div></div>`).join("")}
        </div>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Mode</span>
    <select class="ctrl-select" onchange="M_ALU.state.mode=this.value;M_ALU.state.step_bit=0">
      <option value="instant">Instant (combinational)</option>
      <option value="ripple">Ripple carry (step by step)</option>
    </select></div>`;
  },
  failures() {
    return `${btn("Carry stuck-0 at bit 2", 'M_ALU.state.fault="carry_stuck";M_ALU._compute();M_ALU._render()', "ctrl-btn fault-btn")}
    ${btn("Random bit flip", 'M_ALU.state.result^=(1<<rand(0,7));M_ALU._render();Engine.log("FAULT: result bit flipped","fault")', "ctrl-btn fault-btn")}
    ${btn("Clear fault", "M_ALU.state.fault=null;M_ALU._compute();M_ALU._render()", "ctrl-btn")}`;
  },
};
register("t1", M_ALU);

/* ──────────────────────────────────────────────
   T1-06  INSTRUCTION ENCODING
   ────────────────────────────────────────────── */
const M_Encode = {
  id: "t1_encode",
  title: "06 · Instruction Encoding",
  state: {},
  ISA: [
    { opcode: 0b000, name: "NOP", fmt: "—" },
    { opcode: 0b001, name: "ADD", fmt: "dst,src" },
    { opcode: 0b010, name: "SUB", fmt: "dst,src" },
    { opcode: 0b011, name: "MOV", fmt: "dst,imm" },
    { opcode: 0b100, name: "JMP", fmt: "addr" },
    { opcode: 0b101, name: "JZ", fmt: "addr" },
    { opcode: 0b110, name: "LD", fmt: "dst,src" },
    { opcode: 0b111, name: "ST", fmt: "src,dst" },
  ],
  init() {
    this.state = {
      bits: [0, 0, 1, 0, 0, 1, 0, 0],
      opcode: 1,
      dst: 1,
      src: 0,
      imm: 0,
      decoded: {},
      error: false,
    };
    this._decode();
    this._render();
  },
  _decode() {
    const s = this.state;
    s.opcode = (s.bits[0] << 2) | (s.bits[1] << 1) | s.bits[2];
    s.dst = (s.bits[3] << 1) | s.bits[4];
    s.src = (s.bits[5] << 1) | s.bits[6];
    s.imm = s.bits[7];
    const isa = this.ISA.find((i) => i.opcode === s.opcode);
    s.decoded = {
      op: isa ? isa.name : "???",
      dst: "R" + s.dst,
      src: s.imm ? "#" + s.src : "R" + s.src,
      fmt: isa ? isa.fmt : "—",
    };
    s.error = !isa;
  },
  step() {
    this._decode();
    this._render();
    Engine.log(
      `Decoded: ${this.state.decoded.op} ${this.state.decoded.dst}, ${this.state.decoded.src}`,
    );
  },
  _render() {
    const s = this.state;
    for (let i = 0; i < 8; i++) {
      const c = el(`enc-bit-${i}`);
      if (c) {
        c.className = "bit-cell " + bitClass(s.bits[i]);
        c.textContent = s.bits[i];
      }
    }
    const dv = el("enc-decoded");
    if (dv)
      dv.textContent = `${s.decoded.op}  ${s.decoded.dst},  ${s.decoded.src}`;
    const field = el("enc-fields");
    if (field)
      field.innerHTML = `<span style="color:var(--red)">OPC[${bin(s.opcode, 3)}]</span> <span style="color:var(--green)">DST[${bin(s.dst, 2)}]</span> <span style="color:var(--cyan)">SRC[${bin(s.src, 2)}]</span> <span style="color:var(--yellow)">IMM[${s.imm}]</span>`;
    const ev = el("enc-error");
    if (ev) ev.style.display = s.error ? "block" : "none";
  },
  template() {
    const bits = [0, 1, 2, 3, 4, 5, 6, 7]
      .map(
        (i) =>
          `<div id="enc-bit-${i}" class="bit-cell bit-0" onclick="M_Encode.state.bits[${i}]^=1;M_Encode.step()">0</div>`,
      )
      .join("");
    const labels = [
      '<span style="color:var(--red);font-size:9px">OPC</span>',
      '<span style="color:var(--red);font-size:9px">OPC</span>',
      '<span style="color:var(--red);font-size:9px">OPC</span>',
      '<span style="color:var(--green);font-size:9px">DST</span>',
      '<span style="color:var(--green);font-size:9px">DST</span>',
      '<span style="color:var(--cyan);font-size:9px">SRC</span>',
      '<span style="color:var(--cyan);font-size:9px">SRC</span>',
      '<span style="color:var(--yellow);font-size:9px">IMM</span>',
    ].join("");
    return `<div class="sim-title">Instruction Encoding</div>
    <div class="sim-desc">8-bit instruction: [3-bit opcode | 2-bit dst | 2-bit src | 1-bit immediate]. Click bits to toggle. Hardware decodes fields to determine operation.</div>
    <div class="sim-box">
      <h4>Raw Instruction Bits (click to toggle)</h4>
      <div class="bit-row" style="gap:3px">${bits}</div>
      <div class="bit-row" style="gap:3px;margin-top:4px">${labels}</div>
    </div>
    <div class="sim-box" style="margin-top:12px">
      <h4>Decoded Instruction</h4>
      <div id="enc-fields" style="font-family:monospace;font-size:12px;margin-bottom:8px"></div>
      <div id="enc-decoded" style="font-family:monospace;font-size:18px;color:var(--accent);margin-bottom:6px">—</div>
      <div id="enc-error" style="color:var(--red);display:none">⚠ Undefined opcode — hardware behavior undefined</div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Load preset instruction</span>
    <select class="ctrl-select" onchange="const i=M_Encode.ISA[+this.value];M_Encode.state.bits=[...(i.opcode>>2&1),(i.opcode>>1&1),(i.opcode&1),0,1,0,0,0];M_Encode.step()">
      ${this.ISA.map((i, idx) => `<option value="${idx}">${i.name} (${bin(i.opcode, 3)}xxx)</option>`).join("")}
    </select></div>`;
  },
  failures() {
    return `${btn("Set undefined opcode (111)", "M_Encode.state.bits[0]=1;M_Encode.state.bits[1]=1;M_Encode.state.bits[2]=1;M_Encode.step()", "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_Encode);

/* ──────────────────────────────────────────────
   T1-07  FETCH–DECODE–EXECUTE
   ────────────────────────────────────────────── */
const M_FDE = {
  id: "t1_fde",
  title: "07 · Fetch–Decode–Execute",
  state: {},
  _programs: {
    "Count 0→5": [
      0b00110000, 0b00110001, 0b00100001, 0b10100000, 0b11100000, 0b00000000,
    ],
    "Add two": [0b01100000, 0b01100001, 0b00100001, 0b00000000],
  },
  init() {
    this.state = {
      pc: 0,
      ir: 0,
      phase: "fetch",
      regs: [0, 0, 0, 0],
      flags: { Z: 0, N: 0, C: 0 },
      mem: new Array(16).fill(0),
      halted: false,
      cycles: 0,
      fault: null,
    };
    const prog = Object.values(this._programs)[0];
    prog.forEach((b, i) => (this.state.mem[i] = b));
    this._render();
  },
  step() {
    const s = this.state;
    if (s.halted) {
      Engine.log("CPU halted");
      return;
    }
    if (s.fault === "corrupt_ir" && s.phase === "decode") {
      s.ir ^= 0x0f;
      Engine.log("FAULT: IR corrupted", "fault");
      s.fault = null;
    }
    switch (s.phase) {
      case "fetch":
        if (s.pc >= s.mem.length) {
          s.halted = true;
          Engine.log("FAULT: PC out of bounds", "fault");
          return;
        }
        s.ir = s.mem[s.pc];
        s.phase = "decode";
        Engine.log(`FETCH mem[${s.pc}] = 0x${hex(s.ir)}`, "info");
        break;
      case "decode":
        s._opc = (s.ir >> 5) & 0x7;
        s._dst = (s.ir >> 3) & 0x3;
        s._src = s.ir & 0x7;
        s.phase = "execute";
        Engine.log(`DECODE opc=${s._opc} dst=R${s._dst} src=${s._src}`, "info");
        break;
      case "execute":
        switch (s._opc) {
          case 0b000:
            break; // NOP
          case 0b001:
            s.regs[s._dst] = (s.regs[s._dst] + s.regs[s._src]) & 0xff;
            break; // ADD
          case 0b010:
            s.regs[s._dst] = (s.regs[s._dst] - s.regs[s._src] + 256) & 0xff;
            break; // SUB
          case 0b011:
            s.regs[s._dst] = s._src;
            break; // MOV imm
          case 0b110:
            s.regs[s._dst] = s.mem[s._src] ?? 0;
            break; // LD
          case 0b111:
            s.mem[s._src] = s.regs[s._dst];
            break; // ST
          case 0b101:
            if (s.flags.Z) {
              s.pc = s._src - 1;
            }
            break; // JZ
          case 0b100:
            s.pc = s._src - 1;
            break; // JMP
        }
        s.flags.Z = s.regs[s._dst] === 0 ? 1 : 0;
        s.pc++;
        s.cycles++;
        s.phase = "fetch";
        Engine.log(`EXECUTE → R${s._dst}=${s.regs[s._dst]}  PC→${s.pc}`, "ok");
        break;
    }
    this._render();
  },
  _render() {
    const s = this.state;
    ["fetch", "decode", "execute"].forEach((p) => {
      const e = el("phase-" + p);
      if (e)
        e.className =
          "phase-badge" +
          (s.phase === p ? " active" : "") +
          (s.halted ? " fault" : "");
    });
    set("fde-pc", "0x" + hex(s.pc));
    set("fde-ir", "0x" + hex(s.ir));
    set("fde-cycles", s.cycles);
    for (let i = 0; i < 4; i++) set(`fde-r${i}`, `R${i}=0x${hex(s.regs[i])}`);
    const mg = el("fde-mem");
    if (mg)
      mg.innerHTML = s.mem
        .map(
          (b, i) =>
            `<div class="mem-cell${i === s.pc ? " active" : ""}">${hex(b)}</div>`,
        )
        .join("");
  },
  template() {
    return `<div class="sim-title">Fetch–Decode–Execute Cycle</div>
    <div class="sim-desc">The CPU is a 3-phase state machine. FETCH loads next instruction from memory[PC], DECODE parses opcode and fields, EXECUTE dispatches to ALU or memory. Step one phase at a time.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box">
        <h4>CPU State</h4>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <span class="phase-badge" id="phase-fetch">FETCH</span>
          <span style="color:var(--text-dim)">→</span>
          <span class="phase-badge" id="phase-decode">DECODE</span>
          <span style="color:var(--text-dim)">→</span>
          <span class="phase-badge" id="phase-execute">EXECUTE</span>
        </div>
        <div class="metric-row"><span class="metric-label">PC</span><span class="metric-val" id="fde-pc">0x00</span></div>
        <div class="metric-row"><span class="metric-label">IR</span><span class="metric-val" id="fde-ir">0x00</span></div>
        <div class="metric-row"><span class="metric-label">Cycles</span><span class="metric-val" id="fde-cycles">0</span></div>
        ${[0, 1, 2, 3].map((i) => `<div class="metric-row"><span class="metric-val" id="fde-r${i}">R${i}=0x00</span></div>`).join("")}
      </div>
      <div class="sim-box">
        <h4>Memory (click = breakpoint)</h4>
        <div id="fde-mem" class="mem-grid"></div>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Load program</span>
    <select class="ctrl-select" onchange="const p=M_FDE._programs[this.value];if(p){M_FDE.init();p.forEach((b,i)=>M_FDE.state.mem[i]=b);M_FDE._render()}">
      ${Object.keys(this._programs)
        .map((k) => `<option>${k}</option>`)
        .join("")}
    </select></div>`;
  },
  failures() {
    return `${btn("Corrupt IR (mid-decode)", 'M_FDE.state.fault="corrupt_ir";Engine.log("FAULT: IR corruption scheduled","fault")', "ctrl-btn fault-btn")}
    ${btn("PC jump to bad address", 'M_FDE.state.pc=14;Engine.log("FAULT: PC=14 (near end of mem)","fault")', "ctrl-btn fault-btn")}
    ${btn("Inject infinite loop", 'M_FDE.state.mem[M_FDE.state.pc]=0b10000000;Engine.log("FAULT: JMP 0 injected","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_FDE);

/* ──────────────────────────────────────────────
   T1-08  MEMORY ADDRESSING
   ────────────────────────────────────────────── */
const M_Mem = {
  id: "t1_mem",
  title: "08 · Memory Addressing",
  state: {},
  init() {
    this.state = {
      mode: "direct",
      base: 0,
      offset: 8,
      index: 1,
      scale: 1,
      computed: 8,
      mem: new Array(64).fill(0).map((_, i) => rand(0, 255)),
      latency: 3,
      remaining: 0,
      data_valid: false,
      last_read: null,
      phase: "idle",
      accesses: [],
      fault: null,
    };
    this._render();
  },
  _calcAddr() {
    const s = this.state;
    switch (s.mode) {
      case "direct":
        return s.base;
      case "offset":
        return (s.base + s.offset) & 0x3f;
      case "indexed":
        return (s.base + s.index * s.scale) & 0x3f;
      case "indirect":
        return s.mem[s.base] & 0x3f;
      default:
        return 0;
    }
  },
  step() {
    const s = this.state;
    if (s.phase === "idle") {
      s.computed = this._calcAddr();
      if (s.fault === "segfault" && s.computed > 50) {
        Engine.log("FAULT: segfault — address out of range", "fault");
        s.phase = "idle";
        return;
      }
      s.remaining = s.latency;
      s.data_valid = false;
      s.phase = "waiting";
      Engine.log(
        `ACCESS 0x${hex(s.computed, 2)} — waiting ${s.latency} ticks`,
        "info",
      );
    } else if (s.phase === "waiting") {
      s.remaining--;
      if (s.remaining <= 0) {
        s.data_valid = true;
        s.last_read = s.mem[s.computed];
        s.phase = "done";
        Engine.log(`DATA: 0x${hex(s.last_read)}`, "ok");
      }
    } else {
      s.phase = "idle";
    }
    s.accesses.push(s.computed);
    this._render();
  },
  _render() {
    const s = this.state;
    set("mem-computed", `0x${hex(s.computed, 2)}`);
    set(
      "mem-data",
      s.data_valid
        ? `0x${hex(s.last_read)}`
        : s.phase === "waiting"
          ? `… (${s.remaining} ticks)`
          : "—",
    );
    const lat = el("mem-lat");
    if (lat) {
      const p = ((s.latency - s.remaining) / s.latency) * 100;
      lat.style.width = p + "%";
      lat.className = "fill-bar" + (p < 100 ? "" : " good");
    }
    const mg = el("mem-grid-view");
    if (mg)
      mg.innerHTML = s.mem
        .map(
          (b, i) =>
            `<div class="mem-cell${i === s.computed ? " active" : ""}">${hex(b)}</div>`,
        )
        .join("");
  },
  template() {
    return `<div class="sim-title">Memory Addressing Modes</div>
    <div class="sim-desc">Addressing modes are just arithmetic on the address bus. Access incurs latency — data isn't valid until the latency completes. Step to watch the delay tick down.</div>
    <div style="display:grid;grid-template-columns:1fr 220px;gap:16px">
      <div class="sim-box">
        <h4>Memory (64 bytes)</h4>
        <div id="mem-grid-view" class="mem-grid"></div>
      </div>
      <div class="sim-box">
        <h4>Address Calculation</h4>
        <div class="metric-row"><span class="metric-label">Mode</span>
          <select class="ctrl-select" style="width:100px" onchange="M_Mem.state.mode=this.value;M_Mem.state.computed=M_Mem._calcAddr();M_Mem._render()">
            <option>direct</option><option>offset</option><option>indexed</option><option>indirect</option>
          </select>
        </div>
        <div class="metric-row"><span class="metric-label">Base</span><input type="number" min="0" max="63" value="0" class="ctrl-select" style="width:55px" oninput="M_Mem.state.base=+this.value&63;M_Mem.state.computed=M_Mem._calcAddr();M_Mem._render()"></div>
        <div class="metric-row"><span class="metric-label">Offset</span><input type="number" min="0" max="63" value="8" class="ctrl-select" style="width:55px" oninput="M_Mem.state.offset=+this.value;M_Mem.state.computed=M_Mem._calcAddr();M_Mem._render()"></div>
        <div class="metric-row"><span class="metric-label">→ Address</span><span class="metric-val" id="mem-computed">0x08</span></div>
        <div class="metric-row"><span class="metric-label">Data</span><span class="metric-val" id="mem-data">—</span></div>
        <div style="margin-top:8px"><span class="ctrl-label">Latency</span>
          <div class="fill-bar-wrap" style="margin-top:4px"><div id="mem-lat" class="fill-bar" style="width:0%"></div></div>
        </div>
      </div>
    </div>`;
  },
  controls() {
    return slider(
      "Latency (ticks)",
      "mem-latency",
      1,
      20,
      3,
      "",
      `M_Mem.state.latency=+this.value`,
    );
  },
  failures() {
    return `${btn("Segfault (addr > 50)", 'M_Mem.state.fault="segfault";M_Mem.state.base=55;Engine.log("FAULT: segfault injection","fault")', "ctrl-btn fault-btn")}
    ${btn("Latency spike (×5)", 'M_Mem.state.latency*=5;Engine.log("FAULT: latency spike","fault")', "ctrl-btn fault-btn")}
    ${btn("Reset", "M_Mem.state.fault=null;M_Mem.state.latency=3", "ctrl-btn")}`;
  },
};
register("t1", M_Mem);

/* ──────────────────────────────────────────────
   T1-09  STACK VS HEAP
   ────────────────────────────────────────────── */
const M_Stack = {
  id: "t1_stack",
  title: "09 · Stack vs Heap",
  state: {},
  init() {
    this.state = {
      mem: new Array(128).fill({ type: "free", id: null }),
      sp: 127,
      frames: [],
      allocs: [],
      next_id: 1,
      collision: false,
      frag: 0,
    };
    this._render();
  },
  push(val = 42) {
    const s = this.state;
    if (s.sp <= 64) {
      s.collision = true;
      Engine.log("FAULT: stack overflow", "fault");
      return;
    }
    s.mem[s.sp] = { type: "stack", val, id: "frame" };
    s.frames.push({ addr: s.sp, val });
    s.sp--;
    Engine.log(`PUSH ${val} → sp=${s.sp}`, "ok");
    this._render();
  },
  pop() {
    const s = this.state;
    if (s.sp >= 127) {
      Engine.log("Stack empty");
      return;
    }
    s.sp++;
    const v = s.mem[s.sp].val;
    s.mem[s.sp] = { type: "free", id: null };
    s.frames.pop();
    Engine.log(`POP → ${v}  sp=${s.sp}`, "ok");
    this._render();
  },
  malloc(size = 8) {
    const s = this.state;
    let start = -1;
    for (let i = 0, run = 0; i < 64; i++) {
      if (s.mem[i].type === "free") {
        run++;
        if (run >= size) {
          start = i - size + 1;
          break;
        }
      } else run = 0;
    }
    if (start < 0) {
      Engine.log("FAULT: malloc failed — fragmented heap", "fault");
      return;
    }
    const id = s.next_id++;
    for (let i = start; i < start + size; i++) s.mem[i] = { type: "heap", id };
    s.allocs.push({ id, start, size, freed: false });
    Engine.log(`malloc(${size}) → id=${id} @${start}`, "ok");
    this._frag();
    this._render();
  },
  free(id) {
    const s = this.state;
    const a = s.allocs.find((x) => x.id === id && !x.freed);
    if (!a) {
      Engine.log(`FAULT: double free id=${id}`, "fault");
      return;
    }
    a.freed = true;
    for (let i = a.start; i < a.start + a.size; i++)
      s.mem[i] = { type: "free", id: null };
    Engine.log(`free(id=${id})`, "ok");
    this._frag();
    this._render();
  },
  _frag() {
    const s = this.state;
    const free = s.mem.slice(0, 64).filter((c) => c.type === "free").length;
    const holes = this._countHoles();
    s.frag = holes > 1 ? ((holes - 1) / holes) * 100 : 0;
  },
  _countHoles() {
    let h = 0,
      inHole = false;
    for (const c of this.state.mem.slice(0, 64)) {
      if (c.type === "free") {
        if (!inHole) {
          h++;
          inHole = true;
        }
      } else inHole = false;
    }
    return h;
  },
  step() {
    this.push(rand(0, 99));
  },
  _render() {
    const s = this.state;
    const mg = el("stack-mem");
    if (mg)
      mg.innerHTML = s.mem
        .map((c, i) => {
          let cls = "mem-cell";
          if (i === s.sp + 1) cls += " active";
          if (c.type === "stack") cls += " stack";
          if (c.type === "heap") cls += " heap";
          if (c.type === "corrupt") cls += " corrupt";
          return `<div class="${cls}" title="${i}">${c.val !== undefined ? c.val.toString().slice(0, 2) : "··"}</div>`;
        })
        .join("");
    set("stack-sp", s.sp);
    set("stack-frag", s.frag.toFixed(0) + "%");
    set("stack-allocs", s.allocs.filter((a) => !a.freed).length);
    const col = el("stack-collision");
    if (col) col.className = "phase-badge" + (s.collision ? " fault" : "");
  },
  template() {
    return `<div class="sim-title">Stack vs Heap</div>
    <div class="sim-desc">Stack (top, grows down) and heap (bottom, grows up) share the same memory. Stack is LIFO. Heap uses a free list. Fragmentation occurs after repeated malloc/free cycles.</div>
    <div style="display:grid;grid-template-columns:1fr 200px;gap:16px">
      <div class="sim-box">
        <h4>Memory (128 bytes — heap:0–63, stack:64–127)</h4>
        <div id="stack-mem" class="mem-grid"></div>
        <div style="display:flex;gap:12px;margin-top:8px;font-size:10px">
          <span style="color:var(--cyan)">■ stack</span>
          <span style="color:var(--green)">■ heap alloc</span>
          <span style="color:var(--text-dim)">■ free</span>
        </div>
      </div>
      <div class="sim-box">
        <h4>Metrics</h4>
        <div class="metric-row"><span class="metric-label">SP</span><span class="metric-val" id="stack-sp">127</span></div>
        <div class="metric-row"><span class="metric-label">Live allocs</span><span class="metric-val" id="stack-allocs">0</span></div>
        <div class="metric-row"><span class="metric-label">Fragmentation</span><span class="metric-val warn" id="stack-frag">0%</span></div>
        <div id="stack-collision" class="phase-badge" style="margin-top:8px">NO COLLISION</div>
        <hr style="border-color:var(--border);margin:10px 0">
        <button class="ctrl-btn" style="width:100%;margin-bottom:4px" onclick="M_Stack.push(rand(0,99))">PUSH value</button>
        <button class="ctrl-btn" style="width:100%;margin-bottom:4px" onclick="M_Stack.pop()">POP</button>
        <button class="ctrl-btn" style="width:100%;margin-bottom:4px" onclick="M_Stack.malloc(rand(4,12))">malloc(random)</button>
        <button class="ctrl-btn" style="width:100%;" onclick="const a=M_Stack.state.allocs.find(x=>!x.freed);if(a)M_Stack.free(a.id)">free(oldest)</button>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Step = PUSH random value</span></div>`;
  },
  failures() {
    return `${btn("Stack overflow (push 70×)", "for(let i=0;i<70;i++)M_Stack.push(i)", "ctrl-btn fault-btn")}
    ${btn("Double free", "const a=M_Stack.state.allocs[0];if(a){M_Stack.free(a.id);M_Stack.free(a.id)}else{M_Stack.malloc(8);setTimeout(()=>{M_Stack.free(1);M_Stack.free(1)},100)}", "ctrl-btn fault-btn")}
    ${btn("Fragment heap", "for(let i=0;i<5;i++)M_Stack.malloc(4);for(let i=1;i<=5;i+=2)M_Stack.free(i)", "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_Stack);

/* ──────────────────────────────────────────────
   T1-10  CACHE LOCALITY
   ────────────────────────────────────────────── */
const M_Cache = {
  id: "t1_cache",
  title: "10 · Cache Locality",
  state: {},
  init() {
    this.state = {
      mem: new Array(64).fill(0).map(() => rand(0, 255)),
      cache: [
        { valid: false, tag: -1, data: [], lru: 0 },
        { valid: false, tag: -1, data: [], lru: 0 },
        { valid: false, tag: -1, data: [], lru: 0 },
        { valid: false, tag: -1, data: [], lru: 0 },
      ],
      pattern: "sequential",
      stride: 1,
      ptr: 0,
      hits: 0,
      misses: 0,
      evictions: 0,
      line_size: 4,
      sets: 4,
      latency_hit: 1,
      latency_miss: 8,
      last_latency: 0,
      heat: new Array(64).fill(0),
    };
    this._render();
  },
  _nextAddr() {
    const s = this.state;
    let a = 0;
    switch (s.pattern) {
      case "sequential":
        a = s.ptr % 64;
        s.ptr++;
        break;
      case "strided":
        a = (s.ptr * s.stride) % 64;
        s.ptr++;
        break;
      case "random":
        a = rand(0, 63);
        break;
    }
    return a;
  },
  step() {
    const s = this.state;
    const addr = this._nextAddr();
    s.heat[addr] = (s.heat[addr] || 0) + 1;
    const tag = Math.floor(addr / s.line_size);
    const setIdx = tag % s.sets;
    const line = s.cache[setIdx];
    if (line.valid && line.tag === tag) {
      s.hits++;
      s.last_latency = s.latency_hit;
      line.lru = Date.now();
      Engine.log(`HIT  addr=${addr} set=${setIdx} tag=${tag}`, "ok");
    } else {
      s.misses++;
      if (line.valid) s.evictions++;
      s.last_latency = s.latency_miss;
      const base = tag * s.line_size;
      line.valid = true;
      line.tag = tag;
      line.lru = Date.now();
      line.data = s.mem.slice(base, base + s.line_size);
      Engine.log(
        `MISS addr=${addr} set=${setIdx} — load from mem (${s.latency_miss} cycles)`,
        "fault",
      );
    }
    this._render();
  },
  _render() {
    const s = this.state;
    const total = s.hits + s.misses;
    const hr = total ? ((s.hits / total) * 100).toFixed(1) + "%" : "—";
    set("cache-hits", s.hits);
    set("cache-misses", s.misses);
    set("cache-hr", hr);
    set("cache-lat", s.last_latency + " cycles");
    const cv = el("cache-view");
    if (cv)
      cv.innerHTML = s.cache
        .map(
          (l, i) =>
            `<div class="cache-line${l.valid ? " hit" : ""}">
        <span class="cl-valid">${l.valid ? "V" : "—"}</span>
        <span class="cl-tag">T:${l.tag < 0 ? "—" : hex(l.tag)}</span>
        <span class="cl-data">${l.valid ? l.data.map((d) => `<span>${hex(d)}</span>`).join("") : "—"}</span>
      </div>`,
        )
        .join("");
    const mh = el("mem-heat");
    if (mh)
      mh.innerHTML = s.heat
        .map((h, i) => {
          const intensity = Math.min(h / 5, 1);
          const bg = `rgba(255,${Math.floor(165 * (1 - intensity))},0,${0.2 + intensity * 0.8})`;
          return `<div class="mem-cell" style="background:${bg};font-size:8px">${hex(s.mem[i])}</div>`;
        })
        .join("");
  },
  template() {
    return `<div class="sim-title">Cache Locality</div>
    <div class="sim-desc">Cache maps memory addresses to cache lines via tag comparison. A miss costs 8× more than a hit. Sequential access = all hits after cold start. Strided with stride=cache_sets = thrash.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box">
        <h4>Cache (4 lines × 4 bytes, direct-mapped)</h4>
        <div id="cache-view"></div>
        <div class="metric-row" style="margin-top:8px"><span class="metric-label">Hits</span><span class="metric-val good" id="cache-hits">0</span></div>
        <div class="metric-row"><span class="metric-label">Misses</span><span class="metric-val bad" id="cache-misses">0</span></div>
        <div class="metric-row"><span class="metric-label">Hit rate</span><span class="metric-val" id="cache-hr">—</span></div>
        <div class="metric-row"><span class="metric-label">Last access latency</span><span class="metric-val" id="cache-lat">—</span></div>
      </div>
      <div class="sim-box">
        <h4>Memory access heat map</h4>
        <div id="mem-heat" class="mem-grid"></div>
      </div>
    </div>`;
  },
  controls() {
    return (
      `<div class="ctrl-group"><span class="ctrl-label">Access pattern</span>
    <select class="ctrl-select" onchange="M_Cache.state.pattern=this.value;M_Cache.state.ptr=0">
      <option>sequential</option><option>strided</option><option>random</option>
    </select></div>` +
      slider(
        "Stride",
        "cache-stride",
        1,
        16,
        1,
        "",
        `M_Cache.state.stride=+this.value`,
      )
    );
  },
  failures() {
    return `${btn("Cache thrash (stride=4)", 'M_Cache.state.pattern="strided";M_Cache.state.stride=4;Engine.log("FAULT: thrash — stride equals cache sets","fault")', "ctrl-btn fault-btn")}
    ${btn("Cold flush (invalidate all)", 'M_Cache.state.cache.forEach(l=>{l.valid=false;l.tag=-1});Engine.log("FAULT: cache flushed — all cold misses","fault");M_Cache._render()', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_Cache);

/* ──────────────────────────────────────────────
   T1-11  PROCESSES & THREADS
   ────────────────────────────────────────────── */
const M_Proc = {
  id: "t1_proc",
  title: "11 · Processes &amp; Threads",
  state: {},
  _colors: ["#4f8ef7", "#2ecc71", "#f39c12", "#e74c3c"],
  init() {
    this.state = {
      procs: [
        {
          pid: 1,
          name: "shell",
          state: "running",
          regs: [0, 0, 0, 0],
          quantum: 5,
          remaining: 5,
          color: "#4f8ef7",
        },
        {
          pid: 2,
          name: "server",
          state: "ready",
          regs: [10, 0, 0, 0],
          quantum: 5,
          remaining: 5,
          color: "#2ecc71",
        },
        {
          pid: 3,
          name: "worker",
          state: "blocked",
          regs: [20, 5, 0, 0],
          quantum: 5,
          remaining: 5,
          color: "#f39c12",
        },
      ],
      running_idx: 0,
      scheduler: "round_robin",
      switch_cost: 2,
      switch_ticks: 0,
      timeline: [],
      shared: 0,
      race: false,
    };
    this._render();
  },
  step() {
    const s = this.state;
    const cur = s.procs[s.running_idx];
    if (s.switch_ticks > 0) {
      s.switch_ticks--;
      s.timeline.push({ pid: -1, color: "#333" });
      Engine.log("Context switch overhead", "fault");
    } else {
      cur.remaining--;
      if (cur.state === "blocked" && Math.random() < 0.2) {
        cur.state = "ready";
        Engine.log(`P${cur.pid} unblocked`, "ok");
      }
      cur.regs[0]++;
      s.timeline.push({ pid: cur.pid, color: cur.color });
      if (cur.remaining <= 0) {
        const next = (s.running_idx + 1) % s.procs.length;
        let tries = 0;
        let nidx = next;
        while (s.procs[nidx].state === "blocked" && tries < 3) {
          nidx = (nidx + 1) % s.procs.length;
          tries++;
        }
        if (tries < 3) {
          cur.remaining = cur.quantum;
          cur.state = "ready";
          s.running_idx = nidx;
          s.procs[nidx].state = "running";
          s.switch_ticks = s.switch_cost;
          Engine.log(
            `Context switch P${cur.pid} → P${s.procs[nidx].pid}`,
            "info",
          );
        }
      }
    }
    if (s.timeline.length > 60) s.timeline = s.timeline.slice(-60);
    this._render();
  },
  _render() {
    const s = this.state;
    const pt = el("proc-table");
    if (pt)
      pt.innerHTML = s.procs
        .map(
          (p) => `
      <div class="proc-row">
        <span style="color:var(--text-dim);font-family:monospace">${p.pid}</span>
        <span>${p.name}</span>
        <span class="proc-state ${p.state}">${p.state}</span>
        <div style="display:flex;gap:4px">${p.regs.map((r, i) => `<span style="font-size:10px;color:var(--text-dim)">R${i}:${r}</span>`).join("")}</div>
        <span style="font-size:10px;color:var(--accent)">${p.remaining}q</span>
      </div>`,
        )
        .join("");
    const tl = el("gantt");
    if (tl)
      tl.innerHTML = `<div class="gantt-row">
      ${s.timeline.map((t) => `<div class="gantt-cell" style="background:${t.color}" title="${t.pid < 0 ? "switch" : "P" + t.pid}"></div>`).join("")}
    </div>`;
    set("proc-shared", s.shared);
  },
  template() {
    return `<div class="sim-title">Processes &amp; Threads</div>
    <div class="sim-desc">Round-robin scheduler allocates quantum ticks per process. Context switch costs overhead ticks (grey on timeline). Blocked processes are skipped.</div>
    <div class="sim-box">
      <h4>Process Table</h4>
      <div style="display:grid;grid-template-columns:36px 80px 80px 1fr 50px;gap:6px;padding:0 8px;margin-bottom:4px">
        <span style="font-size:10px;color:var(--text-dim)">PID</span><span style="font-size:10px;color:var(--text-dim)">Name</span>
        <span style="font-size:10px;color:var(--text-dim)">State</span><span style="font-size:10px;color:var(--text-dim)">Regs</span>
        <span style="font-size:10px;color:var(--text-dim)">Quantum</span>
      </div>
      <div id="proc-table"></div>
    </div>
    <div class="sim-box" style="margin-top:12px">
      <h4>CPU Timeline (grey = context switch overhead)</h4>
      <div id="gantt"></div>
    </div>
    <div class="sim-box" style="margin-top:12px">
      <div class="metric-row"><span class="metric-label">Shared variable</span><span class="metric-val" id="proc-shared">0</span></div>
    </div>`;
  },
  controls() {
    return (
      slider(
        "Quantum",
        "proc-quantum",
        1,
        10,
        5,
        " ticks",
        "M_Proc.state.procs.forEach(p=>p.quantum=+this.value)",
      ) +
      slider(
        "Switch cost",
        "proc-switch",
        0,
        5,
        2,
        " ticks",
        "M_Proc.state.switch_cost=+this.value",
      )
    );
  },
  failures() {
    return `${btn("Race: both P1+P2 increment shared", 'M_Proc.state.shared++;M_Proc.state.shared++;if(Math.random()<.4){M_Proc.state.shared--;Engine.log("FAULT: lost update — race condition","fault")}', "ctrl-btn fault-btn")}
    ${btn("Block all", 'M_Proc.state.procs.forEach(p=>p.state="blocked");Engine.log("FAULT: all processes blocked","fault")', "ctrl-btn fault-btn")}
    ${btn("Zombie process", 'M_Proc.state.procs[2].state="zombie";Engine.log("FAULT: zombie process created","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_Proc);

/* ──────────────────────────────────────────────
   T1-12  VIRTUAL MEMORY
   ────────────────────────────────────────────── */
const M_VMem = {
  id: "t1_vmem",
  title: "12 · Virtual Memory",
  state: {},
  init() {
    this.state = {
      page_table: Array.from({ length: 16 }, (_, i) => ({
        valid: i < 8,
        frame: i < 8 ? i : null,
        dirty: false,
        prot: "rw",
      })),
      tlb: [
        { vpn: 0, pfn: 0, valid: true },
        { vpn: 1, pfn: 1, valid: true },
        { vpn: -1, pfn: -1, valid: false },
        { vpn: -1, pfn: -1, valid: false },
      ],
      phys: new Array(128).fill(0).map(() => rand(0, 255)),
      tlb_hits: 0,
      tlb_misses: 0,
      page_faults: 0,
      vaddr: 0,
      paddr: null,
      phase: "idle",
      replacement: "LRU",
    };
    this._render();
  },
  step() {
    const s = this.state;
    if (s.phase === "idle") {
      const vpn = Math.floor(s.vaddr / 8) % 16;
      const off = s.vaddr % 8;
      const tlb = s.tlb.find((e) => e.valid && e.vpn === vpn);
      if (tlb) {
        s.tlb_hits++;
        s.paddr = tlb.pfn * 8 + off;
        s.phase = "hit";
        Engine.log(`TLB HIT vaddr=${s.vaddr} → paddr=${s.paddr}`, "ok");
      } else {
        s.tlb_misses++;
        const pte = s.page_table[vpn];
        if (!pte.valid) {
          s.page_faults++;
          s.phase = "fault";
          Engine.log(`PAGE FAULT @ vpn=${vpn} — loading from disk`, "fault");
        } else {
          s.paddr = pte.frame * 8 + off;
          s.phase = "walk";
          Engine.log(
            `TLB MISS — page walk: vpn=${vpn} frame=${pte.frame}`,
            "info",
          );
        }
        const old = s.tlb[s.tlb_hits % 4];
        old.vpn = vpn;
        old.pfn = pte.frame ?? 0;
        old.valid = pte.valid;
      }
    } else {
      s.phase = "idle";
    }
    this._render();
  },
  _render() {
    const s = this.state;
    set("vm-tlb-hits", s.tlb_hits);
    set("vm-tlb-misses", s.tlb_misses);
    set("vm-page-faults", s.page_faults);
    set("vm-paddr", s.paddr !== null ? `0x${hex(s.paddr)}` : "—");
    set("vm-phase", s.phase);
    const pt = el("vm-pt");
    if (pt)
      pt.innerHTML = s.page_table
        .map(
          (e, i) => `
      <div class="cache-line${e.valid ? " hit" : ""}" style="font-size:10px">
        <span style="color:var(--text-dim)">VPN ${hex(i)}</span>
        <span style="color:${e.valid ? "var(--green)" : "var(--red)"}">${e.valid ? "✓" : "✗"}</span>
        <span>${e.valid ? `PFN ${hex(e.frame)}` : "—"}</span>
        <span style="color:var(--text-dim)">${e.prot}</span>
      </div>`,
        )
        .join("");
    const tlb = el("vm-tlb");
    if (tlb)
      tlb.innerHTML = s.tlb
        .map(
          (e, i) => `
      <div class="cache-line${e.valid ? " hit" : ""}">
        <span style="color:var(--text-dim)">${i}</span>
        <span>${e.valid ? `VPN→${hex(e.vpn)}` : " "}</span>
        <span>${e.valid ? `PFN→${hex(e.pfn)}` : " "}</span>
      </div>`,
        )
        .join("");
  },
  template() {
    return `<div class="sim-title">Virtual Memory</div>
    <div class="sim-desc">Virtual addresses translate via TLB → page table → physical frame. TLB hit = fast; TLB miss = page table walk; page fault = load from disk (very slow).</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box">
        <h4>Page Table (16 virtual pages)</h4>
        <div id="vm-pt"></div>
      </div>
      <div class="sim-box">
        <h4>TLB (4 entries)</h4>
        <div id="vm-tlb"></div>
        <hr style="border-color:var(--border);margin:8px 0">
        <div class="metric-row"><span class="metric-label">TLB hits</span><span class="metric-val good" id="vm-tlb-hits">0</span></div>
        <div class="metric-row"><span class="metric-label">TLB misses</span><span class="metric-val warn" id="vm-tlb-misses">0</span></div>
        <div class="metric-row"><span class="metric-label">Page faults</span><span class="metric-val bad" id="vm-page-faults">0</span></div>
        <div class="metric-row"><span class="metric-label">Physical addr</span><span class="metric-val" id="vm-paddr">—</span></div>
        <div class="metric-row"><span class="metric-label">Phase</span><span class="metric-val" id="vm-phase">idle</span></div>
        <div style="margin-top:8px">
          <span class="ctrl-label">Virtual address</span>
          <input type="number" min="0" max="127" value="0" class="ctrl-select" oninput="M_VMem.state.vaddr=+this.value">
        </div>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Set vaddr above, then Step to translate</span></div>`;
  },
  failures() {
    return `${btn("Write to read-only page", 'M_VMem.state.page_table[0].prot="r";M_VMem.state.vaddr=0;Engine.log("FAULT: write to read-only page → segfault","fault")', "ctrl-btn fault-btn")}
    ${btn("Evict all TLB", 'M_VMem.state.tlb.forEach(e=>{e.valid=false});Engine.log("FAULT: TLB flushed — all TLB misses","fault")', "ctrl-btn fault-btn")}
    ${btn("Unmap pages 0–3", 'for(let i=0;i<4;i++)M_VMem.state.page_table[i].valid=false;Engine.log("FAULT: pages 0-3 unmapped","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_VMem);

/* ──────────────────────────────────────────────
   T1-13  FILESYSTEM PERSISTENCE
   ────────────────────────────────────────────── */
const M_FS = {
  id: "t1_fs",
  title: "13 · Filesystem Persistence",
  state: {},
  init() {
    this.state = {
      blocks: new Array(32).fill(null),
      inodes: Array.from({ length: 8 }, (_, i) => ({
        valid: false,
        name: "",
        size: 0,
        blocks: [],
        refs: 0,
      })),
      journal: [],
      journaling: false,
      next_inode: 0,
      crash_at: null,
      writes_in_flight: 0,
      errors: [],
    };
    this.state.blocks[0] = { type: "super", data: "superblock" };
    this._render();
  },
  _alloc_block() {
    for (let i = 1; i < 32; i++) if (!this.state.blocks[i]) return i;
    return -1;
  },
  create(name = "file.txt", content = "hello") {
    const s = this.state;
    const ino = s.inodes.findIndex((i) => !i.valid);
    if (ino < 0) {
      Engine.log("No free inodes", "fault");
      return;
    }
    const blk = this._alloc_block();
    if (blk < 0) {
      Engine.log("No free blocks", "fault");
      return;
    }
    if (s.journaling)
      s.journal.push({ op: "create", ino, blk, name, committed: false });
    if (s.crash_at === "mid_write") {
      s.crash_at = null;
      Engine.log("FAULT: crash mid-write — inode not written", "fault");
      s.blocks[blk] = { type: "data", data: content, inode: ino };
      s.errors.push("orphan block " + blk);
      this._render();
      return;
    }
    s.inodes[ino] = {
      valid: true,
      name,
      size: content.length,
      blocks: [blk],
      refs: 1,
    };
    s.blocks[blk] = { type: "data", data: content, inode: ino };
    if (s.journaling) {
      s.journal[s.journal.length - 1].committed = true;
    }
    Engine.log(`create "${name}" inode=${ino} block=${blk}`, "ok");
    this._render();
  },
  step() {
    this.create(`file${rand(0, 99)}.txt`, "data" + rand(0, 999));
  },
  _render() {
    const s = this.state;
    const bg = el("fs-blocks");
    if (bg)
      bg.innerHTML = s.blocks
        .map((b, i) => {
          let cls = "mem-cell",
            label = "·";
          if (!b) {
            cls = "mem-cell";
          } else if (b.type === "super") {
            cls = "mem-cell active";
            label = "S";
          } else if (b.type === "data") {
            cls = "mem-cell heap";
            label = "D";
          }
          return `<div class="${cls}" title="${b ? b.type + ":" + b.data : ""}">${label}</div>`;
        })
        .join("");
    const it = el("fs-inodes");
    if (it)
      it.innerHTML = s.inodes
        .map(
          (n, i) =>
            `<div class="reg-row" style="font-size:10px">
        <span class="reg-name" style="min-width:14px">${i}</span>
        <span style="color:${n.valid ? "var(--green)" : "var(--text-dim)"};">${n.valid ? `"${n.name}" ${n.size}b blk:[${n.blocks}]` : "—"}</span>
      </div>`,
        )
        .join("");
    const jv = el("fs-journal");
    if (jv)
      jv.innerHTML = s.journal
        .slice(-8)
        .map(
          (e) =>
            `<div class="log-entry ${e.committed ? "ok" : "new"}">${e.committed ? "✓" : "…"} ${e.op} ino=${e.ino} blk=${e.blk}</div>`,
        )
        .join("");
    const err = el("fs-errors");
    if (err)
      err.innerHTML = s.errors
        .map((e) => `<div style="color:var(--red);font-size:10px">⚠ ${e}</div>`)
        .join("");
  },
  template() {
    return `<div class="sim-title">Filesystem Persistence</div>
    <div class="sim-desc">Files are inodes pointing to data blocks. Writes must update both — a crash between them leaves orphan blocks or dangling inodes. Journaling logs intent before committing.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="sim-box"><h4>Block Map (32 blocks)</h4>
        <div id="fs-blocks" class="mem-grid"></div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:6px">S=superblock  D=data  ·=free</div>
        <div id="fs-errors" style="margin-top:6px"></div>
      </div>
      <div class="sim-box"><h4>Inode Table</h4>
        <div id="fs-inodes"></div>
        <hr style="border-color:var(--border);margin:8px 0">
        <h4>Journal (WAL)</h4>
        <div id="fs-journal" class="log-strip"></div>
        <label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:11px;cursor:pointer">
          <input type="checkbox" onchange="M_FS.state.journaling=this.checked"> Enable journaling
        </label>
      </div>
    </div>`;
  },
  controls() {
    return `<button class="ctrl-btn" style="width:100%;margin-bottom:4px" onclick="M_FS.create('doc_'+Date.now()%1000+'.txt','data')">Create file</button>
    <button class="ctrl-btn" style="width:100%" onclick="const n=M_FS.state.inodes.find(x=>x.valid);if(n){n.valid=false;n.blocks.forEach(b=>M_FS.state.blocks[b]=null);M_FS._render()}">Delete first file</button>`;
  },
  failures() {
    return `${btn("Crash mid-write", 'M_FS.state.crash_at="mid_write";Engine.log("FAULT: crash-on-next-write armed","fault")', "ctrl-btn fault-btn")}
    ${btn("Block leak (alloc no inode)", 'const b=M_FS._alloc_block();if(b>0){M_FS.state.blocks[b]={type:"data",data:"leaked"};Engine.log("FAULT: block "+b+" leaked — no inode","fault");M_FS._render()}', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_FS);

/* ──────────────────────────────────────────────
   T1-14  ASSEMBLY STEPPING  (compact inline ASM sim)
   ────────────────────────────────────────────── */
const M_ASM = {
  id: "t1_asm",
  title: "14 · Assembly Stepping",
  state: {},
  _default_prog: `MOV R0, 5
MOV R1, 3
ADD R0, R1
MOV R2, 10
SUB R2, R0
JZ  R2, 0
MOV R3, 99
HALT`,
  init() {
    this.state = {
      source: this._default_prog,
      lines: [],
      pc: 0,
      regs: { R0: 0, R1: 0, R2: 0, R3: 0 },
      flags: { Z: 0, N: 0 },
      halted: false,
      error: null,
      history: [],
    };
    this._assemble();
    this._render();
  },
  _assemble() {
    const s = this.state;
    s.lines = s.source
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    s.pc = 0;
    s.regs = { R0: 0, R1: 0, R2: 0, R3: 0 };
    s.flags = { Z: 0, N: 0 };
    s.halted = false;
    s.error = null;
    s.history = [];
  },
  step() {
    const s = this.state;
    if (s.halted) {
      Engine.log("Halted");
      return;
    }
    if (s.pc >= s.lines.length) {
      s.halted = true;
      return;
    }
    const line = s.lines[s.pc];
    const parts = line.replace(/,/g, " ").split(/\s+/);
    const op = parts[0].toUpperCase();
    const a = parts[1],
      b = parts[2];
    const val = (x) => (x && x.startsWith("R") ? s.regs[x] : +x || 0);
    s.history.push({ pc: s.pc, regs: { ...s.regs }, flags: { ...s.flags } });
    switch (op) {
      case "MOV":
        s.regs[a] = val(b);
        break;
      case "ADD":
        s.regs[a] = (s.regs[a] + val(b)) & 0xff;
        break;
      case "SUB":
        s.regs[a] = (s.regs[a] - val(b) + 256) & 0xff;
        break;
      case "AND":
        s.regs[a] &= val(b);
        break;
      case "OR":
        s.regs[a] |= val(b);
        break;
      case "JZ":
        if (s.flags.Z) {
          s.pc = val(b) - 1;
        }
        break;
      case "JMP":
        s.pc = val(b) - 1;
        break;
      case "HALT":
        s.halted = true;
        Engine.log("HALT", "ok");
        break;
      default:
        s.error = `Unknown op: ${op}`;
        Engine.log(`ERROR: ${s.error}`, "fault");
    }
    if (!s.halted) {
      s.flags.Z = (s.regs[a] ?? 0) === 0 ? 1 : 0;
      s.flags.N = ((s.regs[a] ?? 0) >> 7) & 1;
      s.pc++;
    }
    this._render();
    Engine.log(`${line} → R0=${s.regs.R0} R1=${s.regs.R1} R2=${s.regs.R2}`);
  },
  _render() {
    const s = this.state;
    const ev = el("asm-editor-view");
    if (ev)
      ev.innerHTML = s.lines
        .map(
          (l, i) =>
            `<div style="display:flex;gap:8px;padding:2px 0;${i === s.pc ? "background:rgba(79,142,247,.15);" : ""}${s.halted && i === s.pc - 1 ? "background:rgba(46,204,113,.1);" : ""}">
        <span style="color:var(--text-dim);min-width:20px;font-family:monospace;font-size:10px">${i}</span>
        <span style="font-family:monospace;font-size:11px;color:${i === s.pc ? "var(--accent)" : "var(--text)"}">${l}</span>
      </div>`,
        )
        .join("");
    Object.keys(s.regs).forEach((r) => {
      set("asm-" + r, s.regs[r]);
    });
    set("asm-Z", s.flags.Z);
    set("asm-N", s.flags.N);
    set("asm-pc", s.pc);
    set("asm-status", s.halted ? "HALTED" : s.error ? "ERROR" : "running");
  },
  template() {
    return `<div class="sim-title">Assembly Stepping</div>
    <div class="sim-desc">Assembly instructions are state transitions on registers and flags. Step line by line. Edit the program and click Assemble to reload.</div>
    <div style="display:grid;grid-template-columns:1fr 180px;gap:16px">
      <div class="sim-box">
        <h4>Program</h4>
        <textarea id="asm-src" style="width:100%;height:160px;background:var(--bg3);color:var(--text);border:1px solid var(--border);border-radius:4px;font-family:monospace;font-size:11px;padding:8px;resize:vertical" oninput="M_ASM.state.source=this.value">${this._default_prog}</textarea>
        <button class="ctrl-btn" style="width:100%;margin-top:6px" onclick="M_ASM.state.source=el('asm-src').value;M_ASM._assemble();M_ASM._render()">↻ Assemble</button>
        <div id="asm-editor-view" style="margin-top:8px;max-height:160px;overflow-y:auto"></div>
      </div>
      <div class="sim-box">
        <h4>Registers</h4>
        ${["R0", "R1", "R2", "R3"].map((r) => `<div class="metric-row"><span class="metric-label">${r}</span><span class="metric-val" id="asm-${r}">0</span></div>`).join("")}
        <div class="metric-row"><span class="metric-label">PC</span><span class="metric-val" id="asm-pc">0</span></div>
        <div class="metric-row"><span class="metric-label">Z flag</span><span class="metric-val" id="asm-Z">0</span></div>
        <div class="metric-row"><span class="metric-label">N flag</span><span class="metric-val" id="asm-N">0</span></div>
        <div class="metric-row"><span class="metric-label">Status</span><span class="metric-val" id="asm-status">ready</span></div>
      </div>
    </div>`;
  },
  controls() {
    return `<button class="ctrl-btn" style="width:100%" onclick="M_ASM.state.history.pop();if(M_ASM.state.history.length){const h=M_ASM.state.history[M_ASM.state.history.length-1];M_ASM.state.regs={...h.regs};M_ASM.state.flags={...h.flags};M_ASM.state.pc=h.pc;M_ASM._render()}">← Step Back</button>`;
  },
  failures() {
    return `${btn("Inject infinite loop", 'M_ASM.state.lines.push("JMP 0");Engine.log("FAULT: JMP 0 injected — infinite loop","fault")', "ctrl-btn fault-btn")}
    ${btn("Corrupt instruction", 'M_ASM.state.lines[M_ASM.state.pc]="XYZZY R0,R1";Engine.log("FAULT: bad opcode injected","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_ASM);

/* ──────────────────────────────────────────────
   T1-15  CONTEXT SWITCHING
   ────────────────────────────────────────────── */
const M_CtxSwitch = {
  id: "t1_ctx",
  title: "15 · Context Switching",
  state: {},
  init() {
    this.state = {
      procs: [
        { pid: "A", regs: [1, 2, 3, 4], pc: 10 },
        { pid: "B", regs: [5, 6, 7, 8], pc: 20 },
      ],
      kernel_stack: [],
      active: 0,
      phase: "user_A",
      useful: 0,
      wasted: 0,
      switches: 0,
      phases_log: [],
    };
    this._render();
  },
  step() {
    const s = this.state;
    const phases = [
      "user_A",
      "save_A",
      "schedule",
      "restore_B",
      "user_B",
      "save_B",
      "schedule2",
      "restore_A",
    ];
    const idx = phases.indexOf(s.phase);
    const next = phases[(idx + 1) % phases.length];
    switch (s.phase) {
      case "user_A":
        s.useful++;
        Engine.log("P(A) executing user code", "ok");
        break;
      case "save_A":
        s.wasted++;
        s.kernel_stack = [...s.procs[0].regs, s.procs[0].pc];
        Engine.log("Save A: push regs+PC to kernel stack", "info");
        break;
      case "schedule":
        s.wasted++;
        Engine.log("Kernel: choose next process", "info");
        break;
      case "restore_B":
        s.wasted++;
        s.procs[1].regs = [...s.kernel_stack.slice(0, 4)];
        Engine.log("Restore B: pop regs from PCB", "info");
        break;
      case "user_B":
        s.useful++;
        s.switches++;
        Engine.log("P(B) executing user code", "ok");
        break;
      case "save_B":
        s.wasted++;
        s.kernel_stack = [...s.procs[1].regs, s.procs[1].pc];
        break;
      case "schedule2":
        s.wasted++;
        break;
      case "restore_A":
        s.wasted++;
        s.procs[0].regs = [...s.kernel_stack.slice(0, 4)];
        break;
    }
    s.phase = next;
    s.phases_log.push(s.phase);
    if (s.phases_log.length > 20) s.phases_log.shift();
    this._render();
  },
  _render() {
    const s = this.state;
    const phases = [
      "user_A",
      "save_A",
      "schedule",
      "restore_B",
      "user_B",
      "save_B",
      "schedule2",
      "restore_A",
    ];
    const pv = el("ctx-phases");
    if (pv)
      pv.innerHTML = phases
        .map(
          (p) => `
      <div class="phase-badge ${p === s.phase ? "active" : ""}" style="margin:3px;font-size:10px">${p.replace("_", " ")}</div>`,
        )
        .join("");
    set("ctx-useful", s.useful);
    set("ctx-wasted", s.wasted);
    set("ctx-switches", s.switches);
    const eff =
      s.useful + s.wasted > 0
        ? ((s.useful / (s.useful + s.wasted)) * 100).toFixed(1) + "%"
        : "—";
    set("ctx-eff", eff);
    const ks = el("ctx-kstack");
    if (ks) ks.textContent = "[" + s.kernel_stack.join(", ") + "]";
  },
  template() {
    return `<div class="sim-title">Context Switching</div>
    <div class="sim-desc">A context switch saves all registers to the kernel stack (PCB), selects the next process, then restores its registers. Every save/restore/schedule tick is overhead — not user work.</div>
    <div style="display:grid;grid-template-columns:1fr 200px;gap:16px">
      <div class="sim-box">
        <h4>Switch Phases (active = current)</h4>
        <div id="ctx-phases" style="display:flex;flex-wrap:wrap;gap:4px"></div>
        <div style="margin-top:12px"><span class="ctrl-label">Kernel stack:</span>
          <span id="ctx-kstack" style="font-family:monospace;font-size:11px;color:var(--cyan)">[]</span>
        </div>
      </div>
      <div class="sim-box">
        <h4>Cost Accounting</h4>
        <div class="metric-row"><span class="metric-label">Useful ticks</span><span class="metric-val good" id="ctx-useful">0</span></div>
        <div class="metric-row"><span class="metric-label">Wasted ticks</span><span class="metric-val bad" id="ctx-wasted">0</span></div>
        <div class="metric-row"><span class="metric-label">Context switches</span><span class="metric-val" id="ctx-switches">0</span></div>
        <div class="metric-row"><span class="metric-label">CPU efficiency</span><span class="metric-val" id="ctx-eff">—</span></div>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Step advances one switch phase</span></div>`;
  },
  failures() {
    return `${btn("Switch storm (quantum=1)", 'for(let i=0;i<20;i++)M_CtxSwitch.step();Engine.log("FAULT: switch storm — high overhead","fault")', "ctrl-btn fault-btn")}
    ${btn("Corrupt PCB (drop reg)", 'M_CtxSwitch.state.procs[0].regs[2]=999;Engine.log("FAULT: register corrupted in PCB","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t1", M_CtxSwitch);

/* ═══════════════════════════════════════════════════════════
   TRACK 2 MODULES
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   T2-01  BACKEND AS STATE MACHINE
   ────────────────────────────────────────────── */
const M_Backend = {
  id: "t2_backend",
  title: "01 · Backend as State Machine",
  state: {},
  _states: [
    "STARTING",
    "READY",
    "PROCESSING",
    "PERSISTING",
    "ERROR",
    "CRASHED",
  ],
  init() {
    this.state = {
      svc: "STARTING",
      queue: [],
      served: 0,
      rejected: 0,
      tick: 0,
      startup_left: 3,
      kv: {},
      fault: null,
    };
    this._render();
  },
  _enqueue(key, val) {
    this.state.queue.push({ id: Date.now() % 10000, op: "SET", key, val });
    Engine.log(`Enqueue SET ${key}=${val}`);
  },
  step() {
    const s = this.state;
    s.tick++;
    if (s.fault === "crash") {
      s.svc = "CRASHED";
      s.fault = null;
      Engine.log("FAULT: service crashed", "fault");
      this._render();
      return;
    }
    if (s.svc === "STARTING") {
      s.startup_left--;
      if (s.startup_left <= 0) s.svc = "READY";
    } else if (s.svc === "READY") {
      if (s.queue.length > 0) {
        const r = s.queue.shift();
        s._cur = r;
        s.svc = "PROCESSING";
        Engine.log(`Processing req ${r.id}`, "info");
      } else {
        this._enqueue("k" + rand(0, 5), rand(0, 99));
      }
    } else if (s.svc === "PROCESSING") {
      s.svc = "PERSISTING";
    } else if (s.svc === "PERSISTING") {
      if (s._cur) {
        s.kv[s._cur.key] = s._cur.val;
        s.served++;
      }
      s.svc = "READY";
      Engine.log(`Committed — served=${s.served}`, "ok");
    } else if (s.svc === "CRASHED") {
      if (Math.random() < 0.05) {
        s.svc = "STARTING";
        s.startup_left = 3;
        Engine.log("Restarting...", "info");
      }
    }
    this._render();
  },
  _render() {
    const s = this.state;
    this._states.forEach((st) => {
      const e = el("svc-state-" + st);
      if (e) e.className = "state-node" + (s.svc === st ? " current" : "");
    });
    set("svc-queue", s.queue.length);
    set("svc-served", s.served);
    set("svc-rejected", s.rejected);
    const kv = el("svc-kv");
    if (kv) kv.textContent = JSON.stringify(s.kv, null, 1);
  },
  template() {
    const states = this._states
      .map((s) => `<span id="svc-state-${s}" class="state-node">${s}</span>`)
      .join('<span style="color:var(--text-dim);margin:0 4px">→</span>');
    return `<div class="sim-title">Backend as State Machine</div>
    <div class="sim-desc">Every backend service is a state machine. Requests can only be processed in READY state. Invalid transitions (e.g., request during STARTING) are rejected. Crash transitions to CRASHED; it restarts probabilistically.</div>
    <div class="sim-box" style="margin-bottom:12px">
      <h4>Service State</h4>
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:4px">${states}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="sim-box">
        <h4>Metrics</h4>
        <div class="metric-row"><span class="metric-label">Queue depth</span><span class="metric-val" id="svc-queue">0</span></div>
        <div class="metric-row"><span class="metric-label">Requests served</span><span class="metric-val good" id="svc-served">0</span></div>
        <div class="metric-row"><span class="metric-label">Rejected</span><span class="metric-val bad" id="svc-rejected">0</span></div>
      </div>
      <div class="sim-box">
        <h4>KV Store state</h4>
        <pre id="svc-kv" style="font-size:10px;color:var(--cyan);line-height:1.4">{}</pre>
      </div>
    </div>`;
  },
  controls() {
    return `${btn("Enqueue 10 requests", 'for(let i=0;i<10;i++)M_Backend._enqueue("k"+i,i*10)', "ctrl-btn")}`;
  },
  failures() {
    return `${btn("Crash service", 'M_Backend.state.fault="crash"', "ctrl-btn fault-btn")}
    ${btn("Stuck in PROCESSING", 'M_Backend.state.svc="PROCESSING";Engine.log("FAULT: stuck in PROCESSING","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_Backend);

/* ──────────────────────────────────────────────
   T2-02  TCP LIFECYCLE
   ────────────────────────────────────────────── */
const M_TCP = {
  id: "t2_tcp",
  title: "02 · TCP Lifecycle",
  state: {},
  init() {
    this.state = {
      client: { state: "CLOSED", seq: 100, ack: 0 },
      server: { state: "LISTEN", seq: 200, ack: 0 },
      packets: [],
      rtt: 3,
      drop_next: false,
      connects: 0,
      resets: 0,
      phase: 0,
    };
    this._render();
  },
  step() {
    const s = this.state;
    s.phase++;
    const drop = s.drop_next;
    s.drop_next = false;
    switch (s.phase) {
      case 1:
        s.packets.push({
          from: "C",
          to: "S",
          label: "SYN",
          seq: s.client.seq,
          drop,
        });
        s.client.state = "SYN_SENT";
        break;
      case 2:
        if (!drop) {
          s.server.state = "SYN_RECEIVED";
          s.packets.push({
            from: "S",
            to: "C",
            label: "SYN-ACK",
            seq: s.server.seq,
            ack: s.client.seq + 1,
          });
        } else {
          Engine.log("FAULT: SYN dropped", "fault");
          s.phase = 0;
        }
        break;
      case 3:
        s.client.state = "ESTABLISHED";
        s.client.ack = s.server.seq + 1;
        s.packets.push({
          from: "C",
          to: "S",
          label: "ACK",
          seq: s.client.seq + 1,
          ack: s.server.seq + 1,
        });
        break;
      case 4:
        s.server.state = "ESTABLISHED";
        s.packets.push({
          from: "C",
          to: "S",
          label: "DATA",
          seq: s.client.seq + 2,
        });
        Engine.log("Connection established", "ok");
        s.connects++;
        break;
      case 5:
        s.packets.push({
          from: "C",
          to: "S",
          label: "FIN",
          seq: s.client.seq + 10,
        });
        s.client.state = "FIN_WAIT";
        break;
      case 6:
        s.packets.push({
          from: "S",
          to: "C",
          label: "FIN-ACK",
          seq: s.server.seq + 10,
        });
        s.server.state = "CLOSE_WAIT";
        break;
      case 7:
        s.client.state = "CLOSED";
        s.server.state = "CLOSED";
        Engine.log("Connection closed", "ok");
        s.phase = 0;
        break;
    }
    if (s.packets.length > 10) s.packets = s.packets.slice(-10);
    this._render();
  },
  _render() {
    const s = this.state;
    ["CLOSED", "SYN_SENT", "ESTABLISHED", "FIN_WAIT"].forEach((st) => {
      const e = el("tcp-c-" + st);
      if (e)
        e.className = "state-node" + (s.client.state === st ? " current" : "");
    });
    ["LISTEN", "SYN_RECEIVED", "ESTABLISHED", "CLOSE_WAIT", "CLOSED"].forEach(
      (st) => {
        const e = el("tcp-s-" + st);
        if (e)
          e.className =
            "state-node" + (s.server.state === st ? " current" : "");
      },
    );
    const pl = el("tcp-packets");
    if (pl)
      pl.innerHTML = s.packets
        .map(
          (p) => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-family:monospace;font-size:11px">
        <span style="color:${p.from === "C" ? "var(--accent)" : "var(--green)"}">${p.from}</span>
        <span style="color:var(--text-dim)">${p.from === "C" ? "──→" : "←──"}</span>
        <span class="phase-badge${p.drop ? " fault" : ""}" style="font-size:10px">${p.label}${p.drop ? " (DROPPED)" : ""}</span>
        <span style="color:var(--text-dim)">seq=${p.seq}</span>
      </div>`,
        )
        .join("");
    set("tcp-connects", s.connects);
  },
  template() {
    const cstates = ["CLOSED", "SYN_SENT", "ESTABLISHED", "FIN_WAIT"];
    const sstates = [
      "LISTEN",
      "SYN_RECEIVED",
      "ESTABLISHED",
      "CLOSE_WAIT",
      "CLOSED",
    ];
    return `<div class="sim-title">TCP Lifecycle</div>
    <div class="sim-desc">TCP is a state machine on both ends simultaneously. Three-way handshake → data → four-way teardown. Drop a packet to observe retransmission behavior.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div class="sim-box">
        <h4>Client</h4>
        ${cstates.map((s) => `<div id="tcp-c-${s}" class="state-node" style="margin-bottom:4px;width:100%">${s}</div>`).join("")}
      </div>
      <div class="sim-box">
        <h4>Packets on wire</h4>
        <div id="tcp-packets"></div>
        <div class="metric-row" style="margin-top:8px"><span class="metric-label">Completed connections</span><span class="metric-val good" id="tcp-connects">0</span></div>
      </div>
      <div class="sim-box">
        <h4>Server</h4>
        ${sstates.map((s) => `<div id="tcp-s-${s}" class="state-node" style="margin-bottom:4px;width:100%">${s}</div>`).join("")}
      </div>
    </div>`;
  },
  controls() {
    return `<button class="ctrl-btn" onclick="M_TCP.state.phase=0;M_TCP._render()">Reset connection</button>`;
  },
  failures() {
    return `${btn("Drop next packet", 'M_TCP.state.drop_next=true;Engine.log("FAULT: next packet will be dropped","fault")', "ctrl-btn fault-btn")}
    ${btn("RST injection", 'M_TCP.state.client.state="CLOSED";M_TCP.state.server.state="CLOSED";M_TCP.state.packets.push({from:"S",to:"C",label:"RST"});M_TCP.state.phase=0;M_TCP.state.resets++;M_TCP._render();Engine.log("FAULT: RST injected","fault")', "ctrl-btn fault-btn")}
    ${btn("SYN flood (queue 100)", 'for(let i=0;i<100;i++)M_TCP.state.packets.push({from:"C",to:"S",label:"SYN",seq:i});M_TCP._render();Engine.log("FAULT: SYN flood — backlog overflow","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_TCP);

/* ──────────────────────────────────────────────
   T2-03  EVENT LOOP VS THREADS
   ────────────────────────────────────────────── */
const M_EventLoop = {
  id: "t2_eventloop",
  title: "03 · Event Loop vs Threads",
  state: {},
  init() {
    this.state = {
      model: "eventloop",
      queue: [],
      threads: [],
      connections: 8,
      io_latency: 4,
      cpu_pct: 20,
      tick: 0,
      throughput: 0,
      latencies: [],
      blocked_ticks: 0,
      total_ticks: 0,
    };
    this._populate();
    this._render();
  },
  _populate() {
    const s = this.state;
    s.queue = [];
    s.threads = [];
    for (let i = 0; i < s.connections; i++) {
      const cpu = Math.random() * 100 < s.cpu_pct;
      s.queue.push({
        id: i,
        type: cpu ? "cpu" : "io",
        cost: cpu ? rand(3, 8) : s.io_latency,
        remaining: cpu ? rand(3, 8) : s.io_latency,
        started: -1,
      });
      if (s.model === "threads")
        s.threads.push({ tid: i, state: "running", blocked: false });
    }
  },
  step() {
    const s = this.state;
    s.tick++;
    s.total_ticks++;
    if (s.model === "eventloop") {
      if (s.queue.length === 0) {
        this._populate();
        return;
      }
      const job = s.queue[0];
      if (job.started < 0) job.started = s.tick;
      if (job.type === "cpu") {
        s.blocked_ticks++;
        job.remaining--;
      } else {
        job.remaining--;
      }
      if (job.remaining <= 0) {
        s.latencies.push(s.tick - job.started);
        s.queue.shift();
        s.throughput++;
        Engine.log(
          `Event loop: job ${job.id} done (${job.type}) lat=${s.tick - job.started}`,
          "ok",
        );
        s.queue.push({
          id: job.id + s.connections,
          type: Math.random() < s.cpu_pct / 100 ? "cpu" : "io",
          cost: s.io_latency,
          remaining: s.io_latency,
          started: -1,
        });
      }
    } else {
      s.threads.forEach((t, i) => {
        const job = s.queue[i];
        if (!job) return;
        if (job.started < 0) job.started = s.tick;
        job.remaining--;
        if (job.remaining <= 0) {
          s.throughput++;
          s.latencies.push(s.tick - job.started);
          s.queue[i] = {
            ...job,
            remaining: s.io_latency,
            started: -1,
            id: job.id + s.connections,
          };
        }
      });
    }
    if (s.latencies.length > 50) s.latencies = s.latencies.slice(-50);
    this._render();
  },
  _render() {
    const s = this.state;
    const p99 = s.latencies.length
      ? s.latencies.sort((a, b) => a - b)[
          Math.floor(s.latencies.length * 0.99)
        ] || 0
      : 0;
    set("el-throughput", s.throughput);
    set("el-p99", p99);
    set("el-blocked", s.blocked_ticks);
    set("el-model", s.model);
    const qv = el("el-queue");
    if (qv)
      qv.innerHTML = s.queue
        .slice(0, 12)
        .map(
          (j) => `
      <div class="phase-badge" style="font-size:9px;margin:2px;background:${j.type === "cpu" ? "rgba(231,76,60,.15)" : "rgba(79,142,247,.1)"}">${j.type} rem:${j.remaining}</div>`,
        )
        .join("");
  },
  template() {
    return `<div class="sim-title">Event Loop vs Threads</div>
    <div class="sim-desc">Event loop: one job runs at a time to completion (cooperative). Threads: each connection gets its own thread (preemptive). CPU-heavy jobs block the entire event loop. Thread model thrashes with 1000+ connections.</div>
    <div style="display:grid;grid-template-columns:1fr 200px;gap:12px">
      <div class="sim-box">
        <h4>Queue / Thread pool</h4>
        <div id="el-queue" style="display:flex;flex-wrap:wrap;min-height:60px"></div>
      </div>
      <div class="sim-box">
        <h4>Metrics</h4>
        <div class="metric-row"><span class="metric-label">Model</span><span class="metric-val" id="el-model">eventloop</span></div>
        <div class="metric-row"><span class="metric-label">Throughput</span><span class="metric-val good" id="el-throughput">0</span></div>
        <div class="metric-row"><span class="metric-label">P99 latency</span><span class="metric-val" id="el-p99">0</span></div>
        <div class="metric-row"><span class="metric-label">Blocked ticks</span><span class="metric-val bad" id="el-blocked">0</span></div>
      </div>
    </div>`;
  },
  controls() {
    return (
      `<div class="ctrl-group"><span class="ctrl-label">Model</span>
    <select class="ctrl-select" onchange="M_EventLoop.state.model=this.value;M_EventLoop._populate();M_EventLoop._render()">
      <option value="eventloop">Event loop</option><option value="threads">Thread per connection</option>
    </select></div>` +
      slider(
        "CPU task %",
        "el-cpu",
        0,
        100,
        20,
        "%",
        "M_EventLoop.state.cpu_pct=+this.value",
      ) +
      slider(
        "Connections",
        "el-conns",
        1,
        50,
        8,
        "",
        "M_EventLoop.state.connections=+this.value;M_EventLoop._populate()",
      )
    );
  },
  failures() {
    return `${btn("Blocking callback (CPU burst)", 'for(let i=0;i<5;i++)M_EventLoop.state.queue.unshift({id:999+i,type:"cpu",cost:20,remaining:20,started:-1});Engine.log("FAULT: 5 CPU-heavy callbacks injected","fault")', "ctrl-btn fault-btn")}
    ${btn("Thread explosion", 'M_EventLoop.state.connections=200;M_EventLoop.state.model="threads";M_EventLoop._populate();Engine.log("FAULT: 200 threads — memory pressure","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_EventLoop);

/* ──────────────────────────────────────────────
   T2-04  RACE CONDITIONS
   ────────────────────────────────────────────── */
const M_Race = {
  id: "t2_race",
  title: "04 · Race Conditions",
  state: {},
  init() {
    this.state = {
      shared: 0,
      expected: 0,
      A: { local: null, phase: "idle" },
      B: { local: null, phase: "idle" },
      mode: "no_lock",
      mutex: null,
      races: 0,
      total: 0,
      interleave_log: [],
    };
    this._render();
  },
  _stepA() {
    const s = this.state;
    switch (s.A.phase) {
      case "idle":
        s.A.phase = "read";
        break;
      case "read":
        s.A.local = s.shared;
        s.A.phase = "inc";
        Engine.log(`A reads shared=${s.shared}`, "info");
        break;
      case "inc":
        s.A.local++;
        s.A.phase = "write";
        break;
      case "write":
        if (s.mode === "no_lock" || s.mutex === null) {
          s.shared = s.A.local;
          s.A.phase = "idle";
          s.expected++;
          s.total++;
          if (s.shared !== s.expected) {
            s.races++;
            Engine.log(`RACE: expected ${s.expected} got ${s.shared}`, "fault");
          } else Engine.log(`A writes ${s.shared}`, "ok");
        } else {
          Engine.log("A waiting for lock");
        }
        break;
    }
    this._render();
  },
  _stepB() {
    const s = this.state;
    switch (s.B.phase) {
      case "idle":
        s.B.phase = "read";
        break;
      case "read":
        s.B.local = s.shared;
        s.B.phase = "inc";
        Engine.log(`B reads shared=${s.shared}`, "info");
        break;
      case "inc":
        s.B.local++;
        s.B.phase = "write";
        break;
      case "write":
        s.shared = s.B.local;
        s.B.phase = "idle";
        s.expected++;
        s.total++;
        if (s.shared !== s.expected) {
          s.races++;
          Engine.log(`RACE: expected ${s.expected} got ${s.shared}`, "fault");
        } else Engine.log(`B writes ${s.shared}`, "ok");
        break;
    }
    this._render();
  },
  step() {
    this._stepA();
  },
  _render() {
    const s = this.state;
    set("race-shared", s.shared);
    set("race-expected", s.expected);
    set("race-count", s.races);
    ["A", "B"].forEach((t) => {
      set("race-" + t + "-phase", s[t].phase);
      set("race-" + t + "-local", s[t].local ?? "—");
    });
    const rd = el("race-detected");
    if (rd) rd.className = "phase-badge" + (s.races > 0 ? " fault" : "");
  },
  template() {
    const thread = (t, color) => `
      <div class="sim-box">
        <h4 style="color:${color}">Thread ${t}</h4>
        <div class="metric-row"><span class="metric-label">Phase</span><span class="metric-val" id="race-${t}-phase">idle</span></div>
        <div class="metric-row"><span class="metric-label">local_val</span><span class="metric-val" id="race-${t}-local">—</span></div>
        <button class="ctrl-btn" style="width:100%;margin-top:8px" onclick="M_Race._step${t}()">Step Thread ${t}</button>
      </div>`;
    return `<div class="sim-title">Race Conditions</div>
    <div class="sim-desc">Two threads increment a shared counter via read-modify-write. Step each thread independently to observe how interleaving creates lost updates. Same code, different schedule = different result.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 160px;gap:12px">
      ${thread("A", "var(--accent)")}${thread("B", "var(--green)")}
      <div class="sim-box">
        <h4>Shared State</h4>
        <div class="metric-row"><span class="metric-label">shared</span><span class="metric-val" style="font-size:18px" id="race-shared">0</span></div>
        <div class="metric-row"><span class="metric-label">expected</span><span class="metric-val" id="race-expected">0</span></div>
        <div class="metric-row"><span class="metric-label">races</span><span class="metric-val bad" id="race-count">0</span></div>
        <div id="race-detected" class="phase-badge" style="margin-top:8px">NO RACE</div>
      </div>
    </div>`;
  },
  controls() {
    return `${btn("Auto-race (worst interleaving)", "M_Race._stepA();M_Race._stepB();M_Race._stepB();M_Race._stepA();M_Race._stepA();M_Race._stepB()", "ctrl-btn")}
    <div class="ctrl-group" style="margin-top:6px"><span class="ctrl-label">Step = advance Thread A</span></div>`;
  },
  failures() {
    return `${btn("Force lost update", 'M_Race.state.A.phase="read";M_Race.state.B.phase="read";M_Race._stepA();M_Race._stepA();M_Race._stepB();M_Race._stepB();Engine.log("FAULT: forced worst-case interleaving","fault")', "ctrl-btn fault-btn")}
    ${btn("Reset counter", "M_Race.state.shared=0;M_Race.state.expected=0;M_Race.state.races=0;M_Race._render()", "ctrl-btn")}`;
  },
};
register("t2", M_Race);

/* ──────────────────────────────────────────────
   T2-05  APPEND-ONLY LOG
   ────────────────────────────────────────────── */
const M_Log = {
  id: "t2_log",
  title: "05 · Append-Only Log",
  state: {},
  init() {
    this.state = {
      log: [],
      seq: 0,
      snapshot: { at: 0, kv: {} },
      read_ptr: 0,
      checksum_errors: 0,
      fault: null,
    };
    this._render();
  },
  _write(key, val) {
    const s = this.state;
    const entry = {
      seq: s.seq++,
      key,
      val,
      ts: Date.now() % 100000,
      ck: ((key + val).length * 31 + s.seq) % 256,
    };
    if (s.fault === "partial") {
      entry.truncated = true;
      s.fault = null;
      Engine.log("FAULT: partial write — truncated entry", "fault");
    }
    if (s.fault === "corrupt") {
      entry.ck = 0;
      s.fault = null;
      Engine.log("FAULT: checksum corrupt", "fault");
    }
    s.log.push(entry);
    Engine.log(`APPEND seq=${entry.seq} ${key}=${val}`, "ok");
    this._render();
  },
  step() {
    this._write("k" + rand(0, 5), rand(0, 99));
  },
  _replay() {
    const s = this.state;
    let kv = {},
      errors = 0;
    for (const e of s.log) {
      const ck = ((e.key + e.val).length * 31 + e.seq) % 256;
      if (e.truncated) {
        Engine.log("FAULT: truncated entry in replay", "fault");
        break;
      }
      if (e.ck !== ck) {
        errors++;
        s.checksum_errors++;
        Engine.log(`FAULT: checksum fail seq=${e.seq}`, "fault");
        continue;
      }
      kv[e.key] = e.val;
    }
    Engine.log(
      `Replay done: ${Object.keys(kv).length} keys, ${errors} errors`,
      "info",
    );
    this._render();
  },
  _snapshot() {
    const s = this.state;
    s.snapshot = { at: s.seq, kv: {} };
    for (const e of s.log) if (!e.truncated) s.snapshot.kv[e.key] = e.val;
    Engine.log(`Snapshot at seq=${s.snapshot.at}`, "ok");
    this._render();
  },
  _render() {
    const s = this.state;
    const lv = el("log-entries");
    if (lv)
      lv.innerHTML = s.log
        .slice(-12)
        .map(
          (e) => `
      <div class="log-entry ${e.truncated ? "error" : e.ck !== ((e.key + e.val).length * 31 + e.seq) % 256 ? "error" : "ok"}">
        seq=${e.seq} ${e.key}=${e.val} ck=0x${hex(e.ck)} ${e.truncated ? "[TRUNCATED]" : ""}
      </div>`,
        )
        .join("");
    const sv = el("log-snapshot");
    if (sv) sv.textContent = JSON.stringify(s.snapshot.kv);
    set("log-size", s.log.length + " entries");
    set("log-errors", s.checksum_errors);
  },
  template() {
    return `<div class="sim-title">Append-Only Log</div>
    <div class="sim-desc">Writes always append — never modify existing entries. Readers replay from beginning or from a snapshot offset. Corruption is detectable via per-entry checksum.</div>
    <div style="display:grid;grid-template-columns:1fr 220px;gap:12px">
      <div class="sim-box">
        <h4>Log entries (newest at bottom)</h4>
        <div id="log-entries" class="log-strip" style="max-height:240px"></div>
        <div class="metric-row" style="margin-top:6px"><span class="metric-label">Size</span><span class="metric-val" id="log-size">0</span></div>
        <div class="metric-row"><span class="metric-label">Checksum errors</span><span class="metric-val bad" id="log-errors">0</span></div>
      </div>
      <div class="sim-box">
        <h4>Snapshot (materialized KV)</h4>
        <pre id="log-snapshot" style="font-size:10px;color:var(--cyan);">{}</pre>
        <button class="ctrl-btn" style="width:100%;margin-top:8px" onclick="M_Log._snapshot()">Take snapshot</button>
        <button class="ctrl-btn" style="width:100%;margin-top:4px" onclick="M_Log._replay()">Replay from start</button>
      </div>
    </div>`;
  },
  controls() {
    return `<button class="ctrl-btn" style="width:100%" onclick="M_Log._write('k'+Math.floor(Math.random()*5),Math.floor(Math.random()*99))">Append write</button>`;
  },
  failures() {
    return `${btn("Partial write (truncate)", 'M_Log.state.fault="partial"', "ctrl-btn fault-btn")}
    ${btn("Corrupt checksum", 'M_Log.state.fault="corrupt"', "ctrl-btn fault-btn")}
    ${btn("Gap in sequence", 'M_Log.state.seq+=5;Engine.log("FAULT: seq gap injected","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_Log);

/* ──────────────────────────────────────────────
   T2-06  TRANSACTIONS & ISOLATION
   ────────────────────────────────────────────── */
const M_Txn = {
  id: "t2_txn",
  title: "06 · Transactions &amp; Isolation",
  state: {},
  init() {
    this.state = {
      rows: [
        { id: 1, val: 100, lock: null, ver: 0 },
        { id: 2, val: 200, lock: null, ver: 0 },
        { id: 3, val: 50, lock: null, ver: 0 },
        { id: 4, val: 75, lock: null, ver: 0 },
      ],
      A: { ops: [], snapshot: {}, state: "active" },
      B: { ops: [], snapshot: {}, state: "active" },
      isolation: "read_committed",
      anomalies: [],
      aborts: 0,
    };
    this._snapshot("A");
    this._snapshot("B");
    this._render();
  },
  _snapshot(t) {
    const s = this.state;
    s[t].snapshot = {};
    s.rows.forEach((r) => (s[t].snapshot[r.id] = r.val));
  },
  _read(t, rowId) {
    const s = this.state;
    const row = s.rows.find((r) => r.id === rowId);
    const val =
      s.isolation === "read_uncommitted" ? row.val : s[t].snapshot[rowId];
    s[t].ops.push(`READ row${rowId}=${val}`);
    Engine.log(`Tx${t} READ row${rowId} → ${val}`, "info");
    if (row.lock && row.lock !== t) {
      s.anomalies.push("dirty_read");
      Engine.log(
        `FAULT: dirty read — row${rowId} locked by Tx${row.lock}`,
        "fault",
      );
    }
    this._render();
    return val;
  },
  _write(t, rowId, val) {
    const s = this.state;
    const row = s.rows.find((r) => r.id === rowId);
    if (row.lock && row.lock !== t) {
      Engine.log(
        `Tx${t} blocked — row${rowId} locked by Tx${row.lock}`,
        "fault",
      );
      return;
    }
    row.lock = t;
    row.val = val;
    row.ver++;
    s[t].ops.push(`WRITE row${rowId}=${val}`);
    Engine.log(`Tx${t} WRITE row${rowId}=${val}`, "ok");
    this._render();
  },
  _commit(t) {
    const s = this.state;
    s.rows.forEach((r) => {
      if (r.lock === t) r.lock = null;
    });
    this._snapshot("A");
    this._snapshot("B");
    s[t].state = "committed";
    s[t].ops.push("COMMIT");
    Engine.log(`Tx${t} COMMIT`, "ok");
    this._render();
  },
  _abort(t) {
    const s = this.state;
    s.aborts++;
    s.rows.forEach((r) => {
      if (r.lock === t) r.lock = null;
    });
    s[t].state = "aborted";
    s[t].ops.push("ROLLBACK");
    Engine.log(`Tx${t} ABORT`, "fault");
    this._render();
  },
  step() {
    this._read("A", rand(1, 4));
  },
  _render() {
    const s = this.state;
    const rv = el("txn-rows");
    if (rv)
      rv.innerHTML = s.rows
        .map(
          (r) => `
      <div class="reg-row">
        <span class="reg-name">row${r.id}</span>
        <span class="reg-val">${r.val}</span>
        <span style="font-size:10px;color:${r.lock ? "var(--yellow)" : "var(--text-dim)"}">lock:${r.lock || "—"}</span>
        <span style="font-size:10px;color:var(--text-dim)">v${r.ver}</span>
      </div>`,
        )
        .join("");
    ["A", "B"].forEach((t) => {
      const ov = el("txn-ops-" + t);
      if (ov)
        ov.innerHTML = s[t].ops
          .slice(-5)
          .map((o) => `<div class="log-entry">${o}</div>`)
          .join("");
      const sv = el("txn-state-" + t);
      if (sv)
        sv.className =
          "phase-badge" +
          (s[t].state === "active"
            ? " active"
            : s[t].state === "aborted"
              ? " fault"
              : "");
    });
    set("txn-anomalies", s.anomalies.length);
    set("txn-aborts", s.aborts);
  },
  template() {
    const txPanel = (t, color) => `
      <div class="sim-box">
        <h4 style="color:${color}">Transaction ${t}</h4>
        <div id="txn-state-${t}" class="phase-badge active" style="margin-bottom:8px">active</div>
        <div id="txn-ops-${t}" class="log-strip" style="min-height:60px"></div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">
          ${[1, 2, 3, 4].map((r) => `<button class="ctrl-btn" onclick="M_Txn._read('${t}',${r})" style="font-size:10px">R${r}</button><button class="ctrl-btn" onclick="M_Txn._write('${t}',${r},rand(0,999))" style="font-size:10px">W${r}</button>`).join("")}
        </div>
        <div style="display:flex;gap:4px;margin-top:6px">
          <button class="ctrl-btn" style="flex:1" onclick="M_Txn._commit('${t}')">COMMIT</button>
          <button class="ctrl-btn fault-btn" style="flex:1" onclick="M_Txn._abort('${t}')">ABORT</button>
        </div>
      </div>`;
    return `<div class="sim-title">Transactions &amp; Isolation</div>
    <div class="sim-desc">Two concurrent transactions on 4 rows. Isolation level controls which anomalies are visible. R=Read row, W=Write random value. Observe dirty reads in read_uncommitted.</div>
    <div style="display:grid;grid-template-columns:180px 1fr 1fr;gap:12px">
      <div class="sim-box"><h4>Rows</h4>
        <div id="txn-rows"></div>
        <div class="metric-row" style="margin-top:8px"><span class="metric-label">Anomalies</span><span class="metric-val bad" id="txn-anomalies">0</span></div>
        <div class="metric-row"><span class="metric-label">Aborts</span><span class="metric-val warn" id="txn-aborts">0</span></div>
      </div>
      ${txPanel("A", "var(--accent)")}${txPanel("B", "var(--green)")}
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Isolation level</span>
    <select class="ctrl-select" onchange="M_Txn.state.isolation=this.value">
      <option value="read_uncommitted">READ UNCOMMITTED</option>
      <option value="read_committed" selected>READ COMMITTED</option>
      <option value="repeatable_read">REPEATABLE READ</option>
      <option value="serializable">SERIALIZABLE</option>
    </select></div>`;
  },
  failures() {
    return `${btn("Force dirty read", 'M_Txn._write("A",1,999);M_Txn.state.isolation="read_uncommitted";M_Txn._read("B",1);Engine.log("FAULT: dirty read — B sees A uncommitted write","fault")', "ctrl-btn fault-btn")}
    ${btn("Deadlock scenario", 'M_Txn._write("A",1,10);M_Txn._write("B",2,20);M_Txn._write("A",2,30);M_Txn._write("B",1,40);Engine.log("FAULT: deadlock — A waits B, B waits A","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_Txn);

/* ──────────────────────────────────────────────
   T2-07  CACHE INVALIDATION
   ────────────────────────────────────────────── */
const M_CacheInval = {
  id: "t2_cache_inval",
  title: "07 · Cache Invalidation",
  state: {},
  init() {
    this.state = {
      db: { a: 10, b: 20, c: 30, d: 40 },
      cache: {},
      strategy: "write_through",
      ttl: 8,
      tick: 0,
      hits: 0,
      misses: 0,
      stale_reads: 0,
      inval_delay: 2,
      inval_queue: [],
    };
    this._render();
  },
  _read(key) {
    const s = this.state;
    const c = s.cache[key];
    if (c && s.tick - c.at < s.ttl && !c.stale) {
      s.hits++;
      Engine.log(`CACHE HIT ${key}=${c.val}`, "ok");
    } else {
      s.misses++;
      s.cache[key] = { val: s.db[key], at: s.tick, stale: false };
      Engine.log(`CACHE MISS ${key} — loaded from DB`, "info");
    }
    this._render();
  },
  _write(key, val) {
    const s = this.state;
    s.db[key] = val;
    if (s.strategy === "write_through") {
      s.cache[key] = { val, at: s.tick, stale: false };
      Engine.log(`WRITE-THROUGH ${key}=${val}`, "ok");
    } else {
      s.inval_queue.push({ key, in: s.inval_delay });
      Engine.log(`WRITE-BEHIND: ${key} invalidation queued`, "info");
    }
    this._render();
  },
  step() {
    const s = this.state;
    s.tick++;
    s.inval_queue = s.inval_queue.filter((e) => {
      e.in--;
      if (e.in <= 0) {
        if (s.cache[e.key]) s.cache[e.key].stale = true;
        Engine.log(`Invalidated cache.${e.key}`, "info");
        return false;
      }
      return true;
    });
    if (Math.random() < 0.4) {
      const k = ["a", "b", "c", "d"][rand(0, 3)];
      this._read(k);
    }
    if (Math.random() < 0.2) {
      const k = ["a", "b", "c", "d"][rand(0, 3)];
      this._write(k, rand(0, 100));
    }
    this._render();
  },
  _render() {
    const s = this.state;
    const total = s.hits + s.misses;
    set("ci-hr", total ? ((s.hits / total) * 100).toFixed(1) + "%" : "—");
    set("ci-stale", s.stale_reads);
    set("ci-hits", s.hits);
    set("ci-misses", s.misses);
    const cv = el("ci-cache");
    if (cv)
      cv.innerHTML = Object.entries(s.db)
        .map(([k, v]) => {
          const c = s.cache[k];
          const fresh = c && !c.stale && s.tick - c.at < s.ttl;
          return `<div class="reg-row">
        <span class="reg-name">${k}</span>
        <span class="reg-val">db=${v}</span>
        <span style="color:${fresh ? "var(--green)" : c ? "var(--red)" : "var(--text-dim)"}">${c ? `cache=${c.val}${c.stale ? " [STALE]" : ""}` : " no cache"}</span>
        ${c ? `<span style="font-size:10px;color:var(--text-dim)">age:${s.tick - c.at}</span>` : ""}
      </div>`;
        })
        .join("");
  },
  template() {
    return `<div class="sim-title">Cache Invalidation</div>
    <div class="sim-desc">Cache holds copies of DB values. Write-through: cache updated on write. Write-behind: cache invalidated after a delay — reads between write and invalidation see stale data.</div>
    <div style="display:grid;grid-template-columns:1fr 200px;gap:12px">
      <div class="sim-box"><h4>DB ↔ Cache State</h4><div id="ci-cache"></div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">
          ${["a", "b", "c", "d"].map((k) => `<button class="ctrl-btn" onclick="M_CacheInval._read('${k}')">Read ${k}</button><button class="ctrl-btn" onclick="M_CacheInval._write('${k}',rand(0,100))">Write ${k}</button>`).join("")}
        </div>
      </div>
      <div class="sim-box"><h4>Metrics</h4>
        <div class="metric-row"><span class="metric-label">Hit rate</span><span class="metric-val good" id="ci-hr">—</span></div>
        <div class="metric-row"><span class="metric-label">Hits</span><span class="metric-val" id="ci-hits">0</span></div>
        <div class="metric-row"><span class="metric-label">Misses</span><span class="metric-val" id="ci-misses">0</span></div>
        <div class="metric-row"><span class="metric-label">Stale reads</span><span class="metric-val bad" id="ci-stale">0</span></div>
      </div>
    </div>`;
  },
  controls() {
    return (
      `<div class="ctrl-group"><span class="ctrl-label">Strategy</span>
    <select class="ctrl-select" onchange="M_CacheInval.state.strategy=this.value">
      <option value="write_through">Write-through (sync)</option>
      <option value="write_behind">Write-behind (async delay)</option>
    </select></div>` +
      slider(
        "TTL (ticks)",
        "ci-ttl",
        1,
        20,
        8,
        "",
        "M_CacheInval.state.ttl=+this.value",
      ) +
      slider(
        "Inval delay",
        "ci-delay",
        0,
        10,
        2,
        "",
        "M_CacheInval.state.inval_delay=+this.value",
      )
    );
  },
  failures() {
    return `${btn("Thundering herd (flush cache)", 'Object.keys(M_CacheInval.state.cache).forEach(k=>delete M_CacheInval.state.cache[k]);Engine.log("FAULT: thundering herd — all cache empty","fault")', "ctrl-btn fault-btn")}
    ${btn("Mark all stale", 'Object.keys(M_CacheInval.state.cache).forEach(k=>M_CacheInval.state.cache[k].stale=true);Engine.log("FAULT: all cache entries stale","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_CacheInval);

/* ──────────────────────────────────────────────
   T2-08  REPLICATION
   ────────────────────────────────────────────── */
const M_Repl = {
  id: "t2_repl",
  title: "08 · Replication",
  state: {},
  init() {
    this.state = {
      primary: { log: [], commit: 0, alive: true },
      r1: { log: [], applied: 0, lag: 0, alive: true },
      r2: { log: [], applied: 0, lag: 0, alive: true },
      mode: "async",
      repl_delay: 3,
      writes: 0,
      data_loss: 0,
      pending_writes: [],
    };
    this._render();
  },
  _write(val) {
    const s = this.state;
    if (!s.primary.alive) {
      Engine.log("Primary down — write rejected", "fault");
      return;
    }
    const entry = { seq: s.writes++, val, sent_at: s.tick || 0 };
    s.primary.log.push(entry);
    s.pending_writes.push({ ...entry, due: s.repl_delay });
    if (s.mode === "sync") {
      s.r1.log.push(entry);
      s.r1.applied++;
      s.r1.lag = 0;
      Engine.log(`SYNC write seq=${entry.seq}`, "ok");
    } else Engine.log(`ASYNC write seq=${entry.seq} — repl pending`, "info");
    this._render();
  },
  step() {
    const s = this.state;
    s.pending_writes = s.pending_writes.filter((w) => {
      w.due--;
      if (w.due <= 0) {
        if (s.r1.alive) {
          s.r1.log.push(w);
          s.r1.applied++;
        }
        if (s.r2.alive) {
          s.r2.log.push(w);
          s.r2.applied++;
        }
        return false;
      }
      return true;
    });
    s.r1.lag = s.primary.log.length - s.r1.log.length;
    s.r2.lag = s.primary.log.length - s.r2.log.length;
    this._write("v" + s.writes);
    this._render();
  },
  _failover() {
    const s = this.state;
    s.primary.alive = false;
    const best = [s.r1, s.r2].sort((a, b) => b.applied - a.applied)[0];
    const lost = s.primary.log.length - best.log.length;
    s.data_loss += lost;
    Engine.log(
      `FAILOVER: primary down — elected replica with ${best.applied} entries. Data loss: ${lost}`,
      "fault",
    );
    this._render();
  },
  _render() {
    const s = this.state;
    ["primary", "r1", "r2"].forEach((n) => {
      const node = s[n];
      const ev = el("repl-" + n);
      if (!ev) return;
      ev.innerHTML = `<div class="metric-row"><span class="metric-label">${n}</span>
        <span class="metric-val ${node.alive ? "good" : "bad"}">${node.alive ? "●" : "✗ DOWN"}</span></div>
        <div class="metric-row"><span class="metric-label">Log entries</span><span class="metric-val">${node.log.length}</span></div>
        ${n !== "primary" ? `<div class="metric-row"><span class="metric-label">Lag</span><span class="metric-val ${node.lag > 5 ? "bad" : node.lag > 0 ? "warn" : "good"}">${node.lag}</span></div>` : ""}`;
    });
    set("repl-loss", s.data_loss);
  },
  template() {
    return `<div class="sim-title">Replication</div>
    <div class="sim-desc">Async replication: replicas acknowledge without waiting for replica. Fast but data loss on failover. Sync: primary waits for replica ack. Slow but no loss.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div class="sim-box" id="repl-primary"><h4>Primary</h4></div>
      <div class="sim-box" id="repl-r1"><h4>Replica 1</h4></div>
      <div class="sim-box" id="repl-r2"><h4>Replica 2</h4></div>
    </div>
    <div class="metric-row" style="margin-top:12px"><span class="metric-label">Data loss on last failover</span><span class="metric-val bad" id="repl-loss">0</span></div>`;
  },
  controls() {
    return (
      `<div class="ctrl-group"><span class="ctrl-label">Mode</span>
    <select class="ctrl-select" onchange="M_Repl.state.mode=this.value">
      <option value="async">Async</option><option value="sync">Sync</option><option value="semi_sync">Semi-sync</option>
    </select></div>` +
      slider(
        "Repl delay",
        "repl-delay",
        0,
        10,
        3,
        " ticks",
        "M_Repl.state.repl_delay=+this.value",
      ) +
      `<button class="ctrl-btn" style="width:100%;margin-top:6px" onclick="M_Repl._write('manual_'+Date.now()%1000)">Manual write</button>`
    );
  },
  failures() {
    return `${btn("Kill primary (failover)", "M_Repl._failover()", "ctrl-btn fault-btn")}
    ${btn("Lag spike (delay×5)", 'M_Repl.state.repl_delay*=5;Engine.log("FAULT: replication lag spike","fault")', "ctrl-btn fault-btn")}
    ${btn("Kill replica 1", 'M_Repl.state.r1.alive=false;Engine.log("FAULT: replica 1 down","fault")', "ctrl-btn fault-btn")}
    ${btn("Restore all", "M_Repl.state.primary.alive=true;M_Repl.state.r1.alive=true;M_Repl.state.r2.alive=true;M_Repl.state.repl_delay=3", "ctrl-btn")}`;
  },
};
register("t2", M_Repl);

/* ──────────────────────────────────────────────
   T2-09  CONSENSUS (RAFT BASICS)
   ────────────────────────────────────────────── */
const M_Raft = {
  id: "t2_raft",
  title: "09 · Consensus (Raft)",
  state: {},
  init() {
    this.state = {
      nodes: [
        {
          id: 0,
          role: "leader",
          term: 1,
          log: [],
          votes: 0,
          timeout: 0,
          voted_for: null,
        },
        {
          id: 1,
          role: "follower",
          term: 1,
          log: [],
          votes: 0,
          timeout: rand(5, 10),
          voted_for: null,
        },
        {
          id: 2,
          role: "follower",
          term: 1,
          log: [],
          votes: 0,
          timeout: rand(5, 10),
          voted_for: null,
        },
      ],
      msgs: [],
      committed: [],
      tick: 0,
      leader: 0,
      partitioned: false,
      partition_node: 2,
    };
    this._render();
  },
  step() {
    const s = this.state;
    s.tick++;
    const leader = s.nodes.find((n) => n.role === "leader");
    if (leader && s.tick % 4 === 0) {
      const val = "v" + s.tick;
      leader.log.push({ term: leader.term, val });
      s.nodes
        .filter(
          (n) =>
            n.role !== "leader" &&
            !(s.partitioned && n.id === s.partition_node),
        )
        .forEach((n) => {
          n.log.push({ term: leader.term, val });
          s.msgs.push({
            from: leader.id,
            to: n.id,
            type: "AppendEntries",
            val,
          });
        });
      if (
        s.nodes.filter((n) => !(s.partitioned && n.id === s.partition_node))
          .length >= 2
      ) {
        s.committed.push(val);
        Engine.log(`Committed: ${val}`, "ok");
      }
    }
    s.nodes
      .filter((n) => n.role === "follower")
      .forEach((n) => {
        if (s.partitioned && n.id === s.partition_node) return;
        n.timeout--;
        if (n.timeout <= 0) {
          this._elect(n);
        }
      });
    if (s.msgs.length > 8) s.msgs = s.msgs.slice(-8);
    this._render();
  },
  _elect(node) {
    const s = this.state;
    node.role = "candidate";
    node.term++;
    Engine.log(`N${node.id} election term=${node.term}`, "info");
    let votes = 1;
    s.nodes
      .filter(
        (n) => n !== node && !(s.partitioned && n.id === s.partition_node),
      )
      .forEach((n) => {
        if (n.term <= node.term) {
          votes++;
          n.voted_for = node.id;
          n.role = "follower";
          n.term = node.term;
        }
      });
    if (votes >= 2) {
      node.role = "leader";
      s.leader = node.id;
      Engine.log(`N${node.id} elected leader term=${node.term}`, "ok");
    } else {
      node.role = "follower";
      node.timeout = rand(5, 10);
      Engine.log(`N${node.id} election failed — split vote`, "fault");
    }
  },
  _render() {
    const s = this.state;
    const nv = el("raft-nodes");
    if (nv)
      nv.innerHTML = s.nodes
        .map(
          (n) => `
      <div class="sim-box" style="flex:1;min-width:0">
        <div class="state-node ${n.role === "leader" ? "current" : ""} ${s.partitioned && n.id === s.partition_node ? "fault" : ""}" style="width:100%;margin-bottom:6px">
          N${n.id}: ${n.role.toUpperCase()}${s.partitioned && n.id === s.partition_node ? " [PARTITIONED]" : ""}
        </div>
        <div class="metric-row"><span class="metric-label">Term</span><span class="metric-val">${n.term}</span></div>
        <div class="metric-row"><span class="metric-label">Log entries</span><span class="metric-val">${n.log.length}</span></div>
        <div class="metric-row"><span class="metric-label">Timeout</span><span class="metric-val">${n.role === "leader" ? "—" : n.timeout}</span></div>
      </div>`,
        )
        .join("");
    set("raft-committed", s.committed.length);
    const mv = el("raft-msgs");
    if (mv)
      mv.innerHTML = s.msgs
        .slice(-5)
        .map(
          (m) =>
            `<div class="log-entry ok">N${m.from}→N${m.to}: ${m.type} ${m.val || ""}</div>`,
        )
        .join("");
  },
  template() {
    return `<div class="sim-title">Consensus (Raft basics)</div>
    <div class="sim-desc">Raft elects a leader that replicates log entries. Commits require quorum (2/3). Election triggers when a follower's timeout fires. Partition prevents minority node from committing.</div>
    <div id="raft-nodes" style="display:flex;gap:12px;margin-bottom:12px"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="sim-box"><h4>Messages</h4><div id="raft-msgs" class="log-strip"></div></div>
      <div class="sim-box"><h4>Committed entries</h4>
        <div class="metric-row"><span class="metric-label">Count</span><span class="metric-val good" id="raft-committed">0</span></div>
      </div>
    </div>`;
  },
  controls() {
    return `<button class="ctrl-btn" onclick="M_Raft.state.nodes[1].timeout=0">Trigger election (N1)</button>`;
  },
  failures() {
    return `${btn("Kill leader", 'M_Raft.state.nodes.find(n=>n.role==="leader").role="follower";Engine.log("FAULT: leader killed","fault")', "ctrl-btn fault-btn")}
    ${btn("Partition N2", 'M_Raft.state.partitioned=true;Engine.log("FAULT: N2 partitioned — no quorum possible from N2","fault")', "ctrl-btn fault-btn")}
    ${btn("Heal partition", 'M_Raft.state.partitioned=false;Engine.log("Partition healed","ok")', "ctrl-btn")}`;
  },
};
register("t2", M_Raft);

/* ──────────────────────────────────────────────
   T2-10  BACKPRESSURE
   ────────────────────────────────────────────── */
const M_Back = {
  id: "t2_backpressure",
  title: "10 · Backpressure",
  state: {},
  _canvas_data: [],
  init() {
    this.state = {
      queue: [],
      prod_rate: 10,
      cons_rate: 5,
      limit: 30,
      mode: "none",
      dropped: 0,
      blocked: 0,
      total_in: 0,
      history: [],
      tick: 0,
    };
    this._canvas_data = [];
    this._render();
  },
  step() {
    const s = this.state;
    s.tick++;
    const produce = s.prod_rate;
    let actual_produce = produce;
    if (s.mode === "block" && s.queue.length >= s.limit) {
      s.blocked++;
      actual_produce = 0;
      Engine.log("Producer BLOCKED — queue full", "fault");
    } else if (s.mode === "drop" && s.queue.length >= s.limit) {
      const drop = Math.max(0, produce - (s.limit - s.queue.length));
      s.dropped += drop;
      actual_produce = produce - drop;
      if (drop > 0) Engine.log(`Dropped ${drop} items`, "fault");
    }
    for (let i = 0; i < actual_produce; i++) s.queue.push(s.tick);
    s.total_in += actual_produce;
    const consumed = Math.min(s.cons_rate, s.queue.length);
    s.queue.splice(0, consumed);
    s.history.push(s.queue.length);
    if (s.history.length > 80) s.history.shift();
    this._canvas_data = s.history;
    this._render();
  },
  _render() {
    const s = this.state;
    const pct = (s.queue.length / s.limit) * 100;
    const bar = el("bp-bar");
    if (bar) {
      bar.style.width = Math.min(pct, 100) + "%";
      bar.className =
        "fill-bar" + (pct > 80 ? " crit" : pct > 50 ? " warn" : "");
    }
    set("bp-depth", s.queue.length + "/" + s.limit);
    set("bp-dropped", s.dropped);
    set("bp-blocked", s.blocked);
    const can = el("bp-canvas");
    if (can) {
      const ctx = can.getContext("2d");
      ctx.clearRect(0, 0, can.width, can.height);
      ctx.fillStyle = "var(--bg3)";
      ctx.fillRect(0, 0, can.width, can.height);
      const data = this._canvas_data;
      if (data.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "#4f8ef7";
        ctx.lineWidth = 1.5;
        data.forEach((v, i) => {
          const x = (i / data.length) * can.width;
          const y = can.height - ((v / s.limit) * can.height * 0.9 + 4);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.stroke();
        ctx.fillStyle = "rgba(79,142,247,.1)";
        ctx.lineTo(can.width, can.height);
        ctx.lineTo(0, can.height);
        ctx.fill();
        const limitY = can.height - can.height * 0.9 - 4;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(231,76,60,.5)";
        ctx.setLineDash([4, 4]);
        ctx.moveTo(0, limitY);
        ctx.lineTo(can.width, limitY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  },
  template() {
    return `<div class="sim-title">Backpressure</div>
    <div class="sim-desc">Producer enqueues at prod_rate items/tick. Consumer dequeues at cons_rate. Without backpressure, queue grows unbounded until crash. Block/Drop strategies limit queue at the cost of throughput or completeness.</div>
    <div style="display:grid;grid-template-columns:1fr 200px;gap:12px">
      <div class="sim-box">
        <h4>Queue depth history</h4>
        <canvas id="bp-canvas" width="400" height="100"></canvas>
        <div style="margin-top:8px"><div class="ctrl-label">Queue: <span id="bp-depth">0/30</span></div>
          <div class="fill-bar-wrap" style="margin-top:4px"><div id="bp-bar" class="fill-bar" style="width:0%"></div></div>
        </div>
      </div>
      <div class="sim-box">
        <h4>Metrics</h4>
        <div class="metric-row"><span class="metric-label">Dropped</span><span class="metric-val bad" id="bp-dropped">0</span></div>
        <div class="metric-row"><span class="metric-label">Blocked ticks</span><span class="metric-val warn" id="bp-blocked">0</span></div>
      </div>
    </div>`;
  },
  controls() {
    return (
      `<div class="ctrl-group"><span class="ctrl-label">Backpressure mode</span>
    <select class="ctrl-select" onchange="M_Back.state.mode=this.value">
      <option value="none">None (unbounded)</option>
      <option value="block">Block producer</option>
      <option value="drop">Drop excess</option>
    </select></div>` +
      slider(
        "Producer rate",
        "bp-prod",
        1,
        30,
        10,
        "/tick",
        "M_Back.state.prod_rate=+this.value",
      ) +
      slider(
        "Consumer rate",
        "bp-cons",
        1,
        30,
        5,
        "/tick",
        "M_Back.state.cons_rate=+this.value",
      ) +
      slider(
        "Queue limit",
        "bp-limit",
        5,
        100,
        30,
        "",
        "M_Back.state.limit=+this.value",
      )
    );
  },
  failures() {
    return `${btn("Consumer stall (rate=0)", 'M_Back.state.cons_rate=0;Engine.log("FAULT: consumer stalled","fault")', "ctrl-btn fault-btn")}
    ${btn("Producer spike (×4)", 'M_Back.state.prod_rate*=4;Engine.log("FAULT: producer spike","fault")', "ctrl-btn fault-btn")}
    ${btn("Reset rates", "M_Back.state.prod_rate=10;M_Back.state.cons_rate=5", "ctrl-btn")}`;
  },
};
register("t2", M_Back);

/* ──────────────────────────────────────────────
   T2-11  RETRIES & IDEMPOTENCY
   ────────────────────────────────────────────── */
const M_Retry = {
  id: "t2_retry",
  title: "11 · Retries &amp; Idempotency",
  state: {},
  init() {
    this.state = {
      idempotency: false,
      seen: {},
      charges: [],
      fail_at: "none",
      retries: 0,
      duplicates: 0,
      total: 0,
    };
    this._render();
  },
  _charge(key, amount) {
    const s = this.state;
    s.total++;
    if (s.idempotency && s.seen[key]) {
      s.duplicates++;
      Engine.log(`Idempotent: key=${key} already processed — skip`, "ok");
      this._render();
      return;
    }
    const phase = rand(1, 3);
    if (s.fail_at === "before_db" && phase === 1) {
      Engine.log(
        `FAULT: crash before DB write — key=${key}  (client will retry)`,
        "fault",
      );
      this._render();
      return;
    }
    s.charges.push({ key, amount, ts: Date.now() % 10000 });
    if (s.fail_at === "after_db" && phase === 2) {
      Engine.log(
        `FAULT: crash after DB, before ack — client retries = DUPLICATE CHARGE if not idempotent`,
        "fault",
      );
      this._render();
      return;
    }
    if (s.idempotency) s.seen[key] = true;
    Engine.log(`Charged key=${key} $${amount}`, "ok");
    this._render();
  },
  step() {
    const key = "req_" + (Math.floor(Engine._stepN / 3) + 1);
    this._charge(key, rand(10, 500));
    if (Engine._stepN % 3 !== 0) {
      this.state.retries++;
      Engine.log(`Retry attempt for ${key}`, "info");
    }
  },
  _render() {
    const s = this.state;
    set("retry-charges", s.charges.length);
    set("retry-dups", s.duplicates);
    set("retry-total", s.total);
    const cv = el("retry-charges-list");
    if (cv)
      cv.innerHTML = s.charges
        .slice(-8)
        .map((c) => `<div class="log-entry ok">$${c.amount} key=${c.key}</div>`)
        .join("");
    const dd = el("retry-dup-warn");
    if (dd)
      dd.style.display = s.duplicates > 0 && !s.idempotency ? "block" : "none";
  },
  template() {
    return `<div class="sim-title">Retries &amp; Idempotency</div>
    <div class="sim-desc">Network failures cause retries. Without idempotency keys, retries create duplicate charges. With idempotency: server checks if key was already processed — duplicate is a no-op.</div>
    <div style="display:grid;grid-template-columns:1fr 200px;gap:12px">
      <div class="sim-box"><h4>Completed charges</h4>
        <div id="retry-charges-list" class="log-strip"></div>
        <div id="retry-dup-warn" style="color:var(--red);font-size:11px;margin-top:6px;display:none">⚠ DUPLICATE CHARGES DETECTED — enable idempotency</div>
      </div>
      <div class="sim-box"><h4>Metrics</h4>
        <div class="metric-row"><span class="metric-label">Total attempts</span><span class="metric-val" id="retry-total">0</span></div>
        <div class="metric-row"><span class="metric-label">Charges processed</span><span class="metric-val good" id="retry-charges">0</span></div>
        <div class="metric-row"><span class="metric-label">Duplicates</span><span class="metric-val bad" id="retry-dups">0</span></div>
        <label style="display:flex;gap:6px;align-items:center;margin-top:10px;font-size:11px;cursor:pointer">
          <input type="checkbox" onchange="M_Retry.state.idempotency=this.checked;M_Retry.state.seen={}"> Idempotency keys
        </label>
      </div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">Fail at step</span>
    <select class="ctrl-select" onchange="M_Retry.state.fail_at=this.value">
      <option value="none">No failure</option>
      <option value="before_db">Before DB write</option>
      <option value="after_db">After DB, before ack</option>
    </select></div>
    <button class="ctrl-btn" style="width:100%;margin-top:6px" onclick="M_Retry._charge('manual_'+Date.now()%1000,99)">Send charge request</button>`;
  },
  failures() {
    return `${btn("Retry storm (send 5× same key)", 'for(let i=0;i<5;i++)M_Retry._charge("charge_42",100);Engine.log("FAULT: 5 retries same request","fault")', "ctrl-btn fault-btn")}
    ${btn("Expired idempotency key", 'delete M_Retry.state.seen["charge_42"];Engine.log("FAULT: idempotency key expired — late retry = duplicate","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_Retry);

/* ──────────────────────────────────────────────
   T2-12  OBSERVABILITY
   ────────────────────────────────────────────── */
const M_Obs = {
  id: "t2_obs",
  title: "12 · Observability",
  state: {},
  _latencies: [],
  init() {
    this.state = {
      logs: [],
      metrics: { req: 0, err: 0, latencies: [], p99: 0 },
      traces: [],
      high_card: false,
      log_flood: false,
      tick: 0,
    };
    this._render();
  },
  _request(force_err = false) {
    const s = this.state;
    s.tick++;
    const id = "req_" + s.tick;
    const lat = rand(5, 50) * (force_err ? 5 : 1);
    const err = force_err || Math.random() < 0.1;
    const label = s.high_card
      ? `user_id=${rand(1, 100000)}`
      : err
        ? "error"
        : "ok";
    s.logs.push({
      id,
      level: err ? "ERROR" : "INFO",
      msg: `${err ? "failed" : "handled"} ${id}`,
      label,
      ts: s.tick,
    });
    if (s.log_flood)
      for (let i = 0; i < 20; i++)
        s.logs.push({ id, level: "DEBUG", msg: "debug line " + i, ts: s.tick });
    s.metrics.req++;
    if (err) s.metrics.err++;
    s.metrics.latencies.push(lat);
    if (s.metrics.latencies.length > 100) s.metrics.latencies.shift();
    const sorted = [...s.metrics.latencies].sort((a, b) => a - b);
    s.metrics.p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
    const spans = [
      { name: "handler", dur: lat },
      { name: "db_query", dur: Math.floor(lat * 0.6) },
      { name: "serialize", dur: Math.floor(lat * 0.1) },
    ];
    s.traces.push({ id, spans, err });
    if (s.logs.length > 40) s.logs = s.logs.slice(-40);
    if (s.traces.length > 10) s.traces.shift();
    this._render();
  },
  step() {
    this._request();
  },
  _render() {
    const s = this.state;
    const lv = el("obs-logs");
    if (lv)
      lv.innerHTML = s.logs
        .slice(-15)
        .reverse()
        .map(
          (l) =>
            `<div class="log-entry ${l.level === "ERROR" ? "error" : "ok"}">[${l.ts}] ${l.level} ${l.msg} ${l.label || ""}</div>`,
        )
        .join("");
    const mv = el("obs-metrics");
    if (mv) {
      const err_rate = s.metrics.req
        ? ((s.metrics.err / s.metrics.req) * 100).toFixed(1)
        : "0";
      mv.innerHTML = `<div class="metric-row"><span class="metric-label">Requests</span><span class="metric-val">${s.metrics.req}</span></div>
        <div class="metric-row"><span class="metric-label">Error rate</span><span class="metric-val ${+err_rate > 5 ? "bad" : ""}">${err_rate}%</span></div>
        <div class="metric-row"><span class="metric-label">P99 latency</span><span class="metric-val ${s.metrics.p99 > 100 ? "bad" : "warn"}">${s.metrics.p99}ms</span></div>
        <div class="metric-row"><span class="metric-label">Cardinality risk</span><span class="metric-val ${s.high_card ? "bad" : "good"}">${s.high_card ? "HIGH" : "low"}</span></div>`;
    }
    const tv = el("obs-traces");
    if (tv)
      tv.innerHTML = s.traces
        .slice(-4)
        .reverse()
        .map(
          (t) => `
      <div style="margin-bottom:8px">
        <div style="font-size:10px;color:${t.err ? "var(--red)" : "var(--green)"};margin-bottom:3px">${t.id} ${t.err ? "ERR" : ""}</div>
        ${t.spans
          .map(
            (
              sp,
              i,
            ) => `<div style="display:flex;align-items:center;gap:6px;margin:2px 0;padding-left:${i * 12}px">
          <span style="font-size:9px;color:var(--text-dim);min-width:60px">${sp.name}</span>
          <div style="height:6px;border-radius:2px;background:var(--accent);width:${Math.max(4, sp.dur * 2)}px"></div>
          <span style="font-size:9px;color:var(--text-dim)">${sp.dur}ms</span>
        </div>`,
          )
          .join("")}
      </div>`,
        )
        .join("");
  },
  template() {
    return `<div class="sim-title">Observability</div>
    <div class="sim-desc">The same request, seen three ways: structured log lines, aggregated metrics, and distributed trace waterfall. High cardinality labels (user_id) explode metric cardinality. Log flood fills disk.</div>
    <div style="display:grid;grid-template-columns:1fr 180px 1fr;gap:12px">
      <div class="sim-box"><h4>Logs</h4><div id="obs-logs" class="log-strip" style="max-height:300px"></div></div>
      <div class="sim-box"><h4>Metrics</h4><div id="obs-metrics"></div></div>
      <div class="sim-box"><h4>Trace waterfall</h4><div id="obs-traces"></div></div>
    </div>`;
  },
  controls() {
    return `<button class="ctrl-btn" style="width:100%;margin-bottom:4px" onclick="M_Obs._request()">Send request</button>
    <button class="ctrl-btn" style="width:100%" onclick="M_Obs._request(true)">Send failing request</button>`;
  },
  failures() {
    return `${btn("High cardinality labels", 'M_Obs.state.high_card=true;Engine.log("FAULT: user_id in metric label — cardinality explosion","fault")', "ctrl-btn fault-btn")}
    ${btn("Log flood (DEBUG on)", 'M_Obs.state.log_flood=true;Engine.log("FAULT: debug logging enabled in prod","fault")', "ctrl-btn fault-btn")}
    ${btn("Latency spike", "M_Obs._request(true);M_Obs._request(true);M_Obs._request(true)", "ctrl-btn fault-btn")}
    ${btn("Clear faults", "M_Obs.state.high_card=false;M_Obs.state.log_flood=false", "ctrl-btn")}`;
  },
};
register("t2", M_Obs);

/* ──────────────────────────────────────────────
   T2-13  PARTITION TOLERANCE (CAP)
   ────────────────────────────────────────────── */
const M_CAP = {
  id: "t2_cap",
  title: "13 · Partition Tolerance (CAP)",
  state: {},
  init() {
    this.state = {
      mode: "AP",
      partitioned: false,
      A: { data: { x: 1 }, writes: 0, stale: 0 },
      B: { data: { x: 1 }, writes: 0, stale: 0, rejects: 0 },
      diverged: [],
      conflicts: 0,
      tick: 0,
    };
    this._render();
  },
  _write(side, key, val) {
    const s = this.state;
    if (s.mode === "CP" && s.partitioned && side === "B") {
      s.B.rejects++;
      Engine.log(`CP: B rejects write — no quorum`, "fault");
      this._render();
      return;
    }
    s[side].data[key] = val;
    s[side].writes++;
    Engine.log(
      `${side} wrote ${key}=${val}${s.partitioned ? " [PARTITIONED]" : ""}`,
      "ok",
    );
    if (!s.partitioned) {
      const other = side === "A" ? "B" : "A";
      s[other].data[key] = val;
    } else {
      const other = side === "A" ? "B" : "A";
      if (s[other].data[key] !== undefined && s[other].data[key] !== val)
        s.diverged.push(key);
    }
    this._render();
  },
  step() {
    const s = this.state;
    s.tick++;
    if (s.partitioned) {
      this._write("A", "x", rand(0, 100));
      if (s.mode === "AP") this._write("B", "x", rand(0, 100));
    } else {
      this._write("A", "x", rand(0, 100));
    }
  },
  _heal() {
    const s = this.state;
    s.partitioned = false;
    if (s.mode === "AP") {
      const conflict = s.A.data.x !== s.B.data.x;
      if (conflict) {
        s.conflicts++;
        Engine.log("Heal: CONFLICT — last-write-wins (A wins)", "fault");
        s.B.data = { ...s.A.data };
      } else Engine.log("Heal: no conflict", "ok");
    }
    s.diverged = [];
    this._render();
  },
  _render() {
    const s = this.state;
    const av = el("cap-A");
    if (av)
      av.innerHTML = `<div class="state-node ${!s.partitioned ? "current" : ""}" style="width:100%;margin-bottom:6px">Side A</div>
      <div class="metric-row"><span class="metric-label">x</span><span class="metric-val">${s.A.data.x}</span></div>
      <div class="metric-row"><span class="metric-label">Writes</span><span class="metric-val">${s.A.writes}</span></div>`;
    const bv = el("cap-B");
    if (bv)
      bv.innerHTML = `<div class="state-node ${s.partitioned && s.mode === "CP" ? "fault" : !s.partitioned ? "current" : ""}" style="width:100%;margin-bottom:6px">Side B${s.partitioned && s.mode === "CP" ? " (rejecting)" : ""}</div>
      <div class="metric-row"><span class="metric-label">x</span><span class="metric-val ${s.partitioned && s.mode === "AP" && s.A.data.x !== s.B.data.x ? "bad" : ""}">${s.B.data.x}</span></div>
      <div class="metric-row"><span class="metric-label">Rejects</span><span class="metric-val bad">${s.B.rejects || 0}</span></div>`;
    set("cap-mode", s.mode);
    set("cap-diverged", s.diverged.length);
    set("cap-conflicts", s.conflicts);
    const pv = el("cap-partition-badge");
    if (pv) {
      pv.className = "phase-badge" + (s.partitioned ? " fault" : "");
      pv.textContent = s.partitioned ? "⚡ PARTITIONED" : "✓ CONNECTED";
    }
  },
  template() {
    return `<div class="sim-title">Partition Tolerance (CAP)</div>
    <div class="sim-desc">During a partition: AP system serves both sides (diverge); CP system rejects minority side (consistent but unavailable). When healed, AP must resolve conflicts.</div>
    <div id="cap-partition-badge" class="phase-badge" style="margin-bottom:12px">✓ CONNECTED</div>
    <div style="display:grid;grid-template-columns:1fr 160px 1fr;gap:12px;margin-bottom:12px">
      <div class="sim-box" id="cap-A"></div>
      <div class="sim-box">
        <h4>Network</h4>
        <div class="metric-row"><span class="metric-label">Mode</span><span class="metric-val" id="cap-mode">AP</span></div>
        <div class="metric-row"><span class="metric-label">Diverged keys</span><span class="metric-val bad" id="cap-diverged">0</span></div>
        <div class="metric-row"><span class="metric-label">Conflicts on heal</span><span class="metric-val bad" id="cap-conflicts">0</span></div>
        <button class="ctrl-btn" style="width:100%;margin-top:8px" onclick="M_CAP._heal()">Heal partition</button>
      </div>
      <div class="sim-box" id="cap-B"></div>
    </div>`;
  },
  controls() {
    return `<div class="ctrl-group"><span class="ctrl-label">CAP mode</span>
    <select class="ctrl-select" onchange="M_CAP.state.mode=this.value;set('cap-mode',this.value)">
      <option value="AP">AP (Available + Partition tolerant)</option>
      <option value="CP">CP (Consistent + Partition tolerant)</option>
    </select></div>`;
  },
  failures() {
    return `${btn("Partition!", 'M_CAP.state.partitioned=true;Engine.log("FAULT: network partition","fault")', "ctrl-btn fault-btn")}
    ${btn("Write both sides (diverge)", 'M_CAP.state.partitioned=true;M_CAP._write("A","x",100);M_CAP._write("B","x",999);Engine.log("FAULT: both sides wrote — diverged","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_CAP);

/* ──────────────────────────────────────────────
   T2-14  B-TREE SIMULATION
   ────────────────────────────────────────────── */
const M_BTree = {
  id: "t2_btree",
  title: "14 · B-Tree Structure",
  state: {},
  init() {
    this.state = {
      tree: { keys: [], children: [], leaf: true },
      inserts: 0,
      comparisons: 0,
      height: 1,
      last_path: [],
    };
    this._render();
  },
  _insert(key) {
    const s = this.state;
    this._ins(s.tree, key);
    s.inserts++;
    this._calcHeight(s.tree, 1);
    s.height = this._h || 1;
    this._render();
    Engine.log(`INSERT ${key} — tree height=${s.height}`, "ok");
  },
  _ins(node, key) {
    const s = this.state;
    s.comparisons++;
    if (node.leaf) {
      node.keys.push(key);
      node.keys.sort((a, b) => a - b);
      if (node.keys.length >= 5) {
        const mid = Math.floor(node.keys.length / 2);
        const right = { keys: node.keys.splice(mid), children: [], leaf: true };
        node.keys = node.keys.slice(0, mid);
        node.children = [{ ...node, keys: [...node.keys] }, right];
        node.keys = [right.keys[0]];
        node.leaf = false;
      }
    } else {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) i++;
      if (!node.children[i])
        node.children[i] = { keys: [], children: [], leaf: true };
      this._ins(node.children[i], key);
    }
  },
  _h: 1,
  _calcHeight(node, d) {
    if (!node) return;
    this._h = Math.max(this._h, d);
    node.children.forEach((c) => this._calcHeight(c, d + 1));
  },
  step() {
    this._insert(rand(1, 99));
  },
  _renderNode(node, depth = 0) {
    if (!node) return "";
    const style = `margin-left:${depth * 20}px;margin-bottom:4px`;
    const keys = `<div style="${style};display:inline-flex;gap:3px">
      ${node.keys.map((k) => `<div class="bit-cell" style="width:28px;height:28px;font-size:11px;background:var(--bg3)">${k}</div>`).join("")}
    </div>`;
    return (
      keys +
      (node.children || []).map((c) => this._renderNode(c, depth + 1)).join("")
    );
  },
  _render() {
    const s = this.state;
    const tv = el("btree-view");
    if (tv) tv.innerHTML = this._renderNode(s.tree);
    set("btree-inserts", s.inserts);
    set("btree-comps", s.comparisons);
    set("btree-height", s.height);
  },
  template() {
    return `<div class="sim-title">B-Tree Structure</div>
    <div class="sim-desc">B-Tree keeps keys sorted in nodes. Insertions may cause splits (node overflow → parent grows). Step inserts random keys. Observe height grow and nodes split.</div>
    <div style="display:grid;grid-template-columns:1fr 180px;gap:12px">
      <div class="sim-box"><h4>Tree (each row = one node level)</h4>
        <div id="btree-view" style="overflow-x:auto;min-height:100px"></div>
      </div>
      <div class="sim-box"><h4>Metrics</h4>
        <div class="metric-row"><span class="metric-label">Insertions</span><span class="metric-val" id="btree-inserts">0</span></div>
        <div class="metric-row"><span class="metric-label">Comparisons</span><span class="metric-val warn" id="btree-comps">0</span></div>
        <div class="metric-row"><span class="metric-label">Tree height</span><span class="metric-val" id="btree-height">1</span></div>
      </div>
    </div>`;
  },
  controls() {
    return `<input type="number" min="1" max="99" placeholder="Key value" class="ctrl-select" id="btree-input">
    <button class="ctrl-btn" style="width:100%;margin-top:4px" onclick="M_BTree._insert(+el('btree-input').value||rand(1,99))">Insert key</button>
    <button class="ctrl-btn" style="width:100%;margin-top:4px" onclick="for(let i=0;i<10;i++)M_BTree._insert(rand(1,99))">Bulk insert 10</button>`;
  },
  failures() {
    return `${btn("Write stall sim (reset + flood)", 'M_BTree.init();for(let i=0;i<50;i++)M_BTree._insert(rand(1,99));Engine.log("FAULT: write flood — watch splits cascade","fault")', "ctrl-btn fault-btn")}`;
  },
};
register("t2", M_BTree);

/* ──────────────────────────────────────────────
   T2-15  SOCKETS & OS BOUNDARY
   ────────────────────────────────────────────── */
const M_Socket = {
  id: "t2_socket",
  title: "15 · Sockets &amp; OS Boundary",
  state: {},
  init() {
    this.state = {
      app_send: [], // bytes waiting to be written
      kern_send: [], // kernel TCP send buffer
      wire: [],
      kern_recv: [],
      app_recv: [],
      fd: 3,
      buf_size: 8,
      blocked: false,
      dropped: 0,
      tick: 0,
      syscall: null, // current in-flight syscall
    };
    this._render();
  },
  step() {
    const s = this.state;
    s.tick++;
    s.syscall = null;
    // App writes to user buffer
    if (s.app_send.length < 4) {
      s.app_send.push(s.tick);
    }
    // Syscall: flush user -> kernel
    if (s.app_send.length > 0) {
      if (s.kern_send.length < s.buf_size) {
        s.syscall = "write()";
        const b = s.app_send.shift();
        s.kern_send.push(b);
        Engine.log(`syscall write() fd=${s.fd} byte=${b}`, "info");
      } else {
        s.blocked = true;
        Engine.log("FAULT: kernel send buffer full — write() blocks", "fault");
      }
    } else s.blocked = false;
    // Kernel sends to wire
    if (s.kern_send.length > 0) {
      s.wire.push(s.kern_send.shift());
    }
    // Wire delivers to recv
    if (s.wire.length > 0) {
      const b = s.wire.shift();
      if (s.kern_recv.length < s.buf_size) s.kern_recv.push(b);
      else {
        s.dropped++;
        Engine.log("FAULT: recv buffer overflow — byte dropped", "fault");
      }
    }
    // App reads from kernel
    if (s.kern_recv.length > 0) {
      s.syscall = "recv()";
      s.app_recv.push(s.kern_recv.shift());
    }
    if (
      [s.app_send, s.kern_send, s.wire, s.kern_recv, s.app_recv].every(
        (b) => b.length <= 20,
      )
    ) {
    } else
      [s.app_send, s.kern_send, s.wire, s.kern_recv, s.app_recv].forEach(
        (b) => b.length > 20 && b.shift(),
      );
    this._render();
  },
  _buf(items, max) {
    const pct = (items.length / max) * 100;
    return `<div class="fill-bar-wrap" style="height:60px;width:14px;position:relative">
      <div class="fill-bar${pct > 80 ? " crit" : pct > 50 ? " warn" : ""}" style="position:absolute;bottom:0;width:100%;height:${pct}%;border-radius:2px;transition:height .2s"></div>
    </div><div style="font-size:9px;color:var(--text-dim);margin-top:3px">${items.length}/${max}</div>`;
  },
  _render() {
    const s = this.state;
    const bv = el("sock-buffers");
    if (bv)
      bv.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
        <span style="font-size:10px;color:var(--accent)">APP WRITE</span>
        ${this._buf(s.app_send, 4)}
      </div>
      <span style="color:var(--text-dim);align-self:center">──syscall──→</span>
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;background:rgba(231,76,60,.05);padding:6px;border-radius:4px">
        <span style="font-size:10px;color:var(--red)">KERNEL SEND</span>
        ${this._buf(s.kern_send, s.buf_size)}
      </div>
      <span style="color:var(--text-dim);align-self:center">──wire──→</span>
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;background:rgba(231,76,60,.05);padding:6px;border-radius:4px">
        <span style="font-size:10px;color:var(--red)">KERNEL RECV</span>
        ${this._buf(s.kern_recv, s.buf_size)}
      </div>
      <span style="color:var(--text-dim);align-self:center">──recv()──→</span>
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
        <span style="font-size:10px;color:var(--green)">APP RECV</span>
        ${this._buf(s.app_recv, 16)}
      </div>`;
    set("sock-syscall", s.syscall || "—");
    set("sock-blocked", s.blocked ? "YES" : "no");
    set("sock-dropped", s.dropped);
    const mode = el("sock-mode");
    if (mode)
      mode.style.background = s.syscall ? "rgba(231,76,60,.15)" : "transparent";
  },
  template() {
    return `<div class="sim-title">Sockets &amp; OS Boundary</div>
    <div class="sim-desc">A socket crosses user/kernel boundary. App calls write() → data queues in kernel send buffer → sent on wire → lands in kernel recv buffer → app calls recv(). Buffer overflow = data loss or blocking.</div>
    <div style="display:grid;grid-template-columns:1fr 180px;gap:12px">
      <div class="sim-box">
        <h4>Buffer pipeline</h4>
        <div id="sock-buffers" style="display:flex;align-items:flex-start;gap:12px;padding:8px;flex-wrap:wrap"></div>
      </div>
      <div class="sim-box" id="sock-mode">
        <h4>Syscall</h4>
        <div class="metric-row"><span class="metric-label">In-flight</span><span class="metric-val" id="sock-syscall">—</span></div>
        <div class="metric-row"><span class="metric-label">Write blocked</span><span class="metric-val bad" id="sock-blocked">no</span></div>
        <div class="metric-row"><span class="metric-label">Bytes dropped</span><span class="metric-val bad" id="sock-dropped">0</span></div>
      </div>
    </div>`;
  },
  controls() {
    return slider(
      "Buffer size",
      "sock-buf",
      2,
      32,
      8,
      " bytes",
      "M_Socket.state.buf_size=+this.value",
    );
  },
  failures() {
    return `${btn("Recv buffer overflow", 'M_Socket.state.buf_size=2;Engine.log("FAULT: recv buf shrunk — drops incoming","fault")', "ctrl-btn fault-btn")}
    ${btn("Send blocked", 'for(let i=0;i<20;i++)M_Socket.state.kern_send.push(i);Engine.log("FAULT: kernel send full — write() blocks","fault");M_Socket._render()', "ctrl-btn fault-btn")}
    ${btn("Reset buffers", "M_Socket.state.kern_send=[];M_Socket.state.kern_recv=[];M_Socket.state.buf_size=8;M_Socket._render()", "ctrl-btn")}`;
  },
};
register("t2", M_Socket);

/* ═══════════════════════════════════════════════════════════
   ROUTER & SIDEBAR
   ═══════════════════════════════════════════════════════════ */

function buildSidebar(track) {
  const mods = Registry[track];
  const container = el(track + "-modules");
  container.innerHTML = "";
  mods.forEach((mod) => {
    const btn = document.createElement("button");
    btn.className = "mod-btn";
    btn.innerHTML = `<span class="mod-num">${mod.id.split("_")[1] || ""}</span>${mod.title}`;
    btn.dataset.id = mod.id;
    btn.onclick = () => {
      document
        .querySelectorAll(".mod-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      Engine.mount(mod);
    };
    container.appendChild(btn);
  });
}

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  buildSidebar("t1");
  buildSidebar("t2");

  // Track switch
  document.querySelectorAll(".track-btn").forEach((b) => {
    b.onclick = () => {
      document
        .querySelectorAll(".track-btn")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const t = b.dataset.track;
      ["t1", "t2"].forEach((track) => {
        el(track + "-label").style.display = track === t ? "block" : "none";
        el(track + "-modules").style.display = track === t ? "block" : "none";
      });
      Engine.halt();
      document
        .querySelectorAll(".mod-btn")
        .forEach((x) => x.classList.remove("active"));
      el("stage").innerHTML =
        '<div id="stage-placeholder"><div class="placeholder-inner"><div class="placeholder-icon">⚙</div><h2>Select a module</h2></div></div>';
      el("dynamic-controls").innerHTML = "<em>Select a module</em>";
      el("failure-controls").innerHTML = "<em>No module loaded</em>";
      el("state-dump").textContent = "—";
    };
  });

  // Global step controls
  el("btn-step").onclick = () => Engine.step();
  el("btn-run").onclick = () => Engine.run();
  el("btn-reset").onclick = () => Engine.reset();
  el("speed-slider").oninput = function () {
    Engine._tickMs = 2100 - +this.value;
  };

  // Load first T1 module by default
  const first = el("t1-modules").querySelector(".mod-btn");
  if (first) first.click();
});
