
$('.template-pop').click(function(){
	var tempfile = "template/"+$(this).data("temp")+".json";
	$.get(tempfile, function(response) {
    var temp = JSON.stringify(response, null, 2);
	  editor1.setValue(temp)	
	  editor1.clearSelection();
	});
})


$('#uploadForm').change(function(event) {
      event.preventDefault();
      $('#filename').empty();
      var json = new FormData($(this)[0]);
      $.ajax({
          type: "POST",
          enctype: 'multipart/form-data',
          url: "/api/upload",
          data: json,
          processData: false,
          contentType: false,
          cache: false,
          timeout: 600000,
          success: function (res) {
            if(res.success == true) {
            editor1.setValue(res.ori);
            editor1.clearSelection();
            editor2.setValue(res.jgs);
            editor2.clearSelection();
            $('#filename').text($('#file')[0].files[0].name);
          } else {
            messages("잘못된 JSON 파일입니다")
          }
          },
          error: function (err) {
            console.log(err);
          }
      })
  })

   $('#registerbtn').click(function(){
    
    var project_name = $(".insert input[name='project_name']").val();
    var schema_name = $(".insert input[name='schema_name']").val();
    var create_dt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace( /\s|:|-/g, ""); 
    var validation_rule = editor2.getValue();

    if(project_name.length == 0 || schema_name.length == 0) {messages("입력항목을 입력해주세요");return false;}
    if(parse(validation_rule) == false) {messages("올바른 JSON 형식이 아닙니다");return false;} 
      
    var info = {
      'project_name': project_name,
      'schema_name': schema_name,
      'create_dt': create_dt,
      'validate_rule': validation_rule
    }

    $.ajax({
      type: 'POST',
      url: '/api/create',
      dataType: 'json',
      data: JSON.stringify(info),
      async: true,
      processData: false,
      contentType: "application/json",
      success: function(res) {
        if(res.ok == "0") {
        if(res.code){
          if(res.code == 48) {
          $("#message .modal-footer").append("<button class='btn-overwrite btn btn-primary' type='button' id='overwrite'>YES (기존 Schema는 보관됩니다)</h3>");
            $('#overwrite').click(function(){
              $('#message .modal-content h3').remove();
            $.ajax({
              type: 'POST',
              url: '/api/overwrite',
              dataType: 'json',
              data: JSON.stringify(info),
              async: true,
              processData: false,
              contentType: "application/json",
              success: function(res) {
                if(res.success == 1) {
                  $('#message .modal-footer .btn-primary').remove();
                  $.ajax({
                    type: 'POST',
                    url: '/api/insert',
                    dataType: 'json',
                    data: JSON.stringify(info),
                    async: true,
                    processData: false,
                    contentType: "application/json",
                    success: function(res) {
                      messages("완료하였습니다")
                            setTimeout(() =>  location.href="/schregister", 2000);
                    }, error: function(err){
                      console.log(err);
                    }
                  })
                } else {
                  $('#message .modal-footer .btn-primary').remove();
                  messages("실패하였습니다.")
                }
              },
              error: function(err){
                console.log(err);
              }
            });
          })
        }
        messages(getbycode(res.code)[0].message) 
      }else {
          $.ajax({
            type: 'POST',
            url: '/api/insert',
            dataType: 'json',
            data: JSON.stringify(info),
            async: true,
            processData: false,
            contentType: "application/json",
            success: function(res) {
              if(res.success == true) {
                messages("등록 완료 하였습니다");
                setTimeout(() =>  location.href="/schregister", 2000);
              }
            },
            error: function(err){
              console.log(err);
            }
          })
      }
    }
  }
})
 })

  function loadEditor(container, readonly){
    var editor = ace.edit(container);
    if(readonly){
      editor.setReadOnly(true)
      editor.renderer.$cursorLayer.element.style.display = "none"
    }
    editor.setShowPrintMargin(false);
    editor.session.setUseWrapMode(true);
    return editor;
  }

  var editor1 = loadEditor("text-area1");
  editor1.getSession().setMode("ace/mode/json");
  editor1.setTheme("ace/theme/chrome");
  var editor2 = loadEditor("text-area2");
  editor2.getSession().setMode("ace/mode/json");
  editor2.setTheme("ace/theme/monokai");

 
