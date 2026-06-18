# 활동지 AI 탭 (question_tab) 목업 — 작업 인수인계

> 새 채팅 시작 시 이 문서를 첨부하면 즉시 컨텍스트 복원 가능
> 마지막 갱신: 2026-06-18

## 0. 빠른 시작 (다른 PC에서)
새 채팅 첫 메시지에:
> "활동지 탭 작업 이어할게. `F:\내 드라이브\Claude\clipo_mockup\context_question_tab.md` 먼저 읽고 컨텍스트 잡아줘. preview_start('clipo-mockup') 도 띄워줘."

## 1. 환경
- **로컬 경로**: `F:\내 드라이브\Claude\clipo_mockup\` (Google Drive 동기화)
- **Repo**: `https://github.com/obkim-lgtm/clipo-mockup` (master 브랜치)
- **GitHub Pages 배포**: `https://obkim-lgtm.github.io/clipo-mockup/output/<파일명>`
- **미리보기**: `preview_start('clipo-mockup')` → `localhost:3457` (URL은 `/output/<파일>` 경로 필요, 캐시 강하니 `?x=<랜덤>` 붙일 것)
- **최근 커밋**: `68a59ef 활동지 탭: 인식 결과 인라인화 + 문항 저장 동기화 + 등록 시 목록 카드 반영`

## 2. 작업 대상 파일
| 파일 | 역할 |
|------|------|
| `output/question_tab_v1_260617.html` | **활동지 탭 메인** (목록 + 등록(업로드/AI/복사) + 문항 인식·부스터) |

연계 변경(이전 세션): 과제물 관리 3개 파일에서 **빈 양식 업로드 버튼·배너 제거** → `task_ocr_inline_v1.html`, `task_ocr_review_v2_260612.html`, `scoring_diagnosis_v1_260616.html`

## 3. 제품 방향 (확정된 기획)

### 활동지 AI = "변형 엔진" (생성기 아님)
- 중고등은 대부분 활동지를 이미 보유 → **작년 것 일부 변형/교체** 니즈가 신규 생성보다 큼
- **이미지 생성 제외**. 자료를 "그대로 가져오는 것"은 OK, 이미지 새로 생성은 안 함. 현재는 **서·논술형 텍스트 문항**만
- 수준별 변형·재시행은 더 먼 미래

### 활동지 탭 위치·성격
- **수업 탭 밴드**: `수업 홈 / 평가 설계 / 활동지 / 과제물 관리 / 채점 / 세부능력 및 특기사항 지원`
- 대부분 **비순차·선택** 과업. "할수록 채점 정확" 프레이밍 (강요 X, 안 해도 AI 채점은 실행됨)
- 탭의 목적 = **두 목적 결합** (채점 정확도용 업로드 + AI 생성)
- 수업과 연계 안 된 무소속 활동지 제거. "문항 먼저 만들기"는 추후 별도 메뉴(미구현)

## 4. 화면 구조 (SPA view 전환)

`showView(id)` 로 `.hidden` 토글: `view-list / view-reg / view-result / view-plan / view-create / view-upload`

| view | 내용 |
|------|------|
| `view-list` | 활동지 목록 (`.qcard`). 배지 **`등록`(초록)/`미등록`(회색)** + 같은 줄 상태칩(채점요소 연결·모범답안 ✓/○) |
| `view-reg` | **활동지 등록 방법 선택 페이지** (팝업 아님, 카드 클릭 → 인라인 패널) |
| `view-create` | AI 생성 설정 페이지 (스텝바: 내용 입력 → 예상 문항 확인 → 활동지 완성) |
| `view-plan` | 예상 문항 확인 |
| `view-result` | AI 활동지 초안(A4) |
| `view-upload` | **문항 인식 결과 + 부스터 + 등록** (업로드 분석 결과 / 등록완료 상세 공용) |

### view-list (목록) 문구 — 역할 분리
- **타이틀**: `1학년 국어 활동지` (범위 앵커, 그대로 유지)
- **sub(부담 제거)**: "등록하지 않아도 AI 채점은 그대로 실행돼요."
- **하늘색 배너 `.list-value`(행동유도)**: "활동지를 등록하면 AI가 학생 답변과 문항을 더 잘 구분해 채점이 정확해져요. 가진 활동지가 없으면 AI로 만들 수도 있어요."

