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
