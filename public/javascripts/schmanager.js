
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
        res.success == true ?
        res['data'].map( (res, index) => {
          index++;
          var list = "<tr class='text-center align-middle'>";
          list+= "<td class='index px-2 py-4 col-md-1'>"+index+"</td>";
          list+= "<td class='project_name px-2 py-4 col-md-2'>"+res.project_name+"</td>";
          list+= "<td class='schema_name px-2 py-4 col-md-2'>"+res.schema_name+"</td>";
          list+= "<td id='validation_rule_"+index+"' class='px-2 py-4 col-md-4'></td>";
          list+= "<td class='create_dt px-2 py-4 col-md-2'>"+dateFormatter(res.create_dt)+"</td>";
          list+= "<td class='detailview px-2 py-4 col-md-1'><button type='button' class='btn btn-secondary' data-log_sum='"+res.schema_name+"' data-toggle='modal' data-target='#validate_logs_sum' onClick='detailview(`"+res.schema_name+"`,`"+res.project_name+"`,`"+res.create_dt+"`)'>이 력</button></td>";
          list+= "</tr>";
          $('.resultoffindbyschema .table_contents').append(list);
          var jtree = JSON.parse(res.validate_rule);
          // console.log(jtree);
          var ctree = document.getElementById('validation_rule_'+index);
          // console.log(ctree);
          var tree = jsonTree.create(jtree, ctree);
          tree.expand(function(node) {
             return node.childNodes.length < 1
          });
          
          $('.resultoffindbyschema').removeClass('invisible');
        }) : messages("검색된 결과가 없습니다");
      },
      error: function(err){
        console.log(err);
      }
    });
  });

 const detailview = (schema_name, project_name,create_dt)=>{
    $('#validate_logs_sum .table_contents tr').remove();
    $('#validate_logs_sum .modal-body h3.message').remove();
    $('#validate_logs_sum .modal-title').empty();
    $('#validate_logs_sum .modal-count').empty();
    $('#validate_logs_sum').modal('show');
    $('.modal-close').click(function(){
    $('#validate_logs_sum').modal('hide');
    })

    var json = {
      'schema_name': schema_name,
      'project_name': project_name,
      'create_dt': create_dt
    }
  
      $.ajax({
      type: 'POST',
      url: '/api/getranks',
      dataType: 'json',
      data: JSON.stringify(json),
      async: true,
      processData: false,
      contentType: "application/json",
      success: function(res) {
        var result =''
        if(res.cnt>0){
        res['data'].map( (res, index) => {
          index++;
          var result = "<tr class='text-center align-middle'>";
          result+= "<td class='index px-2 py-4 col-md-1'>"+index+"</td>";
          result+= "<td class='project_name px-2 py-4 col-md-2'>"+res.project_name+"</td>";
          result+= "<td class='schema_name px-2 py-4 col-md-2'>"+res.schema_name+"</td>";
          result+= "<td class='create_dt px-2 py-4 col-md-2'>"+dateFormatter(res.create_dt)+"</td>";
          result+= "<td class='total_cnt px-2 py-4 col-md-1'>"+res.total_cnt+"</td>";
          result+= "<td class='err_file_cnt px-2 py-4 col-md-1'>"+res.err_file_cnt+"</td>";
          result+= "<td class='pass_file_cnt px-2 py-4 col-md-1'>"+res.pass_file_cnt+"</td>";
          result+= "<td class='err_ratio px-2 py-4 col-md-2'>"+res.err_ratio.toFixed(6)+"%</td>";
          result+= "</tr>";
          $('#validate_logs_sum .table_contents').append(result);
        })
        $('#validate_logs_sum .modal-title').text(json.schema_name);
        $('#validate_logs_sum .modal-count').text(res.cnt+"건이 조회");
      } else {
           $('#validate_logs_sum .table_contents').append("<tr class='border-0'><td class='text-center align-middle m-5' colspan='9'><h3>검색결과가 없습니다</h3></td></tr>");
      }
      },
      error: function(err){
        console.log(err);
      }
    });
}

  

 



