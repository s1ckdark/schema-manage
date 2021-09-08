const multer = require('multer'); 
const axios = require('axios');
const logger = require('morgan');
const path = require('path');
const JSONTreeView = require('json-tree-view');
const jgs = require('json-gen-schema');
const util = require("util");
const jsoncsv = require('json-csv');
const fs = require('fs');

// input validation via JSON
  function parse(str) {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }

 let rankArray = [];
		function loadProject(json){
		    // querying and loading into a resultSet array
		    db.collection("schema_reg").find(json).sort({create_dt:-1}).toArray(function(err, result) {
		      // check for any error and throw it
		      if (err) throw err;
		      // populating the rank array with the marks
		      for (let i = 0; i < result.length; i++) {
		          rankArray[i] = result[i]['create_dt'];
		      }
		      // passing the rank array and the resultset to the giveRank() function
		      console.log(giveRank(rankArray,result));
		    });
		}

		function giveRank(arrayArg,resultArg){
		  // declaring and initilising variables
		    let rank = 1;
		    prev_rank = rank;
		    position = 0;
		    let ranklist = [];
		    for (i = 0; i < arrayArg.length ; i ++) {
		            /*
		            If it is the first index, then automatically the position becomes 1.
		            */
		            if(i == 0) {
		                position = rank;
		            	  var temp = {'schema_name':resultArg[i]['schema_name'], 'project_name':resultArg[i]['project_name'],'create_dt':arrayArg[i],rank:position};
		            	  ranklist.push(temp);
		            
		            /*
		            if the value contained in `[i]` is not equal to `[i-1]`, increment the `rank` value and assign it to `position`.
		            The `prev_rank` is assigned the `rank` value.
		            */
		            } else if(arrayArg[i] != arrayArg[i-1]) {
		            rank ++;
		            position = rank;
		            prev_rank = rank;
            	  var temp = {'schema_name':resultArg[i]['schema_name'], 'project_name':resultArg[i]['project_name'],'create_dt':arrayArg[i],rank:position};
            	  ranklist.push(temp);
		            
		            /*
		            Otherwise, if the value contained in `[i]` is equal to `[i-1]`,
		            assign the position the value stored in the `prev_rank` variable then increment the value stored in the `rank` variable.*/
		            } else {
		                position = prev_rank;
		                rank ++;
		            	  var temp = {'schema_name':resultArg[i]['schema_name'], 'project_name':resultArg[i]['project_name'],'create_dt':arrayArg[i],rank:position};
		            	  ranklist.push(temp);
		            }
		    }
		   return ranklist;
		}


