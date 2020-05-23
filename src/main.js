let grade, classs, table, fullsw = JSON.parse(localStorage.getItem('fullsw')) || false
history.scrollRestoration = 'manual'

function isIE() {
  const ua = navigator.userAgent
  const is_ie = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1
  return is_ie 
}

if (isIE()) window.location.replace('/Alert')

$(document).ready(function () {
  // $('[data-toggle="tooltip"]').tooltip()
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
  $('.alert').alert()
  setTimeout(() => {
    window.location.reload()
  }, 60000)
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
