# 활동지 AI 탭 (question_tab) 목업 — 작업 인수인계

> 새 채팅 시작 시 이 문서를 첨부하면 즉시 컨텍스트 복원 가능
> 마지막 갱신: 2026-06-17

## 0. 빠른 시작 (다른 PC에서)
새 채팅 첫 메시지에:
> "활동지 탭 작업 이어할게. `F:\내 드라이브\Claude\clipo_mockup\context_question_tab.md` 먼저 읽고 컨텍스트 잡아줘. preview_start('clipo-mockup') 도 띄워줘."

## 1. 환경
- **로컬 경로**: `F:\내 드라이브\Claude\clipo_mockup\` (Google Drive 동기화)
- **Repo**: `https://github.com/obkim-lgtm/clipo-mockup` (master 브랜치)
- **GitHub Pages 배포**: `https://obkim-lgtm.github.io/clipo-mockup/output/<파일명>`
- **미리보기**: `preview_start('clipo-mockup')` → `localhost:3457` (URL은 `/output/<파일>` 경로 필요)
- **최근 커밋**: `74d75b8 활동지 탭 업로드·인식·정확도 부스터 개선 + 과제물 관리 빈 양식 제거`

## 2. 작업 대상 파일
| 파일 | 역할 |
|------|------|
| `output/question_tab_v1_260617.html` | **활동지 탭 메인** (목록 + AI 생성 + 업로드/인식 + 부스터) |

연계 변경(이번 세션): 과제물 관리 3개 파일에서 **빈 양식 업로드 버튼·배너 제거** (활동지 탭이 그 역할을 가져감) → `task_ocr_inline_v1.html`, `task_ocr_review_v2_260612.html`, `scoring_diagnosis_v1_260616.html`

## 3. 제품 방향 (확정된 기획)

### 활동지 AI = "변형 엔진" (생성기 아님)
- 중고등은 대부분 활동지를 이미 보유 → **작년 것 일부 변형/교체** 니즈가 신규 생성보다 큼
- 진입 분기: **"활동지 있으세요?"** → 있음=업로드 / 없음=AI로 만들기
- **이미지 생성 제외** (틀릴 수 있음). 자료를 "그대로 가져오는 것"은 OK, 이미지 새로 생성은 안 함. 현재는 **서·논술형 텍스트 문항**만.
- 수준별 변형·재시행은 더 먼 미래

### 활동지 탭 위치·성격
- **수업 탭 밴드**: `수업 홈 / 평가 설계 / 활동지 / 과제물 관리 / 채점 / 세부능력 및 특기사항 지원` (평가 설계와 과제물 관리 사이)
- 대부분 **비순차·선택** 과업. HIAI식 스텝바 쓰지 않음 → 아코디언으로 처리. "할수록 채점 정확" 프레이밍
- 탭의 목적 = **두 목적 결합** (채점 정확도용 업로드 + AI 생성). 별도 탭으로 쪼개지 않음
- **수업과 연계되지 않은 무소속 활동지는 제거** (설계와 연결돼야 학생 제출 가능). "문항 먼저 만들기"는 추후 별도 메뉴로 분리(미구현)
- 설계 복사 ≠ 활동지 동반: **설계 따로 / 활동지 따로** 가져오기

## 4. 화면 구조 (SPA view 전환)

`showView(id)` 로 `.hidden` 토글: `view-list / view-result / view-plan / view-create / view-upload`

| view | 내용 |
|------|------|
| `view-list` | 활동지 목록 (`.qcard`). 배지 2종: `활동지 등록완료`(초록) / `활동지 미등록`(회색) |
| `view-create` | AI 생성 설정 페이지 |
| `view-plan` | 설계 계획 검토 |
| `view-result` | 생성 결과/문항 |
| `view-upload` | **활동지 업로드 & 인식 확인** (이번 세션 작업 집중 영역) |

### 등록 모달 (`#regModal`, 3 옵션 — 문구 통일됨)
| 옵션(타이틀) | 설명 | 동작 |
|---|---|---|
| 이미 있어요 | 가진 활동지를 올려 그대로 등록해요. | `showUpload()` |
| AI로 함께 만들어요 | 성취기준·채점기준을 바탕으로 초안을 만들어요. | `openGen('plan')` |
| 다른 선생님의 활동지를 가져와요 | 동교과 선생님의 활동지를 복사해요. | `openCopyModal()` |

### view-upload 흐름 (이미 있어요)
1. 드롭존 클릭 → `upDoUpload()` → 파일칩 + **OCR 스피너(1.6s)** → 인식 결과 팝업 자동 오픈 + 확정바(미확정)
2. **인식 결과 팝업 `#recogModal`**: 테이블 `#rgTbl`. 대문항(지시문, `.rg-big`=채점 안 함) / 소문항 행. **문항/영역·문항 내용 칸 모두 직접 편집 가능**(입력 필드 상시 표시), `+ 문항 추가`(빈 행 복제), 휴지통 삭제, 내부 스크롤+헤더 고정. 학생 답변 가이드 칸은 읽기 전용.
3. 팝업 닫아도(취소) **확정바가 남아 재오픈 가능**. `문항 확정` → 확정바(블루) + 부스터 노출 + 등록 활성
4. **정확도 부스터(확정 후·선택·비순차)** — `#up-boosters`, 아코디언 2개:
   - **채점요소 연결** (`#rubricList`): 문항별 채점요소 칩. **초기 미선택** → 사용자가 직접 고르거나 **`AI로 자동 연결`(크레딧·스피너)** 눌러야 파란 추천 등장. 칩은 1줄 말줄임(`max-width:185px`)+호버 `title` 툴팁, 점수 표기 없음.
   - **모범답안 입력** (`#answerList`): 문항별 textarea + **그 아래 `수식 입력` 버튼**(검정 outline·무채색). `답안 엑셀 업로드` → `#xlsModal`(확정 문항 채운 양식 다운 → 답변만 업로드). 수식 버튼 → `#fxModal`(기호 12종 + 직접 입력 → `$수식$` 삽입).

