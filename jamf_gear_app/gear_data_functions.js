/*
*	File for aggregating data from Gear API
*	using HTTP requests
*/

/* Adding modules to file */
require('dotenv').config();
const rp = require('request-promise')

/* Processing token from .env and storing in a variable */
token = process.env.TOKEN

/*
* Createing a class for Strawberry object, each Strawberry will be a user
*
*  Example 1:
*
*  var new_straweberry = new Strawberry();
*
*/
function Strawberry(token){
  this.token = token
  console.log("\n***Connection to Gear established.***")
}

/*
*  Abstract to allow HTTP requests, example usage:
*
*  Example 1: make_request("https://gear.githubapp.com/api/assets")
*
*/
Strawberry.prototype.make_request = function(request_string, parm, method){
	if (parm){
    	request_string = request_string+parm
	}
	let options = {
		url: request_string,
		'Method': method,
		'Accept': '*/*',
		headers: {
		    'Authorization' : 'Token token=' + this.token,
		     "User-Agent" : "curl/7.51.0",
		     "Accept" : "*/*"
		},
	};

	console.log("Making request...")
	return rp(options).then((request_data) => {
		return request_data
	}).catch((err) => {
	  console.log(err);
	  console.log("There was an error in your request URL.")
	})
}

/*
*  Get all computers
*
*  Example 1: computers()
*
*/
Strawberry.prototype.computers = function(){
	return this.make_request("https://gear.githubapp.com/api/assets", null, "Get")
}

/*
*  Generate searchable dictonary where serial number is the key and username is the value
*
*  Example 1: dictionary_search_for_serial("John Doe")
*
*/
Strawberry.prototype.dictionary_search_for_serial_username = function(username){
	var dict = {};
	var dict_to_search;

	return this.dictionary_by("user","name").then((data) => {
		console.log("username:",username)
		try {
				dict_to_search = data[username]
				dict_to_search.forEach(item => {
					dict[item["serialNumber"]] = item["name"]
				})
		} catch (err){
			console.log(err)
			dict["0"] = "not found"
		}

		return dict
	});
}

/*
*  Generate searchable dictonary where serial number is the key and handle is the value
*
*  Example 1: dictionary_search_for_serial_handle("JohnDoe")
*
*/
Strawberry.prototype.dictionary_search_for_serial_handle = function(handle){
	var dict = {};
	var dict_to_search;

	return this.dictionary_by("user","login").then((data) => {
		console.log("handle:",handle)
		try {
				dict_to_search = data[handle]
				dict_to_search.forEach(item => {
					dict[item["serialNumber"]] = item["name"]
				})
			} catch (err){
				console.log(err)
				dict["0"] = "not found"
			}
		return dict
	});
}

/*
*  Generate dictionary and search it to compare Gear and Jamf
*
*	Returns either dictionary depending on option passed:
*		- 'jamf' to return computers not in Jamf
*		- 'gear' to return computers no in Gear
*		- 'info' to return dictionary of info from diff checker
*/
Strawberry.prototype.dictionary_search_by_serial_compare = function(jamf_dictionary, option){

	var dict = {};
	var dict_keys;
	var jamf_serials = []
	var gear_serials = []
	var dict_not_found_jamf = {}
	var dict_not_found_gear = {}
	var dict_info = {}

	dict_not_found_jamf["Total_Number_Not_In_Jamf"] = 0
	dict_not_found_gear["Total_Number_Not_In_Gear"] = 0

	return this.dictionary_by("serialNumber").then((data) => {
		dict_keys = Object.keys(data)
		dict_keys.forEach((key)=>{
			try{
				name = data[key][1]["name"]
				found = name.match("MacBook")
				if (!found){
					console.log(name)
				} else {
					dict[key] = data[key][1]["user"]["login"]
				}

			}catch(err){
				console.log(err)
			}
		})
		jamf_serials = Object.keys(jamf_dictionary)
		gear_serials = Object.keys(dict)

		for (var i = 0; i < jamf_serials.length; i++){
		  if(!gear_serials.includes(jamf_serials[i])){
		   	dict_not_found_gear[jamf_serials[i]] = jamf_dictionary[jamf_serials[i]]
		    dict_not_found_gear["Total_Number_Not_In_Gear"] += 1
		  }
		}
		console.log("\nDone checking Gear...")

		for (var i = 0; i < gear_serials.length; i++){
		  if(!jamf_serials.includes(gear_serials[i])){
		    dict_not_found_jamf[gear_serials[i]] = dict[gear_serials[i]]
		    dict_not_found_jamf["Total_Number_Not_In_Jamf"] += 1
		  }
		}
		console.log("Done checking Jamf.\n")

		var data_gear = [dict_not_found_gear["Total_Number_Not_In_Gear"], dict_not_found_gear]
		var data_jamf = [dict_not_found_jamf["Total_Number_Not_In_Jamf"], dict_not_found_jamf]

		dict_info["Total_Not_In_Gear"] = data_gear
		dict_info["Total_Not_In_Jamf"] = data_jamf

		console.log(dict_info)
		return dict_info
	});
}
/*
*  Generate dictionary by:
*	- user's name: user,name
	- handle: user,login
	- serial: serialNumber
*
*  Example 1: dictionary_search_for_serial_handle("JohnDoe")
*
*/
Strawberry.prototype.dictionary_by = function(option, option2){
	var dict = {};
	var items = [];
	var key = '';
	var i = 1;

	return this.computers().then((data) => {

		assets_arr = JSON.parse(data)
		data_arr = assets_arr["assets"]
		try {
			data_arr.forEach(item => {
				if (option2){
					key = item[option][option2]
				}else{
					key = item[option]
				}
				if (key in dict){
					items = dict[key]
					i = items[0]
					i += 1
					items[0] = i
					items.push(item)
					dict[key] = items
				}
				else {
					i = 1
					items[0] = i
					items.push(item)
					dict[key] = items
				}
				items = []
			})
		} catch (err) {
			console.log(err)
			dict["0"] = "not found"
		}
		return dict
	});
}

// Exports Strawberry object for module
module.exports = Strawberry
