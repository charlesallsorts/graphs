const $ = (id) => document.getElementById(id);

const h = (t, a = {}, ...c) => {
  const e = document.createElement(t);
  for (const k in a) {
    if (k.startsWith("on")) e[k] = a[k];
    else if (k === "class") e.className = a[k];
    else e.setAttribute(k, a[k]);
  }
  e.append(...c);
  return e;
};

let nodes = [
  {
    name: "API",
    weight: "10",
    details: [
      ["lang", "python"],
      ["owner", "team-a"],
    ],
    conns: [
      ["DB", ""],
      ["Cache", ""],
    ],
  },
  {
    name: "DB",
    weight: "8",
    details: [["engine", "postgres"]],
    conns: [],
  },
  {
    name: "Cache",
    weight: "4",
    details: [["engine", "redis"]],
    conns: [["DB", "2"]],
  },
  {
    name: "Worker",
    weight: "6",
    details: [],
    conns: [
      ["DB", "3"],
      ["API", ""],
    ],
  },
];

const cv = (v) => {
  v = v.trim();
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v === "true") return true;
  if (v === "false") return false;
  return v;
};

const cw = (v) => {
  v = String(v).trim();
  if (v === "") return null;
  const n = Number(v);
  return isNaN(n) ? v : n;
};

function toDicts() {
  return nodes
    .filter((n) => n.name.trim())
    .map((n) => ({
      node_name: n.name.trim(),
      weight: Number(n.weight) || 1,
      details: Object.fromEntries(
        n.details
          .filter((d) => d[0].trim())
          .map((d) => [d[0].trim(), cv(d[1])])
      ),
      connection: n.conns
        .filter((c) => c[0].trim())
        .map((c) => {
          const w = cw(c[1]);
          return w === null ? c[0].trim() : { to: c[0].trim(), weight: w };
        }),
    }));
}

function py(v) {
  if (v === null || v === undefined) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(py).join(", ") + "]";
  return (
    "{" +
    Object.entries(v)
      .map(([k, x]) => JSON.stringify(k) + ": " + py(x))
      .join(", ") +
    "}"
  );
}

function dictText() {
  return toDicts()
    .map(
      (d) =>
        "{" +
        Object.entries(d)
          .map(([k, v]) => `"${k}": ${py(v)}`)
          .join(",\n ") +
        "}"
    )
    .join("\n\n");
}

// ---- form UI
function render() {
  const f = $("form");
  f.innerHTML = "";

  nodes.forEach((n, i) => {
    const det = h("div", { class: "card", style: "border:0;padding:0" });
    const con = h("div", { class: "card", style: "border:0;padding:0" });

    n.details.forEach((d, j) =>
      det.append(
        h(
          "div",
          { class: "row" },
          h("input", {
            placeholder: "key",
            value: d[0],
            oninput: (e) => {
              d[0] = e.target.value;
              changed();
            },
          }),
          h("input", {
            placeholder: "value",
            value: d[1],
            oninput: (e) => {
              d[1] = e.target.value;
              changed();
            },
          }),
          h(
            "button",
            {
              class: "x",
              title: "Remove",
              onclick: () => {
                n.details.splice(j, 1);
                render();
                changed();
              },
            },
            "×"
          )
        )
      )
    );

    n.conns.forEach((c, j) =>
      con.append(
        h(
          "div",
          { class: "row" },
          h("input", {
            placeholder: "connects to…",
            list: "names",
            value: c[0],
            oninput: (e) => {
              c[0] = e.target.value;
              changed();
            },
          }),
          h("input", {
            class: "w",
            type: "number",
            placeholder: "weight",
            value: c[1],
            oninput: (e) => {
              c[1] = e.target.value;
              changed();
            },
          }),
          h(
            "button",
            {
              class: "x",
              title: "Remove",
              onclick: () => {
                n.conns.splice(j, 1);
                render();
                changed();
              },
            },
            "×"
          )
        )
      )
    );

    f.append(
      h(
        "div",
        { class: "card" },
        h(
          "div",
          { class: "row" },
          h("input", {
            placeholder: "node_name",
            value: n.name,
            style: "font-weight:600",
            oninput: (e) => {
              n.name = e.target.value;
              changed();
            },
          }),
          h("input", {
            class: "w",
            type: "number",
            placeholder: "weight",
            value: n.weight,
            oninput: (e) => {
              n.weight = e.target.value;
              changed();
            },
          }),
          h(
            "button",
            {
              class: "x",
              title: "Delete node",
              onclick: () => {
                nodes.splice(i, 1);
                render();
                changed();
              },
            },
            "×"
          )
        ),
        h(
          "div",
          { class: "lbl" },
          "details",
          h(
            "button",
            {
              class: "s sm",
              onclick: () => {
                n.details.push(["", ""]);
                render();
              },
            },
            "+ detail"
          )
        ),
        det,
        h(
          "div",
          { class: "lbl" },
          "connection",
          h(
            "button",
            {
              class: "s sm",
              onclick: () => {
                n.conns.push(["", ""]);
                render();
              },
            },
            "+ connection"
          )
        ),
        con
      )
    );
  });

  f.append(
    h(
      "button",
      {
        class: "s",
        onclick: () => {
          nodes.push({ name: "", weight: "1", details: [], conns: [] });
          render();
          f.lastElementChild.previousElementSibling.querySelector("input").focus();
        },
      },
      "+ Add node"
    )
  );
}

