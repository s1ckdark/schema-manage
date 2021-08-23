
$('.mode a').click(function(){
    $(this).each(function(){
    var target = $(this).data('mode');
      $(target).toggleClass('d-none');
  })
  });
  $('.template-pop').click(function(){

  })

 const detailview = (schema_name, create_dt)=>{
    $('#validate_logs_sum .table_contents tr').remove();
    $('#validate_logs_sum .modal-body h3.message').remove();
    $('#validate_logs_sum').modal('show');
    $('.modal-close').click(function(){
    $('#validate_logs_sum').modal('hide');
    })
    var json = {
      'schema_name': schema_name,
      'create_dt': create_dt
    }
  
    $.ajax({
      type: 'POST',
      url: '/api/validate_logs_sum',
      dataType: 'json',
      data: JSON.stringify(json),
      async: true,
      processData: false,
      contentType: "application/json",
      success: function(res) {
        console.log(res);
        var result ='';
        if(res.cnt>0){
        res['data'].map( (res, index) => {
          index++;
          var result = "<tr class='text-center'>";
          result+= "<td class='index px-2 py-4 col-md-1'>"+index+"</td>";
          result+= "<td class='project_name px-2 py-4 col-md-3'>"+res.project_name+"</td>";
          result+= "<td class='schema_name px-2 py-4 col-md-3'>"+res.schema_name+"</td>";
          result+= "<td class='create_dt px-2 py-4 col-md-2'>"+res.create_dt.replace( /\s|:/g, "")+"</td>";
          result+= "<td class='total_cnt px-2 py-4 col-md-3'>"+res.total_cnt+"</td>";
          result+= "<td class='err_file_cnt px-2 py-4 col-md-3'>"+res.err_file_cnt+"</td>";
          result+= "<td class='pass_file_cnt px-2 py-4 col-md-3'>"+res.pass_file_cnt+"</td>";
          result+= "<td class='err_ratio px-2 py-4 col-md-3'>"+res.err_ratio+"</td>";
          result+= "</tr>";
          $('#validate_logs_sum .table_contents').append(result);
        })
        $('#validate_logs_sum .modal-title').text(json.schema_name);
        $('#validate_logs_sum .modal-count').text("10 / "+res.cnt);
      } else {
          $('#validate_logs_sum .modal-title').text(json.schema_name);
          $('#validate_logs_sum .modal-body').append("<h3 class='text-center message'>검색결과가 없습니다</h3>");
      }
      },
      error: function(err){
        console.log(err);
        // location.href="/error";
      }
    });
  }

  $('#registerbtn').click(function(){
    $("#message .modal-body").empty()
    var project_name = $(".insert input[name='project_name']").val();
    var schema_name = $(".insert input[name='schema_name']").val();
    var create_dt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace( /\s|:|-/g, ""); 
    var validation_rule = editor2.getValue();



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
        console.log("insert"+res);
          $.ajax({
      type: 'POST',
      url: '/api/create',
      dataType: 'json',
      data: JSON.stringify(insertData),
      async: true,
      processData: false,
      contentType: "application/json",
      success: function(res) {
        $("#message .modal-body").append("<h3>"+res.codeName+"</h3>");
        if(res.code == 48){
        $("#message .modal-footer").append("<button class='btn btn-primary' type='button' id='overwrite'>OverWrite? (기존 Schema는 삭제됩니다)</h3>");
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
              console.log(res);
              if(res.success == 1) {
                $('#message .modal-footer .btn-primary').remove();
                $('#message .modal-body h3').text("완료하였습니다")
              } else {
                $('#message .modal-footer .btn-primary').remove();
                $('#message .modal-body h3').text("실패하였습니다.")
              }
            },
            error: function(err){
              console.log(err);
              // location.href="/error";
            }
          });
        })
        $("#message").modal("show");
        $("#message .modal-close").click(function(){
          $("#message").modal('hide');
        })
      }
    });
      },
      error: function(err){
        console.log(err);
        // location.href="/error";
      }
    });
  
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

  $('#find').submit(function(event){
    event.preventDefault();
    $('.resultoffindbyschema .table_contents tr').remove();
    var json = {
      'schema_name': {$regex: $('.search input[name="schema_name"]').val()}
    }
    $.ajax({
      type: 'POST',
      url: '/api/findbyschema',
      dataType: 'json',
      data: JSON.stringify(json),
      async: true,
      processData: false,
      contentType: 'application/json',
      success: function(res) {
        res.status == 1 ?
        res['data'].map( (res, index) => {
          index++;
          var list = "<tr class='text-center align-middle'>";
          list+= "<td class='index px-2 py-4 col-md-1'>"+index+"</td>";
          list+= "<td class='project_name px-2 py-4 col-md-4'>"+res.project_name+"</td>";
          list+= "<td class='schema_name px-2 py-4 col-md-4'>"+res.schema_name+"</td>";
          list+= "<td class='create_dt px-2 py-4 col-md-2'>"+res.create_dt.replace( /\s|:/g, "")+"</td>";
          list+= "<td class='detailview px-2 py-4 col-md-1'><button type='button' class='btn btn-secondary' data-log_sum='"+res.schema_name+"' data-toggle='modal' data-target='#validate_logs_sum' onClick='detailview(`"+res.schema_name+"`,`"+res.create_dt+"`)'>이 력</button></td>";
          list+= "</tr>";
          $('.resultoffindbyschema .table_contents').append(list);
          $('.resultoffindbyschema').removeClass('invisible');
        }) : $('.resultoffindbyschema').append("<div class='d-flex p-5 justify-content-center'>"+res['message']+"</div>");
      },
      error: function(err){
        console.log(err);
      }
    });
  });

 

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

