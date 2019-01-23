var fs = require('fs');

/*
* 	Creating new Gear session by instantiating
* 	new Strawberry object for Gear from the
* 	gear_data_functions file
*/

const GEAR_SESSION = require('./gear_data_functions');
var session_gear = new GEAR_SESSION(token);

function M_Functions(){
  console.log("\n***M_Functions loaded.***")
}


/*
*  Function to generate CSV based on data passed
*/ 
M_Functions.prototype.generate_csv_for_smargroups = function(filename, data_to_generate){
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getYear();

	dir = "./csv"
	if (!fs.existsSync(dir)){
    	fs.mkdirSync(dir);
	}
	filename += "_smartgroup_csv_"+day+'_'+month+'_'+year+'_'+Math.random()
	var stream = fs.createWriteStream('./csv/'+filename+'.csv')

	console.log("CSV Generator working...")
	try {
		data_array = data_to_generate["computer_group"]["computers"]
	} catch (err){
		console.log(err)
		return "error"
	}
	console.log(data_array)
	filename += ".csv"
	stream.write("User"+','+"Serial Number"+'\n')
	data_array.forEach(item => {
		this.return_user(item["serial_number"]).then((data) => {
			console.log("Returning user..")	
			if (data == "not found"){
				data = item["name"]
				data += " (not found)" // means computer wasn't in gear but in jamf
			}
			stream.write(data+','+item["serial_number"]+'\n')
		});
	})
	console.log("Done.")
	return filename
}

/*
*  Function to generate CSV based on data passed -- fast
*/ 
M_Functions.prototype.generate_csv_for_smargroups_fast = function(filename, data_to_generate){
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getYear();

	dir = "./csv"
	if (!fs.existsSync(dir)){
    	fs.mkdirSync(dir);
	}
	filename += "_smartgroup_csv_"+day+'_'+month+'_'+year+'_'+Math.random()
	var stream = fs.createWriteStream('./csv/'+filename+'.csv')

	console.log("CSV Generator working...")
	try {
		data_array = data_to_generate["computer_group"]["computers"]
	} catch (err){
		console.log(err)
		return "error"
	}
	console.log(data_array)
	filename += ".csv"
	stream.write("User"+','+"Serial Number"+'\n')
	data_array.forEach(item => {
		stream.write(item["name"]+','+item["serial_number"]+'\n')
	})
	console.log("Done.")
	return filename
}

/*
*  Generic function to generate CSV based on data passed (dictionaries)
*/ 
M_Functions.prototype.generate_csv_all = function(filename, data_to_generate, rows){
	var arr_keys = Object.keys(data_to_generate)
	var key = ''
	
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getYear();

	dir = "./csv"
	if (!fs.existsSync(dir)){
    	fs.mkdirSync(dir);
	}

	filename += "_jamf_session_csv_"+day+'_'+month+'_'+year+'_'+Math.random()

	console.log(filename)
	var stream = fs.createWriteStream('./csv/'+filename+'.csv')

	console.log(rows)

	rows.forEach(item => {
		stream.write(item+',')
	})
	stream.write('\n')
	
	arr_keys.forEach(item => {
		stream.write(item+',')
		data_to_generate[item].forEach(item => {
			if (item["name"]){
				stream.write(item["name"]+','+item["serialNumber"])
			} else {
				stream.write(item+',')
			}
			stream.write(',')
		})
		stream.write('\n')
	})
	stream.end()
	return filename
}

/*
*  Generic function to generate CSV based on data passed (dictionaries)
*
*	[{key: [value]}, {key: [value]}]
*	(row): key,value	
*
*/ 
M_Functions.prototype.generate_csv = function(filename, data_to_generate, categories){
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getYear();

	dir = "./csv"
	if (!fs.existsSync(dir)){
    	fs.mkdirSync(dir);
	}

	if (typeof data_to_generate != "object"){
		console.log("not object")
		return 0
	}

	filename += "_jamf_session_csv_"+day+'_'+month+'_'+year+'_'+Math.random()
	var stream = fs.createWriteStream('./csv/'+filename+'.csv')
	try {

		dict_key_arr = Object.keys(data_to_generate)
		for (var k = 0; k < categories[1].length; k++){
			stream.write(categories[1][k])
			if (k < (categories[1].length - 1)){
				stream.write(',')
			}
		}
		stream.write('\n')

		var k = 0;
		for (i in data_to_generate){
			stream.write(dict_key_arr[k]+','+data_to_generate[i]+'\n')
			k+=1
		}
		stream.end()
		return filename+".csv"

	} catch (err){
		stream.end()
		console.log(err)
		return "error creating csv"
	}
}

/*
*  Function to return categories and keys for dictionary parser
*
*/ 
M_Functions.prototype.categories_for_dict = function(data){
	jsonArrayObs = Object.keys(data)
	console.log(jsonArrayObs)
	var matrix = []
	var categories = []

	for (i in jsonArrayObs){
		
		category = jsonArrayObs[i]
		size = Object.keys(data[jsonArrayObs[i]]).length
		key_size = keys_of_categories = Object.keys(data[jsonArrayObs[i]][0]).length
		keys_of_categories = Object.keys(data[jsonArrayObs[i]][0])
		categories.push(category)

	}
	matrix[0] = categories
	matrix[1] = keys_of_categories

	return matrix
}

