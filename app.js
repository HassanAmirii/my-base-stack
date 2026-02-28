"use strict";

/* ════════════════════════════════════════════════════════════════
   COMPLETE INTERACTIVE LEARNING PLATFORM
   Track 1: "From Nothing to Computer" (15 modules)
   Track 2: "Backend from First Principles" (15 modules)
   All simulations run client-side, no frameworks
════════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────────
   LESSONS — each lesson has:
   · track, num, title, hook
   · render(el) — builds DOM, attaches events
───────────────────────────────────────────────────────────────── */
const LESSONS = [
  /* =================================================================
     TRACK 1 — FROM NOTHING TO COMPUTER (15 modules)
     Strict dependency order: bits → gates → memory → CPU → OS
  ================================================================= */

  /* ────────────────────────────────────────────────────────────────
     01 — BITS AND SIGNAL STABILITY
     Purpose: Understand the physical reality of binary states
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "01",
    title: "What even is a 'bit'?",
    hook: "Every photo, message, and video is made of exactly two things: 0 and 1.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">What even is a "bit"?</h1>
    <p class="lesson-hook">Every photo, message, and video on your phone is made of exactly two things: 0 and 1. That's it. Let's see how.</p>

    <p class="prose">A <strong>bit</strong> is the smallest unit of information a computer can store. It can only ever be one of two values: <strong>0</strong> (off) or <strong>1</strong> (on). Think of it like a light switch — it's either up or down, nothing in between.</p>

    <p class="prose">In real hardware, a bit is a tiny transistor — a microscopic switch that either lets electricity through (1) or blocks it (0). Modern chips have <em>billions</em> of these switches crammed into a space smaller than your fingernail.</p>

    <div class="callout info">
      <div class="callout-title">Why only two states?</div>
      Two states are reliable. Electricity either flows or it doesn't. If you tried to store three states (low / medium / high voltage), tiny fluctuations would cause errors. Zero and one is <strong>unambiguous</strong>.
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔦</span>
        <span>Try it — click each bit to flip it</span>
      </div>
      <div class="playground-content">
        <p style="font-size:13px;color:var(--muted);margin-bottom:14px">These 8 bits form one <strong>byte</strong>. Click any bit to flip it between 0 and 1.</p>
        <div class="byte-row" id="byte-row"></div>
        <div class="val-display" id="byte-vals"></div>
        <div class="failure-controls" id="signal-failures" style="margin-top:12px">
          <button class="step-btn danger" onclick="L01_injectNoise()">📡 Inject signal noise</button>
          <span class="failure-note" id="noise-status">Stable signal</span>
        </div>
      </div>
    </div>

    <p class="prose">Eight bits grouped together make a <strong>byte</strong>. One byte can represent 256 different values (2⁸ = 256). A single letter in a text message is one byte. A 4K photo is about 8 <em>million</em> bytes.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      All computer data — numbers, text, images, code — is ultimately just a very long string of 0s and 1s. The magic is in <em>how</em> we interpret them.
    </div>
    `;
      initByte(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     02 — BINARY NUMBERS
     Purpose: Show how bit patterns represent numeric values
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "02",
    title: "How bits become numbers",
    hook: "Binary is just counting, but you only have two fingers.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">How bits become numbers</h1>
    <p class="lesson-hook">Decimal uses 10 digits (0–9). Binary uses 2 digits (0–1). Same idea, different base.</p>

    <p class="prose">In decimal (the numbers you use every day), each digit position is worth 10× the one to its right. In <strong>binary</strong>, each position is worth 2× the one to its right.</p>

    <div class="callout info">
      <div class="callout-title">Position values in an 8-bit number</div>
      <span style="font-family:var(--mono);font-size:13px;line-height:2">
        128 &nbsp; 64 &nbsp; 32 &nbsp; 16 &nbsp; 8 &nbsp; 4 &nbsp; 2 &nbsp; 1
      </span><br/>
      To get the total value, add up the positions where there's a <code>1</code>.
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔢</span>
        <span>Build a binary number</span>
      </div>
      <div class="playground-content">
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px">Each column shows its value. Flip bits on and off. Watch the total update.</p>
        <div id="bin-weights" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px"></div>
        <div class="byte-row" id="bin-row"></div>
        <div class="val-display" id="bin-vals"></div>
        <div style="margin-top:16px">
          <div class="callout warn" id="bin-explain" style="margin:0"></div>
        </div>
      </div>
    </div>

    <p class="prose">Try to make <strong>255</strong> — all 8 bits on. That's the maximum value of one byte. Now try <strong>0</strong>. Now try <strong>42</strong> (hint: 32 + 8 + 2).</p>

    <div class="callout success">
      <div class="callout-title">Why does this matter?</div>
      When your screen shows the colour red, it stores it as three numbers (Red, Green, Blue), each 0–255. Red at full brightness is <code>11111111</code> = 255. Black is <code>00000000</code> = 0. Every pixel on your screen is three bytes.
    </div>
    `;
      initBinary(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     03 — LOGIC GATES AND COMPOSITION
     Purpose: Show how bits combine to make decisions
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "03",
    title: "Logic gates — the basic building blocks",
    hook: "Every decision a computer makes comes down to a few simple rules.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Logic gates — how computers decide things</h1>
    <p class="lesson-hook">A logic gate is a tiny circuit that takes bits in and produces a bit out, based on a simple rule.</p>

    <p class="prose">There are a handful of fundamental gates. Every chip ever made — from a calculator to an AI server — is built from billions of combinations of these same few gates.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">⚡</span>
        <span>Click inputs A and B to see the outputs change</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px;flex-wrap:wrap;align-items:center">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">Input A</div>
            <div class="mini-bit b0" id="ga" onclick="flipGate('a')">0</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">Input B</div>
            <div class="mini-bit b0" id="gb" onclick="flipGate('b')">0</div>
          </div>
          <div>
            <button class="step-btn danger" onclick="injectGateFailure()">💥 Inject stuck-at fault</button>
          </div>
        </div>
        <div class="gate-grid" id="gate-grid"></div>
        <div id="gate-failure-status" style="font-size:12px;margin-top:8px;color:var(--muted)"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">What you're looking at</div>
      <strong>AND</strong> — both inputs must be 1 to get 1. Like needing both a key and a password.<br/>
      <strong>OR</strong> — at least one input is 1. Like a door that opens with either card A or card B.<br/>
      <strong>NOT</strong> — flips the input. 1 → 0, 0 → 1.<br/>
      <strong>XOR</strong> — exactly one input is 1. Useful for "is this different from that?"
    </div>

    <p class="prose">By chaining these gates together in the right pattern, you can build <strong>addition</strong>, <strong>comparison</strong>, <strong>memory</strong> — basically anything a computer can do. The ALU (Arithmetic Logic Unit) inside every CPU is just a huge pile of these gates wired together.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Your processor doesn't "understand" math. It just runs electrical signals through millions of gates and the answer comes out the other side.
    </div>
    `;
      initGates(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     04 — LATCHES AND CLOCK CYCLES
     Purpose: Show how gates become memory
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "04",
    title: "How gates remember things",
    hook: "Memory is just gates wired back to themselves.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">How gates remember things — Latches</h1>
    <p class="lesson-hook">If you wire the output of a gate back to its input, it can remember a value. That's a latch — the simplest form of memory.</p>

    <p class="prose">An <strong>SR latch</strong> (Set-Reset) uses two NOR gates cross-wired. It has two inputs: S (set) and R (reset). When you pulse S, the output Q becomes 1 and stays 1 even after S goes back to 0. That's memory — it "remembers" that you set it.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔁</span>
        <span>Step through clock cycles</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;align-items:center;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">S (Set)</div>
            <div class="mini-bit b0" id="latch-s" onclick="toggleLatch('s')">0</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">R (Reset)</div>
            <div class="mini-bit b0" id="latch-r" onclick="toggleLatch('r')">0</div>
          </div>
          <div style="margin-left:auto">
            <button class="step-btn" onclick="clockPulse()">🕒 Clock pulse</button>
          </div>
        </div>
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Output Q</div>
            <div class="mini-bit b0" id="latch-q">0</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Output ~Q</div>
            <div class="mini-bit b0" id="latch-nq">1</div>
          </div>
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="latchStep()">⏯ Step (apply inputs)</button>
          <button class="step-btn" onclick="latchReset()">↺ Reset latch</button>
        </div>
        <div id="latch-explain" class="outcome" style="margin-top:12px"></div>
      </div>
    </div>

    <p class="prose">A <strong>clock</strong> is a signal that oscillates between 0 and 1 at a fixed frequency. Modern CPUs run at billions of cycles per second (GHz). Every time the clock ticks, latches capture new values — this is what synchronizes everything.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Without latches, a CPU would have no memory of what it was doing between steps. The clock ensures that everything updates at the same time, like dancers following the beat.
    </div>
    `;
      initLatch(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     05 — REGISTERS AND DATA PATHS
     Purpose: Show how latches group into registers
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "05",
    title: "Registers — the CPU's scratchpad",
    hook: "A register is just a bunch of latches sharing the same clock.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Registers — the CPU's scratchpad</h1>
    <p class="lesson-hook">A register is a group of latches (usually 8, 16, 32, or 64) that store a value together. The CPU uses them as its working memory.</p>

    <p class="prose">When the CPU adds two numbers, it loads them from RAM into registers, performs the addition, and stores the result back in a register. Registers are the fastest memory in the computer — accessing them takes <strong>1 clock cycle</strong>.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">📋</span>
        <span>4-bit register file with data path</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px;align-items:center">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Data in</div>
            <div style="display:flex;gap:4px" id="reg-data-in"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Write enable</div>
            <div class="mini-bit b0" id="reg-we" onclick="toggleRegWE()">0</div>
          </div>
          <button class="step-btn" onclick="clockRegisters()">🕒 Clock</button>
        </div>
        <div style="display:flex;gap:24px;flex-wrap:wrap">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">R0</div>
            <div class="reg-bits" id="reg-r0"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">R1</div>
            <div class="reg-bits" id="reg-r1"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">R2</div>
            <div class="reg-bits" id="reg-r2"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">R3</div>
            <div class="reg-bits" id="reg-r3"></div>
          </div>
        </div>
        <div id="reg-explain" class="outcome" style="margin-top:12px"></div>
      </div>
    </div>

    <p class="prose">The <strong>data path</strong> is the bus that connects registers to the ALU. Data flows from registers → ALU → result register. This happens every clock cycle.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      A CPU has very few registers (typically 16–32). Everything else is in RAM. The art of compiler optimization is keeping frequently used values in registers as much as possible.
    </div>
    `;
      initRegisters(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     06 — ALU OPERATIONS
     Purpose: Show arithmetic and logic in hardware
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "06",
    title: "The ALU — where math happens",
    hook: "Addition, subtraction, AND, OR — all in one circuit.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">The ALU — where math happens</h1>
    <p class="lesson-hook">The Arithmetic Logic Unit is the calculator inside the CPU. It takes two numbers and an operation, and outputs the result.</p>

    <p class="prose">A simple ALU can add, subtract, AND, OR, and compare. More complex ones do multiplication, division, and floating point. All of this is built from logic gates.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🧮</span>
        <span>4-bit ALU — pick an operation</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px;flex-wrap:wrap">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">A (4 bits)</div>
            <div class="byte-row" id="alu-a"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">B (4 bits)</div>
            <div class="byte-row" id="alu-b"></div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Operation</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="step-btn" onclick="aluOp('add')">ADD</button>
            <button class="step-btn" onclick="aluOp('sub')">SUB</button>
            <button class="step-btn" onclick="aluOp('and')">AND</button>
            <button class="step-btn" onclick="aluOp('or')">OR</button>
            <button class="step-btn" onclick="aluOp('xor')">XOR</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Result</div>
            <div class="reg-bits" id="alu-result"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Flags</div>
            <div style="display:flex;gap:8px">
              <span class="flag" id="flag-zero">Z=0</span>
              <span class="flag" id="flag-carry">C=0</span>
              <span class="flag" id="flag-overflow">V=0</span>
            </div>
          </div>
        </div>
        <div id="alu-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Flags</div>
      <strong>Zero</strong> — result is 0<br/>
      <strong>Carry</strong> — addition overflowed the 4-bit result<br/>
      <strong>Overflow</strong> — signed arithmetic overflow
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      The ALU doesn't "know" it's doing math. It's just a bunch of gates wired to produce the right output for each combination of inputs.
    </div>
    `;
      initALU(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     07 — INSTRUCTION ENCODING
     Purpose: Show how operations become numbers
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "07",
    title: "How instructions are encoded",
    hook: "Every CPU instruction is just a number that the CPU decodes.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">How instructions are encoded</h1>
    <p class="lesson-hook">A program is just a list of numbers in memory. Each number means something to the CPU: "add", "load", "jump".</p>

    <p class="prose">In a simple 8-bit CPU, you might have 4 bits for the <strong>opcode</strong> (what to do) and 4 bits for the <strong>operand</strong> (which register or value). 4 bits = 16 possible instructions.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔢</span>
        <span>Encode instructions manually</span>
      </div>
      <div class="playground-content">
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Opcode (4 bits)</div>
          <div class="byte-row" id="enc-opcode"></div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Operand (4 bits)</div>
          <div class="byte-row" id="enc-operand"></div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Instruction byte</div>
          <div class="reg-bits" id="enc-byte"></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="step-btn" onclick="encodePreset('add')">ADD R2</button>
          <button class="step-btn" onclick="encodePreset('load')">LOAD R1</button>
          <button class="step-btn" onclick="encodePreset('jump')">JUMP 5</button>
        </div>
        <div id="enc-explain" class="outcome" style="margin-top:12px"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Instruction set</div>
      <code>0000 = ADD</code> — add operand to accumulator<br/>
      <code>0001 = LOAD</code> — load value into register<br/>
      <code>0010 = STORE</code> — store register to memory<br/>
      <code>0011 = JUMP</code> — jump to address
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      When you write code in a high-level language, the compiler turns it into thousands of these tiny encoded instructions. The CPU just reads them one by one.
    </div>
    `;
      initEncoding(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     08 — FETCH-DECODE-EXECUTE CYCLE
     Purpose: Show the CPU's main loop
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "08",
    title: "How the CPU runs a program",
    hook: "The CPU is just a very fast loop doing the same three steps over and over.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">How the CPU runs a program</h1>
    <p class="lesson-hook">The CPU does one thing, repeated billions of times per second: fetch → decode → execute.</p>

    <p class="prose">When you run any program — a game, a browser, anything — the CPU is reading instructions one by one from memory. Each instruction is just a number that says "add these two values" or "jump to this memory address."</p>

    <div class="callout info">
      <div class="callout-title">The three steps</div>
      <strong>1. Fetch</strong> — read the next instruction from memory.<br/>
      <strong>2. Decode</strong> — figure out what that instruction means.<br/>
      <strong>3. Execute</strong> — actually do it (add, move data, etc).
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🖥</span>
        <span>Step through a simple program</span>
      </div>
      <div class="playground-content">
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px">This tiny CPU has 4 registers (R0–R3) and runs 4 instructions. Hit <strong>Step</strong> to advance one instruction at a time.</p>
        <div class="phases" id="cpu-phases">
          <div class="phase-step" id="ph-fetch">1. Fetch</div>
          <div class="phase-step" id="ph-decode">2. Decode</div>
          <div class="phase-step" id="ph-exec">3. Execute</div>
          <div class="phase-step" id="ph-done">Done</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px">Program</div>
            <div id="cpu-program" style="font-family:var(--mono);font-size:13px;line-height:2.2"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px">Registers</div>
            <div id="cpu-regs"></div>
          </div>
        </div>
        <div id="cpu-explain" class="outcome" style="min-height:48px"></div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="cpuStep()">▶ Step</button>
          <button class="step-btn danger" onclick="injectHalt()">⛔ Inject HALT</button>
          <button class="step-btn" onclick="cpuReset()">↺ Reset</button>
        </div>
      </div>
    </div>

    <p class="prose">A modern CPU can do this loop <strong>4 billion times per second</strong> (4 GHz). It also has multiple "cores" — independent units each doing the same loop simultaneously. Your laptop probably has 8–16 cores.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Every app you've ever used — Instagram, Spotify, Chrome — ultimately runs as millions of these tiny fetch-decode-execute cycles per second.
    </div>
    `;
      initCPU(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     09 — MEMORY ADDRESSING
     Purpose: Show how CPU accesses RAM
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "09",
    title: "How the CPU addresses memory",
    hook: "Memory is just a giant array of bytes, each with an address.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">How the CPU addresses memory</h1>
    <p class="lesson-hook">Think of memory as a giant hotel with numbered rooms. Each room holds one byte. The CPU asks for "room number 42" and gets whatever's stored there.</p>

    <p class="prose">The <strong>address bus</strong> carries the room number from the CPU to RAM. The <strong>data bus</strong> carries the byte back. A 32-bit CPU can address up to 4GB of memory (2³² bytes).</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🏨</span>
        <span>Read and write memory locations</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px;align-items:center">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Address (0-15)</div>
            <input type="range" min="0" max="15" value="5" id="mem-addr-slider" style="width:200px" oninput="updateMemAddr()">
            <span id="mem-addr-val">5</span>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Data value</div>
            <div style="display:flex;gap:4px" id="mem-data-in"></div>
          </div>
          <button class="step-btn" onclick="memWrite()">💾 Write</button>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Memory contents (16 bytes)</div>
          <div class="mem-grid" id="mem-grid"></div>
        </div>
        <div id="mem-access-explain" class="outcome"></div>
      </div>
    </div>

    <p class="prose">Different addressing modes let the CPU access memory in different ways: <strong>direct</strong> (use this exact address), <strong>indirect</strong> (use the address stored in a register), <strong>indexed</strong> (base + offset).</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Pointers in languages like C are just memory addresses. When you do *ptr = 42, you're telling the CPU: "write 42 to the memory location stored in ptr."
    </div>
    `;
      initMemoryAddressing(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     10 — STACK VS HEAP
     Purpose: Show different memory regions
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "10",
    title: "Stack vs Heap — where things live",
    hook: "The stack is for short-term storage; the heap is for long-term.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Stack vs Heap — where things live</h1>
    <p class="lesson-hook">When a program runs, it uses two different areas of memory: the stack and the heap. They work completely differently.</p>

    <p class="prose">The <strong>stack</strong> is for function calls and local variables. It grows and shrinks automatically as functions are called and return. It's fast but limited (usually ~1MB).</p>

    <p class="prose">The <strong>heap</strong> is for data that needs to live longer than the function that created it. You manually allocate and free memory here. It's slower but much larger.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">📚</span>
        <span>Watch function calls affect the stack</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;flex-wrap:wrap">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Stack (grows downward)</div>
            <div class="stack-visual" id="stack-visual"></div>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Heap allocations</div>
            <div class="heap-visual" id="heap-visual"></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin:16px 0;flex-wrap:wrap">
          <button class="step-btn" onclick="callFunction()">📞 Call function</button>
          <button class="step-btn" onclick="returnFunction()">↩ Return</button>
          <button class="step-btn" onclick="mallocHeap()">🗜 malloc()</button>
          <button class="step-btn" onclick="freeHeap()">🗑 free()</button>
          <button class="step-btn danger" onclick="injectStackOverflow()">💥 Stack overflow</button>
        </div>
        <div id="mem-alloc-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Key differences</div>
      <strong>Stack</strong>: automatic allocation/deallocation, LIFO, thread-local, fast<br/>
      <strong>Heap</strong>: manual allocation, arbitrary order, shared between threads, slower (malloc overhead)
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Memory leaks happen when you allocate on the heap and forget to free it. Stack memory is automatically cleaned up when functions return — that's why it's safer for short-lived data.
    </div>
    `;
      initStackHeap(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     11 — CACHE LOCALITY
     Purpose: Show why memory access patterns matter
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "11",
    title: "Why order matters — cache locality",
    hook: "Accessing memory in order is 100× faster than jumping around.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Why order matters — cache locality</h1>
    <p class="lesson-hook">RAM is slow. CPUs use caches (L1, L2, L3) to hide that slowness. But caches work best when you access memory in predictable patterns.</p>

    <p class="prose"><strong>Spatial locality</strong>: if you access address 1000, the CPU also loads addresses 1001–1064 into cache, assuming you'll want them next.</p>

    <p class="prose"><strong>Temporal locality</strong>: if you accessed something recently, it's probably still in cache. Reuse it!</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">⚡</span>
        <span>Compare sequential vs random access</span>
      </div>
      <div class="playground-content">
        <div style="margin-bottom:16px">
          <div class="slider-row">
            <span>Array size: <span id="cache-size-val">64</span> elements</span>
            <input type="range" min="16" max="256" value="64" id="cache-size" oninput="updateCacheSize()">
          </div>
          <div class="slider-row">
            <span>Stride (skip distance): <span id="cache-stride-val">1</span></span>
            <input type="range" min="1" max="32" value="1" id="cache-stride" oninput="updateCacheStride()">
          </div>
        </div>
        <div style="display:flex;gap:16px;margin-bottom:16px">
          <button class="step-btn primary" onclick="runSequential()">📈 Sequential access</button>
          <button class="step-btn" onclick="runRandom()">🎲 Random access</button>
        </div>
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Access time</div>
            <div class="big-stat" id="cache-time">0 ns</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Cache hits</div>
            <div class="big-stat" id="cache-hits">0</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Cache misses</div>
            <div class="big-stat" id="cache-misses">0</div>
          </div>
        </div>
        <div class="heatmap" id="cache-heatmap"></div>
        <div id="cache-locality-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Typical latencies</div>
      L1 cache: 1 ns<br/>
      L2 cache: 4 ns<br/>
      L3 cache: 12 ns<br/>
      RAM: 100 ns<br/>
      SSD: 100,000 ns
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Writing cache-friendly code (accessing memory sequentially, reusing data) can make your program 10–100× faster. This is why database indexes and array loops matter.
    </div>
    `;
      initCacheLocality(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     12 — ASSEMBLY STEPPING
     Purpose: Show low-level program execution
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "12",
    title: "Stepping through assembly",
    hook: "See exactly what your code does, one instruction at a time.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Stepping through assembly</h1>
    <p class="lesson-hook">Assembly is human-readable machine code. Let's step through a tiny program and watch every change.</p>

    <p class="prose">This program calculates the sum of numbers from 1 to N. It uses a loop, a counter, and an accumulator. Each instruction is one line of assembly.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🐞</span>
        <span>Step through the loop</span>
      </div>
      <div class="playground-content">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Assembly</div>
            <div class="asm-listing" id="asm-listing"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Registers</div>
            <div id="asm-regs"></div>
            <div style="margin-top:12px">
              <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Memory</div>
              <div class="mem-mini" id="asm-mem"></div>
            </div>
          </div>
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="asmStep()">⏯ Step instruction</button>
          <button class="step-btn" onclick="asmRun()">▶ Run to completion</button>
          <button class="step-btn" onclick="asmReset()">↺ Reset</button>
        </div>
        <div id="asm-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Instructions</div>
      <code>MOV R0, #0</code> — set R0 to 0 (accumulator)<br/>
      <code>MOV R1, #5</code> — set R1 to 5 (N)<br/>
      <code>MOV R2, #1</code> — set R2 to 1 (counter)<br/>
      <code>ADD R0, R2</code> — add counter to accumulator<br/>
      <code>ADD R2, #1</code> — increment counter<br/>
      <code>CMP R2, R1</code> — compare counter to N<br/>
      <code>BLE loop</code> — branch if less/equal
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      High-level loops like <code>for(i=0;i<10;i++) sum+=i</code> become these assembly instructions. Every iteration, the CPU runs through this sequence again.
    </div>
    `;
      initAssembly(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     13 — PROCESSES AND THREADS
     Purpose: Show concurrent execution
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "13",
    title: "Processes and threads — running multiple things",
    hook: "Your computer runs hundreds of things 'at once' by switching between them extremely fast.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Processes and threads — running multiple things</h1>
    <p class="lesson-hook">A <strong>process</strong> is a running program with its own memory. <strong>Threads</strong> are lightweight processes that share memory within the same process.</p>

    <p class="prose">Your OS scheduler switches between processes thousands of times per second, giving each a tiny slice of CPU time. This is <strong>multitasking</strong>. Each core can run one thread at a time.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔄</span>
        <span>Watch the scheduler switch between processes</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Processes</div>
            <div id="process-list"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">CPU cores</div>
            <div id="core-list"></div>
          </div>
        </div>
        <div class="slider-row">
          <span>Load (processes): <span id="proc-load-val">3</span></span>
          <input type="range" min="1" max="10" value="3" id="proc-load" oninput="updateProcLoad()">
        </div>
        <div class="slider-row">
          <span>Context switch cost: <span id="switch-cost-val">5</span> µs</span>
          <input type="range" min="1" max="20" value="5" id="switch-cost" oninput="updateSwitchCost()">
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="schedulerStep()">⏯ Step scheduler</button>
          <button class="step-btn" onclick="schedulerReset()">↺ Reset</button>
        </div>
        <div id="scheduler-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Context switch overhead</div>
      Switching between processes is expensive: the CPU must save all registers, update page tables, flush caches. This can take microseconds — thousands of CPU cycles.
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Too many threads can actually slow things down due to context switch overhead. This is why thread pools and async I/O exist — to keep the CPU busy without constant switching.
    </div>
    `;
      initScheduler(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     14 — CONTEXT SWITCHING
     Purpose: Show the mechanics of switching tasks
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "14",
    title: "Context switching — how the OS saves state",
    hook: "The OS can pause a process, save everything, and resume it later as if nothing happened.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Context switching — how the OS saves state</h1>
    <p class="lesson-hook">When the OS switches from Process A to Process B, it must save A's entire state (registers, program counter, stack pointer) so it can resume A later.</p>

    <p class="prose">This saved state is called the <strong>context</strong>. The OS keeps a context for every process/thread. Switching contexts is pure overhead — the CPU isn't doing useful work during the switch.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">💾</span>
        <span>Watch a context switch happen</span>
      </div>
      <div class="playground-content">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Process A (running)</div>
            <div class="context-block" id="ctx-a"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Process B (saved)</div>
            <div class="context-block" id="ctx-b"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Kernel save area</div>
            <div class="context-block" id="ctx-kernel"></div>
          </div>
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="ctxSwitch()">🔄 Switch context</button>
          <button class="step-btn" onclick="ctxReset()">↺ Reset</button>
          <button class="step-btn danger" onclick="injectSaveError()">💥 Save error</button>
        </div>
        <div id="ctx-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">What's saved</div>
      • Program counter (where was it executing?)<br/>
      • All general-purpose registers<br/>
      • Stack pointer<br/>
      • Page table pointer (memory mapping)<br/>
      • Floating-point state
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Context switching is why your computer can run 100 processes on 8 cores. But it's also why too many threads can hurt performance — each switch costs precious microseconds.
    </div>
    `;
      initContextSwitch(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     15 — VIRTUAL MEMORY
     Purpose: Show how processes get isolated memory
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "15",
    title: "Virtual memory — every program thinks it owns the machine",
    hook: "Each process gets its own private address space, isolated from everyone else.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Virtual memory — every program thinks it owns the machine</h1>
    <p class="lesson-hook">With virtual memory, every process sees a flat, private address space starting at 0. The MMU (Memory Management Unit) translates these virtual addresses to physical RAM.</p>

    <p class="prose">This provides <strong>isolation</strong> — Process A can't see Process B's memory. It also allows <strong>overcommitment</strong> — you can allocate more virtual memory than physical RAM exists.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🗺</span>
        <span>Watch virtual addresses map to physical frames</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Process A virtual pages</div>
            <div class="page-table" id="vm-pages-a"></div>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Process B virtual pages</div>
            <div class="page-table" id="vm-pages-b"></div>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Physical frames</div>
            <div class="frame-table" id="vm-frames"></div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Page fault handling</div>
          <div class="step-controls">
            <button class="step-btn" onclick="accessPage('a', 2)">A: access page 2</button>
            <button class="step-btn" onclick="accessPage('b', 1)">B: access page 1</button>
            <button class="step-btn danger" onclick="injectPageFault()">💥 Cause page fault</button>
          </div>
        </div>
        <div id="vm-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Page fault</div>
      When a process accesses a virtual page that isn't mapped to physical RAM, the CPU traps to the OS. The OS loads the page from disk (swap) and updates the mapping. This is extremely slow.
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Virtual memory gives each process its own sandbox. A crash in one process can't corrupt another's memory. This is the foundation of modern multitasking operating systems.
    </div>
    `;
      initVirtualMemory(el);
    },
  },

  /* =================================================================
     TRACK 2 — BACKEND FROM FIRST PRINCIPLES (15 modules)
     Strict dependency order: network → concurrency → storage → distributed
  ================================================================= */

  /* ────────────────────────────────────────────────────────────────
     16 — BACKEND AS STATE MACHINE
     Purpose: Model a server as a state machine responding to requests
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "01",
    title: "Backend as a state machine",
    hook: "A server is just a state machine: given a request and current state, produce response and new state.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Backend as a state machine</h1>
    <p class="lesson-hook">Every backend can be modeled as a state machine. It has state (database, cache), receives inputs (HTTP requests), and produces outputs (responses) while updating state.</p>

    <p class="prose">This is the fundamental model: <strong>f(state, request) → (new_state, response)</strong>. Everything else — scaling, replication, consistency — is about managing this state machine across multiple nodes.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🤖</span>
        <span>Step through state transitions</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Current state</div>
            <div class="state-box" id="state-current">counter: 0</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Request</div>
            <div style="display:flex;gap:4px">
              <button class="step-btn" onclick="stateReq('increment')">INCREMENT</button>
              <button class="step-btn" onclick="stateReq('decrement')">DECREMENT</button>
              <button class="step-btn" onclick="stateReq('reset')">RESET</button>
            </div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Transition log</div>
          <div class="log-box" id="state-log"></div>
        </div>
        <div id="state-explain" class="outcome"></div>
        <div class="failure-controls" style="margin-top:12px">
          <button class="step-btn danger" onclick="injectStateCorruption()">💥 Corrupt state</button>
        </div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Why this matters</div>
      If you can model your backend as a pure state machine, you can reason about it mathematically. This is the foundation of <strong>deterministic systems</strong> and makes testing, replication, and recovery much easier.
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Processes and Threads</strong> — the OS gives each backend process its own isolated state.
    </div>
    `;
      initStateMachine(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     17 — TCP LIFECYCLE
     Purpose: Show connection establishment and teardown
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "02",
    title: "TCP lifecycle — how connections are made",
    hook: "Before your browser can send a request, it must first establish a TCP connection with the server.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">TCP lifecycle — how connections are made</h1>
    <p class="lesson-hook">TCP provides reliable, ordered communication between two programs. It starts with a three-way handshake and ends with a four-way teardown.</p>

    <p class="prose">Every time you load a webpage, your browser opens multiple TCP connections. Each connection goes through states: CLOSED → SYN-SENT → ESTABLISHED → FIN-WAIT → CLOSED.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🤝</span>
        <span>Step through a TCP connection lifecycle</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px;align-items:center">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Client state</div>
            <div class="state-badge" id="tcp-client-state">CLOSED</div>
          </div>
          <div style="font-size:20px">↔</div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Server state</div>
            <div class="state-badge" id="tcp-server-state">LISTEN</div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Packet flow</div>
          <div class="packet-flow" id="tcp-packets"></div>
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="tcpStep()">⏯ Next packet</button>
          <button class="step-btn" onclick="tcpReset()">↺ Reset</button>
          <button class="step-btn danger" onclick="injectPacketLoss()">💥 Drop SYN</button>
        </div>
        <div id="tcp-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">TCP states</div>
      <strong>SYN</strong>: synchronize (connection request)<br/>
      <strong>SYN-ACK</strong>: acknowledge + synchronize<br/>
      <strong>ACK</strong>: acknowledge<br/>
      <strong>FIN</strong>: finish (close connection)<br/>
      <strong>RST</strong>: reset (abort connection)
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Processes and Threads</strong> — each TCP connection is handled by a socket, which is a file descriptor owned by a process.
    </div>
    `;
      initTCP(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     18 — SOCKETS AND OS BOUNDARY
     Purpose: Show the kernel/userspace boundary
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "03",
    title: "Sockets and the OS boundary",
    hook: "Your program can't touch the network card directly. It asks the kernel via sockets.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Sockets and the OS boundary</h1>
    <p class="lesson-hook">A socket is the kernel's API for network communication. Your program writes to a socket; the kernel turns that into packets and sends them.</p>

    <p class="prose">The boundary between <strong>userspace</strong> (your app) and <strong>kernelspace</strong> (the OS) is crossed via system calls. <code>socket()</code>, <code>bind()</code>, <code>listen()</code>, <code>accept()</code>, <code>connect()</code>, <code>send()</code>, <code>recv()</code>.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🧱</span>
        <span>Watch data cross the kernel boundary</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px;align-items:center">
          <div style="flex:1;text-align:center">
            <div class="boundary-box" id="socket-userspace">
              Userspace<br/>Your App
            </div>
          </div>
          <div style="font-size:24px;color:var(--muted)">⛓️</div>
          <div style="flex:1;text-align:center">
            <div class="boundary-box kernel" id="socket-kernel">
              Kernelspace<br/>TCP/IP Stack
            </div>
          </div>
          <div style="font-size:24px;color:var(--muted)">→</div>
          <div style="flex:1;text-align:center">
            <div class="boundary-box" id="socket-nic">
              Network Card
            </div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Socket buffer (kernel)</div>
          <div class="socket-buffer" id="socket-buffer">[empty]</div>
        </div>
        <div class="step-controls">
          <button class="step-btn" onclick="socketSend()">📤 send()</button>
          <button class="step-btn" onclick="socketRecv()">📥 recv()</button>
          <button class="step-btn danger" onclick="injectBufferFull()">💥 Buffer full</button>
        </div>
        <div id="socket-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">System call cost</div>
      Crossing the user/kernel boundary is expensive (∼1µs). This is why high-performance servers try to minimize syscalls by batching reads/writes and using zero-copy techniques.
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Virtual Memory</strong> — the kernel isolates each process; sockets are the controlled interface to cross that isolation.
    </div>
    `;
      initSockets(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     19 — EVENT LOOP VS THREADS
     Purpose: Compare concurrency models
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "04",
    title: "Event loop vs threads",
    hook: "Two ways to handle many connections: many threads, or one thread that never blocks.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Event loop vs threads</h1>
    <p class="lesson-hook">Thread-per-connection: simple but uses memory. Event loop: complex but scales to millions of connections. This is the Node.js vs Apache debate.</p>

    <p class="prose">In the <strong>threaded model</strong>, each connection gets its own thread. The OS scheduler switches between them. In the <strong>event loop</strong>, one thread handles all connections using non-blocking I/O and callbacks.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔄</span>
        <span>Compare both models under load</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Thread pool</div>
            <div class="model-vis" id="model-threads"></div>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Event loop</div>
            <div class="model-vis" id="model-eventloop"></div>
          </div>
        </div>
        <div class="slider-row">
          <span>Connections: <span id="conns-val">10</span></span>
          <input type="range" min="1" max="100" value="10" id="conns" oninput="updateConns()">
        </div>
        <div class="slider-row">
          <span>I/O wait time: <span id="io-wait-val">5</span> ms</span>
          <input type="range" min="0" max="50" value="5" id="io-wait" oninput="updateIOWait()">
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="runModel()">▶ Run simulation</button>
        </div>
        <div id="model-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Tradeoffs</div>
      <strong>Threads</strong>: simple programming, but each thread costs memory (∼1MB stack) and context switch overhead.<br/>
      <strong>Event loop</strong>: minimal memory per connection, but callbacks can get complex and CPU-bound tasks block everything.
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Context Switching</strong> — threads incur context switch overhead; event loops avoid it by staying in one thread.
    </div>
    `;
      initEventLoop(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     20 — RACE CONDITIONS
     Purpose: Show concurrent access bugs
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "05",
    title: "Race conditions — when concurrency goes wrong",
    hook: "Two threads updating the same data at the same time can corrupt it.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Race conditions — when concurrency goes wrong</h1>
    <p class="lesson-hook">If two threads read a value, increment it, and write it back, one increment can be lost. That's a race condition.</p>

    <p class="prose">The classic example: two threads both try to increment a counter. Thread A reads 42, Thread B reads 42, A writes 43, B writes 43 — but it should be 44. One increment disappeared!</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🏁</span>
        <span>Step through a race condition</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px;align-items:center">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Counter</div>
            <div class="big-stat" id="race-counter">42</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Thread A</div>
            <div class="thread-state" id="race-thread-a">idle</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Thread B</div>
            <div class="thread-state" id="race-thread-b">idle</div>
          </div>
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="raceStep()">⏯ Next instruction</button>
          <button class="step-btn" onclick="raceReset()">↺ Reset</button>
          <button class="step-btn" onclick="raceFix()">🔒 Use mutex</button>
        </div>
        <div id="race-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Solution: mutual exclusion</div>
      Use a <strong>mutex</strong> (mutual exclusion lock) to ensure only one thread can access the counter at a time. The thread locks, reads, increments, writes, unlocks.
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Processes and Threads</strong> — race conditions only happen when threads share memory.
    </div>
    `;
      initRace(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     21 — APPEND-ONLY LOG
     Purpose: Show the fundamental storage primitive
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "06",
    title: "Append-only log — the foundation of storage",
    hook: "Many databases are built on a simple idea: only ever add to the end of a file.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Append-only log — the foundation of storage</h1>
    <p class="lesson-hook">Instead of modifying existing data, just append new records. This is how write-ahead logs, Kafka, and many databases work.</p>

    <p class="prose">An append-only log has huge advantages: writes are fast (just seek to end), it's crash-safe (no overwrites), and it provides a complete history. The downside: reads need to scan or have indexes.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">📝</span>
        <span>Append operations to the log</span>
      </div>
      <div class="playground-content">
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Log entries (offset 0 at top)</div>
          <div class="log-entries" id="log-entries"></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="step-btn" onclick="logAppend('SET x=10')">Append SET x=10</button>
          <button class="step-btn" onclick="logAppend('SET y=20')">Append SET y=20</button>
          <button class="step-btn" onclick="logAppend('DELETE x')">Append DELETE x</button>
          <button class="step-btn danger" onclick="injectCorruptEntry()">💥 Corrupt last entry</button>
        </div>
        <div style="margin-top:12px">
          <button class="step-btn" onclick="logCompaction()">🗜 Run compaction</button>
        </div>
        <div id="log-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Compaction</div>
      Over time, the log grows huge. <strong>Compaction</strong> reads the log and writes a new one with only the latest value for each key, discarding old entries.
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Filesystem Persistence</strong> — logs are just files, but the append-only pattern emerges from filesystem characteristics.
    </div>
    `;
      initAppendLog(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     22 — B-TREE SIMULATION
     Purpose: Show how databases index data
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "07",
    title: "B-trees — how databases find data fast",
    hook: "A B-tree lets you find any record among millions with just 3–4 disk reads.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">B-trees — how databases find data fast</h1>
    <p class="lesson-hook">A B-tree is a balanced tree that keeps data sorted and allows searches, insertions, and deletions in logarithmic time.</p>

    <p class="prose">Each node in a B-tree can have many children (not just two like binary trees). This keeps the tree shallow — a B-tree with 1 million keys might be only 3 levels deep.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🌳</span>
        <span>Search for a key in the B-tree</span>
      </div>
      <div class="playground-content">
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">B-tree (order 4)</div>
          <div class="btree-visual" id="btree"></div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <input type="text" id="btree-search" placeholder="Enter key (1-99)" style="padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg2);color:var(--text)">
          <button class="step-btn primary" onclick="btreeSearch()">🔍 Search</button>
          <button class="step-btn" onclick="btreeInsert()">➕ Insert</button>
          <button class="step-btn" onclick="btreeReset()">↺ Reset</button>
        </div>
        <div id="btree-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">B-tree properties</div>
      • All leaves at same depth<br/>
      • Nodes are kept at least half full<br/>
      • Each node holds keys and pointers to children<br/>
      • Ideal for disk storage (node size = disk block)
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Memory Addressing</strong> — pointers in the B-tree are like memory addresses, but they point to disk blocks instead of RAM.
    </div>
    `;
      initBTree(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     23 — TRANSACTIONS AND ISOLATION
     Purpose: Show ACID properties in action
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "08",
    title: "Transactions — all or nothing",
    hook: "A transaction either completes fully or has no effect at all — no partial updates.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Transactions — all or nothing</h1>
    <p class="lesson-hook">When you transfer money, you want both accounts to update, or neither. That's a transaction.</p>

    <p class="prose">ACID: <strong>Atomicity</strong> (all or nothing), <strong>Consistency</strong> (data valid), <strong>Isolation</strong> (concurrent transactions don't interfere), <strong>Durability</strong> (committed data survives crashes).</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">💰</span>
        <span>Run concurrent transfers</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Account A</div>
            <div class="big-stat" id="tx-acc-a">1000</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Account B</div>
            <div class="big-stat" id="tx-acc-b">1000</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Account C</div>
            <div class="big-stat" id="tx-acc-c">1000</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
          <button class="step-btn" onclick="txTransfer('a', 'b', 100)">Transfer A→B $100</button>
          <button class="step-btn" onclick="txTransfer('b', 'c', 50)">Transfer B→C $50</button>
          <button class="step-btn" onclick="txRunConcurrent()">⚡ Run both concurrently</button>
        </div>
        <div class="slider-row">
          <span>Isolation level</span>
          <select id="tx-isolation" onchange="updateIsolation()">
            <option value="read-uncommitted">Read Uncommitted (dirty reads)</option>
            <option value="read-committed" selected>Read Committed</option>
            <option value="repeatable-read">Repeatable Read</option>
            <option value="serializable">Serializable</option>
          </select>
        </div>
        <div id="tx-explain" class="outcome"></div>
        <div class="failure-controls" style="margin-top:12px">
          <button class="step-btn danger" onclick="injectCrash()">💥 Crash mid-transaction</button>
        </div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Isolation anomalies</div>
      <strong>Dirty read</strong>: read uncommitted data<br/>
      <strong>Non-repeatable read</strong>: same query returns different results<br/>
      <strong>Phantom read</strong>: new rows appear in subsequent queries
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Append-only Log</strong> — databases implement atomicity by writing changes to a log before applying them.
    </div>
    `;
      initTransactions(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     24 — CACHE INVALIDATION
     Purpose: Show the hardest problem in computer science
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "09",
    title: "Cache invalidation — the hard problem",
    hook: "There are only two hard things in CS: cache invalidation and naming things.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Cache invalidation — the hard problem</h1>
    <p class="lesson-hook">Caching is easy. Knowing when to throw cached data away is the hard part.</p>

    <p class="prose">If you cache a database query result, what happens when the underlying data changes? The cache becomes stale. You need a strategy to invalidate it.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🧹</span>
        <span>See different invalidation strategies</span>
      </div>
      <div class="playground-content">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Database</div>
            <div id="inv-db"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Cache contents</div>
            <div id="inv-cache"></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
          <button class="step-btn" onclick="invQuery('user:1')">Query user:1</button>
          <button class="step-btn" onclick="invUpdate('user:1', 'New Name')">Update user:1</button>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Invalidation strategy</div>
          <div style="display:flex;gap:8px">
            <label><input type="radio" name="inv-strat" value="ttl" checked onchange="invStratChange()"> TTL (30s)</label>
            <label><input type="radio" name="inv-strat" value="write-through" onchange="invStratChange()"> Write-through</label>
            <label><input type="radio" name="inv-strat" value="lazy" onchange="invStratChange()"> Lazy (check on read)</label>
          </div>
        </div>
        <div id="inv-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Invalidation strategies</div>
      <strong>TTL</strong>: expire after time<br/>
      <strong>Write-through</strong>: update cache when writing to DB<br/>
      <strong>Write-back</strong>: update cache, write to DB later<br/>
      <strong>Lazy</strong>: check if cache is stale on each read
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Cache Locality</strong> — same concept, now distributed across servers instead of inside the CPU.
    </div>
    `;
      initCacheInvalidation(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     25 — REPLICATION
     Purpose: Show how data is copied across nodes
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "10",
    title: "Replication — copies of your data",
    hook: "If you have only one copy of your data and it fails, you lose everything. Replication makes copies.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Replication — copies of your data</h1>
    <p class="lesson-hook">Replication means keeping the same data on multiple servers. This provides fault tolerance and can improve read performance.</p>

    <p class="prose">In <strong>leader-based replication</strong>, one node (the leader) handles writes and replicates changes to followers. Reads can go to any follower.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">📋</span>
        <span>Watch replication in action</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px;justify-content:center">
          <div class="replica-node leader" id="rep-leader">
            <div>Leader</div>
            <div class="replica-data" id="rep-leader-data">x=5</div>
          </div>
          <div class="replica-node" id="rep-f1">
            <div>Follower 1</div>
            <div class="replica-data" id="rep-f1-data">x=5</div>
          </div>
          <div class="replica-node" id="rep-f2">
            <div>Follower 2</div>
            <div class="replica-data" id="rep-f2-data">x=5</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <button class="step-btn primary" onclick="repWrite()">✏️ Write x=10</button>
          <button class="step-btn" onclick="repStep()">⏯ Replicate step</button>
          <button class="step-btn danger" onclick="repFailFollower()">💥 Fail follower</button>
        </div>
        <div id="rep-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Replication modes</div>
      <strong>Synchronous</strong>: write waits for all followers to confirm<br/>
      <strong>Asynchronous</strong>: write returns immediately, followers lag<br/>
      <strong>Semi-synchronous</strong>: wait for at least one follower
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Append-only Log</strong> — replication streams are just logs shipped from leader to followers.
    </div>
    `;
      initReplication(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     26 — CONSENSUS BASICS
     Purpose: Show how nodes agree on a value
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "11",
    title: "Consensus — getting everyone to agree",
    hook: "In a distributed system, nodes need to agree on things: who is the leader, what the value is, etc.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Consensus — getting everyone to agree</h1>
    <p class="lesson-hook">Consensus algorithms (Paxos, Raft) let a group of nodes agree on a value even if some nodes fail.</p>

    <p class="prose">The classic consensus problem: three nodes need to agree on a value. Some nodes may crash or be slow. The algorithm must still reach agreement.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🤝</span>
        <span>Run a simple consensus round</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px;justify-content:center">
          <div class="consensus-node" id="cons-node1">Node 1</div>
          <div class="consensus-node" id="cons-node2">Node 2</div>
          <div class="consensus-node" id="cons-node3">Node 3</div>
          <div class="consensus-node" id="cons-node4">Node 4</div>
          <div class="consensus-node" id="cons-node5">Node 5</div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Proposed value: <span id="cons-proposal">42</span></div>
          <input type="range" min="1" max="100" value="42" id="cons-value" oninput="updateConsValue()">
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <button class="step-btn primary" onclick="consensusRun()">▶ Run Paxos</button>
          <button class="step-btn" onclick="consensusReset()">↺ Reset</button>
          <button class="step-btn danger" onclick="failNode(2)">💥 Fail node 2</button>
        </div>
        <div id="cons-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Consensus requirements</div>
      • Agreement: all non-faulty nodes agree on same value<br/>
      • Integrity: no node decides twice<br/>
      • Validity: the value was proposed by some node<br/>
      • Termination: all non-faulty nodes eventually decide
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Processes and Threads</strong> — each node is a process; consensus coordinates them across network boundaries.
    </div>
    `;
      initConsensus(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     27 — PARTITION TOLERANCE
     Purpose: Show system behavior during network splits
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "12",
    title: "Partition tolerance — when the network breaks",
    hook: "What happens when some servers can't talk to others? That's a network partition.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Partition tolerance — when the network breaks</h1>
    <p class="lesson-hook">In distributed systems, the network can fail. Messages can be delayed or dropped. This is a <strong>partition</strong>.</p>

    <p class="prose">The CAP theorem says you can't have all three: Consistency, Availability, and Partition tolerance. When a partition happens, you must choose between consistency and availability.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">✂️</span>
        <span>See what happens during a partition</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px;justify-content:center">
          <div class="partition-side" id="part-side-a">
            <div class="partition-node">Node A1</div>
            <div class="partition-node">Node A2</div>
          </div>
          <div class="partition-gap" id="partition-line">
            🌐
          </div>
          <div class="partition-side" id="part-side-b">
            <div class="partition-node">Node B1</div>
            <div class="partition-node">Node B2</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <button class="step-btn" onclick="partitionWrite('a', 'x=10')">Write x=10 to side A</button>
          <button class="step-btn" onclick="partitionWrite('b', 'x=20')">Write x=20 to side B</button>
          <button class="step-btn danger" onclick="togglePartition()">✂️ Toggle partition</button>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Choose strategy</div>
          <div style="display:flex;gap:8px">
            <label><input type="radio" name="cap-choice" value="cp" checked onchange="capChange()"> CP (Consistency)</label>
            <label><input type="radio" name="cap-choice" value="ap" onchange="capChange()"> AP (Availability)</label>
          </div>
        </div>
        <div id="part-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">CAP tradeoff</div>
      <strong>CP (Consistency + Partition tolerance)</strong>: during partition, reject writes or become unavailable to keep data consistent.<br/>
      <strong>AP (Availability + Partition tolerance)</strong>: accept writes on both sides, deal with conflicts later.
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>TCP Lifecycle</strong> — partitions happen when TCP connections fail or time out.
    </div>
    `;
      initPartition(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     28 — BACKPRESSURE
     Purpose: Show handling overload
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "13",
    title: "Backpressure — handling overload",
    hook: "When a system can't keep up, it needs to tell its clients to slow down.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Backpressure — handling overload</h1>
    <p class="lesson-hook">If requests arrive faster than a server can process them, something has to give. Backpressure is the mechanism for slowing down the sender.</p>

    <p class="prose">Without backpressure, queues grow unbounded, memory fills up, and the system crashes. With backpressure, the server says "stop sending" (or drops requests) until it catches up.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🌊</span>
        <span>Watch backpressure in action</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px;align-items:center">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Request rate</div>
            <div class="slider-row">
              <input type="range" min="1" max="20" value="10" id="bp-rate" oninput="updateBPRate()">
              <span id="bp-rate-val">10</span>/s
            </div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Process rate</div>
            <div class="slider-row">
              <input type="range" min="1" max="20" value="8" id="bp-process" oninput="updateBPProcess()">
              <span id="bp-process-val">8</span>/s
            </div>
          </div>
        </div>
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Queue size</div>
            <div class="big-stat" id="bp-queue">0</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Dropped</div>
            <div class="big-stat" id="bp-dropped">0</div>
          </div>
        </div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="bpStart()">▶ Start simulation</button>
          <button class="step-btn" onclick="bpStop()">⏸ Stop</button>
          <button class="step-btn" onclick="bpReset()">↺ Reset</button>
        </div>
        <div style="margin-top:12px">
          <label><input type="checkbox" id="bp-backpressure" checked onchange="bpToggleBackpressure()"> Enable backpressure</label>
        </div>
        <div id="bp-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Backpressure mechanisms</div>
      • TCP flow control (receiver window)<br/>
      • HTTP 429 Too Many Requests<br/>
      • Queue with limited size (drop when full)<br/>
      • Load shedding (prioritize important requests)
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>TCP Lifecycle</strong> — TCP itself has built-in backpressure through window sizes.
    </div>
    `;
      initBackpressure(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     29 — RETRIES AND IDEMPOTENCY
     Purpose: Show safe retry semantics
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "14",
    title: "Retries and idempotency",
    hook: "If a request fails, can you safely retry it? Only if it's idempotent.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Retries and idempotency</h1>
    <p class="lesson-hook">An operation is <strong>idempotent</strong> if doing it multiple times has the same effect as doing it once.</p>

    <p class="prose">In distributed systems, network failures mean you often don't know if a request succeeded. Idempotency lets you safely retry. GET is idempotent. DELETE is idempotent. POST (create) is not.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔄</span>
        <span>See what happens with retries</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Operation</div>
            <div style="display:flex;gap:4px">
              <button class="step-btn" onclick="retryOp('get')">GET /user/1</button>
              <button class="step-btn" onclick="retryOp('delete')">DELETE /user/1</button>
              <button class="step-btn" onclick="retryOp('post')">POST /user</button>
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Server state</div>
            <div id="retry-state" class="state-box">users: {1: "Alice"}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Request log</div>
            <div id="retry-log" class="log-box"></div>
          </div>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Failure simulation</div>
          <div style="display:flex;gap:8px">
            <button class="step-btn" onclick="retryInjectTimeout()">⏱ Simulate timeout</button>
            <button class="step-btn danger" onclick="retryWithIdempotencyKey()">🔑 Use idempotency key</button>
          </div>
        </div>
        <div id="retry-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">Idempotency techniques</div>
      • Use idempotency keys (client generates unique ID, server dedupes)<br/>
      • Make operations naturally idempotent (SET vs INCREMENT)<br/>
      • Store results and return cached for retries
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on <strong>Race Conditions</strong> — retries without idempotency can cause duplicate writes, which are a form of race condition.
    </div>
    `;
      initRetries(el);
    },
  },

  /* ────────────────────────────────────────────────────────────────
     30 — OBSERVABILITY (LOGS, METRICS, TRACING)
     Purpose: Show how to understand running systems
  ──────────────────────────────────────────────────────────────── */
  {
    track: "Backend",
    num: "15",
    title: "Observability — understanding running systems",
    hook: "You can't fix what you can't see. Logs, metrics, and traces tell you what's happening.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Observability — understanding running systems</h1>
    <p class="lesson-hook">Logs tell you what happened. Metrics tell you how much. Traces tell you where time was spent.</p>

    <p class="prose"><strong>Logs</strong>: discrete events with timestamps. <strong>Metrics</strong>: aggregated measurements over time. <strong>Traces</strong>: end-to-end request paths through distributed services.</p>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔍</span>
        <span>Explore observability data</span>
      </div>
      <div class="playground-content">
        <div style="display:flex;gap:16px;margin-bottom:16px">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Generate load</div>
            <button class="step-btn primary" onclick="obsGenerateRequest()">📤 Send request</button>
            <button class="step-btn" onclick="obsGenerateError()">💥 Cause error</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Logs</div>
            <div class="obs-panel" id="obs-logs"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Metrics</div>
            <div class="obs-panel" id="obs-metrics">
              <div>Requests: <span id="obs-req-count">0</span></div>
              <div>Errors: <span id="obs-err-count">0</span></div>
              <div>Avg latency: <span id="obs-latency">0</span>ms</div>
              <div class="sparkline" id="obs-spark"></div>
            </div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Traces</div>
            <div class="obs-panel" id="obs-traces"></div>
          </div>
        </div>
        <div class="step-controls">
          <button class="step-btn" onclick="obsReset()">↺ Clear all</button>
        </div>
        <div id="obs-explain" class="outcome"></div>
      </div>
    </div>

    <div class="callout info">
      <div class="callout-title">The three pillars</div>
      <strong>Logs</strong>: detailed, but expensive to store and search<br/>
      <strong>Metrics</strong>: cheap, good for alerting, but lack context<br/>
      <strong>Traces</strong>: show request flow across services, high overhead
    </div>

    <div class="callout success">
      <div class="callout-title">Dependency on Track 1</div>
      This builds on everything — observability is how we understand all the previous layers in production.
    </div>
    `;
      initObservability(el);
    },
  },
]; // end LESSONS (30 total: 15 Hardware + 15 Backend)

/* ════════════════════════════════════════════════════════════════
   GLOBAL STATE & HELPERS
════════════════════════════════════════════════════════════════ */
let currentIdx = 0;
const done = new Set();

function badge(txt) {
  return `<div class="track-badge"><span class="track-badge-dot"></span>${txt}</div>`;
}
function qs(sel, ctx = document) {
  return ctx.querySelector(sel);
}
function mk(tag, cls = "") {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}
function log(boxId, msg, cls = "") {
  const b = document.getElementById(boxId);
  if (!b) return;
  const line = document.createElement("div");
  line.className = cls ? "l-" + cls : "l-dim";
  line.textContent = msg;
  b.appendChild(line);
  b.scrollTop = b.scrollHeight;
}

/* ════════════════════════════════════════════════════════════════
   ROUTER & NAVIGATION
════════════════════════════════════════════════════════════════ */
function goTo(idx) {
  if (idx < 0 || idx >= LESSONS.length) return;
  if (currentIdx !== idx) done.add(currentIdx);
  currentIdx = idx;
  renderLesson();
  buildNav();
  closeSidebar();
  window.scrollTo(0, 0);
}
function nextLesson() {
  goTo(currentIdx + 1);
}
function prevLesson() {
  goTo(currentIdx - 1);
}

function renderLesson() {
  const l = LESSONS[currentIdx];
  const main = document.getElementById("main");
  main.innerHTML = "";
  l.render(main);

  const footer = document.getElementById("lesson-footer");
  const btnP = document.getElementById("btn-prev");
  const btnN = document.getElementById("btn-next");
  const prog = document.getElementById("progress-text");

  btnP.disabled = currentIdx === 0;
  btnN.disabled = currentIdx === LESSONS.length - 1;
  btnN.textContent = currentIdx === LESSONS.length - 1 ? "Finish ✓" : "Next →";
  prog.textContent = `${currentIdx + 1} / ${LESSONS.length}`;
}

function buildNav() {
  const t1 = document.getElementById("lesson-nav-t1");
  const t2 = document.getElementById("lesson-nav-t2");
  t1.innerHTML = "";
  t2.innerHTML = "";

  LESSONS.forEach((l, i) => {
    const btn = document.createElement("button");
    btn.className =
      "lesson-item" +
      (i === currentIdx ? " active" : done.has(i) ? " done" : "");
    btn.innerHTML = `<span class="lesson-num">${done.has(i) ? "✓" : l.num}</span>${l.title}`;
    btn.onclick = () => goTo(i);
    (l.track === "Hardware" ? t1 : t2).appendChild(btn);
  });
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

/* ════════════════════════════════════════════════════════════════
   LESSON 01 — BITS (with failure injection)
════════════════════════════════════════════════════════════════ */
function initByte(root) {
  const bits = [1, 0, 1, 0, 0, 1, 0, 1];
  const row = qs("#byte-row", root);
  const vals = qs("#byte-vals", root);
  let noise = false;

  function render() {
    row.innerHTML = bits
      .map(
        (b, i) =>
          `<button class="bit-btn ${b ? "b1" : "b0"}" onclick="L01_flip(${i})">${b}</button>`,
      )
      .join("");
    const dec = bits.reduce((a, b, i) => a + (b << (7 - i)), 0);
    vals.innerHTML = `
      <div class="val-item"><span class="val-label">Binary</span><span class="val-num">${bits.join("")}</span></div>
      <div class="val-item"><span class="val-label">Decimal</span><span class="val-num">${dec}</span></div>
      <div class="val-item"><span class="val-label">Hex</span><span class="val-num">0x${dec.toString(16).toUpperCase().padStart(2, "0")}</span></div>
      <div class="val-item"><span class="val-label">Char</span><span class="val-num">${dec >= 32 && dec < 127 ? String.fromCharCode(dec) : "—"}</span></div>
    `;
    const status = qs("#noise-status", root);
    if (status) {
      status.textContent = noise ? "⚠️ Signal unstable!" : "Stable signal";
      status.style.color = noise ? "var(--red)" : "var(--muted)";
    }
  }
  window.L01_flip = (i) => {
    if (noise && Math.random() < 0.3) {
      bits[i] = Math.random() < 0.5 ? 0 : 1; // random bit during noise
    } else {
      bits[i] ^= 1;
    }
    render();
  };
  window.L01_injectNoise = () => {
    noise = !noise;
    render();
  };
  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 02 — BINARY NUMBERS
════════════════════════════════════════════════════════════════ */
function initBinary(root) {
  const bits = [0, 0, 1, 0, 1, 0, 1, 0];
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const wRow = qs("#bin-weights", root);
  const bRow = qs("#bin-row", root);
  const vals = qs("#bin-vals", root);
  const expl = qs("#bin-explain", root);

  function render() {
    const dec = bits.reduce((a, b, i) => a + b * weights[i], 0);
    wRow.innerHTML = weights
      .map(
        (w, i) =>
          `<div style="width:44px;text-align:center;font-family:var(--mono);font-size:11px;color:${bits[i] ? "var(--accent)" : "var(--light)"};font-weight:${bits[i] ? "700" : "400"}">${w}</div>`,
      )
      .join("");
    bRow.innerHTML = bits
      .map(
        (b, i) =>
          `<button class="bit-btn ${b ? "b1" : "b0"}" onclick="L02_flip(${i})">${b}</button>`,
      )
      .join("");
    vals.innerHTML = `
      <div class="val-item"><span class="val-label">Decimal value</span><span class="val-num" style="font-size:24px">${dec}</span></div>
      <div class="val-item"><span class="val-label">Active positions</span><span class="val-num">${
        bits
          .map((b, i) => (b ? weights[i] : null))
          .filter(Boolean)
          .join(" + ") || "0"
      }</span></div>
    `;
    const parts = bits.map((b, i) => (b ? weights[i] : null)).filter(Boolean);
    expl.textContent = parts.length
      ? `${parts.join(" + ")} = ${dec}`
      : `All bits are 0 — the value is 0`;
  }
  window.L02_flip = (i) => {
    bits[i] ^= 1;
    render();
  };
  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 03 — LOGIC GATES (with failure injection)
════════════════════════════════════════════════════════════════ */
function initGates(root) {
  let gA = 0,
    gB = 0;
  let stuckFault = null; // 'a', 'b', or null
  let stuckValue = 0;

  const gates = [
    { name: "AND", fn: (a, b) => a & b, desc: "Both must be 1" },
    { name: "OR", fn: (a, b) => a | b, desc: "At least one is 1" },
    { name: "NOT", fn: (a, _) => (a ? 0 : 1), desc: "Flips A (ignores B)" },
    { name: "XOR", fn: (a, b) => a ^ b, desc: "Exactly one is 1" },
    { name: "NAND", fn: (a, b) => (a & b ? 0 : 1), desc: "NOT AND" },
    { name: "NOR", fn: (a, b) => (a | b ? 0 : 1), desc: "NOT OR" },
  ];

  function getA() {
    if (stuckFault === "a") return stuckValue;
    return gA;
  }
  function getB() {
    if (stuckFault === "b") return stuckValue;
    return gB;
  }

  function render() {
    const a = getA();
    const b = getB();

    qs("#ga", root).className = `mini-bit ${gA ? "b1" : "b0"}`;
    qs("#ga", root).textContent = gA + (stuckFault === "a" ? "*" : "");
    qs("#gb", root).className = `mini-bit ${gB ? "b1" : "b0"}`;
    qs("#gb", root).textContent = gB + (stuckFault === "b" ? "*" : "");

    qs("#gate-grid", root).innerHTML = gates
      .map((g) => {
        const out = g.fn(a, b);
        return `<div class="gate-card">
        <div class="gate-name">${g.name}</div>
        <div style="font-size:11px;color:var(--muted)">${g.desc}</div>
        <div class="gate-output">
          <span style="font-size:12px;color:var(--muted)">A=${a} B=${b} →</span>
          <span class="gate-result ${out ? "r1" : "r0"}">${out}</span>
          <span class="badge ${out ? "ok" : "err"}" style="font-size:11px">${out ? "ON" : "OFF"}</span>
        </div>
      </div>`;
      })
      .join("");

    const status = qs("#gate-failure-status", root);
    if (stuckFault) {
      status.textContent = `⚠️ Stuck-at fault: input ${stuckFault} stuck at ${stuckValue}`;
    } else {
      status.textContent = "";
    }
  }
  window.flipGate = (x) => {
    if (x === "a") gA ^= 1;
    else gB ^= 1;
    render();
  };
  window.injectGateFailure = () => {
    stuckFault = Math.random() < 0.5 ? "a" : "b";
    stuckValue = Math.random() < 0.5 ? 0 : 1;
    render();
  };
  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 04 — LATCHES AND CLOCK CYCLES
════════════════════════════════════════════════════════════════ */
function initLatch(root) {
  let s = 0,
    r = 0;
  let q = 0,
    nq = 1; // SR latch state
  let step = 0;

  function render() {
    qs("#latch-s", root).className = `mini-bit ${s ? "b1" : "b0"}`;
    qs("#latch-s", root).textContent = s;
    qs("#latch-r", root).className = `mini-bit ${r ? "b1" : "b0"}`;
    qs("#latch-r", root).textContent = r;
    qs("#latch-q", root).className = `mini-bit ${q ? "b1" : "b0"}`;
    qs("#latch-q", root).textContent = q;
    qs("#latch-nq", root).className = `mini-bit ${nq ? "b1" : "b0"}`;
    qs("#latch-nq", root).textContent = nq;
  }

  window.toggleLatch = (input) => {
    if (input === "s") s ^= 1;
    else r ^= 1;
    render();
  };
  window.latchStep = () => {
    // Apply inputs on clock edge
    if (s && !r) {
      q = 1;
      nq = 0;
    } else if (!s && r) {
      q = 0;
      nq = 1;
    } else if (s && r) {
      q = 0;
      nq = 0;
    } // invalid state
    // else keep state
    step++;
    qs("#latch-explain", root).textContent =
      `Clock cycle ${step}: applied S=${s}, R=${r}`;
    render();
  };
  window.clockPulse = () => {
    qs("#latch-explain", root).textContent =
      `Clock pulse: latching inputs at rising edge`;
    render();
  };
  window.latchReset = () => {
    s = 0;
    r = 0;
    q = 0;
    nq = 1;
    step = 0;
    qs("#latch-explain", root).textContent = "";
    render();
  };
  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 05 — REGISTERS AND DATA PATHS
════════════════════════════════════════════════════════════════ */
function initRegisters(root) {
  const regs = [
    [0, 0, 0, 0], // R0
    [0, 0, 0, 0], // R1
    [0, 0, 0, 0], // R2
    [0, 0, 0, 0], // R3
  ];
  const dataIn = [1, 0, 1, 0];
  let writeEnable = 0;

  function renderRegBits(reg, id) {
    const el = qs(id, root);
    if (!el) return;
    el.innerHTML = reg
      .map((b, i) => `<span class="reg-bit ${b ? "b1" : "b0"}">${b}</span>`)
      .join("");
  }

  function renderDataIn() {
    const el = qs("#reg-data-in", root);
    if (!el) return;
    el.innerHTML = dataIn
      .map(
        (b, i) =>
          `<span class="reg-bit ${b ? "b1" : "b0"}" onclick="toggleDataIn(${i})">${b}</span>`,
      )
      .join("");
  }

  function render() {
    renderDataIn();
    regs.forEach((r, i) => renderRegBits(r, `#reg-r${i}`));
    qs("#reg-we", root).className = `mini-bit ${writeEnable ? "b1" : "b0"}`;
    qs("#reg-we", root).textContent = writeEnable;
  }

  window.toggleRegWE = () => {
    writeEnable ^= 1;
    render();
  };
  window.toggleDataIn = (bit) => {
    dataIn[bit] ^= 1;
    render();
  };
  window.clockRegisters = () => {
    if (writeEnable) {
      // Write dataIn to R0 on clock edge
      regs[0] = [...dataIn];
      qs("#reg-explain", root).textContent =
        `Clock: wrote ${dataIn.join("")} to R0`;
    } else {
      qs("#reg-explain", root).textContent =
        `Clock: no write (write enable is 0)`;
    }
    render();
  };
  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 06 — ALU OPERATIONS
════════════════════════════════════════════════════════════════ */
function initALU(root) {
  let a = [0, 0, 1, 1]; // 3
  let b = [0, 0, 1, 0]; // 2
  let result = [0, 0, 0, 0];
  let flags = { zero: 0, carry: 0, overflow: 0 };

  function renderBits(arr, id) {
    const el = qs(id, root);
    if (!el) return;
    el.innerHTML = arr
      .map(
        (b, i) =>
          `<span class="reg-bit ${b ? "b1" : "b0"}" onclick="toggleALUBit('${id}', ${i})">${b}</span>`,
      )
      .join("");
  }

  function render() {
    renderBits(a, "#alu-a");
    renderBits(b, "#alu-b");
    renderBits(result, "#alu-result");
    qs("#flag-zero", root).textContent = `Z=${flags.zero}`;
    qs("#flag-zero", root).className = `flag ${flags.zero ? "active" : ""}`;
    qs("#flag-carry", root).textContent = `C=${flags.carry}`;
    qs("#flag-carry", root).className = `flag ${flags.carry ? "active" : ""}`;
    qs("#flag-overflow", root).textContent = `V=${flags.overflow}`;
    qs("#flag-overflow", root).className =
      `flag ${flags.overflow ? "active" : ""}`;
  }

  window.toggleALUBit = (id, bit) => {
    if (id === "#alu-a") a[bit] ^= 1;
    if (id === "#alu-b") b[bit] ^= 1;
    render();
  };

  function bitsToNum(bits) {
    return bits.reduce((acc, b, i) => acc + (b << (3 - i)), 0);
  }

  function numToBits(num, size = 4) {
    const bits = [];
    for (let i = 0; i < size; i++) {
      bits.unshift(num & 1);
      num >>= 1;
    }
    return bits;
  }

  window.aluOp = (op) => {
    const aNum = bitsToNum(a);
    const bNum = bitsToNum(b);
    let resNum = 0;
    flags.carry = 0;
    flags.overflow = 0;

    switch (op) {
      case "add":
        resNum = aNum + bNum;
        flags.carry = resNum > 15 ? 1 : 0;
        flags.overflow = aNum > 7 && bNum > 7 && resNum < 16 ? 0 : 1; // simplified
        break;
      case "sub":
        resNum = aNum - bNum;
        if (resNum < 0) {
          resNum += 16;
          flags.carry = 1;
        }
        break;
      case "and":
        resNum = aNum & bNum;
        break;
      case "or":
        resNum = aNum | bNum;
        break;
      case "xor":
        resNum = aNum ^ bNum;
        break;
    }
    result = numToBits(resNum & 15);
    flags.zero = resNum === 0 ? 1 : 0;
    qs("#alu-explain", root).textContent =
      `${op.toUpperCase()}: ${aNum} ${op} ${bNum} = ${resNum}`;
    render();
  };
  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 07 — INSTRUCTION ENCODING
════════════════════════════════════════════════════════════════ */
function initEncoding(root) {
  const opcode = [0, 0, 0, 0];
  const operand = [0, 0, 0, 0];

  function renderBits(arr, id, isOpcode) {
    const el = qs(id, root);
    if (!el) return;
    el.innerHTML = arr
      .map(
        (b, i) =>
          `<span class="reg-bit ${b ? "b1" : "b0"}" onclick="toggleEncBit('${isOpcode ? "op" : "opnd"}', ${i})">${b}</span>`,
      )
      .join("");
  }

  function renderByte() {
    const byte = [...opcode, ...operand];
    const el = qs("#enc-byte", root);
    if (!el) return;
    el.innerHTML = byte
      .map((b, i) => `<span class="reg-bit ${b ? "b1" : "b0"}">${b}</span>`)
      .join("");
  }

  function renderExplain() {
    const opVal = bitsToNum(opcode);
    const opndVal = bitsToNum(operand);
    const opNames = [
      "ADD",
      "LOAD",
      "STORE",
      "JUMP",
      "CMP",
      "BLE",
      "MOV",
      "???",
    ];
    const opName = opVal < opNames.length ? opNames[opVal] : "???";
    qs("#enc-explain", root).textContent =
      `Instruction: ${opName} with operand ${opndVal} (byte: ${opVal.toString(2).padStart(4, "0")} ${opndVal.toString(2).padStart(4, "0")})`;
  }

  function bitsToNum(bits) {
    return bits.reduce((acc, b, i) => acc + (b << (3 - i)), 0);
  }

  window.toggleEncBit = (type, idx) => {
    if (type === "op") opcode[idx] ^= 1;
    else operand[idx] ^= 1;
    renderBits(opcode, "#enc-opcode", true);
    renderBits(operand, "#enc-operand", false);
    renderByte();
    renderExplain();
  };

  window.encodePreset = (type) => {
    switch (type) {
      case "add":
        opcode[0] = 0;
        opcode[1] = 0;
        opcode[2] = 0;
        opcode[3] = 0; // 0 = ADD
        operand[0] = 0;
        operand[1] = 0;
        operand[2] = 1;
        operand[3] = 0; // 2
        break;
      case "load":
        opcode[0] = 0;
        opcode[1] = 0;
        opcode[2] = 0;
        opcode[3] = 1; // 1 = LOAD
        operand[0] = 0;
        operand[1] = 0;
        operand[2] = 0;
        operand[3] = 1; // 1
        break;
      case "jump":
        opcode[0] = 0;
        opcode[1] = 0;
        opcode[2] = 1;
        opcode[3] = 1; // 3 = JUMP
        operand[0] = 0;
        operand[1] = 1;
        operand[2] = 0;
        operand[3] = 1; // 5
        break;
    }
    renderBits(opcode, "#enc-opcode", true);
    renderBits(operand, "#enc-operand", false);
    renderByte();
    renderExplain();
  };

  renderBits(opcode, "#enc-opcode", true);
  renderBits(operand, "#enc-operand", false);
  renderByte();
  renderExplain();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 08 — CPU FETCH-DECODE-EXECUTE (with HALT injection)
════════════════════════════════════════════════════════════════ */
function initCPU(root) {
  const prog = [
    {
      asm: "MOV R0, 5",
      desc: "Load the number 5 into register R0.",
      op: (r) => {
        r[0] = 5;
      },
    },
    {
      asm: "MOV R1, 3",
      desc: "Load the number 3 into register R1.",
      op: (r) => {
        r[1] = 3;
      },
    },
    {
      asm: "ADD R2, R0+R1",
      desc: "Add R0 and R1 together, store result in R2.",
      op: (r) => {
        r[2] = r[0] + r[1];
      },
    },
    {
      asm: "MOV R3, R2",
      desc: "Copy the result from R2 into R3.",
      op: (r) => {
        r[3] = r[2];
      },
    },
  ];
  let pc = 0,
    regs = [0, 0, 0, 0],
    phase = 0;
  let halted = false;
  const phases = ["fetch", "decode", "exec"];

  function renderRegs(prevR) {
    qs("#cpu-regs", root).innerHTML = regs
      .map(
        (v, i) =>
          `<div class="register-row">
        <span class="reg-label">R${i}</span>
        <span class="reg-val${prevR && prevR[i] !== v ? " changed" : ""}">${v}</span>
      </div>`,
      )
      .join("");
  }
  function renderProg() {
    qs("#cpu-program", root).innerHTML = prog
      .map(
        (p, i) =>
          `<div style="padding:2px 8px;border-radius:5px;background:${i === pc ? "var(--accent-bg)" : "transparent"};color:${i < pc ? "var(--light)" : i === pc ? "var(--accent)" : "var(--text)"};font-weight:${i === pc ? "600" : "400"}">${i === pc ? "▶ " : ""}<span>${p.asm}</span></div>`,
      )
      .join("");
  }
  function renderPhase(p) {
    ["ph-fetch", "ph-decode", "ph-exec", "ph-done"].forEach((id, i) => {
      const el = qs("#" + id, root);
      if (!el) return;
      el.className =
        "phase-step" + (i < p ? " done" : i === p ? " active" : "");
    });
  }

  window.cpuStep = () => {
    if (halted) {
      qs("#cpu-explain", root).textContent =
        "⛔ CPU HALTED - inject a reset or remove HALT";
      return;
    }
    if (pc >= prog.length) {
      qs("#cpu-explain", root).textContent =
        "Program finished! All 4 instructions executed.";
      renderPhase(3);
      return;
    }
    const prev = [...regs];
    const phaseNames = [
      "Fetching instruction from memory…",
      "Decoding: figuring out what it means…",
      "Executing: performing the operation.",
    ];
    const phIdx = phase % 3;
    if (phIdx === 2) {
      prog[pc].op(regs);
      phase = 0;
      pc++;
    } else phase++;
    renderPhase(phIdx);
    renderProg();
    renderRegs(prev);
    qs("#cpu-explain", root).className = "outcome" + (phIdx === 2 ? " ok" : "");
    qs("#cpu-explain", root).textContent =
      pc <= prog.length
        ? phIdx === 2 && pc <= prog.length
          ? `✓ Executed: ${prog[pc - 1]?.asm || ""} — ${prog[pc - 1]?.desc || ""}`
          : phaseNames[phIdx]
        : "Done!";
    if (pc === prog.length && phIdx === 2) renderPhase(3);
  };

  window.injectHalt = () => {
    halted = true;
    qs("#cpu-explain", root).className = "outcome err";
    qs("#cpu-explain", root).textContent =
      "⛔ HALT instruction injected! CPU stopped.";
  };

  window.cpuReset = () => {
    pc = 0;
    regs = [0, 0, 0, 0];
    phase = 0;
    halted = false;
    renderProg();
    renderRegs(null);
    renderPhase(-1);
    qs("#cpu-explain", root).className = "outcome";
    qs("#cpu-explain", root).textContent = "";
  };
  renderProg();
  renderRegs(null);
  renderPhase(-1);
}

/* ════════════════════════════════════════════════════════════════
   LESSON 09 — MEMORY ADDRESSING
════════════════════════════════════════════════════════════════ */
function initMemoryAddressing(root) {
  const memory = new Array(16).fill(0).map((_, i) => i * 2); // Fill with some data
  let address = 5;
  let dataIn = [0, 0, 0, 0, 0, 0, 0, 0]; // 8-bit data

  function renderMemGrid() {
    const grid = qs("#mem-grid", root);
    grid.innerHTML = memory
      .map((val, addr) => {
        const isSelected = addr === address;
        return `<div class="mem-cell${isSelected ? " selected" : ""}" onclick="memSelectAddr(${addr})">
          <span class="mem-addr">${addr.toString(16).padStart(2, "0")}</span>
          <span class="mem-val">${val.toString(16).padStart(2, "0")}</span>
        </div>`;
      })
      .join("");
  }

  function renderDataIn() {
    const el = qs("#mem-data-in", root);
    if (!el) return;
    el.innerHTML = dataIn
      .map(
        (b, i) =>
          `<span class="reg-bit ${b ? "b1" : "b0"}" onclick="toggleMemDataBit(${i})">${b}</span>`,
      )
      .join("");
  }

  function render() {
    qs("#mem-addr-val", root).textContent = address;
    renderMemGrid();
    renderDataIn();
    const val = memory[address];
    qs("#mem-access-explain", root).textContent =
      `Address ${address} (0x${address.toString(16).padStart(2, "0")}) contains ${val} (0x${val.toString(16).padStart(2, "0")})`;
  }

  window.updateMemAddr = () => {
    address = parseInt(qs("#mem-addr-slider", root).value);
    render();
  };

  window.toggleMemDataBit = (bit) => {
    dataIn[bit] ^= 1;
    renderDataIn();
  };

  window.memSelectAddr = (addr) => {
    address = addr;
    qs("#mem-addr-slider", root).value = addr;
    qs("#mem-addr-val", root).textContent = addr;
    render();
  };

  window.memWrite = () => {
    const dataVal = dataIn.reduce((acc, b, i) => acc + (b << (7 - i)), 0);
    memory[address] = dataVal;
    qs("#mem-access-explain", root).textContent =
      `Wrote ${dataVal} (0x${dataVal.toString(16).padStart(2, "0")}) to address ${address}`;
    renderMemGrid();
  };

  // Initialize dataIn with some default value
  dataIn = [0, 0, 0, 0, 0, 1, 0, 1]; // 5
  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 10 — STACK VS HEAP
════════════════════════════════════════════════════════════════ */
function initStackHeap(root) {
  let stack = [];
  let heap = [];
  let nextHeapId = 1;
  let overflow = false;

  function renderStack() {
    const el = qs("#stack-visual", root);
    if (!el) return;
    if (overflow) {
      el.innerHTML =
        '<div class="stack-error">💥 STACK OVERFLOW! Memory corrupted.</div>';
      return;
    }
    if (stack.length === 0) {
      el.innerHTML = '<div class="stack-empty">(empty stack)</div>';
      return;
    }
    el.innerHTML = stack
      .map(
        (frame, i) => `
      <div class="stack-frame${i === stack.length - 1 ? " top" : ""}">
        <span class="stack-frame-name">${frame.name}</span>
        <span class="stack-frame-vars">${frame.vars.join(", ")}</span>
      </div>
    `,
      )
      .reverse()
      .join("");
  }

  function renderHeap() {
    const el = qs("#heap-visual", root);
    if (!el) return;
    if (heap.length === 0) {
      el.innerHTML = '<div class="heap-empty">(no heap allocations)</div>';
      return;
    }
    el.innerHTML = heap
      .map(
        (block) => `
      <div class="heap-block">
        <span class="heap-block-id">#${block.id}</span>
        <span class="heap-block-data">${block.data}</span>
      </div>
    `,
      )
      .join("");
  }

  window.callFunction = () => {
    if (overflow) return;
    const funcName = [
      "main()",
      "calculate()",
      "process()",
      "render()",
      "handleRequest()",
    ][stack.length % 5];
    const localVars = ["x", "y", "temp", "result", "count"].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    );
    stack.push({
      name: funcName,
      vars: localVars.map((v) => `${v}=${Math.floor(Math.random() * 10)}`),
    });
    renderStack();
    qs("#mem-alloc-explain", root).textContent =
      `Called ${funcName} — stack depth: ${stack.length}`;
  };

  window.returnFunction = () => {
    if (stack.length === 0) return;
    const popped = stack.pop();
    renderStack();
    qs("#mem-alloc-explain", root).textContent =
      `Returned from ${popped.name} — stack depth: ${stack.length}`;
  };

  window.mallocHeap = () => {
    const size = Math.floor(Math.random() * 100) + 10;
    const data = `data (${size} bytes)`;
    heap.push({ id: nextHeapId++, data });
    renderHeap();
    qs("#mem-alloc-explain", root).textContent =
      `malloc(): allocated block #${nextHeapId - 1} (${size} bytes) on heap`;
  };

  window.freeHeap = () => {
    if (heap.length === 0) return;
    const freed = heap.pop();
    renderHeap();
    qs("#mem-alloc-explain", root).textContent =
      `free(): released block #${freed.id}`;
  };

  window.injectStackOverflow = () => {
    overflow = true;
    renderStack();
    qs("#mem-alloc-explain", root).className = "outcome err";
    qs("#mem-alloc-explain", root).textContent =
      "💥 STACK OVERFLOW! Function calls exceeded stack limit. Program crashed.";
  };

  // Initialize with some frames
  stack.push({ name: "main()", vars: ["argc=1", "argv"] });
  heap.push({ id: nextHeapId++, data: "user data (64 bytes)" });
  renderStack();
  renderHeap();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 11 — CACHE LOCALITY
════════════════════════════════════════════════════════════════ */
function initCacheLocality(root) {
  let size = 64;
  let stride = 1;
  let hits = 0,
    misses = 0;
  let lastAccess = [];

  function renderHeatmap() {
    const el = qs("#cache-heatmap", root);
    if (!el) return;
    const cells = [];
    for (let i = 0; i < Math.min(64, size); i++) {
      const accessed = lastAccess.includes(i);
      cells.push(
        `<div class="heatmap-cell${accessed ? " hot" : ""}" style="width:${Math.min(8, 400 / size)}px;height:${Math.min(8, 400 / size)}px" title="index ${i}"></div>`,
      );
    }
    el.innerHTML = cells.join("");
  }

  function updateStats() {
    qs("#cache-time", root).textContent = hits * 1 + misses * 100 + " ns"; // 1ns hit, 100ns miss
    qs("#cache-hits", root).textContent = hits;
    qs("#cache-misses", root).textContent = misses;
  }

  function accessIndex(idx) {
    // Simple cache simulation: cache line of 4, spatial locality
    const cacheLineStart = Math.floor(idx / 4) * 4;
    if (lastAccess.includes(cacheLineStart)) {
      hits++;
    } else {
      misses++;
      // Cache loads the whole line
      lastAccess = [
        cacheLineStart,
        cacheLineStart + 1,
        cacheLineStart + 2,
        cacheLineStart + 3,
      ].filter((i) => i < size);
    }
    renderHeatmap();
    updateStats();
  }

  window.runSequential = () => {
    hits = 0;
    misses = 0;
    for (let i = 0; i < size; i += stride) {
      accessIndex(i);
    }
    qs("#cache-locality-explain", root).textContent =
      `Sequential access (stride=${stride}): ${hits} hits, ${misses} misses`;
  };

  window.runRandom = () => {
    hits = 0;
    misses = 0;
    for (let i = 0; i < size; i++) {
      const idx = Math.floor(Math.random() * size);
      accessIndex(idx);
    }
    qs("#cache-locality-explain", root).textContent =
      `Random access: ${hits} hits, ${misses} misses — much worse locality`;
  };

  window.updateCacheSize = () => {
    size = parseInt(qs("#cache-size", root).value);
    qs("#cache-size-val", root).textContent = size;
    lastAccess = [];
    renderHeatmap();
  };

  window.updateCacheStride = () => {
    stride = parseInt(qs("#cache-stride", root).value);
    qs("#cache-stride-val", root).textContent = stride;
  };

  renderHeatmap();
  updateStats();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 12 — ASSEMBLY STEPPING
════════════════════════════════════════════════════════════════ */
function initAssembly(root) {
  const program = [
    { asm: "MOV R0, #0", comment: "Initialize sum = 0" },
    { asm: "MOV R1, #5", comment: "N = 5" },
    { asm: "MOV R2, #1", comment: "counter = 1" },
    { asm: "loop: ADD R0, R2", comment: "sum += counter" },
    { asm: "ADD R2, #1", comment: "counter++" },
    { asm: "CMP R2, R1", comment: "compare counter vs N" },
    { asm: "BLE loop", comment: "if counter <= N, loop" },
    { asm: "MOV R3, R0", comment: "store result" },
  ];

  let regs = [0, 0, 0, 0, 0, 0, 0, 0]; // R0-R7
  let pc = 0;
  let mem = new Array(16).fill(0);
  let running = false;

  function renderListing() {
    const el = qs("#asm-listing", root);
    el.innerHTML = program
      .map(
        (instr, i) => `
      <div class="asm-line${i === pc ? " current" : i < pc ? " done" : ""}">
        <span class="asm-pc">${i === pc ? "▶" : " "}</span>
        <span class="asm-addr">${i.toString(16).padStart(2, "0")}</span>
        <span class="asm-instr">${instr.asm}</span>
        <span class="asm-comment">; ${instr.comment}</span>
      </div>
    `,
      )
      .join("");
  }

  function renderRegs() {
    const el = qs("#asm-regs", root);
    el.innerHTML = regs
      .slice(0, 4)
      .map(
        (val, i) => `
      <div class="asm-reg">
        <span class="reg-name">R${i}</span>
        <span class="reg-value">${val}</span>
      </div>
    `,
      )
      .join("");
  }

  function renderMem() {
    const el = qs("#asm-mem", root);
    el.innerHTML = mem
      .map(
        (val, addr) => `
      <div class="asm-mem-cell">
        <span class="mem-addr">${addr.toString(16)}</span>
        <span class="mem-val">${val}</span>
      </div>
    `,
      )
      .join("");
  }

  function executeInstr(instr) {
    const parts = instr.asm.split(" ");
    switch (parts[0]) {
      case "MOV":
        if (parts[2].startsWith("#")) {
          const val = parseInt(parts[2].substring(1));
          regs[parseInt(parts[1][1])] = val;
        } else if (parts[2].startsWith("R")) {
          regs[parseInt(parts[1][1])] = regs[parseInt(parts[2][1])];
        }
        break;
      case "ADD":
        if (parts[2].startsWith("#")) {
          regs[parseInt(parts[1][1])] += parseInt(parts[2].substring(1));
        } else if (parts[2].startsWith("R")) {
          regs[parseInt(parts[1][1])] += regs[parseInt(parts[2][1])];
        }
        break;
      case "CMP":
        // Set flags (simulated by checking later)
        break;
      case "BLE":
        if (regs[2] <= regs[1]) pc = 2; // Jump back to loop
        break;
    }
  }

  window.asmStep = () => {
    if (pc >= program.length) {
      qs("#asm-explain", root).textContent = "Program completed";
      return;
    }
    executeInstr(program[pc]);
    pc++;
    renderListing();
    renderRegs();
    renderMem();
    qs("#asm-explain", root).textContent = `Executed: ${program[pc - 1].asm}`;
  };

  window.asmRun = () => {
    while (pc < program.length) {
      executeInstr(program[pc]);
      pc++;
    }
    renderListing();
    renderRegs();
    renderMem();
    qs("#asm-explain", root).textContent = "Ran to completion";
  };

  window.asmReset = () => {
    pc = 0;
    regs = [0, 0, 0, 0, 0, 0, 0, 0];
    renderListing();
    renderRegs();
    renderMem();
    qs("#asm-explain", root).textContent = "";
  };

  renderListing();
  renderRegs();
  renderMem();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 13 — PROCESSES AND THREADS
════════════════════════════════════════════════════════════════ */
function initScheduler(root) {
  let processes = [
    { id: 1, name: "Browser", cpuTime: 0, state: "running", progress: 0 },
    { id: 2, name: "Music", cpuTime: 0, state: "ready", progress: 30 },
    { id: 3, name: "Editor", cpuTime: 0, state: "ready", progress: 60 },
  ];
  let cores = [{ id: 0, process: 1 }];
  let load = 3;
  let switchCost = 5;
  let currentTime = 0;

  function renderProcesses() {
    const el = qs("#process-list", root);
    el.innerHTML = processes
      .map(
        (p) => `
      <div class="process-row">
        <span class="process-name">${p.name}</span>
        <span class="process-state ${p.state}">${p.state}</span>
        <span class="process-progress">[${"█".repeat(Math.floor(p.progress / 10))}${"░".repeat(10 - Math.floor(p.progress / 10))}]</span>
      </div>
    `,
      )
      .join("");
  }

  function renderCores() {
    const el = qs("#core-list", root);
    el.innerHTML = cores
      .map((c) => {
        const proc = processes.find((p) => p.id === c.process);
        return `<div class="core-row">
        <span class="core-id">Core ${c.id}</span>
        <span class="core-process">→ ${proc ? proc.name : "idle"}</span>
      </div>`;
      })
      .join("");
  }

  window.schedulerStep = () => {
    // Round-robin scheduling
    const running = processes.find((p) => p.state === "running");
    if (running) {
      running.progress = Math.min(100, running.progress + 10);
      running.cpuTime += 10;
    }

    // Switch every 3 steps
    if (currentTime % 3 === 0) {
      const ready = processes.filter((p) => p.state === "ready");
      if (ready.length > 0) {
        if (running) running.state = "ready";
        const next = ready[0];
        next.state = "running";
        cores[0].process = next.id;
        qs("#scheduler-explain", root).textContent =
          `Context switch: ${running?.name} → ${next.name} (cost: ${switchCost}µs)`;
      }
    }
    currentTime++;
    renderProcesses();
    renderCores();
  };

  window.updateProcLoad = () => {
    load = parseInt(qs("#proc-load", root).value);
    qs("#proc-load-val", root).textContent = load;
    // Adjust processes
    while (processes.length < load) {
      processes.push({
        id: processes.length + 1,
        name: ["Terminal", "Slack", "Zoom", "Finder", "Docker"][
          processes.length % 5
        ],
        cpuTime: 0,
        state: "ready",
        progress: 0,
      });
    }
    renderProcesses();
  };

  window.updateSwitchCost = () => {
    switchCost = parseInt(qs("#switch-cost", root).value);
    qs("#switch-cost-val", root).textContent = switchCost;
  };

  window.schedulerReset = () => {
    processes = [
      { id: 1, name: "Browser", cpuTime: 0, state: "running", progress: 0 },
      { id: 2, name: "Music", cpuTime: 0, state: "ready", progress: 30 },
      { id: 3, name: "Editor", cpuTime: 0, state: "ready", progress: 60 },
    ];
    cores = [{ id: 0, process: 1 }];
    currentTime = 0;
    renderProcesses();
    renderCores();
    qs("#scheduler-explain", root).textContent = "";
  };

  renderProcesses();
  renderCores();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 14 — CONTEXT SWITCHING
════════════════════════════════════════════════════════════════ */
function initContextSwitch(root) {
  let procA = { pc: 0x100, sp: 0x7fff, r0: 42, r1: 7, r2: 0, r3: 15 };
  let procB = { pc: 0x200, sp: 0x5fff, r0: 0, r1: 0, r2: 0, r3: 0 };
  let kernelSave = null;
  let current = "A";
  let error = false;

  function renderContext(ctx, id) {
    const el = qs(id, root);
    if (!el || error) {
      if (el && error)
        el.innerHTML = '<div class="ctx-error">💥 SAVE ERROR - corrupted</div>';
      return;
    }
    el.innerHTML = `
      <div class="ctx-row"><span class="ctx-label">PC</span><span class="ctx-value">0x${ctx.pc.toString(16)}</span></div>
      <div class="ctx-row"><span class="ctx-label">SP</span><span class="ctx-value">0x${ctx.sp.toString(16)}</span></div>
      <div class="ctx-row"><span class="ctx-label">R0</span><span class="ctx-value">${ctx.r0}</span></div>
      <div class="ctx-row"><span class="ctx-label">R1</span><span class="ctx-value">${ctx.r1}</span></div>
      <div class="ctx-row"><span class="ctx-label">R2</span><span class="ctx-value">${ctx.r2}</span></div>
      <div class="ctx-row"><span class="ctx-label">R3</span><span class="ctx-value">${ctx.r3}</span></div>
    `;
  }

  window.ctxSwitch = () => {
    if (error) return;

    if (current === "A") {
      // Save A to kernel
      kernelSave = { ...procA };
      // Load B
      procA = { ...procB };
      current = "B";
      qs("#ctx-explain", root).textContent =
        "Switched A→B: saved A's context, loaded B's context";
    } else {
      // Save B to kernel
      kernelSave = { ...procB };
      // Load A
      procB = { ...procA };
      current = "A";
      qs("#ctx-explain", root).textContent =
        "Switched B→A: saved B's context, loaded A's context";
    }

    renderContext(procA, "#ctx-a");
    renderContext(procB, "#ctx-b");
    renderContext(kernelSave, "#ctx-kernel");
  };

  window.ctxReset = () => {
    procA = { pc: 0x100, sp: 0x7fff, r0: 42, r1: 7, r2: 0, r3: 15 };
    procB = { pc: 0x200, sp: 0x5fff, r0: 0, r1: 0, r2: 0, r3: 0 };
    kernelSave = null;
    current = "A";
    error = false;
    renderContext(procA, "#ctx-a");
    renderContext(procB, "#ctx-b");
    renderContext({ pc: 0, sp: 0, r0: 0, r1: 0, r2: 0, r3: 0 }, "#ctx-kernel");
    qs("#ctx-explain", root).textContent = "Reset: A running, B saved";
  };

  window.injectSaveError = () => {
    error = true;
    renderContext(null, "#ctx-kernel");
    qs("#ctx-explain", root).className = "outcome err";
    qs("#ctx-explain", root).textContent =
      "💥 Kernel save error! Context corrupted.";
  };

  renderContext(procA, "#ctx-a");
  renderContext(procB, "#ctx-b");
  renderContext({ pc: 0, sp: 0, r0: 0, r1: 0, r2: 0, r3: 0 }, "#ctx-kernel");
}

/* ════════════════════════════════════════════════════════════════
   LESSON 15 — VIRTUAL MEMORY
════════════════════════════════════════════════════════════════ */
function initVirtualMemory(root) {
  let pageTables = {
    a: [1, 3, -1, -1], // process A: pages mapped to frames 1,3, (none for 2,3)
    b: [2, 0, -1, -1], // process B: pages mapped to frames 2,0
  };
  let frames = [
    { pid: "b", page: 1, data: "frame0: B page1" },
    { pid: "a", page: 0, data: "frame1: A page0" },
    { pid: "b", page: 0, data: "frame2: B page0" },
    { pid: "a", page: 1, data: "frame3: A page1" },
    { pid: null, page: null, data: "free" },
    { pid: null, page: null, data: "free" },
    { pid: null, page: null, data: "free" },
    { pid: null, page: null, data: "free" },
  ];
  let pageFault = false;

  function renderPageTables() {
    const aEl = qs("#vm-pages-a", root);
    const bEl = qs("#vm-pages-b", root);

    aEl.innerHTML = pageTables.a
      .map(
        (frame, page) => `
      <div class="page-entry">
        <span class="page-num">Page ${page}</span>
        <span class="page-frame">→ ${frame === -1 ? "unmapped" : "Frame " + frame}</span>
      </div>
    `,
      )
      .join("");

    bEl.innerHTML = pageTables.b
      .map(
        (frame, page) => `
      <div class="page-entry">
        <span class="page-num">Page ${page}</span>
        <span class="page-frame">→ ${frame === -1 ? "unmapped" : "Frame " + frame}</span>
      </div>
    `,
      )
      .join("");
  }

  function renderFrames() {
    const el = qs("#vm-frames", root);
    el.innerHTML = frames
      .map(
        (frame, i) => `
      <div class="frame-entry${frame.pid ? " used" : ""}">
        <span class="frame-num">Frame ${i}</span>
        <span class="frame-data">${frame.data}</span>
      </div>
    `,
      )
      .join("");
  }

  window.accessPage = (pid, page) => {
    pageFault = false;
    const pt = pageTables[pid];
    const frameNum = pt[page];

    if (frameNum === -1) {
      pageFault = true;
      qs("#vm-explain", root).className = "outcome err";
      qs("#vm-explain", root).textContent =
        `⚠️ PAGE FAULT: Process ${pid} accessed unmapped page ${page}! OS loads from disk.`;
      // Simulate page fault handler - find free frame
      const freeFrame = frames.findIndex((f) => f.pid === null);
      if (freeFrame !== -1) {
        pt[page] = freeFrame;
        frames[freeFrame] = {
          pid,
          page,
          data: `frame${freeFrame}: ${pid} page${page} (loaded)`,
        };
        renderFrames();
        renderPageTables();
      }
    } else {
      qs("#vm-explain", root).className = "outcome ok";
      qs("#vm-explain", root).textContent =
        `✅ Process ${pid} accessed page ${page} → physical frame ${frameNum}`;
    }
  };

  window.injectPageFault = () => {
    // Access an unmapped page
    const unmappedA = pageTables.a.findIndex((f) => f === -1);
    if (unmappedA !== -1) {
      accessPage("a", unmappedA);
    } else {
      qs("#vm-explain", root).textContent =
        "No unmapped pages in A; try resetting";
    }
  };

  renderPageTables();
  renderFrames();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 16 — BACKEND AS STATE MACHINE
════════════════════════════════════════════════════════════════ */
function initStateMachine(root) {
  let state = { counter: 0, lastOp: null };
  let corrupted = false;

  function renderState() {
    const el = qs("#state-current", root);
    if (corrupted) {
      el.innerHTML = "💥 CORRUPTED: ???";
      return;
    }
    el.innerHTML = `counter: ${state.counter}, lastOp: ${state.lastOp || "none"}`;
  }

  window.stateReq = (op) => {
    if (corrupted) {
      qs("#state-explain", root).className = "outcome err";
      qs("#state-explain", root).textContent =
        "System corrupted - reset needed";
      return;
    }

    const prevState = { ...state };

    switch (op) {
      case "increment":
        state.counter++;
        state.lastOp = "inc";
        break;
      case "decrement":
        state.counter--;
        state.lastOp = "dec";
        break;
      case "reset":
        state.counter = 0;
        state.lastOp = "reset";
        break;
    }

    log(
      "state-log",
      `f({${prevState.counter}}, ${op}) → {${state.counter}}`,
      "info",
    );
    renderState();
    qs("#state-explain", root).className = "outcome ok";
    qs("#state-explain", root).textContent =
      `Transition: ${op} → new state: counter=${state.counter}`;
  };

  window.injectStateCorruption = () => {
    corrupted = true;
    renderState();
    qs("#state-explain", root).className = "outcome err";
    qs("#state-explain", root).textContent =
      "💥 State corrupted! Memory overwritten.";
  };

  renderState();
}
/* ════════════════════════════════════════════════════════════════
   LESSON 17 — TCP LIFECYCLE
════════════════════════════════════════════════════════════════ */
function initTCP(root) {
  let state = { client: 'CLOSED', server: 'LISTEN' };
  let packets = [];
  let step = 0;
  const states = [
    { client: 'CLOSED', server: 'LISTEN', packet: '—', desc: 'Initial state: server listening' },
    { client: 'SYN-SENT', server: 'LISTEN', packet: 'SYN →', desc: 'Client sends SYN' },
    { client: 'SYN-SENT', server: 'SYN-RCVD', packet: '← SYN-ACK', desc: 'Server responds with SYN-ACK' },
    { client: 'ESTABLISHED', server: 'SYN-RCVD', packet: 'ACK →', desc: 'Client ACKs, connection established' },
    { client: 'ESTABLISHED', server: 'ESTABLISHED', packet: '—', desc: 'Connection established, data transfer' },
    { client: 'FIN-WAIT-1', server: 'ESTABLISHED', packet: 'FIN →', desc: 'Client initiates close' },
    { client: 'FIN-WAIT-1', server: 'CLOSE-WAIT', packet: '← ACK', desc: 'Server ACKs FIN' },
    { client: 'FIN-WAIT-2', server: 'CLOSE-WAIT', packet: '—', desc: 'Client waiting for server FIN' },
    { client: 'FIN-WAIT-2', server: 'LAST-ACK', packet: '← FIN', desc: 'Server sends FIN' },
    { client: 'TIME-WAIT', server: 'LAST-ACK', packet: 'ACK →', desc: 'Client ACKs, enters TIME-WAIT' },
    { client: 'CLOSED', server: 'CLOSED', packet: '—', desc: 'Connection closed' }
  ];

  function render() {
    qs("#tcp-client-state", root).textContent = state.client;
    qs("#tcp-server-state", root).textContent = state.server;
    
    const pktEl = qs("#tcp-packets", root);
    if (step < states.length) {
      pktEl.innerHTML = `<div class="packet ${states[step].packet.includes('→') ? 'sent' : states[step].packet.includes('←') ? 'recv' : ''}">${states[step].packet}</div>`;
    }
    
    if (step >= 0 && step < states.length) {
      qs("#tcp-explain", root).textContent = states[step].desc;
    }
  }

  window.tcpStep = () => {
    if (step < states.length - 1) {
      step++;
      state.client = states[step].client;
      state.server = states[step].server;
      render();
    }
  };

  window.tcpReset = () => {
    step = 0;
    state.client = states[0].client;
    state.server = states[0].server;
    render();
    qs("#tcp-explain", root).textContent = '';
  };

  window.injectPacketLoss = () => {
    qs("#tcp-explain", root).className = "outcome err";
    qs("#tcp-explain", root).textContent = "💥 SYN packet lost! TCP will retransmit after timeout.";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 18 — SOCKETS AND OS BOUNDARY
════════════════════════════════════════════════════════════════ */
function initSockets(root) {
  let buffer = [];
  let bufferFull = false;

  function render() {
    qs("#socket-buffer", root).innerHTML = buffer.length ? 
      buffer.map(msg => `<div class="buffer-entry">${msg}</div>`).join('') : 
      '[empty]';
  }

  window.socketSend = () => {
    if (bufferFull) {
      qs("#socket-explain", root).className = "outcome err";
      qs("#socket-explain", root).textContent = "❌ send() failed: buffer full (EWOULDBLOCK)";
      return;
    }
    
    const msg = `Packet #${buffer.length+1}`;
    buffer.push(msg);
    render();
    qs("#socket-explain", root).className = "outcome ok";
    qs("#socket-explain", root).textContent = `send(): copied "${msg}" to kernel buffer → syscall → returns ${buffer.length}`;
  };

  window.socketRecv = () => {
    if (buffer.length === 0) {
      qs("#socket-explain", root).className = "outcome";
      qs("#socket-explain", root).textContent = "recv(): buffer empty, would block (EAGAIN)";
      return;
    }
    const msg = buffer.shift();
    render();
    qs("#socket-explain", root).textContent = `recv(): received "${msg}" from kernel → data copied to userspace`;
  };

  window.injectBufferFull = () => {
    bufferFull = !bufferFull;
    qs("#socket-explain", root).className = "outcome err";
    qs("#socket-explain", root).textContent = bufferFull ? 
      "💥 Kernel buffer full! send() will now fail." : 
      "Buffer space available again";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 19 — EVENT LOOP VS THREADS
════════════════════════════════════════════════════════════════ */
function initEventLoop(root) {
  let connections = 10;
  let ioWait = 5;
  let threadsResult = 0;
  let eventResult = 0;

  function render() {
    const threadsEl = qs("#model-threads", root);
    const eventEl = qs("#model-eventloop", root);
    
    // Thread model: each connection gets a thread
    threadsEl.innerHTML = `
      <div class="model-stats">
        <div>Threads: ${connections}</div>
        <div>Memory: ${connections * 1024} KB</div>
        <div>Context switches: ~${connections * 10}/s</div>
      </div>
      <div class="thread-pool">
        ${Array(Math.min(connections, 8)).fill(0).map((_,i) => `
          <div class="thread">Thread ${i+1}</div>
        `).join('')}
        ${connections > 8 ? `<div class="thread-more">+${connections-8} more</div>` : ''}
      </div>
    `;
    
    // Event loop: single thread with queue
    eventEl.innerHTML = `
      <div class="model-stats">
        <div>Threads: 1</div>
        <div>Memory: 64 KB</div>
        <div>Context switches: 0</div>
      </div>
      <div class="event-loop">
        <div class="event-loop-thread">Event Loop Thread</div>
        <div class="event-queue">
          <div class="queue-label">Queue:</div>
          <div class="queue-items">
            ${Array(Math.min(connections, 5)).fill(0).map((_,i) => `
              <div class="queue-item">req${i+1}</div>
            `).join('')}
            ${connections > 5 ? `<span class="queue-more">+${connections-5}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  window.runModel = () => {
    // Simulate performance
    const threadsLatency = (ioWait * connections) / 4; // threads context switch overhead
    const eventLatency = ioWait + (connections / 10); // event loop non-blocking
    
    threadsResult = threadsLatency;
    eventResult = eventLatency;
    
    qs("#model-explain", root).innerHTML = `
      <div class="comparison">
        <div class="${threadsLatency < eventLatency ? 'better' : 'worse'}">
          Threads: ${threadsLatency.toFixed(1)}ms total latency
        </div>
        <div class="${eventLatency < threadsLatency ? 'better' : 'worse'}">
          Event Loop: ${eventLatency.toFixed(1)}ms total latency
        </div>
        <div class="verdict">
          ${threadsLatency < eventLatency ? 
            'Threads faster for CPU-bound work' : 
            'Event loop faster for I/O-bound work'}
        </div>
      </div>
    `;
  };

  window.updateConns = () => {
    connections = parseInt(qs("#conns", root).value);
    qs("#conns-val", root).textContent = connections;
    render();
  };

  window.updateIOWait = () => {
    ioWait = parseInt(qs("#io-wait", root).value);
    qs("#io-wait-val", root).textContent = ioWait;
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 20 — RACE CONDITIONS
════════════════════════════════════════════════════════════════ */
function initRace(root) {
  let counter = 42;
  let threadA = { state: 'idle', temp: 0 };
  let threadB = { state: 'idle', temp: 0 };
  let step = 0;
  let usingMutex = false;
  const steps = [
    { a: 'read', b: 'idle', desc: 'Thread A reads counter = 42' },
    { a: 'idle', b: 'read', desc: 'Thread B reads counter = 42' },
    { a: 'write', b: 'read', desc: 'Thread A writes 43 (lost B\'s increment)' },
    { a: 'done', b: 'write', desc: 'Thread B writes 43 → final = 43 (should be 44!)' }
  ];

  function render() {
    qs("#race-counter", root).textContent = counter;
    qs("#race-thread-a", root).textContent = threadA.state + (threadA.temp ? ` (temp=${threadA.temp})` : '');
    qs("#race-thread-b", root).textContent = threadB.state + (threadB.temp ? ` (temp=${threadB.temp})` : '');
  }

  window.raceStep = () => {
    if (usingMutex) {
      qs("#race-explain", root).textContent = "With mutex: threads are synchronized, no race condition";
      return;
    }
    
    if (step < steps.length) {
      const s = steps[step];
      threadA.state = s.a;
      threadB.state = s.b;
      
      if (s.a === 'read') threadA.temp = counter;
      if (s.b === 'read') threadB.temp = counter;
      if (s.a === 'write') { counter = threadA.temp + 1; threadA.temp = 0; }
      if (s.b === 'write') { counter = threadB.temp + 1; threadB.temp = 0; }
      
      qs("#race-explain", root).textContent = s.desc;
      step++;
      render();
    }
  };

  window.raceReset = () => {
    counter = 42;
    threadA = { state: 'idle', temp: 0 };
    threadB = { state: 'idle', temp: 0 };
    step = 0;
    usingMutex = false;
    render();
    qs("#race-explain", root).textContent = '';
  };

  window.raceFix = () => {
    usingMutex = true;
    qs("#race-explain", root).className = "outcome ok";
    qs("#race-explain", root).textContent = "🔒 Mutex locked: threads now execute atomically";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 21 — APPEND-ONLY LOG
════════════════════════════════════════════════════════════════ */
function initAppendLog(root) {
  let log = [
    { offset: 0, op: 'SET', key: 'x', value: 5 },
    { offset: 1, op: 'SET', key: 'y', value: 10 },
    { offset: 2, op: 'SET', key: 'x', value: 7 },
    { offset: 3, op: 'DEL', key: 'y' }
  ];
  let corrupted = false;

  function renderLog() {
    const el = qs("#log-entries", root);
    el.innerHTML = log.map(entry => `
      <div class="log-entry${entry.corrupt ? ' corrupt' : ''}">
        <span class="log-offset">${entry.offset}</span>
        <span class="log-op ${entry.op}">${entry.op}</span>
        <span class="log-key">${entry.key}</span>
        ${entry.value !== undefined ? `<span class="log-value">= ${entry.value}</span>` : ''}
        ${entry.corrupt ? '<span class="log-corrupt">💥 CORRUPT</span>' : ''}
      </div>
    `).join('');
  }

  window.logAppend = (cmd) => {
    if (corrupted) {
      qs("#log-explain", root).textContent = "Log corrupted, cannot append";
      return;
    }
    
    const parts = cmd.split(' ');
    const op = parts[0];
    const key = parts[1].split('=')[0];
    const value = parts[1].includes('=') ? parseInt(parts[1].split('=')[1]) : undefined;
    
    log.push({
      offset: log.length,
      op,
      key,
      value,
      corrupt: false
    });
    
    renderLog();
    qs("#log-explain", root).textContent = `Appended: ${cmd} at offset ${log.length-1}`;
  };

  window.logCompaction = () => {
    if (corrupted) return;
    
    // Keep only latest value per key
    const latest = new Map();
    log.forEach(entry => {
      if (entry.op === 'SET') {
        latest.set(entry.key, entry);
      } else if (entry.op === 'DEL') {
        latest.delete(entry.key);
      }
    });
    
    const compacted = Array.from(latest.values()).map((entry, i) => ({
      ...entry,
      offset: i
    }));
    
    log = compacted;
    renderLog();
    qs("#log-explain", root).textContent = `Compacted log: ${log.length} entries remain`;
  };

  window.injectCorruptEntry = () => {
    if (log.length > 0) {
      log[log.length-1].corrupt = true;
      corrupted = true;
      renderLog();
      qs("#log-explain", root).className = "outcome err";
      qs("#log-explain", root).textContent = "💥 Last entry corrupted! Log needs repair.";
    }
  };

  renderLog();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 22 — B-TREE SIMULATION
════════════════════════════════════════════════════════════════ */
function initBTree(root) {
  // Simple B-tree of order 4 (max 3 keys per node)
  let tree = {
    keys: [30, 60],
    children: [
      { keys: [10, 20], children: [] },
      { keys: [40, 50], children: [] },
      { keys: [70, 80, 90], children: [] }
    ]
  };

  function renderTree(node, level = 0) {
    if (!node) return '';
    
    const nodeHtml = `
      <div class="btree-node" style="margin-left: ${level * 20}px">
        ${node.keys.map(k => `<span class="btree-key">${k}</span>`).join('')}
      </div>
    `;
    
    const childrenHtml = node.children.map(child => renderTree(child, level + 1)).join('');
    
    return nodeHtml + childrenHtml;
  }

  function render() {
    qs("#btree", root).innerHTML = renderTree(tree);
  }

  window.btreeSearch = () => {
    const key = parseInt(qs("#btree-search", root).value);
    if (isNaN(key)) return;
    
    // Simple linear search through tree
    let found = false;
    let path = [];
    let node = tree;
    
    while (node) {
      path.push(node.keys.join(','));
      if (node.keys.includes(key)) {
        found = true;
        break;
      }
      
      // Find which child to go to
      let childIdx = 0;
      while (childIdx < node.keys.length && key > node.keys[childIdx]) {
        childIdx++;
      }
      node = node.children[childIdx];
      if (!node) break;
    }
    
    qs("#btree-explain", root).textContent = found ?
      `✅ Key ${key} found! Path: ${path.join(' → ')}` :
      `❌ Key ${key} not found`;
  };

  window.btreeInsert = () => {
    const key = Math.floor(Math.random() * 90) + 10;
    
    // Simplified insertion - just add to root for demo
    if (!tree.keys.includes(key)) {
      tree.keys.push(key);
      tree.keys.sort((a,b) => a - b);
    }
    
    render();
    qs("#btree-explain", root).textContent = `Inserted ${key} (simplified - actual B-tree would split)`;
  };

  window.btreeReset = () => {
    tree = {
      keys: [30, 60],
      children: [
        { keys: [10, 20], children: [] },
        { keys: [40, 50], children: [] },
        { keys: [70, 80, 90], children: [] }
      ]
    };
    render();
    qs("#btree-explain", root).textContent = '';
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 23 — TRANSACTIONS AND ISOLATION
════════════════════════════════════════════════════════════════ */
function initTransactions(root) {
  let accounts = { a: 1000, b: 1000, c: 1000 };
  let isolation = 'read-committed';
  let transactionLog = [];
  let inTransaction = false;
  let dirtyRead = false;

  function render() {
    qs("#tx-acc-a", root).textContent = accounts.a;
    qs("#tx-acc-b", root).textContent = accounts.b;
    qs("#tx-acc-c", root).textContent = accounts.c;
  }

  window.txTransfer = (from, to, amount) => {
    const fromKey = `tx-acc-${from}`;
    const toKey = `tx-acc-${to}`;
    
    if (isolation === 'read-uncommitted' && dirtyRead) {
      // Simulate dirty read
      qs("#tx-explain", root).className = "outcome err";
      qs("#tx-explain", root).textContent = `⚠️ Dirty read! Read ${from} as ${accounts[from]} but it was uncommitted`;
    }
    
    if (accounts[from] >= amount) {
      accounts[from] -= amount;
      accounts[to] += amount;
      transactionLog.push(`Transferred ${amount} from ${from} to ${to}`);
      
      render();
      qs("#tx-explain", root).className = "outcome ok";
      qs("#tx-explain", root).textContent = `Transfer complete. ${from}: ${accounts[from]}, ${to}: ${accounts[to]}`;
    } else {
      qs("#tx-explain", root).className = "outcome err";
      qs("#tx-explain", root).textContent = `Insufficient funds in ${from}`;
    }
  };

  window.txRunConcurrent = () => {
    // Simulate concurrent transfers
    accounts.a -= 50;
    accounts.b += 50;
    accounts.b -= 30;
    accounts.c += 30;
    
    render();
    
    if (isolation === 'serializable') {
      qs("#tx-explain", root).textContent = "Serializable: transfers appear to happen one after another";
    } else {
      qs("#tx-explain", root).className = "outcome warn";
      qs("#tx-explain", root).textContent = `Isolation level ${isolation}:可能出现问题`;
    }
  };

  window.updateIsolation = () => {
    isolation = qs("#tx-isolation", root).value;
    qs("#tx-explain", root).textContent = `Isolation level set to ${isolation}`;
  };

  window.injectCrash = () => {
    // Simulate crash mid-transaction
    accounts.a = 970; // Inconsistent state
    accounts.b = 1030;
    render();
    qs("#tx-explain", root).className = "outcome err";
    qs("#tx-explain", root).textContent = "💥 Crash! Transaction not atomic - accounts inconsistent!";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 24 — CACHE INVALIDATION
════════════════════════════════════════════════════════════════ */
function initCacheInvalidation(root) {
  let db = { 'user:1': { name: 'Alice', email: 'alice@ex.com' } };
  let cache = {};
  let strategy = 'ttl';
  let ttlTimer = 0;

  function render() {
    qs("#inv-db", root).innerHTML = Object.entries(db)
      .map(([k,v]) => `<div class="db-row">${k}: ${v.name} (${v.email})</div>`)
      .join('');
    
    qs("#inv-cache", root).innerHTML = Object.keys(cache).length ?
      Object.entries(cache).map(([k,v]) => 
        `<div class="cache-row${v.stale ? ' stale' : ''}">${k}: ${v.data.name} ${v.stale ? '(stale)' : ''}</div>`
      ).join('') :
      '<div class="cache-empty">(empty)</div>';
  }

  window.invQuery = (key) => {
    if (strategy === 'lazy' && cache[key]?.stale) {
      // Lazy invalidation - check on read
      delete cache[key];
    }
    
    if (cache[key] && !cache[key].stale) {
      qs("#inv-explain", root).className = "outcome ok";
      qs("#inv-explain", root).textContent = `Cache HIT: ${key}`;
    } else {
      // Cache miss - load from DB
      cache[key] = { data: db[key], stale: false, timestamp: Date.now() };
      qs("#inv-explain", root).textContent = `Cache MISS: loaded ${key} from DB`;
    }
    render();
  };

  window.invUpdate = (key, newName) => {
    // Update DB
    db[key].name = newName;
    
    switch(strategy) {
      case 'write-through':
        // Update cache immediately
        if (cache[key]) {
          cache[key].data = db[key];
          cache[key].stale = false;
        }
        qs("#inv-explain", root).textContent = "Write-through: cache updated";
        break;
      case 'ttl':
        // Mark as stale, will expire
        if (cache[key]) {
          cache[key].stale = true;
        }
        qs("#inv-explain", root).textContent = "TTL: cache entry marked stale";
        break;
      case 'lazy':
        // Do nothing, check on read
        if (cache[key]) {
          cache[key].stale = true;
        }
        qs("#inv-explain", root).textContent = "Lazy: will validate on next read";
        break;
    }
    render();
  };

  window.invStratChange = () => {
    const radios = document.getElementsByName('inv-strat');
    for (let r of radios) {
      if (r.checked) {
        strategy = r.value;
        break;
      }
    }
    // Clear cache on strategy change
    cache = {};
    render();
    qs("#inv-explain", root).textContent = `Strategy: ${strategy}`;
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 25 — REPLICATION
════════════════════════════════════════════════════════════════ */
function initReplication(root) {
  let leader = { x: 5 };
  let follower1 = { x: 5 };
  let follower2 = { x: 5 };
  let replicationLag = 0;
  let follower1Failed = false;

  function render() {
    qs("#rep-leader-data", root).textContent = `x=${leader.x}`;
    qs("#rep-f1-data", root).textContent = follower1Failed ? 'DOWN' : `x=${follower1.x}`;
    qs("#rep-f2-data", root).textContent = `x=${follower2.x}`;
    
    if (follower1Failed) {
      qs("#rep-f1", root).classList.add('failed');
    } else {
      qs("#rep-f1", root).classList.remove('failed');
    }
  }

  window.repWrite = () => {
    leader.x = 10;
    replicationLag = 2; // Follower needs 2 steps to catch up
    render();
    qs("#rep-explain", root).textContent = "Leader updated to x=10. Waiting for replication...";
  };

  window.repStep = () => {
    if (replicationLag > 0 && !follower1Failed) {
      follower1.x = leader.x;
      replicationLag--;
    }
    if (replicationLag === 0) {
      follower2.x = leader.x;
      qs("#rep-explain", root).textContent = "All followers caught up";
    } else {
      qs("#rep-explain", root).textContent = `Replicating... ${replicationLag} steps remaining`;
    }
    render();
  };

  window.repFailFollower = () => {
    follower1Failed = true;
    render();
    qs("#rep-explain", root).className = "outcome err";
    qs("#rep-explain", root).textContent = "💥 Follower 1 failed! Leader continues, but replication stalled";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 26 — CONSENSUS BASICS
════════════════════════════════════════════════════════════════ */
function initConsensus(root) {
  let nodes = [
    { id: 1, state: 'follower', value: null, alive: true },
    { id: 2, state: 'follower', value: null, alive: true },
    { id: 3, state: 'follower', value: null, alive: true },
    { id: 4, state: 'follower', value: null, alive: true },
    { id: 5, state: 'follower', value: null, alive: true }
  ];
  let proposedValue = 42;
  let round = 0;

  function render() {
    nodes.forEach((node, i) => {
      const el = qs(`#cons-node${i+1}`, root);
      if (el) {
        el.className = `consensus-node ${node.state} ${node.alive ? '' : 'dead'}`;
        el.innerHTML = `Node ${node.id}<br/>${node.state}${node.value !== null ? `<br/>value=${node.value}` : ''}`;
      }
    });
  }

  window.consensusRun = () => {
    round++;
    
    // Simple consensus simulation: leader election + agreement
    const leader = nodes.find(n => n.alive && n.state === 'leader') || 
                   nodes.find(n => n.alive);
    
    if (leader) {
      leader.state = 'leader';
      leader.value = proposedValue;
      
      // Replicate to followers
      let agreements = 1; // leader counts
      nodes.forEach(n => {
        if (n.id !== leader.id && n.alive) {
          n.state = 'follower';
          n.value = proposedValue;
          agreements++;
        }
      });
      
      const majority = Math.floor(nodes.filter(n => n.alive).length / 2) + 1;
      
      if (agreements >= majority) {
        qs("#cons-explain", root).className = "outcome ok";
        qs("#cons-explain", root).textContent = `Round ${round}: Consensus reached! Value ${proposedValue} committed.`;
      } else {
        qs("#cons-explain", root).className = "outcome err";
        qs("#cons-explain", root).textContent = `Round ${round}: No consensus (${agreements}/${majority} nodes)`;
      }
    }
    
    render();
  };

  window.failNode = (id) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      node.alive = false;
      node.state = 'dead';
    }
    render();
    qs("#cons-explain", root).className = "outcome err";
    qs("#cons-explain", root).textContent = `Node ${id} failed. Reconfiguring...`;
  };

  window.updateConsValue = () => {
    proposedValue = parseInt(qs("#cons-value", root).value);
    qs("#cons-proposal", root).textContent = proposedValue;
  };

  window.consensusReset = () => {
    nodes = [
      { id: 1, state: 'follower', value: null, alive: true },
      { id: 2, state: 'follower', value: null, alive: true },
      { id: 3, state: 'follower', value: null, alive: true },
      { id: 4, state: 'follower', value: null, alive: true },
      { id: 5, state: 'follower', value: null, alive: true }
    ];
    round = 0;
    render();
    qs("#cons-explain", root).textContent = '';
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 27 — PARTITION TOLERANCE
════════════════════════════════════════════════════════════════ */
function initPartition(root) {
  let sideA = { value: null };
  let sideB = { value: null };
  let partitioned = false;
  let strategy = 'cp';

  function render() {
    const aEl = qs("#part-side-a", root);
    const bEl = qs("#part-side-b", root);
    
    aEl.innerHTML = `
      <div class="partition-node">Node A1 (value: ${sideA.value})</div>
      <div class="partition-node">Node A2 (value: ${sideA.value})</div>
    `;
    
    bEl.innerHTML = `
      <div class="partition-node">Node B1 (value: ${sideB.value})</div>
      <div class="partition-node">Node B2 (value: ${sideB.value})</div>
    `;
    
    qs("#partition-line", root).innerHTML = partitioned ? '✂️ PARTITION' : '🌐 Connected';
    qs("#partition-line", root).style.background = partitioned ? 'var(--red-bg)' : 'var(--bg2)';
  }

  window.partitionWrite = (side, value) => {
    if (side === 'a') {
      if (partitioned && strategy === 'cp') {
        qs("#part-explain", root).className = "outcome err";
        qs("#part-explain", root).textContent = "CP mode: rejecting write during partition (consistency over availability)";
        return;
      }
      sideA.value = value;
    } else {
      if (partitioned && strategy === 'cp') {
        qs("#part-explain", root).className = "outcome err";
        qs("#part-explain", root).textContent = "CP mode: rejecting write during partition";
        return;
      }
      sideB.value = value;
    }
    
    render();
    
    if (partitioned && sideA.value !== sideB.value && sideA.value && sideB.value) {
      qs("#part-explain", root).className = "outcome err";
      qs("#part-explain", root).textContent = "⚠️ Split-brain! Values diverged during partition.";
    }
  };

  window.togglePartition = () => {
    partitioned = !partitioned;
    render();
    qs("#part-explain", root).textContent = partitioned ? 
      "✂️ Network partition created! Sides can't communicate." : 
      "🌐 Partition healed, sides can communicate again";
  };

  window.capChange = () => {
    const radios = document.getElementsByName('cap-choice');
    for (let r of radios) {
      if (r.checked) {
        strategy = r.value;
        break;
      }
    }
    qs("#part-explain", root).textContent = `CAP strategy: ${strategy === 'cp' ? 'Consistency (CP)' : 'Availability (AP)'}`;
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 28 — BACKPRESSURE
════════════════════════════════════════════════════════════════ */
function initBackpressure(root) {
  let queue = [];
  let dropped = 0;
  let processed = 0;
  let rate = 10;
  let processRate = 8;
  let backpressure = true;
  let interval = null;

  function render() {
    qs("#bp-queue", root).textContent = queue.length;
    qs("#bp-dropped", root).textContent = dropped;
  }

  function processTick() {
    // Add new requests based on rate
    for (let i = 0; i < rate; i++) {
      if (queue.length < 20) {
        queue.push(Date.now());
      } else if (backpressure) {
        // Backpressure: sender slows down (simulated by not adding more)
        break;
      } else {
        // No backpressure: drop when full
        dropped++;
      }
    }
    
    // Process requests
    for (let i = 0; i < processRate && queue.length > 0; i++) {
      queue.shift();
      processed++;
    }
    
    render();
    
    const queuePercent = (queue.length / 20) * 100;
    qs("#bp-explain", root).innerHTML = `
      Queue: ${queue.length}/20 (${queuePercent.toFixed(0)}% full)<br/>
      Processed: ${processed}, Dropped: ${dropped}<br/>
      ${queue.length > 15 ? '⚠️ Queue near capacity!' : ''}
    `;
  }

  window.bpStart = () => {
    if (interval) clearInterval(interval);
    interval = setInterval(processTick, 500);
  };

  window.bpStop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  window.bpReset = () => {
    queue = [];
    dropped = 0;
    processed = 0;
    render();
    qs("#bp-explain", root).textContent = '';
  };

  window.updateBPRate = () => {
    rate = parseInt(qs("#bp-rate", root).value);
    qs("#bp-rate-val", root).textContent = rate;
  };

  window.updateBPProcess = () => {
    processRate = parseInt(qs("#bp-process", root).value);
    qs("#bp-process-val", root).textContent = processRate;
  };

  window.bpToggleBackpressure = () => {
    backpressure = qs("#bp-backpressure", root).checked;
    qs("#bp-explain", root).textContent = backpressure ? 
      "Backpressure ON: sender will slow down when queue full" : 
      "Backpressure OFF: requests will be dropped when queue full";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 29 — RETRIES AND IDEMPOTENCY
════════════════════════════════════════════════════════════════ */
function initRetries(root) {
  let state = { users: { 1: "Alice" }, nextId: 2 };
  let requestLog = [];
  let idempotencyKeys = new Set();

  function render() {
    qs("#retry-state", root).innerHTML = Object.entries(state.users)
      .map(([id, name]) => `user:${id} = ${name}`)
      .join('<br/>');
    
    qs("#retry-log", root).innerHTML = requestLog
      .map(req => `<div class="log-entry">${req}</div>`)
      .join('');
  }

  window.retryOp = (op) => {
    switch(op) {
      case 'get':
        requestLog.push(`GET /user/1 → ${state.users[1]}`);
        qs("#retry-explain", root).className = "outcome ok";
        qs("#retry-explain", root).textContent = `GET is idempotent: retrying returns same data`;
        break;
        
      case 'delete':
        delete state.users[1];
        requestLog.push(`DELETE /user/1 → success`);
        qs("#retry-explain", root).className = "outcome ok";
        qs("#retry-explain", root).textContent = `DELETE is idempotent: second DELETE also succeeds (but user already gone)`;
        break;
        
      case 'post':
        const newId = state.nextId++;
        state.users[newId] = "New User";
        requestLog.push(`POST /user → created user ${newId}`);
        qs("#retry-explain", root).className = "outcome warn";
        qs("#retry-explain", root).textContent = `POST is NOT idempotent: retrying creates duplicate users!`;
        break;
    }
    render();
  };

  window.retryInjectTimeout = () => {
    requestLog.push(`⚠️ Request timed out - unsure if succeeded`);
    qs("#retry-explain", root).className = "outcome err";
    qs("#retry-explain", root).textContent = `Timeout! Without idempotency, retry might cause duplicate.`;
  };

  window.retryWithIdempotencyKey = () => {
    const key = `req-${Date.now()}`;
    if (idempotencyKeys.has(key)) {
      requestLog.push(`🔑 Idempotency key ${key} already seen → returning cached result`);
    } else {
      idempotencyKeys.add(key);
      state.users[state.nextId++] = "New User";
      requestLog.push(`🔑 First request with key ${key} → created user`);
    }
    render();
    qs("#retry-explain", root).className = "outcome ok";
    qs("#retry-explain", root).textContent = "Idempotency key prevents duplicates on retry";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   LESSON 30 — OBSERVABILITY
════════════════════════════════════════════════════════════════ */
function initObservability(root) {
  let logs = [];
  let metrics = { requests: 0, errors: 0, latencies: [] };
  let traces = [];

  function render() {
    // Logs panel
    const logsEl = qs("#obs-logs", root);
    logsEl.innerHTML = logs.slice(-5).map(log => 
      `<div class="log-line ${log.type}">[${log.time}] ${log.msg}</div>`
    ).join('');
    
    // Metrics panel
    const avgLatency = metrics.latencies.length ?
      (metrics.latencies.reduce((a,b) => a+b, 0) / metrics.latencies.length).toFixed(0) : 0;
    
    qs("#obs-req-count", root).textContent = metrics.requests;
    qs("#obs-err-count", root).textContent = metrics.errors;
    qs("#obs-latency", root).textContent = avgLatency;
    
    // Sparkline
    const spark = qs("#obs-spark", root);
    spark.innerHTML = metrics.latencies.slice(-10).map(l => 
      `<span style="height:${l/5}px" class="spark-bar"></span>`
    ).join('');
    
    // Traces panel
    const tracesEl = qs("#obs-traces", root);
    tracesEl.innerHTML = traces.slice(-3).map(t => 
      `<div class="trace">${t.service} → ${t.duration}ms</div>`
    ).join('');
  }

  window.obsGenerateRequest = () => {
    const latency = Math.floor(Math.random() * 100) + 10;
    const success = Math.random() > 0.1; // 90% success
    
    metrics.requests++;
    metrics.latencies.push(latency);
    if (metrics.latencies.length > 20) metrics.latencies.shift();
    
    const timestamp = new Date().toLocaleTimeString();
    
    if (success) {
      logs.push({ time: timestamp, type: 'info', msg: `GET /api OK (${latency}ms)` });
    } else {
      metrics.errors++;
      logs.push({ time: timestamp, type: 'error', msg: `GET /api FAILED (500)` });
    }
    
    // Generate trace
    traces.push({
      service: 'web',
      duration: latency,
      spans: [
        { service: 'auth', duration: latency * 0.3 },
        { service: 'db', duration: latency * 0.5 }
      ]
    });
    if (traces.length > 5) traces.shift();
    
    render();
  };

  window.obsGenerateError = () => {
    metrics.requests++;
    metrics.errors++;
    
    const timestamp = new Date().toLocaleTimeString();
    logs.push({ time: timestamp, type: 'error', msg: `🔥 Internal Server Error - DB connection failed` });
    
    render();
    qs("#obs-explain", root).textContent = "Error logged and metrics updated";
  };

  window.obsReset = () => {
    logs = [];
    metrics = { requests: 0, errors: 0, latencies: [] };
    traces = [];
    render();
    qs("#obs-explain", root).textContent = "All observability data cleared";
  };

  render();
}

/* ════════════════════════════════════════════════════════════════
   BOOTSTRAP (already included above, but ensure it's at the end)
════════════════════════════════════════════════════════════════ */
// ... (bootstrap code from earlier)
/* ════════════════════════════════════════════════════════════════
   BOOTSTRAP
════════════════════════════════════════════════════════════════ */
function init() {
  buildNav();
  renderLesson();

  // Mobile menu
  document.getElementById("menu-btn").onclick = () => {
    const open = document.getElementById("sidebar").classList.contains("open");
    open ? closeSidebar() : openSidebar();
  };
  document.getElementById("overlay").onclick = closeSidebar;

  // Navigation buttons
  document.getElementById("btn-prev").onclick = prevLesson;
  document.getElementById("btn-next").onclick = nextLesson;
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