const api = {
	findbyschema: async(req, res) => {
	  var json = req.body;
	  await db.collection('schema_reg').find(json).sort({'create_dt':-1}).toArray(function (err, result) {    
	      if(result.length > 0) res.status(200).json({success:true,data:result, message:"조회 성공"})
	      else res.status(200).json({status:0, message:"검색 결과가 없습니다."})
    })
	},
	getranks: async(req, res) => {
	  var json = req.body;
		await db.collection("schema_reg").find({schema_name:json.schema_name, project_name:json.project_name}).sort({create_dt:-1}).toArray(function(err, result) {
			var date = json.create_dt;
    if (err) throw err;
    // populating the rank array with the marks
    for (let i = 0; i < result.length; i++) {
        rankArray[i] = result[i]['create_dt'];
    }
    // passing the rank array and the resultset to the giveRank() function
    var tmp = giveRank(rankArray,result);
    var tmpRank = '';
    tmp.map((item, index) => {
    		if(item.create_dt == date ) {tmpRank = index; return false}
    }
    )
    if(tmpRank === 0) {
   	   db.collection("validate_logs_sum").find({schema_name:json.schema_name,project_name:json.project_name, create_dt:{$gt:json.create_dt}}).toArray(function(err, result){
	      if(result.length > 0) res.status(200).json({success:true,data:result, message:"조회 성공",cnt:result.length})
	      else res.status(200).json({status:0, message:"검색 결과가 없습니다.",cnt:0})
   	   })
    } else {
    	 db.collection("validate_logs_sum").find({schema_name:json.schema_name,project_name:json.project_name, create_dt:{$gt:json.create_dt, $lt: tmp[tmpRank-1].create_dt}}).toArray(function(err, result){
	      if(result.length > 0) res.status(200).json({success:true,data:result, message:"조회 성공",cnt:result.length})
	      else res.status(200).json({status:0, message:"검색 결과가 없습니다.",cnt:0})
   	   })

    }

    });
	},
	insert: async(req, res) => {
		var json = req.body;
		db.collection('schema_reg').insert(json, function (err,result){
    	res.json({success:true,data:result})
		})
	},
	create: async(req,res) => {
		var json = req.body;
		var validate_rule = JSON.parse(json.validate_rule);
		await db.createCollection(json.schema_name, validate_rule, function(err, result){
			if(err) {res.status(200).json(err);return false;}
			res.json({success:true})
		})
	},
	upload: async(req, res) => {
		const ori_data = req.file.buffer.toString("utf8");
		if(parse(ori_data)){
			const jgs_data = JSON.stringify(jgs(JSON.parse(ori_data)),null,4);
			res.status(200).json({ori:ori_data,jgs:jgs_data,success:1})
		} else {
			res.status(200).json({success:0})
		}
	},
	validatelogssum: async(req, res) => {
	  var json = req.body;
	  await db.collection('validate_logs_sum').find(json, {projection:{_id:0}}).sort({'create_dt':-1}).limit(1).toArray(function (err, result) {
     	 res.status(200).json({data:result,cnt:result.length,success: true})
    })
	},
	validatelogslist: async(req, res) => {
		var json = req.body;
		var collectionName = 'validate_logs_'+json.project_name;
	 	await db.collection(collectionName).find(json, {projection:{_id:0}}).sort({_id:-1}).limit(10).toArray(function (err, result) {
    	  res.status(200).json({data:result,success:true})
   	 })
	},
	exporttocsv: async(req, res, next) => {
		var json = req.body;
		let options = {
		  fields: [
		    {
		      name: 'project_name',
		      label: 'project_name',
		    },
		    {
		      name: 'schema_name',
		      label: 'schema_name',
		    },
		    {
		      name: 'json_file',
		      label: 'json_file',
		    },		    
		    {
		      name: 'error_field',
		      label: 'error_field',
		    },		    
		    {
		      name: 'error_code',
		      label: 'error_code',
		    },		    
		    {
		      name: 'error_name',
		      label: 'error_name',
		    },		    
		    {
		      name: 'errpr_msg',
		      label: 'errpr_msg',
		    },		    
		    {
		      name: 'create_dt',
		      label: 'create_dt',
		    },		    
		  ],
		}
		var list = await db.collection('validate_logs').find(json, {projection:{_id:0}}).sort({_id:-1});
		let csv = await jsoncsv.buffered(list,options);
		fs.writeFile("./public/temp/"+json['project_name']+"_"+json['schema_name']+"_"+json['error_code']+".csv",  '\uFEFF' + csv, {mode: '755' }, function(err, res){
			if(err){
				console.log(err);
				throw err
			}
		})
		var filepath = 'http://'+process.env.HOST+'/temp/'+json['project_name']+"_"+json['schema_name']+"_"+json['error_code']+'.csv';
		// res.status(200).json({success:true,message:"saved",filepath:'http://'+process.env.HOST+'/temp/'+json['project_name']+"_"+json['schema_name']+"_"+json['error_code']});
		//var test = "./public/temp/"+json['project_name']+"_"+json['schema_name']+"_"+json['error_code']+".csv";
		res.download(filepath);

	},
	overwrite: async(req, res) => {
		var json = req.body;
		await db.collection(json.schema_name).rename(json.schema_name+"_"+json.create_dt);
		var validate_rule = JSON.parse(json.validate_rule);
		await db.createCollection(json.schema_name, validate_rule, function(err, result){
			if(!result) {res.status(200).json(err)}
			res.json({success:1})
		})
	},
	distinct: async(req, res) => {
		var json = req.body;
		var collectionName = 'validate_logs_'+json.project_name;
		await db.collection(collectionName).aggregate([{"$group" : {"_id":"$error_code", count:{$sum:1}}}]).toArray(function(err, result){
			res.json({success:1, error_code_list:result})
		})
	}
}

module.exports = api;
