(() => {
  const D = window.NISC;
  const view = document.getElementById("view");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Safe storage (private mode can throw)
  const store = {
    get(k, d) { try { const v = localStorage.getItem("nisc:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("nisc:" + k, JSON.stringify(v)); } catch {} },
  };

  // Event times are Eastern; offset is fixed for Nov (EST, -05:00)
  const at = (day, hm) => new Date(`${day}T${hm}:00-05:00`);
  const fmt12 = (hm) => { let [h, m] = hm.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${String(m).padStart(2, "0")} ${ap}`; };
  const dayLabel = (day) => new Date(day + "T12:00:00-05:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" });
  const agenda = D.agenda.map((e, i) => ({ ...e, id: i, s: at(e.day, e.start), e: at(e.day, e.end) }));
  const days = [...new Set(agenda.map((e) => e.day))];
  const compName = { roleplay: "Role Play", speedsell: "Speed Sell", aicase: "AI Case Study", general: "General" };

  let timers = [];
  const clearTimers = () => { timers.forEach(clearInterval); timers = []; };

  // ── Home ────────────────────────────────────────────
  function home() {
    const now = new Date();
    const upcoming = agenda.filter((e) => e.e > now).slice(0, 3);
    view.innerHTML = `
      <section class="hero">
        <div class="hero-logos">
          <img src="assets/logo-nisc.jpg" alt="NISC logo" />
          <span class="x">×</span>
          <img src="assets/logo-shield.jpg" alt="Bryant shield logo" />
        </div>
        <h1>${esc(D.name)}</h1>
        <p>November 13–14, 2026 · ${esc(D.host)}, Smithfield, RI</p>
        <div class="presented">In partnership with ${esc(D.partner)}</div>
        <div id="cd"></div>
      </section>

      <h2>Up next</h2>
      ${upcoming.length ? upcoming.map(eventRow).join("") : `<div class="empty">That's a wrap — thanks for competing at NISC 2026!</div>`}

      <h2>Explore</h2>
      <div class="grid2">
        ${D.competitions.map((c) => `<button class="tile" data-go="compete" data-comp="${c.id}"><div class="ic">${c.icon}</div><b>${esc(c.title)}</b><small>${esc(c.limit)}</small></button>`).join("")}
        <button class="tile" data-go="practice"><div class="ic">⏱️</div><b>Practice Timer</b><small>Rehearse your pitch</small></button>
      </div>`;
    bindStars();
    $$("[data-go]", view).forEach((b) => b.onclick = () => { if (b.dataset.comp) store.set("comp", b.dataset.comp); go(b.dataset.go); });
    const cd = $("#cd");
    const tick = () => {
      const t = Date.now(), s = new Date(D.start), e = new Date(D.end);
      if (t >= e) { cd.innerHTML = `<div class="live-pill" style="--x:0">Competition complete</div>`; return; }
      if (t >= s) { const cur = agenda.find((x) => x.s <= t && x.e > t); cd.innerHTML = `<div class="live-pill">LIVE${cur ? " · " + esc(cur.title) : ""}</div>`; return; }
      let d = Math.floor((s - t) / 1000);
      const parts = [[Math.floor(d / 86400), "days"], [Math.floor(d % 86400 / 3600), "hours"], [Math.floor(d % 3600 / 60), "min"], [d % 60, "sec"]];
      cd.innerHTML = `<div class="countdown">${parts.map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`).join("")}</div>`;
    };
    tick(); timers.push(setInterval(tick, 1000));
  }

  // ── Schedule ────────────────────────────────────────
  function eventRow(e) {
    const now = new Date(), fav = store.get("favs", []);
    const cls = e.e <= now ? "past" : e.s <= now ? "now" : "";
    return `<div class="event ${cls}">
      <div class="time">${fmt12(e.start)}<small>${fmt12(e.end)}</small></div>
      <div><div class="t">${esc(e.title)}</div><div class="p">📍 ${esc(e.place)} · ${dayLabel(e.day)}</div><span class="tag ${e.tag}">${compName[e.tag]}</span></div>
      <button class="star ${fav.includes(e.id) ? "on" : ""}" data-star="${e.id}" aria-label="Save to My Agenda" aria-pressed="${fav.includes(e.id)}">★</button>
    </div>`;
  }
  function bindStars(rerender) {
    $$("[data-star]", view).forEach((b) => b.onclick = () => {
      const id = +b.dataset.star; let f = store.get("favs", []);
      f = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      store.set("favs", f);
      rerender ? rerender() : (b.classList.toggle("on"), b.setAttribute("aria-pressed", f.includes(id)));
    });
  }
  function schedule() {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    let day = store.get("day", days.includes(today) ? today : days[0]);
    let filter = store.get("filter", "all");
    const render = () => {
      const fav = store.get("favs", []);
      const list = agenda.filter((e) => (filter === "mine" ? fav.includes(e.id) : e.day === day && (filter === "all" || e.tag === filter)));
      view.innerHTML = `
        <div class="notice">Times shown are a draft agenda. Always confirm with the official NISC schedule and on-site staff.</div>
        ${filter === "mine" ? "" : `<div class="seg">${days.map((d) => `<button data-day="${d}" class="${d === day ? "active" : ""}">${dayLabel(d)}</button>`).join("")}</div>`}
        <div class="chips">
          ${[["all", "All"], ["mine", "★ My Agenda"], ["roleplay", "Role Play"], ["speedsell", "Speed Sell"], ["aicase", "AI Case"], ["general", "General"]]
            .map(([k, l]) => `<button class="chip ${k === filter ? "active" : ""}" data-f="${k}">${l}</button>`).join("")}
        </div>
        ${list.length ? list.map(eventRow).join("") : `<div class="empty">${filter === "mine" ? "Tap ★ on any session to build your agenda." : "No sessions here."}</div>`}`;
      $$("[data-day]", view).forEach((b) => b.onclick = () => { day = b.dataset.day; store.set("day", day); render(); });
      $$("[data-f]", view).forEach((b) => b.onclick = () => { filter = b.dataset.f; store.set("filter", filter); render(); });
      bindStars(render);
    };
    render();
    timers.push(setInterval(render, 60000));
  }

  // ── Competitions ────────────────────────────────────
  function compete() {
    let sel = store.get("comp", D.competitions[0].id);
    const render = () => {
      const c = D.competitions.find((x) => x.id === sel) || D.competitions[0];
      const sessions = agenda.filter((e) => e.tag === c.id);
      view.innerHTML = `
        <div class="seg">${D.competitions.map((x) => `<button data-c="${x.id}" class="${x.id === c.id ? "active" : ""}">${esc(x.title)}</button>`).join("")}</div>
        <div class="card">
          <div class="comp-head"><div class="ic">${c.icon}</div><div><h3>${esc(c.title)}</h3><div class="limit">${esc(c.limit)}</div></div></div>
          <p>${esc(c.summary)}</p>
          <ul class="tips">${c.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>
        <h2>Sessions</h2>
        ${sessions.map(eventRow).join("") || `<div class="empty">No sessions listed yet.</div>`}`;
      $$("[data-c]", view).forEach((b) => b.onclick = () => { sel = b.dataset.c; store.set("comp", sel); render(); });
      bindStars();
    };
    render();
  }

  // ── Practice ────────────────────────────────────────
  const checklist = ["Read the case twice", "Research the buyer & company", "Prepare 10 discovery questions", "Map features to buyer pains", "Rehearse top 3 objections", "Plan the close & next step", "Print résumés", "Professional attire ready"];
  function practice() {
    const presets = [[60, "1 min"], [180, "3 min"], [600, "10 min"], [1200, "20 min"]];
    let total = store.get("preset", 60), left = total, running = false, iv = null;
    const done = store.get("check", []);
    view.innerHTML = `
      <div class="card timer">
        <h3>Pitch Timer</h3>
        <div class="chips" style="justify-content:center">${presets.map(([s, l]) => `<button class="chip ${s === total ? "active" : ""}" data-p="${s}">${l}</button>`).join("")}</div>
        <div class="clock" id="clock"></div>
        <div class="ring"><div id="bar"></div></div>
        <div class="btnrow"><button class="btn" id="go">Start</button><button class="btn ghost" id="reset">Reset</button></div>
      </div>
      <h2>Prep checklist</h2>
      <div class="card checklist">${checklist.map((t, i) => `<label><input type="checkbox" data-ck="${i}" ${done.includes(i) ? "checked" : ""}/><span>${esc(t)}</span></label>`).join("")}</div>
      <h2>My notes</h2>
      <div class="card"><textarea id="notes" placeholder="Buyer name, key pains, questions to ask, objections to expect…">${esc(store.get("notes", ""))}</textarea><p style="margin-top:8px;font-size:12px">Saved on this device.</p></div>`;
    const clock = $("#clock"), bar = $("#bar"), goBtn = $("#go");
    const draw = () => {
      const a = Math.abs(left), m = Math.floor(a / 60), s = a % 60;
      clock.textContent = `${left < 0 ? "+" : ""}${m}:${String(s).padStart(2, "0")}`;
      clock.className = "clock" + (left < 0 ? " over" : left <= Math.min(15, total * 0.2) ? " warn" : "");
      bar.style.width = Math.min(100, ((total - left) / total) * 100) + "%";
    };
    const stop = () => { running = false; clearInterval(iv); goBtn.textContent = "Start"; };
    goBtn.onclick = () => {
      if (running) return stop();
      running = true; goBtn.textContent = "Pause";
      iv = setInterval(() => { left--; if (left === 0 && navigator.vibrate) navigator.vibrate([200, 100, 200]); draw(); }, 1000);
      timers.push(iv);
    };
    $("#reset").onclick = () => { stop(); left = total; draw(); };
    $$("[data-p]", view).forEach((b) => b.onclick = () => {
      stop(); total = left = +b.dataset.p; store.set("preset", total);
      $$("[data-p]", view).forEach((x) => x.classList.toggle("active", x === b)); draw();
    });
    $$("[data-ck]", view).forEach((c) => c.onchange = () => store.set("check", $$("[data-ck]:checked", view).map((x) => +x.dataset.ck)));
    $("#notes").oninput = (e) => store.set("notes", e.target.value);
    draw();
  }

  // ── Info ────────────────────────────────────────────
  function info() {
    view.innerHTML = `
      <div class="card">
        <div class="logos">
          <img src="assets/logo-shield.jpg" alt="Bryant NISC shield" />
          <img src="assets/logo-nisc.jpg" alt="NISC" />
          <img src="assets/logo-gartner.jpg" alt="Gartner" style="background:#fff" />
        </div>
      </div>
      <h2>Venue</h2>
      <div class="card"><h3>${esc(D.host)}</h3><p>${esc(D.location)}</p><p style="margin-top:10px"><a href="${D.mapUrl}" target="_blank" rel="noopener">Open in Maps →</a></p></div>
      <h2>Contact</h2>
      <div class="card"><p>Questions about registration, school tickets or logistics:</p><p style="margin-top:8px"><a href="mailto:${D.email}">${D.email}</a></p></div>
      <h2>About</h2>
      <div class="card"><p>NISC brings together sales students from universities across the U.S. and Canada to compete in role play, speed selling and — new for 2026 — an AI case study, while connecting with sponsoring employers. The 2025 edition hosted nearly 350 students from 43 universities.</p></div>
      <h2>Links</h2>
      <div class="card linklist">${D.links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>
      <div class="foot">NISC 2026 companion app · Logos used with permission.</div>`;
  }

  // ── Router ──────────────────────────────────────────
  const routes = { home, schedule, compete, practice, info };
  function go(tab) {
    if (!routes[tab]) tab = "home";
    clearTimers();
    $$(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    if (location.hash !== "#" + tab) history.replaceState(null, "", "#" + tab);
    routes[tab]();
    window.scrollTo(0, 0);
  }
  $$(".tabbar button").forEach((b) => b.onclick = () => go(b.dataset.tab));
  window.addEventListener("hashchange", () => go(location.hash.slice(1)));
  go(location.hash.slice(1) || "home");

  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
