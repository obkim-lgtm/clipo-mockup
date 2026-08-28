# CLIPO 목업 디자인 시스템 · 고정 요소 · 개발 화면 기준

> 화면 골격·컴포넌트·토큰·복제 기준. **새 화면/컴포넌트를 그리기 전 이 문서를 읽는다.**
> 새 CLIPO 목업은 새로 짜지 말고 아래 "개발 화면 기준"의 파일들을 복제·확장한다.

## 디자인 토큰 요약
- **폰트**: `Pretendard GOV` — CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-gov.min.css`
- **Primary**: `#416bff` (blue/500) / 로고 컬러: `#365eef` (blue/600)
- **텍스트**: `#222631` (기본), `#3b3f4c` (보조), `#6d7381` (muted), `#808080` (subtle)
- **Border**: `#d9d9d9` / emphasized: `#b3b3b3`
- **배경**: `#f6f7f9` (subtle), `#f1f3f5` (muted)
- **Error**: `#f2525f` / **Success**: `#1ab864` / **Warning**: `#f97316`
- 상세 팔레트 → `../context.md` 참조

## 타이포그래피 요약
| 용도 | 크기 |
|------|------|
| 섹션 타이틀 | 26px SemiBold |
| 카드/항목 제목 | 20px SemiBold |
| 기본 (대부분) | 16px Regular/Medium |
| 레이블·보조 | 14px Regular/Medium |

> ⚠️ **절대 규칙**: 사용자가 읽고 수정하는 본문 텍스트(AI 근거, AI 피드백, 선생님 피드백 textarea, 채점 기준명 등)는 반드시 **16px** 이상. 14px 이하로 줄이지 않는다.

## 고정 요소

### 파비콘 (모든 목업 파일에 필수)
- 파일: `output/clipo_favicon.png` (CLIPO 캐릭터 이모지형 아이콘 — 2026-05-13 변경. 이전 svg는 헷갈린다는 피드백으로 교체)
- 모든 HTML 목업 파일의 `<head>`에 아래 태그를 반드시 포함한다:
  ```html
  <link rel="icon" type="image/png" href="clipo_favicon.png">
  ```
- 새 목업 파일 생성 시 자동으로 추가할 것
- 이전 `clipo_favicon.svg`는 deploy 디렉토리(training 사이트 헤더 로고용)에서 여전히 참조되므로 삭제하지 말 것

### 헤더 (절대 수정 불가) — 2026-07-09 신규 상단바 (Figma `SmAPRoZEpoVlVz2hPvjErc` node 1-388)
```
[⫘] [CLIPO로고] ─────── [학교 유료] D-180  🤖 200 크레딧  (최하나 (대표교사) ▾)
```
- 높이: **58px**, 배경 white, 하단 border `#dde1e8`
- **CSS**: `padding: 0 20px 0 9px` (왼쪽 여백 9px, 오른쪽 20px)
- 아이콘: Lucide (**`panel-left-open`**, `bot`, `chevron-down`) — 구 `menu`(☰)·`sparkles` 사용 금지
- 메뉴 버튼: `width:40px; height:40px; border-radius:4px; margin-right:9px`, hover `#f6f7f9` — 클릭 시 `toggleNav()` 호출
- 우측(`.g-hd-r`): `gap:16px; font-size:15px; color:#18181b`, **구분선(`.hd-div`) 없음** (제거됨)
  - 플랜 뱃지+D-day는 `.hd-plan`(gap 8px)으로 묶음
  - 플랜 뱃지(`.plan-badge`): h20, `padding:0 6px`, radius 6px, bg `#e9f2ff`, border 1px `#ccdfff`, 12px Medium `#3151c4`
  - D-day: 15px Medium `#18181b`
  - 크레딧(`.credit-wrap`): `bot` 아이콘 20px `#416bff` + **`N 크레딧`** 15px Medium `#18181b` — 구 표기 `AI 크레딧 N` 금지 (숫자 먼저)
  - 사용자: **아웃라인 필 버튼**(`.user-btn`) — h36, `padding:0 12px`, gap 4px, border 1px `#c7cbd3`, radius 9999px, 14px Medium `#27272a` + `chevron-down` 16px
