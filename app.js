"use strict";

/* ══════════════════════════════════════════════════
   LESSONS — each lesson has:
   · track, num, title, hook (one-liner why it matters)
   · render(el) — builds the DOM, attaches events
══════════════════════════════════════════════════ */
const LESSONS = [
  /* ─────────────────────────────────────────────
   TRACK 1 — HARDWARE
───────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "01",
    title: 'What even is a "bit"?',
    hook: "Every photo, message, and video on your phone is made of exactly two things: 0 and 1.",

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

  /* ─────────────────────────────────────────────
   02 — BINARY NUMBERS
───────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────
   03 — LOGIC GATES
───────────────────────────────────────────── */
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
        </div>
        <div class="gate-grid" id="gate-grid"></div>
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

  /* ─────────────────────────────────────────────
   04 — CPU FETCH-DECODE-EXECUTE
───────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "04",
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

  /* ─────────────────────────────────────────────
   05 — MEMORY & STORAGE
───────────────────────────────────────────── */
  {
    track: "Hardware",
    num: "05",
    title: "Memory vs Storage — what's the difference?",
    hook: "RAM is your desk. Your hard drive is your filing cabinet.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 1 — Hardware")}
    <h1 class="lesson-title">Memory vs Storage</h1>
    <p class="lesson-hook">RAM is your desk. Your hard drive is your filing cabinet. They serve completely different purposes.</p>

    <p class="prose"><strong>RAM (Random Access Memory)</strong> is where your computer keeps things it's actively working on. It's extremely fast but <em>temporary</em> — it loses everything when power goes off. When you open an app, it gets loaded from storage into RAM so the CPU can reach it quickly.</p>

    <p class="prose"><strong>Storage</strong> (SSD, hard drive) is where things live permanently. Much slower than RAM, but keeps data when the power is off. When you save a file, it moves from RAM to storage.</p>

    <div class="callout warn">
      <div class="callout-title">Speed difference (rough numbers)</div>
      CPU cache: ~1 nanosecond<br/>
      RAM access: ~100 nanoseconds<br/>
      SSD access: ~100,000 nanoseconds (1000× slower than RAM)<br/>
      Hard drive: ~10,000,000 nanoseconds (100,000× slower than RAM)
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">📦</span>
        <span>See how a program loads and runs</span>
      </div>
      <div class="playground-content">
        <p style="font-size:13px;color:var(--muted);margin-bottom:14px">Watch what happens when you "open" an app. Each box is a step in the process.</p>
        <div class="flow-diagram" id="mem-flow"></div>
        <div id="mem-explain" class="outcome" style="min-height:52px"></div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="memStep()">▶ Next Step</button>
          <button class="step-btn" onclick="memReset()">↺ Reset</button>
        </div>
        <div style="margin-top:16px">
          <div style="font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px">RAM contents (64 bytes)</div>
          <div class="mem-grid" id="ram-grid"></div>
        </div>
      </div>
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      When your computer feels "slow," it's often because it's run out of RAM and is swapping data to the much-slower drive. Adding RAM is often the best upgrade you can make.
    </div>
    `;
      initMemory(el);
    },
  },

  /* ─────────────────────────────────────────────
   TRACK 2 — BACKEND
───────────────────────────────────────────── */

  /* ─────────────────────────────────────────────
   06 — WHAT IS A SERVER?
───────────────────────────────────────────── */
  {
    track: "Backend",
    num: "01",
    title: "What is a server, actually?",
    hook: "A server is just a computer that sits around waiting for someone to ask it something.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">What is a server, actually?</h1>
    <p class="lesson-hook">A server is just a computer that sits around waiting for requests — and sends back responses.</p>

    <p class="prose">When you open Instagram, your phone sends a <strong>request</strong> over the internet to Instagram's servers. Those servers look up your photos from a database, and send back a <strong>response</strong>. Your phone displays what it receives. That's it.</p>

    <p class="prose">A server isn't magic hardware — it's the same computer chips you've been learning about. What makes it a "server" is the <em>software</em> running on it: a program that listens for incoming requests and responds to them.</p>

    <div class="callout info">
      <div class="callout-title">Request → Response</div>
      Every interaction with a web app follows this pattern:<br/>
      <strong>Client</strong> (your phone/browser) sends a request → travels over the internet → hits the <strong>Server</strong> → server processes it → sends back a response → client shows the result.
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🌐</span>
        <span>Simulate a request going to a server</span>
      </div>
      <div class="playground-content">
        <div class="flow-diagram" id="req-flow"></div>
        <div id="req-explain" class="outcome" style="min-height:52px">Press "Send Request" to start.</div>
        <div class="step-controls">
          <button class="step-btn primary" id="req-btn" onclick="reqStep()">📤 Send Request</button>
          <button class="step-btn" onclick="reqReset()">↺ Reset</button>
        </div>
        <div style="margin-top:16px" id="req-log-wrap">
          <div style="font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">Log</div>
          <div class="log-box" id="req-log"></div>
        </div>
      </div>
    </div>

    <p class="prose">What you don't see: the server is handling <em>thousands</em> of these requests at the same time — one for every person using the app simultaneously. Making that fast and reliable is what "backend engineering" is about.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      "The cloud" is just other people's computers, waiting for your requests. Every app you use talks to servers dozens of times per minute.
    </div>
    `;
      initRequest(el);
    },
  },

  /* ─────────────────────────────────────────────
   07 — HOW THE INTERNET WORKS
───────────────────────────────────────────── */
  {
    track: "Backend",
    num: "02",
    title: "How data travels across the internet",
    hook: "Your data doesn't travel in one piece. It gets chopped up, sent in chunks, and reassembled.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">How data travels across the internet</h1>
    <p class="lesson-hook">Data doesn't travel in one big blob. It gets chopped into small packets, each finding its own route, then reassembled at the destination.</p>

    <p class="prose">The internet is not a single wire. It's a giant mesh of millions of connected computers and routers. When you send data, it gets split into small chunks called <strong>packets</strong> — typically around 1500 bytes each.</p>

    <p class="prose">Each packet travels independently through the network. Two packets from the same message might take completely different routes and arrive in a different order. The receiving computer reassembles them.</p>

    <div class="callout info">
      <div class="callout-title">TCP — the delivery guarantee</div>
      <strong>TCP (Transmission Control Protocol)</strong> is the system that makes sure all packets arrive and get reassembled correctly. If a packet gets lost, TCP notices and asks for it again. This is why the internet is reliable even though the underlying network isn't.
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">📡</span>
        <span>Watch packets travel (and sometimes get lost)</span>
      </div>
      <div class="playground-content">
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Sending: "HELLO"</div>
          <div id="packet-visual" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"></div>
        </div>
        <div class="flow-diagram" id="net-flow"></div>
        <div id="net-explain" class="outcome">Press Send to break the message into packets.</div>
        <div class="step-controls">
          <button class="step-btn primary" onclick="netStep()">▶ Step</button>
          <button class="step-btn danger" onclick="netDrop()">💥 Drop a packet</button>
          <button class="step-btn" onclick="netReset()">↺ Reset</button>
        </div>
      </div>
    </div>

    <div class="callout warn">
      <div class="callout-title">What about latency?</div>
      Even at the speed of light, a packet from Lagos to New York takes about 70–80 milliseconds. This "round-trip time" is called <strong>latency</strong>. It's why video calls sometimes lag — your voice has to physically travel across the world and back.
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      The internet works because of TCP — a protocol that automatically handles lost packets, ordering, and reassembly. You never have to think about it, but it's happening for every website visit.
    </div>
    `;
      initNetwork(el);
    },
  },

  /* ─────────────────────────────────────────────
   08 — DATABASES
───────────────────────────────────────────── */
  {
    track: "Backend",
    num: "03",
    title: "What is a database?",
    hook: "A database is just a really smart, organised filing system that can answer questions instantly.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">What is a database?</h1>
    <p class="lesson-hook">A database is an organised collection of data that you can search, update and retrieve very quickly — even with millions of records.</p>

    <p class="prose">Without a database, storing data is like having millions of text files with no way to search them. A database gives you structure: tables with rows and columns, plus the ability to ask questions like "find all users who signed up in the last 7 days."</p>

    <div class="callout info">
      <div class="callout-title">SQL — the language of databases</div>
      You talk to most databases using <strong>SQL</strong>. It reads almost like English:<br/>
      <code>SELECT name FROM users WHERE age > 18</code><br/>
      That means: "Give me the name of everyone in the users table who is older than 18."
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🗄</span>
        <span>Query a tiny database</span>
      </div>
      <div class="playground-content">
        <div id="db-table" style="margin-bottom:16px"></div>
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Try a query:</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="step-btn" onclick="dbQuery('all')">Show everyone</button>
            <button class="step-btn" onclick="dbQuery('age')">Age > 25</button>
            <button class="step-btn" onclick="dbQuery('city')">City = Lagos</button>
            <button class="step-btn primary" onclick="dbQuery('new')">Add a new user</button>
          </div>
        </div>
        <div id="db-result" class="outcome">Click a query button above to run it.</div>
        <div class="log-box" id="db-log" style="margin-top:10px"></div>
      </div>
    </div>

    <p class="prose">One of the most important concepts in databases is the <strong>index</strong>. Without an index, finding a user by email means checking every single row — slow. An index is like the index at the back of a book: it lets you jump straight to the right page.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Instagram has billions of photos. Every time you load your feed, a database query runs in milliseconds to find exactly your photos, in the right order. Databases are what make that possible.
    </div>
    `;
      initDB(el);
    },
  },

  /* ─────────────────────────────────────────────
   09 — CACHING
───────────────────────────────────────────── */
  {
    track: "Backend",
    num: "04",
    title: "Caching — why apps are faster the second time",
    hook: "Doing the same work twice is wasteful. A cache remembers the answer so you don't have to ask again.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">Caching — why apps are faster the second time</h1>
    <p class="lesson-hook">A cache is a temporary storage of results you've already computed. Instead of hitting the database every time, you serve the saved answer instantly.</p>

    <p class="prose">Imagine every time you asked "what's 2 + 2?" you had to do the full calculation from scratch. A cache is like writing the answer on a sticky note — next time someone asks, you just read the note.</p>

    <p class="prose">On the web, caches exist everywhere: your browser caches images so it doesn't download them again, CDNs cache files close to users around the world, and app servers cache database results in RAM.</p>

    <div class="callout warn">
      <div class="callout-title">The hard problem: cache invalidation</div>
      The tricky part is knowing when the cached answer is out of date. If someone updates their profile photo, but the old photo is still cached, other users see the old one. Deciding <em>when to clear a cache</em> is one of the hardest problems in engineering.
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">⚡</span>
        <span>See cache hits vs misses</span>
      </div>
      <div class="playground-content">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Cache contents</div>
            <div id="cache-contents" style="font-family:var(--mono);font-size:12px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:12px;min-height:80px"></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Stats</div>
            <div id="cache-stats" class="val-display" style="margin:0;flex-direction:column;gap:6px"></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          ${[
            "user:alice",
            "user:bob",
            "post:123",
            "post:456",
            "user:alice",
            "post:123",
          ]
            .map(
              (k) =>
                `<button class="step-btn" onclick="cacheRequest('${k}')">GET ${k}</button>`,
            )
            .join("")}
        </div>
        <button class="step-btn danger" onclick="cacheClear()">🗑 Clear cache (simulates update)</button>
        <div id="cache-explain" class="outcome" style="margin-top:12px">Click a request above to try it.</div>
      </div>
    </div>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Major websites like Twitter cache aggressively — a popular tweet might be served millions of times from cache without ever hitting the database. The difference between a fast app and a slow one is often just good caching strategy.
    </div>
    `;
      initCache(el);
    },
  },

  /* ─────────────────────────────────────────────
   10 — SCALING
───────────────────────────────────────────── */
  {
    track: "Backend",
    num: "05",
    title: "How apps handle millions of users",
    hook: "One computer isn't enough. Scale means splitting the work across many machines.",

    render(el) {
      el.innerHTML = `
    ${badge("Track 2 — Backend")}
    <h1 class="lesson-title">How apps handle millions of users</h1>
    <p class="lesson-hook">One server can handle maybe a few thousand requests per second. Instagram has a billion users. How?</p>

    <p class="prose">The answer is <strong>horizontal scaling</strong> — instead of one very powerful server, you run dozens (or thousands) of ordinary servers side by side, each handling a share of the traffic.</p>

    <p class="prose">A <strong>load balancer</strong> sits in front of all these servers. When a request arrives, it picks a server that isn't busy and forwards the request to it. From the outside, it still looks like one server.</p>

    <div class="callout info">
      <div class="callout-title">Vertical vs Horizontal scaling</div>
      <strong>Vertical</strong> — buy a bigger, more powerful machine. Cheap and simple, but has a limit.<br/>
      <strong>Horizontal</strong> — add more machines. More complex, but essentially limitless. This is how every large web company scales.
    </div>

    <div class="playground">
      <div class="playground-bar">
        <span class="pb-icon">🔀</span>
        <span>Load balancer simulation</span>
      </div>
      <div class="playground-content">
        <p style="font-size:13px;color:var(--muted);margin-bottom:14px">Requests arrive on the left. The load balancer distributes them across servers. Watch what happens when you increase load or kill a server.</p>
        <div style="display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap">
          <div style="flex-shrink:0">
            <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Incoming requests/sec</div>
            <div class="slider-row" style="margin:0 0 14px">
              <input type="range" min="1" max="30" value="5" id="rps-slider"
                oninput="document.getElementById('rps-val').textContent=this.value;scaleUpdate()"/>
              <span class="slider-val" id="rps-val">5</span>
            </div>
          </div>
        </div>
        <div id="lb-diagram"></div>
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
          <button class="step-btn primary" onclick="scaleAddServer()">+ Add server</button>
          <button class="step-btn danger" onclick="scaleKillServer()">💀 Kill a server</button>
        </div>
        <div id="scale-explain" class="outcome" style="margin-top:12px"></div>
      </div>
    </div>

    <p class="prose">Another important piece: most scaled apps also <strong>separate the database</strong> from the app servers. The database becomes its own cluster with read-replicas — copies that handle queries so the main database doesn't get overwhelmed.</p>

    <div class="callout success">
      <div class="callout-title">Key takeaway</div>
      Netflix runs on over 100,000 servers. When you press play, you're being served by a system that can add or remove servers automatically based on how many people are watching. That's scaling.
    </div>
    `;
      initScale(el);
    },
  },
]; // end LESSONS

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
let currentIdx = 0;
const done = new Set();

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   ROUTER
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   SIDEBAR NAV
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   MOBILE SIDEBAR
══════════════════════════════════════════════════ */
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}
document.getElementById("menu-btn").onclick = () => {
  const open = document.getElementById("sidebar").classList.contains("open");
  open ? closeSidebar() : openSidebar();
};

/* ══════════════════════════════════════════════════
   LESSON 01 — BITS
══════════════════════════════════════════════════ */
function initByte(root) {
  const bits = [1, 0, 1, 0, 0, 1, 0, 1];
  const row = qs("#byte-row", root);
  const vals = qs("#byte-vals", root);

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
  }
  window.L01_flip = (i) => {
    bits[i] ^= 1;
    render();
  };
  render();
}

/* ══════════════════════════════════════════════════
   LESSON 02 — BINARY NUMBERS
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   LESSON 03 — LOGIC GATES
══════════════════════════════════════════════════ */
function initGates(root) {
  let gA = 0,
    gB = 0;
  const gates = [
    { name: "AND", fn: (a, b) => a & b, desc: "Both must be 1" },
    { name: "OR", fn: (a, b) => a | b, desc: "At least one is 1" },
    { name: "NOT", fn: (a, _) => (a ? 0 : 1), desc: "Flips A (ignores B)" },
    { name: "XOR", fn: (a, b) => a ^ b, desc: "Exactly one is 1" },
    { name: "NAND", fn: (a, b) => (a & b ? 0 : 1), desc: "NOT AND" },
    { name: "NOR", fn: (a, b) => (a | b ? 0 : 1), desc: "NOT OR" },
  ];

  function render() {
    qs("#ga", root).className = `mini-bit ${gA ? "b1" : "b0"}`;
    qs("#ga", root).textContent = gA;
    qs("#gb", root).className = `mini-bit ${gB ? "b1" : "b0"}`;
    qs("#gb", root).textContent = gB;
    qs("#gate-grid", root).innerHTML = gates
      .map((g) => {
        const out = g.fn(gA, gB);
        return `<div class="gate-card">
        <div class="gate-name">${g.name}</div>
        <div style="font-size:11px;color:var(--muted)">${g.desc}</div>
        <div class="gate-output">
          <span style="font-size:12px;color:var(--muted)">A=${gA} B=${gB} →</span>
          <span class="gate-result ${out ? "r1" : "r0"}">${out}</span>
          <span class="badge ${out ? "ok" : "err"}" style="font-size:11px">${out ? "ON" : "OFF"}</span>
        </div>
      </div>`;
      })
      .join("");
  }
  window.flipGate = (x) => {
    if (x === "a") gA ^= 1;
    else gB ^= 1;
    render();
  };
  render();
}

/* ══════════════════════════════════════════════════
   LESSON 04 — CPU
══════════════════════════════════════════════════ */
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
    if (pc >= prog.length) {
      qs("#cpu-explain", root).textContent =
        "Program finished! All 4 instructions executed.";
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
  window.cpuReset = () => {
    pc = 0;
    regs = [0, 0, 0, 0];
    phase = 0;
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

/* ══════════════════════════════════════════════════
   LESSON 05 — MEMORY
══════════════════════════════════════════════════ */
function initMemory(root) {
  const STEPS = [
    {
      state: [1, 0, 0, 0],
      box: 0,
      explain:
        "The app sits on your SSD as a file. The CPU needs it in RAM to run it.",
    },
    {
      state: [1, 1, 0, 0],
      box: 1,
      explain:
        "The OS reads the app from SSD into RAM. This takes a moment — SSD is ~1000× slower than RAM.",
    },
    {
      state: [1, 1, 1, 0],
      box: 2,
      explain:
        "The CPU loads instructions from RAM into its cache (L1/L2). Cache is 100× faster than RAM.",
    },
    {
      state: [1, 1, 1, 1],
      box: 3,
      explain:
        "The CPU executes the instructions. The app is running! Everything stays in RAM until you close it.",
    },
  ];
  let step = -1;
  const nodes = ["SSD", "RAM", "CPU Cache", "CPU"];
  const ram = new Array(64).fill(0);

  function renderFlow(active) {
    const flow = qs("#mem-flow", root);
    flow.innerHTML = nodes
      .map(
        (n, i) => `
      <div class="flow-node">
        <div class="flow-box${active >= i ? " active" : ""}">${n}</div>
        <span class="flow-label">${i === 0 ? "permanent" : i === 1 ? "fast+temp" : i === 2 ? "very fast" : ""}</span>
      </div>
      ${i < nodes.length - 1 ? `<div class="flow-arrow${active > i ? " active" : ""}">→</div>` : ""}
    `,
      )
      .join("");
  }
  function renderRAM(filled) {
    const grid = qs("#ram-grid", root);
    for (let i = 0; i < filled; i++) ram[i] = Math.floor(Math.random() * 256);
    grid.innerHTML = ram
      .map(
        (v, i) =>
          `<div class="mem-cell${i < filled ? " hi" : ""}">${i < filled ? v.toString(16).padStart(2, "0") : "··"}</div>`,
      )
      .join("");
  }

  window.memStep = () => {
    step = Math.min(step + 1, STEPS.length - 1);
    const s = STEPS[step];
    renderFlow(step);
    renderRAM(step > 0 ? 32 : 0);
    const exp = qs("#mem-explain", root);
    exp.className = "outcome" + (step === STEPS.length - 1 ? " ok" : "");
    exp.textContent = s.explain;
  };
  window.memReset = () => {
    step = -1;
    renderFlow(-1);
    renderRAM(0);
    qs("#mem-explain", root).className = "outcome";
    qs("#mem-explain", root).textContent = "";
  };
  renderFlow(-1);
  renderRAM(0);
}

/* ══════════════════════════════════════════════════
   LESSON 06 — REQUESTS
══════════════════════════════════════════════════ */
function initRequest(root) {
  let step = -1;
  const STEPS = [
    {
      client: "active",
      server: "",
      arrow: "",
      explain: 'Your phone has an app open. You tap "Load feed".',
    },
    {
      client: "active",
      server: "",
      arrow: "active",
      explain:
        "📤 Request sent! It travels over the internet — through your WiFi router, your ISP, then across the internet backbone.",
    },
    {
      client: "",
      server: "active",
      arrow: "active",
      explain:
        "📥 The server receives your request. It figures out who you are and what you want.",
    },
    {
      client: "",
      server: "active",
      arrow: "",
      explain:
        '🗄 The server queries its database: "Get the 20 most recent posts for this user."',
    },
    {
      client: "active",
      server: "active",
      arrow: "active",
      explain:
        "📬 The server sends back the response — a bundle of data (JSON) describing your posts.",
    },
    {
      client: "ok",
      server: "ok",
      arrow: "",
      explain:
        "✅ Your app receives the data, turns it into the feed you see. Total time: ~200ms.",
    },
  ];

  function render() {
    const s = step < 0 ? { client: "", server: "", arrow: "" } : STEPS[step];
    qs("#req-flow", root).innerHTML = `
      <div class="flow-node">
        <div class="flow-box ${s.client}">📱 Your Phone</div>
        <span class="flow-label">client</span>
      </div>
      <div class="flow-arrow ${s.arrow}">→</div>
      <div class="flow-node">
        <div class="flow-box" style="background:var(--bg2);border-color:var(--border)">🌐 Internet</div>
        <span class="flow-label">~200ms</span>
      </div>
      <div class="flow-arrow ${s.arrow}">→</div>
      <div class="flow-node">
        <div class="flow-box ${s.server}">🖥 Server</div>
        <span class="flow-label">server</span>
      </div>
    `;
    if (step >= 0) {
      const exp = qs("#req-explain", root);
      exp.className = "outcome" + (step === STEPS.length - 1 ? " ok" : "");
      exp.textContent = STEPS[step].explain;
      log(
        "req-log",
        `[step ${step + 1}] ${STEPS[step].explain}`,
        step === STEPS.length - 1 ? "ok" : "info",
      );
    }
  }

  window.reqStep = () => {
    step = Math.min(step + 1, STEPS.length - 1);
    render();
    if (step === STEPS.length - 1) qs("#req-btn", root).textContent = "✓ Done";
  };
  window.reqReset = () => {
    step = -1;
    qs("#req-log", root).innerHTML = "";
    qs("#req-btn", root).textContent = "📤 Send Request";
    qs("#req-explain", root).textContent = 'Press "Send Request" to start.';
    qs("#req-explain", root).className = "outcome";
    render();
  };
  render();
}

/* ══════════════════════════════════════════════════
   LESSON 07 — NETWORK / TCP
══════════════════════════════════════════════════ */
function initNetwork(root) {
  const msg = "HELLO";
  let packets = [];
  let step = 0;

  function resetPackets() {
    packets = msg
      .split("")
      .map((c, i) => ({ id: i, char: c, state: "pending", attempt: 1 }));
  }
  resetPackets();

  function renderPackets() {
    qs("#packet-visual", root).innerHTML = packets
      .map(
        (p) =>
          `<div style="width:44px;height:44px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:16px;font-weight:600;border:2px solid;transition:all .2s;
        background:${p.state === "delivered" ? "var(--green-bg)" : p.state === "lost" ? "var(--red-bg)" : p.state === "transit" ? "var(--accent-bg)" : "var(--bg2)"};
        border-color:${p.state === "delivered" ? "#86efac" : p.state === "lost" ? "#fca5a5" : p.state === "transit" ? "var(--accent)" : "var(--border)"};
        color:${p.state === "delivered" ? "var(--green)" : p.state === "lost" ? "var(--red)" : p.state === "transit" ? "var(--accent)" : "var(--muted)"}">
        ${p.state === "lost" ? "✗" : p.char}</div>`,
      )
      .join("");
  }
  function renderFlow(state) {
    qs("#net-flow", root).innerHTML = `
      <div class="flow-node">
        <div class="flow-box ${state === "sending" ? "active" : ""}">📱 Sender</div>
      </div>
      <div class="flow-arrow ${state === "transit" || state === "sending" ? "active" : ""}">→</div>
      <div class="flow-node">
        <div class="flow-box ${state === "transit" ? "active" : ""}" style="background:var(--bg2)">🌐 Network</div>
      </div>
      <div class="flow-arrow ${state === "delivered" ? "active" : ""}">→</div>
      <div class="flow-node">
        <div class="flow-box ${state === "delivered" ? "ok" : ""}">💻 Receiver</div>
      </div>
    `;
  }

  window.netStep = () => {
    const exp = qs("#net-explain", root);
    if (step === 0) {
      packets.forEach((p) => (p.state = "transit"));
      renderFlow("transit");
      exp.textContent = "Packets are in transit across the network…";
      step = 1;
    } else if (step === 1) {
      const lost = packets.filter((p) => p.state === "lost");
      if (lost.length > 0) {
        exp.className = "outcome err";
        exp.textContent = `⚠ ${lost.length} packet(s) lost! TCP detects this and asks the sender to resend them.`;
        lost.forEach((p) => {
          p.state = "transit";
          p.attempt++;
        });
        step = 1;
      } else {
        packets.forEach((p) => (p.state = "delivered"));
        renderFlow("delivered");
        exp.className = "outcome ok";
        exp.textContent = `✅ All ${packets.length} packets delivered! The receiver reassembles them into "${msg}".`;
        step = 2;
      }
    }
    renderPackets();
  };
  window.netDrop = () => {
    const transit = packets.filter(
      (p) => p.state === "transit" || p.state === "pending",
    );
    if (transit.length > 0) {
      transit[Math.floor(Math.random() * transit.length)].state = "lost";
      renderPackets();
    }
    if (step === 0) {
      packets.forEach((p) => {
        if (p.state === "pending") p.state = "transit";
      });
      renderFlow("transit");
      step = 1;
    }
    qs("#net-explain", root).className = "outcome err";
    qs("#net-explain", root).textContent =
      "💥 A packet was dropped by the network. Step to trigger TCP retransmit.";
  };
  window.netReset = () => {
    step = 0;
    resetPackets();
    renderPackets();
    renderFlow("");
    qs("#net-explain", root).className = "outcome";
    qs("#net-explain", root).textContent =
      "Press Send to break the message into packets.";
  };
  renderPackets();
  renderFlow("");
}

/* ══════════════════════════════════════════════════
   LESSON 08 — DATABASE
══════════════════════════════════════════════════ */
function initDB(root) {
  const users = [
    { id: 1, name: "Amara", age: 28, city: "Lagos" },
    { id: 2, name: "Kwame", age: 22, city: "Accra" },
    { id: 3, name: "Zainab", age: 31, city: "Lagos" },
    { id: 4, name: "Tobias", age: 19, city: "Nairobi" },
    { id: 5, name: "Priya", age: 26, city: "Lagos" },
  ];

  function renderTable(rows) {
    if (!rows.length)
      return '<div style="color:var(--muted);font-size:13px;padding:8px">No rows matched.</div>';
    return `<table style="width:100%;border-collapse:collapse;font-size:13px;font-family:var(--mono)">
      <thead><tr style="border-bottom:2px solid var(--border)">${[
        "id",
        "name",
        "age",
        "city",
      ]
        .map(
          (h) =>
            `<th style="text-align:left;padding:6px 10px;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.06em">${h}</th>`,
        )
        .join("")}</tr></thead>
      <tbody>${rows
        .map(
          (u, ri) =>
            `<tr style="border-bottom:1px solid var(--border);background:${ri % 2 ? "var(--bg2)" : "var(--card)"}">${[
              "id",
              "name",
              "age",
              "city",
            ]
              .map(
                (k) =>
                  `<td style="padding:8px 10px;color:var(--text)">${u[k]}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("")}</tbody>
    </table>`;
  }

  let nextId = users.length + 1;

  window.dbQuery = (type) => {
    const res = qs("#db-result", root);
    const tbl = qs("#db-table", root);
    let rows = [],
      sql = "",
      ms = Math.floor(Math.random() * 8 + 1);
    switch (type) {
      case "all":
        rows = [...users];
        sql = "SELECT * FROM users";
        break;
      case "age":
        rows = users.filter((u) => u.age > 25);
        sql = "SELECT * FROM users WHERE age > 25";
        break;
      case "city":
        rows = users.filter((u) => u.city === "Lagos");
        sql = 'SELECT * FROM users WHERE city = "Lagos"';
        break;
      case "new":
        const newU = {
          id: nextId++,
          name: ["Fatima", "Carlos", "Mei", "Arjun"][
            Math.floor(Math.random() * 4)
          ],
          age: Math.floor(Math.random() * 20 + 18),
          city: ["Lagos", "Accra", "Cairo", "Nairobi"][
            Math.floor(Math.random() * 4)
          ],
        };
        users.push(newU);
        rows = [newU];
        sql = "INSERT INTO users (name,age,city) VALUES (…)";
        break;
    }
    tbl.innerHTML = renderTable(users);
    res.className = "outcome ok";
    res.textContent = `✓ ${rows.length} row(s) returned in ${ms}ms`;
    log("db-log", `> ${sql}`, "info");
    log("db-log", `  → ${rows.length} row(s) in ${ms}ms`, "ok");
  };

  qs("#db-table", root).innerHTML = renderTable(users);
  qs("#db-result", root).textContent = "Click a query button above to run it.";
}

/* ══════════════════════════════════════════════════
   LESSON 09 — CACHE
══════════════════════════════════════════════════ */
function initCache(root) {
  const db = {
    "user:alice": "Alice (profile data)",
    "user:bob": "Bob (profile data)",
    "post:123": "Post #123 content",
    "post:456": "Post #456 content",
  };
  const cache = {};
  let hits = 0,
    misses = 0;

  function renderCache() {
    qs("#cache-contents", root).innerHTML = Object.keys(cache).length
      ? Object.entries(cache)
          .map(
            ([k, v]) =>
              `<div style="color:var(--green);margin-bottom:3px">✓ ${k}</div>`,
          )
          .join("")
      : '<span style="color:var(--light)">empty</span>';
    qs("#cache-stats", root).innerHTML = `
      <div class="val-item"><span class="val-label">Cache hits</span><span class="val-num" style="color:var(--green)">${hits}</span></div>
      <div class="val-item"><span class="val-label">Cache misses</span><span class="val-num" style="color:var(--red)">${misses}</span></div>
      <div class="val-item"><span class="val-label">Hit rate</span><span class="val-num">${hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%</span></div>
    `;
  }

  window.cacheRequest = (key) => {
    const exp = qs("#cache-explain", root);
    if (cache[key]) {
      hits++;
      exp.className = "outcome ok";
      exp.innerHTML = `⚡ <strong>Cache HIT</strong> — "${key}" was in cache. Returned instantly, no database query needed!`;
    } else {
      misses++;
      const ms = Math.floor(Math.random() * 40 + 10);
      cache[key] = db[key];
      exp.className = "outcome";
      exp.innerHTML = `🐌 <strong>Cache MISS</strong> — "${key}" wasn't cached. Queried database (${ms}ms), stored result in cache for next time.`;
    }
    renderCache();
  };
  window.cacheClear = () => {
    Object.keys(cache).forEach((k) => delete cache[k]);
    qs("#cache-explain", root).className = "outcome err";
    qs("#cache-explain", root).textContent =
      "🗑 Cache cleared — all entries invalidated. Next requests will hit the database.";
    renderCache();
  };
  renderCache();
}

