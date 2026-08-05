# 초등 채점 v2 피드백 반영 인수인계

**최종 업데이트**: 2026-06-04
**현재 작업 파일**: `output/scoring_elementary_v2_260511.html` (+ `output/_annotated/` 동일 파일 동기화 필수)
**미리보기 URL**: http://localhost:3457/output/scoring_elementary_v2_260511.html

> 🔁 **HIAI 이식용 참고**: 이 문서의 "카드 헤더 / 점수·도달수준 표시 규칙"(아래 6/4 섹션)은
> HIAI 초등 채점 화면에도 동일하게 적용 예정. 새 HIAI 세션은 이 섹션의 패턴(헤더 chip 순서·
> lv-score pill·요소명 말줄임·점수 분모 유지 정책)을 그대로 가져갈 것.

---

## 📌 작업 컨텍스트

5/18~19에 걸쳐 초등 채점 화면(v2)에 사용자 피드백 6건을 반영. v1(`scoring_elementary_v1_260506.html`)은 더 이상 진입점 없음 — v2가 모든 학생 케이스(채점완료/미제출/채점전/채점실패/이전채점)를 다 처리하도록 통합됨.

---

## ✅ 반영된 피드백 6건

| # | 변경 내용 | 핵심 코드 위치 (v2 파일 내) |
|---|----------|--------------------------|
| 1 | Legacy(이전채점) 학생도 v2 UI 적용. 진입 시 채점요소별 탭 디폴트, 문항별 탭은 empty state | `applyLegacyUI()` 함수 + `STUDENT_LIST`의 `10106`에 `legacy:true` 플래그 |
| 2 | 하단 [학생에게 공개] 버튼 → [미리보기] 버튼 교체. 미리보기 전용 모달(`previewModal`) 추가 — 액션 없이 닫기만 | `.btn-preview-student` + `openPreviewModal()` |
| 3 | 학급 일괄 공개의 `shareModal` 미리보기 영역을 #2와 동일 컴포넌트(`share-preview-lbl`/`share-preview-frame`)로 정렬. 공개 액션은 유지 | `shareModal` 내 `.share-preview` 라벨 문구 통일 |
| 4 | 다시 채점 모달에 `덮어쓰기(기본) / 이어쓰기` 라디오 추가. 덮어쓰기 + dirty 상태일 때만 경고. 최초 실행 학생은 라디오 자체 숨김 | `#rerunModeField` + `selectRerunMode()`, `updateRerunWarning()` |
| 5 | `.editable`(피드백/근거)과 `#teacherFeedback` textarea blur 시 자동저장 토스트. 점수 미선택 시 `"점수 체크 후 저장해 주세요."` 에러 토스트 | `bindEditableHandlers()` 내 focus/blur snapshot + `notifyAutosave()` |
| 6 | `.revert-btn` 라벨 "되돌리기" → "AI 초안으로 되돌리기" (선생님 한마디 `btn-tf-revert`와 통일) | `editableBlock()` 내 버튼 텍스트 |

---

## ✅ 추가 반영 (2026-06-04) — 카드 헤더 / 점수·도달수준 표시 규칙

> 문항별 ↔ 채점요소별 두 탭의 카드 헤더 구조를 **시각적으로 일관**되게 맞춘 작업. HIAI 이식 시 핵심 참고 섹션.

| # | 변경 내용 | 핵심 코드 위치 |
|---|----------|--------------|
| 7 | **채점요소 점수 chip을 헤더 맨 앞(왼쪽)으로 이동** — 문항의 도달수준 chip 위치와 일관. (기존: 점수가 헤더 오른쪽) | `renderElementCards()` — 헤더 span 순서를 `lv-score` → `ec-summary-wrap`로 변경 |
| 8 | **채점요소 요소명 1줄 말줄임 + 잘릴 때만 호버 툴팁** — 문항 카드와 동일 방식 | `renderElementCards()`에서 요소명을 `.ec-summary-wrap`(>`.ec-summary` + `.ec-summary-tip`)로 래핑. CSS 셀렉터에 `#pane-rubric` 추가. `applySummaryTips()`를 양쪽 pane 대상으로 일반화 + `switchTab()`에서 `requestAnimationFrame(applySummaryTips)` 호출 |

### 핵심 규칙 (HIAI 이식 시 그대로 적용)

1. **카드 헤더 표식은 항상 맨 앞(왼쪽)에 둔다.**
   - 문항 카드: `[도달 수준 라벨]` chip (목표 도달/부분 도달/미도달, 솔리드 색상 = 성취도 색)
   - 채점요소 카드: `[AI 예상 8 / 10점]` 점수 chip (성취도 색 미적용)
   - 두 탭을 오갈 때 "결과 표식" 위치가 동일해 시선 동선이 통일됨.