- **높이 58px 연동 오프셋** (헤더 높이 바꾸면 같이 수정): `.icon-sb{top:58px}` · `.main-wrap{padding-top:58px}` · `.tab-band{top:58px}` · `calc(100vh - 58px)` · `--chrome-top:58px`
- **적용 현황(2026-07-09)**: 현행 OCR 세트(`task_ocr_v3`·`scoring_elementary_v3`·`class_scoring_detail_v3`)만 신규 상단바 적용. **나머지 파일은 아직 구 헤더(56px·☰·AI 크레딧 라벨)** — 해당 파일 작업 시 신규 스펙으로 전환할 것

### 왼쪽 네비게이션 바 (절대 수정 불가)
- **접힘**: 56px 고정폭 / **펼침**: 200px (☰ 버튼 토글)
- **CSS 핵심**:
  - `.icon-sb`: `width:56px; transition:width .2s ease` — `overflow:hidden` 사용 금지 (툴팁 클리핑 발생)
  - `.icon-sb.expanded`: `width:200px`
  - `.si` (메뉴 아이템): `height:40px; padding:0 4px 0 16px; gap:10px` — 아이콘이 56px 중앙(28px) 정렬됨
  - `.si-icon`: `width:24px; height:24px; flex-shrink:0`
  - `.si-label`: `opacity:0; transition:opacity .1s` / `.expanded` 시 `opacity:1`
  - `.si-tip` (접힘 툴팁): `position:absolute; left:48px; display:none` / `:hover` 시 `display:block` / `.expanded` 시 `display:none!important`
- **메뉴 항목 (순서 고정)**:
  | 아이콘 | 레이블 | 비고 |
  |--------|--------|------|
  | `home` | 홈 | |
  | `scissors` | 평가계획 | |
  | `layout-grid` | 수업 | |
  | `notebook-pen` | 창의적 체험활동 | **Beta** 뱃지 레이블 옆에 표시 |
  | `zap` | 세특 간편 생성기 | |
  | `smile` | 행동특성 및 종합기록 | |
  | `bar-chart-2` | 리포트 | |
  | `building-2` | 학교 설정 | |
  | *(구분선)* | | `.nav-bottom` 영역 시작 |
  | `file-down` | 매뉴얼 다운로드 | |
  | `credit-card` | 요금제 | |
  | `help-circle` | 고객센터 | |
- 현재 페이지에 해당하는 메뉴: `.si.active` (`background:#e9f2ff; color:#416bff`)
- `body.nav-expanded` 클래스로 콘텐츠 영역 밀기 처리 (각 페이지 레이아웃에 맞게 적용)

### 페이지 헤더 — 타이틀 + 생성 버튼/드롭다운 (표준, 임의 변경 금지)
목록 화면 상단(페이지 타이틀 + 우측 생성 버튼)은 **항상 동일 패턴**. 자꾸 틀어지면 안 됨 — 일관성 최우선.
- **레이아웃**: 좌측 `page-h1`(타이틀, 예 `1학년 국어 문항`) + `page-sub`(설명) / 우측 끝에 생성 버튼. 컨테이너 `display:flex; align-items:flex-start; justify-content:space-between`.
- **생성 버튼**: `class="btn btn-primary"` (기본 40px). **`btn-lg`로 키우지 말 것, chevron 아이콘 붙이지 말 것.** 마크업 = `<i data-lucide="plus">` + 라벨.
- **드롭다운**: 개발 화면의 `create-menu` 클래스 그대로 (`top:46px; right:0; min-width:208px; border-radius:8px; box-shadow:0 0 1px #2226314D,0 8px 24px #00000026; padding:6px`). 항목 = **좌측 정렬 + 16px 아이콘 + 15px 텍스트**, padding `10px 12px`, hover `#f6f7f9`.
- **권위 소스(복제해서 시작)**: `output/task_ocr_v3_260623.html` 의 `수행평가 만들기` 버튼 + `#createMenu`. 새 화면은 새로 짜지 말고 이걸 복사. (구 `task_ocr_inline_v1`은 `_archive_ocr/`로 이동)
- 참고 구현: `output/question_tab_v1_260617.html`(문항 탭).

