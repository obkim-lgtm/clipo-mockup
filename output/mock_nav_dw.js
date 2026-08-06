/* ===== 목업 내비게이터 (까망이) — 학생 직접 작성 세트 5종 공통 =====
 * 규칙: docs/mockup-navigator.md
 * 삽입 파일: task_direct_write_v1_260729 · focus_log_v1_260728 ·
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
    task:    'focus_log_v1_260728.html',
    scoring: 'scoring_direct_write_v1_260729.html',
    home:    'student_home_v1_260729.html',
    submit:  'student_submit_v1_260729.html'
  };

  /* route → { f:파일키, h:해시(딥링크) } */
  var ROUTES = {
    dwList:      { f:'design',  h:'list' },
    dwDesign:    { f:'design',  h:'design' },
    dwQuestions: { f:'design',  h:'questions' },
    rubOk:       { f:'design',  h:'rubric-ok' },
    rubErr:      { f:'design',  h:'rubric-error' },
    flOn:        { f:'task',    h:'log-on' },
    flOff:       { f:'task',    h:'log-off' },
    scWrite:     { f:'scoring', h:'doc-write' },
    scFile:      { f:'scoring', h:'doc-file' },
    scDeleted:   { f:'scoring', h:'doc-deleted' },
    scResubNo:   { f:'scoring', h:'resub-no' },
    scResubYes:  { f:'scoring', h:'resub-yes' },
    shNew:       { f:'home',    h:'new' },
    shCur:       { f:'home',    h:'current' },
    ssNotice:    { f:'submit',  h:'notice' },
    ssWrite:     { f:'submit',  h:'write' },
    ssDone:      { f:'submit',  h:'done' },
    ssBoth:      { f:'submit',  h:'both' },
    ssFileonly:  { f:'submit',  h:'fileonly' },
    ssPreparing: { f:'submit',  h:'preparing' },
    ssClosed:    { f:'submit',  h:'closed' },
    ssBefore:    { f:'submit',  h:'result-before' },
    ssAfter:     { f:'submit',  h:'result-after' },
    ssPdf:       { f:'submit',  h:'pdf' }
  };

  /* 상세로 들어가면 케이스 목록으로 펼쳐지는 그룹 (진입 항목은 그 화면에서 숨김) */
  var HOME_CASES    = ['shNew','shCur'];
  var SUBMIT_CASES  = ['ssNotice','ssWrite','ssDone','ssBoth','ssFileonly','ssPreparing','ssClosed','ssBefore','ssAfter','ssPdf'];
  var SCORING_CASES = ['scWrite','scFile','scDeleted','scResubNo','scResubYes'];
  var RUBRIC_CASES  = ['dwQuestions','rubOk','rubErr'];   /* 채점기준 AI 데모는 문항 작성 화면에서만 */

  var GROUPS = [
    { t:'교사 · 평가 설계',    items:[['dwList','과제 목록'],['dwDesign','과제 설계'],['dwQuestions','문항 작성']] },
    { t:'채점기준 AI',         showOn:RUBRIC_CASES, items:[['rubOk','성공'],['rubErr','오류']] },
    { t:'교사 · 과제물 관리',  items:[['flOn','기록 켠 과제'],['flOff','기록 끈 과제']] },
    { t:'교사 · 채점 상세',    items:[['scWrite','클리포를 통한 제출'],['scFile','파일 첨부'],['scDeleted','과제물 삭제됨']] },
    { t:'채점 학생 상태',      showOn:SCORING_CASES, items:[['scResubNo','채점 중'],['scResubYes','채점 후 재제출함']] },
    { t:'학생 화면',           items:[['shNew','학생 과제 홈',{hideOnCur:HOME_CASES}],['ssNotice','학생 제출',{hideOnCur:SUBMIT_CASES}]] },
    { t:'학생 과제 홈',        showOn:HOME_CASES,   items:[['shNew','개선안'],['shCur','현재 개발 화면']] },
    { t:'학생 제출 — 주요 플로우', showOn:SUBMIT_CASES, items:[['ssNotice','① 시작 전 안내'],['ssWrite','② 작성'],['ssDone','③ 제출 완료']] },
    { t:'다른 설정으로 낸 과제',   showOn:SUBMIT_CASES, items:[['ssBoth','직접 작성 + 파일 제출'],['ssFileonly','파일 제출만'],['ssPreparing','문항 미작성'],['ssClosed','제출 못 한 채 마감']] },
    { t:'제출 완료 화면 상태',     showOn:SUBMIT_CASES, items:[['ssBefore','결과 공개 전'],['ssAfter','결과 공개 후'],['ssPdf','답안 PDF']] }
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

  var css = '#mockNav{position:fixed;right:24px;bottom:24px;z-index:5000;width:222px;background:#222736;color:#C9CCE0;border-radius:14px;padding:10px;box-shadow:0 12px 34px rgba(0,0,0,.38);font-family:"Pretendard GOV",sans-serif;}'
    + '#mockNav .mn-head{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:move;padding:4px 4px 8px;}'
    + '#mockNav .mn-hl{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;letter-spacing:.06em;color:#8A8FB0;}'
    + '#mockNav .mn-dot{width:10px;height:10px;border-radius:50%;background:#416bff;box-shadow:0 0 0 3px rgba(65,107,255,.25);flex-shrink:0;}'
    + '#mockNav .mn-mini{display:none;}'
    + '#mockNav .mn-caret{background:none;border:none;color:#8A8FB0;cursor:pointer;font-size:12px;padding:2px 4px;line-height:1;transition:transform .15s;}'
    + '#mockNav .mn-body{display:flex;flex-direction:column;gap:4px;max-height:72vh;overflow:auto;}'
    + '#mockNav .mn-group{font-size:10px;font-weight:800;letter-spacing:.08em;color:#6b7192;margin:9px 4px 3px;}'
    + '#mockNav .mn-btn{width:100%;text-align:left;white-space:nowrap;padding:8px 11px;border-radius:9px;border:1px solid #333a52;background:#2A2F44;color:#C9CCE0;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;line-height:1.3;}'
    + '#mockNav .mn-btn:hover{background:#333a55;}'
    + '#mockNav .mn-btn.on{background:#416bff;color:#fff;border-color:#416bff;}'
    + '#mockNav .mn-sub{display:block;font-size:11px;font-weight:600;color:#8A8FB0;margin-top:2px;white-space:normal;line-height:1.35;}'
    + '#mockNav .mn-btn.on .mn-sub{color:#D6E2FF;}'
    + '#mockNav.mn-collapsed{width:auto;}'
    + '#mockNav.mn-collapsed .mn-body{display:none;}'
    + '#mockNav.mn-collapsed .mn-full{display:none;}'
    + '#mockNav.mn-collapsed .mn-mini{display:inline;}'
    + '#mockNav.mn-collapsed .mn-caret{transform:rotate(180deg);}'
    + '#mockpick,#mockjump,#rubDemoToggle{display:none!important;}';   /* 구형 패널·전용 토글은 까망이로 통합 */
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var wrap = document.createElement('div'); wrap.id = 'mockNav';
  wrap.innerHTML =
      '<div class="mn-head"><span class="mn-hl"><span class="mn-dot"></span><span class="mn-full">MOCKUP · 학생 직접 작성</span><span class="mn-mini">목업</span></span>'
    + '<button class="mn-caret" aria-label="접기/펼치기">&#9662;</button></div>'
    + '<div class="mn-body" id="mnBody"></div>';
  document.body.appendChild(wrap);
  var bodyEl = wrap.querySelector('#mnBody');

  function render(){
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
  }

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
      localStorage.setItem('clipoMockNavPos', JSON.stringify({ left: wrap.style.left, top: wrap.style.top }));
      localStorage.setItem('clipoMockNavCollapsed', wrap.classList.contains('mn-collapsed') ? '1' : '0');
    } catch(e){}
  }
  (function restore(){
    try {
      var pos = JSON.parse(localStorage.getItem('clipoMockNavPos') || 'null');
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
