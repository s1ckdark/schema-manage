
$('.template-pop').click(function(){

  })
  
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
          list+= "<td class='project_name px-2 py-4 col-md-2'>"+res.project_name+"</td>";
          list+= "<td class='schema_name px-2 py-4 col-md-2'>"+res.schema_name+"</td>";
          list+= "<td id='validation_rule_"+index+"' class='px-2 py-4 col-md-4'></td>";
          list+= "<td class='create_dt px-2 py-4 col-md-2'>"+res.create_dt.replace( /\s|:/g, "")+"</td>";
          list+= "<td class='detailview px-2 py-4 col-md-1'><button type='button' class='btn btn-secondary' data-log_sum='"+res.schema_name+"' data-toggle='modal' data-target='#validate_logs_sum' onClick='detailview(`"+res.schema_name+"`)'>이 력</button></td>";
          list+= "</tr>";
          $('.resultoffindbyschema .table_contents').append(list);
          var jtree = JSON.parse(res.validate_rule);
          console.log(jtree);
          var ctree = document.getElementById('validation_rule_'+index);
          console.log(ctree);
          var tree = jsonTree.create(jtree, ctree);
          tree.expand(function(node) {
             return node.childNodes.length < 1
          });
          
          $('.resultoffindbyschema').removeClass('invisible');
        }) : $('.resultoffindbyschema').append("<div class='d-flex p-5 justify-content-center'>"+res['message']+"</div>");


 
      },
      error: function(err){
        console.log(err);
      }
    });
  });

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

 