### 콘텐츠 너비 — 1240px (표준, 절대 일관)
수업 내 모든 화면(탭 밴드 있는 평가 흐름 + 세부 페이지)의 **콘텐츠·탭밴드 너비는 `max-width:1240px`로 통일**한다. 탭 이동 시 좌우 폭·탭 위치가 튀면 안 됨 — 일관성 최우선.
- `.tab-band-inner` 와 콘텐츠 래퍼(`.page-wrap` / `.page-container` 등) 모두 `max-width:1240px; margin:0 auto`.
- **기준 구현**: `output/task_ocr_v3_260623.html` (1240px). 새 세부 페이지도 반드시 1240px로 그린다.

### 푸터는 항상 뷰포트 하단 고정 (콘텐츠 따라오지 않게)
- 콘텐츠가 짧아도 푸터가 화면 중간에 떠 있지 않고 **맨 아래에 붙어야** 한다.
- 구현: 콘텐츠 래퍼를 `flex:1; display:flex; flex-direction:column`(부모 `.main-wrap`은 `min-height:100vh; flex-direction:column`)로 두고, **`.site-footer{ margin-top:auto }`**. `margin-top` 고정값(예 48px) 쓰지 말 것 — 짧은 목록에서 푸터가 따라 올라옴.

### 수업 탭 밴드 (표준, 임의 변경 금지)
수업 내 모든 화면 상단의 탭 밴드(`.tab-band` / `.tab-band-inner` / `.sub-tab`)는 **모든 페이지에서 동일**. 페이지마다 모양·개수·동작이 다르면 탭 이동 시 들썩이고 일관성이 깨진다.
- **6탭 고정 순서**: `수업 홈 / 평가 설계 / 활동지 / 과제물 관리 / 채점 / 세부능력 및 특기사항 지원`
- **활성 탭 = 색(`#416bff`) + 하단 밑줄만.** ⚠️ **`font-weight` 변화 금지**(굵어지면 폭이 커져 옆 탭이 밀림 = 움찔거림. 2026-06-18 전 파일 수정).
  - `.sub-tab{ font-weight:500 }` / `.sub-tab.on{ color:#416bff; border-bottom:2px solid #416bff; }` ← 굵기 동일
- **링크 규약**: 수업 홈→`co_teacher_review_v1`, 평가 설계→`task_ocr_v3_260623.html#design`(=`goDesignList()`), 활동지→`question_tab_v1_260617`, 과제물 관리→`task_ocr_v3_260623.html`(같은 파일 내면 `showScreen('screen-task')`), 채점→`task_ocr_v3_260623.html#scoring`(=`goScoringList()`), 세특→`notReady()` 토스트.
- 수업 홈 파일만 클래스명이 `.class-tabs`/`.ct`로 다르나 스타일·6탭·링크 동일(`.ct.active`도 굵기 변화 금지).

### 수업 워크스페이스 공통 크롬 = 통째로 복제
새 CLIPO 수업 화면은 **상단바(크레딧 영역)+좌측 NB+탭 밴드**를 새로 짜지 말고 권위 소스에서 통째로 복제한다.
- **헤더/상단바(크레딧·D-day·사용자)** → 위 "헤더" 그대로
- **좌측 NB(`.icon-sb`)** → 위 "왼쪽 네비게이션 바" 그대로
- **탭 밴드** → 위 표준
- **권위 소스(복제 시작)**: `output/question_tab_v1_260617.html` 또는 `output/task_ocr_v3_260623.html`

## 아이콘 시스템
- **Lucide Icons** — 피그마 디자인 시스템과 동일 세트
- HTML에서: `<i data-lucide="icon-name"></i>` + `lucide.createIcons()` 호출
- 새로운 아이콘 라이브러리 추가 금지

