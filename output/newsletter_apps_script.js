/**
 * 클리포 연수 강사 뉴스레터 구독 - Google Apps Script
 *
 * [설정 방법]
 * 1. Google 스프레드시트 새로 만들기
 * 2. 시트 이름을 "구독자" 로 변경
 * 3. A1: "이메일", B1: "구독일시" 입력
 * 4. 확장 프로그램 > Apps Script 클릭
 * 5. 이 코드 전체를 붙여넣기
 * 6. 배포 > 새 배포 > 유형: 웹 앱
 *    - 실행 주체: 본인
 *    - 액세스 권한: 모든 사용자
 * 7. 배포 후 나오는 URL을 복사
 * 8. training_v1_260410.html 에서 APPS_SCRIPT_URL 값을 해당 URL로 교체
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = data.email;

    if (!email || !email.includes('@')) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: '유효하지 않은 이메일입니다.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('구독자');

    // 중복 체크
    var emails = sheet.getRange('A:A').getValues().flat();
    if (emails.includes(email)) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'duplicate', message: '이미 구독 중인 이메일입니다.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 추가
    sheet.appendRow([email, new Date()]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success', message: '구독이 완료되었습니다!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청도 처리 (CORS 우회용)
function doGet(e) {
  return ContentService.createTextOutput('Newsletter API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
