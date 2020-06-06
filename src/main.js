// 전채 화면 여부
let fullsw = JSON.parse(localStorage.getItem('fullsw')) || false
history.scrollRestoration = 'manual' // 스크롤 복구 금지(크롬)

// 관리자 모달 여/부, 새로고침 방지
let admin = false

// F5방지
document.onkeydown = (ev) => {
  if (ev.keyCode == 116) {
    ev.preventDefault()
    window.location.replace('/main')
  }
}

// 이 함수 내부는 보호됨
$(document).ready(function () {
  // URL 알림
  history.pushState('', '', '/주소외부공개금지(개인정보보호)');

  // 60초 마다 새로 고침
  let left = 60
  setInterval(() => {
    if (admin === false) {
      left--
      if (left === 0) window.location.replace('/main')
    } else {
      left = 60
    }

    // 새로고침까지 얼마 남았는지 표시
    document.getElementsByClassName('refresh')[0].innerText = left.toString().padStart(2, '0')
  }, 1000)

  // 이전에 스크롤 한 기록이 있으면 스크롤 했던 곳으로 되돌리기
  document.getElementById('scrollTrack').scroll(0, localStorage.getItem('scroll') || 0)

  // 스크롤 기록 저장
  document.getElementById('scrollTrack').addEventListener('scroll', () => {
    localStorage.setItem('scroll', document.getElementById('scrollTrack').scrollTop)
  })

  // 전체화면 여부 확인
  if (fullsw) {
    // 전체화면
    document.getElementsByClassName('fulltarget')[0].classList.add('fullon')
    document.getElementById('scrollTrack').style.height = '100%'
    document.getElementsByTagName('html')[0].style.overflow = 'hidden'
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  } else {
    // 노말
    document.getElementById('scrollTrack').style.height = ''
    document.getElementsByClassName('fulltarget')[0].classList.remove('fullon')
    document.getElementsByTagName('html')[0].style.overflow = 'auto'
    document.getElementsByTagName('body')[0].style.overflow = 'auto'
  }
})

// 발열 체크
function check (id, ondo) {
  const req = new XMLHttpRequest()
  req.open('PUT', '/api')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({
    id, process: 'check', ondo
  }))
  req.onload = () =>{
    window.location.reload()
  }
}

// 발열 체크 해제
function uncheck (id) {
  const req = new XMLHttpRequest()
  req.open('PUT', '/api')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({
    id, process: 'uncheck'
  }))
  req.onload = () =>{
    window.location.reload()
  }
}

// 전체 화면
function fullscreen () {
  if (fullsw) {
    fullsw = false
    document.getElementById('scrollTrack').style.height = ''
    document.getElementsByClassName('fulltarget')[0].classList.remove('fullon')
    document.getElementsByTagName('html')[0].style.overflow = 'auto'
    document.getElementsByTagName('body')[0].style.overflow = 'auto'
  } else {
    fullsw = true
    document.getElementsByClassName('fulltarget')[0].classList.add('fullon')
    document.getElementById('scrollTrack').style.height = '100%'
    document.getElementsByTagName('html')[0].style.overflow = 'hidden'
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  }
  localStorage.setItem('fullsw', fullsw)
}

