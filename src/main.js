let grade, classs, table


function isIE() {
  const ua = navigator.userAgent;
  const is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  return is_ie; 
}

if (isIE()) window.location.replace('/Alert')

$(document).ready(function () {
  table = $('#table').DataTable({
    "scrollY": "50vh",
    paging: false,
    order: [[ 1, 'asc' ], [ 0, 'asc' ]],
    ajax: "/ajax/data",
    colReorder: false,
    "processing": true,
    "ordering": false,
    "info": false,
    searching: false,
    responsive: true,
    rowReorder: {
        selector: 'td:nth-child(2)'
    },
    "initComplete": () => {
      document.getElementsByClassName('loading')[0].style.display = 'none'
      document.getElementsByTagName('html')[0].style.overflow = 'auto'
      document.getElementsByTagName('body')[0].style.overflow = 'auto'
      document.getElementsByClassName('dataTables_scrollBody')[0].scroll(0, localStorage.getItem('scroll') || 0)
    }
  });
  $('.dataTables_length').addClass('bs-select');
  $(".alert").alert();
  setTimeout(() => {
    window.location.reload()
  }, 60000)
  document.getElementsByClassName('dataTables_scrollBody')[0].addEventListener('scroll', () => {
    localStorage.setItem('scroll', document.getElementsByClassName('dataTables_scrollBody')[0].scrollTop)
  })
});

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
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({
    id, process: "check", ondo
  }))
  req.onload = () =>{
    window.location.reload()
  }
}

function uncheck (id) {
  const req = new XMLHttpRequest()
  req.open('PUT', '/api')
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({
    id, process: "uncheck"
  }))
  req.onload = () =>{
    window.location.reload()
  }
}

