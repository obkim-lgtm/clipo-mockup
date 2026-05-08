# 창의적 체험활동 (창체) 목업 — 이어받기 문서

> 새 채팅 시작 시 이 문서 내용을 같이 첨부하면 즉시 컨텍스트 복원 가능
> 마지막 갱신: 2026-05-08

---

## 현재 작업 목적
교사용 SaaS CLIPO의 **창의적 체험활동 기록 생성** 기능 목업.
교사가 학생 활동 자료(설문/활동지/관찰 키워드)를 등록하고 AI가 누가기록 초안을 만들어주는 워크플로우.

**5월 중순 배포 목표** — 기능 확장보다 **사용자 편의성**과 **혼란 제거** 우선.

**진행 중인 핵심 흐름**: `자율/진로/봉사/동아리 활동 카드` → 통합 입력 페이지 → 3단계 (자료 입력 → 콘텐츠 요소 선택 → 기록 확인)

---

## 배포 환경

- **GitHub**: `obkim-lgtm/clipo-mockup`
- **Pages URL**: https://obkim-lgtm.github.io/clipo-mockup/
- **로컬 작업 경로**: `F:\내 드라이브\Claude\clipo_mockup\` (다른 PC: 동일 Google Drive 경로 — Mac은 `/Volumes/GoogleDrive/내 드라이브/...`)
- **로컬 미리보기**: `preview_start('clipo-mockup')` → 포트 3457
- **배포**: `git push origin master` → GitHub Pages 자동 빌드 (~30~60초)
- **Commit author 고정**: `-c user.name="obkim-lgtm" -c user.email="ob.kim@datadriven.kr"`
- **자동 배포 트리거**: 사용자가 "배포해줘 / 올려줘 / 커밋해줘"라고 하면 추가 확인 없이 즉시 commit + push

---

## 핵심 파일 (`output/`)

| 파일 | 역할 | 상태 |
|------|------|------|
| `creative_activity_list_v6_260507.html` | 활동 목록 (진입점) | ✅ 신규 입력 페이지로 라우팅 + 데모 카드(수학사고력반) seed |
| **`creative_activity_input_v1_260507.html`** | **통합 입력 페이지 (현재 작업 중심)** | ✅ Step 1·2·3 모두 구현, 드로어 + 자동저장 + dirty cascade + 푸시뷰 |
| `dong_register_v4_260507.html` | 동아리 학생 등록 | (외부) |
| `dong_student_manage_v1_260507.html` | 동아리 학생 관리 | (외부) |

**구버전 (참고용, 사용 안 함)**: `creative_activity_detail_v5`, `dong_activity_detail_v3`, `creative_activity_bulk_v5`

---

## 통합 입력 페이지 (`creative_activity_input_v1_260507.html`)

### 진입 URL 규약
```
?type=자율활동|진로활동|동아리활동|봉사활동
&cls=2학년 1반
[&new=1]    # 새 학급 (선택)
[&demo=1]   # 데모 모드: 학생 자료 + Step 2·3 미리 채워짐
```

### 전체 페이지 구조 (3단계 공통)
```
[CLIPO 헤더 56px]
  ← 이전으로
  자율활동 : 2학년 1반                ← pt-title 22px/600
  학생 활동 자료나 특성 키워드를...      ← pt-desc 14px

[스텝 버튼 바]
  [1 학생 자료 입력] ▸ [2 콘텐츠 요소 선택] ▸ [3 기록 확인 및 수정]   [학생 추가]

[Step 1·2·3 패널 (한 번에 하나만 표시)]

[하단 sticky CTA] (Step별로 라벨/액션 다름)

