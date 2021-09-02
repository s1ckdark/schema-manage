let validate_logs_cnt=0, err_item_cnt=0,pass_item_cnt=0,error_item_ratio=0,info ={};

$('#keyword').submit(function(event){
    event.preventDefault();
	$('.table_contents').empty();
	$('#listoferror > div').removeData();
	validate_logs_cnt=0, err_item_cnt=0,pass_item_cnt=0,error_item_ratio=0;
    var json = {
	  // 'project_name': '/^'+$('#keyword input[name="project_name"]').val()+'/',
	  'project_name': $('#keyword input[name="project_name"]').val(),
    'schema_name': {$regex: $('#keyword input[name="schema_name"]').val()},
    'create_dt':  {$regex : $('#keyword input[name="create_dt"]').val()},
    }
    $.ajax({
		type: 'POST',
		url: '/api/distinct',
		dataType: 'json',
		data: JSON.stringify(json),
		async: true,
		processData: false,
		contentType: 'application/json',
		success: function(res) {
			if(res.success == true) {
				res['error_code_list'].map( res => {
					validate_logs_cnt += res['count'];
					$('#'+res['_id']).attr('data-cnt',res['count']);
				})
				$('#all').attr('data-cnt', validate_logs_cnt);
			}
		},
		error: function(err){
			console.log(err);	
		}
	});

    $.ajax({
      type: 'POST',
      url: '/api/validatelogssum',
      dataType: 'json',
      data: JSON.stringify(json),
      async: true,
      processData: false,
      contentType: 'application/json',
      success: function(res) {
      	pass_item_cnt = validate_logs_cnt - err_item_cnt;
      	error_item_ratio = err_item_cnt / validate_logs_cnt * 100;
      	info['project_name'] = res['data'][0]['project_name'];
      	info['schema_name'] = res['data'][0]['schema_name'];
      	$('#info_project_name h3').text(info['project_name']);
				$('#info_schema_name h3').text(info['schema_name']);
        if(res.success == true && res.cnt !=0) {  
  		var list = "<tr class='text-center align-middle'>";
      		list += "<td class='total_cnt px-2 py-4 col-md-3'>"+res['data'][0]['total_cnt']+"</td>";
      		list += "<td class='err_file_cnt px-2 py-4 col-md-3'>"+res['data'][0]['err_file_cnt']+"</td>";
      		list += "<td class='pass_file_cnt px-2 py-4 col-md-3'>"+res['data'][0]['pass_file_cnt']+"</td>";
      		list += "<td class='error_ratio px-2 py-4 col-md-3'>"+res['data'][0]['err_ratio'].toFixed(6)+"</td>";
	        list+= "</tr>";

	    var list2 = "<tr class='text-center align-middle'>";
      		list2 += "<td class='total_item_cnt px-2 py-4 col-md-3'>"+validate_logs_cnt+"</td>";
      		list2 += "<td class='err_item_cnt px-2 py-4 col-md-3'>"+err_item_cnt+"</td>";
      		list2 += "<td class='pass_item_cnt px-2 py-4 col-md-3'>"+pass_item_cnt+"</td>";
      		list2 += "<td class='error_item_ratio px-2 py-4 col-md-3'>"+error_item_ratio.toFixed(6)+"%</td>";
	        list2+= "</tr>";

        $('#validate_logs_sum .table_contents').append(list);
        $('#validate_logs .table_contents').append(list2);
        $('#result, #side').removeClass('invisible');
        } else if(res.cnt ==0){
        	messages("검색 결과가 없습니다");
        } else if(res.success == false){
        	messages(res['message'])
        }
      },
      error: function(err){
        console.log(err);
      }
    })
});

$('#listoferror > div').click(function(){
	$('#validate_logs_list').removeClass('invisible');
	$('#validate_logs_list .table_contents').empty();
	$('#validate_logs_list #csv-btn').remove();
	var error_item_cnt = $(this).data('cnt');
	var errcode = $(this).attr('id');
	var cal = calculate(validate_logs_cnt, error_item_cnt);
	for(var key in cal){
		$('.'+key).text(cal[key]);
	}
	var json = {
	  	'project_name': info['project_name'],
      'schema_name': info['schema_name'],
      'error_code': errcode
    }
    $.ajax({
		type: 'POST',
		url: '/api/validatelogslist',
		dataType: 'json',
		data: JSON.stringify(json),
		async: true,
		processData: false,
		contentType: 'application/json',
		success: function(res) {
			if(res.success == true) {
				var errList ='',list='';
				res['data'].map(res => {
				res['error_msg'].map(ele => {errList += '<p>'+ele+'</p>'})
					list += "<tr class='align-middle text-break'>";
				    list +="<td class='pr-2 py-2 col-md-2 text-left'>"+res['json_file']+"</td>";
            list +="<td class='px-2 py-2 col-md-1 text-break text-center'>"+res['project_name']+"</td>";
            list +="<td class='px-2 py-2 col-md-1 text-break text-center'>"+res['schema_name']+"</td>";
            list +="<td class='px-2 py-2 col-md-1 text-break text-center'>"+res['error_field']+"</td>";
            list +="<td class='px-2 py-2 col-md-1 text-break text-center'>"+res['error_code']+"</td>";
            list +="<td class='px-2 py-2 col-md-1 text-break text-center'>"+res['error_name']+"</td>";
            list +="<td class='px-2 py-2 col-md-4 text-break text-left'>"+errList+"</td>";
            list +="<td class='pl-2 py-2 col-md-1 text-break text-center'>"+dateFormatter(res['create_dt'])+"</td>"
            list +="</tr>";
				})
				$('#validate_logs_list .table_contents').append(list);
				$('#validate_logs_list').prepend("<button type='button' id='csv-btn' class='btn btn-secondary' onClick='exporttocsv(`"+errcode+"`)'>"+errcode+" CSV로 저장하기</button>");
			}
		},
		error: function(err){
			console.log(err);	
		}
	});
})

const exporttocsv = (errcode) => {
	var json = {
	  'project_name': $('#keyword input[name="project_name"]').val(),
      'schema_name': $('#keyword input[name="schema_name"]').val(),
      'error_code': errcode
    }
	$.ajax({
		type: 'POST',
		url: '/api/exporttocsv',
		dataType: 'json',
		data: JSON.stringify(json),
		async: true,
		processData: false,
		contentType: 'application/json',
		success: function(res) {
			if(res.success == true) {
				 var popout = window.open('./download/'+res.filepath);
			      window.setTimeout(function(){
			         popout.close();
			      }, 2000);
				messages("저장 완료")
			}
		},
		error: function(err){
			console.log(err);
		}
	});
}