## 안내 문구 위계 — 박스 vs 보조 문구 (2026-08-28 올립 확정)

**색 박스는 "막는 것·되돌릴 수 없는 것"에만 쓴다.** 그냥 알려주는 말은 보조 문구로 낮춘다.
파란 인포 박스를 안내마다 붙이면 화면이 경고판이 되고, 정작 봐야 할 잠금·경고가 묻힌다.

**세 단이다.** 상시 설명 / 조건부 안내 / 경고·잠금.

| 단 | 성격 | 표현 | 예 |
|---|---|---|---|
| ① 상시 설명 | 늘 그 자리에 있는 필드 설명 | `.sec-desc` 14px `#6d7381`, 아이콘·박스 없음 | `채점기준은 최대 15개까지 입력 가능합니다` |
| ② **조건부 안내** | 조건이 맞을 때만 나타남. 동작 방식을 알려줄 뿐 막지는 않음 | **`.note`** — 박스 없음 + `info` 아이콘 16px `#416bff` + 텍스트 14px `#3b3f4c`, 핵심 어구 `<b>` `#222631` | `둘 다 내면 AI 채점은 파일에 실행돼요` · `가장 마지막에 올린 파일 1개만 AI 채점돼요` · `PDF·이미지 권장` · `제출 방식을 하나 이상 선택해 주세요` |
| ③ 경고·잠금 | 되돌릴 수 없거나 지금 동작을 제한함 | `.alert-info warn` 박스(주황 배경 + 아이콘) | `이미 제출한 학생이 3명 있어요` · 문항 삭제 잠금 |

- **②를 ①로 쓰지 말 것** — 조건부로 뜨는 안내를 회색 보조 문구로 두면 상시 설명과 똑같아 보여 눈이 걸러낸다(2026-08-28 올립이 실제로 지적). 나타났다는 사실이 보여야 한다.
- **②를 ③으로 쓰지 말 것** — 파란 인포 박스를 안내마다 붙이면 화면이 경고판이 되고 정작 봐야 할 잠금·경고가 묻힌다.
- ②와 ③을 가르는 기준 한 줄: **"이걸 못 보고 지나가면 되돌릴 수 없는 일이 생기나?"**
- 파란 인포 박스(`.alert-info` 기본형)는 쓰지 않는다 — ②가 그 자리를 대신한다.
- 좌측 컬러 액센트 띠 금지는 그대로 유지(배경 + 아이콘만). 메모리 `feedback_no_left_accent_bar`.
- 적용 예: `task_direct_write_v1_260729.html` — `way-none`·`way-both`·`multiFileNote`·`attachFmtNote`가 `.note`, `waysLockNote`·`lockNote`만 warn 박스.

## 컴포넌트 참조
피그마 `Components` 페이지 기준 (아이스박스 제외). 목업 작업 시 아래 컴포넌트명 활용:
`Input` · `Radio` · `Radio Card` · `Menu` · `File Upload` · `Switch` · `Pagination` · `Tag` · `Accordion` · `Separator` · `ToggleTip/ToolTip` · `Toast` · `Popover` · `Pin_Input` · `Alert` · `Progress` · `Slider` · `Spinner` · `Contents` · `Button` · `Checkbox` · `Badge` · `Icon Button` · `Close Button` · `Textarea` · `Link` · `Select` · `Steps` · `Combobox` · `Checkbox Card` · `Field` · `Tabs` · `Skeleton` · `Password_Input` · `Number Input`

## 개발 화면 기준 (목업 참고 표준) — 필수

> 아래 파일들은 **실제 개발/디자인 확정된 화면**을 1:1로 옮긴 목업이다.
> 새 CLIPO 목업을 그릴 때는 **새로 짜지 말고 이 파일들을 베이스로 복제·확장**한다.
> (헤더·좌측 NB·탭 밴드·푸터·디자인 토큰·컴포넌트 패턴을 그대로 따른다.)

