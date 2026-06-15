# HANDOFF — CLIPO OCR 확인 후 채점 (2026-06-15)

> 다른 PC(사무실)에서 이어서 작업하기 위한 인수인계. 작업 파일은 Google Drive + GitHub(`obkim-lgtm/clipo-mockup`)에 동기화돼 있음.

## 작업 파일
- **메인:** `output/task_ocr_review_v2_260612.html` (과제물 관리 + 수행평가 채점 통합, 해시 라우팅 `#design`/`#scoring`)
- 배포: https://obkim-lgtm.github.io/clipo-mockup/output/task_ocr_review_v2_260612.html
- PRD(권위 문서): Notion **C-2606-01 OCR 확인 후 채점** (CLIPO) / 참고 HIAI **H-2605-01**

## 정책 핵심 (PRD 반영됨)
- OCR을 채점 전 독립 단계로 분리, 수동 진행(교사가 "지금 OCR 진행")
- OCR 상태 4단계: 미진행/진행 중/확인 필요/완료 + 인식 실패(상세만, 채점 제외) + OCR 불필요(직접입력)
- **CLIPO 신규:** ① 멀티파일 업로드 OK, 채점·OCR은 **가장 먼저 올린 파일 1개**만 ② AI 채점 대상 과제물(PDF·이미지)은 **전부 OCR**, 직접 입력(텍스트 제출)만 제외

## 지금까지 완료 (과제물 관리)
- 과제물 목록: 제출 파일/OCR 상태 컬럼, 미진행/진행중/확인필요/완료/인식실패 태그
- 학급 과제 제출 상세: **미제출 별도 배너**(누가 안 냈는지) + **처리 필요 액션 바**(미진행→지금 OCR 진행 / 확인 필요→해당 학생 상세 이동)
- 멀티파일 모달(첫 파일 채점 대상), 채점 대상 배지는 제거(노이즈)
- OCR 상세: 좌 원본↔우 인식결과, 불확실 하이라이트, **문항 수정(평가 전체 일괄)** + **수식 입력기** + **blur 자동저장 토스트**, 저장버튼/하단 회색 제거
- 채점 실행 모달 1/2(AI 점수 수준), 2/2(미제출·**OCR 미인식** 채점 제외)
- 버그수정: 1-3반(완료 학급) 목록↔상세 일치 (`completedClasses` 데모 플래그)

## 다음 할 일 (채점 화면 — 내일 이어서)
- **2-8 AI 채점 실행 트리거 가드 점검**: ① 진행 중 1명+ → 버튼 비활성 ② 미진행 1명+ → 'OCR 먼저' ③ 확인 필요 → '확인 권장'(진행 가능) ④ 정상·실패만 → 실행. 현재 `openAiRunWithOcrCheck`(확인 필요 경고)·`openOcrFirstModal`(미진행) 존재하나, 학급별 상태 기준 우선순위 전수 점검 필요.
- 채점 결과/재채점 유도 배너(2-6)는 별도 화면(`class_scoring_detail_v1_260512.html`)

## 환경 메모 (다른 PC 주의)
- 미리보기: `preview_start('clipo-mockup')` (포트 3457). **launch.json이 드라이브 문자(`F:`/`G:`) 절대경로라**, 새 PC에서 404 나면 `.claude/launch.json`의 clipo-mockup `--directory` 경로를 그 PC의 드라이브 문자로 고칠 것.
- 배포: `git add output/<파일> && git commit && git push origin master` (remote에 PAT 임베드됨)