## 5. 핵심: 문항 ↔ 부스터 데이터 연결 (가짜 데이터 아님)

부스터(채점요소·모범답안)는 **인식 결과 팝업의 실제 문항에서 동적 렌더**된다.

- `collectQuestions()` — `#rgTbl .rg-row` 중 **대문항(`.rg-big`) 제외**, 소문항만 `{label, content}` 수집
- `scoredCount()` — 위 개수. 확정바·엑셀 양식의 "문항 N개"가 여기에 연동
- `renderBoosters()` = `snapshotBoosters()`(기존 입력/선택 보존) → `collectQuestions()` → `renderRubricList()` + `renderAnswerList()`
- **동기화 시점 = `confirmRecog()` (문항 확정 클릭)**. 팝업에서 추가/삭제/내용수정 후 확정하면 부스터가 그에 맞춰 재생성
  - 추가 문항 → 부스터에 등장 / 삭제 문항 → 사라짐 / 내용 수정 → 부스터 제목 텍스트 반영
  - **입력 보존**: `data-label` 키로 매칭. 문항명 같으면 이미 입력한 모범답안·칩 선택 유지(재확정해도 안 날아감). 문항명 바뀌면 신규 취급
- `RUBRIC_OPTIONS` = 채점요소 후보 4종(짧은 3 + 긴 1=말줄임 데모). AI 추천은 문항 index 기반 1개 `data-ai` → `aiLinkRubrics()`가 점등
- **파일 삭제** = `confirmRemoveFile()` → 경고 팝업 `#delFileModal`("아래 입력한 채점요소·모범답안도 모두 지워져요") → `delFileConfirm()` → `upRemove()`가 부스터 목록 비우고 초기화

### 주요 함수 맵
| 영역 | 함수 |
|------|------|
| 업로드/인식 | `upDoUpload`, `setRecogBar`, `openRecogModal`, `addRecogRow`, `delRecogRow`, `confirmRecog` |
| 데이터 연결 | `collectQuestions`, `scoredCount`, `snapshotBoosters`, `renderRubricList`, `renderAnswerList`, `renderBoosters`, `esc` |
| 채점요소 | `pickBchip`, `aiLinkRubrics` |
| 모범답안/수식 | `openXls`/`closeXls`, `openFx`/`fxIns`/`fxInsertToTarget` |
| 파일 삭제 | `confirmRemoveFile`, `closeDelFileModal`, `delFileConfirm`, `upRemove` |

## 6. 적용된 공통 지침 (유지할 것)
- **콘텐츠/탭밴드 너비 1240px** (CLAUDE.md 표준)
- **페이지 헤더 표준** (타이틀 + btn-primary 생성버튼 + create-menu 드롭다운, CLAUDE.md 표준)
- **버튼 중앙정렬 5종세트** (`inline-flex`/`align-items`/`justify-content`/`line-height:1`/`vertical-align`)
- **가짜 데이터 금지** — 데모 문항은 실제 인식 결과(소문항) 기반
- **카피 톤**: 단어형 버튼, 행동 중심 설명문, 좌측 컬러 액센트 띠 금지, 페이지 설명문에 배너 흡수
- **수식 버튼**: 입력란 아래, 검정 outline(`#3b3f4c`)·무채색 — 눈에 덜 띄게

## 7. 미결/보류 (다음 작업 후보)
- "문항 먼저 만들기(설계 없이 문항→채점기준 역방향)"는 **별도 메뉴로 분리** (미구현)
- 평가 설계 안에서 활동지 추가 진입점 연계 (미구현)
- HIAI "정교한 평가 설계" 통합 검토 (올립이 정리 예정)
- 모범답안 = 전체 재생성만 지원 (특정 부분 재생성 니즈 없음 확인). 모범답안 생성도 크레딧 1개

## 8. 배포
```bash
cd "F:/내 드라이브/Claude/clipo_mockup"
git add -u   # 또는 git add output/<파일>
git commit --author="obkim-lgtm <ob.kim@datadriven.kr>" -m "메시지"
git push origin master
# 1~2분 후 GitHub Pages 반영
```
사용자가 "배포" 한 마디면 즉시 위 명령 실행. (미추적 `.bak`·로컬 도구 파일은 제외하고 `git add -u` 권장)

## 9. 사용자 / 호칭
- 사용자: **올립** (Olivia, 김옥빈, CLIPO PM) — "옥빈" 금지
- 미리보기는 올립이 오른쪽 패널에서 직접 확인 (채팅에 스크린샷·로컬 링크 불필요 — 본인이 보고 있을 때)