[우측 하단 목업 토글 — 드래그 가능]
```

### Step 1: 학생 자료 입력 (✅ 완료)

- **카드 헤더**: `학생 자료 현황` + 진행률 sub + [+ 자료 등록] (primary)
- **테이블 컬럼**: 학번 / 이름 / 자료 수 / 키워드 / 성적 / 상태 / 관리
  - 모두 **중앙 정렬**, 본문 14px (CLIPO 컨벤션)
  - 학번 5자리 (예: `20101` = 2학년 1반 1번)
  - 자료 수 "N건", 키워드 "처음 2개, 외 N", 성적 상/중/하/—
  - 상태: 충분/부족/없음 (색 dot)
  - 관리: 충분 시 [수정] / 없음·부족 시 [+ 자료]
- **행 전체 클릭** → 학생 상세 **모달** (Step 1 전용)
  - 자료 dropzone + 파일 리스트 (✕ 제거)
  - 키워드 textarea (콤마 구분, 500자, 카운터, auto-resize)
  - 성적 수준 칩 (상/중/하/고려 안함)
  - 가상 항목(설문 응답): 클릭 시 `modal-survey` 띄움 (Step 1은 모달 컨텍스트라 그대로 유지)

### [+ 자료 등록] 모달 (✅ 완료)

3개 시나리오 카드:
1. **학생 설문 응답 (EXCEL)** — 학번·이름이 포함된 설문 결과
2. **활동지·보고서 (PDF)** — PDF 학급 스캔본 / 폴더 학생별
3. **학생 관찰 키워드 (EXCEL)** — 양식 다운로드 후 업로드
카드 클릭 → 토스트 (상세 업로드 페이지는 미구현)

### 학생 추가 모달 (✅ 완료)

- 자율/진로/봉사: 학교 등록 학생 중 미배정 후보 리스트 (전학생 등)
- 동아리: 라벨 "학생 관리"로 변경 → localStorage 등록 수에 따라 `dong_register_v4` / `dong_student_manage_v1`로 이동

### Step 2: 콘텐츠 요소 선택 (✅ 완료)

- **상단 헤더**: 콘텐츠 요소 선택 [AI 추천] + [전체 분석 시작 / 전체 재분석]
- **2단 레이아웃**: 좌측 학생 목록 사이드바(240px) / 우측 메인
- **상태별 카드**: 자료없음 / 키워드만 / 미분석 / 분석 중 / 완료
- **완료 상태**:
  - 종합 추천 근거 카드 (overall_rationale + stats 4종)
  - 추천 항목 (ON 기본) + 추가 후보 (펼침/접힘) + 직접 추가
  - 학생별 [재분석] 버튼
- **하단 CTA**: `분석 완료 N/M명 · 선택된 항목 X개`

**데이터 구조** (실제 API 응답 그대로):
```js
items: [{
  id, category,           // 산출물 기여 / 역할 수행 / 진로 연결 / 학기 성장
  content,
  sources: [{label, kind:'bulk'|'individual'|'keyword'|'auto'}],
  source_origin: 'stage1_recommended' | 'stage1_candidate',
  rationale, competency,  // 지식정보처리 / 창의적사고 / 자기관리
  cross_validated
}]
```

### Step 3: 기록 확인 및 수정 (✅ 완료)

**좌측: 학생 카드 그리드** (모달이 아닌 **드로어**로 진입)
- 카드 클릭 → 우측에서 슬라이드 인 (560px drawer)
- 카드 표시: 이름·학번·상태(생성됨/미생성/dirty 뱃지)·기록 미리보기·요약 메타
- 상단: [전체 생성] [생성된 기록 다운로드(.txt)] (Excel 안 함, 자주 쓰는 기능 아님)
- 검색 + 정렬 (이름/학번/상태)

**드로어 (학생 상세 작업창)**:
- **헤더**: 이름 · 학번 · 활동 + ✕
- **탭 2개**:
  1. `자료·키워드` — 파일 리스트 + 키워드 textarea + 성적 칩
  2. `추천 항목 N/M` — Step 2 결과 표시 + 직접 추가
- **푸시뷰** ✅ — 자료 탭에서 가상 항목(설문) 클릭 시 드로어 본문이 설문 응답 화면으로 **밀려들어옴**. 상단 `← 학생 자료로 돌아가기` 버튼으로 복귀. 탭/배너/푸터 자동 숨김. (모달-위-드로어 안티패턴 제거)
- **dirty 배너** — 자료/키워드/항목 변경 시 황색 알림 + [반영] 버튼
- **하단**: [닫기] / [저장]

**Dirty cascade (3-level)**:
- 레벨: `file` > `kw` > `items` (상위가 하위 무효화)
- 학생별 `_dirtyLevel` 보관, `markDirty(s, level)`로 갱신
- 사용자가 모달/드로어 닫을 때 **이번 세션 내 변경(`_editChanged`)** 이 있고 + AI 기록이 이미 있으면 → "재생성?" 모달 (`modal-dirty-confirm`)
  - [지금 재생성] → length 모달 → AI 재생성
  - [나중에] → `s.dirty=true`로 마킹 (배너로 잔존)
- 단발 한 번 변경 (저장 안 한 채 닫기 직전 상태)에는 dirty 마크 안 표시 — `_editChanged` transient flag로 처리

**자동저장**:
- 키워드/체크/레벨 변경 시 `scheduleAutoSave()` 1.2s debounced
- 헤더에 "저장 중…" / "방금 저장됨" 인디케이터 표시
- 명시적 [저장] 버튼도 유지

**기록 재생성 모달**:
- 분량 옵션 (짧게/보통/길게)
- 성적 수준 표시 (드로어에서 설정한 값)
- 결과는 우측 패널 textarea에 자동 채움

**TXT 다운로드**:
- 전체 학생 → 1개 .txt 파일 (학생별 구분선)
- Excel 안 함 (자주 안 쓰는 기능 → 가벼운 텍스트로)

### 우측 하단 목업 토글 (개발용)

`MOCKUP [자료 1+ 있음] [키워드만]` — 시나리오 즉시 전환
- **드래그 가능** (헤더 그립 영역)
- 페이지 새로고침 없이 STUDENTS swap + refreshAll
- `STUDENTS_FULL`에 원본 보관, `applyScenario(scenario)` 함수로 전환
- `?demo=1`이 있으면 자동으로 `autoPopulateForDemo()` 호출 → Step 2·3 결과까지 미리 채움

---

## 확정된 기획 결정 (누적)

| 항목 | 결정 |
|------|------|
| **3단계 라벨** | 학생 자료 입력 → 콘텐츠 요소 선택 → 기록 확인 및 수정 |
| **용어 통일** | "데이터" 대신 **"자료"** |
| **Step 3 진입** | **드로어** (모달 X) — 옆 학생 비교 가능 |
| **드로어 푸시뷰** | 모달-위-모달 / 모달-위-드로어 금지. 본문이 밀려들어오는 푸시 패턴 (← 뒤로) |
| **분량 입력 위치** | Step 3 생성 시점 |
| **수준 입력 위치** | 학생 상세(드로어/모달) 칩 — Step 1·3 모두 노출 |
| **키워드 입력** | textarea 콤마 구분, 500자, auto-resize |
| **자료 종류 (개별)** | DOCX · JPG · PNG · PDF (HWPX는 다음 지원) |
| **일괄 업로드** | PDF (활동지) · XLSX (설문/관찰 키워드) |
| **분석 트리거** | 일괄 기본 + 학생별 재분석 |
| **추천 vs 후보** | 별도 그룹 (추천 / 추가 후보) |
| **카테고리** | API에 있으면 표시 (산출물 기여 / 역할 수행 / 진로 연결 / 학기 성장) |
| **직접 추가** | AI 카드와 동일 형태 빈 카드 인라인 편집 |
| **학번 형식** | 5자리 (학년+반+번호, 예 20101) |
| **본문 폰트** | 16px. 테이블·라벨 등 informational은 13~14px |
| **자동저장** | 1.2s debounced + 명시적 저장 버튼 둘 다 |
| **Dirty cascade** | file > kw > items, 닫기 직전 변경은 `_editChanged` 임시 플래그 |
| **TXT 다운로드** | Excel 안 함, 1개 .txt에 학생별 구분선 |
| **버튼 라벨** | 단어형 (저장/추가/삭제) — "~하기" 금지 (CLIPO 표준) |
| **CLIPO 표기** | 항상 대문자 CLIPO |

---

## 빈 화면 / 데이터 시나리오

| URL / 액션 | 의미 |
|------|------|
| 기본 (params만) | empty — 학생 명단만, 자료/키워드 없음 — Step 1 첫 진입 |
| `?demo=1` | 자료/키워드/Step 2·3 결과까지 채워진 데모 — 발표/QA용 |
| 우측 하단 토글 | `자료 1+` ↔ `키워드만` 즉시 전환 |
| 목록 페이지 "수학사고력반" 카드 | localStorage seed → 진입 시 demo 데이터 자동 적용 |

---

## 디자인 시스템 토큰

```css
/* Primary */
#416bff (blue/500)  #365eef (blue/600, 로고)

