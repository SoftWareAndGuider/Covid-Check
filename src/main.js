let grade, classs, table, fullsw = JSON.parse(localStorage.getItem('fullsw')) || false
history.scrollRestoration = 'manual'

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

  $('[data-toggle="tooltip"]').tooltip()
  $('.dataTables_length').addClass('bs-select')
  $('.alert').alert()
  
  let left = 60
  setInterval(() => {
    left--
    document.getElementsByClassName('refresh')[0].innerText = left.toString().padStart(2, '0')
    if (left === 0) window.location.reload()
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

function exportTableToCsv(tableId, filename) {
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
}