let t;
function changed() {
  $("names").innerHTML = "";
  nodes.forEach((n) => {
    if (n.name.trim()) $("names").append(h("option", { value: n.name.trim() }));
  });
  $("out").value = dictText();
  clearTimeout(t);
  t = setTimeout(() => update(false), 250);
}

// ---- dict -> form
function parsePy(s) {
  let i = 0;
  const n = s.length;

  const err = (m) => {
    const l = s.slice(0, i).split("\n").length;
    throw new Error(`Line ${l}: ${m}`);
  };

  const ws = () => {
    for (;;) {
      while (i < n && /\s/.test(s[i])) i++;
      if (s[i] === "#") {
        while (i < n && s[i] !== "\n") i++;
      } else break;
    }
  };

  function val() {
    ws();
    const c = s[i];
    if (c === undefined) err("unexpected end");

    if (c === "{") {
      i++;
      const o = {};
      for (;;) {
        ws();
        if (s[i] === "}") {
          i++;
          return o;
        }
        const k = val();
        ws();
        if (s[i] !== ":") err("expected ':' after key");
        i++;
        ws();
        if (s[i] === "}" || s[i] === "," || s[i] === undefined)
          err("missing value for key " + JSON.stringify(k));
        o[k] = val();
        ws();
        if (s[i] === ",") i++;
        else if (s[i] !== "}") err("expected ',' or '}'");
      }
    }

    if (c === "[" || c === "(") {
      const e = c === "[" ? "]" : ")";
      i++;
      const a = [];
      for (;;) {
        ws();
        if (s[i] === e) {
          i++;
          return a;
        }
        if (s[i] === undefined) err("unclosed " + c);
        a.push(val());
        ws();
        if (s[i] === ",") i++;
        else if (s[i] !== e) err("expected ',' or '" + e + "'");
      }
    }

    if (c === '"' || c === "'") {
      let r = "";
      i++;
      while (i < n && s[i] !== c) {
        if (s[i] === "\\") {
          i++;
          const m = { n: "\n", t: "\t" };
          r += m[s[i]] || s[i];
        } else r += s[i];
        i++;
      }
      if (i >= n) err("unclosed string");
      i++;
      return r;
    }

    const rx = (re) => {
      re.lastIndex = i;
      const m = re.exec(s);
      if (m) {
        i += m[0].length;
        return m[0];
      }
      return null;
    };

    let x = rx(/-?\d+(\.\d+)?([eE][+-]?\d+)?/y);
    if (x !== null) return parseFloat(x);

    x = rx(/[A-Za-z_][\w.]*/y);
    if (x !== null) {
      return x === "True" ? true : x === "False" ? false : x === "None" ? null : x;
    }

    err("unexpected '" + c + "'");
  }

  const o = [];
  for (;;) {
    ws();
    while (s[i] === ",") {
      i++;
      ws();
    }
    if (i >= n) break;
    const v = val();
    if (Array.isArray(v)) o.push(...v);
    else if (v && typeof v === "object") o.push(v);
    else err("top level must be dicts");
  }
  return o;
}

function conList(d) {
  let c = d.connection ?? d.connections ?? d.edges ?? d.links ?? d.to ?? [];
  if (c === null) c = [];
  const list = [];

  if (typeof c === "string" || typeof c === "number") {
    list.push([c, null]);
  } else if (Array.isArray(c)) {
    for (const e of c) {
      if (e && typeof e === "object" && !Array.isArray(e)) {
        list.push([e.to ?? e.target ?? e.node ?? e.name, e.weight ?? e.w ?? null]);
      } else if (Array.isArray(e)) {
        list.push([e[0], e[1] ?? null]);
      } else {
        list.push([e, null]);
      }
    }
  } else {
    for (const [k, v] of Object.entries(c)) {
      list.push([k, v && typeof v === "object" ? v.weight ?? null : v]);
    }
  }

  return list.filter(([to]) => to !== undefined && to !== null);
}

