/* Paddock FC · lógica del prototipo: rutas, catálogo, filtros, carrito, intro y animaciones. */
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => "$" + n.toFixed(2).replace(".", ","),
  cap = (s) => s[0].toUpperCase() + s.slice(1);
const by = (id) => P.find((p) => p.id === id);
let cart = [],
  cur = 2,
  ord = null,
  tm,
  cpn = 0;
const f = { sp: {}, ty: {}, lv: {}, mx: 15, q: "", o: "pop" };
const any = (o) => Object.values(o).some(Boolean),
  ok = (o, k) => !any(o) || !!o[k];
const card = (p) =>
  `<article class="card pc rv" data-open="${p.id}"><div class="im"><img src="${IMG[p.i]}" alt=""><span class="tg">${SP[p.s]}</span></div><div class="bd"><h3>${p.n}</h3><p class="mu">${cap(p.t)} · ${cap(p.l)}</p><div class="pr">${fmt(p.p)}${p.t === "suscripción" ? "<small> / mes</small>" : ""}</div><button class="btn" data-add="${p.id}">Añadir al carrito</button></div></article>`;
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        const t = e.target;
        const i = [...t.parentNode.children].indexOf(t);
        t.style.transitionDelay = i * 80 + "ms";
        t.classList.add("in");
        io.unobserve(t);
        setTimeout(() => (t.style.transitionDelay = ""), 1400 + i * 80);
        if (t.classList.contains("cnt")) count(t);
      }
    }),
  { threshold: 0.15 },
);
const rv = () => $$(".rv:not(.in),.cnt:not(.dn)").forEach((e) => io.observe(e));
function count(el) {
  el.classList.add("dn");
  const to = +el.dataset.to,
    d = +(el.dataset.d || 0),
    pre = el.dataset.pre || "",
    suf = el.dataset.suf || "",
    w = (t) => (el.textContent = pre + t.toFixed(d).replace(".", ",") + suf);
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return w(to);
  let t0;
  const st = (t) => {
    t0 ??= t;
    const k = Math.min((t - t0) / 1200, 1);
    w(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(st);
  };
  requestAnimationFrame(st);
}
function toast(a, b) {
  $("#tt").textContent = a;
  $("#ts").textContent = b || "";
  $("#toast").classList.add("show");
  clearTimeout(tm);
  tm = setTimeout(() => $("#toast").classList.remove("show"), 2800);
}
function tot() {
  const s = cart.reduce((a, id) => a + by(id).p, 0),
    d = cart.length ? Math.min(1, s) : 0,
    c = cpn ? Math.round((s - d) * 10) / 100 : 0;
  return { s, d, c, t: s - d - c };
}
const sum = () => {
  const t = tot();
  return `<h3 class="h" style="--fs:32px;color:var(--tx)">Resumen</h3><p><span>Subtotal</span><span>${fmt(t.s)}</span></p><p class="gd"><span>Descuento de lanzamiento</span><span>−${fmt(t.d)}</span></p>${t.c ? `<p class="gd"><span>Cupón PADDOCK10 (10%)</span><span>−${fmt(t.c)}</span></p>` : ""}<p class="tt"><span>Total</span><span>${fmt(t.t)}</span></p>`;
};
function upd() {
  const B = $("#bd");
  if (+B.textContent !== cart.length) {
    B.classList.remove("bump");
    void B.offsetWidth;
    B.classList.add("bump");
  }
  B.textContent = cart.length;
  const L = cart.map(by);
  $("#dr").innerHTML =
    `<div class="row" style="justify-content:space-between"><h2 class="h" style="--fs:36px">Tu carrito</h2><button class="lk" data-close aria-label="Cerrar carrito">Cerrar</button></div>` +
    (L.length
      ? L.map(
          (p) =>
            `<div class="li"><img src="${IMG[p.i]}" alt=""><div><b>${p.n}</b><br><span class="mu" style="font-size:13px">${cap(p.t)}</span></div><div style="text-align:right"><b>${fmt(p.p)}</b><br><button class="lk" data-rm="${p.id}">Quitar</button></div></div>`,
        ).join("") +
        `<div class="sm" style="position:static;padding:0;margin-top:auto">${sum()}<a class="btn w" href="#carrito">Ir al carrito</a><button class="btn o w" data-close>Seguir comprando</button></div>`
      : '<p class="mu">Tu carrito está vacío.</p><a class="btn" href="#catalogo" data-sp="all">Explorar el catálogo</a>');
  if ($("[data-v=carrito]").classList.contains("on")) rCart();
  if ($("[data-v=resumen]").classList.contains("on")) rRes();
}
function add(id) {
  if (cart.includes(id)) return toast("Ya está en tu carrito", by(id).n);
  cart.push(id);
  upd();
  toast("Añadido al carrito", by(id).n);
}
function rCart() {
  const L = cart.map(by);
  $("#cl").innerHTML = L.length
    ? L.map(
        (p) =>
          `<div class="card it"><img src="${IMG[p.i]}" alt=""><div><div class="k">${SP[p.s]}</div><h3>${p.n}</h3><span class="mu">${cap(p.t)} · ${cap(p.l)}</span></div><div class="ir"><b>${fmt(p.p)}</b><button class="lk" data-rm="${p.id}">Eliminar</button></div></div>`,
      ).join("")
    : '<p class="mu">Tu carrito está vacío.</p>';
  $("#cs").innerHTML =
    sum() +
    (L.length
      ? `<form class="cpn" id="cpf"><input id="cpi" placeholder="Código de descuento" aria-label="Código de descuento" value="${cpn ? "PADDOCK10" : ""}"><button>${cpn ? "Aplicado" : "Aplicar"}</button></form><small id="cpm">${cpn ? "Cupón aplicado: 10% adicional." : "Prueba con PADDOCK10."}</small><a class="btn w" href="#resumen">Continuar</a>`
      : '<a class="btn w" href="#catalogo" data-sp="all">Explorar el catálogo</a>') +
    '<div class="trust"><span>Activación inmediata en tu cuenta</span><span>Cancela tu plan cuando quieras</span><span>Precios en dólares, sin cargos ocultos</span></div><p style="font-size:12px;display:block;color:var(--mu)">La pasarela de pago no hace parte de este prototipo.</p>';
}
function rRes() {
  const L = cart.map(by);
  $("#rl").innerHTML =
    '<div class="k">TUS PRODUCTOS</div>' +
    (L.length
      ? L.map(
          (p) =>
            `<p style="display:flex;justify-content:space-between"><span>${p.n} <span class="mu">· ${cap(p.t)}</span></span><b>${fmt(p.p)}</b></p>`,
        ).join("")
      : '<p class="mu">Tu carrito está vacío.</p>');
  $("#rs").innerHTML =
    sum() +
    (L.length ? '<button class="btn w" form="fr">Confirmar y pagar</button>' : "") +
    '<a class="btn o w" href="#carrito">Volver al carrito</a><div class="trust"><span>Pago seguro (simulado en el prototipo)</span><span>Acceso inmediato al confirmar</span></div>';
}
function rCat() {
  const L = P.filter(
    (p) =>
      (p.s === "both" || ok(f.sp, p.s)) &&
      ok(f.ty, p.t) &&
      (p.l === "todos" || ok(f.lv, p.l)) &&
      p.p <= f.mx &&
      (p.n + " " + p.d).toLowerCase().includes(f.q),
  );
  if (f.o === "a") L.sort((a, b) => a.p - b.p);
  if (f.o === "d") L.sort((a, b) => b.p - a.p);
  $("#cnt").textContent =
    L.length +
    (L.length === 1 ? " producto" : " productos") +
    (L.length < P.length ? " de " + P.length : "");
  $("#grid").innerHTML = L.length
    ? L.map(card).join("")
    : '<div class="card bd" style="grid-column:1/-1;text-align:center;padding:48px"><h3>Sin resultados</h3><p class="mu">No hay productos con esos filtros.</p><button class="btn o" data-reset style="justify-self:center;margin-top:8px">Limpiar filtros</button></div>';
  $$("[data-f]").forEach((i) => (i.checked = !!f[i.dataset.f][i.value]));
  $("#mx").value = f.mx;
  $("#mx").style.setProperty("--pct", ((f.mx - 1) / 14) * 100 + "%");
  $("#mo").textContent = fmt(f.mx);
  $("#q").value = f.q;
  $("#o").value = f.o;
  const seg = f.sp.fut && !f.sp.f1 ? "fut" : f.sp.f1 && !f.sp.fut ? "f1" : "all";
  $$("[data-seg]").forEach((b) => {
    b.classList.toggle("on", b.dataset.seg === seg);
    b.setAttribute("aria-selected", b.dataset.seg === seg);
  });
  const ch = [],
    N = { fut: "Fútbol", f1: "Fórmula 1" };
  ["sp", "ty", "lv"].forEach((g) =>
    Object.keys(f[g]).forEach((k) => f[g][k] && ch.push([g, k, N[k] || cap(k)])),
  );
  if (f.mx < 15) ch.push(["mx", "", "Hasta " + fmt(f.mx)]);
  if (f.q) ch.push(["q", "", "“" + f.q + "”"]);
  $("#chips").innerHTML = ch.length
    ? ch
        .map(
          (c) =>
            `<button class="chip" data-chip="${c[0]}|${c[1]}">${c[2]}<i aria-hidden="true">✕</i></button>`,
        )
        .join("") + '<button class="lk" data-reset>Limpiar todo</button>'
    : "";
  rv();
}
function rDet() {
  const p = by(cur),
    R = P.filter((x) => x.id !== p.id && (x.s === p.s || x.s === "both" || p.s === "both")).slice(
      0,
      3,
    );
  $("#det").innerHTML =
    `<p class="mu" style="margin-bottom:24px"><a href="#home">Inicio</a> / <a href="#catalogo" data-sp="all">Catálogo</a> / ${p.n}</p><div class="dt"><div class="card pc" style="cursor:default"><div class="im" style="aspect-ratio:4/3"><img src="${IMG[p.i]}" alt="${p.n}"><span class="tg">${cap(p.t).toUpperCase()} · ${SP[p.s]}</span></div></div><div style="display:grid;gap:20px;align-content:start"><div class="k">${SP[p.s]} · ${p.t.toUpperCase()}</div><h1 class="h" style="--fs:clamp(44px,6vw,76px)">${p.n}</h1><div class="big">${fmt(p.p)}<small class="mu" style="font-size:15px;font-weight:400"> ${p.t === "suscripción" ? "/ mes" : "pago único"}</small></div><p class="mu">${p.d}</p><div class="k">QUÉ INCLUYE</div><ul class="mu" style="line-height:2;padding-left:18px">${p.inc.map((x) => "<li>" + x + "</li>").join("")}</ul><div class="row"><button class="btn" style="flex:1" data-add="${p.id}">Añadir al carrito</button><a class="btn o" href="#catalogo" data-sp="all">Ver más</a></div><p class="mu" style="font-size:13px">Acceso inmediato · Contenido en español · Precio en dólares</p></div></div><h2 class="h" style="--fs:44px;margin-top:80px">También te puede interesar</h2><div class="g3">${R.map(card).join("")}</div>`;
  rv();
}
function rOk() {
  const o = ord || { l: [by(7), by(1), by(4)], d: 1, t: 13.47, s: 14.47 };
  $("#oo").innerHTML =
    o.l.map((p) => `<p><span>${p.n}</span><span>${fmt(p.p)}</span></p>`).join("") +
    `<p class="gd"><span>Descuento de lanzamiento</span><span>−${fmt(o.d)}</span></p>${o.c ? `<p class="gd"><span>Cupón PADDOCK10</span><span>−${fmt(o.c)}</span></p>` : ""}<p class="tt"><span>Total</span><span>${fmt(o.t)}</span></p>`;
  const c = $("#cf");
  c.innerHTML = "";
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  for (let i = 0; i < 46; i++) {
    const e = document.createElement("i");
    e.style.cssText = `left:${Math.random() * 100}%;background:${["#E10600", "#C8A24A", "#F5F5F5"][i % 3]};animation-delay:${Math.random() * 1.2}s`;
    c.appendChild(e);
  }
}
function setSp(v, keep) {
  f.sp = v === "fut" ? { fut: 1 } : v === "f1" ? { f1: 1 } : {};
  if (!keep) {
    f.ty = {};
    f.lv = {};
    f.mx = 15;
    f.q = "";
  }
}
function closeDr() {
  document.body.classList.remove("dr");
}
function route() {
  const W = $("#wipe");
  if (!route.f || RMx) {
    route.f = 1;
    return go();
  }
  W.classList.remove("run");
  void W.offsetWidth;
  W.classList.add("run");
  setTimeout(go, 320);
}
const RMx = matchMedia("(prefers-reduced-motion:reduce)").matches;
function go() {
  let h = location.hash.slice(1) || "home",
    sc = null;
  if (h === "planes" || h === "faq") {
    sc = h;
    h = "home";
  }
  if (!$(`[data-v=${h}]`)) h = "home";
  $$("[data-v]").forEach((e) => e.classList.toggle("on", e.dataset.v === h));
  $$("nav a").forEach((a) =>
    a.classList.toggle(
      "on",
      (a.getAttribute("href") === "#" + h && !a.dataset.sp) ||
        (h === "catalogo" && a.dataset.sp === "all"),
    ),
  );
  if (h === "catalogo") rCat();
  if (h === "detalle") rDet();
  if (h === "carrito") rCart();
  if (h === "resumen") rRes();
  if (h === "completada") rOk();
  $$(".stp").forEach((o) => {
    let d = 1;
    [...o.children].forEach((li) => {
      if (li.classList.contains("on")) d = 0;
      li.classList.toggle("dn", d && li.textContent !== "—");
    });
  });
  closeDr();
  if (sc) setTimeout(() => document.getElementById(sc).scrollIntoView({ behavior: "smooth" }), 40);
  else scrollTo(0, 0);
  setTimeout(rv, 60);
}
document.addEventListener("click", (e) => {
  const t = e.target,
    g = (s) => t.closest(s);
  let x;
  if ((x = g("[data-add]"))) {
    e.stopPropagation();
    return add(+x.dataset.add);
  }
  if ((x = g("[data-rm]"))) return ((cart = cart.filter((i) => i !== +x.dataset.rm)), upd());
  if (g("[data-dr]")) return document.body.classList.add("dr");
  if (g("[data-close]")) return closeDr();
  if (g("[data-reset]")) {
    setSp("all");
    return rCat();
  }
  if ((x = g("[data-seg]"))) {
    setSp(x.dataset.seg, 1);
    return rCat();
  }
  if ((x = g("[data-chip]"))) {
    const [gr, k] = x.dataset.chip.split("|");
    if (gr === "mx") f.mx = 15;
    else if (gr === "q") f.q = "";
    else f[gr][k] = 0;
    return rCat();
  }
  if ((x = g("[data-eye]"))) {
    const i = x.parentNode.querySelector("input");
    const sh = i.type === "password";
    i.type = sh ? "text" : "password";
    x.textContent = sh ? "Ocultar" : "Ver";
    x.setAttribute("aria-label", sh ? "Ocultar contraseña" : "Mostrar contraseña");
    return;
  }
  if (g(".totop")) return scrollTo({ top: 0, behavior: "smooth" });
  if ((x = g("[data-sp]"))) {
    setSp(x.dataset.sp);
    if (location.hash === "#catalogo") rCat();
    closeDr();
  }
  if ((x = g("[data-open]"))) {
    cur = +x.dataset.open;
    if (location.hash === "#detalle") rDet();
    else location.hash = "detalle";
  }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.f) {
    f[t.dataset.f][t.value] = t.checked ? 1 : 0;
    rCat();
  }
  if (t.id === "o") {
    f.o = t.value;
    rCat();
  }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "mx") {
    f.mx = +e.target.value;
    rCat();
  }
  if (e.target.id === "q") {
    f.q = e.target.value.toLowerCase();
    rCat();
  }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const t = e.target;
  if (t.id === "cpf") {
    const v = $("#cpi").value.trim().toUpperCase();
    if (v === "PADDOCK10") {
      cpn = 1;
      toast("Cupón aplicado", "10% de descuento adicional");
      rCart();
      upd();
    } else {
      $("#cpm").textContent = "Código no válido. Prueba con PADDOCK10.";
      $("#cpm").style.color = "var(--r)";
    }
    return;
  }
  if (t.id === "fr") {
    ord = { l: cart.map(by), ...tot() };
    cart = [];
    cpn = 0;
    upd();
    location.hash = "completada";
  } else if (t.dataset.toast) {
    toast(t.dataset.toast, "Bienvenido a Paddock FC");
    location.hash = "catalogo";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDr();
});
addEventListener("hashchange", route);
$$("[data-i]").forEach((e) => (e.src = IMG[e.dataset.i]));
$("#feat").innerHTML = [1, 2, 3, 4].map((i) => card(by(i))).join("");
upd();
route();

