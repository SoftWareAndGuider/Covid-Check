$(document).ready(function () {
  $('#table').DataTable({
    "scrollY": "50vh",
    paging: false,
    order: [[ 1, 'asc' ], [ 0, 'asc' ]],
    colReorder: false,
    "processing": true,
    "ordering": false,
    "info": false,
    "language": {
      "search": "검색 <small>ex) 3학년 3반 체크안함</small>:"
    },
    "search": {
      "search": localStorage.getItem('search') || ""
    }
  });
  $('.dataTables_length').addClass('bs-select');
  $(".alert").alert();
  document.querySelector("input[type=search]").addEventListener("input", () => {
    localStorage.setItem("search", document.querySelector("input[type=search]").value)
  })
  setTimeout(() => {
    window.location.reload()
  }, 30000)

  document.getElementsByClassName('dataTables_scrollBody')[0].scroll(0, localStorage.getItem('scroll') || 0)
  document.getElementsByClassName('dataTables_scrollBody')[0].addEventListener('scroll', (ev) => {
    localStorage.setItem('scroll', document.getElementsByClassName('dataTables_scrollBody')[0].scrollTop)
  })
});

function check (id) {
  const req = new XMLHttpRequest()
  req.open('PUT', '/api')
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({
    id, process: "check"
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
    text: '- 모든 학생들의 발열체크 여부를 전부 초기화시켜요\n- 학생들의 정보는 작업 후에도 유지되요\n- 작업을 끝나고 나서 다시 되돌릴 수 없어요\n- 발열체크를 다시 처음부터 해야할지도 몰라요!',
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
