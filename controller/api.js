const multer = require('multer'); 
const axios = require('axios');
const logger = require('morgan');
const path = require('path');
const JSONTreeView = require('json-tree-view');
const jgs = require('json-gen-schema');
const util = require("util");
const jsoncsv = require('json-csv');
const fs = require('fs');

const api = {
	findbyschema: async(req, res) => {
	  var json = req.body;
	  await db.collection('schema_reg').find(json).sort({'create_dt':-1}).toArray(function (err, result) {    
	      if(result.length > 0) res.status(200).json({success:true,data:result, message:"조회 성공"})
	      else res.status(200).json({status:0, message:"검색 결과가 없습니다."})
    })
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
		const jgs_data = JSON.stringify(jgs(JSON.parse(ori_data)),null,4);
  	res.status(200).json({ori:ori_data,jgs:jgs_data})
	},
	validatelogssum: async(req, res) => {
	  var json = req.body;
	  await db.collection('validate_logs_sum').find(json, {projection:{_id:0}}).sort({'create_dt':-1}).limit(1).toArray(function (err, result) {
     	 console.log(result);
     	 res.status(200).json({data:result,cnt:result.length,success: true})
    })
	},
	validatelogslist: async(req, res) => {
		var json = req.body;
		var collectionName = 'validate_logs_'+json.project_name;
	 	await db.collection(collectionName).find(json, {projection:{_id:0}}).sort({_id:-1}).limit(20).toArray(function (err, result) {
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
		fs.writeFile("./public/temp/"+json['project_name']+"_"+json['schema_name']+"_"+json['error_code']+".csv",  '\uFEFF' + csv, function(err, res){
			if(err){
				console.log(err);
				throw err
			}
		})
		// res.status(200).json({success:true,message:"saved",filepath:json['project_name']+"_"+json['schema_name']+"_"+json['error_code']});
		var test = "./public/temp/"+json['project_name']+"_"+json['schema_name']+"_"+json['error_code']+".csv";
		console.log(test);
		res.download(test);

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
