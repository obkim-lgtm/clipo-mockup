# Index — 상황별 방향 지시표

문서 목록이 아니라 라우팅 테이블이다. "어떤 상황이면 → 무엇을 읽는다"를
적는다. 문서만이 아니라 이 프로젝트의 **원천 데이터 소스**(DB 스키마,
데이터셋, API 스펙, 대시보드 등)도 여기서 라우팅한다.

## 라우팅

- 어떤 작업이든 시작 전 → [principles.md](principles.md)
  (SessionStart가 자동 주입하지만, 수동 확인 시 여기)
- 최근 작업 맥락이 필요하면 → [sessions/](sessions/) 최신 2일치
- **새 화면/컴포넌트 그리기 전(고정 요소·토큰·타이포·컴포넌트·개발 화면 기준) → [design-system.md](design-system.md)** (권위 소스 output/*.html 복제·확장, 새로 짜지 말 것)
- **라벨·문구·UI 패턴 만들거나 바꾸기 전(일관성·인라인·변경 영향 범위 grep) → [workflow.md](workflow.md)**
- **목업 내비게이터(까망이)에 화면·케이스 추가하거나 케이스 선택기 만들기 전 → [mockup-navigator.md](mockup-navigator.md)** (전용 패널 금지·진입 항목→케이스 그룹·딥링크·다중 파일 동기화)
- **크레딧·이용권 UI 작업 전(유형·소진순서·유효기간·환불) → (Notion) "CLIPO 크레딧 정책 (26.07.21)" · 화면 기준 output/subscription_manage_v1_260513.html · PRD "C-이용권 관리·AI 크레딧 모달 개편"**
- 다른 PC 인수인계 / 연수 이관 안내(연수는 clipo_training 프로젝트 소유) → [ops.md](ops.md)
- 목업 작업 방식·산출물 구성 요약 → ../CLAUDE.md
- 서비스 배경·컬러 팔레트 상세 → ../context.md
- 서비스가 뭔지/기능 설명이 필요하면 → ../service_overview.md (단일 기준 문서)
- 창의적 체험활동 이어받기 → ../context_creative.md · 정책 스펙 → ../creative_activity_policy_spec.md
- 세특 간편 생성기 이어받기 → ../context_quick_seteuk.md
- 활동지 AI 탭 이어받기 → ../context_question_tab.md
- **학생 과제 홈 개편 이어받기(시안 5 제작·노출 정책·필터 구조) → handoff/HANDOFF_student_home_260811.md** (시안 4종은 output/student_home_v1_260729.html 한 파일 안. 정책 동일·UI만 차이)
- **실시간 모니터링(수업 중 화면) 이어받기 → handoff/HANDOFF_live_monitor_260819.md** (상태 판정·동작 규칙·미결. 디자인은 별도로 새로 잡음)
- OCR·채점 포팅(HIAI 동일 기획) 스펙 → handoff/HANDOFF_hiai_ocr_scoring_port_260625.md
- **평가 설계 — HIAI v9를 CLIPO에 적용하는 기획 → handoff/HANDOFF_eval_design_v9_port_260914.md** (**§3 '새 세션에서 정할 것'이 시작점.** CLIPO 결정 0건. 핵심 차이: `확인 필요` 라벨이 CLIPO에선 이미 AI 채점 실패 뜻 · 점수 지우고 다시 채점하면 크레딧 차감). 옛 handoff/HANDOFF_hiai_eval_design_port_260826.md는 HIAI 시안1·2 전제라 **§2 충돌·§3 치환표만 참고**
- **과제물 인식·AI 채점 이어받기(사후 확인 모델·채점당 1크레딧·인식 무과금) → handoff/HANDOFF_ocr_credit_policy_260826.md** (**최상단 "이어받기" 섹션이 시작점** — 끝난 것/열린 것/함정. 그 아래 이력 섹션은 아카이브라 정책 근거로 쓰지 말 것). PRD는 Notion `C- OCR 확인 후 채` **V1.0(2026.08.28)**
- **과제물 인식·재채점 26-09-03 작업 정리 → handoff/HANDOFF_ocr_260903.md** (고친 것 14커밋·케이스↔학생 15명 표·판단 대기 항목·검수 유의점. 위 260826 핸드오프의 후속 — 케이스별 학생 찾을 땐 이 문서)
- **과제물 인식 Beta 고지·인식 결과 검수 이어받기 → handoff/HANDOFF_ocr_beta_review_260910.md** (**§7 "26-09-10 착수 결과"가 시작점** — 만든 것·가정 8건·올립 확인 대기 항목). 목업 2종 완료: 백오피스 `output/backoffice_ocr_review_v1_260910.html` · 교사 화면 Beta 표기는 중고등 채점 상세 2파일에 얹음. **CLIPO는 비식별화가 없어** 전처리 단이 통째로 빠졌고, `정확도 낮음`·`다시 인식`도 CLIPO엔 없다. PRD(C-)는 목업 확정 후 작성
- **CLIPO Admin(백오피스) 화면 그리기 전 → output/backoffice_ocr_review_v1_260910.html 복제** — CLIPO 백오피스 자산은 이 파일 하나뿐이다. 상단바(`CLIPO Admin` + 햄버거 드로워)·NB 그룹 순서(26-09-10 재정렬안)·신형 목록 관례(칩+드롭다운+검색 필터 카드 / `총 N건` 헤더 / 뱃지 셀 / 행 outline 버튼)가 여기 들어 있다. 구형 목록(`staffs/records`) 패턴을 따라 그리지 말 것
- **활동지로 바로 채점(빠른 시작 · 제안, 2026-09-25) → `output/quick_start_v1_260925.html`** — 진단 덱(`../clipo_problem_definition/`) 해결편용. 흐름·결정의 단일 기록은 `../clipo_problem_definition/context.md` '해결편 목업'. **까망이 없음**(2026-09-25 올립: 요청할 때만) → 해시로 진입: 홈(**홈 리뉴얼 v2 이식**, 09-26 — 홈을 고치면 `home_renewal_v2_260926`과 같이) `#home` · `#home-resume`(임시 채점) · `#home-sample`(예시만) · `#home-waiting`(답안 기다리는 평가) / `#upload` → `#rubric` → `#answers`(스캔 PDF 기본·학생별 파일) → `#result` · `#detail-N` / 예시 `#sample-good|mid|low` → `#bridge` · `#bridge-2` · `#bridge-3` · `#compare`.
- **평가 만들기 통합(제안, 2026-09-25) → `output/eval_design_quick_v1_260925.html`** — 개발 확정 평가 설계(`task_direct_write_v1_260729.html`)를 복제하고 델타 3개만: 채점기준 AI 생성 안내 = 활동지로 초안 · 채점기준 아래 '예시 답안으로 채점해 보기'(새 기능 배지, 결과 = `quick_start_v1_260925.html?from=design#sample-*` 같은 상세 화면, 돌아가기 = 설계로) · 설계 저장 뒤(선생님 직접 업로드) 목록으로 가지 않고 '답안 올리고 채점하기' 패널(`#design-saved`, 학생 직접 제출로 바꾸기 링크). 까망이 없음. **09-26 추가: 새 평가 만들기(`#new`)** — 평가명 → 성취기준(초안이 여기에 맞춰 나옴) → 시작 방법 5가지를 한 줄 타일로(활동지(추천·파란 바탕)·쓰던 채점기준표·평가계획(`#new-plan`)·다른 평가 복사(`#new-copy`)·빈 설계). 타일을 누르면 바로 이동 — 큰 카드·라디오·다음 버튼 없음(09-26 '옵션이 너무 많아 보인다'). 개발의 '평가 만들기' 드롭다운(새로 만들기·복사해서 만들기·평가계획에서 가져오기)을 흡수. 성취기준은 시작 화면에서만 고름 — 평가계획은 계획 것과 합치고(겹치면 하나), 복사는 고른 게 있으면 그걸로·없으면 복사본 그대로. 교내 교사 공유(공개/비공개)는 기본 정보에서 빼 설계 저장 줄로 → 다음. 활동지(`#new-sheet`)·기준표(`#new-rubric`)는 **quick_start `#upload`와 같은 화면 틀**(스텝·활동지 미리보기·문항 고치기/지우기/추가·'더 좋은 초안을 원하면'·하단 버튼 줄)로 올리고 → 설계 화면 채점기준 칸에서 '만드는 중' → 결과가 채워짐. 파일은 고르면 바로 올라가고 활동지는 이어서 문항을 읽음(두 목업 공통 `upStage`). **같은 기능은 두 목업에서 1:1 같은 UI** — 한쪽을 고치면 다른 쪽도.
- **✅ 홈 리뉴얼 v2 = 확정(2026-09-26) → `output/home_renewal_v2_260926.html`** — 구조: `내 할 일`(2열 목록, 놓치면 손해 · 누가 기다리는 것만, 없으면 숨김) → `내 수업` 줄 → 학기 목록(모두 한 줄, 이번 학기만 펼침) → 달라진 것. 수업 카드는 첫 글자 아이콘 · 반 · 학생 수 · 평가 진행 막대(마감 기준)다. 해시 `#home` · `#home-empty` · `#home-resume` · `#home-empty-resume`, 까망이 4케이스(hr2*). 결정 경위는 **handoff/HANDOFF_home_renewal_260925.md §9**, 규칙은 **design-system.md '홈·카드 시각 규칙'**이다. **홈을 고치면 `quick_start_v1_260925.html` `#home`도 같이.**
- 홈 리뉴얼 v1(비교용 · v2로 대체) → `output/home_renewal_v1_260925.html` — 카드 안 할 일 → '이어서 할 일' 3열 타일까지 간 중간본. 작업하지 말 것. 초안 `output/home_renewal_draft_260925.html`도 기록용.
- 그 외 인수인계 문서 → handoff/ (교사의날 이벤트·OCR 채점 260615·초등 채점 v2)
- 내부 검토 문서 → reviews/ (**gitignore 대상 — public repo라 커밋 금지**)
- PRD 작성 → ../prd_guide.md
- 연수 페이지 배포·운영 → ../CLAUDE.md "연수 페이지 운영 가이드" (Netlify, training.clipo.ai)

<!-- ⚠ 실제 라우팅은 이 주석 밖, 위의 목록에 항목으로 추가한다.
     주석 안에 쓰면 뷰어·lint·에이전트 모두에게 보이지 않는다.
형식 참고 (원천 데이터 소스·시크릿 소재도 이렇게):
- DB 스키마 변경 전 → schema/tables.sql
- 매출 데이터 다루기 전 → data/sales/README.md (원천: BigQuery ds_sales)
- 대시보드·통계 작업 전 → data/sales_2026.csv
  (원천 데이터 — 반드시 이 파일만 근거, 값 임의 생성 금지)
- 외부 API 자격증명 → .env 의 FOO_API_KEY (값 편집: sops secrets.yaml)
  ※ 시크릿은 소재·사용법만 — 값은 절대 적지 않는다
-->

## 인덱스 규칙

- docs/ 하위 모든 문서는 이 파일에서 도달 가능해야 한다 (lint가 강제).
- 새 문서·데이터 소스가 생기면 반드시 여기에 라우팅 줄을 추가한다.
  에이전트가 어떤 작업 전에 무엇을 봐야 하는가가 기준이다.