// 내보내기
function exportTableToCsv(tableId, filename, cb) {
  if (filename == null || typeof filename == undefined)
      filename = tableId;
  filename += ".csv";

  var BOM = "\uFEFF";

  var table = document.getElementById(tableId);
  var csvString = BOM;
  for (var rowCnt = 0; rowCnt < table.rows.length; rowCnt++) {
      var rowData = table.rows[rowCnt].cells;
      for (var colCnt = 0; colCnt < rowData.length; colCnt++) {
          var columnData = rowData[colCnt].innerHTML;
          if (columnData == null || columnData.length == 0) {
              columnData = "".replace(/"/g, '""');
          }
          else {
              columnData = columnData.toString()
                .replace(/<[^>]+>/g, '')
                .replace('체크 취소', '')
                .replace('체크 하기', '')
                .replace('발열자로 체크하기', '').trim()
                .replace(/"/g, '""'); // escape double quotes
          }
          csvString = csvString + '"' + columnData + '",';
      }
      csvString = csvString.substring(0, csvString.length - 1);
      csvString = csvString + "\r\n";
  }
  csvString = csvString.substring(0, csvString.length - 1);

  // IE 10, 11, Edge Run
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {

      var blob = new Blob([decodeURIComponent(csvString)], {
          type: 'text/csv;charset=utf8'
      });

      window.navigator.msSaveOrOpenBlob(blob, filename);

  } else if (window.Blob && window.URL) {
      // HTML5 Blob
      var blob = new Blob([csvString], { type: 'text/csv;charset=utf8' });
      var csvUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', csvUrl);
      a.setAttribute('download', filename);
      document.body.appendChild(a);

      a.click()
      a.remove();
  } else {
      // Data URI
      var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvString);
      var blob = new Blob([csvString], { type: 'text/csv;charset=utf8' });
      var csvUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', csvData);
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click()
      a.remove();
  }

  cb()
}

// 초기화
function reset () {
  swal.fire({
    title: '잠시만요! 이 버튼은...',
    html: '- 모든 사용자의 발열체크 여부를 전부 초기화시켜요<br />' +
          '- 현재 내용이 읽기 전용으로 바뀌어 기록에 저장되요<br />' +
          '- 기록들은 관리자모드에서 볼 수 있어요<br />' +
          '- 사용자의 나머지 정보들은 작업 후에도 유지되요<br />' +
          '- 작업을 끝나고 나서 다시 되돌릴 수 없어요<br />' +
          '- 발열체크를 다시 처음부터 해야할지도 몰라요!',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '다음',
    cancelButtonText: '취소',
  }).then((willDelete) => {
    if (!willDelete.value) return
    swal.fire({
      icon: "warning",
      title: "정말로 삭제할까요?",
      html: "이 작업은 다시 되돌릴 수 없어요",
      showCancelButton: true,
      confirmButtonText: '초기화',
      cancelButtonText: '취소',
    }).then((t) => {
      if (!t.value) return
      const req = new XMLHttpRequest()
      req.open('PUT', '/api')
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify({
        process: "reset"
      }))
      req.onload = () => {
        window.location.reload()
      }
    })
  });
}

// 사용자 추가
function add () {
  Swal.fire({
    title: '추가할 사용자의 종류를 정해주세요',
    input: 'select',
    inputOptions: {
      student: '학생',
      teacher: '선생님'
    },
    showCancelButton: true,
    confirmButtonText: '다음',
    cancelButtonText: '취소',
  }).then(({ value: res }) => {
    if (res === 'student') addStudent()
    if (res === 'teacher') addTeacher()
  })
}

// 학생 추가
function addStudent () {
  Swal.mixin({
    showCancelButton: true,
    confirmButtonText: '다음',
    cancelButtonText: '취소',
    progressSteps: ['1', '2', '3', '4', '5']
  }).queue([
    {
      title: '추가할 학생의 학년을 입력해주세요',
      input: 'number',
      text: 'ex) 3'
    },
    {
      title: '추가할 학생의 반을 입력해주세요',
      input: 'number',
      text: 'ex) 4'
    },
    {
      title: '추가할 학생의 번호를 입력해주세요',
      input: 'number',
      text: 'ex) 19'
    },
    {
      title: '추가할 학생의 이름을 입력해주세요',
      input: 'text',
      text: 'ex) 임태현'
    },
    {
      title: '추가할 학생의 ID를 입력해주세요',
      input: 'number',
      text: 'ex) 20180335'
    }
  ]).then((result) => {
    if (result.value) {
      Swal.fire({
        title: '입력하신 정보가 맞나요?',
        html: '\
          입력하신 정보: \
          <pre><code>' + result.value.join(', ') + '</code></pre>\
        ',
        confirmButtonText: '네'
      }).then(() => {
        alert(result.value[0] + result.value[1] + result.value[2] + result.value[3] + result.value[4])
      })
    }
  })
}

// 선생님 추가
function addTeacher () {
  Swal.mixin({
    showCancelButton: true,
    confirmButtonText: '다음',
    cancelButtonText: '취소',
    progressSteps: ['1', '2']
  }).queue([
    {
      title: '추가할 선생님의 성함을 입력해주세요',
      input: 'text',
    },
    {
      title: '추가할 선생님의 ID를 입력해주세요',
      input: 'number',
      text: 'ex) 19200999'
    }
  ]).then((result) => {
    if (result.value) {
      Swal.fire({
        title: '입력하신 정보가 맞나요?',
        html: '\
          입력하신 정보: \
          <pre><code>' + result.value.join(', ') + '</code></pre>\
        ',
        confirmButtonText: '네'
      }).then(() => {
        const req = new XMLHttpRequest()
        req.open('PUT', '/api')
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
          id: result.value[1], grade : 0, class: 0, number: result.value[1] - 19200000, name: result.value[0], process: "insert"
        }))
        req.onload = () => {
          window.location.reload()
        }
      })
    }
  })
}
