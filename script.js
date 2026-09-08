(() => {
"use strict";

/*
  StopBlocking은 외부 검색엔진을 사용하지 않는 브라우저 기반 검색기입니다.
  검색은 아래 LOCAL_INDEX 배열을 대상으로 수행됩니다.
  따라서 Google/Bing/검색 API URL로 검색어를 전송하는 코드는 존재하지 않습니다.
*/

const LOCAL_INDEX = [
  {kind:"web",title:"StopBlocking 소개",url:"stopblocking://about",text:"외부 검색엔진 없이 자체 색인 데이터에서 검색하는 독립 검색 프로젝트입니다.",tags:"stopblocking 독립 검색 검색엔진"},
  {kind:"web",title:"HTML CSS JavaScript 웹 개발 가이드",url:"stopblocking://web-development",text:"HTML 구조, CSS 디자인, JavaScript 기능으로 정적 웹사이트를 만드는 방법을 알아봅니다.",tags:"html css javascript 웹 개발 코딩"},
  {kind:"web",title:"GitHub Pages 배포 가이드",url:"stopblocking://github-pages",text:"정적 HTML CSS JavaScript 프로젝트를 GitHub Pages에서 공개하는 기본 방법입니다.",tags:"github pages 배포 웹사이트"},
  {kind:"web",title:"JavaScript 검색 기능 만들기",url:"stopblocking://javascript-search",text:"배열과 문자열 검색을 이용해 브라우저에서 작동하는 간단한 검색 기능을 구현합니다.",tags:"javascript 검색 알고리즘"},
  {kind:"web",title:"웹 접근성 기본 원칙",url:"stopblocking://accessibility",text:"키보드 탐색, 명확한 레이블, 충분한 대비 등 접근성의 기본 개념을 정리합니다.",tags:"접근성 accessibility ux ui"},
  {kind:"web",title:"컴퓨터 네트워크 기초",url:"stopblocking://network",text:"웹 브라우저, 서버, DNS, HTTP가 서로 어떻게 연결되는지 설명합니다.",tags:"네트워크 http dns 인터넷"},
  {kind:"web",title:"프로그래밍 프로젝트 아이디어",url:"stopblocking://projects",text:"학생이 직접 만들 수 있는 웹, Python, Arduino 프로젝트 아이디어 모음입니다.",tags:"프로젝트 python arduino 아이디어"},
  {kind:"web",title:"검색 시스템은 어떻게 작동할까?",url:"stopblocking://search-system",text:"문서 수집, 색인, 토큰화, 랭킹으로 이어지는 검색 시스템의 구조를 살펴봅니다.",tags:"검색 색인 ranking crawler"},
  {kind:"news",title:"오픈 웹 기술 동향",source:"StopBlocking News",date:"2026-09-01",text:"정적 웹 기술과 브라우저 기반 애플리케이션이 계속 발전하고 있습니다.",tags:"웹 기술 개발"},
  {kind:"news",title:"학생 개발자를 위한 웹 도구",source:"StopBlocking News",date:"2026-08-27",text:"작은 프로젝트를 빠르게 공개할 수 있는 정적 호스팅 도구가 주목받고 있습니다.",tags:"학생 개발 github"},
  {kind:"news",title:"브라우저 검색 UX 변화",source:"StopBlocking News",date:"2026-08-20",text:"빠른 자동완성과 키보드 중심 인터페이스가 검색 경험을 개선하고 있습니다.",tags:"검색 ux 브라우저"},
  {kind:"news",title:"오프라인 우선 웹앱",source:"StopBlocking News",date:"2026-08-14",text:"네트워크 연결이 없어도 핵심 기능을 사용할 수 있는 웹앱 구조가 관심을 받고 있습니다.",tags:"offline pwa 웹앱"},
  {kind:"image",title:"미래 도시",tags:"도시 미래 technology"},
  {kind:"image",title:"코딩 작업 공간",tags:"코딩 개발 컴퓨터 workspace"},
  {kind:"image",title:"우주와 별",tags:"우주 별 space"},
  {kind:"image",title:"산과 자연",tags:"자연 산 outdoor"},
  {kind:"image",title:"디지털 회로",tags:"기술 technology computer"},
  {kind:"image",title:"미니멀 책상",tags:"책상 workspace minimal"},
  {kind:"video",title:"JavaScript 검색 기능 튜토리얼",source:"StopBlocking Studio",duration:"08:42",text:"브라우저에서 배열을 검색하고 결과를 정렬하는 기본 튜토리얼입니다.",tags:"javascript 검색 코딩"},
  {kind:"video",title:"GitHub Pages 처음 배포하기",source:"StopBlocking Studio",duration:"06:15",text:"HTML CSS JavaScript 사이트를 정적 호스팅으로 공개하는 과정을 설명합니다.",tags:"github pages 배포"},
  {kind:"video",title:"웹사이트 UI를 깔끔하게 만드는 법",source:"StopBlocking Studio",duration:"10:21",text:"검색창, 카드, 여백과 반응형 레이아웃을 설계하는 방법입니다.",tags:"ui ux css 디자인"}
];

const suggestions = ["JavaScript","웹 개발","GitHub Pages","검색 시스템","Python","Arduino","컴퓨터 네트워크","웹 접근성","StopBlocking"];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = {
  mode:"web",
  query:"",
  history:JSON.parse(localStorage.getItem("stopblocking-history")||"[]"),
  theme:localStorage.getItem("stopblocking-theme")||"system",
  animation:localStorage.getItem("stopblocking-animation")!=="false",
  newTab:localStorage.getItem("stopblocking-newtab")==="true",
  selected:-1
};

function escapeText(v){return String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function normalize(v){return String(v).toLowerCase().normalize("NFKC").trim();}
function score(item,q){
  const terms=normalize(q).split(/\s+/).filter(Boolean);
  const hay=normalize([item.title,item.text,item.tags,item.source,item.url].join(" "));
  let s=0;
  for(const t of terms){
    if(normalize(item.title).includes(t)) s+=8;
    if(hay.includes(t)) s+=3;
  }
  return s;
}
function searchLocal(q,kind){
  const n=normalize(q);
  let list=LOCAL_INDEX.filter(x=>x.kind===kind);
  if(!n) return list;
  return list.map(x=>({x,s:score(x,n)})).filter(o=>o.s>0).sort((a,b)=>b.s-a.s).map(o=>o.x);
}
function svgData(label,kind){
  const bg=kind==="image"?"#dfe5ee":kind==="news"?"#e7e9ed":"#d9dde4";
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" fill="#30353c">${escapeText(label)}</text><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#69717c">StopBlocking local index</text></svg>`;
  return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),1800)}
function saveHistory(q){q=q.trim();if(!q)return;state.history=[q,...state.history.filter(x=>x!==q)].slice(0,10);localStorage.setItem("stopblocking-history",JSON.stringify(state.history));renderHistory();}
function renderHistory(){
  const panel=$("#history"),list=$("#historyList");
  if(!state.history.length){panel.hidden=true;return}
  panel.hidden=false;list.replaceChildren();
  state.history.forEach(q=>{
    const row=document.createElement("div");row.className="history-row";
    const b=document.createElement("button");b.textContent=q;b.onclick=()=>perform(q);
    const d=document.createElement("button");d.className="remove";d.textContent="×";d.setAttribute("aria-label",q+" 삭제");d.onclick=()=>{state.history=state.history.filter(x=>x!==q);localStorage.setItem("stopblocking-history",JSON.stringify(state.history));renderHistory()};
    row.append(b,d);list.append(row);
  });
}
function clearHistory(){state.history=[];localStorage.removeItem("stopblocking-history");renderHistory();toast("검색 기록을 삭제했습니다.")}
function renderSuggestions(input,box){
  const q=normalize(input.value);
  if(!q){box.hidden=true;return}
  const arr=suggestions.filter(x=>normalize(x).includes(q)).slice(0,6);
  box.replaceChildren();
  state.selected=-1;
  if(!arr.length){box.hidden=true;return}
  arr.forEach((x,i)=>{const b=document.createElement("button");b.textContent=x;b.dataset.index=i;b.onclick=()=>{input.value=x;box.hidden=true;perform(x)};box.append(b)});
  box.hidden=false;
}
function wireInput(input,box){
  input.addEventListener("input",()=>{updateClear(input);renderSuggestions(input,box)});
  input.addEventListener("focus",()=>renderSuggestions(input,box));
  input.addEventListener("keydown",e=>{
    const items=[...box.querySelectorAll("button")];
    if(e.key==="ArrowDown"&&items.length){e.preventDefault();state.selected=Math.min(state.selected+1,items.length-1);items.forEach((b,i)=>b.classList.toggle("selected",i===state.selected))}
    else if(e.key==="ArrowUp"&&items.length){e.preventDefault();state.selected=Math.max(state.selected-1,0);items.forEach((b,i)=>b.classList.toggle("selected",i===state.selected))}
    else if(e.key==="Enter"&&state.selected>=0&&items[state.selected]){e.preventDefault();items[state.selected].click()}
    else if(e.key==="Escape"){box.hidden=true}
  });
}
function updateClear(input){input.closest(".search-box").querySelector(".inside").style.visibility=input.value?"visible":"hidden"}
function setMode(mode){state.mode=mode;$$("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));if(!$("#results").hidden)renderResults()}
function perform(q){
  q=q.trim();
  if(!q){toast("검색어를 입력해주세요.");return}
  state.query=q;saveHistory(q);$("#home").hidden=true;$("#results").hidden=false;$("#resultsInput").value=q;updateClear($("#resultsInput"));renderResults();window.scrollTo({top:0,behavior:state.animation?"smooth":"auto"});
}
function renderResults(){
  const q=state.query;
  $("#loading").hidden=false;$("#content").replaceChildren();
  setTimeout(()=>{
    $("#loading").hidden=true;
    const kind=state.mode==="images"?"image":state.mode==="news"?"news":state.mode==="videos"?"video":"web";
    const data=searchLocal(q,kind);
    $("#meta").textContent=`${data.length}개 결과`;
    if(!data.length){
      const e=document.createElement("div");e.className="empty";e.innerHTML="<strong>관련 결과가 없습니다.</strong>StopBlocking 자체 색인에서 일치하는 문서를 찾지 못했습니다.";$("#content").append(e);return;
    }
    if(kind==="web")renderWeb(data);else if(kind==="image")renderImages(data);else if(kind==="news")renderNews(data);else renderVideos(data);
  },state.animation?260:0);
}
function renderWeb(data){
  const list=document.createElement("div");list.className="web-list";
  data.forEach(x=>{
    const card=document.createElement("article");card.className="web-card";
    const a=document.createElement("a");a.href="#";a.addEventListener("click",e=>{e.preventDefault();toast("이 결과는 StopBlocking 자체 색인 항목입니다.")});
    const url=document.createElement("div");url.className="url";url.textContent=x.url;
    const h=document.createElement("h3");h.textContent=x.title;
    const p=document.createElement("p");p.textContent=x.text;
    a.append(url,h,p);card.append(a);list.append(card);
  });$("#content").append(list);
}
function renderImages(data){
  const grid=document.createElement("div");grid.className="grid";
  data.forEach(x=>{const card=document.createElement("article");card.className="image-card";const img=document.createElement("img");img.src=svgData(x.title,"image");img.alt=x.title;const p=document.createElement("p");p.textContent=x.title;card.append(img,p);grid.append(card)});$("#content").append(grid);
}
function renderNews(data){
  const list=document.createElement("div");list.className="news-list";
  data.forEach(x=>{const card=document.createElement("article");card.className="news-card";const img=document.createElement("img");img.src=svgData(x.title,"news");img.alt="";const div=document.createElement("div");const m=document.createElement("div");m.className="meta";m.textContent=`${x.source} · ${x.date}`;const h=document.createElement("h3");h.textContent=x.title;const p=document.createElement("p");p.textContent=x.text;div.append(m,h,p);card.append(img,div);list.append(card)});$("#content").append(list);
}
function renderVideos(data){
  const list=document.createElement("div");list.className="video-list";
  data.forEach(x=>{const card=document.createElement("article");card.className="video-card";const img=document.createElement("img");img.className="video-thumb";img.src=svgData(x.title,"video");img.alt="";const div=document.createElement("div");const m=document.createElement("div");m.className="meta";m.textContent=`${x.source} · ${x.duration}`;const h=document.createElement("h3");h.textContent=x.title;const p=document.createElement("p");p.textContent=x.text;div.append(m,h,p);card.append(img,div);list.append(card)});$("#content").append(list);
}
function goHome(){$("#results").hidden=true;$("#home").hidden=false;$("#homeInput").focus();renderHistory()}
function applyTheme(){
  const dark=state.theme==="dark"||(state.theme==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
  document.body.classList.toggle("dark",dark);$$("[data-theme]").forEach(b=>b.classList.toggle("active",b.dataset.theme===state.theme));
  document.documentElement.style.colorScheme=dark?"dark":"light";
}
function openSettings(){$("#overlay").hidden=false;applyTheme();$("#animation").checked=state.animation;$("#newTab").checked=state.newTab}
function closeSettings(){$("#overlay").hidden=true}
function init(){
  renderHistory();applyTheme();updateClear($("#homeInput"));updateClear($("#resultsInput"));
  wireInput($("#homeInput"),$("#homeSuggest"));wireInput($("#resultsInput"),$("#resultSuggest"));
  $("#homeForm").onsubmit=e=>{e.preventDefault();perform($("#homeInput").value)};
  $("#resultsForm").onsubmit=e=>{e.preventDefault();perform($("#resultsInput").value)};
  $("#clearHome").onclick=()=>{$("#homeInput").value="";updateClear($("#homeInput"));$("#homeSuggest").hidden=true;$("#homeInput").focus()};
  $("#clearResults").onclick=()=>{$("#resultsInput").value="";updateClear($("#resultsInput"));$("#resultSuggest").hidden=true;$("#resultsInput").focus()};
  $("#clearHistory").onclick=clearHistory;$("#settingsClear").onclick=clearHistory;
  $("#homeLink").onclick=e=>{e.preventDefault();goHome()};$("#miniHome").onclick=e=>{e.preventDefault();goHome()};
  $("#settingsBtn").onclick=openSettings;$("#closeSettings").onclick=closeSettings;$("#overlay").onclick=e=>{if(e.target===e.currentTarget)closeSettings()};
  $("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";localStorage.setItem("stopblocking-theme",state.theme);applyTheme()};
  $$("[data-mode]").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
  $$("[data-theme]").forEach(b=>b.onclick=()=>{state.theme=b.dataset.theme;localStorage.setItem("stopblocking-theme",state.theme);applyTheme()});
  $("#animation").onchange=e=>{state.animation=e.target.checked;localStorage.setItem("stopblocking-animation",state.animation)};
  $("#newTab").onchange=e=>{state.newTab=e.target.checked;localStorage.setItem("stopblocking-newtab",state.newTab)};
  $("#voice").onclick=()=>{
    const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Speech){toast("이 브라우저는 음성 검색을 지원하지 않습니다.");return}
    const r=new Speech();r.lang="ko-KR";r.onresult=e=>{$("#homeInput").value=e.results[0][0].transcript;updateClear($("#homeInput"));perform($("#homeInput").value)};r.start();
  };
  document.addEventListener("keydown",e=>{
    const tag=document.activeElement?.tagName;
    if(e.key==="/"&&tag!=="INPUT"&&tag!=="TEXTAREA"){e.preventDefault();(($("#results").hidden)?$("#homeInput"):$("#resultsInput")).focus()}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();(($("#results").hidden)?$("#homeInput"):$("#resultsInput")).focus()}
    if(e.key==="Escape"&&!$("#overlay").hidden)closeSettings();
  });
}
init();
})();