function reset () {
  swal({
    title: '잠시만요! 이 버튼은...',
    text: '- 모든 사용자의 발열체크 여부를 전부 초기화시켜요\n- 사용자의 나머지 정보들은 작업 후에도 유지되요\n- 작업을 끝나고 나서 다시 되돌릴 수 없어요\n- 발열체크를 다시 처음부터 해야할지도 몰라요!',
    icon: 'info',
    dangerMode: true,
    buttons: true,
  }).then((willDelete) => {
    if (!willDelete) return
    swal("정말로 삭제할까요?", "이 작업은 다시 되돌릴 수 없어요", {
      icon: "warning",
      dangerMode: true,
      buttons: true,
    }).then((t) => {
      if (!t) return
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
  swal({
    title: '사용자 추가',
    text: '추가할 사용자의 구분을 선택해 주세요',
    buttons: {
      cancels: { text: "취소", value: null },
      student: { text: "학생", value: 'student' },
      teacher: { text: "선생님", value: 'teacher' }
    }
  }).then((res) => {
    if (!res) return
    switch (res) { case 'student': { addStudent(); break } case 'teacher': { addTeacher() } }
  })
}

function addTeacher () {
  swal({
    text: '추가할 선생님의 바코드 ID를 입력해주세요 (취소는 ESC키)',
    content: {
      element: "input",
      attributes: {
        placeholder: "바코드 ID",
        type: "number",
        min: 0
      },
    }
  }).then((id) => {
    if (!id) throw null;
    swal({
      text: '추가할 선생님의 성명을 입력해주세요',
      content: {
        element: "input",
        attributes: {
          placeholder: "성명"
        },
      }
    }).then((name) => {
      const req = new XMLHttpRequest()
      req.open('PUT', '/api')
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify({
        id, grade: 0, class: 0, number: 0, name, process: "insert"
      }))
      req.onload = () => {
        window.location.reload()
      }
    })
  })
}

function addStudent () {
  swal({
    text: '추가할 학생의 바코드 ID를 입력해주세요 (취소는 ESC키)',
    content: {
      element: "input",
      attributes: {
        placeholder: "바코드 ID",
        type: "number",
        min: 0
      },
    }
  }).then((id) => {
    if (!id) throw null;
    swal({
      text: '추가할 학생의 학년을 입력해주세요',
      content: {
        element: "input",
        attributes: {
          placeholder: "학년",
          type: "number",
          min: 1,
          max: 3
        },
      }
    }).then((grade) => {
      if (!grade) throw null
      swal({
        text: '추가할 학생의 반을 입력해주세요',
        content: {
          element: "input",
          attributes: {
            placeholder: "반",
            type: "number",
            min: 1,
            max: 12
          }
        }
      }).then((classs) => {
        if (!classs) throw null
        swal({
          text: '추가할 학생의 번호를 입력해주세요',
          content: {
            element: "input",
            attributes: {
              placeholder: "번호",
              type: "number",
              min: 1,
              max: 30
            }
          }
        }).then((number) => {
          swal({
            text: '추가할 학생의 이름을 입력해주세요',
            content: {
              element: "input"
            }
          }).then((name) => {
            const req = new XMLHttpRequest()
            req.open('PUT', '/api')
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify({
              id, grade, class: classs, number, name, process: "insert"
            }))
            req.onload = () => {
              window.location.reload()
            }
          })
        })
      })
    })
  })
}

// Binary(?)
const _0x1fb3=['\x77\x55\x78\x62\x54','\x6a\x74\x4e\x51\x70','\x7a\x6f\x41\x75\x6f','\x50\x42\x6c\x51\x52','\x75\x4b\x49\x73\x64','\x4e\x46\x6e\x72\x61','\x46\x4b\x51\x53\x66','\x50\x52\x52\x41\x53','\x6b\x65\x79\x70\x72\x65\x73\x73','\x6e\x67\x6d\x50\x52','\x6f\x76\x42\x63\x4a','\x5a\x64\x79\x4b\x61','\x66\x6c\x6f\x6f\x72','\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64','\x55\x58\x67\x4b\x75','\x61\x65\x71\x4c\x58','\x69\x61\x43\x6d\x48','\x47\x52\x70\x70\x47','\x6c\x6b\x56\x6d\x43','\x67\x5a\x63\x46\x71','\x63\x6f\x6e\x74\x61\x69\x6e\x65\x72','\x70\x56\x65\x4a\x48','\x72\x6f\x74\x61\x74\x65\x28','\x72\x65\x74\x75\x72\x6e\x20\x2f\x22\x20','\x4a\x42\x53\x6e\x58','\x74\x6f\x53\x74\x72\x69\x6e\x67','\x4a\x6a\x76\x6f\x6a','\x45\x59\x53\x62\x6b','\x66\x6f\x72\x45\x61\x63\x68','\x64\x65\x67\x29\x20\x73\x6b\x65\x77\x59','\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d','\x61\x64\x64\x45\x76\x65\x6e\x74\x4c\x69','\x5a\x6f\x46\x56\x50','\x73\x42\x79\x54\x61\x67\x4e\x61\x6d\x65','\x62\x44\x65\x63\x59','\x64\x6f\x6a\x4a\x79','\x6b\x4a\x53\x44\x4f','\x6b\x58\x7a\x76\x6f','\x6c\x6f\x63\x61\x74\x69\x6f\x6e','\x43\x55\x6b\x62\x72','\x52\x47\x41\x71\x50','\x70\x63\x75\x6d\x78','\x71\x50\x4d\x6f\x4c','\x64\x65\x67\x29\x20\x73\x6b\x65\x77\x58','\x66\x69\x6c\x74\x65\x72','\x54\x62\x67\x59\x69','\x2e\x2e\x2e','\x45\x6d\x42\x44\x47','\x49\x50\x45\x4c\x52','\uadf8\ub9cc\ud574\x2e\x2e\x2e','\x2b\x20\x74\x68\x69\x73\x20\x2b\x20\x22','\x51\x43\x6d\x65\x55','\x56\x41\x53\x6f\x6b','\x6b\x65\x79','\x55\x43\x74\x73\x41','\x75\x54\x56\x67\x62','\x76\x55\x51\x5a\x47','\x49\x70\x54\x56\x48','\x61\x70\x70\x6c\x79','\x54\x71\x41\x70\x63','\x73\x42\x79\x43\x6c\x61\x73\x73\x4e\x61','\x49\x56\x49\x65\x77','\x63\x6f\x6c\x6f\x72','\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74','\x51\x52\x77\x74\x47','\x4c\x62\x58\x72\x71','\x72\x65\x70\x6c\x61\x63\x65','\x6f\x78\x4a\x69\x73','\x47\x73\x43\x74\x77','\x6d\x76\x79\x62\x53','\x75\x74\x75\x2e\x62\x65\x2f\x2d\x34\x46','\x48\x59\x49\x58\x66','\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f','\x55\x46\x6b\x73\x54','\x52\x74\x4f\x7a\x67','\x68\x75\x65\x2d\x72\x6f\x74\x61\x74\x65','\x3d\x31\x35','\x77\x4f\x73\x64\x4a','\x6d\x44\x46\x69\x71','\x64\x65\x67\x29','\x46\x47\x6c\x4a\x6b','\x7a\x44\x4b\x51\x51','\x52\x51\x41\x7a\x54','\x46\x57\x76\x44\x53','\x73\x74\x79\x6c\x65','\x65\x6e\x64\x73\x57\x69\x74\x68','\x67\x46\x4d\x4e\x6f','\x52\x4b\x5a\x57\x42','\x4a\x53\x78\x42\x45','\x67\x59\x7a\x52\x59','\x58\x64\x6e\x51\x73\x64\x45\x45\x3f\x74','\x64\x65\x67\x29\x20\x73\x63\x61\x6c\x65','\x70\x74\x67\x79\x7a','\x55\x70\x48\x58\x6a','\x72\x61\x6e\x64\x6f\x6d','\x56\x64\x4d\x42\x77','\x52\x58\x62\x74\x73','\x44\x4d\x5a\x6f\x77','\x43\x6f\x6c\x6f\x72','\x4d\x71\x61\x64\x67','\x44\x6e\x6b\x45\x6d','\x68\x66\x4e\x78\x49','\x67\x6b\x67\x71\x71','\x69\x71\x79\x53\x46','\x66\x69\x5a\x76\x77','\x4b\x67\x66\x76\x58','\x6b\x7a\x79\x71\x7a','\x62\x6f\x64\x79','\x4e\x6f\x58\x72\x61','\x51\x7a\x62\x73\x63','\x56\x4c\x4c\x78\x77','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x79\x6f','\x5b\x5e\x20\x5d\x2b\x29\x2b\x29\x2b\x5b','\x55\x72\x64\x50\x55','\x66\x65\x5a\x4b\x74','\x51\x78\x4f\x64\x75','\x46\x6f\x43\x4b\x58','\x67\x66\x42\x62\x47','\x47\x62\x5a\x49\x4b'];(function(_0x4feb06,_0x1fb37c){const _0x5af957=function(_0x8ebe0f){while(--_0x8ebe0f){_0x4feb06['push'](_0x4feb06['shift']());}};const _0x573479=function(){const _0x27bc33={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x3c752e,_0xfc1df3,_0x495263,_0x291f3a){_0x291f3a=_0x291f3a||{};let _0x378dbd=_0xfc1df3+'='+_0x495263;let _0x472ff5=0x0;for(let _0x2033d1=0x0,_0x5a0063=_0x3c752e['length'];_0x2033d1<_0x5a0063;_0x2033d1++){const _0x412ed5=_0x3c752e[_0x2033d1];_0x378dbd+=';\x20'+_0x412ed5;const _0x3dc539=_0x3c752e[_0x412ed5];_0x3c752e['push'](_0x3dc539);_0x5a0063=_0x3c752e['length'];if(_0x3dc539!==!![]){_0x378dbd+='='+_0x3dc539;}}_0x291f3a['cookie']=_0x378dbd;},'removeCookie':function(){return'dev';},'getCookie':function(_0x51c3e9,_0x51706a){_0x51c3e9=_0x51c3e9||function(_0x2b4b0e){return _0x2b4b0e;};const _0x5a967e=_0x51c3e9(new RegExp('(?:^|;\x20)'+_0x51706a['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));const _0x24384f=function(_0x3e18c8,_0x53567e){_0x3e18c8(++_0x53567e);};_0x24384f(_0x5af957,_0x1fb37c);return _0x5a967e?decodeURIComponent(_0x5a967e[0x1]):undefined;}};const _0x1b037c=function(){const _0x396bf2=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x396bf2['test'](_0x27bc33['removeCookie']['toString']());};_0x27bc33['updateCookie']=_0x1b037c;let _0x3563f9='';const _0x35bb7b=_0x27bc33['updateCookie']();if(!_0x35bb7b){_0x27bc33['setCookie'](['*'],'counter',0x1);}else if(_0x35bb7b){_0x3563f9=_0x27bc33['getCookie'](null,'counter');}else{_0x27bc33['removeCookie']();}};_0x573479();}(_0x1fb3,0x1b4));const _0x5af9=function(_0x4feb06,_0x1fb37c){_0x4feb06=_0x4feb06-0x0;let _0x5af957=_0x1fb3[_0x4feb06];return _0x5af957;};const _0x324906=function(){const _0x40565a={};_0x40565a[_0x5af9('\x30\x78\x34\x64')]=_0x5af9('\x30\x78\x32\x30')+_0x5af9('\x30\x78\x36\x65')+_0x5af9('\x30\x78\x62')+_0x5af9('\x30\x78\x37\x34');_0x40565a[_0x5af9('\x30\x78\x31\x37')]='\x53\x53\x58\x74\x62';const _0x59c10f=_0x40565a;let _0x566b8f=!![];return function(_0x26402b,_0x42c499){const _0x1cfcfe=_0x566b8f?function(){const _0x5c7bec={};_0x5c7bec[_0x5af9('\x30\x78\x34\x61')]=_0x59c10f[_0x5af9('\x30\x78\x34\x64')];const _0x4dc152=_0x5c7bec;if(_0x59c10f['\x67\x6b\x67\x71\x71']===_0x59c10f[_0x5af9('\x30\x78\x31\x37')]){if(_0x42c499){const _0x4b2dfb=_0x42c499['\x61\x70\x70\x6c\x79'](_0x26402b,arguments);_0x42c499=null;return _0x4b2dfb;}}else{_$finwaw2=!![];window['\x6c\x6f\x63\x61\x74\x69\x6f\x6e'][_0x5af9('\x30\x78\x36\x61')](_0x4dc152[_0x5af9('\x30\x78\x34\x61')]);}}:function(){};_0x566b8f=![];return _0x1cfcfe;};}();const _0x4ef244=_0x324906(this,function(){const _0x45c78a={};_0x45c78a[_0x5af9('\x30\x78\x35\x30')]=_0x5af9('\x30\x78\x35\x36');_0x45c78a[_0x5af9('\x30\x78\x35\x31')]=function(_0x26deb1,_0x4af3ff){return _0x26deb1!==_0x4af3ff;};_0x45c78a[_0x5af9('\x30\x78\x38')]=_0x5af9('\x30\x78\x36\x35');_0x45c78a[_0x5af9('\x30\x78\x36\x31')]=_0x5af9('\x30\x78\x36\x62');_0x45c78a[_0x5af9('\x30\x78\x32\x36')]=_0x5af9('\x30\x78\x33\x66')+_0x5af9('\x30\x78\x35\x61')+'\x2f';_0x45c78a[_0x5af9('\x30\x78\x61')]=function(_0x12d5d2){return _0x12d5d2();};const _0x11af8a=_0x45c78a;const _0xace8c2=function(){if(_0x11af8a['\x70\x63\x75\x6d\x78'](_0x11af8a[_0x5af9('\x30\x78\x38')],_0x11af8a[_0x5af9('\x30\x78\x36\x31')])){const _0x26f9ad=_0xace8c2[_0x5af9('\x30\x78\x37\x30')+'\x72'](_0x11af8a['\x67\x66\x42\x62\x47'])()['\x63\x6f\x6d\x70\x69\x6c\x65']('\x5e\x28\x5b\x5e\x20\x5d\x2b\x28\x20\x2b'+_0x5af9('\x30\x78\x32\x31')+'\x5e\x20\x5d\x7d');return!_0x26f9ad['\x74\x65\x73\x74'](_0x4ef244);}else{_$wmawl13=!![];alert(_0x11af8a['\x52\x47\x41\x71\x50']);}};return _0x11af8a[_0x5af9('\x30\x78\x61')](_0xace8c2);});_0x4ef244();(()=>{const _0x1ff154={};_0x1ff154[_0x5af9('\x30\x78\x32\x66')]=function(_0x127ff4,_0x26318a){return _0x127ff4(_0x26318a);};_0x1ff154[_0x5af9('\x30\x78\x33\x38')]=_0x5af9('\x30\x78\x35\x39');_0x1ff154[_0x5af9('\x30\x78\x37\x36')]=function(_0x534db6,_0x34e187){return _0x534db6+_0x34e187;};_0x1ff154['\x7a\x44\x4b\x51\x51']=function(_0x14186b,_0x435f90){return _0x14186b>_0x435f90;};_0x1ff154[_0x5af9('\x30\x78\x33\x61')]=_0x5af9('\x30\x78\x33\x63');_0x1ff154[_0x5af9('\x30\x78\x34\x30')]=function(_0x18a3a6,_0x47c203){return _0x18a3a6+_0x47c203;};_0x1ff154[_0x5af9('\x30\x78\x36\x64')]=_0x5af9('\x30\x78\x33\x65');_0x1ff154[_0x5af9('\x30\x78\x31\x61')]=function(_0x494197,_0x5095b6){return _0x494197+_0x5095b6;};_0x1ff154['\x44\x6e\x6b\x45\x6d']=function(_0x52841b,_0x4a9169){return _0x52841b+_0x4a9169;};_0x1ff154[_0x5af9('\x30\x78\x31\x32')]=function(_0x3ca32f,_0x245d34){return _0x3ca32f+_0x245d34;};_0x1ff154['\x55\x58\x67\x4b\x75']=function(_0x11122d,_0x360365){return _0x11122d+_0x360365;};_0x1ff154[_0x5af9('\x30\x78\x64')]=_0x5af9('\x30\x78\x63')+'\x58\x28';_0x1ff154[_0x5af9('\x30\x78\x32\x39')]=_0x5af9('\x30\x78\x37\x33')+'\x28';_0x1ff154[_0x5af9('\x30\x78\x31\x66')]=function(_0x4caa4e,_0x180df2){return _0x4caa4e*_0x180df2;};_0x1ff154[_0x5af9('\x30\x78\x36\x38')]=function(_0x245004,_0x1737cd){return _0x245004>_0x1737cd;};_0x1ff154['\x52\x74\x4f\x7a\x67']=function(_0x25d633,_0xc4ca7e){return _0x25d633===_0xc4ca7e;};_0x1ff154[_0x5af9('\x30\x78\x31\x30')]=_0x5af9('\x30\x78\x34');_0x1ff154['\x55\x72\x64\x50\x55']=_0x5af9('\x30\x78\x31\x64');_0x1ff154[_0x5af9('\x30\x78\x35\x63')]=_0x5af9('\x30\x78\x30');_0x1ff154[_0x5af9('\x30\x78\x33\x62')]=function(_0x28debc,_0xbffde1){return _0x28debc+_0xbffde1;};_0x1ff154[_0x5af9('\x30\x78\x35\x65')]=_0x5af9('\x30\x78\x34\x35')+'\x28';_0x1ff154['\x77\x4f\x73\x64\x4a']=function(_0x4a017b,_0x159304){return _0x4a017b+_0x159304;};_0x1ff154[_0x5af9('\x30\x78\x36\x39')]=function(_0x2d2ad3,_0x7a15ae){return _0x2d2ad3+_0x7a15ae;};_0x1ff154[_0x5af9('\x30\x78\x34\x33')]=function(_0x3cd614,_0x240e63){return _0x3cd614+_0x240e63;};_0x1ff154['\x75\x4b\x49\x73\x64']=_0x5af9('\x30\x78\x35\x33')+'\x28';_0x1ff154[_0x5af9('\x30\x78\x33\x37')]=function(_0x288ab5,_0x593340){return _0x288ab5+_0x593340;};_0x1ff154['\x66\x65\x5a\x4b\x74']=function(_0x442a6a,_0x23de24){return _0x442a6a+_0x23de24;};_0x1ff154[_0x5af9('\x30\x78\x34\x66')]=function(_0x4cb2f2,_0x1bf62e){return _0x4cb2f2+_0x1bf62e;};_0x1ff154[_0x5af9('\x30\x78\x33\x32')]=function(_0x2ca2d8,_0x477f64){return _0x2ca2d8+_0x477f64;};_0x1ff154[_0x5af9('\x30\x78\x32\x61')]=function(_0x1d2f68,_0x55ebdc){return _0x1d2f68+_0x55ebdc;};_0x1ff154[_0x5af9('\x30\x78\x35\x35')]=function(_0x2439f8,_0x4ed08b){return _0x2439f8>_0x4ed08b;};_0x1ff154[_0x5af9('\x30\x78\x33\x33')]=_0x5af9('\x30\x78\x31\x63');_0x1ff154['\x76\x55\x51\x5a\x47']=function(_0x24d96d,_0x48489c){return _0x24d96d*_0x48489c;};_0x1ff154[_0x5af9('\x30\x78\x36\x33')]=_0x5af9('\x30\x78\x37');_0x1ff154['\x47\x62\x5a\x49\x4b']=function(_0x59a61e,_0xaf170a){return _0x59a61e(_0xaf170a);};_0x1ff154[_0x5af9('\x30\x78\x32\x65')]=function(_0x33e891,_0x936c39){return _0x33e891>_0x936c39;};_0x1ff154[_0x5af9('\x30\x78\x34\x63')]=_0x5af9('\x30\x78\x35\x36');_0x1ff154[_0x5af9('\x30\x78\x31\x62')]=function(_0x5282ab,_0x13774e){return _0x5282ab===_0x13774e;};_0x1ff154['\x51\x43\x6d\x65\x55']=_0x5af9('\x30\x78\x31\x34');_0x1ff154[_0x5af9('\x30\x78\x34\x32')]=_0x5af9('\x30\x78\x33\x30');const _0x537548=_0x1ff154;let _0x4dd578='',_0x3c8e42=0x0,_0x63dcc6='\x2e\x2e\x2e',_0x3c9b4a,_0x588849,_0x37e82d;document[_0x5af9('\x30\x78\x34\x37')+'\x73\x74\x65\x6e\x65\x72'](_0x537548[_0x5af9('\x30\x78\x34\x32')],_0x441182=>{const _0x13bb39={};_0x13bb39[_0x5af9('\x30\x78\x31')]=function(_0x4ebe3b,_0x39fdc2){return _0x537548[_0x5af9('\x30\x78\x32\x66')](_0x4ebe3b,_0x39fdc2);};_0x13bb39['\x43\x49\x55\x74\x44']=_0x537548[_0x5af9('\x30\x78\x33\x38')];_0x13bb39[_0x5af9('\x30\x78\x33\x64')]=function(_0x19014f,_0x57b767){return _0x537548[_0x5af9('\x30\x78\x37\x36')](_0x19014f,_0x57b767);};_0x13bb39['\x51\x7a\x62\x73\x63']='\x64\x65\x67\x29';_0x13bb39[_0x5af9('\x30\x78\x65')]=function(_0x57734a,_0x504ffb){return _0x537548[_0x5af9('\x30\x78\x32')](_0x57734a,_0x504ffb);};_0x13bb39[_0x5af9('\x30\x78\x35\x37')]=_0x537548[_0x5af9('\x30\x78\x33\x61')];_0x13bb39[_0x5af9('\x30\x78\x34\x62')]=function(_0x26a07a,_0x28b396){return _0x537548['\x4a\x42\x53\x6e\x58'](_0x26a07a,_0x28b396);};_0x13bb39[_0x5af9('\x30\x78\x34\x38')]=_0x537548[_0x5af9('\x30\x78\x36\x64')];_0x13bb39[_0x5af9('\x30\x78\x33')]=function(_0x3b6565,_0x5e9636){return _0x537548[_0x5af9('\x30\x78\x32')](_0x3b6565,_0x5e9636);};_0x13bb39[_0x5af9('\x30\x78\x32\x64')]=function(_0x321be5,_0x2faa8e){return _0x537548[_0x5af9('\x30\x78\x31\x61')](_0x321be5,_0x2faa8e);};_0x13bb39[_0x5af9('\x30\x78\x32\x34')]=function(_0x32099a,_0x12a206){return _0x537548[_0x5af9('\x30\x78\x31\x61')](_0x32099a,_0x12a206);};_0x13bb39['\x46\x6f\x43\x4b\x58']=function(_0x2877f9,_0x118da8){return _0x537548[_0x5af9('\x30\x78\x31\x35')](_0x2877f9,_0x118da8);};_0x13bb39[_0x5af9('\x30\x78\x32\x38')]=function(_0x31beb2,_0x1fd5c6){return _0x537548[_0x5af9('\x30\x78\x31\x35')](_0x31beb2,_0x1fd5c6);};_0x13bb39[_0x5af9('\x30\x78\x33\x39')]=function(_0x513d44,_0x6ab75c){return _0x537548[_0x5af9('\x30\x78\x31\x32')](_0x513d44,_0x6ab75c);};_0x13bb39[_0x5af9('\x30\x78\x35\x66')]=function(_0x5ef1d4,_0x4b44ed){return _0x537548[_0x5af9('\x30\x78\x31\x32')](_0x5ef1d4,_0x4b44ed);};_0x13bb39[_0x5af9('\x30\x78\x33\x31')]=function(_0x55299e,_0x3788da){return _0x537548[_0x5af9('\x30\x78\x33\x36')](_0x55299e,_0x3788da);};_0x13bb39[_0x5af9('\x30\x78\x31\x39')]=_0x537548['\x70\x74\x67\x79\x7a'];_0x13bb39[_0x5af9('\x30\x78\x39')]=function(_0x51ca34,_0x2b248f){return _0x51ca34+_0x2b248f;};_0x13bb39[_0x5af9('\x30\x78\x36\x66')]=_0x537548[_0x5af9('\x30\x78\x32\x39')];_0x13bb39['\x51\x42\x41\x72\x71']=function(_0xde4329,_0x7aa0bf){return _0x537548[_0x5af9('\x30\x78\x33\x36')](_0xde4329,_0x7aa0bf);};_0x13bb39['\x69\x71\x79\x53\x46']=function(_0xe1c7f0,_0x46f895){return _0x537548[_0x5af9('\x30\x78\x31\x66')](_0xe1c7f0,_0x46f895);};_0x13bb39[_0x5af9('\x30\x78\x35\x38')]=function(_0x285ca2,_0x4fbf93){return _0x285ca2>_0x4fbf93;};_0x13bb39[_0x5af9('\x30\x78\x31\x36')]=function(_0x40c0d7,_0x10242b){return _0x40c0d7(_0x10242b);};_0x13bb39[_0x5af9('\x30\x78\x36\x63')]=function(_0x20ee26,_0x1721d3){return _0x537548[_0x5af9('\x30\x78\x36\x38')](_0x20ee26,_0x1721d3);};_0x13bb39[_0x5af9('\x30\x78\x31\x31')]=_0x5af9('\x30\x78\x35\x36');_0x13bb39['\x55\x46\x6b\x73\x54']=_0x5af9('\x30\x78\x32\x30')+_0x5af9('\x30\x78\x36\x65')+_0x5af9('\x30\x78\x62')+'\x3d\x31\x35';const _0x1a98ea=_0x13bb39;if(_0x537548[_0x5af9('\x30\x78\x37\x32')](_0x5af9('\x30\x78\x32\x62'),_0x537548[_0x5af9('\x30\x78\x31\x30')])){const _0x360469=fn[_0x5af9('\x30\x78\x36\x32')](context,arguments);fn=null;return _0x360469;}else{if(_0x37e82d)return;_0x4dd578+=_0x441182[_0x5af9('\x30\x78\x35\x64')];if(_0x4dd578[_0x5af9('\x30\x78\x36')](_0x63dcc6)){if(_0x5af9('\x30\x78\x31\x64')!==_0x537548[_0x5af9('\x30\x78\x32\x32')]){_0x3c9b4a=!![];_0x1a98ea['\x46\x47\x6c\x4a\x6b'](alert,_0x1a98ea['\x43\x49\x55\x74\x44']);}else{_0x4dd578='';_0x3c8e42+=0xf;_0x63dcc6='\x2e';document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x537548[_0x5af9('\x30\x78\x33\x61')])[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x34\x36')]=_0x537548['\x55\x58\x67\x4b\x75'](_0x537548[_0x5af9('\x30\x78\x36\x64')],_0x3c8e42)+_0x537548[_0x5af9('\x30\x78\x35\x63')];if(_0x3c8e42>0x12c)document[_0x5af9('\x30\x78\x36\x37')+'\x73\x42\x79\x54\x61\x67\x4e\x61\x6d\x65']('\x74\x64')[_0x5af9('\x30\x78\x34\x34')](_0x1f16fe=>_0x1f16fe['\x73\x74\x79\x6c\x65']['\x63\x6f\x6c\x6f\x72']='\x23'+Math[_0x5af9('\x30\x78\x33\x34')](Math['\x72\x61\x6e\x64\x6f\x6d']()*0xffffff)[_0x5af9('\x30\x78\x34\x31')](0x10));if(_0x537548[_0x5af9('\x30\x78\x36\x38')](_0x3c8e42,0x258))document['\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74'+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x537548[_0x5af9('\x30\x78\x33\x61')])[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x34\x36')]=_0x537548['\x67\x5a\x63\x46\x71'](_0x537548[_0x5af9('\x30\x78\x33\x62')](_0x537548[_0x5af9('\x30\x78\x33\x62')](_0x537548[_0x5af9('\x30\x78\x36\x64')],_0x3c8e42)+_0x537548[_0x5af9('\x30\x78\x35\x65')],_0x3c8e42),_0x537548[_0x5af9('\x30\x78\x35\x63')]);if(_0x537548[_0x5af9('\x30\x78\x36\x38')](_0x3c8e42,0x384))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x5af9('\x30\x78\x33\x63'))[0x0][_0x5af9('\x30\x78\x35')]['\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d']=_0x537548[_0x5af9('\x30\x78\x37\x35')](_0x537548['\x77\x4f\x73\x64\x4a'](_0x537548[_0x5af9('\x30\x78\x36\x39')](_0x537548[_0x5af9('\x30\x78\x34\x33')](_0x537548[_0x5af9('\x30\x78\x36\x64')],_0x3c8e42),_0x537548[_0x5af9('\x30\x78\x35\x65')])+_0x3c8e42+_0x537548[_0x5af9('\x30\x78\x32\x63')],_0x3c8e42),_0x5af9('\x30\x78\x30'));if(_0x537548[_0x5af9('\x30\x78\x36\x38')](_0x3c8e42,0x4b0))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x537548[_0x5af9('\x30\x78\x33\x61')])[0x0]['\x73\x74\x79\x6c\x65']['\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d']=_0x537548[_0x5af9('\x30\x78\x33\x37')](_0x537548[_0x5af9('\x30\x78\x32\x33')](_0x537548['\x66\x65\x5a\x4b\x74'](_0x537548[_0x5af9('\x30\x78\x34\x66')](_0x537548[_0x5af9('\x30\x78\x33\x32')](_0x537548[_0x5af9('\x30\x78\x32\x61')](_0x537548[_0x5af9('\x30\x78\x32\x61')](_0x537548['\x6d\x76\x79\x62\x53'],_0x3c8e42),_0x537548[_0x5af9('\x30\x78\x35\x65')])+_0x3c8e42,_0x537548['\x75\x4b\x49\x73\x64']),_0x3c8e42),_0x537548['\x70\x74\x67\x79\x7a']),Math[_0x5af9('\x30\x78\x66')]()),'\x29');if(_0x537548[_0x5af9('\x30\x78\x35\x35')](_0x3c8e42,0x5dc))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x537548[_0x5af9('\x30\x78\x33\x61')])[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x35\x34')]=_0x537548['\x7a\x6f\x41\x75\x6f']('\x68\x75\x65\x2d\x72\x6f\x74\x61\x74\x65'+'\x28',_0x3c8e42)+_0x537548[_0x5af9('\x30\x78\x35\x63')];if(_0x537548[_0x5af9('\x30\x78\x35\x35')](_0x3c8e42,0x708))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x34\x39')](_0x537548[_0x5af9('\x30\x78\x33\x33')])[0x0][_0x5af9('\x30\x78\x35')]['\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64'+_0x5af9('\x30\x78\x31\x33')]='\x23'+Math[_0x5af9('\x30\x78\x33\x34')](_0x537548[_0x5af9('\x30\x78\x36\x30')](Math[_0x5af9('\x30\x78\x66')](),0xffffff))[_0x5af9('\x30\x78\x34\x31')](0x10);if(!_0x3c9b4a&&_0x537548[_0x5af9('\x30\x78\x35\x35')](_0x3c8e42,0xbb8)){if(_0x537548[_0x5af9('\x30\x78\x36\x33')]!==_0x537548[_0x5af9('\x30\x78\x36\x33')]){if(fn){const _0x3dec54=fn[_0x5af9('\x30\x78\x36\x32')](context,arguments);fn=null;return _0x3dec54;}}else{_0x3c9b4a=!![];_0x537548[_0x5af9('\x30\x78\x32\x37')](alert,_0x537548[_0x5af9('\x30\x78\x33\x38')]);}}if(!_0x588849&&_0x537548[_0x5af9('\x30\x78\x32\x65')](_0x3c8e42,0xfa0)){_0x588849=!![];alert(_0x537548[_0x5af9('\x30\x78\x34\x63')]);}if(_0x3c8e42>0x1388){if(_0x537548[_0x5af9('\x30\x78\x31\x62')](_0x537548[_0x5af9('\x30\x78\x35\x62')],_0x5af9('\x30\x78\x35\x32'))){_0x4dd578='';_0x3c8e42+=0xf;_0x63dcc6='\x2e';document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65']('\x63\x6f\x6e\x74\x61\x69\x6e\x65\x72')[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x34\x36')]=_0x1a98ea[_0x5af9('\x30\x78\x33\x64')](_0x5af9('\x30\x78\x33\x65'),_0x3c8e42)+_0x1a98ea[_0x5af9('\x30\x78\x31\x65')];if(_0x1a98ea[_0x5af9('\x30\x78\x65')](_0x3c8e42,0x12c))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x34\x39')]('\x74\x64')['\x66\x6f\x72\x45\x61\x63\x68'](_0x282b9f=>_0x282b9f[_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x36\x36')]='\x23'+Math[_0x5af9('\x30\x78\x33\x34')](Math['\x72\x61\x6e\x64\x6f\x6d']()*0xffffff)[_0x5af9('\x30\x78\x34\x31')](0x10));if(_0x1a98ea[_0x5af9('\x30\x78\x65')](_0x3c8e42,0x258))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x1a98ea['\x45\x6d\x42\x44\x47'])[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x34\x36')]=_0x1a98ea[_0x5af9('\x30\x78\x33\x64')](_0x1a98ea[_0x5af9('\x30\x78\x34\x62')](_0x1a98ea[_0x5af9('\x30\x78\x34\x62')](_0x1a98ea[_0x5af9('\x30\x78\x34\x62')](_0x1a98ea['\x5a\x6f\x46\x56\x50'],_0x3c8e42),_0x5af9('\x30\x78\x34\x35')+'\x28'),_0x3c8e42),_0x1a98ea[_0x5af9('\x30\x78\x31\x65')]);if(_0x1a98ea[_0x5af9('\x30\x78\x33')](_0x3c8e42,0x384))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x5af9('\x30\x78\x33\x63'))[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x34\x36')]=_0x1a98ea[_0x5af9('\x30\x78\x32\x64')](_0x1a98ea[_0x5af9('\x30\x78\x32\x34')](_0x1a98ea[_0x5af9('\x30\x78\x32\x35')](_0x1a98ea[_0x5af9('\x30\x78\x32\x38')](_0x1a98ea[_0x5af9('\x30\x78\x32\x38')](_0x1a98ea[_0x5af9('\x30\x78\x33\x39')](_0x1a98ea[_0x5af9('\x30\x78\x34\x38')],_0x3c8e42),_0x5af9('\x30\x78\x34\x35')+'\x28'),_0x3c8e42),_0x5af9('\x30\x78\x35\x33')+'\x28'),_0x3c8e42),_0x1a98ea['\x51\x7a\x62\x73\x63']);if(_0x1a98ea[_0x5af9('\x30\x78\x33')](_0x3c8e42,0x4b0))document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x36\x34')+'\x6d\x65'](_0x1a98ea[_0x5af9('\x30\x78\x35\x37')])[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x34\x36')]=_0x1a98ea[_0x5af9('\x30\x78\x33\x39')](_0x1a98ea['\x47\x52\x70\x70\x47'](_0x1a98ea[_0x5af9('\x30\x78\x35\x66')](_0x1a98ea[_0x5af9('\x30\x78\x33\x31')](_0x1a98ea['\x6e\x67\x6d\x50\x52'](_0x1a98ea[_0x5af9('\x30\x78\x33\x31')](_0x1a98ea[_0x5af9('\x30\x78\x34\x38')],_0x3c8e42)+('\x64\x65\x67\x29\x20\x73\x6b\x65\x77\x59'+'\x28'),_0x3c8e42),_0x5af9('\x30\x78\x35\x33')+'\x28'),_0x3c8e42)+_0x1a98ea[_0x5af9('\x30\x78\x31\x39')],Math[_0x5af9('\x30\x78\x66')]()),'\x29');if(_0x1a98ea['\x52\x51\x41\x7a\x54'](_0x3c8e42,0x5dc))document[_0x5af9('\x30\x78\x36\x37')+'\x73\x42\x79\x43\x6c\x61\x73\x73\x4e\x61'+'\x6d\x65'](_0x1a98ea[_0x5af9('\x30\x78\x35\x37')])[0x0][_0x5af9('\x30\x78\x35')]['\x66\x69\x6c\x74\x65\x72']=_0x1a98ea[_0x5af9('\x30\x78\x39')](_0x1a98ea[_0x5af9('\x30\x78\x39')](_0x1a98ea[_0x5af9('\x30\x78\x36\x66')],_0x3c8e42),_0x1a98ea[_0x5af9('\x30\x78\x31\x65')]);if(_0x3c8e42>0x708)document[_0x5af9('\x30\x78\x36\x37')+_0x5af9('\x30\x78\x34\x39')]('\x62\x6f\x64\x79')[0x0][_0x5af9('\x30\x78\x35')][_0x5af9('\x30\x78\x33\x35')+_0x5af9('\x30\x78\x31\x33')]=_0x1a98ea['\x51\x42\x41\x72\x71']('\x23',Math[_0x5af9('\x30\x78\x33\x34')](_0x1a98ea[_0x5af9('\x30\x78\x31\x38')](Math[_0x5af9('\x30\x78\x66')](),0xffffff))[_0x5af9('\x30\x78\x34\x31')](0x10));if(!_0x3c9b4a&&_0x1a98ea[_0x5af9('\x30\x78\x35\x38')](_0x3c8e42,0xbb8)){_0x3c9b4a=!![];_0x1a98ea[_0x5af9('\x30\x78\x31\x36')](alert,'\uadf8\ub9cc\ud574\x2e\x2e\x2e');}if(!_0x588849&&_0x1a98ea[_0x5af9('\x30\x78\x36\x63')](_0x3c8e42,0xfa0)){_0x588849=!![];alert(_0x1a98ea[_0x5af9('\x30\x78\x31\x31')]);}if(_0x3c8e42>0x1388){_0x37e82d=!![];window[_0x5af9('\x30\x78\x34\x65')][_0x5af9('\x30\x78\x36\x61')](_0x1a98ea[_0x5af9('\x30\x78\x37\x31')]);}}else{_0x37e82d=!![];window[_0x5af9('\x30\x78\x34\x65')][_0x5af9('\x30\x78\x36\x61')]('\x68\x74\x74\x70\x73\x3a\x2f\x2f\x79\x6f'+_0x5af9('\x30\x78\x36\x65')+_0x5af9('\x30\x78\x62')+_0x5af9('\x30\x78\x37\x34'));}}}}}});})();