/* 텍스트 */
#222631 (본문)  #3b3f4c (보조)  #6d7381 (muted)  #b3b6bd (subtle)

/* 상태 */
#f2525f / #b91c1c (error/없음)
#f97316 / #c2410c / #b45309 (warning/부족·dirty)
#1ab864 / #15803d (success/충분)
#7c3aed (가상 항목 — 설문 응답 등)

/* 배경 */
#fff (카드)  #f6f7f9 (페이지)  #f9fafb (테이블 헤더)
#eff3ff / #c7d6ff / #f4f8ff (블루 hint)
#fffbeb / #fde68a (dirty 배너 옐로우)

/* 폰트 */
Pretendard GOV
페이지 타이틀: 22~24px / 600
섹션 타이틀: 18~20px / 600
본문 (텍스트 영역): 16px
테이블 본문: 14px (라벨 13px)

/* z-index */
드로어 500 / modal-survey 700 (드로어 위에 떠야 함, Step 1 모달 컨텍스트용)
```

---

## 주요 함수 / 상태 (코드 참조용)

```js
// 학생 상태
STUDENTS = [{
  id, sid, name, files:[], keywords:[], level,
  s2: {status:'idle'|'analyzing'|'done', selectedIds:Set, customs:[]},
  s3: {aiText, editText, generatedAt},
  dirty:bool, _dirtyLevel:'file'|'kw'|'items'|null,
  _editChanged:bool  // 모달/드로어 세션 내 변경 임시 플래그
}]

