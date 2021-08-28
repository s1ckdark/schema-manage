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

  var data = [
    { 
      "code":"48",
      "message":"중복된 스키마가 있습니다. 저장하겠습니까?"
    },
    { 
      "code":"32",
      "message":"잘못된 JSON 형식입니다."
    },
  ]; 

  // input validation via JSON
  function parse(str) {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }


// find value and get Key from json
function getbycode(code) {
  return data.filter(
    function(data) {
      return data.code == code }
  );
}