const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
(() => {
  const hero = $(".hero"),
    pg = $("#prog");
  let tk = 0;
  if (!RM) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      hero.style.setProperty("--tx", -x * 44 + "px");
      hero.style.setProperty("--ty", -y * 26 + "px");
      hero.style.setProperty("--gx", e.clientX - r.left + "px");
      hero.style.setProperty("--gy", e.clientY - r.top + "px");
    });
    new IntersectionObserver(([e]) => hero.classList.toggle("off", !e.isIntersecting)).observe(
      hero,
    );
  }
  addEventListener(
    "scroll",
    () => {
      if (tk) return;
      tk = requestAnimationFrame(() => {
        tk = 0;
        const y = scrollY,
          m = document.documentElement.scrollHeight - innerHeight;
        pg.style.transform = `scaleX(${m > 0 ? y / m : 0})`;
        if (!RM && y < innerHeight * 1.2) hero.style.setProperty("--sy", y * 0.28 + "px");
      });
    },
    { passive: true },
  );
  if (!RM)
    $$("h1.up").forEach((h) => {
      let n = 0;
      const w = (p) =>
        [...p.childNodes].forEach((c) => {
          if (c.nodeType === 3) {
            const f = document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach((s) => {
              if (!s.trim()) {
                f.append(s);
                return;
              }
              const o = document.createElement("span");
              o.className = "wd";
              o.style.setProperty("--i", n++);
              o.textContent = s;
              f.append(o);
            });
            c.replaceWith(f);
          } else if (c.nodeType === 1 && c.tagName !== "BR") w(c);
        });
      w(h);
    });
  if (!RM && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.addEventListener("pointermove", (e) => {
      const c = e.target.closest?.(".card.pc,.card.pg,.card.pl,.card.step"),
        b = e.target.closest?.(".btn");
      if (c) {
        const r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--ry", (x - 0.5) * 14 + "deg");
        c.style.setProperty("--rx", (0.5 - y) * 14 + "deg");
        c.style.setProperty("--mx", x * 100 + "%");
        c.style.setProperty("--my", y * 100 + "%");
      }
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--bx", ((e.clientX - r.left) / r.width - 0.5) * 10 + "px");
        b.style.setProperty("--by", ((e.clientY - r.top) / r.height - 0.5) * 8 + "px");
      }
    });
    document.addEventListener(
      "pointerleave",
      (e) => {
        const n = e.target;
        if (n.matches?.(".card")) {
          n.style.removeProperty("--rx");
          n.style.removeProperty("--ry");
        }
        if (n.matches?.(".btn")) {
          n.style.removeProperty("--bx");
          n.style.removeProperty("--by");
        }
      },
      true,
    );
  }
  const c = $("#w3d");
  if (!c || !window.THREE || RM) return;
  const T = THREE,
    R = new T.WebGLRenderer({ canvas: c, alpha: true, antialias: true }),
    S = new T.Scene(),
    C = new T.PerspectiveCamera(38, 1, 0.1, 50);
  C.position.z = 8;
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  const M = (o) => new T.MeshStandardMaterial(o),
    out = new T.Group(),
    inn = new T.Group();
  out.add(inn);
  S.add(out);
  out.add(
    new T.Mesh(
      new T.TorusGeometry(2, 0.85, 28, 72),
      M({ color: 0x141418, roughness: 0.55, metalness: 0.25 }),
    ),
  );
  inn.add(
    new T.Mesh(
      new T.TorusGeometry(1.4, 0.16, 16, 64),
      M({ color: 0xe10600, metalness: 0.85, roughness: 0.25 }),
    ),
  );
  for (let i = 0; i < 5; i++) {
    const s = new T.Mesh(
      new T.BoxGeometry(0.17, 2.8, 0.1),
      M({ color: 0xc8a24a, metalness: 0.9, roughness: 0.3 }),
    );
    s.rotation.z = (i * Math.PI) / 5;
    inn.add(s);
  }
  inn.add(
    new T.Mesh(
      new T.SphereGeometry(0.38, 24, 16),
      M({ color: 0xc8a24a, metalness: 0.9, roughness: 0.2 }),
    ),
  );
  S.add(new T.AmbientLight(0xffffff, 0.55));
  const d = new T.DirectionalLight(0xffffff, 1.1);
  d.position.set(3, 4, 6);
  S.add(d);
  const p = new T.PointLight(0xe10600, 2.2, 30);
  p.position.set(-5, -2, 4);
  S.add(p);
  let px = 0,
    py = 0,
    vis = true;
  addEventListener("pointermove", (e) => {
    px = e.clientX / innerWidth - 0.5;
    py = e.clientY / innerHeight - 0.5;
  });
  new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(c);
  const fit = () => {
    const w = c.clientWidth || 1;
    R.setSize(w, w, false);
    C.aspect = 1;
    C.updateProjectionMatrix();
  };
  fit();
  addEventListener("resize", fit);
  (function a() {
    requestAnimationFrame(a);
    if (!vis) return;
    inn.rotation.z -= 0.045;
    out.rotation.y += (-0.65 + px * 0.8 - out.rotation.y) * 0.06;
    out.rotation.x += (0.3 + py * 0.5 + scrollY * 0.0004 - out.rotation.x) * 0.06;
    R.render(S, C);
  })();
})();