### view-reg (등록 방법 선택) — 카드 3개, 인라인 패널 유지
`showRegSelect(evName)` 진입(미등록 카드 클릭). `selectReg(m)`로 카드 선택 + 해당 인라인 패널 노출. **AI 카드는 맨 오른쪽**(새로 만드는 거라).

| data-m | 카드 제목(평행화 ~기) | 패널(`#regp-*`) 동작 |
|---|---|---|
| `upload` | 가진 활동지 올리기 | **인라인 드롭존** → `rupUpload()`(파일칩+`분석 시작`) → `rupAnalyze()`(스피너→view-upload) |
| `copy` | 다른 선생님 활동지 가져오기 | 검색+표(`.cp-tbl`) → `selectCopyRow` → `복사 생성`(`doCopy`) → view-upload |
| `ai` `Beta` | AI로 함께 만들기 | `AI로 활동지 만들기`(`openGen('plan')`) |

- 패널 설명문(`.reg-pane-desc`) 16px, 전부 해요체 통일
- **두 방법(올리기/가져오기)은 결국 인식완료 화면(view-upload)으로 이동** → 인라인 유지가 맞음(게이팅 X)

### view-upload (문항 인식 결과 한 페이지) — ⭐ 이번 세션 핵심 재구성
**기존 인식 결과 팝업(`#recogModal`) 제거 → 문항 표를 페이지 인라인으로 흡수.** 업로드 분석 결과 / 등록완료 상세가 같은 페이지 공유.

구성(위→아래):
1. **활동지 파일** `#up-file-sec`: 드롭존/파일칩(`#up-chip`)·파일 변경·삭제(`confirmRemoveFile`)
2. **문항 인식 결과** `#up-recog-sec`: 표 `#rgTbl`(대문항 `.rg-big`=채점 안 함 / 소문항). 칸 직접 편집, `+ 문항 추가`, 휴지통 삭제. 액션행: 좌 `문항 추가` / 우 **`문항 저장`**(`saveRecog`)
3. **정확도 부스터** `#up-boosters`(선택·비순차 아코디언 2개):
   - **채점요소 연결** `#rubricList`: 초기 미선택 → 직접 or `AI로 자동 연결·크레딧 1`(`aiLinkRubrics`, 스피너). 칩 1줄 말줄임+툴팁, 점수 없음
   - **모범답안 입력** `#answerList`: 문항별 textarea + 아래 `수식 입력`(검정 outline, `#fxModal`). `답안 엑셀 업로드`(`#xlsModal`)
4. **활동지 등록** `#up-submit`(`upSubmit`)

진입:
- **업로드**: `rupAnalyze()` → view-upload(`_upMode='new'`, 버튼 "활동지 등록")
- **등록완료 카드 클릭**: `openRegistered(source,file,ev,graded)` → view-upload(`_upMode='registered'`, 버튼 "변경 저장"/AI는 "활동지 저장"). graded>0이면 `upSubmit`에서 재채점 경고 `#saveRegModal`

## 5. 핵심 ① 문항 ↔ 부스터 동기화 (수정·저장 모델)

부스터는 **`#rgTbl` 실제 문항에서 동적 렌더**(가짜 데이터 아님).
- `collectQuestions()` — 대문항(`.rg-big`) 제외, 소문항만 `{label,content}`
- `renderBoosters()` = `snapshotBoosters()`(기존 입력 보존) → `collectQuestions()` → `renderRubricList`+`renderAnswerList` → **`clearRecogDirty()`**
- **수정→저장 모델 (이번 세션 신규)**:
  - 표 `oninput="markRecogDirty()"` + `addRecogRow`/`delRecogRow` 끝에 `markRecogDirty()`
  - `markRecogDirty()`: 첫 변경 시 → 안내 `#recogDirty`("문항 저장 누르면 아래 반영") 노출 + **`활동지 등록` 잠금**(submit disabled)
  - `saveRecog()`: `renderBoosters()`로 채점요소·모범답안 재동기화 + 등록 잠금 해제 + 토스트
  - **입력 보존**: `data-label`(문항명) 키 매칭. 문항명 같으면 모범답안·칩 유지, 바뀌면 신규
- 파일 삭제 = `confirmRemoveFile` → `#delFileModal` → `delFileConfirm` → `upRemove`(부스터 비우고 초기화)

## 6. 핵심 ② 등록 완료 → 목록 카드 반영 (이번 세션 신규)

