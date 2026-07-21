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
- **크레딧·이용권 UI 작업 전(유형·소진순서·유효기간·환불) → (Notion) "CLIPO 크레딧 정책 (26.07.21)" · 화면 기준 output/subscription_manage_v1_260513.html · PRD "C-이용권 관리·AI 크레딧 모달 개편"**
- 다른 PC 인수인계 / 연수 이관 안내(연수는 clipo_training 프로젝트 소유) → [ops.md](ops.md)
- 목업 작업 방식·산출물 구성 요약 → ../CLAUDE.md
- 서비스 배경·컬러 팔레트 상세 → ../context.md
- 서비스가 뭔지/기능 설명이 필요하면 → ../service_overview.md (단일 기준 문서)
- 창의적 체험활동 이어받기 → ../context_creative.md · 정책 스펙 → ../creative_activity_policy_spec.md
- 세특 간편 생성기 이어받기 → ../context_quick_seteuk.md
- 활동지 AI 탭 이어받기 → ../context_question_tab.md
- OCR·채점 포팅(HIAI 동일 기획) 스펙 → ../HANDOFF_hiai_ocr_scoring_port_260625.md
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
