(() => {
  "use strict";

  /* =========================
     Data
  ========================== */
  const SUGGESTIONS = [
    "포켓몬", "포켓몬 카드", "포켓몬 카드 시세", "포켓몬 게임", "포켓몬 도감", "포켓몬 카드 가격",
    "인공지능", "인공지능 공부", "파이썬", "자바스크립트", "웹 개발", "HTML CSS JavaScript",
    "GitHub Pages", "검색 엔진", "세계 뉴스", "오늘 날씨", "게임 추천", "컴퓨터 추천"
  ];

  const IMAGE_DATA = [
    ["미래적인 도시", "StopBlocking Visual", "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=80"],
    ["노트북과 코드", "Developer", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"],
    ["우주와 별", "Space", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"],
    ["현대적인 건축", "Architecture", "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"],
    ["산과 자연", "Nature", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"],
    ["디지털 기술", "Technology", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"],
    ["도시 야경", "City", "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80"],
    ["미니멀 데스크", "Workspace", "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80"],
    ["숲과 햇빛", "Outdoor", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80"],
    ["카메라", "Photo", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"]
  ];

  const NEWS_DATA = [
    ["기술 산업의 새로운 변화, AI와 검색의 미래", "TECH DAILY", "오늘",
     "인공지능 기술이 검색 서비스와 정보 탐색 방식을 빠르게 변화시키고 있습니다.",
     "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=80"],
    ["웹 개발자가 주목하는 새로운 개발 트렌드", "WEB TODAY", "어제",
     "더 빠르고 접근성이 높은 웹 서비스를 만들기 위한 다양한 기술이 주목받고 있습니다.",
     "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80"],
    ["디지털 서비스의 사용자 경험이 중요해진 이유", "DESIGN NEWS", "2일 전",
     "단순한 기능을 넘어 빠르고 직관적인 사용자 경험이 서비스 경쟁력의 핵심이 되고 있습니다.",
     "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=500&q=80"],
    ["오픈소스 생태계의 지속적인 성장", "DEV REPORT", "3일 전",
     "개발자 커뮤니티와 오픈소스 프로젝트가 새로운 소프트웨어 생태계를 만들어가고 있습니다.",
     "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80"]
  ];

  const VIDEO_DATA = [
    ["웹 개발 기초: HTML, CSS, JavaScript", "StopBlocking ACADEMY", "영상 · 12:31"],
    ["처음 만드는 나만의 검색 페이지", "WEB LAB", "영상 · 18:42"],
    ["JavaScript로 만드는 인터랙티브 UI", "CODE ROOM", "영상 · 21:08"],
    ["GitHub Pages에 웹사이트 배포하기", "DEV GUIDE", "영상 · 09:44"]
  ];

  /* =========================
     State
  ========================== */
  const STORAGE = {
    history: "stopblocking_history",
    theme: "stopblocking_theme",
    engine: "stopblocking_engine",
    animations: "stopblocking_animations",
    newTab: "stopblocking_new_tab"
  };

  const state = {
    mode: "web",
    engine: localStorage.getItem(STORAGE.engine) || "google",
    theme: localStorage.getItem(STORAGE.theme) || "system",
    animations: localStorage.getItem(STORAGE.animations) !== "false",
    newTab: localStorage.getItem(STORAGE.newTab) === "true",
    history: [],
    selectedSuggestion: -1,
    activeQuery: ""
  };

  /* =========================
     DOM
  ========================== */
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const homeView = $("#homeView");
  const resultsView = $("#resultsView");
  const searchInput = $("#searchInput");
  const resultsInput = $("#resultsInput");
  const searchForm = $("#searchForm");
  const resultsForm = $("#resultsForm");
  const clearButton = $("#clearButton");
  const resultsClearButton = $("#resultsClearButton");
  const autocomplete = $("#autocompleteList");
  const historyList = $("#historyList");
  const emptyHistory = $("#emptyHistory");
  const engineButton = $("#engineButton");
  const engineMenu = $("#engineMenu");
  const engineLabel = $("#engineLabel");
  const resultsContent = $("#resultsContent");
  const resultsMeta = $("#resultsMeta");
  const loading = $("#loading");
  const toast = $("#toast");
  const settingsOverlay = $("#settingsOverlay");

  /* =========================
     Utilities / UI
  ========================== */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function escapeUrl(value) {
    return encodeURIComponent(value.trim());
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.animations = state.animations ? "on" : "off";
    localStorage.setItem(STORAGE.theme, state.theme);
    localStorage.setItem(STORAGE.animations, state.animations);
    updateThemeControls();
  }

  function updateThemeControls() {
    $$("#themeOptions button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.theme === state.theme);
    });
    $("#animationToggle").checked = state.animations;
    $("#newTabToggle").checked = state.newTab;
    $$('input[name="engine"]').forEach(radio => radio.checked = radio.value === state.engine);
  }

  function setMode(mode) {
    state.mode = mode;
    $$(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === mode));
    $$(".result-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === mode));

    if (!resultsView.hidden) {
      renderResults(state.activeQuery);
    }
  }

  function openResults() {
    homeView.hidden = true;
    resultsView.hidden = false;
    window.scrollTo({ top: 0, behavior: state.animations ? "smooth" : "auto" });
  }

  function goHome() {
    resultsView.hidden = true;
    homeView.hidden = false;
    closeAutocomplete();
    searchInput.focus();
  }

  function closeAutocomplete() {
    autocomplete.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
    state.selectedSuggestion = -1;
  }

  function updateClearButton(input, button) {
    button.hidden = !input.value;
  }

  /* =========================
     History
  ========================== */
  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE.history) || "[]");
      state.history = Array.isArray(saved) ? saved.slice(0, 10) : [];
    } catch {
      state.history = [];
    }
    renderHistory();
  }

  function saveHistory(query) {
    const value = query.trim();
    if (!value) return;

    state.history = [
      value,
      ...state.history.filter(item => item.toLowerCase() !== value.toLowerCase())
    ].slice(0, 10);

    localStorage.setItem(STORAGE.history, JSON.stringify(state.history));
    renderHistory();
  }

  function deleteHistoryItem(query) {
    state.history = state.history.filter(item => item !== query);
    localStorage.setItem(STORAGE.history, JSON.stringify(state.history));
    renderHistory();
  }

  function clearHistory() {
    state.history = [];
    localStorage.removeItem(STORAGE.history);
    renderHistory();
    showToast("검색 기록을 삭제했습니다.");
  }

  function renderHistory() {
    historyList.replaceChildren();
    emptyHistory.hidden = state.history.length > 0;

    state.history.forEach(query => {
      const wrapper = document.createElement("div");
      wrapper.className = "history-item";

      const searchBtn = document.createElement("button");
      searchBtn.className = "history-search";
      searchBtn.type = "button";
      searchBtn.textContent = query;
      searchBtn.title = query;
      searchBtn.addEventListener("click", () => performSearch(query));

      const removeBtn = document.createElement("button");
      removeBtn.className = "history-remove";
      removeBtn.type = "button";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", `${query} 기록 삭제`);
      removeBtn.addEventListener("click", () => deleteHistoryItem(query));

      wrapper.append(searchBtn, removeBtn);
      historyList.appendChild(wrapper);
    });
  }

  /* =========================
     Autocomplete
  ========================== */
  function getSuggestions(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return SUGGESTIONS
      .filter(item => item.toLowerCase().includes(normalized))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(normalized);
        const bStarts = b.toLowerCase().startsWith(normalized);
        return Number(bStarts) - Number(aStarts);
      })
      .slice(0, 6);
  }

  function renderAutocomplete() {
    const suggestions = getSuggestions(searchInput.value);
    autocomplete.replaceChildren();
    state.selectedSuggestion = -1;

    if (!suggestions.length || document.activeElement !== searchInput) {
      closeAutocomplete();
      return;
    }

    suggestions.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = "suggestion";
      button.type = "button";
      button.setAttribute("role", "option");
      button.dataset.index = index;

      const icon = document.createElement("span");
      icon.className = "suggestion-icon";
      icon.textContent = "⌕";

      const text = document.createElement("span");
      text.textContent = item;

      button.append(icon, text);
      button.addEventListener("mousedown", event => {
        event.preventDefault();
        performSearch(item);
      });

      autocomplete.appendChild(button);
    });

    autocomplete.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  function moveSuggestion(direction) {
    const items = $$(".suggestion");
    if (!items.length) return;

    state.selectedSuggestion += direction;
    if (state.selectedSuggestion < 0) state.selectedSuggestion = items.length - 1;
    if (state.selectedSuggestion >= items.length) state.selectedSuggestion = 0;

    items.forEach((item, index) => {
      const active = index === state.selectedSuggestion;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
  }

  function chooseSelectedSuggestion() {
    const items = $$(".suggestion");
    const item = items[state.selectedSuggestion];
    if (!item) return false;

    searchInput.value = item.textContent.trim();
    performSearch(searchInput.value);
    return true;
  }

  /* =========================
     Search
  ========================== */
  function externalSearch(query) {
    const encoded = escapeUrl(query);
    const url = state.engine === "bing"
      ? `https://www.bing.com/search?q=${encoded}`
      : `https://www.google.com/search?q=${encoded}`;

    if (state.newTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  }

  function performSearch(query) {
    const value = String(query || "").trim();

    if (!value) {
      showToast("검색어를 입력해주세요.");
      searchInput.focus();
      return;
    }

    saveHistory(value);
    state.activeQuery = value;
    searchInput.value = value;
    resultsInput.value = value;
    updateClearButton(searchInput, clearButton);
    updateClearButton(resultsInput, resultsClearButton);
    closeAutocomplete();

    /* 웹 모드에서는 실제 외부 검색엔진으로 이동 */
    if (state.mode === "web") {
      externalSearch(value);
      return;
    }

    openResults();
    renderResults(value);
  }

  async function renderResults(query) {
    resultsContent.replaceChildren();
    resultsMeta.textContent = "";
    loading.hidden = false;

    await new Promise(resolve => setTimeout(resolve, state.animations ? 450 : 30));

    loading.hidden = true;

    const count = (Math.abs(hashCode(query)) % 8000000) + 12000;
    resultsMeta.textContent = `검색 결과 약 ${count.toLocaleString()}개`;

    if (state.mode === "images") {
      renderImages(query);
    } else if (state.mode === "news") {
      renderNews(query);
    } else if (state.mode === "videos") {
      renderVideos(query);
    } else {
      renderDemoWeb(query);
    }
  }

  function hashCode(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function renderDemoWeb(query) {
    const results = [
      [`${query} — 알아보기`, "https://example.com", `${query}에 대한 기본적인 정보와 주요 내용을 간단하게 확인할 수 있습니다.`],
      [`${query} 관련 최신 정보`, "https://example.org", `${query}와 관련된 다양한 자료와 참고할 만한 정보를 확인해보세요.`],
      [`${query} 가이드`, "https://developer.mozilla.org", `${query}를 처음 접하는 사람도 이해하기 쉽도록 정리한 참고 자료입니다.`],
      [`${query} 정보 모음`, "https://www.wikipedia.org", `${query}에 대한 배경과 개념, 관련 주제를 살펴볼 수 있습니다.`],
      [`${query} 공식 문서`, "https://docs.github.com", "공식 문서와 개발 자료를 확인할 수 있는 예시 검색 결과입니다."]
    ];

    const container = document.createElement("div");
    container.className = "web-results";

    results.forEach((result, index) => {
      const article = document.createElement("article");
      article.className = "web-result";
      article.style.animationDelay = `${index * 45}ms`;

      const url = document.createElement("div");
      url.className = "result-url";
      url.textContent = result[1];

      const title = document.createElement("a");
      title.className = "result-title";
      title.href = result[1];
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      title.textContent = result[0];

      const description = document.createElement("p");
      description.className = "result-description";
      description.textContent = result[2];

      article.append(url, title, description);
      container.appendChild(article);
    });

    resultsContent.appendChild(container);
  }

  function renderImages(query) {
    const grid = document.createElement("div");
    grid.className = "image-grid";

    IMAGE_DATA.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "image-card";
      card.style.animationDelay = `${index * 35}ms`;

      const img = document.createElement("img");
      img.src = item[2];
      img.alt = `${query} - ${item[0]}`;
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";

      const info = document.createElement("div");
      info.className = "image-info";

      const title = document.createElement("div");
      title.className = "image-title";
      title.textContent = item[0];

      const source = document.createElement("div");
      source.className = "image-source";
      source.textContent = item[1];

      info.append(title, source);
      card.append(img, info);
      grid.appendChild(card);
    });

    resultsContent.appendChild(grid);
  }

  function renderNews(query) {
    const list = document.createElement("div");
    list.className = "news-list";

    NEWS_DATA.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "news-card";
      article.style.animationDelay = `${index * 50}ms`;

      const img = document.createElement("img");
      img.className = "news-thumb";
      img.src = item[5];
      img.alt = "";
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";

      const body = document.createElement("div");
      body.className = "news-body";

      const source = document.createElement("div");
      source.className = "news-source";
      source.textContent = `${item[1]} · ${item[2]}`;

      const title = document.createElement("div");
      title.className = "news-title";
      title.textContent = `${query} — ${item[0]}`;

      const summary = document.createElement("div");
      summary.className = "news-summary";
      summary.textContent = item[3];

      body.append(source, title, summary);
      article.append(img, body);
      list.appendChild(article);
    });

    resultsContent.appendChild(list);
  }

  function renderVideos(query) {
    const list = document.createElement("div");
    list.className = "video-list";

    VIDEO_DATA.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "video-card";
      card.style.animationDelay = `${index * 50}ms`;

      const thumb = document.createElement("div");
      thumb.className = "video-thumb";
      thumb.setAttribute("aria-hidden", "true");
      thumb.textContent = "▶";

      const body = document.createElement("div");
      body.className = "news-body";

      const source = document.createElement("div");
      source.className = "news-source";
      source.textContent = item[1];

      const title = document.createElement("div");
      title.className = "news-title";
      title.textContent = `${query} · ${item[0]}`;

      const summary = document.createElement("div");
      summary.className = "news-summary";
      summary.textContent = item[2];

      body.append(source, title, summary);
      card.append(thumb, body);
      list.appendChild(card);
    });

    resultsContent.appendChild(list);
  }

  /* =========================
     Settings
  ========================== */
  function openSettings() {
    settingsOverlay.hidden = false;
    updateThemeControls();
    $("#closeSettings").focus();
  }

  function closeSettings() {
    settingsOverlay.hidden = true;
  }

  function selectEngine(engine) {
    state.engine = engine;
    localStorage.setItem(STORAGE.engine, engine);
    engineLabel.textContent = engine === "bing" ? "Bing" : "Google";

    $$(".engine-option").forEach(option => {
      const selected = option.dataset.engine === engine;
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-selected", String(selected));
    });
  }

  /* =========================
     Event Listeners
  ========================== */
  $("#homeButton").addEventListener("click", goHome);
  $("#settingsButton").addEventListener("click", openSettings);
  $("#closeSettings").addEventListener("click", closeSettings);

  settingsOverlay.addEventListener("click", event => {
    if (event.target === settingsOverlay) closeSettings();
  });

  $("#themeButton").addEventListener("click", () => {
    const next = state.theme === "light" ? "dark" : state.theme === "dark" ? "system" : "light";
    state.theme = next;
    applyTheme();
  });

  $$(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      setMode(btn.dataset.mode);

      if (btn.dataset.mode !== "web" && state.activeQuery) {
        openResults();
        renderResults(state.activeQuery);
      } else if (btn.dataset.mode === "web" && state.activeQuery) {
        externalSearch(state.activeQuery);
      }
    });
  });

  $$(".result-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      setMode(btn.dataset.mode);
      if (state.activeQuery) renderResults(state.activeQuery);
    });
  });

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!chooseSelectedSuggestion()) performSearch(searchInput.value);
  });

  resultsForm.addEventListener("submit", event => {
    event.preventDefault();
    const value = resultsInput.value.trim();
    if (!value) {
      showToast("검색어를 입력해주세요.");
      resultsInput.focus();
      return;
    }

    state.activeQuery = value;
    saveHistory(value);

    if (state.mode === "web") externalSearch(value);
    else renderResults(value);
  });

  searchInput.addEventListener("input", () => {
    updateClearButton(searchInput, clearButton);
    renderAutocomplete();
  });

  resultsInput.addEventListener("input", () => {
    updateClearButton(resultsInput, resultsClearButton);
  });

  searchInput.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSuggestion(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSuggestion(-1);
    } else if (event.key === "Escape") {
      closeAutocomplete();
    } else if (event.key === "Enter" && state.selectedSuggestion >= 0) {
      event.preventDefault();
      chooseSelectedSuggestion();
    }
  });

  searchInput.addEventListener("focus", renderAutocomplete);
  searchInput.addEventListener("blur", () => setTimeout(closeAutocomplete, 120));

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    updateClearButton(searchInput, clearButton);
    closeAutocomplete();
    searchInput.focus();
  });

  resultsClearButton.addEventListener("click", () => {
    resultsInput.value = "";
    updateClearButton(resultsInput, resultsClearButton);
    resultsInput.focus();
  });

  engineButton.addEventListener("click", () => {
    engineMenu.hidden = !engineMenu.hidden;
    engineButton.setAttribute("aria-expanded", String(!engineMenu.hidden));
  });

  $$(".engine-option").forEach(option => {
    option.addEventListener("click", () => {
      selectEngine(option.dataset.engine);
      engineMenu.hidden = true;
      engineButton.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", event => {
    if (!$("#engineSelect").contains(event.target)) {
      engineMenu.hidden = true;
      engineButton.setAttribute("aria-expanded", "false");
    }
  });

  $("#voiceButton").addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("이 브라우저에서는 음성 검색을 지원하지 않습니다.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => showToast("말씀해주세요.");
    recognition.onresult = event => {
      const text = event.results[0][0].transcript;
      searchInput.value = text;
      updateClearButton(searchInput, clearButton);
      performSearch(text);
    };
    recognition.onerror = () => showToast("음성 검색을 사용할 수 없습니다.");
    recognition.start();
  });

  $$("#themeOptions button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.theme = btn.dataset.theme;
      applyTheme();
    });
  });

  $$('input[name="engine"]').forEach(radio => {
    radio.addEventListener("change", () => selectEngine(radio.value));
  });

  $("#animationToggle").addEventListener("change", event => {
    state.animations = event.target.checked;
    applyTheme();
  });

  $("#newTabToggle").addEventListener("change", event => {
    state.newTab = event.target.checked;
    localStorage.setItem(STORAGE.newTab, String(state.newTab));
  });

  $("#clearHistoryButton").addEventListener("click", clearHistory);

  document.addEventListener("keydown", event => {
    const modifier = event.ctrlKey || event.metaKey;

    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      searchInput.focus();
      return;
    }

    if (modifier && event.key.toLowerCase() === "k") {
      event.preventDefault();
      (resultsView.hidden ? searchInput : resultsInput).focus();
      return;
    }

    if (event.key === "Escape") {
      closeAutocomplete();
      if (!settingsOverlay.hidden) closeSettings();
      engineMenu.hidden = true;
      engineButton.setAttribute("aria-expanded", "false");
    }
  });

  /* =========================
     Initialization
  ========================== */
  state.theme = localStorage.getItem(STORAGE.theme) || "system";
  state.engine = localStorage.getItem(STORAGE.engine) || "google";
  state.animations = localStorage.getItem(STORAGE.animations) !== "false";
  state.newTab = localStorage.getItem(STORAGE.newTab) === "true";

  applyTheme();
  selectEngine(state.engine);
  loadHistory();
  updateClearButton(searchInput, clearButton);
  updateClearButton(resultsInput, resultsClearButton);
})();