/* ══════════════════════════════════════════════════
   LESSON 10 — SCALING
══════════════════════════════════════════════════ */
function initScale(root) {
  let servers = [
    { id: 1, alive: true, load: 0 },
    { id: 2, alive: true, load: 0 },
  ];
  let rps = 5;
  let tick = 0;
  let interval;

  function getCapacity() {
    return servers.filter((s) => s.alive).length * 10;
  }

  function renderLB() {
    const live = servers.filter((s) => s.alive);
    const cap = getCapacity();
    const overloaded = rps > cap;

    qs("#lb-diagram", root).innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
        <div class="flow-node">
          <div class="flow-box ${overloaded ? "error" : "active"}" style="min-width:110px;text-align:center">
            📊 ${rps} req/sec<br/><span style="font-size:11px">${overloaded ? "⚠ Too many!" : "incoming"}</span>
          </div>
        </div>
        <div class="flow-arrow active" style="margin-top:12px">→</div>
        <div class="flow-node">
          <div class="flow-box" style="min-width:90px;text-align:center;background:${overloaded ? "var(--red-bg)" : "var(--accent-bg)"}">
            ⚖ Load<br/>Balancer
          </div>
        </div>
        <div class="flow-arrow active" style="margin-top:12px">→</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${servers
            .map((s) => {
              const load = s.alive
                ? Math.min(100, Math.round((rps / live.length / 10) * 100))
                : 0;
              return `<div class="flow-box ${s.alive ? (load > 80 ? "error" : "ok") : ""}">
              🖥 Server ${s.id} ${s.alive ? "" : "(DOWN)"}<br/>
              <div style="margin-top:4px;background:var(--bg2);border-radius:4px;height:6px;overflow:hidden">
                <div style="height:100%;border-radius:4px;width:${s.alive ? load : 0}%;background:${load > 80 ? "var(--red)" : load > 50 ? "var(--yellow)" : "var(--green)"}"></div>
              </div>
              <span style="font-size:10px;color:var(--muted)">${s.alive ? load + "% load" : "offline"}</span>
            </div>`;
            })
            .join("")}
        </div>
      </div>
    `;

    const exp = qs("#scale-explain", root);
    if (overloaded) {
      exp.className = "outcome err";
      exp.textContent = `⚠ ${rps} req/sec exceeds capacity of ${cap} req/sec. Requests are being dropped or queued. Add more servers!`;
    } else {
      exp.className = "outcome ok";
      exp.textContent = `✓ ${live.length} server(s) handling ${rps} req/sec. Capacity: ${cap} req/sec. System healthy.`;
    }
  }

  window.scaleUpdate = () => {
    rps = +qs("#rps-slider", root).value;
    renderLB();
  };
  window.scaleAddServer = () => {
    servers.push({ id: servers.length + 1, alive: true, load: 0 });
    renderLB();
  };
  window.scaleKillServer = () => {
    const live = servers.filter((s) => s.alive);
    if (live.length > 0) {
      live[Math.floor(Math.random() * live.length)].alive = false;
      renderLB();
    }
  };
  renderLB();
}

/* ══════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════ */
function init() {
  buildNav();
  renderLesson();
}

init();
