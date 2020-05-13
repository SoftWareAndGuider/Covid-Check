$(document).ready(function () {
  $('#table').DataTable({
    "scrollY": "65vh",
    paging: false,
    order: [[ 1, 'asc' ], [ 0, 'asc' ]],
    colReorder: false,
    "ordering": false,
    "info": false,
    "language": {
      "search": "검색 <small>ex) 3학년 3반 체크안함</small>:"
    }
  });
  $('.dataTables_length').addClass('bs-select');
  $(".alert").alert();
});