2. **점수는 분모(만점) 유지** — `8 / 10점` 형태. 분자만(`8점`) 표시하면 **왜곡**됨.
   - 이유: 채점요소별 만점이 제각각(10·20·20…)이라 분자만으론 비교 불가.
     예) `8/10`(80%)이 `20/20`(100%)보다 나빠 보이지 않아야 하는데 "8점 vs 20점"이면 왜곡.
   - "AI 예상" prefix도 유지 — 과제물 AI 점수가 *제안 상태*임을 알리는 신호(PRD상 빗금/제안).

3. **성취도(도달 수준) 색은 문항 단위·교사 화면 전용.** 채점요소 점수 chip은 성취도 색을 쓰지 않고 중립 처리.
   - `lv-score` pill 스타일: `background:#fff; color:var(--ac-text); border:1px solid #dfe3ea; min-width:88px`
     → 흰 배경 + 중립 테두리 pill. 성취도 색 없이도 "표식"으로 읽히고, min-width로 요소명 시작점 정렬.
   - 주의: 미선택(AI 예상) 상태는 prefix 때문에 chip 폭이 가변(106~113px) → 요소명 시작점이 ~7px 드리프트.
     교사가 점수를 선택한 작업 상태에선 prefix가 사라져 완벽 정렬됨. 현재는 이 정도 드리프트 허용(안 A).

4. **요소명/문항요약 1줄 말줄임 패턴** (공통):
   - 마크업: `<span class="ec-summary-wrap"><span class="ec-summary">{텍스트}</span><span class="ec-summary-tip">{텍스트}</span></span>`
   - CSS: `#pane-instruction .ec-summary-wrap>.ec-summary,#pane-rubric .ec-summary-wrap>.ec-summary{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`
   - JS: `applySummaryTips()`가 `scrollWidth > clientWidth`일 때만 `.has-tip` 부여(=잘릴 때만 툴팁). 렌더·탭전환·resize·폰트로드 시 재계산.
   - 긴 문항 예시(말줄임 기준): 문항별 탭 `1-2`번.

---

## 🧪 학생 케이스별 데모 URL

| 학생 | 상태 | URL 쿼리 |
|------|------|---------|
| 김피드백 (10101) | AI 채점 완료 + AI 초안 자동 채움 | `?id=10101&name=김피드백` |
| 김채점 (10102) | AI 채점 완료 | `?id=10102&name=김채점` |
| 미제출 (10103) | 미제출 — viewer empty + AI 카드 empty | `?id=10103&name=미제출` |
| 채점전 (10104) | AI 채점 전 — 슬라이더에 "이전" 단어 제거 | `?id=10104&name=채점전` |
| 채점실패 (10105) | AI 채점 실패 — error empty state | `?id=10105&name=채점실패` |
| 이전채점 (10106) | **Legacy** — 채점요소별 디폴트, 문항별 empty | `?id=10106&name=이전채점` |
| 김현재 (10107) | 확인 필요 (일반 케이스) | `?id=10107&name=김현재` |

---

## 🔧 다른 PC에서 이어 작업할 때

1. **미리보기 서버 시작**: `preview_start('clipo-mockup')` — 포트 3457 (root `.claude/launch.json`에서 python http.server로 설정됨, 5/18에 옛 Adobe node.exe 경로 잔재를 정리함)
2. **편집 시 v2 파일 단일 위치**: `output/scoring_elementary_v2_260511.html` (1700+ 라인 단일 HTML, 모든 케이스/모달 포함)
3. **v1 파일은 건드리지 말 것**: 더 이상 진입점 없지만 과거 참고용으로 보존
4. **학생 화면 미리보기 iframe 대상**: `output/result_student_view_v3_260512.html` — 개별/일괄 공개·PDF 모달이 동일 파일 공유

---

## 🚧 후속 작업 후보 (사용자 미요청)

- v1 파일(`scoring_elementary_v1_260506.html`)을 archive 폴더로 이동 또는 삭제 — 현재 dead reference
- 학급 채점 상세(`class_scoring_detail_v1_260512.html`)에서 일괄 공개 진입 시 새 미리보기 컴포넌트 일관성 점검
- blur 자동저장 토스트가 빈번할 수 있어 debounce(예: 1초) 고려 — 현재는 매 blur마다 즉시 발생

---

## 📁 관련 파일

- 작업 파일: `output/scoring_elementary_v2_260511.html`
- 공통 학생 화면: `output/result_student_view_v3_260512.html`
- 학급 채점 상세 (백 진입점): `output/class_scoring_detail_v1_260512.html`
- 폴더 가이드: `clipo_mockup/CLAUDE.md`