const nameOf = (d, i) => {
  let nm = d.node_name ?? d.name ?? d.id ?? d.label;
  if (nm && typeof nm === "object") nm = Object.keys(nm)[0];
  return String(nm ?? "node " + (i + 1));
};

function applyDicts() {
  try {
    const ds = parsePy($("out").value);
    nodes = ds.map((d, i) => {
      const det = d.details ?? d.detils ?? d.detail ?? {};
      return {
        name: nameOf(d, i),
        weight: String(Number(d.weight) || 1),
        details: Object.entries(det).map(([k, v]) => [
          k,
          typeof v === "object" && v !== null ? JSON.stringify(v) : String(v),
        ]),
        conns: conList(d).map(([to, w]) => [String(to), w == null ? "" : String(w)]),
      };
    });
    render();
    changed();
  } catch (e) {
    setSt(e.message, true);
  }
}

// ---- graph model
function build(dicts) {
  const nm = new Map();
  const edges = [];

  const get = (name, implicit) => {
    if (!nm.has(name)) {
      nm.set(name, {
        name,
        weight: 1,
        details: {},
        implicit,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        vx: 0,
        vy: 0,
      });
    }
    return nm.get(name);
  };

  dicts.forEach((d, i) => {
    const name = nameOf(d, i);
    const nd = get(name);
    nd.implicit = false;
    nd.weight = Number(d.weight) || 1;
    nd.details = d.details ?? {};
    for (const [to, w] of conList(d)) edges.push({ s: name, t: String(to), w });
  });

  for (const e of edges) get(e.t, true);

  return {
    nodes: [...nm.values()],
    edges: edges.map((e) => ({ ...e, a: nm.get(e.s), b: nm.get(e.t) })),
  };
}

// ---- render + force sim
const svg = $("svg");
const g = $("g");
const NS = "http://www.w3.org/2000/svg";

let G = { nodes: [], edges: [] };
let alpha = 1;
let view = { x: 0, y: 0, k: 1 };
let sel = null;
let raf = 0;

const el = (t, a = {}) => {
  const e = document.createElementNS(NS, t);
  for (const k in a) e.setAttribute(k, a[k]);
  return e;
};

const rad = (n) => 9 + Math.min(26, Math.sqrt(n.weight) * 3.2);

function center() {
  const r = svg.getBoundingClientRect();
  view.x = r.width / 2;
  view.y = r.height / 2;
  view.k = 1;
  apply();
}

const apply = () =>
  g.setAttribute("transform", `translate(${view.x},${view.y}) scale(${view.k})`);

function draw() {
  g.innerHTML = "";

  G.edges.forEach((e) => {
    e.l = el("line", {
      stroke: "var(--dim)",
      "stroke-width": 1.4,
      "marker-end": "url(#ar)",
    });
    g.appendChild(e.l);
    if (e.w !== null && e.w !== undefined) {
      e.t2 = el("text", { class: "ew", "text-anchor": "middle" });
      e.t2.textContent = e.w;
      g.appendChild(e.t2);
    }
  });

  G.nodes.forEach((n) => {
    const grp = el("g", { style: "cursor:pointer" });

    n.c = el("circle", {
      r: rad(n),
      fill: n.implicit ? "var(--panel)" : "var(--acc)",
      "fill-opacity": n.implicit ? 1 : 0.85,
      stroke: n.implicit ? "var(--dim)" : "var(--acc)",
      "stroke-width": 2,
      "stroke-dasharray": n.implicit ? "4 3" : "none",
    });

    n.tx = el("text", { "text-anchor": "middle", dy: rad(n) + 13 });
    n.tx.textContent = n.name;

    grp.append(n.c, n.tx);
    g.appendChild(grp);
    n.grp = grp;

    grp.addEventListener("pointerdown", (ev) => {
      ev.stopPropagation();
      grp.setPointerCapture(ev.pointerId);
      n.drag = true;
      select(n);
      alpha = Math.max(alpha, 0.3);
      kick();
    });

    grp.addEventListener("pointermove", (ev) => {
      if (!n.drag) return;
      const r = svg.getBoundingClientRect();
      n.x = (ev.clientX - r.left - view.x) / view.k;
      n.y = (ev.clientY - r.top - view.y) / view.k;
      n.vx = n.vy = 0;
      alpha = Math.max(alpha, 0.3);
      kick();
    });

    grp.addEventListener("pointerup", () => {
      n.drag = false;
    });
  });

  paint();
}

