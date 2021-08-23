const multer = require('multer'); 
const axios = require('axios');
const logger = require('morgan');
const path = require('path');
const JSONTreeView = require('json-tree-view');
const jgs = require('json-gen-schema');
const util = require("util");

// mongodb
const { mongodb } = require('mongodb');
const dbConfig = require('../db.config.js');

const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/`;
var MongoClient = require('mongodb').MongoClient, db;

MongoClient.connect(uri).then((client) => {
  db = client.db(dbConfig.DB);
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

async function createSchemaByJson(client, nameOfProject){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}

const findOneBySdhema = async (nameOfSdhema, keyword) => {
    const result = await db.collection(nameOfProject).findOne(keyword);

    if (result) {
    	console.log("success");
        // console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
    	console.log("fail");
        // console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

async function dropUpdateSchema(client, nameOfProject) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
                        .updateOne({ name: nameOfListing }, { $set: updatedListing });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

const api = {
	findbyschema: async(req, res) => {
		var json = req.body;
	  await db.collection('schema_reg').find(json).toArray(function (err, result) {    
      if(result.length > 0) res.status(200).json({status:1,data:result, message:"success"})
      else res.status(200).json({status:0, message:"Success but nothing"})
    })
	},
	insert: async(req, res) => {
		var json = req.body;
		db.collection('schema_reg').insert(json, function (err,result){
    	res.json(result)
		})
	},
	create: async(req,res) => {
		var json = req.body;
		var validate_rule = JSON.parse(json.validate_rule);
		await db.createCollection(json.schema_name, validate_rule, function(err, result){
			if(!result) {res.status(200).json(err)}
		})
	},
	upload: async(req, res) => {
		const ori_data = req.file.buffer.toString("utf8");
		const jgs_data = JSON.stringify(jgs(JSON.parse(ori_data)),null,4);
  	res.status(200).json({ori:ori_data,jgs:jgs_data})
	},
	validate_logs_sum: async(req, res) => {
		var json = req.body;
	  await db.collection('validate_logs_sum').find(json).sort({_id:-1}).toArray(function (err, result) {
      limit = result.slice(0,10);
      console.log(result);
      res.status(200).json({data:limit,cnt:result.length})
    })
	},
	validate_logs: async(req, res) => {
		var json = req.body;
		console.log(json);
	  await db.collection('validate_logs').find(json).sort({_id:-1}).limit(1).toArray(function (err, result) {
      res.status(200).json(result)
    })
	},
	exporttocsv: async(req, res) => {
		res.json({"page":"schema export to csv"});	
		// res.status(200).json({ori:ori_data,jgs:jgs_data})
	},
	overwrite: async(req, res) => {
		var json = req.body;
		await db.collection(json.schema_name).rename(json.schema_name+"_"+json.create_dt);
		var validate_rule = JSON.parse(json.validate_rule);
		await db.createCollection(json.schema_name, validate_rule, function(err, result){
			if(!result) {res.status(200).json(err)}
			res.json({success:1})
		})
	}
}

module.exports = api;
