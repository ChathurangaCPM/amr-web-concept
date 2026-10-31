/* =========================================================
   NEXUS M2 — Infinitude Robotics
   Interaction engine (TypeScript port of main.js with cleanup)
   ========================================================= */

export function initInteractions(): () => void {
  type QueryRoot = Document | HTMLElement | SVGElement;
  const $ = <T extends HTMLElement | SVGElement = HTMLElement>(
    s: string,
    c: QueryRoot = document
  ) => c.querySelector<T>(s);
  const $$ = <T extends HTMLElement | SVGElement = HTMLElement>(
    s: string,
    c: QueryRoot = document
  ) => Array.from(c.querySelectorAll<T>(s));
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  const mouse = { x: vw / 2, y: vh / 2, nx: 0.5, ny: 0.5 };
  let disposed = false;

  const progressOf = (el: HTMLElement | SVGElement) => {
    const r = el.getBoundingClientRect();
    const span = r.height - vh;
    return span <= 0 ? clamp(-r.top / vh) : clamp(-r.top / span);
  };
  const inView = (el: HTMLElement | SVGElement | null, pad = 0) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > -pad && r.top < vh + pad;
  };

  /* =======================================================
     TEXT SCRAMBLE
     ======================================================= */
  const GLYPHS = "▓▒░<>/\\[]{}—=+*^?#01ABCDEFXYZ";
  const scramble = (el: HTMLElement) => {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const final = el.textContent || "";
    let frame = 0;
    const total = 28;
    const step = () => {
      if (disposed) return;
      frame++;
      const reveal = Math.floor((frame / total) * final.length);
      el.textContent = final
        .split("")
        .map((c, i) =>
          i < reveal || c === " "
            ? c
            : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        )
        .join("");
      if (frame < total) requestAnimationFrame(step);
      else el.textContent = final;
    };
    step();
  };
  const scrambleIO = new IntersectionObserver(
    (es) =>
      es.forEach(
        (e) =>
          e.isIntersecting &&
          document.body.classList.contains("ready") &&
          scramble(e.target as HTMLElement)
      ),
    { threshold: 0.6 }
  );
  const scrambleAll = () =>
    $$("[data-scramble]").forEach((el) => scrambleIO.observe(el));

  /* =======================================================
     BOOT SEQUENCE
     ======================================================= */
  const boot = $("#boot");
  const bootLines = [
    "INFINITUDE OS v4.2.0 // <b>NEXUS M2</b>",
    "Mounting kernel ........................",
    "Powering LiFePO₄ core · 48.2V",
    "Calibrating LiDAR array [front|rear]",
    "Depth cameras · 4/4 online",
    "Loading SLAM map · warehouse_07.pcd",
    "Spinning up edge AI · path planner",
    "Safety field PL-d · armed",
    "Fleet link handshake · 128 peers",
    "Motor drivers · torque nominal",
    "<b>ALL SYSTEMS NOMINAL — WAKING UP</b>",
  ];
  const runBoot = () => {
    const term = $("#bootTerm");
    const fill = $("#bootFill");
    const pct = $("#bootPct");
    if (!boot || !term || !fill || !pct) {
      document.body.classList.remove("is-booting");
      document.body.classList.add("ready");
      scrambleAll();
      return;
    }
    term.innerHTML = "";
    const total = reduced ? 300 : 2600;
    const start = performance.now();
    let shown = 0;
    let finished = false;
    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      boot.classList.add("done");
      setTimeout(() => {
        if (disposed) return;
        boot.classList.add("open");
        document.body.classList.remove("is-booting");
        document.body.classList.add("ready");
        scrambleAll();
      }, 450);
      setTimeout(() => {
        if (!disposed) boot.classList.add("gone");
      }, 1700);
    };
    boot.addEventListener("click", finish);
    const tick = (now: number) => {
      if (finished || disposed) return;
      const p = clamp((now - start) / total);
      const eased = 1 - Math.pow(1 - p, 2.2);
      fill.style.width = eased * 100 + "%";
      pct.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      const want = Math.floor(eased * bootLines.length);
      while (shown < want) {
        const line = document.createElement("p");
        line.innerHTML = "&gt; " + bootLines[shown];
        if (shown > 0 && shown < bootLines.length - 1) line.className = "ok";
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;
        shown++;
      }
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(finish, 280);
    };
    requestAnimationFrame(tick);
  };

  /* =======================================================
     CURSOR + MAGNETIC
     ======================================================= */
  const ring = $("#cursorRing");
  const dot = $("#cursorDot");
  const cLabel = $("#cursorLabel");
  const ringPos = { x: vw / 2, y: vh / 2 };

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = e.clientX / vw;
    mouse.ny = e.clientY / vh;
    if (dot) dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  };
  window.addEventListener("mousemove", onMouseMove);

  const onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target || !target.closest) return;
    const lab = target.closest<HTMLElement>("[data-cursor]");
    const hov = target.closest("a, button, input, [data-magnetic]");
    document.body.classList.toggle("c-label", !!lab && !hov);
    document.body.classList.toggle("c-hover", !!hov);
    if (lab && cLabel) cLabel.textContent = lab.dataset.cursor || "";
  };
  document.addEventListener("mouseover", onMouseOver);

  if (fine) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 600);
      });
    });
  }

  /* =======================================================
     HERO — LIDAR POINT CLOUD
     ======================================================= */
  const cloud = $<HTMLCanvasElement>("#cloud");
  const cctx = cloud ? cloud.getContext("2d") : null;
  interface CloudPt {
    x: number;
    y: number;
    z: number;
    h: number;
    floor?: number;
  }
  const pts: CloudPt[] = [];
  if (cloud) {
    for (let x = -30; x <= 30; x += 1.25)
      for (let z = -30; z <= 30; z += 1.25) {
        if (Math.hypot(x, z) > 31) continue;
        pts.push({
          x: x + (Math.random() - 0.5) * 0.3,
          y: 0,
          z: z + (Math.random() - 0.5) * 0.3,
          h: 0,
          floor: 1,
        });
      }
    const racks: Array<[number, number, number, number]> = [
      [-18, -14, 14, 2.2],
      [-18, -6, 14, 2.2],
      [-18, 6, 14, 2.2],
      [-18, 14, 14, 2.2],
      [8, -18, 2.2, 12],
      [16, -18, 2.2, 12],
      [10, 8, 14, 2.2],
      [10, 16, 14, 2.2],
    ];
    racks.forEach(([rx, rz, w, d]) => {
      const H = 5 + Math.random() * 2;
      const n = Math.round((w + d) * 9);
      for (let i = 0; i < n; i++) {
        const side = Math.random();
        let x: number, z: number;
        if (side < 0.5) {
          x = rx + Math.random() * w;
          z = rz + (Math.random() < 0.5 ? 0 : d);
        } else {
          x = rx + (Math.random() < 0.5 ? 0 : w);
          z = rz + Math.random() * d;
        }
        const lvl =
          Math.random() < 0.55
            ? Math.floor(Math.random() * 4) * (H / 3)
            : Math.random() * H;
        pts.push({ x, y: lvl, z, h: 0 });
      }
    });
    for (let k = 0; k < 6; k++) {
      const cx = (Math.random() - 0.5) * 40;
      const cz = (Math.random() - 0.5) * 40;
      if (Math.hypot(cx, cz) < 6) continue;
      for (let i = 0; i < 40; i++)
        pts.push({
          x: cx + (Math.random() - 0.5) * 1.4,
          y: Math.random() * 1.6,
          z: cz + (Math.random() - 0.5) * 1.4,
          h: 0,
        });
    }
  }
  const sizeCloud = () => {
    if (!cloud) return;
    cloud.width = cloud.clientWidth * DPR;
    cloud.height = cloud.clientHeight * DPR;
  };
  let yaw = 0.6;
  let yawT = 0.6;
  const drawCloud = (t: number) => {
    if (!cloud || !cctx) return;
    const W = cloud.width;
    const H = cloud.height;
    cctx.clearRect(0, 0, W, H);
    yawT = 0.6 + t * 0.00004 + (mouse.nx - 0.5) * 0.9;
    yaw = lerp(yaw, yawT, 0.05);
    const pitch = 0.38 + (mouse.ny - 0.5) * 0.18;
    const cy_ = Math.cos(yaw);
    const sy_ = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const f = Math.min(W, H) * 1.05;
    const D = 30;
    const cx = W / 2;
    const cy = H * 0.6;
    const sweep = (t * 0.0016) % (Math.PI * 2);
    const sz = 1.6 * DPR;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      let pa = Math.atan2(p.z, p.x);
      if (pa < 0) pa += Math.PI * 2;
      let diff = sweep - pa;
      if (diff < 0) diff += Math.PI * 2;
      if (diff < 0.07) p.h = 1;
      else p.h *= 0.975;

      const x1 = p.x * cy_ - p.z * sy_;
      const z1 = p.x * sy_ + p.z * cy_;
      const y2 = p.y * cp - z1 * sp;
      const z2 = p.y * sp + z1 * cp;
      const depth = z2 + D;
      if (depth < 1) continue;
      const sx = cx + (x1 * f) / depth;
      const sy = cy - (y2 * f) / depth;
      if (sx < 0 || sx > W || sy < 0 || sy > H) continue;
      const fade = clamp(1.4 - depth / 45, 0.08, 1);
      if (p.h > 0.04) {
        cctx.fillStyle = `rgba(255,${(138 + 80 * p.h) | 0},${
          (31 + 120 * p.h * p.h) | 0
        },${clamp(p.h * fade * 1.2)})`;
        const s = sz * (1 + p.h * 0.8);
        cctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      } else {
        cctx.fillStyle = p.floor
          ? `rgba(255,255,255,${fade * 0.13})`
          : `rgba(255,255,255,${fade * 0.38})`;
        cctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
      }
    }
  };

  const heroBot = $("#heroBot");
  const heroWrap = $(".hero-bot-wrap");
  const hwFill = $("#hwFill");
  const heroWord = $(".hero-word");

  /* =======================================================
     MANIFESTO — one statement at a time + right-hand mechanism visualizer
     ======================================================= */
  const mfSlides = $$(".mf-slide");
  const mfVisCards = $$(".mf-vis-card");
  const mfStepBtns = $$<HTMLButtonElement>(".mf-step-btn");
  const mfIdx = $("#mfIdx");
  const mfBar = $("#mfBar");
  let mfActive = -1;

  const setManifestoSlide = (idx: number) => {
    if (idx === mfActive) return;
    mfActive = idx;
    mfSlides.forEach((s, i) => {
      s.classList.toggle("on", i === idx);
      s.classList.toggle("past", i < idx);
    });
    mfVisCards.forEach((v, i) => {
      v.classList.toggle("on", i === idx);
    });
    mfStepBtns.forEach((b, i) => {
      const on = i === idx;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (mfIdx) mfIdx.textContent = String(idx + 1).padStart(2, "0");
    window.dispatchEvent(
      new CustomEvent("manifesto-slide-change", { detail: { index: idx } })
    );
  };

  mfStepBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const mfEl = $("#manifesto");
      if (!mfEl) return;
      const r = mfEl.getBoundingClientRect();
      const absTop = window.scrollY + r.top;
      const scrollable = Math.max(1, r.height - vh);
      const targetP = (i + 0.35) / Math.max(1, mfSlides.length);
      setManifestoSlide(i);
      window.scrollTo({
        top: absTop + scrollable * targetP,
        behavior: "smooth",
      });
    });
  });

  /* =======================================================
     ROUTE — horizontal journey
     ======================================================= */
  const route = $("#route");
  const track = $("#routeTrack");
  const pBase = $<SVGPathElement>("#routeBase");
  const pLive = $<SVGPathElement>("#routeLive");
  const racksG = $<SVGGElement>("#routeRacks");
  const rBot = $("#routeBot");
  const rbOrient = $("#rbOrient");
  const wps = $$(".wp");
  let pathLen = 0;
  let TW = 0;
  let wpLen: number[] = [];
  let rackEls: Array<{ el: SVGRectElement; cx: number; cy: number; lit: boolean }> = [];

  const catmull = (P: Array<[number, number]>) => {
    let d = `M${P[0][0]},${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i];
      const p1 = P[i];
      const p2 = P[i + 1];
      const p3 = P[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  const layoutRoute = () => {
    if (!track || !pBase || !pLive || !racksG) return;
    const narrow = vw < 760;
    const gap = narrow ? vw * 1.05 : vw * 0.95;
    TW = vw * 0.85 + gap * 5;
    track.style.width = TW + "px";
    const ys = [0.45, 0.6, 0.44, 0.6, 0.46];
    const wpPts: Array<[number, number]> = ys.map((y, i) => [
      vw * 0.8 + i * gap,
      vh * y,
    ]);
    const P: Array<[number, number]> = [
      [-100, vh * 0.55],
      [vw * 0.3, vh * 0.56],
      ...wpPts,
      [TW + 200, vh * 0.52],
    ];
    const d = catmull(P);
    pBase.setAttribute("d", d);
    pLive.setAttribute("d", d);
    pathLen = pLive.getTotalLength();
    pLive.style.strokeDasharray = String(pathLen);

    const samples: Array<[number, DOMPoint]> = [];
    for (let l = 0; l <= pathLen; l += 6)
      samples.push([l, pLive.getPointAtLength(l)]);
    wpLen = wpPts.map(([x, y]) => {
      let best = 0;
      let bd = Infinity;
      samples.forEach(([l, p]) => {
        const dd = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (dd < bd) {
          bd = dd;
          best = l;
        }
      });
      return best;
    });
    wps.forEach((w, i) => {
      w.style.transform = `translate(${wpPts[i][0]}px, ${wpPts[i][1]}px)`;
      w.classList.toggle("up", ys[i] < 0.5);
      w.classList.toggle("down", ys[i] >= 0.5);
    });

    racksG.innerHTML = "";
    rackEls = [];
    const NS = "http://www.w3.org/2000/svg";
    const bands = [
      [vh * 0.1, vh * 0.3],
      [vh * 0.76, vh * 0.94],
    ];
    for (let x = 40; x < TW; x += 150) {
      bands.forEach(([y0, y1]) => {
        for (let y = y0; y < y1 - 30; y += 52) {
          const w = 120;
          const h = 34;
          const cx = x + w / 2;
          const cy = y + h / 2;
          let ok = true;
          for (let k = 0; k < samples.length; k += 2) {
            const p = samples[k][1];
            if (Math.abs(p.x - cx) < 140 && Math.abs(p.y - cy) < 95) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;
          const r = document.createElementNS(NS, "rect");
          r.setAttribute("x", String(x));
          r.setAttribute("y", String(y));
          r.setAttribute("width", String(w));
          r.setAttribute("height", String(h));
          r.setAttribute("class", "rack");
          racksG.appendChild(r);
          rackEls.push({ el: r, cx, cy, lit: false });
        }
      });
    }
  };

  const updateRoute = () => {
    if (!route || !inView(route) || !pLive || !rBot || !rbOrient || !track)
      return;
    const p = progressOf(route);
    const L = clamp(p * 1.04 - 0.02) * pathLen;
    pLive.style.strokeDashoffset = String(pathLen - L);
    const pt = pLive.getPointAtLength(L);
    const pt2 = pLive.getPointAtLength(Math.min(pathLen, L + 4));
    const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x);
    rBot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
    rbOrient.style.transform = `rotate(${ang}rad)`;
    const tx = clamp(vw * (vw < 760 ? 0.14 : 0.42) - pt.x, -(TW - vw), 0);
    track.style.transform = `translate3d(${tx}px,0,0)`;
    let reached = 0;
    wps.forEach((w, i) => {
      const on = L >= wpLen[i] - 30;
      w.classList.toggle("on", on);
      if (on) reached++;
    });
    const wpCount = $("#wpCount");
    const wpDist = $("#wpDist");
    if (wpCount) wpCount.textContent = String(reached).padStart(2, "0");
    if (wpDist) wpDist.textContent = (L / 38).toFixed(1);
    rackEls.forEach((r) => {
      const lit = Math.hypot(r.cx - pt.x, r.cy - pt.y) < 260;
      if (lit !== r.lit) {
        r.lit = lit;
        r.el.classList.toggle("lit", lit);
      }
    });
  };

  /* =======================================================
     X-RAY
     ======================================================= */
  const xray = $("#anatomy");
  const xrStage = $("#xrStage");
  const xrPct = $("#xrPct");
  const calls = $$(".xr-call");
  const updateXray = () => {
    if (!xray || !inView(xray) || !xrStage || !xrPct) return;
    const p = clamp((progressOf(xray) - 0.08) / 0.78);
    const pc = p * 100;
    xrStage.style.setProperty("--p", pc.toFixed(2));
    xrPct.textContent = String(Math.round(pc)).padStart(3, "0");
    calls.forEach((c) => c.classList.toggle("on", pc >= +(c.dataset.x || 0)));
  };

  /* =======================================================
     ORBIT
     ======================================================= */
  const orbitScene = $("#orbitScene");
  const orbitRing = $("#orbitRing");
  const cards = $$(".orbit-card");
  const orbitName = $("#orbitName");
  const names = ["FRONT", "PORT", "REAR", "STARBOARD", "ZENITH", "NADIR"];
  let oAng = 0;
  let oVel = 0;
  let dragging = false;
  let lastX = 0;
  let lastFront = -1;
  if (orbitScene) {
    orbitScene.addEventListener("pointerdown", (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      oVel = 0;
      orbitScene.setPointerCapture(e.pointerId);
    });
    orbitScene.addEventListener("pointermove", (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      oVel = dx * 0.25;
      oAng += oVel;
    });
    const endDrag = () => (dragging = false);
    orbitScene.addEventListener("pointerup", endDrag);
    orbitScene.addEventListener("pointercancel", endDrag);
  }
  const updateOrbit = () => {
    if (!orbitScene || !inView(orbitScene) || !orbitRing) return;
    if (!dragging) {
      oVel *= 0.95;
      oAng += oVel + (Math.abs(oVel) < 0.05 ? 0.12 : 0);
    }
    orbitRing.style.transform = `rotateX(-6deg) rotateY(${oAng}deg)`;
    const idx = ((Math.round(-oAng / 60) % 6) + 6) % 6;
    if (idx !== lastFront) {
      lastFront = idx;
      cards.forEach((c, i) => c.classList.toggle("front", i === idx));
      if (orbitName) orbitName.textContent = names[idx];
    }
  };

  /* =======================================================
     DRIVE SIMULATOR
     ======================================================= */
  const dc = $<HTMLCanvasElement>("#driveCanvas");
  const dctx = dc ? dc.getContext("2d") : null;
  const dWrap = $(".drive-wrap");
  const driveSection = $(".drive");
  const CELL = 20;
  let driveSkipped = false;

  if (driveSection) {
    driveSection.addEventListener("contentvisibilityautostatechange", (e: Event) => {
      const cvEvent = e as Event & { skipped?: boolean };
      driveSkipped = !!cvEvent.skipped;
    });
  }

  const sim = {
    W: 0,
    H: 0,
    cols: 0,
    rows: 0,
    obs: [] as Array<{ x: number; y: number; w: number; h: number }>,
    grid: new Uint8Array(0),
    bot: { x: 80, y: 80, a: 0, v: 0 },
    path: [] as Array<[number, number]>,
    target: null as [number, number] | null,
    map: new Map<string, [number, number, number]>(),
    trail: [] as Array<[number, number]>,
    idle: 0,
    manual: false,
    scan: [] as Array<[number, number, boolean]>,
  };

  const rectsHit = (x: number, y: number, pad: number) =>
    sim.obs.some(
      (o) =>
        x > o.x - pad &&
        x < o.x + o.w + pad &&
        y > o.y - pad &&
        y < o.y + o.h + pad
    );

  const buildFloor = () => {
    const { W, H } = sim;
    if (W <= 0 || H <= 0) return;
    sim.obs = [];
    const tries = Math.round((W * H) / 26000);
    let n = 0;
    let guard = 0;
    while (n < tries && guard++ < 600) {
      const horiz = Math.random() < 0.6;
      const w = horiz ? 80 + Math.random() * 160 : 26 + Math.random() * 14;
      const h = horiz ? 26 + Math.random() * 14 : 80 + Math.random() * 140;
      const x = 40 + Math.random() * (W - w - 80);
      const y = 40 + Math.random() * (H - h - 80);
      const clash = sim.obs.some(
        (o) =>
          x < o.x + o.w + 70 &&
          x + w + 70 > o.x &&
          y < o.y + o.h + 70 &&
          y + h + 70 > o.y
      );
      if (clash) continue;
      if (Math.hypot(x + w / 2 - sim.bot.x, y + h / 2 - sim.bot.y) < 120)
        continue;
      sim.obs.push({ x, y, w, h });
      n++;
    }
    sim.cols = Math.ceil(W / CELL);
    sim.rows = Math.ceil(H / CELL);
    sim.grid = new Uint8Array(sim.cols * sim.rows);
    for (let r = 0; r < sim.rows; r++)
      for (let c = 0; c < sim.cols; c++) {
        const x = c * CELL + CELL / 2;
        const y = r * CELL + CELL / 2;
        const wall = x < 28 || y < 28 || x > W - 28 || y > H - 28;
        sim.grid[r * sim.cols + c] = wall || rectsHit(x, y, 26) ? 1 : 0;
      }
    sim.map.clear();
    sim.path = [];
    sim.target = null;
    sim.trail = [];
  };

  const sizeDrive = () => {
    if (!dWrap || !dc) return;
    const r = dWrap.getBoundingClientRect();
    if (
      r.width < 10 ||
      r.height < 10 ||
      (Math.abs(r.width - sim.W) < 2 && Math.abs(r.height - sim.H) < 60)
    )
      return;
    sim.W = r.width;
    sim.H = r.height;
    dc.width = r.width * DPR;
    dc.height = r.height * DPR;
    sim.bot.x = Math.min(sim.bot.x, sim.W - 60);
    sim.bot.y = Math.min(sim.bot.y, sim.H - 60);
    buildFloor();
  };

  const free = (c: number, r: number) =>
    c >= 0 &&
    r >= 0 &&
    c < sim.cols &&
    r < sim.rows &&
    !sim.grid[r * sim.cols + c];
  const nearestFree = (c: number, r: number): [number, number] | null => {
    for (let rad = 0; rad < 12; rad++)
      for (let dy = -rad; dy <= rad; dy++)
        for (let dx = -rad; dx <= rad; dx++)
          if (free(c + dx, r + dy)) return [c + dx, r + dy];
    return null;
  };
  const astar = (
    sc: number,
    sr: number,
    gc: number,
    gr: number
  ): Array<[number, number]> | null => {
    const { cols, rows } = sim;
    const N = cols * rows;
    const g = new Float32Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    const open: Array<[number, number]> = [];
    const s = sr * cols + sc;
    const goal = gr * cols + gc;
    g[s] = 0;
    open.push([Math.hypot(gc - sc, gr - sr), s]);
    const dirs: Array<[number, number, number]> = [
      [1, 0, 1],
      [-1, 0, 1],
      [0, 1, 1],
      [0, -1, 1],
      [1, 1, 1.414],
      [1, -1, 1.414],
      [-1, 1, 1.414],
      [-1, -1, 1.414],
    ];
    let iter = 0;
    while (open.length && iter++ < 20000) {
      let mi = 0;
      for (let i = 1; i < open.length; i++)
        if (open[i][0] < open[mi][0]) mi = i;
      const [, cur] = open.splice(mi, 1)[0];
      if (cur === goal) break;
      if (closed[cur]) continue;
      closed[cur] = 1;
      const cc = cur % cols;
      const cr = (cur / cols) | 0;
      for (const [dx, dy, cost] of dirs) {
        const nc = cc + dx;
        const nr = cr + dy;
        if (!free(nc, nr)) continue;
        if (dx && dy && (!free(cc + dx, cr) || !free(cc, cr + dy))) continue;
        const ni = nr * cols + nc;
        const ng = g[cur] + cost;
        if (ng < g[ni]) {
          g[ni] = ng;
          came[ni] = cur;
          open.push([ng + Math.hypot(gc - nc, gr - nr), ni]);
        }
      }
    }
    if (came[goal] === -1 && goal !== s) return null;
    const out: Array<[number, number]> = [];
    for (let c = goal; c !== -1; c = came[c])
      out.unshift([
        (c % cols) * CELL + CELL / 2,
        ((c / cols) | 0) * CELL + CELL / 2,
      ]);
    return out;
  };
  const lineFree = (a: [number, number], b: [number, number]) => {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.ceil(d / 6);
    for (let i = 0; i <= n; i++) {
      const x = lerp(a[0], b[0], i / n);
      const y = lerp(a[1], b[1], i / n);
      if (!free(Math.floor(x / CELL), Math.floor(y / CELL))) return false;
    }
    return true;
  };
  const smooth = (P: Array<[number, number]>) => {
    if (P.length < 3) return P;
    const out: Array<[number, number]> = [P[0]];
    let i = 0;
    while (i < P.length - 1) {
      let j = P.length - 1;
      while (j > i + 1 && !lineFree(P[i], P[j])) j--;
      out.push(P[j]);
      i = j;
    }
    return out;
  };
  const planTo = (x: number, y: number) => {
    let gc = Math.floor(x / CELL);
    let gr = Math.floor(y / CELL);
    const nf = nearestFree(gc, gr);
    if (!nf) return false;
    [gc, gr] = nf;
    let sc = Math.floor(sim.bot.x / CELL);
    let sr = Math.floor(sim.bot.y / CELL);
    const ns = nearestFree(sc, sr);
    if (!ns) return false;
    [sc, sr] = ns;
    const raw = astar(sc, sr, gc, gr);
    if (!raw) return false;
    raw[0] = [sim.bot.x, sim.bot.y];
    sim.path = smooth(raw).slice(1);
    sim.target = [gc * CELL + CELL / 2, gr * CELL + CELL / 2];
    return true;
  };
  if (dc) {
    dc.addEventListener("click", (e: MouseEvent) => {
      const r = dc.getBoundingClientRect();
      if (planTo(e.clientX - r.left, e.clientY - r.top)) {
        sim.manual = true;
        sim.idle = 0;
      }
    });
  }
  const driveShuffle = $("#driveShuffle");
  if (driveShuffle) {
    driveShuffle.addEventListener("click", () => buildFloor());
  }

  const raycast = (x: number, y: number, a: number, maxR: number) => {
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    let best = maxR;
    if (dx > 0) best = Math.min(best, (sim.W - 4 - x) / dx);
    if (dx < 0) best = Math.min(best, (4 - x) / dx);
    if (dy > 0) best = Math.min(best, (sim.H - 4 - y) / dy);
    if (dy < 0) best = Math.min(best, (4 - y) / dy);
    for (const o of sim.obs) {
      let t0 = -Infinity;
      let t1 = Infinity;
      if (dx !== 0) {
        const a1 = (o.x - x) / dx;
        const a2 = (o.x + o.w - x) / dx;
        t0 = Math.max(t0, Math.min(a1, a2));
        t1 = Math.min(t1, Math.max(a1, a2));
      } else if (x < o.x || x > o.x + o.w) continue;
      if (dy !== 0) {
        const b1 = (o.y - y) / dy;
        const b2 = (o.y + o.h - y) / dy;
        t0 = Math.max(t0, Math.min(b1, b2));
        t1 = Math.min(t1, Math.max(b1, b2));
      } else if (y < o.y || y > o.y + o.h) continue;
      if (t1 >= t0 && t0 > 0 && t0 < best) best = t0;
    }
    return best;
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const driveLogoImg = new Image();
  driveLogoImg.src = "/assets/logo.png";

  const drawBot = (
    ctx: CanvasRenderingContext2D,
    b: { x: number; y: number; a: number; v: number }
  ) => {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.a);
    const L = 56;
    const Wd = 38;
    ctx.shadowColor = "rgba(255,138,31,.5)";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#e8e5df";
    roundRect(ctx, -L / 2, -Wd / 2, L, Wd, 7);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#121212";
    roundRect(ctx, -L / 2 + 3, -Wd / 2 + 3, L - 6, Wd - 6, 5);
    ctx.fill();
    ctx.strokeStyle = "#ff9a33";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ff8a1f";
    ctx.shadowBlur = 10;
    const k = 7;
    const x0 = -L / 2 + 2;
    const y0 = -Wd / 2 + 2;
    const x1 = L / 2 - 2;
    const y1 = Wd / 2 - 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + k);
    ctx.lineTo(x0, y0);
    ctx.lineTo(x0 + k, y0);
    ctx.moveTo(x1 - k, y0);
    ctx.lineTo(x1, y0);
    ctx.lineTo(x1, y0 + k);
    ctx.moveTo(x1, y1 - k);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x1 - k, y1);
    ctx.moveTo(x0 + k, y1);
    ctx.lineTo(x0, y1);
    ctx.lineTo(x0, y1 - k);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.fillRect(L / 2 - 2, -Wd / 2 + 6, 2, 5);
    ctx.fillRect(L / 2 - 2, Wd / 2 - 11, 2, 5);
    ctx.shadowBlur = 0;
    if (driveLogoImg.complete && driveLogoImg.naturalWidth > 0) {
      const lw = 24;
      const lh = lw * (driveLogoImg.naturalHeight / driveLogoImg.naturalWidth);
      ctx.drawImage(driveLogoImg, -lw / 2, -lh / 2, lw, lh);
    }
    ctx.restore();
  };

  let lastSim = performance.now();
  const stepSim = (now: number) => {
    if (driveSkipped || !inView(dWrap, 100) || !dctx) {
      lastSim = now;
      return;
    }
    if (sim.W === 0) sizeDrive();
    if (sim.W === 0) return;

    const dt = Math.min(0.05, (now - lastSim) / 1000);
    lastSim = now;
    const b = sim.bot;

    if (!sim.path.length) {
      sim.idle += dt;
      if (sim.idle > (sim.manual ? 3.5 : 1.2)) {
        for (let k = 0; k < 20; k++) {
          const x = 40 + Math.random() * (sim.W - 80);
          const y = 40 + Math.random() * (sim.H - 80);
          if (Math.hypot(x - b.x, y - b.y) > 220 && planTo(x, y)) {
            sim.manual = false;
            break;
          }
        }
        sim.idle = 0;
      }
    }

    let desiredV = 0;
    if (sim.path.length) {
      const [tx, ty] = sim.path[0];
      const d = Math.hypot(tx - b.x, ty - b.y);
      const want = Math.atan2(ty - b.y, tx - b.x);
      let da = want - b.a;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      b.a += clamp(da, -3.2 * dt, 3.2 * dt);
      const last = sim.path.length === 1;
      desiredV =
        150 *
        clamp(1 - Math.abs(da) / 1.2, 0.05, 1) *
        (last ? clamp(d / 70, 0.15, 1) : 1);
      if (d < (last ? 4 : 18)) {
        sim.path.shift();
        if (!sim.path.length) sim.target = null;
      }
    }
    b.v = lerp(b.v, desiredV, 0.08);
    b.x += Math.cos(b.a) * b.v * dt;
    b.y += Math.sin(b.a) * b.v * dt;
    if (
      sim.trail.length === 0 ||
      Math.hypot(
        sim.trail[sim.trail.length - 1][0] - b.x,
        sim.trail[sim.trail.length - 1][1] - b.y
      ) > 6
    ) {
      sim.trail.push([b.x, b.y]);
      if (sim.trail.length > 140) sim.trail.shift();
    }

    const RAYS = 140;
    const MAXR = 230;
    sim.scan = [];
    for (let i = 0; i < RAYS; i++) {
      const a = b.a + (i / RAYS) * Math.PI * 2;
      const r = raycast(b.x, b.y, a, MAXR);
      const hx = b.x + Math.cos(a) * r;
      const hy = b.y + Math.sin(a) * r;
      sim.scan.push([hx, hy, r < MAXR - 0.5]);
      if (r < MAXR - 0.5) {
        const key = ((hx / 3) | 0) + "," + ((hy / 3) | 0);
        if (!sim.map.has(key)) sim.map.set(key, [hx, hy, now]);
      }
    }

    const ctx = dctx;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, sim.W, sim.H);
    ctx.strokeStyle = "rgba(255,255,255,.04)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < sim.W; x += CELL * 2) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, sim.H);
    }
    for (let y = 0; y < sim.H; y += CELL * 2) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(sim.W, y + 0.5);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.03)";
    sim.obs.forEach((o) => ctx.fillRect(o.x, o.y, o.w, o.h));

    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, MAXR);
    grad.addColorStop(0, "rgba(255,138,31,.22)");
    grad.addColorStop(1, "rgba(255,138,31,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    sim.scan.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,138,31,.07)";
    ctx.beginPath();
    for (let i = 0; i < sim.scan.length; i += 2) {
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(sim.scan[i][0], sim.scan[i][1]);
    }
    ctx.stroke();

    for (const [x, y, t0] of sim.map.values()) {
      const age = (now - t0) / 1000;
      if (age < 0.6) {
        ctx.fillStyle = `rgba(255,${
          (170 + 85 * (1 - age / 0.6)) | 0
        },120,1)`;
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      } else {
        ctx.fillStyle = "rgba(235,232,225,.55)";
        ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
    }

    ctx.fillStyle = "#ff8a1f";
    sim.scan.forEach(
      ([x, y, hit]) => hit && ctx.fillRect(x - 1.5, y - 1.5, 3, 3)
    );

    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    sim.trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();

    if (sim.path.length) {
      ctx.strokeStyle = "#ff8a1f";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -now / 40;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      sim.path.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.stroke();
      ctx.lineDashOffset = 0;
      ctx.fillStyle = "#ff8a1f";
      sim.path.slice(0, -1).forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, 7);
        ctx.fill();
      });
    }
    ctx.setLineDash([]);

    if (sim.target) {
      const [x, y] = sim.target;
      const pulse = (now / 900) % 1;
      ctx.strokeStyle = `rgba(255,138,31,${1 - pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 6 + pulse * 26, 0, 7);
      ctx.stroke();
      ctx.strokeStyle = "#ff8a1f";
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x + 10, y);
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillStyle = "rgba(255,255,255,.7)";
      ctx.fillText(
        `GOAL ${(x / 38).toFixed(1)}, ${(y / 38).toFixed(1)}`,
        x + 14,
        y - 10
      );
    }
    drawBot(ctx, b);

    const dMode = $("#dMode");
    const dSpeed = $("#dSpeed");
    const dRoute = $("#dRoute");
    const dMap = $("#dMap");
    if (dMode)
      dMode.textContent = sim.path.length
        ? sim.manual
          ? "MANUAL GOAL"
          : "AUTO PATROL"
        : "SCANNING";
    if (dSpeed) dSpeed.textContent = (b.v / 75).toFixed(2);
    if (dRoute)
      dRoute.textContent = sim.path.length ? sim.path.length + " WP" : "—";
    if (dMap) dMap.textContent = String(sim.map.size);
  };

  /* =======================================================
     SECTORS / INDUSTRIES
     ======================================================= */
  const secSection = $("#sectors");
  const secViewport = $("#secViewport");
  const secItems = $$(".sec-item");
  const secSlides = $$(".sec-slide");
  const secThumbs = $$(".sec-thumb");
  const secEnvCode = $("#secEnvCode");
  const secHudName = $("#secHudName");
  const secHudFloor = $("#secHudFloor");
  const secHudNav = $("#secHudNav");
  const secMeta = [
    {
      code: "ENV // LOGISTICS_3PL_01",
      name: "LOGISTICS & 3PL",
      floor: "POLISHED EPOXY",
      nav: "DYNAMIC SLAM 20Hz",
    },
    {
      code: "ENV // AUTO_GIGAFACTORY_02",
      name: "AUTOMOTIVE & EV",
      floor: "REINFORCED RESIN",
      nav: "MES SYNC · ±3MM",
    },
    {
      code: "ENV // SEMI_CLEANROOM_03",
      name: "SEMICONDUCTOR FAB",
      floor: "ESD ANTI-STATIC",
      nav: "LOW-JERK · <0.02G",
    },
    {
      code: "ENV // PHARMA_STERILE_04",
      name: "PHARMA & BIO-LAB",
      floor: "SEAMLESS GMP RESIN",
      nav: "STERILE CORRIDOR",
    },
    {
      code: "ENV // AERO_HEAVY_CNC_05",
      name: "AEROSPACE & CNC",
      floor: "SEALED CONCRETE",
      nav: "PRECISION DOCK ±5MM",
    },
  ];
  let secIdx = 0;
  let secTimer = 0;
  let secPaused = false;
  const SEC_DUR = 6200;

  const setSector = (idx: number) => {
    secIdx = (idx + secMeta.length) % secMeta.length;
    secTimer = 0;
    secItems.forEach((el, i) => {
      const on = i === secIdx;
      el.classList.toggle("active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
      const bar = $(".sec-bar", el);
      if (bar && !on) bar.style.transform = "scaleX(0)";
    });
    secSlides.forEach((el, i) => el.classList.toggle("active", i === secIdx));
    secThumbs.forEach((el, i) => el.classList.toggle("active", i === secIdx));
    const m = secMeta[secIdx];
    if (secEnvCode) secEnvCode.textContent = m.code;
    if (secHudName) secHudName.textContent = m.name;
    if (secHudFloor) secHudFloor.textContent = m.floor;
    if (secHudNav) secHudNav.textContent = m.nav;
    if (secViewport) {
      secViewport.classList.remove("scanning");
      void secViewport.offsetWidth;
      secViewport.classList.add("scanning");
    }
  };

  secItems.forEach((el, i) => {
    el.addEventListener("click", () => setSector(i));
    el.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSector(i);
      }
    });
  });
  secThumbs.forEach((el, i) => el.addEventListener("click", () => setSector(i)));
  if (secSection) {
    const grid = $(".sec-grid", secSection);
    if (grid) {
      grid.addEventListener("mouseenter", () => (secPaused = true));
      grid.addEventListener("mouseleave", () => (secPaused = false));
    }
  }
  if (secViewport) {
    secViewport.addEventListener("mousemove", (e: MouseEvent) => {
      const r = secViewport.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      secViewport.style.setProperty("--sx", `${(-nx * 14).toFixed(1)}px`);
      secViewport.style.setProperty("--sy", `${(-ny * 10).toFixed(1)}px`);
    });
    secViewport.addEventListener("mouseleave", () => {
      secViewport.style.setProperty("--sx", "0px");
      secViewport.style.setProperty("--sy", "0px");
    });
  }

  const updateSectors = (dt: number) => {
    if (!secSection || !inView(secSection)) return;
    if (!secPaused) {
      secTimer += dt;
      const p = clamp(secTimer / SEC_DUR);
      const activeBar = $(".sec-item.active .sec-bar", secSection);
      if (activeBar) activeBar.style.transform = `scaleX(${p})`;
      if (secTimer >= SEC_DUR) setSector(secIdx + 1);
    }
  };

  /* =======================================================
     SPECS — counters, sparkline, scope
     ======================================================= */
  const countIO = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const targetEl = e.target as HTMLElement;
        targetEl.classList.add("in");
        const n = $<HTMLElement>("[data-count]", targetEl);
        if (n && !n.dataset.run) {
          n.dataset.run = "1";
          const to = parseFloat(n.dataset.count || "0");
          const dec = +(n.dataset.dec || 0);
          const t0 = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            if (disposed) return;
            const p = clamp((t - t0) / dur);
            const v = to * (1 - Math.pow(1 - p, 4));
            n.textContent = dec
              ? v.toFixed(dec)
              : Math.round(v).toLocaleString("en-US");
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        countIO.unobserve(e.target);
      }),
    { threshold: 0.3 }
  );
  $$(".rv").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
    countIO.observe(el);
  });

  const spark = $<HTMLCanvasElement>(".spark");
  const drawSpark = () => {
    if (!spark) return;
    const x = spark.getContext("2d");
    if (!x) return;
    spark.width = spark.clientWidth * DPR;
    spark.height = spark.clientHeight * DPR;
    const W = spark.width;
    const H = spark.height;
    if (W === 0 || H === 0) return;
    x.strokeStyle = "rgba(255,138,31,.5)";
    x.lineWidth = 1.5 * DPR;
    x.beginPath();
    for (let i = 0; i <= 60; i++) {
      const px = (i / 60) * W;
      const py =
        H *
        (0.85 -
          (i / 60) * 0.55 +
          Math.sin(i * 0.9) * 0.06 +
          (Math.random() - 0.5) * 0.06);
      if (i) x.lineTo(px, py);
      else x.moveTo(px, py);
    }
    x.stroke();
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(255,138,31,.15)");
    g.addColorStop(1, "rgba(255,138,31,0)");
    x.lineTo(W, H);
    x.lineTo(0, H);
    x.closePath();
    x.fillStyle = g;
    x.fill();
  };

  const scope = $<HTMLCanvasElement>("#scope");
  const sctx = scope ? scope.getContext("2d") : null;
  const specsSection = $(".specs");
  let specsSkipped = false;
  if (specsSection) {
    specsSection.addEventListener("contentvisibilityautostatechange", (e: Event) => {
      const cvEvent = e as Event & { skipped?: boolean };
      specsSkipped = !!cvEvent.skipped;
      if (!specsSkipped) drawSpark();
    });
  }

  const drawScope = (t: number) => {
    if (specsSkipped || !scope || !sctx || !inView(scope)) return;
    const W = (scope.width = scope.clientWidth * DPR);
    const H = (scope.height = scope.clientHeight * DPR);
    if (W === 0 || H === 0) return;
    sctx.strokeStyle = "rgba(255,255,255,.06)";
    sctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      sctx.beginPath();
      sctx.moveTo(0, (H * i) / 4);
      sctx.lineTo(W, (H * i) / 4);
      sctx.stroke();
    }
    const wave = (
      color: string,
      amp: number,
      freq: number,
      speed: number,
      phase: number,
      lw: number
    ) => {
      sctx.strokeStyle = color;
      sctx.lineWidth = lw * DPR;
      sctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const u = x / W;
        const y =
          H / 2 +
          Math.sin(u * freq + t * speed + phase) *
            amp *
            H *
            Math.sin(u * Math.PI) +
          Math.sin(u * freq * 3.3 + t * speed * 1.7) * amp * 0.25 * H;
        if (x) sctx.lineTo(x, y);
        else sctx.moveTo(x, y);
      }
      sctx.stroke();
    };
    wave("rgba(255,255,255,.25)", 0.22, 9, 0.002, 1.3, 1);
    wave("#ff8a1f", 0.32, 14, 0.004, 0, 1.6);
  };

  /* =======================================================
     DEPLOY TERMINAL: Handled dynamically with Zod & Gmail SMTP in DeploySection.tsx
     ======================================================= */

  /* =======================================================
     NAV / HUD
     ======================================================= */
  const navLinks = $$<HTMLAnchorElement>(".hud-nav a:not(.hud-cta)");
  const sections = navLinks.map((a) => {
    const href = a.getAttribute("href");
    return href ? $(href) : null;
  });
  const hx = $("#hx");
  const hy = $("#hy");
  const hh = $("#hh");
  const hb = $("#hb");
  const hf = $("#hf");
  const hudProg = $("#hudProg");
  let fpsAcc = 0;
  let fpsN = 0;

  const updateHUD = (dt: number) => {
    const doc = document.documentElement;
    const p = clamp(window.scrollY / Math.max(1, doc.scrollHeight - vh));
    if (hudProg) hudProg.style.transform = `scaleX(${p})`;
    if (hx) hx.textContent = String(Math.round(mouse.x)).padStart(4, "0");
    if (hy)
      hy.textContent = String(Math.round(mouse.y + window.scrollY)).padStart(
        4,
        "0"
      );
    const hdg =
      (Math.atan2(mouse.y - vh / 2, mouse.x - vw / 2) * 180) / Math.PI + 90;
    if (hh)
      hh.textContent =
        String(Math.round((hdg + 360) % 360)).padStart(3, "0") + "°";
    if (hb) hb.textContent = String(Math.round(100 - p * 14));
    fpsAcc += dt;
    fpsN++;
    if (fpsAcc > 500) {
      if (hf) hf.textContent = String(Math.round((fpsN * 1000) / fpsAcc));
      fpsAcc = 0;
      fpsN = 0;
    }
    let active = -1;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < vh * 0.5) active = i;
    });
    navLinks.forEach((a, i) => a.classList.toggle("active", i === active));
  };

  /* =======================================================
     MAIN LOOP
     ======================================================= */
  const hero = $(".hero");
  const mf = $("#manifesto");
  let lastT = performance.now();
  let rafId = 0;

  const loop = (t: number) => {
    if (disposed) return;
    const dt = t - lastT;
    lastT = t;

    ringPos.x = lerp(ringPos.x, mouse.x, 0.18);
    ringPos.y = lerp(ringPos.y, mouse.y, 0.18);
    if (ring) ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;

    if (
      hero &&
      inView(hero) &&
      cloud &&
      hwFill &&
      heroWord
    ) {
      drawCloud(t);
      const sp = clamp(window.scrollY / vh);
      heroWord.style.transform = `translate(-50%, -50%) translateX(${
        -sp * vw * 0.15
      }px)`;
      const wr = heroWord.getBoundingClientRect();
      hwFill.style.setProperty("--mx", mouse.x - wr.left + "px");
      hwFill.style.setProperty("--my", mouse.y - wr.top + "px");
    }

    if (mf && inView(mf)) {
      const p = progressOf(mf);
      const n = mfSlides.length;
      const idx = Math.min(n - 1, Math.floor(p * n));
      setManifestoSlide(idx);
      if (mfBar) mfBar.style.transform = `scaleX(${p})`;
    }

    updateRoute();
    updateXray();
    updateOrbit();
    stepSim(t);
    updateSectors(dt);
    drawScope(t);
    updateHUD(dt);
    rafId = requestAnimationFrame(loop);
  };

  /* =======================================================
     INIT
     ======================================================= */
  const onResize = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    sizeCloud();
    layoutRoute();
    sizeDrive();
    drawSpark();
  };
  let rT: ReturnType<typeof setTimeout>;
  const handleResize = () => {
    clearTimeout(rT);
    rT = setTimeout(onResize, 150);
  };
  window.addEventListener("resize", handleResize);

  onResize();
  rafId = requestAnimationFrame(loop);
  runBoot();

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    clearTimeout(rT);
    window.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseover", onMouseOver);
    window.removeEventListener("resize", handleResize);
    scrambleIO.disconnect();
    countIO.disconnect();
  };
}
