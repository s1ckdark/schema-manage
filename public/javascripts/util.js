  function messages(str, next) {
    $("#message .modal-body").append("<h3>"+str+"</h3>");
    $("#message").modal("show");
    $('#message').on('hidden.bs.modal', function (e) {
       $("#message .modal-body h3").remove();
	     $("#message .modal-footer .btn-overwrite").remove();
    })
    $("#message .modal-close").click(function(){
      $("#message").modal('hide');
      $("#message .modal-body h3").remove();
      $("#message .modal-footer .btn-overwrite").remove();
    })
  }


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
  var data = [
    { 
      "code":"48",
      "message":"중복된 스키마가 있습니다. 저장하겠습니까?"
    },
    { 
      "code":"32",
      "message":"잘못된 JSON 형식입니다."
    },
    { 
      "code":"9",
      "message":"잘못된 JSON 형식입니다."
    },
    { 
      "code":"2",
      "message":"BadValue"
    },
  ]; 
  return data.filter(
    function(data) {
      return data.code == code }
  );
}

const calculate = (total_item_cnt, validate_logs_cnt, err_item_cnt) => {
        var pass_item_cnt = total_item_cnt - err_item_cnt || 0;
        var err_item_cnt = err_item_cnt || 0;
        var error_item_ratio = err_item_cnt / validate_logs_cnt * 100 || 0;
        return {"total_item_cnt":total_item_cnt, "err_item_cnt":err_item_cnt, "pass_item_cnt":pass_item_cnt, "error_item_ratio": error_item_ratio.toFixed(6)}
}

const dateFormatter = (str) => {
  var year = str.slice(0, 4);
  var mon = str.slice(4, 6);
  var day = str.slice(6, 8);
  var hour = str.slice(8,10);
  var min = str.slice(10,12);
  var sec = str.slice(12,14);
  return year+"-"+mon+"-"+day+" "+hour+":"+min+":"+sec;
}