// 핵심 함수
markDirty(s, level)         // dirty 레벨 갱신
openDrawer(id)              // Step 3 드로어 열기 (subView/curTab 리셋)
showSurveyInDrawer(sid, i)  // 푸시뷰로 설문 응답 표시
backFromSurvey()            // 푸시뷰 → 자료 탭 복귀
cascadeFromDrawer()         // [반영] 클릭 → 단계별 cascade (file→kw 검토 / kw→items 검토 / items→regen)
scheduleAutoSave()          // 1.2s debounced 저장 + 인디케이터
renderStep3()               // Step 3 카드 그리드 렌더
autoPopulateForDemo()       // demo 모드 자동 채움 (Step 2·3 결과까지)
applyScenario(name)         // 목업 토글 시나리오 전환
```

---

## 미구현 / 다음 작업 후보

1. (선택) Step 1 **modal-detail → modal-survey** 흐름도 푸시뷰로 통일 (현재는 모달-위-모달 — 드로어보다 덜 시급)
2. [+ 자료 등록] 카드 클릭 시 풀스크린 상세 업로드 페이지 (지금은 토스트만)
3. AI 생성 후 카드 항목별 직접 편집 (현재는 체크/해제만)
4. Step 1 ↔ 2 자료 변경 시 step 2 영향 안내 강화 (현재 cascade는 step 3 기준)
5. 동아리 활동 별도 워크플로우 분기 검토 (현재는 4가지 활동이 동일 페이지 공유)

---

## Notion / Jakob 댓글 (대응 보류)

기획 명세 페이지에 Jakob 댓글 3건. 답변 초안은 작성했으나 사용자가 직접 노션에 옮길 예정. 새 PC에서 이어할 때 노션에 옮기지 않은 상태일 수 있음 — 사용자에게 확인.

---

## 최근 배포 커밋

| 커밋 | 내용 |
|------|------|
| `5592064` | 창체 입력: 드로어 설문 응답을 푸시 뷰로 전환 (팝업-위-팝업 제거) |
| `eaa9421` | 목업 일괄 업데이트: 창체/동아리/채점/연수/스승의날 + 기획 가이드 |

---

## 작업 환경 빠른 복원 가이드 (다른 PC)

새 PC 또는 새 채팅:
1. 이 문서를 첫 메시지에 붙여넣기 또는 경로 알려주기 (`F:\내 드라이브\Claude\clipo_mockup\context_creative.md` / Mac은 동일 Google Drive 경로)
2. 한마디만: "창체 이어작업" 또는 "input_v1 이어서 작업"
3. Claude가 자동으로:
   - Google Drive 동기화 확인
   - `preview_start('clipo-mockup')` 미리보기 띄우기
   - 최신 `creative_activity_input_v1_260507.html` 상태 확인
4. 작업 시작 → 마치면 "배포해줘" 한마디로 자동 commit + push

**PC 차이 주의**:
- Windows: `F:\내 드라이브\Claude\...` / Mac: `/Volumes/GoogleDrive/내 드라이브/...` 또는 `~/Library/CloudStorage/GoogleDrive-*/내 드라이브/...`
- 항상 `output/` 같은 상대경로로 작업
- 미리보기 포트 `3457` 고정
- GitHub PAT는 origin에 임베드되어 있어 별도 인증 불필요