`upSubmit()`에서 `_regPending`(등록 진행중 플래그)면 `finalizeRegistration()` 호출.
- `_regPending` = `showRegSelect`에서 true, `showList`에서 false (기존 카드 열람은 false → "변경 저장"만, 카드 불변)
- 소스 기록: `window._regSource`/`_regFile`/`_regEv`/`_copyTeacher` (selectReg·rupAnalyze·openRegistered·doCopy에서 세팅)
- **`finalizeRegistration()`**: 목록에서 **제목===`_regEv` & 미등록(badge-empty) 카드 찾기**
  - **있으면 → 등록 카드로 전환** (업로드/복사: 평가명이 미등록 카드와 같음)
  - **없으면 → 새 카드 추가** (AI: 평가명이 `비판적 읽기와 주장하는 글쓰기`로 달라서 자동으로 새 카드)
  - 상태칩: `#rubricList .bchip.on` 있으면 채점요소 ✓, `#answerList .bq-ans` 값 있으면 모범답안 ✓
  - 메타: AI=`AI 생성` / copy=`{teacher} 선생님 활동지 복사` / upload=`직접 업로드`
- 카드 빌더: `buildRegCardInner(ev,rubricOn,answerOn,metaSrc)` + `regOpen(ev,source,file)`(onclick 생성)

## 7. 주요 함수 맵
| 영역 | 함수 |
|------|------|
| 뷰/네비 | `showView`, `showList`, `showRegSelect`, `selectReg` |
| 등록(업로드) | `rupUpload`, `rupReset`, `rupAnalyze`, `revealRecog`, `upDoUpload`(레거시 드롭존) |
| 문항 표 | `addRecogRow`, `delRecogRow`, `markRecogDirty`, `clearRecogDirty`, `saveRecog` |
| 부스터 데이터 | `collectQuestions`, `scoredCount`, `snapshotBoosters`, `renderRubricList`, `renderAnswerList`, `renderBoosters` |
| 채점요소/모범답안 | `pickBchip`, `aiLinkRubrics`, `openXls`, `openFx`/`fxIns`/`fxInsertToTarget` |
| 등록 완료/목록 | `upSubmit`, `finalizeRegistration`, `buildRegCardInner`, `regOpen`, `openRegistered` |
| 복사 | `selectCopyRow`, `doCopy`, `prefillRegisteredData` |
| 파일 삭제 | `confirmRemoveFile`, `delFileConfirm`, `upRemove` |
| 레거시(미사용/no-op) | `openRecogModal`/`closeRecogModal`(guard), `confirmRecog`(=revealRecog), `setRecogBar`(no-op), `addCopiedCard`(제거됨), `regModal`(구 등록 팝업) |

## 8. 적용된 공통 지침 (유지)
- 가짜 데이터 금지(데모 문항=실제 인식 소문항 기반), 단어형 버튼, 좌측 컬러 액센트 띠 금지
- 라벨 평행성(같은 위계 어미 통일 — 등록 카드 제목 ~기), 타이포 본문 16px/레이블 14px↑
- 카드 정보량 절제(배지 `등록`/`미등록` + 같은 줄 상태칩), 버튼 중앙정렬 5종세트
- 수식 버튼: 입력란 아래·검정 outline·무채색

## 9. 미결/보류 (다음 작업 후보)
- **`분석 시작` 후 문항 결과 페이지 = view-upload로 통합 완료**. 추가로 **문항 순서 이동(위/아래)** 은 아직 미추가(평가설계·AI계획과 통일하려면 넣기)
- **PRD 미작성** — 담주 목업 피드백 받고 작성 예정
- "문항 먼저 만들기(설계 없이 역방향)" 별도 메뉴 분리(미구현)
- 평가 설계 안에서 활동지 추가 진입점 연계(미구현)
- HIAI "정교한 평가 설계" 통합 검토(올립 정리 예정)

## 10. 배포
```bash
cd "F:/내 드라이브/Claude/clipo_mockup"
git add output/question_tab_v1_260617.html   # ⚠ 특정 파일만! (.bak·미추적 파일 다수 → git add -A/-u 금지)
git commit --author="obkim-lgtm <ob.kim@datadriven.kr>" -m "메시지

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push origin master
# 1~2분 후 GitHub Pages 반영
```

## 11. 사용자 / 호칭
- 사용자: **올립** (Olivia, 김옥빈, CLIPO PM) — "옥빈" 금지
- 미리보기는 올립이 오른쪽 패널에서 직접 확인 (채팅에 스크린샷·로컬 링크 불필요)
