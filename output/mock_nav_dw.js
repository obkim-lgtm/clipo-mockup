/* ===== 목업 내비게이터 (까망이) — 학생 직접 작성 세트 5종 공통 =====
 * 규칙: docs/mockup-navigator.md
 * 삽입 파일: task_direct_write_v1_260729 · focus_log_v2_260806 ·
 *            scoring_direct_write_v1_260729 · student_home_v1_260729 ·
 *            student_submit_v1_260729
 *
 * 각 파일이 이 스크립트보다 먼저 선언해야 하는 것:
 *   window.MOCK_NAV_FILE  = 'submit';            // 아래 FILES 의 키
 *   window.MOCK_NAV_APPLY = { write:function(){ go('write'); }, ... };
 *                                                // 이 파일 안에서 케이스를 적용하는 핸들러
 * 라벨·그룹은 이 파일 하나만 고치면 5종에 동시 반영된다(파일별 복붙 금지).
 */
(function(){
  var FILES = {
    design:  'task_direct_write_v1_260729.html',
    task:    'focus_log_v3_260819.html',   /* 최종본. v1(260728)·v2(260806)는 기존 시안 — 까망이 제거됨(2026-08-19) */
    scoring: 'scoring_direct_write_v1_260729.html',
    home:    'student_home_v1_260729.html',
    submit:  'student_submit_v1_260729.html'
  };

  /* route → { f:파일키, h:해시(딥링크) } */
  var ROUTES = {
    dwList:      { f:'design',  h:'list' },
    dwDesign:    { f:'design',  h:'design' },
    dwQuestions: { f:'design',  h:'questions' },
    dwRecHelp:   { f:'design',  h:'rec-help' },
    rubOk:       { f:'design',  h:'rubric-ok' },
    rubErr:      { f:'design',  h:'rubric-error' },
    flTask:      { f:'task',    h:'teacher-log' },
    flKim:       { f:'task',    h:'case-kim' },
    flPark:      { f:'task',    h:'case-park' },
    flLee:       { f:'task',    h:'case-lee' },
    flJung:      { f:'task',    h:'case-jung' },
    flHan:       { f:'task',    h:'case-han' },
    scWrite:     { f:'scoring', h:'doc-write' },
    scFile:      { f:'scoring', h:'doc-file' },
    scDeleted:   { f:'scoring', h:'doc-deleted' },
    scResubNo:   { f:'scoring', h:'resub-no' },
    scResubYes:  { f:'scoring', h:'resub-yes' },
    shNew:       { f:'home',    h:'new' },
    shCur:       { f:'home',    h:'current' },
    shStu:       { f:'home',    h:'student' },
    shCards:     { f:'home',    h:'cards' },
    shHome5:     { f:'home',    h:'home5' },
    shTask5:     { f:'home',    h:'task5' },
    shHome5Clear:{ f:'home',    h:'home5-zero-clear' },
    shHome5None: { f:'home',    h:'home5-zero-none' },
    shTask5None: { f:'home',    h:'task5-zero-none' },
    shTask5NoRes:{ f:'home',    h:'task5-no-result' },
    shHome5High: { f:'home',    h:'home5-high' },
    shHome6:     { f:'home',    h:'home6' },
    shTask6:     { f:'home',    h:'task6' },
    shHome6Zero: { f:'home',    h:'home6-zero-none' },
    shHome6NoRes:{ f:'home',    h:'home6-no-result' },
    shHome6High: { f:'home',    h:'home6-high' },
    ssGuide:     { f:'submit',  h:'guide' },
    ssLeave:     { f:'submit',  h:'leave' },
    ssWrite:     { f:'submit',  h:'write' },
    ssDone:      { f:'submit',  h:'done' },
    ssBoth:      { f:'submit',  h:'both' },
    ssFileonly:  { f:'submit',  h:'fileonly' },
    ssPreparing: { f:'submit',  h:'preparing' },
    ssClosed:    { f:'submit',  h:'closed' },
    ssBefore:    { f:'submit',  h:'result-before' },
    ssAfter:     { f:'submit',  h:'result-after' },
    ssPdf:       { f:'submit',  h:'pdf' },
    ssAttachPv:  { f:'submit',  h:'attach-preview' },
    ssAttachDl:  { f:'submit',  h:'attach-download' }
  };

  /* 전체 화면·케이스를 항상 펼쳐 둔다. 길이는 패널 내부 스크롤로 처리(2026-08-06).
   * 예전에는 해당 화면에 들어가야 케이스가 보였는데, 어떤 케이스가 있는지 자체를 알 수 없어
   * "차트가 없다"처럼 못 찾는 일이 생겼다. */
  /* 파일이 window.MOCK_NAV_GROUPS 를 미리 선언하면 그 파일에서만 목록을 갈아끼운다.
   * student_home은 '학생 홈' 전용 내비게이터라 교사 그룹을 싣지 않는다 (2026-08-11 올립).
   * 나머지 파일은 아래 기본 목록을 그대로 쓴다. */
  var GROUPS = window.MOCK_NAV_GROUPS || [
    { t:'교사 · 평가 설계',        items:[['dwList','과제 목록'],['dwDesign','과제 설계'],['dwQuestions','문항 작성'],
        ['dwRecHelp','기록 안내 팝업',{sub:'작성 과정 기록 ? 팝오버 열림'}]] },
    /* 채점기준 AI 성공/오류는 별도 그룹으로 두지 않는다 — 문항 작성 화면 안의 [AI 생성] 버튼으로 시연 (2026-08-06 올립) */
    { t:'교사 · 과제물 관리',      items:[['flTask','제출 현황']] },
    /* '작성 과정 케이스' 5종은 까망이에서 숨겼다 (2026-08-11 올립) —
       제출 현황 화면에서 학생을 고르면 바로 보이므로 목록에 또 둘 필요가 없다.
       되살리려면 아래 주석만 풀 것 — 지우지 말 것 */
    // { t:'└ 작성 과정 케이스',      items:[
    //     ['flKim','김서윤 · 재제출',{sub:'타임라인 1개 + 제출 마커 3개'}],
    //     ['flPark','박지민 · 이탈 잦음',{sub:'이탈 후 계단식 급증'}],
    //     ['flLee','이준호 · 기록 공백',{sub:'네트워크 끊김 구간'}],
    //     ['flJung','정현우 · 이탈 없음',{sub:'멈춤·삭제가 남은 곡선'}],
    //     ['flHan','한지우 · 나눠 쓰기',{sub:'이틀에 걸쳐 3번에 나눠 씀'}]] },
    { t:'교사 · 채점 상세',        items:[['scWrite','클리포를 통한 제출'],['scFile','파일 첨부'],['scDeleted','과제물 삭제됨']] },
    { t:'└ 채점 학생 상태',        items:[['scResubNo','채점 중'],['scResubYes','채점 후 재제출함']] },
    /* 시안 5만 싣는다 (2026-08-11 올립). 시안 1~4는 화면이 파일에 그대로 있어
       해시로 열린다: #current · #new · #student · #cards
       다시 보이게 하려면 아래 주석 네 줄만 풀 것 — 지우지 말 것 */
    { t:'학생 · 과제 홈', items:[
        ['shHome6','과제 목록',{sub:'시안 6 · 단일 표 + 상태 칩'}],
        ['shTask6','과제 메뉴',{sub:'내용 동일 · 헤더만 다름'}]] },
    // { t:'└ 이전 시안 (비교용)', items:[
    //     ['shCur','1. 현재 개발 화면 + 대시보드',{sub:'표 유지 · 상단 2칸 요약만 추가'}],
    //     ['shNew','2. 개선안',{sub:'할 일 기준 재배열 · 오늘 요약 배너'}],
    //     ['shStu','3. 전면 개편안 · 결과 목록형',{sub:'결과 행 + 점수 · 더 보기 공통'}],
    //     ['shCards','4. 전면 개편안 · 결과 카드형',{sub:'결과 카드 그리드 · 수업 필터는 드롭다운'}]] },
    { t:'학생 · 과제 제출',        items:[['ssWrite','① 작성'],['ssDone','② 제출 완료']] },
    { t:'└ 작성 화면 케이스',      items:[
        ['ssGuide','시작 안내 팝업',{sub:'과제 최초 진입 · 처음 한 번만'}],
        ['ssLeave','다른 화면 다녀옴',{sub:'알림(8초) + 누적 상태'}],
        ['ssAttachPv','첨부 PDF 열기',{sub:'팝업 미리보기 · 이탈 아님'}],
        ['ssAttachDl','첨부 한글 열기',{sub:'다운로드 · 이탈 1회'}]] },
    { t:'└ 다른 설정으로 낸 과제', items:[['ssBoth','직접 작성 + 파일 제출'],['ssFileonly','파일 제출만'],['ssPreparing','문항 미작성'],['ssClosed','제출 못 한 채 마감',{sub:'쓰던 글은 비활성 에디터로'}]] },
    { t:'└ 제출 완료 화면 상태',   items:[['ssBefore','결과 공개 전'],['ssAfter','결과 공개 후'],['ssPdf','답안 PDF']] }
  ];

  var ME    = window.MOCK_NAV_FILE || '';
  var APPLY = window.MOCK_NAV_APPLY || {};
  var CUR   = '';

  /* 진입 해시 → route 역산 (이 파일의 route 중에서만).
   * 페이지 초기화 코드가 파싱 시점에 모르는 해시를 자기 기본 화면으로 replaceState 해버리므로,
   * <head>에서 미리 잡아둔 MOCK_NAV_ENTRY_HASH 를 우선 사용한다. */
  function routeFromHash(){
    var h = (window.MOCK_NAV_ENTRY_HASH || location.hash || '').slice(1);
    if (!h) return '';
    for (var k in ROUTES) { if (ROUTES[k].f === ME && ROUTES[k].h === h) return k; }
    return '';
  }
  function firstRouteOfMe(){
    for (var k in ROUTES) { if (ROUTES[k].f === ME) return k; }
    return '';
  }

  var css = '#mockNav{position:fixed;left:24px;bottom:24px;z-index:5000;width:236px;max-height:calc(50vh - 24px);display:flex;flex-direction:column;background:#222736;color:#C9CCE0;border-radius:14px;padding:10px;box-shadow:0 12px 34px rgba(0,0,0,.38);font-family:"Pretendard GOV",sans-serif;}'
    + '#mockNav .mn-head{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:move;padding:4px 4px 8px;flex-shrink:0;}'
    + '#mockNav .mn-hl{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;letter-spacing:.06em;color:#8A8FB0;}'
    + '#mockNav .mn-dot{width:10px;height:10px;border-radius:50%;background:#416bff;box-shadow:0 0 0 3px rgba(65,107,255,.25);flex-shrink:0;}'
    + '#mockNav .mn-mini{display:none;}'
    + '#mockNav .mn-caret{background:none;border:none;color:#8A8FB0;cursor:pointer;font-size:12px;padding:2px 4px;line-height:1;transition:transform .15s;}'
    + '#mockNav .mn-body{display:flex;flex-direction:column;gap:4px;flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding-right:4px;scrollbar-width:thin;scrollbar-color:#4a5170 transparent;overscroll-behavior:contain;}'
    + '#mockNav .mn-body::-webkit-scrollbar{width:6px;}'
    + '#mockNav .mn-body::-webkit-scrollbar-track{background:transparent;}'
    + '#mockNav .mn-body::-webkit-scrollbar-thumb{background:#4a5170;border-radius:3px;}'
    + '#mockNav .mn-body::-webkit-scrollbar-thumb:hover{background:#5c6488;}'
    + '#mockNav .mn-group{font-size:10px;font-weight:800;letter-spacing:.08em;color:#6b7192;margin:9px 4px 3px;}'
    + '#mockNav .mn-btn{width:100%;text-align:left;white-space:nowrap;padding:8px 11px;border-radius:9px;border:1px solid #333a52;background:#2A2F44;color:#C9CCE0;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;line-height:1.3;}'
    + '#mockNav .mn-btn:hover{background:#333a55;}'
    + '#mockNav .mn-btn.on{background:#416bff;color:#fff;border-color:#416bff;}'
    + '#mockNav .mn-sub{display:block;font-size:11px;font-weight:600;color:#8A8FB0;margin-top:2px;white-space:normal;line-height:1.35;}'
    + '#mockNav .mn-btn.on .mn-sub{color:#D6E2FF;}'
    + '#mockNav.mn-collapsed{width:auto;max-height:none;}'
    + '#mockNav.mn-collapsed .mn-body{display:none;}'
    + '#mockNav.mn-collapsed .mn-full{display:none;}'
    + '#mockNav.mn-collapsed .mn-mini{display:inline;}'
    + '#mockNav.mn-collapsed .mn-caret{transform:rotate(180deg);}'
    + '#mockpick,#mockjump,#rubDemoToggle{display:none!important;}';   /* 구형 패널·전용 토글은 까망이로 통합 */
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* 구형 패널은 CSS 숨김에 더해 DOM에서 제거 — CSS만으로는 캐시·id 누락 시 두 개가 떠 보이는 사고 재발 (2026-08-06 ×2회) */
  ['mockpick','mockjump','rubDemoToggle'].forEach(function(id){
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  var wrap = document.createElement('div'); wrap.id = 'mockNav';
  wrap.innerHTML =
      '<div class="mn-head"><span class="mn-hl"><span class="mn-dot"></span><span class="mn-full">MOCKUP · 학생 과제 (시안 6)</span><span class="mn-mini">목업</span></span>'
    + '<button class="mn-caret" aria-label="접기/펼치기">&#9662;</button></div>'
    + '<div class="mn-body" id="mnBody"></div>';
  document.body.appendChild(wrap);
  var bodyEl = wrap.querySelector('#mnBody');

  function render(){
    var keep = bodyEl.scrollTop;   /* 케이스 전환 재렌더 시 스크롤 유지 */
    var rows = '';
    GROUPS.filter(function(g){ return !g.showOn || g.showOn.indexOf(CUR) > -1; }).forEach(function(g){
      var items = g.items.filter(function(it){ return !(it[2] && it[2].hideOnCur && it[2].hideOnCur.indexOf(CUR) > -1); });
      if (!items.length) return;
      rows += '<div class="mn-group">' + g.t + '</div>';
      items.forEach(function(it){
        var sub = (it[2] && it[2].sub) ? '<span class="mn-sub">' + it[2].sub + '</span>' : '';
        rows += '<button class="mn-btn' + (it[0] === CUR ? ' on' : '') + '" data-r="' + it[0] + '">' + it[1] + sub + '</button>';
      });
    });
    bodyEl.innerHTML = rows;
    bodyEl.querySelectorAll('.mn-btn').forEach(function(b){
      b.addEventListener('click', function(e){ e.stopPropagation(); go(b.dataset.r); });
    });
    bodyEl.scrollTop = keep;
  }

  /* 스크롤 위치는 파일 간에도 유지 — 화면을 옮겨도 보던 자리에서 이어 봄 */
  bodyEl.addEventListener('scroll', function(){
    try { localStorage.setItem('clipoMockNavScroll', String(bodyEl.scrollTop)); } catch(e){}
  });

  /* 같은 파일이면 핸들러로 즉시 전환, 다른 파일이면 딥링크로 이동 */
  function go(r){
    var t = ROUTES[r];
    if (!t) return;
    if (t.f === ME) {
      if (typeof APPLY[r] === 'function') APPLY[r]();
      if (location.hash !== '#' + t.h) history.replaceState(null, '', '#' + t.h);
      setCurrent(r);
    } else {
      location.href = FILES[t.f] + '#' + t.h;
    }
  }

  function setCurrent(r){ CUR = r; render(); }
  window.mockNavSetCurrent = setCurrent;

  /* 진입 시 딥링크 적용.
   * 페이지 자체 해시 핸들러(DOMContentLoaded 등)가 먼저 돌면서 모르는 해시를 기본 화면으로
   * 되돌려버리므로, 반드시 load 이후에 적용한다. 패널 자체는 지금 바로 그린다. */
  var entry = routeFromHash();
  CUR = entry || firstRouteOfMe();
  render();
  try { bodyEl.scrollTop = parseInt(localStorage.getItem('clipoMockNavScroll') || '0', 10); } catch(e){}

  function applyEntry(){
    if (!entry || typeof APPLY[entry] !== 'function') return;
    APPLY[entry]();
    if (location.hash !== '#' + ROUTES[entry].h) history.replaceState(null, '', '#' + ROUTES[entry].h);
    setCurrent(entry);
  }
  if (document.readyState === 'complete') applyEntry();
  else window.addEventListener('load', applyEntry);

  /* 위치·접힘 상태 유지 (파일 간 공유) */
  function saveNavState(){
    try {
      /* 키를 PosL로 교체(2026-08-06) — 기본 위치를 좌하단으로 바꾸며 예전 우측 저장값이 덮지 않게 */
      localStorage.setItem('clipoMockNavPosL', JSON.stringify({ left: wrap.style.left, top: wrap.style.top }));
      localStorage.setItem('clipoMockNavCollapsed', wrap.classList.contains('mn-collapsed') ? '1' : '0');
    } catch(e){}
  }
  (function restore(){
    try {
      var pos = JSON.parse(localStorage.getItem('clipoMockNavPosL') || 'null');
      if (pos && pos.left && pos.top) { wrap.style.left = pos.left; wrap.style.top = pos.top; wrap.style.right = 'auto'; wrap.style.bottom = 'auto'; }
      if (localStorage.getItem('clipoMockNavCollapsed') === '1') wrap.classList.add('mn-collapsed');
    } catch(e){}
  })();

  var caret = wrap.querySelector('.mn-caret'), head = wrap.querySelector('.mn-head');
  function toggleCollapse(){ wrap.classList.toggle('mn-collapsed'); saveNavState(); }
  caret.addEventListener('click', function(e){ e.stopPropagation(); toggleCollapse(); });

  /* 헤더: 드래그(이동) + 클릭(접기) 구분 — 드래그 직후 click은 접기로 치지 않음 */
  var drag = null, moved = false, sx = 0, sy = 0;
  head.addEventListener('mousedown', function(e){
    if (e.target.closest('.mn-caret')) return;
    var r = wrap.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    sx = e.clientX; sy = e.clientY; moved = false;
    wrap.style.right = 'auto'; wrap.style.bottom = 'auto';
    wrap.style.left = r.left + 'px'; wrap.style.top = r.top + 'px';
    document.body.style.userSelect = 'none'; e.preventDefault();
  });
  document.addEventListener('mousemove', function(e){
    if (!drag) return;
    if (Math.abs(e.clientX - sx) > 3 || Math.abs(e.clientY - sy) > 3) moved = true;
    var w = wrap.getBoundingClientRect();
    var l = Math.min(Math.max(8, e.clientX - drag.dx), Math.max(8, window.innerWidth  - w.width  - 8));
    var t = Math.min(Math.max(8, e.clientY - drag.dy), Math.max(8, window.innerHeight - w.height - 8));
    wrap.style.left = l + 'px'; wrap.style.top = t + 'px';
  });
  document.addEventListener('mouseup', function(){
    if (!drag) return;
    drag = null; document.body.style.userSelect = '';
    if (moved) saveNavState(); else toggleCollapse();
  });
})();