function paint() {
  G.edges.forEach((e) => {
    const a = e.a;
    const b = e.b;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const rb = a === b ? 0 : rad(b) + 3;

    e.l.setAttribute("x1", a.x);
    e.l.setAttribute("y1", a.y);
    e.l.setAttribute("x2", b.x - (dx / d) * rb);
    e.l.setAttribute("y2", b.y - (dy / d) * rb);

    if (e.t2) {
      e.t2.setAttribute("x", (a.x + b.x) / 2);
      e.t2.setAttribute("y", (a.y + b.y) / 2 - 4);
    }
  });

  G.nodes.forEach((n) => {
    n.grp.setAttribute("transform", `translate(${n.x},${n.y})`);
    n.c.setAttribute("stroke-width", n === sel ? 4 : 2);
  });
}

function step() {
  const N = G.nodes;

  // repulsion between all node pairs
  for (let i = 0; i < N.length; i++) {
    for (let j = i + 1; j < N.length; j++) {
      const a = N[i];
      const b = N[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const d2 = dx * dx + dy * dy || 0.01;
      const d = Math.sqrt(d2);
      const f = Math.min(9000 / d2, 30) * alpha;
      dx /= d;
      dy /= d;
      a.vx -= dx * f;
      a.vy -= dy * f;
      b.vx += dx * f;
      b.vy += dy * f;
    }
  }

  // spring attraction along edges
  for (const e of G.edges) {
    if (e.a === e.b) continue;
    const a = e.a;
    const b = e.b;
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const f = (d - 130) * 0.02 * alpha;
    dx /= d;
    dy /= d;
    a.vx += dx * f;
    a.vy += dy * f;
    b.vx -= dx * f;
    b.vy -= dy * f;
  }

  // centering, damping, integration
  for (const n of N) {
    n.vx -= n.x * 0.01 * alpha;
    n.vy -= n.y * 0.01 * alpha;
    n.vx *= 0.8;
    n.vy *= 0.8;
    if (!n.drag) {
      n.x += n.vx;
      n.y += n.vy;
    }
  }

  alpha *= 0.985;
  paint();
}

function kick() {
  if (!raf) raf = requestAnimationFrame(loop);
}

function loop() {
  raf = 0;
  step();
  if (alpha > 0.01 || G.nodes.some((n) => n.drag)) {
    raf = requestAnimationFrame(loop);
  }
}

function select(n) {
  sel = n;
  const i = $("info");
  const out = G.edges
    .filter((e) => e.a === n)
    .map((e) => e.t + (e.w != null ? ` (${e.w})` : ""));
  const inn = G.edges.filter((e) => e.b === n).map((e) => e.s);

  i.style.display = "block";
  i.innerHTML = "";

  const hd = document.createElement("h4");
  hd.textContent = n.name;
  i.appendChild(hd);

  const p = document.createElement("div");
  p.textContent = `weight: ${n.implicit ? "—" : n.weight} · out: ${
    out.join(", ") || "none"
  } · in: ${inn.join(", ") || "none"}`;
  i.appendChild(p);

  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(n.details, null, 2);
  i.appendChild(pre);

  paint();
}

// ---- pan / zoom
let pan = null;

svg.addEventListener("pointerdown", (e) => {
  pan = { x: e.clientX - view.x, y: e.clientY - view.y };
  svg.setPointerCapture(e.pointerId);
  sel = null;
  $("info").style.display = "none";
  paint();
});

svg.addEventListener("pointermove", (e) => {
  if (!pan) return;
  view.x = e.clientX - pan.x;
  view.y = e.clientY - pan.y;
  apply();
});

svg.addEventListener("pointerup", () => (pan = null));

svg.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const r = svg.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const f = e.deltaY < 0 ? 1.1 : 0.9;
    view.x = mx - (mx - view.x) * f;
    view.y = my - (my - view.y) * f;
    view.k *= f;
    apply();
  },
  { passive: false }
);

// ---- update
const st = $("st");

function setSt(m, e) {
  st.className = e ? "e" : "";
  st.textContent = m;
}

function update(relayout) {
  const old = new Map(G.nodes.map((n) => [n.name, n]));
  G = build(toDicts());

  if (!relayout) {
    G.nodes.forEach((n) => {
      const o = old.get(n.name);
      if (o) {
        n.x = o.x;
        n.y = o.y;
      }
    });
  }

  sel = null;
  $("info").style.display = "none";
  draw();
  alpha = relayout ? 1 : 0.5;
  kick();

  setSt(
    `${G.nodes.length} nodes · ${G.edges.length} edges` +
      (G.nodes.some((n) => n.implicit) ? " · dashed = referenced but not defined" : "")
  );
}

// ---- buttons
$("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("out").value);
    setSt("Copied dicts to clipboard");
  } catch {
    $("out").select();
    setSt("Select-all done — press Ctrl/Cmd+C");
  }
};

$("apply").onclick = applyDicts;

$("fit").onclick = () => {
  center();
  update(true);
};

// ---- init
render();
changed();
center();
update(true);