| 화면 | 파일 |
|------|------|
| 홈 (내 수업) | `output/home_v1_260612.html` |
| 수업 홈 | `output/co_teacher_review_v1_260611.html` |
| 평가 설계 목록 / 과제물 관리 / 채점 (시안3 확정본) | `output/task_ocr_v3_260623.html` (`#design` / 기본 / `#scoring`) |
| 활동지 (수업 탭 — 업로드·인식·정확도 부스터) | `output/question_tab_v1_260617.html` — 상세 인수인계: `../context_question_tab.md` |
| 평가(과제) 설계 상세 | `output/evaluation_design_v4_260615.html` |
| 학급 채점 현황 → 학생 채점 → 결과 공개 | `output/class_scoring_detail_v1_260512.html` |
| 창의적 체험활동 목록 | `output/creative_activity_list_v6_260507.html` |
| 세특 간편 생성기 목록 | `output/quick_seteuk_dev_list_v1_260604.html` |
| 학교 설정 › 선생님 목록 | `output/rep_teacher_succession_v1_260731.html` (`#af3`) — 서브탭(학생/선생님) · 권한 필터(전체/대표교사/일반교사/인증 대기) · 컬럼(권한·이름·아이디(이메일)·최근 활동·인증일·권한 변경·소속 해제) |

- **공통 골격**: 표준 헤더(SVG 로고·학교 유료·D-180·AI 크레딧·사용자) + `icon-sb` NB(홈/평가계획/수업/창의적 체험활동 Beta/세특 간편 생성기/행동특성 및 종합기록/리포트/학교 설정 + 매뉴얼/요금제/고객센터) + 탭 밴드(수업 홈/평가 설계/활동지/과제물 관리/채점/세부능력 및 특기사항 지원) + 푸터.
- **연결 규약**: 로고·홈 아이콘 → `home_v1`, NB 수업 → `co_teacher_review`, 창체 → `creative_activity_list_v6`, 세특 → `quick_seteuk_dev_list`. 탭은 해시 라우팅(`#design`/`#scoring`).
- 신규 화면은 이 세트 중 가장 가까운 파일을 복제해 시작하고, 미구현 메뉴는 `notReady()` 토스트로 처리.
- 이 목록에 없는 신규 개발 화면이 추가되면 표에 한 줄 추가해 갱신한다.
- **과제물 양식(빈 문제지) 업로드는 과제물 관리에서 제외** — 2026-08-26 확정: **설계 쪽에서 푼다.** `task_ocr_v3`의 양식 등록 화면·버튼·프로모 배너를 전부 제거함. 과제물 관리는 제출 관리만 담당.

## 용어·권한 스펙 (문구 작성 시 기준) — 2026-08-09 확정

**권한 명칭은 `대표교사`.** `대표 선생님`은 쓰지 않는다(개발 화면·PRD 표기 기준). 목업 전체 통일 완료.

| 대상 | 가능 범위 |
|------|-----------|
| 전 교사 | 학생 계정 **등록** |
| 대표교사만 | 학생 계정 **삭제**, 다른 교사 **권한 변경** |

⚠️ **"학생 계정을 등록하거나 삭제"는 오기다.** 등록은 누구나 가능하고 삭제만 대표 권한이다.
2026-08-09 이전 목업·PRD 문구 다수가 이렇게 잘못 적혀 있었으니, 권한 안내를 쓸 때마다 이 표로 확인한다.

**소속 관련 라벨** — 교사를 목록에서 제거하는 액션은 `소속 해제`(개발 화면의 `삭제`는 실제 동작과 불일치).
삭제/잔존 항목 구분은 `output/rep_teacher_succession_v1_260731.html#leave1` 참조.

## 모달 제목에 `<br>` 하드코딩 금지 — 2026-08-09

제목에 이름·학교명 같은 **가변 값**이 들어가면 `<br>` 위치가 길이에 따라 어색해진다.
`<br>` 대신 `.mdl-t { word-break: keep-all; }` 로 어절 단위 줄바꿈만 허용한다.
고정 문구 제목은 예외로 `<br>`를 써도 된다.
