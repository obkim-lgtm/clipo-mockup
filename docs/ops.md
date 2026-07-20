# CLIPO 목업 — 인수인계 / 연수 이관 안내

## 다른 PC / 다른 사용자 인수인계 (목업 환경)
이 폴더는 Google Drive에 동기화되어 다른 PC에서도 동일하게 작업 가능하다. 새 사용자(예: 샐리)가 이어받을 때:
- **상대경로만 사용** — 절대 경로(`F:\…` / `/Users/…`) 직접 쓰지 말고 `output/`·`screens/` 같은 상대경로.
- **미리보기 포트 3457 고정** (`.claude/launch.json`).
- "인수인계 환경 확인해줘" 요청 시: Google Drive 동기화(`output/` 목록)·미리보기 서버 동작 확인.

## ⚠️ 연수 페이지는 이 프로젝트에서 관리하지 않는다 (이관됨, 2026-07-20)
CLIPO 연수 페이지(training.clipo.ai) 운영·배포는 **별도 프로젝트 `clipo_training`으로 이관**되었다.
- 소스 리포: **`Internal-Tool/clipo-training`** (Gitea) — 담당: 샐리
- 운영·카드 추가/마감·GA·SEO → `clipo_training/docs/operations.md`
- 배포(training.clipo.ai, `obkim-lgtm/clipo`→Netlify)·샐리 협업자 인수인계 → `clipo_training/docs/deploy.md`
- 이 폴더 `output/`에 남은 `training_v1·v2_260410.html`은 구 사본 — **연수 작업은 `clipo_training`에서 한다.**
