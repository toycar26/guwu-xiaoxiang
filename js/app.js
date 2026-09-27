(function () {
  const app = document.getElementById("app");
  const NUM = ["一", "二", "三", "四", "五", "六"];

  const state = {
    skin: localStorage.getItem("xiangwu-skin") || "cinnabar",
    view: "home",
    ethnicId: null,
    branch: null,
    focusRegion: null,
    hoverText: "点一面鼓，进入该族",
    videoIndex: 0,
    mediaReady: {},
  };

  function applyChrome() {
    document.documentElement.dataset.skin = state.skin;
    if (state.ethnicId) document.documentElement.dataset.ethnic = state.ethnicId;
    else document.documentElement.removeAttribute("data-ethnic");
  }

  function setSkin(skin) {
    state.skin = skin;
    localStorage.setItem("xiangwu-skin", skin);
    applyChrome();
    document.querySelectorAll(".seal").forEach((el) => {
      el.classList.toggle("is-on", el.dataset.skin === skin);
    });
  }

  function parseHash() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const parts = raw.split("/").filter(Boolean);
    if (parts[0] === "bi") {
      history.replaceState(null, "", location.pathname + location.search + "#/");
      parts.splice(0, parts.length);
    }
    if (parts[0] === "e" && parts[1] && ETHNICS[parts[1]]) {
      state.ethnicId = parts[1];
      state.branch = ["field", "course", "video"].includes(parts[2]) ? parts[2] : null;
      state.view = state.branch ? "branch" : "ethnic";
      state.focusRegion = null;
    } else {
      state.view = "home";
      state.ethnicId = null;
      state.branch = null;
    }
  }

  function go(hash) {
    if (location.hash === hash) {
      parseHash();
      render();
    } else {
      location.hash = hash;
    }
  }

  function ethnicsOf(regionId) {
    return REGION_ETHNICS[regionId] || [];
  }

  function regionName(id) {
    const r = HUNAN_GEO.regions.find((x) => x.id === id);
    return r ? r.name : "";
  }

  function renderSkins() {
    return Object.values(SITE.skins)
      .map(
        (s) =>
          `<button class="seal ${state.skin === s.key ? "is-on" : ""}" data-skin="${s.key}" type="button">${s.label}</button>`
      )
      .join("");
  }

  function archiveRows() {
    return Object.values(ETHNICS).map((e) => {
      const c = CONTENT[e.id];
      const images = c.field.reduce((n, item) => n + (item.images ? item.images.length : 0), 0);
      return {
        id: e.id,
        name: e.name,
        dance: e.dance,
        place: e.place,
        field: c.field.length,
        course: c.course.length,
        video: c.video.length,
        images,
        slots: c.field.length + c.course.length + c.video.length,
      };
    });
  }

  function renderHome() {
    const vb = HUNAN_GEO.viewBox;
    const homeland = new Set(Object.keys(REGION_ETHNICS));

    const paths = HUNAN_GEO.regions
      .map((r) => {
        const hot = state.focusRegion === r.id;
        const cls = [
          "region",
          homeland.has(r.id) ? "homeland" : "",
          hot ? "is-hot" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<path class="${cls}" data-id="${r.id}" d="${r.d}" tabindex="0" role="button" aria-label="${r.name}"></path>`;
      })
      .join("");

    const nudge = {
      xiangxi: [-34, -57],
      zhangjiajie: [28, -4],
      huaihua: [-40, 54],
      yongzhou: [12, -32],
    };
    const labels = HUNAN_GEO.regions
      .map((r) => {
        const home = homeland.has(r.id);
        const [dx, dy] = nudge[r.id] || [0, 4];
        return `<text class="region-label ${home ? "is-home" : ""}" x="${r.x + dx}" y="${r.y + dy}">${r.name}</text>`;
      })
      .join("");

    const drums = HUNAN_GEO.drums
      .map((d) => {
        const ethnic = ETHNICS[d.id];
        return `
          <g class="map-drum" data-ethnic="${d.id}" transform="translate(${d.x} ${d.y})" tabindex="0" role="button" aria-label="${ethnic.name}">
            <circle class="hit" r="52"></circle>
            <g class="map-drum-scale" transform="translate(-36 -44) scale(0.72)">${drumInner(ethnic.glyph)}</g>
            <text class="name" y="28">${ethnic.name}</text>
            <text class="place" y="42">${d.place}</text>
          </g>`;
      })
      .join("");

    return `
      <div class="home-frame">
        <header class="topbar topbar-board">
          <div class="brand">
            <h1>${SITE.name}</h1>
            <div class="sub">${SITE.subtitle}</div>
          </div>
          <div class="skins">${renderSkins()}</div>
        </header>
        <div class="page page-home">
          <div class="board">
            ${dataColumn()}
            <main class="stage">
              <div class="map-frame">
                <svg class="hunan" viewBox="${vb[0]} ${vb[1]} ${vb[2]} ${vb[3]}" role="img" aria-label="湖南地图">
                  <g id="land">${paths}</g>
                  <g id="labels" style="pointer-events:none">${labels}</g>
                  <g id="drums">${drums}</g>
                </svg>
              </div>
            </main>
          </div>
          <footer class="foot">
            <div class="hint">${state.hoverText}</div>
            <div>鼓即门径</div>
          </footer>
        </div>
      </div>`;
  }

  function renderEthnic() {
    const e = ETHNICS[state.ethnicId];
    const gates = BRANCHES.map(
      (b) => `
        <button class="drum-gate" type="button" data-branch="${b.id}">
          ${drumSvg(b.drum)}
          <span class="gate-name">${b.name}</span>
          <span class="gate-line">${b.line}</span>
        </button>`
    ).join("");

    return `
      <div class="page page-inner">
        <header class="inner-top">
          <div class="crumb-col">
            <button class="back" type="button" data-go="#/">回湖南</button>
          </div>
          <div class="ethnic-head">
            <h2>${e.name}</h2>
            <div class="where">${e.dance} · ${e.place} · ${e.drumName}</div>
          </div>
          <div class="skins">${renderSkins()}</div>
        </header>
        <div class="courtyard">
          <p class="intro">${e.intro}</p>
          <div class="three-drums">${gates}</div>
          <div>
            <div class="ground-line"></div>
            <p class="intro" style="font-size:13px;color:var(--ink-dim)">${e.note}</p>
          </div>
        </div>
      </div>`;
  }

  function rail() {
    return BRANCHES.map((b) => {
      const on = state.branch === b.id ? "is-on" : "";
      return `
        <button class="rail-item ${on}" type="button" data-branch="${b.id}">
          ${drumSvg(b.drum)}
          <span class="rail-name">${b.name}</span>
        </button>`;
    }).join("");
  }

  function stillBox(src) {
    const key = src;
    const ready = state.mediaReady[key];
    return `
      <div class="still-well" data-src="${src}">
        <img alt="" src="${src}" data-media="${key}"/>
        <div class="await ${ready ? "hidden" : ""}">影像待载入</div>
      </div>`;
  }

  function renderField() {
    const items = CONTENT[state.ethnicId].field;
    return items
      .map(
        (item) => `
        <article class="note-block">
          <div>
            <h3>${item.title}</h3>
            <div class="meta">${item.place} · ${item.date}</div>
            <p>${item.text}</p>
          </div>
          ${stillBox(item.images[0])}
        </article>`
      )
      .join("");
  }

  function renderCourse() {
    const items = CONTENT[state.ethnicId].course;
    const rows = items
      .map(
        (item, i) => `
        <button class="course-row" type="button" data-src="${item.src}">
          <span class="course-idx">${NUM[i]}</span>
          <span class="nm">${item.title}</span>
          <span class="dur">${item.duration}</span>
        </button>`
      )
      .join("");
    return `<div class="course-list">${rows}</div>
      <div class="stage-player" style="margin-top:28px;min-height:42vh">
        <div class="await" id="course-await">点上面一课，载入后在此播放</div>
        <video id="course-video" controls class="hidden"></video>
      </div>`;
  }

  function renderVideo() {
    const items = CONTENT[state.ethnicId].video;
    const current = items[state.videoIndex] || items[0];
    const faces = items
      .map(
        (item, i) =>
          `<button class="face ${i === state.videoIndex ? "is-on" : ""}" type="button" data-video="${i}">鼓 ${NUM[i]}</button>`
      )
      .join("");
    return `
      <div class="stage-player" data-src="${current.src}">
        <video id="main-video" class="hidden" controls poster="${current.poster || ""}" src="${current.src}"></video>
        <div class="await" id="video-await">影像待载入</div>
      </div>
      <div class="faces">${faces}</div>
      <p class="meta" style="margin-top:16px">${current.title}</p>`;
  }

  function renderBranch() {
    const e = ETHNICS[state.ethnicId];
    const b = BRANCHES.find((x) => x.id === state.branch);
    let body = "";
    if (state.branch === "field") body = renderField();
    if (state.branch === "course") body = renderCourse();
    if (state.branch === "video") body = renderVideo();

    return `
      <div class="page page-inner">
        <header class="inner-top">
          <div class="crumb-col">
            <button class="back" type="button" data-go="#/e/${e.id}">回 ${e.name}</button>
          </div>
          <div class="ethnic-head">
            <h2>${e.name}</h2>
            <div class="where">${e.dance}</div>
          </div>
          <div class="skins">${renderSkins()}</div>
        </header>
        <div class="branch-layout">
          <aside class="drum-rail">${rail()}</aside>
          <section class="branch-main">
            <div class="branch-title">${b.name}</div>
            <div class="branch-kicker">${b.line}</div>
            ${body}
          </section>
        </div>
      </div>`;
  }

  function dataColumn() {
    const rows = archiveRows();
    const fieldN = rows.reduce((n, r) => n + r.field, 0);
    const courseN = rows.reduce((n, r) => n + r.course, 0);
    const videoN = rows.reduce((n, r) => n + r.video, 0);
    const imageN = rows.reduce((n, r) => n + r.images, 0);
    const hotRegions = Object.keys(REGION_ETHNICS);
    const covered = hotRegions.length;
    const totalRegions = HUNAN_GEO.regions.length;
    const ratio = covered / totalRegions;
    const c = 2 * Math.PI * 42;
    const dash = (c * ratio).toFixed(1);
    const gap = (c - c * ratio).toFixed(1);

    const bars = rows
      .map((r) => {
        const fw = ((r.field / r.slots) * 100).toFixed(1);
        const cw = ((r.course / r.slots) * 100).toFixed(1);
        const vw = ((r.video / r.slots) * 100).toFixed(1);
        return `<div class="bar-row">
          <div class="who">${r.name}</div>
          <div class="stack" title="田野调查 ${r.field} · 教育转化 ${r.course} · 舞台展演 ${r.video}">
            <span class="s-field" style="width:${fw}%"></span>
            <span class="s-course" style="width:${cw}%"></span>
            <span class="s-video" style="width:${vw}%"></span>
          </div>
          <em>${r.slots} 条</em>
        </div>`;
      })
      .join("");

    const pills = hotRegions
      .map((id) => {
        const names = ethnicsOf(id).map((eid) => ETHNICS[eid].name).join(" / ");
        return `<span class="pill is-hot">${regionName(id)} · ${names}</span>`;
      })
      .join("");

    return `
      <aside class="data-col">
        <div class="data-head">
          <h2>数智览</h2>
          <p>档案对照 · 与地图同屏</p>
        </div>
        <section class="kpi-row">
          <div class="kpi"><b>${rows.length}</b><span>民族鼓舞</span></div>
          <div class="kpi"><b>${covered}</b><span>有鼓州府</span></div>
          <div class="kpi"><b>${fieldN}</b><span>田野条目</span></div>
          <div class="kpi"><b>${courseN}</b><span>教育转化</span></div>
          <div class="kpi"><b>${videoN}</b><span>舞台展演</span></div>
          <div class="kpi"><b>${imageN}</b><span>图片槽位</span></div>
        </section>
        <article class="bi-panel">
          <h3>档案完整度</h3>
          <p class="bi-kicker">五族结构对齐。条数来自本库，不是普查数字。</p>
          <div class="stack-legend">
            <span><i class="legend-field"></i>田野调查</span>
            <span><i class="legend-course"></i>教育转化</span>
            <span><i class="legend-video"></i>舞台展演</span>
          </div>
          ${bars}
        </article>
        <article class="bi-panel">
          <h3>地域覆盖</h3>
          <p class="bi-kicker">${totalRegions} 个市州里，点亮的是有鼓记载的地方。</p>
          <div class="donut-wrap">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(201,162,39,0.25)" stroke-width="10"></circle>
              <circle cx="60" cy="60" r="42" fill="none" stroke="var(--gold)" stroke-width="10"
                stroke-dasharray="${dash} ${gap}" stroke-linecap="butt"
                transform="rotate(-90 60 60)"></circle>
              <text x="60" y="64" text-anchor="middle" fill="var(--ink)" font-size="18" font-family="Ma Shan Zheng, KaiTi, serif">${covered}/${totalRegions}</text>
            </svg>
            <p>鼓舞集中在湘西、湘西北与湘南。</p>
          </div>
          <div class="region-pills">${pills}</div>
        </article>
        <article class="bi-panel">
          <h3>AI 研判</h3>
          <p class="bi-kicker">按现有条目看出的缺口。</p>
          <div class="insight-list">
            <div class="insight">
              <strong>结构已齐</strong>
              <p>五族都是田野调查 ${rows[0].field} 则、教育转化 ${rows[0].course} 节、舞台展演 ${rows[0].video} 条。</p>
            </div>
            <div class="insight">
              <strong>文件还是空的</strong>
              <p>图片 ${imageN} 槽、舞台展演 ${videoN} 条、教育转化 ${courseN} 节只登记了路径。</p>
            </div>
            <div class="insight">
              <strong>先补边角</strong>
              <p>白族在张家界北缘，瑶族在永州南缘，离湘西鼓心最远。</p>
            </div>
          </div>
          <div class="ask-row">
            <button class="ask-btn" type="button" data-ask="对照五个民族，档案还缺什么？">让助手解读这份档案</button>
          </div>
        </article>
      </aside>`;
  }

  function pageContext() {
    const e = state.ethnicId ? ETHNICS[state.ethnicId] : null;
    const b = BRANCHES.find((x) => x.id === state.branch);
    return {
      view: state.view,
      ethnicId: state.ethnicId,
      ethnicName: e ? e.name : "",
      dance: e ? e.dance : "",
      place: e ? e.place : "",
      branch: state.branch,
      branchName: b ? b.name : "",
      hoverText: state.hoverText,
    };
  }

  function bindMedia() {
    document.querySelectorAll("img[data-media]").forEach((img) => {
      const well = img.closest(".still-well");
      const awaitEl = well && well.querySelector(".await");
      const mark = (ok) => {
        state.mediaReady[img.dataset.media] = ok;
        if (awaitEl) awaitEl.classList.toggle("hidden", ok);
        if (!ok) img.classList.add("hidden");
      };
      img.addEventListener("load", () => {
        if (img.naturalWidth > 16) mark(true);
        else mark(false);
      });
      img.addEventListener("error", () => mark(false));
    });

    const main = document.getElementById("main-video");
    const awaitEl = document.getElementById("video-await");
    if (main && awaitEl) {
      const hide = () => {
        awaitEl.classList.add("hidden");
        main.classList.remove("hidden");
      };
      const show = () => {
        awaitEl.classList.remove("hidden");
        main.classList.add("hidden");
      };
      main.addEventListener("loadeddata", hide);
      main.addEventListener("error", show);
    }
  }

  function paintFocus() {
    app.querySelectorAll(".region").forEach((el) => {
      el.classList.toggle("is-hot", state.focusRegion === el.dataset.id);
      el.classList.remove("is-dim");
    });
    app.querySelectorAll(".map-drum").forEach((el) => {
      el.classList.remove("is-dim", "is-pulse");
    });
    const hint = app.querySelector(".hint");
    if (hint) hint.textContent = state.hoverText;
  }

  function bindHome() {
    app.querySelectorAll(".region").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const id = el.dataset.id;
        const names = ethnicsOf(id).map((eid) => ETHNICS[eid].name);
        const extra = names.length ? " · " + names.join(" / ") : " · 此间少有民族鼓舞记载";
        state.hoverText = `湖南 · ${regionName(id)}${extra}`;
        app.querySelector(".hint").textContent = state.hoverText;
      });
      el.addEventListener("mouseleave", () => {
        app.querySelector(".hint").textContent = state.hoverText;
      });
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const id = el.dataset.id;
        const names = ethnicsOf(id).map((eid) => ETHNICS[eid].name);
        state.focusRegion = state.focusRegion === id ? null : id;
        state.hoverText = state.focusRegion
          ? names.length
            ? `湖南 · ${regionName(id)} · ${names.join(" / ")}`
            : `湖南 · ${regionName(id)} · 此间少有民族鼓舞记载`
          : "点一面鼓，进入该族";
        paintFocus();
      });
    });

    app.querySelectorAll(".map-drum").forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        go(`#/e/${el.dataset.ethnic}`);
      });
    });

    app.querySelector(".hunan").addEventListener("click", () => {
      if (!state.focusRegion) return;
      state.focusRegion = null;
      state.hoverText = "点一面鼓，进入该族";
      paintFocus();
    });
  }

  function bindCommon() {
    app.querySelectorAll(".seal").forEach((el) => {
      el.addEventListener("click", () => setSkin(el.dataset.skin));
    });
    app.querySelectorAll("[data-go]").forEach((el) => {
      el.addEventListener("click", () => go(el.dataset.go));
    });
    app.querySelectorAll("[data-branch]").forEach((el) => {
      el.addEventListener("click", () => go(`#/e/${state.ethnicId}/${el.dataset.branch}`));
    });
    app.querySelectorAll("[data-video]").forEach((el) => {
      el.addEventListener("click", () => {
        state.videoIndex = Number(el.dataset.video);
        render();
      });
    });
    app.querySelectorAll("[data-ask]").forEach((el) => {
      el.addEventListener("click", () => {
        if (window.XiangAssistant) window.XiangAssistant.ask(el.dataset.ask);
      });
    });
    app.querySelectorAll(".course-row").forEach((el) => {
      el.addEventListener("click", () => {
        const video = document.getElementById("course-video");
        const awaitEl = document.getElementById("course-await");
        video.src = el.dataset.src;
        video.classList.remove("hidden");
        awaitEl.textContent = "影像待载入";
        video.onloadeddata = () => awaitEl.classList.add("hidden");
        video.onerror = () => {
          awaitEl.classList.remove("hidden");
          awaitEl.textContent = "影像待载入";
        };
      });
    });
  }

  function render() {
    applyChrome();
    if (state.view === "home") app.innerHTML = renderHome();
    else if (state.view === "ethnic") app.innerHTML = renderEthnic();
    else app.innerHTML = renderBranch();
    bindCommon();
    if (state.view === "home") bindHome();
    bindMedia();
    if (window.XiangAssistant) window.XiangAssistant.sync(pageContext());
  }

  window.addEventListener("hashchange", () => {
    parseHash();
    render();
  });

  parseHash();
  applyChrome();
  render();
})();
