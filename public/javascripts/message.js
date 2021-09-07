$(function(){
  if($('#message .modal-content .alert').text().length > 0) {
    messages($('#message .modal-content .alert').text());
    $('#message .modal-content .alert').remove();
    $('#message .modal-footer .btn-overwrite').remove();
  }
});
