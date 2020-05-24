let grade, classs, table, fullsw = JSON.parse(localStorage.getItem('fullsw')) || false
history.scrollRestoration = 'manual'

let admin = false

function isIE() {
  const ua = navigator.userAgent
  const is_ie = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1
  return is_ie 
}

if (isIE()) window.location.replace('/Alert')

$(document).ready(function () {
  // table = $('#table').DataTable({
  //   scrollY: '50vh',
  //   paging: false,
  //   order: [[ 1, 'asc' ], [ 0, 'asc' ]],
  //   ajax: '/ajax/data',
  //   colReorder: false,
  //   processing: true,
  //   ordering: false,
  //   info: false,
  //   searching: false,
  //   responsive: true,
  //   rowReorder: {
  //       selector: 'td:nth-child(2)'
  //   },
  //   initComplete: () => {
  //     document.getElementsByClassName('loading')[0].style.display = 'none'
  //     document.getElementsByTagName('html')[0].style.overflow = 'auto'
  //     document.getElementsByTagName('body')[0].style.overflow = 'auto'
  //     document.getElementsByClassName('dataTables_scrollBody')[0].scroll(0, localStorage.getItem('scroll') || 0)
  //   }
  // })

  $('.dataTables_length').addClass('bs-select')
  
  let left = 60
  setInterval(() => {
    if (admin === false) {
      left--
      if (left === 0) window.location.reload()
    } else {
      left = 60
    }
    document.getElementsByClassName('refresh')[0].innerText = left.toString().padStart(2, '0')
  }, 1000)
  
  document.getElementById('scrollTrack').scroll(0, localStorage.getItem('scroll') || 0)
  document.getElementById('scrollTrack').addEventListener('scroll', () => {
    localStorage.setItem('scroll', document.getElementById('scrollTrack').scrollTop)
  })
  if (fullsw) {
    document.getElementsByClassName('fulltarget')[0].classList.add('fullon')
    document.getElementById('scrollTrack').style.height = '100%'
    document.getElementsByTagName('html')[0].style.overflow = 'hidden'
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  } else {
    document.getElementById('scrollTrack').style.height = ''
    document.getElementsByClassName('fulltarget')[0].classList.remove('fullon')
    document.getElementsByTagName('html')[0].style.overflow = 'auto'
    document.getElementsByTagName('body')[0].style.overflow = 'auto'
  }
})

function gradeSelect (n) {
  document.getElementById('gradeSelect').innerText = n + '학년'
  grade = n
}

function classSelect (n) {
  document.getElementById('classSelect').innerText = n + '반'
  classs = n
}

function filter () {
  table.search(grade + '학년 ' + classs + '반').draw()
}

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

function add () {
  Swal.mixin({
    showCancelButton: true,
    confirmButtonText: '다음',
    progressSteps: ['1', '2', '3', '4', '5']
  }).queue([
    {
      title: '추가할 학생의 학년을 입력해주세요',
      input: 'number',
      text: 'ex) 3'
    },
    {
      input: 'number',
      title: '추가할 학생의 반을 입력해주세요',
      text: 'ex) 4'
    },
    {
      title: '추가할 학생의 번호를 입력해주세요',
      input: 'number',
      text: 'ex) 19'
    },
    {
      title: '추가할 학생의 이름 입력해주세요',
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
      const answers = JSON.stringify(result.value)
      console.log(result.value)
      Swal.fire({
        title: '입력하신 정보가 맞나요?',
        html: `
          입력하신 정보:
          <pre><code>${answers}</code></pre>
        `,
        confirmButtonText: '맞아요!!'
      }).then(() => {
        const req = new XMLHttpRequest()
        req.open('PUT', '/api')
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
          id: result.value[4], grade : result.value[1], class: result.value[2], number: result.value[3], name: result.value[4], process: "insert"
        }))
        req.onload = () => {
          window.location.reload()
        }
      })
    }
  })
}

function addStudent () {
  
}

function addTeacher () {

}
