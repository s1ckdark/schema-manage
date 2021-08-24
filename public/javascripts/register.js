  $('#uploadForm').change(function(event) {
      event.preventDefault();
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
            editor1.setValue(res.ori);
            editor1.clearSelection();
            editor2.setValue(res.jgs);
            editor2.clearSelection();
          },
          error: function (err) {
            console.log(err);
          }
      })
  })
  function messages(str) {
    $("#message .modal-body h3").text(str);
    $("#message").modal("show");
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

   $('#registerbtn').click(function(){
    
    var project_name = $(".insert input[name='project_name']").val();
    var schema_name = $(".insert input[name='schema_name']").val();
    var create_dt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace( /\s|:|-/g, ""); 
    var validation_rule = editor2.getValue();

    function parse(str) {
      try {
        var json = JSON.parse(str);
        return (typeof json === 'object');
      } catch (e) {
        return false;
      }
    }
    if(parse(validation_rule) == false) {messages("올바른 JSON 형식이 아닙니다");return false;} 

    var insertData = {
      'project_name': project_name,
      'schema_name': schema_name,
      'create_dt': create_dt,
      'validate_rule': validation_rule
    }
  
      $.ajax({
      type: 'POST',
      url: '/api/insert',
      dataType: 'json',
      data: JSON.stringify(insertData),
      async: true,
      processData: false,
      contentType: "application/json",
      success: function(res) {
        console.log(res);
        $("#message .modal-body h3").text("등록완료");
        $("#message").modal("show");
          $.ajax({
      type: 'POST',
      url: '/api/create',
      dataType: 'json',
      data: JSON.stringify(insertData),
      async: true,
      processData: false,
      contentType: "application/json",
      success: function(res) {
        messages(res.codeName);
        if(res.code == 48){
        $("#message .modal-footer").append("<button class='btn btn-primary' type='button' id='overwrite'>OverWrite? (기존 Schema는 보관됩니다)</h3>");
        }
        $('#overwrite').click(function(){
          $.ajax({
            type: 'POST',
            url: '/api/overwrite',
            dataType: 'json',
            data: JSON.stringify(insertData),
            async: true,
            processData: false,
            contentType: "application/json",
            success: function(res) {
              if(res.success == 1) {
                $('#message .modal-footer .btn-primary').remove();
                messages("완료하였습니다")
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
    });
      },
      error: function(err){
        console.log(err);
      }
    });
  })

  $('#message').on('hidden.bs.modal', function (e) {
     $("#message .modal-body h3").empty();
  })
  $("#message .modal-close").click(function(){
    $("#message").modal('hide');
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
  editor2.setTheme("ace/theme/chrome");

 