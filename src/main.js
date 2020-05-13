$(document).ready(function () {
  $('#table').DataTable({
    "scrollY": "500px",
    paging: false,
    order: [[ 1, 'asc' ], [ 0, 'asc' ]],
    colReorder: false,
    "ordering": false,
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');
});