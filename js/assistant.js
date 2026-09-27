(function () {
  const PEEK_EMOTIONS = ["02", "03", "10", "13", "16", "19", "30", "33", "14", "11"];
  const PROVIDERS = {
    deepseek: {
      name: "DeepSeek",
      baseUrl: "https://api.deepseek.com/v1",
      placeholderKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
      defaultModels: ["deepseek-chat", "deepseek-reasoner"],
    },
    qwen: {
      name: "通义千问",
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      placeholderKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
      defaultModels: ["qwen-turbo", "qwen-plus", "qwen-max"],
    },
    openrouter: {
      name: "OpenRouter",
      baseUrl: "https://openrouter.ai/api/v1",
      placeholderKey: "sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx",
      defaultModels: ["deepseek/deepseek-chat", "openai/gpt-4o-mini", "qwen/qwen-2.5-72b-instruct"],
    },
    openai: {
      name: "OpenAI",
      baseUrl: "https://api.openai.com/v1",
      placeholderKey: "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx",
      defaultModels: ["gpt-4o-mini", "gpt-4o"],
    },
    siliconflow: {
      name: "硅基流动",
      baseUrl: "https://api.siliconflow.cn/v1",
      placeholderKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
      defaultModels: ["deepseek-ai/DeepSeek-V3", "Qwen/Qwen2.5-72B-Instruct"],
    },
    moonshot: {
      name: "Moonshot",
      baseUrl: "https://api.moonshot.cn/v1",
      placeholderKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
      defaultModels: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    },
    ollama: {
      name: "Ollama",
      baseUrl: "http://localhost:11434/v1",
      placeholderKey: "ollama",
      defaultModels: ["qwen2.5:latest", "llama3.2:latest"],
    },
    custom: {
      name: "自定义",
      baseUrl: "",
      placeholderKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
      defaultModels: [],
    },
  };

  const ICONS = {
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M16 9a5 5 0 0 1 0 6"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.2 3.4"/><path d="M6.6 6.6A18.4 18.4 0 0 0 2 12s3.5 8 10 8a10.6 10.6 0 0 0 5.4-1.5"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/><path d="M2 2l20 20"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    chevron: '<svg class="chev" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  };

  const welcome = {
    id: "init-1",
    role: "agent",
    content:
      "我是 **寻鼓助手**。\n\n可以按本站档案回答：\n• 五个民族的鼓在哪里、怎么舞\n• 田野调查、教育转化、舞台展演各记了什么\n• 数智览里的缺口该先补哪一处\n\n右上角可以配置大模型。没配钥匙时，我直接查这套湖南非遗舞蹈库。",
    emotionId: "10",
    timestamp: clock(),
  };

  function cssPx(name, fallback) {
    const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(n) ? n : fallback;
  }

  const state = {
    open: false,
    emotion: "02",
    status: "待机中",
    loading: false,
    tts: false,
    speakingId: null,
    input: "",
    ctx: { view: "home" },
    panelWidth: cssPx("--chat-w", 360),
    dismissedBoard: false,
    triggerTop: Number(localStorage.getItem("xiangwu-chat-top")) || Math.max(120, window.innerHeight * 0.42),
    messages: loadHistory(),
    expandedThought: {},
    expandedMcp: {},
    settingsOpen: false,
    pickerOpen: false,
    provider: "deepseek",
    apiKey: "",
    baseUrl: PROVIDERS.deepseek.baseUrl,
    modelName: "deepseek-chat",
    showKey: false,
    models: PROVIDERS.deepseek.defaultModels.slice(),
    modelSearch: "",
    detecting: false,
    testing: false,
    testResult: null,
    saving: false,
    savedOk: false,
  };

  const balls = { peek: null, edge: null, header: null, msgs: [] };
  let root;
  let streamNode = null;

  function clock() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem("xiangwu-chat") || "null");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (e) {}
    return [Object.assign({}, welcome)];
  }

  function saveHistory() {
    try {
      localStorage.setItem("xiangwu-chat", JSON.stringify(state.messages.slice(-60)));
    } catch (e) {}
  }

  function loadConfig() {
    try {
      const cfg = JSON.parse(localStorage.getItem("xiangwu-llm") || "null");
      if (!cfg) return;
      state.provider = cfg.provider || state.provider;
      state.apiKey = cfg.apiKey || "";
      state.baseUrl = cfg.baseUrl || state.baseUrl;
      state.modelName = cfg.modelName || state.modelName;
      const known = PROVIDERS[state.provider];
      state.models = (known && known.defaultModels.slice()) || [];
    } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatMd(text) {
    const lines = String(text || "").split("\n");
    return (
      '<div class="markdown-body-content">' +
      lines
        .map((line) => {
          if (!line.trim()) return '<div class="md-spacer"></div>';
          const bullet = /^\s*[-•]\s+/.test(line);
          const clean = esc(bullet ? line.replace(/^\s*[-•]\s+/, "") : line);
          const html = clean
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
          return `<div class="md-line${bullet ? " md-bullet" : ""}">${
            bullet ? '<span class="bullet-dot">•</span>' : ""
          }<span>${html}</span></div>`;
        })
        .join("") +
      "</div>"
    );
  }

  function archiveText() {
    return Object.values(ETHNICS)
      .map((e) => {
        const c = CONTENT[e.id];
        const field = c.field.map((x) => x.title).join("、");
        const course = c.course.map((x) => x.title).join("、");
        const video = c.video.map((x) => x.title).join("、");
        return `${e.name}｜${e.dance}｜${e.drumName}｜${e.place}｜${e.intro}｜田野调查：${field}｜教育转化：${course}｜舞台展演：${video}`;
      })
      .join("\n");
  }

  function localReply(q) {
    const text = q.trim();
    const ctx = state.ctx || {};
    const all = Object.values(ETHNICS);
    const hits = all.filter(
      (e) =>
        text.includes(e.name) ||
        text.includes(e.name.replace(/族$/, "")) ||
        text.includes(e.dance) ||
        text.includes(e.drumName)
    );
    const toolCalls = ["archive.search"];

    if (/缺|数字化|数智|完整|缺口|对照五个|还缺/.test(text)) {
      return {
        emotionId: "10",
        toolCalls,
        content:
          "按本库现有条目，五族结构是对齐的：每族 **田野调查 2 则、教育转化 3 节、舞台展演 2 条**。\n\n缺口不在目录，而在文件：\n• 图片、教育转化和舞台展演只登记了路径，页面上仍是「影像待载入」\n• 日期和具体村寨还没回填\n• 有鼓的州府集中在湘西、怀化、张家界、永州、邵阳、郴州\n\n若先补边角，优先 **白族仗鼓舞**（张家界·桑植）和 **瑶族长鼓舞**（永州·江华）。",
      };
    }

    const current =
      hits[0] ||
      (ctx.ethnicId && /这|当前|这里|这面|怎么看|介绍/.test(text) ? ETHNICS[ctx.ethnicId] : null);

    if (current && hits.length <= 1) {
      const c = CONTENT[current.id];
      return {
        emotionId: "02",
        toolCalls,
        content: `**${current.name}** · ${current.dance} · ${current.drumName}\n地在 ${current.place}。\n\n${current.intro}\n\n• 田野调查：${c.field.map((x) => x.title).join("、")}\n• 教育转化：${c.course.map((x) => x.title).join("、")}\n• 舞台展演：${c.video.map((x) => x.title).join("、")}\n\n${current.note}`,
      };
    }

    if (/五个|哪些|有哪些|都有|民族|地图|哪里/.test(text) || hits.length > 1) {
      const lines = all
        .map((e) => `• **${e.name}** ${e.dance}，${e.drumName}，${e.place}`)
        .join("\n");
      return {
        emotionId: "10",
        toolCalls,
        content: "这套库记了湖南五面鼓：\n" + lines + "\n\n点地图上的鼓，或告诉我族名，我按那一鼓展开。",
      };
    }

    if (ctx.branchName && ctx.ethnicName) {
      return {
        emotionId: "02",
        toolCalls,
        content: `你现在在 **${ctx.ethnicName}** 的「${ctx.branchName}」。可以问这一支记了哪些题目，也可以回到地图看鼓落在哪一片土地。`,
      };
    }

    return {
      emotionId: "02",
      toolCalls,
      content:
        "我按鼓舞潇湘的档案来答。可以问某一族的鼓、田野调查和教育转化，也可以问「档案还缺什么」。配好大模型之后，同一套问题会交给接口，档案仍作为依据。",
    };
  }

  function systemPrompt() {
    const ctx = state.ctx || {};
    const where = ctx.ethnicName
      ? `用户正在看 ${ctx.ethnicName}${ctx.dance ? "·" + ctx.dance : ""}${ctx.branchName ? " / " + ctx.branchName : ""}。`
      : ctx.view === "bi"
        ? "用户正在看数智览。"
        : "用户正在看湖南地图，左侧是档案数据栏，右侧是寻鼓助手。";
    return (
      "你是「鼓舞潇湘」的寻鼓助手，只依据下面的湖南非遗舞蹈档案回答。不要编造村寨、日期、传承人人数或官方统计。档案没有的，就说待补。用简体中文，简短，可用 **加粗** 和短列表。\n" +
      where +
      "\n\n档案：\n" +
      archiveText()
    );
  }

  function shell() {
    const providerOptions = Object.keys(PROVIDERS)
      .map((key) => `<option value="${key}" ${key === state.provider ? "selected" : ""}>${PROVIDERS[key].name}</option>`)
      .join("");
    return `
      <div class="home-agent-peek" title="寻鼓助手" role="button" tabindex="0" aria-label="打开寻鼓助手"></div>
      <div class="chat-edge-avatar-pet" hidden title="点击展开寻鼓助手，按住可上下滑动"><div class="edge-ball"></div></div>
      <aside class="chat-panel closed" inert aria-label="寻鼓助手">
        <div class="chat-panel-resize-handle" title="拖拽调整宽度"><div class="resize-handle-indicator"></div></div>
        <header class="chat-header">
          <div class="chat-avatar-wrapper" title="点一下，转一圈"></div>
          <div class="chat-header-info">
            <div class="chat-title-row">
              <strong>寻鼓助手</strong>
              <span class="chat-status-pill">待机中</span>
            </div>
            <p class="chat-subtitle">湖南非遗舞蹈档案 · 可接大模型</p>
          </div>
          <div class="chat-header-actions">
            <button class="icon-btn" type="button" data-act="reset" title="重新开始">${ICONS.reset}</button>
            <button class="icon-btn" type="button" data-act="tts" title="语音伴读">${ICONS.mute}</button>
            <button class="icon-btn" type="button" data-act="settings" title="大模型配置">${ICONS.gear}</button>
            <button class="icon-btn" type="button" data-act="close" title="收起">${ICONS.close}</button>
          </div>
        </header>
        <div class="chat-messages"></div>
        <div class="chat-quick-bar">
          <button type="button" data-quick="五个民族的鼓分别在哪里">五面鼓</button>
          <button type="button" data-quick="我正在看的这面鼓，该怎么介绍">这面鼓</button>
          <button type="button" data-quick="对照五个民族，档案还缺什么">还缺什么</button>
          <button type="button" data-quick="田野调查、教育转化和舞台展演各记了什么">三条路径</button>
        </div>
        <footer class="chat-footer">
          <input type="text" placeholder="问问这面鼓，或档案里缺什么" />
          <button class="send-btn" type="button" data-act="send" title="发送" disabled>${ICONS.send}</button>
        </footer>
        <div class="settings-slot"></div>
      </aside>
      <template id="settings-template">
        <div class="chat-settings-overlay" data-act="settings-bg">
          <div class="chat-settings-modal" role="dialog" aria-label="大模型配置">
            <div class="settings-modal-header">
              <div class="settings-title">${ICONS.gear}<strong>大模型配置</strong></div>
              <button class="icon-btn" type="button" data-act="settings-close">${ICONS.close}</button>
            </div>
            <div class="settings-modal-body">
              <div class="settings-field">
                <label>提供商</label>
                <select class="provider-select">${providerOptions}</select>
              </div>
              <div class="settings-field">
                <label>API Key</label>
                <div class="input-with-action">
                  <input class="api-key" type="password" placeholder="${PROVIDERS.deepseek.placeholderKey}" />
                  <button class="icon-sub-btn" type="button" data-act="toggle-key" title="显示或隐藏" aria-label="显示或隐藏密钥">${ICONS.eye}</button>
                </div>
              </div>
              <div class="settings-field">
                <label>Base URL</label>
                <input class="base-url" type="text" />
              </div>
              <div class="settings-field">
                <div class="field-label-row">
                  <label>模型</label>
                  <button class="detect-btn" type="button" data-act="detect">获取模型列表</button>
                </div>
                <input class="model-name" type="text" />
              </div>
              <div class="test-slot"></div>
              <p class="picker-count-hint">钥匙只存在这台浏览器里。接口若被跨域拦住，助手会改用本站档案回答。</p>
            </div>
            <div class="settings-modal-footer">
              <button class="test-btn" type="button" data-act="clear" style="color:#e07a6a">清空历史</button>
              <button class="test-btn" type="button" data-act="test">测试连接</button>
              <button class="save-btn" type="button" data-act="save">保存到本机</button>
            </div>
          </div>
        </div>
      </template>`;
  }

  function panel() {
    return root.querySelector(".chat-panel");
  }

  function setOpen(open) {
    state.open = open;
    panel().classList.toggle("open", open);
    panel().classList.toggle("closed", !open);
    panel().inert = !open;
    document.documentElement.classList.toggle("chat-open", open);
    document.documentElement.style.setProperty("--chat-w", state.panelWidth + "px");
    placeChrome();
    if (open) {
      ensureHeaderBall();
      scrollEnd();
    }
  }

  function placeChrome() {
    const peek = root.querySelector(".home-agent-peek");
    const edge = root.querySelector(".chat-edge-avatar-pet");
    const onHome = !state.ctx || state.ctx.view === "home";
    peek.hidden = state.open || !onHome;
    edge.hidden = state.open || onHome;
    edge.style.top = state.triggerTop + "px";
  }

  function setEmotion(id) {
    state.emotion = id || "02";
    [balls.peek, balls.edge, balls.header].forEach((ball) => {
      if (ball) ball.setEmotion(state.emotion);
    });
  }

  function setStatus(text, loading) {
    state.status = text;
    state.loading = !!loading;
    const pill = root.querySelector(".chat-status-pill");
    if (pill) {
      pill.textContent = text;
      pill.classList.toggle("loading", state.loading);
    }
  }

  function makeBall(el, emotion, live) {
    if (!el || !window.EmotionBall) return null;
    el.innerHTML = "";
    return window.EmotionBall.create(el, {
      emotion: emotion || "02",
      shape: "blob",
      idle: !!live,
      autostart: !!live,
      eyeScale: live ? 1.15 : 1,
    });
  }

  function ensureHeaderBall() {
    const el = root.querySelector(".chat-avatar-wrapper");
    if (!balls.header && el) balls.header = makeBall(el, state.emotion, true);
  }

  function renderMessages() {
    clearMsgBalls();
    const box = root.querySelector(".chat-messages");
    box.innerHTML = state.messages
      .map((m, idx) => {
        const latest = idx === state.messages.length - 1;
        if (m.role === "user") {
          return `<div class="chat-bubble-row user" data-id="${m.id}">
            <div class="bubble-content">
              <div class="bubble-text">${formatMd(m.content)}</div>
              <div class="bubble-footer-row"><span class="bubble-time">${esc(m.timestamp)}</span></div>
            </div>
          </div>`;
        }
        const tools = m.toolCalls && m.toolCalls.length
          ? `<div class="mcp-agent-section">
              <button class="mcp-agent-toggle" type="button" data-mcp="${m.id}">
                <span>已检索档案</span>${ICONS.chevron.replace("chev", "mcp-arrow" + (state.expandedMcp[m.id] ? " open" : ""))}
              </button>
              ${
                state.expandedMcp[m.id]
                  ? `<div class="mcp-agent-list">${m.toolCalls
                      .map((t) => `<div>调用 <span class="mcp-path">xiangwu.archive / ${esc(t)}</span></div>`)
                      .join("")}</div>`
                  : ""
              }
            </div>`
          : "";
        const thought = m.reasoning
          ? `<div class="thought-card">
              <button class="thought-toggle-bar" type="button" data-thought="${m.id}">
                <span>${state.loading && latest && !m.content ? "正在深度思考..." : "深度思考过程"}</span>
                ${ICONS.chevron.replace("chev", "thought-arrow" + (state.expandedThought[m.id] ? " open" : ""))}
              </button>
              ${state.expandedThought[m.id] ? `<div class="thought-body"><div class="thought-text">${esc(m.reasoning)}</div></div>` : ""}
            </div>`
          : "";
        const body = m.content
          ? formatMd(m.content) + (state.loading && latest ? '<span class="typing-cursor">▌</span>' : "")
          : state.loading && latest
            ? '<span class="typing-cursor">思考中 ▌</span>'
            : "";
        return `<div class="chat-bubble-row agent" data-id="${m.id}">
          <div class="bubble-avatar" data-emo="${esc(m.emotionId || "02")}"></div>
          <div class="bubble-content">
            ${tools}
            ${thought}
            <div class="bubble-text">${body}</div>
            <div class="bubble-footer-row">
              <span class="bubble-time">${esc(m.timestamp)}</span>
              ${m.content ? `<button class="bubble-voice-btn ${state.speakingId === m.id ? "speaking" : ""}" type="button" data-speak="${m.id}" title="朗读">${state.speakingId === m.id ? ICONS.mute : ICONS.volume}</button>` : ""}
            </div>
          </div>
        </div>`;
      })
      .join("");
    box.querySelectorAll(".bubble-avatar").forEach((el) => {
      const ball = makeBall(el, el.dataset.emo, false);
      if (ball) balls.msgs.push(ball);
    });
    streamNode = box.querySelector(".chat-bubble-row.agent:last-child .bubble-text");
    scrollEnd();
  }

  function clearMsgBalls() {
    balls.msgs.forEach((b) => b && b.destroy && b.destroy());
    balls.msgs = [];
  }

  function scrollEnd() {
    const box = root.querySelector(".chat-messages");
    if (box) box.scrollTop = box.scrollHeight;
  }

  function patchStream() {
    const last = state.messages[state.messages.length - 1];
    if (!last || last.role !== "agent") return;
    if (!streamNode || !streamNode.isConnected) {
      renderMessages();
      return;
    }
    streamNode.innerHTML =
      (last.content ? formatMd(last.content) : "") +
      (state.loading ? '<span class="typing-cursor">▌</span>' : "");
    scrollEnd();
  }

  function speak(text, id) {
    if (!window.speechSynthesis) return;
    if (state.speakingId && state.speakingId === id) {
      speechSynthesis.cancel();
      state.speakingId = null;
      renderMessages();
      return;
    }
    speechSynthesis.cancel();
    const clean = String(text)
      .replace(/[*#`_~]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) return;
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "zh-CN";
    utter.rate = 1.02;
    state.speakingId = id || null;
    utter.onend = utter.onerror = () => {
      state.speakingId = null;
      renderMessages();
    };
    speechSynthesis.speak(utter);
    renderMessages();
  }

  async function streamLLM(userText, agent) {
    const url = state.baseUrl.replace(/\/$/, "") + "/chat/completions";
    const history = state.messages
      .filter((m) => m.content && m.id !== agent.id)
      .slice(-12)
      .map((m) => ({ role: m.role === "agent" ? "assistant" : "user", content: m.content }));
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + state.apiKey,
      },
      body: JSON.stringify({
        model: state.modelName || "deepseek-chat",
        stream: true,
        messages: [{ role: "system", content: systemPrompt() }, ...history],
      }),
    });
    if (!resp.ok || !resp.body) {
      let detail = "";
      try { detail = await resp.text(); } catch (e) {}
      throw new Error("接口返回 " + resp.status + (detail ? "：" + detail.slice(0, 180) : ""));
    }
    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    setStatus("生成中...", true);
    setEmotion("03");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) return;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data);
          const delta = json.choices && json.choices[0] && json.choices[0].delta;
          if (!delta) return;
          if (delta.reasoning_content) {
            agent.reasoning = (agent.reasoning || "") + delta.reasoning_content;
            setStatus("深度思考中", true);
          }
          if (delta.content) agent.content += delta.content;
          patchStream();
        } catch (e) {}
      });
    }
    agent.emotionId = "10";
    agent.toolCalls = ["archive.search"];
  }

  async function send(text) {
    const userText = (text || state.input || "").trim();
    if (!userText || state.loading) return;
    state.input = "";
    const input = root.querySelector(".chat-footer input");
    if (input) input.value = "";
    syncSend();
    const userMsg = { id: "u-" + Date.now(), role: "user", content: userText, timestamp: clock() };
    const agent = {
      id: "a-" + Date.now(),
      role: "agent",
      content: "",
      emotionId: "03",
      timestamp: clock(),
      toolCalls: ["archive.search"],
    };
    state.messages.push(userMsg, agent);
    saveHistory();
    setStatus("思考中...", true);
    setEmotion("03");
    if (balls.header) balls.header.spin && balls.header.spin(1);
    renderMessages();

    try {
      if (state.apiKey && state.baseUrl) {
        await streamLLM(userText, agent);
        setEmotion("10");
        setStatus("就绪", false);
      } else {
        await wait(420);
        const local = localReply(userText);
        agent.content = local.content;
        agent.emotionId = local.emotionId;
        agent.toolCalls = local.toolCalls;
        setEmotion(local.emotionId);
        setStatus("档案已答", false);
      }
    } catch (err) {
      const local = localReply(userText);
      agent.content =
        "大模型没有连上（" +
        (err && err.message ? err.message : "网络异常") +
        "）。下面改用本站档案：\n\n" +
        local.content;
      agent.emotionId = "34";
      setEmotion("34");
      setStatus("已改用档案", false);
    }
    state.loading = false;
    saveHistory();
    renderMessages();
    if (state.tts && agent.content) speak(agent.content, agent.id);
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function syncSend() {
    const btn = root.querySelector(".send-btn");
    if (btn) btn.disabled = state.loading || !state.input.trim();
  }

  function resetChat() {
    if (window.speechSynthesis) speechSynthesis.cancel();
    state.speakingId = null;
    state.messages = [Object.assign({}, welcome, { id: "init-" + Date.now(), timestamp: clock() })];
    saveHistory();
    setEmotion("10");
    setStatus("待机中", false);
    renderMessages();
  }

  function fillSettings() {
    const slot = root.querySelector(".settings-slot");
    if (!state.settingsOpen) {
      slot.innerHTML = "";
      return;
    }
    const tpl = root.querySelector("#settings-template");
    slot.innerHTML = tpl.innerHTML;
    const modal = slot.querySelector(".chat-settings-modal");
    modal.querySelector(".provider-select").value = state.provider;
    modal.querySelector(".api-key").value = state.apiKey;
    modal.querySelector(".api-key").type = state.showKey ? "text" : "password";
    const keyToggle = modal.querySelector("[data-act=toggle-key]");
    keyToggle.innerHTML = state.showKey ? ICONS.eyeOff : ICONS.eye;
    keyToggle.title = state.showKey ? "隐藏密钥" : "显示密钥";
    modal.querySelector(".base-url").value = state.baseUrl;
    modal.querySelector(".model-name").value = state.modelName;
    const test = modal.querySelector(".test-slot");
    if (state.testResult) {
      test.innerHTML = `<div class="test-result-banner ${state.testResult.ok ? "success" : "error"}">${esc(
        state.testResult.msg
      )}</div>`;
    }
    if (state.pickerOpen) slot.appendChild(modelPicker());
  }

  function modelPicker() {
    const q = state.modelSearch.trim().toLowerCase();
    const list = state.models.filter((m) => m.toLowerCase().includes(q));
    const wrap = document.createElement("div");
    wrap.className = "chat-settings-overlay model-picker-overlay";
    wrap.innerHTML = `
      <div class="chat-settings-modal model-picker-modal" role="dialog" aria-label="选择模型">
        <div class="settings-modal-header">
          <div class="settings-title"><strong>选择模型（${state.models.length}）</strong></div>
          <button class="icon-btn" type="button" data-act="picker-close">${ICONS.close}</button>
        </div>
        <div class="model-picker-search-bar">
          <input class="model-search" type="text" placeholder="搜索模型" value="${esc(state.modelSearch)}" />
        </div>
        <div class="model-picker-list">
          ${
            list.length
              ? list
                  .map(
                    (m) =>
                      `<div class="model-picker-item ${m === state.modelName ? "selected" : ""}" data-model="${esc(m)}"><span>${esc(
                        m
                      )}</span></div>`
                  )
                  .join("")
              : `<div class="model-picker-empty">没有匹配「${esc(state.modelSearch)}」</div>`
          }
        </div>
        <div class="settings-modal-footer"><span class="picker-count-hint">${list.length} 个匹配</span></div>
      </div>`;
    return wrap;
  }

  function readSettingsFields() {
    const modal = root.querySelector(".settings-slot .chat-settings-modal");
    if (!modal) return;
    state.provider = modal.querySelector(".provider-select").value;
    state.apiKey = modal.querySelector(".api-key").value.trim();
    state.baseUrl = modal.querySelector(".base-url").value.trim();
    state.modelName = modal.querySelector(".model-name").value.trim();
  }

  async function detectModels() {
    readSettingsFields();
    state.detecting = true;
    setStatus("获取模型...", true);
    try {
      const resp = await fetch(state.baseUrl.replace(/\/$/, "") + "/models", {
        headers: { Authorization: "Bearer " + state.apiKey },
      });
      if (resp.ok) {
        const data = await resp.json();
        const ids = (data.data || []).map((m) => m.id).filter(Boolean);
        if (ids.length) {
          state.models = ids;
          state.pickerOpen = true;
          state.modelSearch = "";
          fillSettings();
          return;
        }
      }
    } catch (e) {}
    const fallback = (PROVIDERS[state.provider] && PROVIDERS[state.provider].defaultModels) || [];
    state.models = fallback.slice();
    state.pickerOpen = state.models.length > 0;
    if (!state.pickerOpen) state.testResult = { ok: false, msg: "没有取到模型列表，请直接填写模型名。" };
    fillSettings();
    setStatus(state.open ? "就绪" : "待机中", false);
    state.detecting = false;
  }

  async function testLink() {
    readSettingsFields();
    if (!state.apiKey) {
      state.testResult = { ok: false, msg: "请先填写 API Key" };
      fillSettings();
      return;
    }
    state.testing = true;
    state.testResult = null;
    fillSettings();
    try {
      const resp = await fetch(state.baseUrl.replace(/\/$/, "") + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + state.apiKey,
        },
        body: JSON.stringify({
          model: state.modelName,
          max_tokens: 16,
          messages: [{ role: "user", content: "只回复：已连通" }],
        }),
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      state.testResult = { ok: true, msg: "连接成功" + (reply ? "：" + reply : "") };
    } catch (err) {
      state.testResult = {
        ok: false,
        msg: "连接失败：" + (err && err.message ? err.message : "网络异常") + "。浏览器跨域时也会失败，那时仍可用本站档案。",
      };
    }
    state.testing = false;
    fillSettings();
  }

  function saveConfig() {
    readSettingsFields();
    localStorage.setItem(
      "xiangwu-llm",
      JSON.stringify({
        provider: state.provider,
        apiKey: state.apiKey,
        baseUrl: state.baseUrl,
        modelName: state.modelName,
      })
    );
    state.savedOk = true;
    state.testResult = { ok: true, msg: "已保存到这台浏览器。" };
    fillSettings();
    setTimeout(() => {
      state.savedOk = false;
    }, 1200);
  }

  function onClick(ev) {
    const act = ev.target.closest("[data-act]");
    const quick = ev.target.closest("[data-quick]");
    const mcp = ev.target.closest("[data-mcp]");
    const thought = ev.target.closest("[data-thought]");
    const speakBtn = ev.target.closest("[data-speak]");
    const model = ev.target.closest("[data-model]");
    if (ev.target.closest(".home-agent-peek")) {
      state.dismissedBoard = false;
      setOpen(true);
      return;
    }
    if (quick) {
      send(quick.dataset.quick);
      return;
    }
    if (mcp) {
      state.expandedMcp[mcp.dataset.mcp] = !state.expandedMcp[mcp.dataset.mcp];
      renderMessages();
      return;
    }
    if (thought) {
      state.expandedThought[thought.dataset.thought] = !state.expandedThought[thought.dataset.thought];
      renderMessages();
      return;
    }
    if (speakBtn) {
      const msg = state.messages.find((m) => m.id === speakBtn.dataset.speak);
      if (msg) speak(msg.content, msg.id);
      return;
    }
    if (model) {
      state.modelName = model.dataset.model;
      state.pickerOpen = false;
      fillSettings();
      return;
    }
    if (!act) return;
    const name = act.dataset.act;
    if (name === "close") {
      if (document.documentElement.classList.contains("dock-assistant")) state.dismissedBoard = true;
      setOpen(false);
    }
    if (name === "reset" || name === "clear") {
      resetChat();
      if (name === "clear") {
        state.settingsOpen = false;
        fillSettings();
      }
    }
    if (name === "tts") {
      state.tts = !state.tts;
      act.classList.toggle("active", state.tts);
      act.innerHTML = state.tts ? ICONS.volume : ICONS.mute;
      if (!state.tts && window.speechSynthesis) speechSynthesis.cancel();
    }
    if (name === "settings") {
      state.settingsOpen = true;
      state.pickerOpen = false;
      fillSettings();
    }
    if (name === "settings-close" || name === "settings-bg") {
      if (name === "settings-bg" && ev.target !== act) return;
      state.settingsOpen = false;
      state.pickerOpen = false;
      fillSettings();
    }
    if (name === "toggle-key") {
      state.showKey = !state.showKey;
      const input = root.querySelector(".settings-slot .api-key");
      const keyToggle = root.querySelector(".settings-slot [data-act=toggle-key]");
      if (input) {
        state.apiKey = input.value;
        input.type = state.showKey ? "text" : "password";
      }
      if (keyToggle) {
        keyToggle.innerHTML = state.showKey ? ICONS.eyeOff : ICONS.eye;
        keyToggle.title = state.showKey ? "隐藏密钥" : "显示密钥";
      }
    }
    if (name === "detect") detectModels();
    if (name === "test") testLink();
    if (name === "save") saveConfig();
    if (name === "send") send();
    if (name === "picker-close") {
      state.pickerOpen = false;
      fillSettings();
    }
  }

  function onInput(ev) {
    if (ev.target.classList.contains("model-search")) {
      state.modelSearch = ev.target.value;
      const keep = ev.target.selectionStart;
      fillSettings();
      const again = root.querySelector(".model-search");
      if (again) {
        again.focus();
        again.setSelectionRange(keep, keep);
      }
      return;
    }
    if (ev.target.closest(".chat-footer")) {
      state.input = ev.target.value;
      syncSend();
    }
    if (ev.target.classList.contains("provider-select")) {
      const next = ev.target.value;
      state.provider = next;
      const item = PROVIDERS[next];
      if (item && next !== "custom") {
        state.baseUrl = item.baseUrl;
        state.models = item.defaultModels.slice();
        if (item.defaultModels[0]) state.modelName = item.defaultModels[0];
      }
      fillSettings();
    }
  }

  function bind() {
    root.addEventListener("click", onClick);
    root.addEventListener("input", onInput);
    root.addEventListener("change", onInput);
    root.querySelector(".chat-footer input").addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        send();
      }
    });
    root.querySelector(".home-agent-peek").addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        setOpen(true);
      }
    });
    root.querySelector(".chat-avatar-wrapper").addEventListener("click", () => {
      if (balls.header && balls.header.spin) balls.header.spin(2);
      if (balls.header && balls.header.bounce) balls.header.bounce();
    });

    const edge = root.querySelector(".chat-edge-avatar-pet");
    let dragging = false;
    let moved = false;
    let startY = 0;
    let origin = 0;
    edge.addEventListener("pointerdown", (ev) => {
      dragging = true;
      moved = false;
      startY = ev.clientY;
      origin = state.triggerTop;
      edge.setPointerCapture(ev.pointerId);
    });
    edge.addEventListener("pointermove", (ev) => {
      if (!dragging) return;
      const dy = ev.clientY - startY;
      if (Math.abs(dy) > 3) moved = true;
      const edgeH = cssPx("--ball-edge-h", 48);
      state.triggerTop = Math.max(edgeH, Math.min(window.innerHeight - edgeH - 8, origin + dy));
      edge.style.top = state.triggerTop + "px";
    });
    edge.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      localStorage.setItem("xiangwu-chat-top", String(state.triggerTop));
      if (!moved) setOpen(true);
    });

    const handle = root.querySelector(".chat-panel-resize-handle");
    handle.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      const startX = ev.clientX;
      const startW = state.panelWidth;
      function move(e) {
        const maxW = Math.min(window.innerWidth * 0.72, cssPx("--chat-w-max", 720));
        state.panelWidth = Math.min(maxW, Math.max(cssPx("--chat-w-min", 280), startW + (startX - e.clientX)));
        panel().style.width = state.panelWidth + "px";
        document.documentElement.style.setProperty("--chat-w", state.panelWidth + "px");
      }
      function up() {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      }
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    });

    window.addEventListener("pointermove", (ev) => {
      const list = [balls.peek, balls.edge, balls.header].filter(Boolean);
      list.forEach((ball) => {
        if (!ball.setGaze) return;
        ball.setGaze(
          Math.max(-1, Math.min(1, (ev.clientX / window.innerWidth) * 2 - 1)),
          Math.max(-1, Math.min(1, (ev.clientY / window.innerHeight) * 2 - 1))
        );
      });
    });

    let peekTimer = 0;
    function cyclePeek() {
      window.clearInterval(peekTimer);
      peekTimer = window.setInterval(() => {
        if (state.open || state.loading) return;
        let next = state.emotion;
        for (let i = 0; i < 6 && next === state.emotion; i++) {
          next = PEEK_EMOTIONS[Math.floor(Math.random() * PEEK_EMOTIONS.length)];
        }
        setEmotion(next);
      }, 3400);
    }
    cyclePeek();
  }

  function mount() {
    root = document.getElementById("assistant-root");
    if (!root) return;
    loadConfig();
    root.innerHTML = shell();
    balls.peek = makeBall(root.querySelector(".home-agent-peek"), state.emotion, true);
    balls.edge = makeBall(root.querySelector(".edge-ball"), state.emotion, true);
    bind();
    renderMessages();
    placeChrome();
    panel().style.width = state.panelWidth + "px";
    if ((!state.ctx.view || state.ctx.view === "home") && !state.dismissedBoard) setOpen(true);
  }

  window.XiangAssistant = {
    mount,
    sync(ctx) {
      state.ctx = ctx || state.ctx;
      const board = !state.ctx.view || state.ctx.view === "home";
      document.documentElement.classList.toggle("dock-assistant", board);
      if (!board) state.dismissedBoard = false;
      if (!root) return;
      if (board && !state.dismissedBoard && !state.open) setOpen(true);
      else placeChrome();
    },
    ask(text) {
      state.dismissedBoard = false;
      setOpen(true);
      send(text);
    },
  };

  if (document.getElementById("assistant-root")) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
