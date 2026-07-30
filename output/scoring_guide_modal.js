/* ============================================================
   채점 정확도를 높이는 준비 팁 모달 — CLIPO 공용 컴포넌트
   ------------------------------------------------------------
   여러 화면에서 같은 안내를 띄운다. 화면 간 1:1 동일해야 하는
   공유 컴포넌트라 파일 하나로 관리한다.
   ⚠️ 내용을 고칠 때는 이 파일만 고치면 된다 (각 HTML에 복사하지 말 것).

   사용법:
     <script src="scoring_guide_modal.js"></script>
     ... onclick="openScoringGuide()"

   근거: 레나 QA 정리 "AI 채점이 어려운 경우 (v3.2)"
   HIAI판(hiai_mockup/output/scoring_guide_modal.js)과 같은 기획, 아래만 다름:
     · 디자인 토큰 CLIPO (Primary #416bff, Pretendard GOV)
     · "활동지" → "문제지" (CLIPO에서 활동지는 별도 탭 이름이라 혼동)
     · 크레딧 안내 추가 — CLIPO는 학생 1명당 1개 차감이라 페이지 수와 무관
     · 3번 케이스에 행동 순서 명시 — CLIPO는 예방 안내가 평가 설계(수합 몇 주 전)에만 있어
       "첨삭 전"만으로는 시점이 안 잡힘
   ※ 회전 스캔 케이스 제외 — 자동 회전 보정 자체 개발 탑재 예정
   ============================================================ */
