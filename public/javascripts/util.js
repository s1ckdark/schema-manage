  function messages(str) {
    $("#message .modal-body").append("<h3>"+str+"</h3>");
    $("#message").modal("show");
    $('#message').on('hidden.bs.modal', function (e) {
       $("#message .modal-body h3").remove();
    })
    $("#message .modal-close").click(function(){
      $("#message").modal('hide');
    })
  }

  var err_code = [
    { 
      "codeName":"48",
      "message":"OverWrite? (기존 Schema는 보관됩니다)"
    },
    { 
      "codeName":"32",
      "message":"잘못된 JSON 형식입니다."
    },
  ];