/*
*  Function to turn json into a dictionary
*
* type: key,value -- key,values[]
*/ 
M_Functions.prototype.convert_to_json = function(data){
	jsonArrayObs = Object.keys(data)
	console.log(jsonArrayObs)
	var dict = {}

	for (i in jsonArrayObs){
		
		category = jsonArrayObs[i]
		size = Object.keys(data[jsonArrayObs[i]]).length
		key_size = keys_of_category = Object.keys(data[jsonArrayObs[i]][0]).length
		keys_of_category = Object.keys(data[jsonArrayObs[i]][0])
		
		for (j in data[jsonArrayObs[i]]){
			key = data[jsonArrayObs[i]][j][keys_of_category[0]]
			value = data[jsonArrayObs[i]][j][keys_of_category[1]]
			dict[key] = value
		}
	}
	return dict
}

/*
*  Function to identify users
*
*	Any duplicate entries are ignored
*/ 
M_Functions.prototype.identify_users = function(computers, dictionary_to_check){
	console.log("Finding user...")
	keys = Object.keys(dictionary_to_check)
	dict_users_serials = {}
	returned_dict = {}
	var never_found = 0
	var count = 0

	for (i in computers){
		for (j in keys){
			if (computers[i].toLowerCase() == dictionary_to_check[keys[j]]["name"].toLowerCase()){
				dict_users_serials[computers[i]] = dictionary_to_check[keys[j]]
				never_found = 1
			} 
		}
		if (!never_found){
			dict_users_serials[computers[i]] = computers[i]
		}
		never_found = 0
	}
	keys_ver = Object.keys(dict_users_serials)
	return session_gear.dictionary_by("serialNumber").then((data)=>{
		for (k in keys_ver){
			try {
				returned_dict[keys_ver[k]] = data[dict_users_serials[keys_ver[k]].data[1]][1]["user"]["login"]
			} catch (err){
				returned_dict[keys_ver[k]] = "not found in Gear"
			}
		}
		console.log("dictionary returned")
		console.log(returned_dict)
		return returned_dict
	})

}

/*
*  Function to return username when serial is passed
*/ 
M_Functions.prototype.find_user = function(username, dictionary){
	console.log("Finding user...")
	try {
		obj = dictionary[username]
	} catch (err){
		console.log(err)
		obj = "not found"
	}
	return obj
}

/*
*  Function to return serial number when username is passed
*/ 
M_Functions.prototype.find_serial = function(serial_number, dictionary){
	console.log("Finding serial...")
	try {
		obj = dictionary[serial_number][1]
	} catch (err){
		console.log(err)
		obj = "not found"
	}
	return obj
}

/*
*  Function to return handle when serial is passed
*/ 
M_Functions.prototype.return_handle = function(serial_number){
	console.log("Finding user...")
	
	return session_gear.dictionary_by("serialNumber").then((data) => {
		console.log(data[serial_number])
		try {
			handle = data[serial_number][1]["user"]["login"]
		} catch (err){
			console.log(err)
			handle = "not found"
		}
		return handle
	})
}

/*
*  Function to return handle when serial is passed
*/ 
M_Functions.prototype.return_handle_dict = function(data_sent, serial_number){
	console.log("Finding user...")
	
	return session_gear.dictionary_by("serialNumber").then((data) => {
		return data
	})
}

/*
*  Function to return username when serial is passed
*/ 
M_Functions.prototype.return_user = function(serial_number){
	console.log("Finding user...")
	
	return session_gear.dictionary_by("serialNumber").then((data) => {
		console.log(data)
		try {
			username = data[serial_number][1]["user"]["name"]
			if (username == null){
				username = data[serial_number][1]["user"]["handle"]
			}
		} catch (err){
			console.log(err)
			username = "not found"
		}
		return username
	})
}

/*
*  Function to return item when serial is passed
*/ 
M_Functions.prototype.return_item = function(serial_number){
	console.log("Finding user...")
	
	return session_gear.dictionary_by("serialNumber").then((data) => {
		try{
			item = data[serial_number][1]["name"]
		} catch (err){
			console.log(err)
			item = "not found"
		}
		return item
	})
}

/*
*  Function to return item when serial is passed
*/ 
M_Functions.prototype.generate_all_dictionary = function(jamf_dict){
	console.log("Finding user...")
	
	return session_gear.dictionary_by("serialNumber").then((data) => {
		jamf_dict["gear_data_by_serial"] = data
		return session_gear.dictionary_by("user","login").then((data)=>{
			jamf_dict["gear_data_by_handle"] = data
			return session_gear.dictionary_by("user","name").then((data)=>{
				jamf_dict["gear_data_by_name"] = data
				return jamf_dict
			})
		})
	})
}

module.exports = M_Functions