(function () {
  var CSS = [
    '#sg-overlay{display:none;position:fixed;inset:0;background:rgba(34,38,49,.45);z-index:2000;justify-content:center;overflow-y:auto;padding:24px;}',
    '#sg-overlay.sg-open{display:flex;}',
    '.sg-dialog{background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.25);width:880px;max-width:100%;position:relative;margin:auto;font-family:"Pretendard GOV","Pretendard",-apple-system,sans-serif;}',
    '.sg-head{padding:28px 28px 4px;}',
    '.sg-title{font-size:20px;font-weight:600;color:#222631;margin:0;line-height:1.25;}',
    '.sg-sub{font-size:15px;color:#6d7381;margin:8px 0 0;line-height:1.55;}',
    '.sg-x{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:6px;border:none;background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;color:#6d7381;}',
    '.sg-x:hover{background:#f1f3f5;}',
    '.sg-body{padding:18px 28px 0;display:flex;flex-direction:column;gap:14px;}',
    '.sg-foot{padding:14px 28px 20px;display:flex;align-items:center;justify-content:flex-end;gap:10px;}',
    '.sg-ok{height:40px;border-radius:6px;font-weight:600;font-size:16px;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;vertical-align:middle;padding:0 16px;border:none;background:#416bff;color:#fff;}',
    '.sg-ok:hover{background:#365eef;}',
    '.gcase{border:1px solid #dde1e8;border-radius:10px;padding:20px;display:flex;align-items:center;gap:24px;}',
    '.gcase-txt{flex:1;min-width:0;}',
    '.gcase-title{font-size:16px;font-weight:600;color:#222631;margin:0 0 6px;line-height:1.4;}',
    '.gcase-desc{font-size:16px;color:#3b3f4c;line-height:1.65;margin:0;}',
    '.gcase-desc b{font-weight:600;color:#222631;}',
    '.gcase-figs{display:flex;gap:12px;flex-shrink:0;}',
    '.gfig{width:168px;display:flex;flex-direction:column;gap:8px;}',
    '.gfig-frame{height:150px;background:#f1f3f5;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;}',
    '.gfig-frame > svg{width:124px;height:124px;flex-shrink:0;}',
    '.gfig-mark{position:absolute;top:8px;left:8px;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:1;}',
    '.gfig-mark i,.gfig-mark svg{width:15px;height:15px;color:#fff;flex-shrink:0;}',
    '.gfig-mark.bad{background:#f2525f;}',
    '.gfig-mark.good{background:#1ab864;}',
    '.gfig-cap{font-size:14px;font-weight:600;text-align:center;line-height:1.35;}',
    '.gfig-cap.bad{color:#f2525f;}',
    '.gfig-cap.good{color:#1ab864;}',
    '.gcalm{background:#f6f7f9;border-radius:8px;padding:12px 16px;display:flex;align-items:flex-start;gap:8px;}',
    '.gcalm i{width:17px;height:17px;color:#6d7381;flex-shrink:0;margin-top:2px;}',
    '.gcalm p{font-size:14px;color:#3b3f4c;line-height:1.6;margin:0;}'
  ].join('\n');

  var HTML =
    '<div class="sg-dialog">' +
      '<button class="sg-x" onclick="closeScoringGuide()"><i data-lucide="x" style="width:20px;height:20px;"></i></button>' +
      '<div class="sg-head">' +
        '<h3 class="sg-title">채점 정확도를 높이는 준비 팁</h3>' +
        '<p class="sg-sub">문제지를 만들 때와 과제물을 스캔할 때 아래 세 가지를 확인해 주세요.</p>' +
      '</div>' +
      '<div class="sg-body">' +

        '<div class="gcase">' +
          '<div class="gcase-txt">' +
            '<p class="gcase-title">1. 문제지는 위에서 아래로, 한 단으로 구성해 주세요</p>' +
            '<p class="gcase-desc">여러 단으로 빽빽하게 나누면 읽는 순서가 섞이고, 답란이 좁으면 <b>학생 답이 옆 영역을 넘어가 인식이 어려워요.</b> 크레딧은 학생 1명당 1개라 <b>페이지가 늘어도 더 들지 않으니</b> 답란을 넉넉하게 잡아주세요.</p>' +
          '</div>' +
          '<div class="gcase-figs">' +
            '<div class="gfig">' +
              '<div class="gfig-frame">' +
                '<div class="gfig-mark bad"><i data-lucide="x"></i></div>' +
                '<svg width="76" height="76" viewBox="0 0 76 76">' +
                  '<rect x="10" y="8" width="56" height="60" rx="3" fill="white" stroke="#dde1e8"/>' +
                  '<g fill="none" stroke="#b3b3b3" stroke-width="1">' +
                    '<rect x="14" y="14" width="24" height="10"/><rect x="14" y="30" width="24" height="10"/><rect x="14" y="46" width="24" height="10"/>' +
                    '<rect x="42" y="14" width="20" height="10"/><rect x="42" y="30" width="20" height="10"/><rect x="42" y="46" width="20" height="10"/>' +
                  '</g>' +
                  // 답이 답란을 넘어감 (영역 침범)
                  '<g stroke="#3b3f4c" stroke-width="1.5" stroke-linecap="round">' +
                    '<path d="M16 19 q3 -2 6 0"/><path d="M25 18 l4 2"/><path d="M33 19 q3 -2 6 0"/><path d="M42 20 l5 1"/>' +
                    '<path d="M16 35 q3 2 6 0"/><path d="M25 34 l4 2"/>' +
                    '<path d="M44 51 q3 -2 6 0"/><path d="M53 50 l4 2"/><path d="M60 52 l6 1"/>' +
                  '</g>' +
                '</svg>' +
              '</div>' +
              '<span class="gfig-cap bad">여러 단 · 좁은 답란</span>' +
            '</div>' +
            '<div class="gfig">' +
              '<div class="gfig-frame">' +
                '<div class="gfig-mark good"><i data-lucide="check"></i></div>' +
                '<svg width="76" height="76" viewBox="0 0 76 76">' +
                  '<rect x="10" y="8" width="56" height="60" rx="3" fill="white" stroke="#dde1e8"/>' +
                  '<line x1="15" y1="15" x2="50" y2="15" stroke="#6d7381" stroke-width="1.6" stroke-linecap="round"/>' +
                  '<rect x="14" y="20" width="48" height="16" rx="2" fill="none" stroke="#b3b3b3" stroke-width="1"/>' +
                  '<line x1="15" y1="44" x2="46" y2="44" stroke="#6d7381" stroke-width="1.6" stroke-linecap="round"/>' +
                  '<rect x="14" y="49" width="48" height="14" rx="2" fill="none" stroke="#b3b3b3" stroke-width="1"/>' +
                  '<g stroke="#3b3f4c" stroke-width="1.5" stroke-linecap="round">' +
                    '<path d="M18 27 q3 -2 6 0"/><path d="M27 26 l4 3"/><path d="M35 28 q3 -3 6 0"/><path d="M44 27 l4 2"/>' +
                    '<path d="M18 56 q3 -2 6 0"/><path d="M27 55 l4 2"/><path d="M35 56 q3 -2 6 0"/>' +
                  '</g>' +
                '</svg>' +
              '</div>' +
              '<span class="gfig-cap good">한 단 · 넉넉한 답란</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="gcase">' +
          '<div class="gcase-txt">' +
            '<p class="gcase-title">2. 그림·지도 위에 겹쳐 쓴 글씨는 인식이 어려워요</p>' +
            '<p class="gcase-desc">그림 위에 쓴 글씨는 <b>인식 정확도가 낮아질 수 있어요.</b> 글씨는 그림 밖 여백에 쓰도록 안내해 주시고, 이런 과제는 채점 후 <b>[인식 결과]</b>를 꼭 확인해 주세요.</p>' +
          '</div>' +
          '<div class="gcase-figs">' +
            '<div class="gfig">' +
              '<div class="gfig-frame">' +
                '<div class="gfig-mark bad"><i data-lucide="x"></i></div>' +
                '<svg width="76" height="76" viewBox="0 0 76 76">' +
                  '<rect x="10" y="8" width="56" height="60" rx="3" fill="white" stroke="#dde1e8"/>' +
                  '<path d="M20 26 q6 -10 14 -6 q10 -4 16 4 q6 8 -2 16 q-4 10 -14 8 q-10 2 -14 -8 q-6 -6 0 -14 z" fill="#dce6f5" stroke="#b9cbea"/>' +
                  '<g stroke="#3b3f4c" stroke-width="1.6" stroke-linecap="round">' +
                    '<path d="M26 30 q3 -3 6 0"/><path d="M35 29 l4 3"/><path d="M43 31 q3 -3 6 0"/>' +
                    '<path d="M28 42 q4 3 7 0"/><path d="M39 41 l4 3"/><path d="M47 43 q3 -2 5 0"/>' +
                  '</g>' +
                '</svg>' +
              '</div>' +
              '<span class="gfig-cap bad">그림 위에 글씨</span>' +
            '</div>' +
            '<div class="gfig">' +
              '<div class="gfig-frame">' +
                '<div class="gfig-mark good"><i data-lucide="check"></i></div>' +
                '<svg width="76" height="76" viewBox="0 0 76 76">' +
                  '<rect x="10" y="8" width="56" height="60" rx="3" fill="white" stroke="#dde1e8"/>' +
                  '<path d="M16 24 q4 -7 10 -4 q7 -3 11 3 q4 5 -1 11 q-3 7 -10 5 q-7 2 -10 -5 q-4 -4 0 -10 z" fill="#dce6f5" stroke="#b9cbea"/>' +
                  '<line x1="34" y1="30" x2="46" y2="26" stroke="#b3b3b3" stroke-width="1" stroke-dasharray="2 2"/>' +
                  '<g stroke="#3b3f4c" stroke-width="1.6" stroke-linecap="round">' +
                    '<path d="M46 24 q3 -3 6 0"/><path d="M55 23 l4 3"/>' +
                    '<path d="M46 32 q4 3 7 0"/><path d="M56 31 l4 3"/>' +
                    '<path d="M18 52 q3 -3 6 0"/><path d="M27 51 l4 3"/><path d="M35 53 q3 -3 6 0"/><path d="M44 52 l4 3"/><path d="M52 54 q3 -2 5 0"/>' +
                    '<path d="M18 60 q4 3 7 0"/><path d="M29 59 l4 3"/><path d="M37 61 q3 -3 6 0"/>' +
                  '</g>' +
                '</svg>' +
              '</div>' +
              '<span class="gfig-cap good">글씨는 여백에</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="gcase">' +
          '<div class="gcase-txt">' +
            '<p class="gcase-title">3. 과제를 걷은 뒤, 채점 표시를 하기 전에 스캔해 주세요</p>' +
            '<p class="gcase-desc">답안에 빨간펜 첨삭이 남아 있으면 <b>고쳐 쓴 내용을 학생 답으로 읽을 수 있어요.</b> 걷은 과제를 먼저 스캔해 올리고, 채점 표시는 그 뒤에 해주세요.</p>' +
          '</div>' +
          '<div class="gcase-figs">' +
            '<div class="gfig">' +
              '<div class="gfig-frame">' +
                '<div class="gfig-mark bad"><i data-lucide="x"></i></div>' +
                '<svg width="76" height="76" viewBox="0 0 76 76">' +
                  '<rect x="14" y="8" width="48" height="60" rx="3" fill="white" stroke="#dde1e8"/>' +
                  '<g stroke="#6d7381" stroke-width="1.6" stroke-linecap="round">' +
                    '<path d="M20 20 h34"/><path d="M20 30 h28"/><path d="M20 40 h34"/><path d="M20 50 h22"/>' +
                  '</g>' +
                  '<g stroke="#f2525f" stroke-width="1.7" stroke-linecap="round" fill="none">' +
                    '<ellipse cx="42" cy="30" rx="9" ry="5.5"/>' +
                    '<path d="M46 24 q6 -6 10 -3"/>' +
                    '<path d="M22 54 q3 3 5 0 q3 -3 5 0 q3 3 5 0"/>' +
                    '<path d="M50 46 l6 6 M56 46 l-6 6"/>' +
                  '</g>' +
                '</svg>' +
              '</div>' +
              '<span class="gfig-cap bad">첨삭이 남은 답안</span>' +
            '</div>' +
            '<div class="gfig">' +
              '<div class="gfig-frame">' +
                '<div class="gfig-mark good"><i data-lucide="check"></i></div>' +
                '<svg width="76" height="76" viewBox="0 0 76 76">' +
                  '<rect x="14" y="8" width="48" height="60" rx="3" fill="white" stroke="#dde1e8"/>' +
                  '<g stroke="#6d7381" stroke-width="1.6" stroke-linecap="round">' +
                    '<path d="M20 20 h34"/><path d="M20 30 h28"/><path d="M20 40 h34"/><path d="M20 50 h22"/>' +
                  '</g>' +
                '</svg>' +
              '</div>' +
              '<span class="gfig-cap good">첨삭 전 원본</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="gcalm">' +
          '<i data-lucide="info"></i>' +
          '<p>안내와 다르게 준비돼도 업로드와 채점은 그대로 진행돼요. 인식이 어려웠던 부분은 <b>[인식 결과]</b> 화면에서 언제든 확인하고 수정할 수 있어요.</p>' +
        '</div>' +
      '</div>' +
      '<div class="sg-foot">' +
        '<button class="sg-ok" onclick="closeScoringGuide()">확인</button>' +
      '</div>' +
    '</div>';

  function mount() {
    if (document.getElementById('sg-overlay')) return;   // 이미 있으면 중복 생성 안 함
    var style = document.createElement('style');
    style.id = 'sg-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var ov = document.createElement('div');
    ov.id = 'sg-overlay';
    ov.innerHTML = HTML;
    ov.addEventListener('click', function (e) {
      if (e.target === ov) closeScoringGuide();
    });
    document.body.appendChild(ov);
  }

  window.openScoringGuide = function () {
    mount();
    document.getElementById('sg-overlay').classList.add('sg-open');
    if (window.lucide) lucide.createIcons();
  };
  window.closeScoringGuide = function () {
    var ov = document.getElementById('sg-overlay');
    if (ov) ov.classList.remove('sg-open');
  };

  // ESC로 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeScoringGuide();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