if (innerWidth < 900) {
  const d = $("#fd");
  if (d) d.open = false;
}
const it = $("#intro"),
  done = () => {
    if (!it.isConnected) return;
    document.body.classList.add("ready");
    it.classList.add("out");
    setTimeout(() => it.remove(), 800);
  };
if (RMx) {
  it.remove();
  document.body.classList.add("ready");
} else {
  const L = $$(".lights span", it),
    lab = $("#ilab");
  L.forEach((l, i) => setTimeout(() => l.classList.add("on"), 250 + i * 330));
  setTimeout(
    () => {
      $(".lights", it).classList.add("go");
      lab.textContent = "¡LUCES FUERA!";
      lab.style.color = "var(--r)";
    },
    250 + 5 * 330 + 420,
  );
  setTimeout(done, 250 + 5 * 330 + 1100);
  $(".skip", it).onclick = done;
}
/* cuenta regresiva */
(() => {
  const end = Date.now() + ((2 * 24 + 14) * 3600 + 36 * 60 + 20) * 1e3,
    B = $$("#cdu b"),
    z = (n) => String(n).padStart(2, "0");
  setInterval(() => {
    let t = Math.max(0, ((end - Date.now()) / 1e3) | 0);
    const v = [(t / 86400) | 0, ((t % 86400) / 3600) | 0, ((t % 3600) / 60) | 0, t % 60];
    B.forEach((b, i) => (b.textContent = z(v[i])));
  }, 1000);
})();
/* header y volver arriba */
addEventListener(
  "scroll",
  () => {
    $("header").classList.toggle("sc", scrollY > 40);
    $(".totop").classList.toggle("on", scrollY > 900);
  },
  { passive: true },
);
