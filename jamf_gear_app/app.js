/*
*	Main app file
*/

/* Adding modules to file */
var express = require('express');

var app = express();
require('dotenv').config()
const rp = require('request-promise')
const json2csv = require('json2csv').parse;
const cors = require('cors')
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')

const getRoutes = require('get-routes');
var fs = require('fs');

app.use(cors())

/* Increase size parseable by csv */
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb'
}));

/* Processing .env keys and storing them for later usage */
token = process.env.TOKEN
username = process.env.APIUSERNAME,
password = process.env.APIPASSWORD
jamf_session_user = process.env.JAMF_SESSION_USER,
jamf_session_password = process.env.JAMF_SESSION_PASSWORD
email_username = process.env.EMAIL_USERNAME,
email_password = process.env.EMAIL_PASSWORD


app.use(bodyParser.json());

/*
* 	Provides basic auth for app + a prompt for user/password in browsers
*/
app.use(basicAuth({
	authorizer: myAuthorizer,
	challenge: true
}))

/*
* 	Checks credentials for basic auth
*/
function myAuthorizer(username, password) {
    return username.match(jamf_session_user) && password.match(jamf_session_password)
}

/*
* 	Creating new Jamf session by instantiating
* 	new Strawberry object for Jamf from the
* 	jamf_data_functions file
*/
const JAMF_SESSION = require('./jamf_data_functions');
var session_jamf = new JAMF_SESSION(username, password);

/*
* 	Creating new Gear session by instantiating
* 	new Strawberry object for Gear from the
* 	gear_data_functions file
*/
const GEAR_SESSION = require('./gear_data_functions');
var session_gear = new GEAR_SESSION(token);

/*
* 	Creating new Jamf session by instantiating
* 	new Strawberry object for Jamf from the
* 	jamf_dashboard file
*/
const JAMF_DASH = require('./jamf_dashboard');
var jamf_dash = new JAMF_DASH(username, password);

/*
* 	Getting functions from misc_fuctions.js
*/
const MISC_FUNCTIONS = require('./misc_functions');
var m_functions = new MISC_FUNCTIONS();


/* Home Page for app -- Jamf dashboard */
app.get('/', function (req, res) {
  	res.send('Hello Travis... :P (Jamf Dashboard goes here).');
});

/* Get all Jamf users */
app.get('/jamf_users', function (req, res) {
  	session_jamf.users().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});

/* Get all Jamf computers */
app.get('/jamf_computers', function (req, res) {
	session_jamf.computers().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});

/* Get all jamf extension attributes */
app.get('/jamf_extension_attributes', function (req, res) {
	session_jamf.extension_attributes().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});

/* Get all jamf policies */
app.get('/jamf_policies', function (req, res) {
  	session_jamf.policies().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});

/* Get all jamf scripts */
app.get('/jamf_scripts', function (req, res) {
  	session_jamf.scripts().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});

/* Get all jamf packages */
app.get('/jamf_packages', function (req, res) {
  	session_jamf.packages().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});

/* Get all jamf computergroups */
app.get('/jamf_computergroups', function (req, res) {
  	session_jamf.get_computergroups().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});


/* Gets all Gear computer data */
app.get('/gear_computers', function (req, res){
	session_gear.computers().then((data) => {
		console.log(data)
		if (data){
			res.send(data);
		} else {
			res.send("not found")
		}
	});
});

/*
* 	Generate unordered list for array
*
* 	Return value: arr
*/
function ulArr(arrVal){

 	var arr = []

 	var keys = Object.keys(arr)

 	for (var i = 0; i < arrVal.length; i++){
 		arr.push(arrVal[i]["name"])
 	}
 	return arr

}

/*
* 	Generate unordered list for arb array matrici
*
* 	Return value: String of HTML
*/
function ulArrArbitrary(arrVal){
 	var arr = []
 	var dict = {}
 	for(var key in arrVal) {
    	var value = arrVal[key];
    	dict[key] = value
    	arr.push(dict)
    	dict = {}
	}
 	return arr

}

/*
* 	Generate unordered list for nested array matrici version1
*
* 	Return value: String of HTML
*/
function ulArrArbitraryHTML(arrVal, name){
 	s = ''
 	for (var i = 0; i < arrVal.length; i++){
 		var type = arrVal[i]
 		var keys = Object.keys(arrVal[i])
 		for (var x = 0; x < keys.length; x++){
 			s += '<li>'+keys[x]+': <b>'+type[keys[x]]+'</b></li>'
 		}
 	}
 	return '<p>'+name+':</p>'+'<ul>'+s+'</ul>'
}

/*
* 	Generate unordered list for nested array matrici version2
*
* 	Return value: String of HTML
*/
function ulArrArbitraryHTML2(arrVal, name, val){
 	s = ''
 	for (var i = 0; i < arrVal.length; i++){
 		var type = arrVal[i]
 		var keys = Object.keys(arrVal[i])
 		for (var x = 0; x < keys.length; x++){
 			if (keys[x] == "mapped_printers"){
 				for (k in keys[x]){
 					console.log(keys[x][k])
 					// s += '<li>'+keys[x]+': <b>'+type[keys[x]][k][val]+'</b></li>'
 				}
 			} else{
 				s += '<li>'+keys[x]+': <b>'+type[keys[x]]+'</b></li>'
 			}
 		}
 	}
 	return '<p>'+name+':</p>'+'<ul>'+s+'</ul>'
}

/*
* 	Generate drow down list for nested array matrici version1
*
* 	Return value: String of HTML
*/
function dbArrArbitraryHTML(arrVal, name){
 	s = ''
 	for (var i = 0; i < arrVal.length; i++){
 		var type = arrVal[i]
 		var keys = Object.keys(arrVal[i])
 		for (var x = 0; x < keys.length; x++){
 			s += '<option>'+keys[x]+': <b>'+type[keys[x]]+'</b></option>'
 		}
 	}
 	return '<li>'+name+':'+'<select>'+s+'</select></li>'
}

/*
* 	Generate drow down list for nested array matrici version3
*
* 	Return value: String of HTML
*/
function dbArrArbitraryHTML3(arrVal, name){
 	s = ''
 	for (var i = 0; i < arrVal.length; i++){
 		var type = arrVal[i]
 		for (x in type){
 			s += '<option>disk: '+"<b>"+type[x].disk+'</b></option>'
 			s += '<option>model: '+"<b>"+type[x].model+'</b></option>'
 			s += '<option>revision: '+"<b>"+type[x].revision+'</b></option>'
 			s += '<option>serial_number: '+"<b>"+type[x].serial_number+'</b></option>'
 			s += '<option>size: '+"<b>"+type[x].size+'</b></option>'
 			s += '<option>drive_capacity_mb: '+"<b>"+type[x].drive_capacity_mb+'</b></option>'

 			s += '<option>=> Partition <=</option>'
 			s += '<option>  name: '+type[x].partition.name+'</option>'
 			s += '<option>  size: '+type[x].partition.size+'</option>'
 			s += '<option>  type: '+type[x].partition.type+'</option>'
 			s += '<option>  partition_capacity_mb: '+type[x].partition.partition_capacity_mb+'</option>'
 			s += '<option>  percentage_full: '+type[x].partition.percentage_full+'</option>'
 			s += '<option>  filevault_status: '+type[x].partition.filevault_status+'</option>'
 			s += '<option>  filevault_percent: '+type[x].partition.filevault_percent+'</option>'
 			s += '<option>  filevault2_status: '+type[x].partition.filevault2_status+'</option>'
 			s += '<option>  filevault2_percent: '+type[x].partition.filevault2_percent+'</option>'
 			s += '<option>  boot_drive_available_mb: '+type[x].partition.boot_drive_available_mb+'</option>'
 		}
 	}
 	return '<li>'+name+':'+'<select>'+s+'</select></li>'
}

/*
* 	Generate drow down list for nested array matrici version 2
*
* 	Return value: String of HTML
*/
function dbArrArbitraryHTML2(arrVal, name, val, val2){
 	s = ''
 	for (var i = 0; i < arrVal.length; i++){
 		var type = arrVal[i]
 		var keys = Object.keys(arrVal[i])
 		for (var x = 0; x < keys.length; x++){
 			s += '<option>'+keys[x]+': <b>'+type[keys[x]][val]+'</b>,<b> '+val2+': '+type[keys[x]][val2]+'</b></option>'
 		}
 	}
 	return '<li>'+name+':'+'<select>'+s+'</select></li>'
}

/*
* 	Generate unordered list for nested array matrici
*
* 	Return value: String of HTML
*/
function generateUL(ulArr){
	var builder = ''
	var s = ''
	for (var i = 0; i < ulArr.length; i++){
		s += '<li>'+ulArr[i]+'</li>'
	}
	return '<ul>'+s+'</ul>'
}

/*
* 	Parse Bash script so that it formats properly in HTML
*
* 	Return value: String of HTML
*/
function parseBash(string){
	var builder = ''
	var arr = []
	string +='\n'
	for (var i = 0; i < string.length; i++){
	  if (string[i] == '\n'){
	    arr.push(builder)
	    builder = ''
	  } else {
	    builder += string[i]
	  }
	}
	return arr
}

/*
* 	Covert arrays of data to HTML strings
*
* 	Return value: String of HTML
*/
function convertToHTML(bashScriptArr){
	var builder = ''
	var s = ''
	for (var i = 0; i < bashScriptArr.length; i++){
		s += '<p>'+bashScriptArr[i]+'</p>'
	}
	return s
}

/*
* 	Generate links for HTML to be returned in HTML strings for views
*
* 	Return value: String of HTML
*/
function genLink(scriptArr, url){
	var s = ''
	var urlString = ''
	for (var i = 0; i < scriptArr.length; i++){
		urlString += '"'+url+scriptArr[i]+'"'
		s += '<li><a href='+urlString+' target="_blank" >'+scriptArr[i]+'</a></li>'
		urlString = ''

	}
	return "<ul>"+s+"</ul>"
}
/*
* 	Returns formatted HTML for all computer related webhooks
*
* 	Return value: String of HTML
*/
function Computer_HTML(data){
	var name = '<h1>'+data["computer"]["general"]["name"]+'</h1>'
	var macAddress = '<p>Mac Address: <b>'+data["computer"]["general"]["mac_address"]+'</b></p>'
	var ipAddress = '<p>IP Address: <b>'+data["computer"]["general"]["ip_address"]+'</b></p>'
	var serialNumber = '<p>Serial Number: <b>'+data["computer"]["general"]["serial_number"]+'</b></p>'

	var arr = ulArrArbitrary(data["computer"]["general"]["remote_management"])
	var ulManagement = ulArrArbitraryHTML(arr, "Remove Management")

	var mdmCapable = '<p>MDM Capable: <b>'+data["computer"]["general"]["mdm_capable"]+'</b></p>'

	var arr = ulArrArbitrary(data["computer"]["general"]["mdm_capable_users"])
	var ulcapableUsers = ulArrArbitraryHTML(arr, "MDM Capable Users")

	var arr = ulArrArbitrary(data["computer"]["general"]["management_status"])
	var ulManagementStatus = ulArrArbitraryHTML(arr, "Management Status")

	var username = '<p>Username: <b>'+data["computer"]["location"]["username"]+'</b></p>'

	var HardwareTitle = '<p>'+"Hardware:"+'</p>'
	var ulHardware = "<ul>"
	for (i in data["computer"]["hardware"]){
		if (i == "mapped_printers"){
			var arr = ulArrArbitrary(data["computer"]["hardware"][i])
			ulHardware += dbArrArbitraryHTML2(arr, i, "name", "type")
		} else if (i == "storage"){
			var arr = ulArrArbitrary(data["computer"]["hardware"]["storage"])
			ulHardware += dbArrArbitraryHTML3(arr, "storage")
		} else {
			ulHardware += "<li>"+i+": "+"<b>"+data["computer"]["hardware"][i]+"</b></li>"
		}	
	}
	ulHardware += "</ul>"

	var arr = ulArrArbitrary(data["computer"]["groups_accounts"]["computer_group_memberships"])
	var ulPolicies = ulArrArbitraryHTML(arr, "Computer Memeberships")

	var CGTitle = '<p>'+"Scoped Computer Groups:"+'</p>'
	var ulCG = "<ul>"
	arr = ulArrArbitrary(data["computer"]["groups_accounts"]["computer_group_memberships"])
	ulCG += dbArrArbitraryHTML(arr, "Computer Group Memberships")
	ulCG += "</ul>"

	var EATitle = '<p>'+"Extension Attributes:"+'</p>'
	var ulEA = "<ul>"
	for (var i = 0; i < data["computer"]["extension_attributes"].length; i++)
	{
		arr = ulArrArbitrary(data["computer"]["extension_attributes"][i])
		ulEA += dbArrArbitraryHTML(arr, data["computer"]["extension_attributes"][i]["name"])
	}
	ulEA += "</ul>"

	var CertificatesTitle = '<p>'+"Certificates:"+'</p>'
	var ulCertificates = "<ul>"
	for (var i = 0; i < data["computer"]["certificates"].length; i++)
	{
		arr = ulArrArbitrary(data["computer"]["certificates"][i])
		ulCertificates += dbArrArbitraryHTML(arr, data["computer"]["certificates"][i]["common_name"])
	}
	ulCertificates += "</ul>"


	var SoftwareTitle = '<p>'+"Software:"+'</p>'
	var ulSoftware = "<ul>"
	for (i in data["computer"]["software"]){
		if (i == "applications" || i == "fonts" || i == "plugins"){
			var arr = ulArrArbitrary(data["computer"]["software"][i])
			ulSoftware += dbArrArbitraryHTML2(arr, i, "name", "version")
		} else {
			var arr = ulArrArbitrary(data["computer"]["software"][i])
			ulSoftware += dbArrArbitraryHTML(arr, i)
		}	
	}
	ulSoftware += "</ul>"

	var toSend = name+macAddress+ipAddress+serialNumber+ulManagement+mdmCapable+ulcapableUsers+ulManagementStatus+
		username+HardwareTitle+ulHardware+SoftwareTitle+ulSoftware+CGTitle+ulCG+EATitle+ulEA+CertificatesTitle+
		ulCertificates
	return toSend

}

/*
* 	Get specific Jamf computer by ID
*
* 	Example: http://localhost:3000/find_computer?q=1035
*/
app.route('/find_computer')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.find_computer(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = Computer_HTML(data)
				res.send(toSend)
			} else {
				var err = "<div>"+
				"<h1>Error❗️</h1><hr></hr><p>I'm afraid there was no item found for your search query. "+
				"It's likely the item you are looking for is not registered in JAMF.</p>"+
				"<hr></hr><p>Please consider adding the search item to JAMF if applicable.</p><p>---🙃---</p>"+
				"</div>"
				res.send(err)

			}
		});
	});

/*
* 	Get specific Jamf computer by hostname
*
* 	Example: http://localhost:3000/find_computer_name?q=jaba
*/
app.route('/find_computer_name')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.find_computer_name(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = Computer_HTML(data)
				res.send(toSend)
			} else {
				var err = "<div>"+
				"<h1>Error❗️</h1><hr></hr><p>I'm afraid there was no item found for your search query. "+
				"It's likely the item you are looking for is not registered in JAMF.</p>"+
				"<hr></hr><p>Please consider adding the search item to JAMF if applicable.</p><p>---🙃---</p>"+
				"</div>"
				res.send(err)
			}
		});
	});

  /*
* 	Get specific Jamf computer by Serial Number
*
* 	Example: http://localhost:3000/find_computer_sn?q=C02X567JJG5K
*/
app.route('/find_computer_sn')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.find_computer_sn(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = Computer_HTML(data)
				res.send(toSend)
			} else {
				var err = "<div>"+
				"<h1>Error❗️</h1><hr></hr><p>I'm afraid there was no item found for your search query. "+
				"It's likely the item you are looking for is not registered in JAMF.</p>"+
				"<hr></hr><p>Please consider adding the search item to JAMF if applicable.</p><p>---🙃---</p>"+
				"</div>"
				res.send(err)
			}
		});
	});


/*
* 	Get specific Jamf computergroup specific for Dashboard -> no formatted html needed
*/
app.route('/find_computergroup')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.find_computergroup(option, "Get").then((data) => {
			console.log(data)
			if (data){
				res.send(data);
			} else {
				res.send("not found")
			}
		});
	});

  /*
* 	Get specific Jamf computergroup
*
* 	Example: http://localhost:3000/jamf_computergroup_search?q=id
*
*/
app.route('/get_computergroup_dashboard')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_computergroup(option, "Get").then((data) => {
			console.log(data)
			if (data){
				res.send(data)
			} else {
				res.send("not found")
			}
		});
	});

/*
* 	Generate HTML to send for computer group view
*	Returns string of HTML to generate
*
*/
function ComputerGroupHTML(data){
	var name = '<h1>'+data["computer_group"]["name"]+'</h1>'
	var id = '<p>Id: <b>'+data["computer_group"]["id"]+'</b></p>'

	var CriteriaTitle = '<p>'+"Criteria:"+'</p>'
	var ulCriterial = "<ul>"
	for (var i = 0; i < data["computer_group"]["criteria"].length; i++)
	{
		arr = ulArrArbitrary(data["computer_group"]["criteria"][i])
		ulCriterial += dbArrArbitraryHTML(arr, data["computer_group"]["criteria"][i]["name"])
	}
	ulCriterial += "</ul>"

	var ComputersTitle = '<p>'+"Computers:"+'</p>'
	var ulComputers = "<ul>"
	for (var i = 0; i < data["computer_group"]["computers"].length; i++)
	{
		arr = ulArrArbitrary(data["computer_group"]["computers"][i])
		ulComputers += dbArrArbitraryHTML(arr, data["computer_group"]["computers"][i]["name"])
	}
	ulComputers += "</ul>"

	var toSend = name+id+CriteriaTitle+ulCriterial+ComputersTitle+ulComputers
	return toSend
}

/*
* 	Get specific Jamf computergroup
*
* 	Example: http://localhost:3000/jamf_computergroup_search?q=id
*
*/
app.route('/get_computergroup')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_computergroup(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = ComputerGroupHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});
	});

app.route('/get_computergroup_name')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.find_computergroup(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = ComputerGroupHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});
	});

/*
* 	Generate HTML to send for extension attrbute view
*	Returns string of HTML to generate
*
*/
function EAHTML(data){
	var name = '<h1>'+data["computer_extension_attribute"]["name"]+'</h1>'
	var data_type = '<p>Data type: <b>'+data["computer_extension_attribute"]["data_type"]+'</b></p>'
	var description = '<p>Description: '+data["computer_extension_attribute"]["description"]+'</p>'
	var type = '<p>type: <b>'+data["computer_extension_attribute"]["input_type"]["type"]+'</b></p>'
	var inventory_display = '<p>Inventory Display: <b>'+data["computer_extension_attribute"]["inventory_display"]+'</b></p>'
	var scriptContent = parseBash(data["computer_extension_attribute"]["input_type"]["script"])
	var scriptContentHTML = convertToHTML(scriptContent)
	var finishedScript = '<p>Script:</p><blockquote><pre>'+scriptContentHTML+'</pre></blockquote>'
    var toSend = name+data_type+description+type+inventory_display+finishedScript
    return toSend
}

/*
* 	Get specific Jamf extension attribute
*
* 	Example: http://localhost:3000/jamf_extension_attribute_search?q=Battery Health Status
*
*/
app.route('/get_extension_attribute')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_extension_attribute(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = EAHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});
	});
/* 
* 	Get specific Jamf extension attribute 
*
* 	Example: http://localhost:3000/jamf_extension_attribute_search?q=Battery Health Status
*
*/
app.route('/get_extension_attribute_name')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_extension_attribute_name(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = EAHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});	
	});

/*
* 	Generate HTML to send for Package view
*	Returns string of HTML to generate
*
*/
function PackageHTML(data){
	var name = '<h1>'+data["package"]["name"]+'</h1>'
	var filename = '<p>Filename: <b>'+data["package"]["filename"]+'</b></p>'
	var id = '<p>Id: <b>'+data["package"]["id"]+'</b></p>'
	var category = '<p>Category: <b>'+data["package"]["category"]+'</b></p>'
	var info = '<p>Info: <b>'+data["package"]["info"]+'</b></p>'
	var notes = '<p>Notes: <b>'+data["package"]["notes"]+'</b></p>'
	var priority = '<p>priority: <b>'+data["package"]["priority"]+'</b></p>'
	var reboot_required = '<p>reboot_required: <b>'+data["package"]["reboot_required"]+'</b></p>'
	var allow_uninstalled = '<p>allow_uninstalled: <b>'+data["package"]["allow_uninstalled"]+'</b></p>'
	var reinstall_option = '<p>reinstall_option: <b>'+data["package"]["reinstall_option"]+'</b></p>'
	var send_notification = '<p>send_notification: <b>'+data["package"]["send_notification"]+'</b></p>'

	var toSend = name+filename+id+category+info+notes+priority+reboot_required+allow_uninstalled+
		reinstall_option+send_notification
	return toSend
}

/* 
* 	Get specific Jamf package 
*
* 	Example: http://localhost:3000/jamf_package_search?q=1Password-7.0.7.pkg
*
*/
app.route('/get_package')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_package(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = PackageHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});
	});

/* 
* 	Get specific Jamf package 
*
* 	Example: http://localhost:3000/jamf_package_search?q=1Password-7.0.7.pkg
*
*/
app.route('/get_package_name')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_package_name(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = PackageHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});	
	});

/*
* 	Generate HTML to send for Policies view
*	Returns string of HTML to generate
*
*/
function PolicyHTML(data){
	var name = '<h1>'+data["policy"]["general"]["name"]+'</h1>'
	var trigger = '<p>Trigger: <b>'+data["policy"]["general"]["trigger"]+'</b></p>'
	var freq = '<p>Frequency: <b>'+data["policy"]["general"]["frequency"]+'</b></p>'
	var enabled = '<p>Enabled: <b>'+data["policy"]["general"]["enabled"]+'</b></p>'
	var scope1 = '<p>Scope, All computers: <b>'+data["policy"]["scope"]["all_computers"]+'</b></p>'
	var scope4 = '<p>Limitations, users: <b>'+data["policy"]["scope"]["limitations"]["users"]+'</b></p>'
	var scope41 = '<p>Limitations, user groups: <b>'+data["policy"]["scope"]["limitations"]["user_groups"]+'</b></p>'
	var scope5 = '<p>Exclusions: <b>'+data["policy"]["scope"]["exclusions"]+'</b></p>'
	var selfService = '<p>Self Service: <b>'+data["policy"]["self_service"]["use_for_self_service"]+'</b></p>'


	var arr = ulArr(data["policy"]["scope"]["computers"])
	var ulComputers = genLink(arr, "http://localhost:3000/find_computer_name?q=")
	ulComputers = '<p>Scope, computers:</p>'+ulComputers

	arr = ulArr(data["policy"]["scope"]["computer_groups"])
	var ulGroups = genLink(arr, "http://localhost:3000/get_computergroup_name?q=")
	ulGroups = '<p>Scope, computer groups:</p>'+ulGroups

	arr = ulArr(data["policy"]["scope"]["limitations"]["users"])
	var ulLimitUsers = generateUL(arr)
	ulLimitUsers = '<p>Limited, users:</p>'+ulLimitUsers

	arr = ulArr(data["policy"]["scope"]["limitations"]["user_groups"])
	var ulLimitGroups = genLink(arr, "http://localhost:3000/get_computergroup_name?q=")
	ulLimitGroups = '<p>Limited, groups:</p>'+ulLimitGroups

	arr = ulArr(data["policy"]["scope"]["exclusions"]["computers"])
	var ulExcludedComputers = genLink(arr, "http://localhost:3000/find_computer_name?q=")
	ulExcludedComputers = '<p>Excluded, computers:</p>'+ulExcludedComputers

	arr = ulArr(data["policy"]["scope"]["exclusions"]["computer_groups"])
	var ulExcludedGroups = genLink(arr, "http://localhost:3000/get_computergroup_name?q=")
	ulExcludedGroups = '<p>Excluded, groups:</p>'+ulExcludedGroups

	arr = ulArr(data["policy"]["package_configuration"]["packages"])
	var ulPack = genLink(arr, "http://localhost:3000/get_package_name?q=")
	ulPack = '<p>Packages:</p>'+ulPack

	arr = ulArr(data["policy"]["scripts"])
	var ulScripts = genLink(arr, "http://localhost:3000/get_script_name?q=")
	console.log(ulScripts)
	ulScripts = '<p>Scripts:</p>'+ulScripts


	var toSend = name+enabled+trigger+freq+scope1+ulComputers+ulGroups+ulLimitUsers+ulLimitGroups+
		ulExcludedComputers+ulExcludedGroups+selfService+ulPack+ulScripts
	return toSend
}
/*
* 	Get specific Jamf policy
*
* 	Example: http://localhost:3000/get_policy?q=Install Slack
*
*/
app.route('/get_policy')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_policy(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = PolicyHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});
	});

/*
* 	Generate HTML to send for Script view
*	Returns string of HTML to generate
*
*/
function ScriptHTML(data){
	var name = '<h1>'+data["script"]["name"]+'</h1>'
	var filename = '<p>Filename: <b>'+data["script"]["filename"]+'</b></p>'
	var category = '<p>Category: <b>'+data["script"]["category"]+'</b></p>'
	var scriptContent = parseBash(data["script"]["script_contents"])
	var scriptContentHTML = convertToHTML(scriptContent)
	var finishedScript = '<p>Script:</p><blockquote><pre>'+scriptContentHTML+'</pre></blockquote>'
    var toSend = name+filename+category+finishedScript
    return toSend
}

/*
* 	Get specific Jamf script by id
*
* 	Example: http://localhost:3000/get_script?q=14
*
*/
app.route('/get_script')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_script(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = ScriptHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});
	});

 /*
* 	Get specific Jamf script by name
*
* 	Example: http://localhost:3000/get_script_name?q=Install Slack
*
*/
app.route('/get_script_name')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		session_jamf.get_script_name(option, "Get").then((data) => {
			console.log(data)
			if (data){
				var toSend = ScriptHTML(data)
				res.send(toSend)
			} else {
				res.send("not found")
			}
		});
	});

/*
* 	Find user by serial number (ideal if name in gear is null)
*
* 	Example: http://localhost:3000/find_user?q=C02X547JJG5K
*
*/
app.route('/find_user')
  .get((req,res) => {
  	let send_dictionary = ""
  	let handle = ""
	let option = encodeURIComponent(req.query.q.trim())

	session_gear.dictionary_by("serialNumber").then((data) => {
		option = option.replace('%20',' ');
		console.log(option);
		send_dictionary = m_functions.find_serial(option, data)
		try {
				handle = send_dictionary["user"]["login"]
				name = send_dictionary["user"]["name"]
				both = name + "," + handle
				console.log(both)
				res.send(both)
		}
		catch (err){
			console.log(err)
			res.send("not found")
		}
	});
});


/*
* 	Display Gear dictionary sorted by handle
*
* 	Example: http://localhost:3000/get_dictionary_by_handle
*
*/
app.route('/get_dictionary_by_handle')
  .get((req,res) => {
	session_gear.dictionary_by("user","login").then((data) => {
		console.log(data)
		res.send(data)
	});
});

/*
* 	Display Gear dictionary sorted by user's name
*
* 	Example: http://localhost:3000/get_dictionary_by_name
*
*/
app.route('/get_dictionary_by_user')
  .get((req,res) => {
	session_gear.dictionary_by("user","name").then((data) => {
		console.log(data)
		res.send(data)
	});
});

/*
* 	Display Gear dictionary sorted by serial
*
* 	Example: http://localhost:3000/get_dictionary_by_serial
*
*/
app.route('/get_dictionary_by_serial')
  .get((req,res) => {
  	session_gear.dictionary_by("serialNumber").then((data) => {
		console.log(data)
		res.send(data)
	});
});

/*
* 	Display Jamf dictionary sorted by hostname
*
* 	Example: http://localhost:3000/get_dictionary_by_hostname_jamf
*
*/
app.route('/get_dictionary_by_hostname_jamf')
  .get((req,res) => {
  	session_jamf.jamf_dictionary_hostname().then((data) => {
		console.log(data)
		res.send(data)
	});
});

function searchForHostname(searchString,data){
	var keys = Object.keys(data)
	var arr = []
	for (var i = 0; i < keys.length; i++){
		if (searchString.toLowerCase() == keys[i].toLowerCase()){
			arr[0] = keys[i]
			arr[1] = data[keys[i]]
		} 
	}
	return arr
}
/*
* 	Return user's handle by searching with serial number
*
* 	Example: http://localhost:3000/find_handle
*
*/
app.route('/find_handle')
  .get((req,res) => {
  	let option = encodeURIComponent(req.query.q.trim())
	m_functions.return_handle(option).then((data) => {
		console.log(data)
		res.send(data)
	});
});

/*
* 	Return item by searching with serial number
*
* 	Example: http://localhost:3000/find_items_name
*
*/
app.route('/find_items_name')
  .get((req,res) => {
  	let option = encodeURIComponent(req.query.q.trim())
	m_functions.return_item(option).then((data) => {
		console.log(data)
		res.send(data)
	});
});

/*
* 	Find serials by user's name
*
* 	Example: http://localhost:3000/find_serials_username?q=Travis%20Kopp
*
*/
app.route('/find_serials_by_user')
  .get((req,res) => {
  	let send_dictionary = ""
	let option = encodeURIComponent(req.query.q.trim())
	option = option.replace('%20',' ');
	session_gear.dictionary_search_for_serial_username(option).then((data) => {
		console.log(data)
		res.send(data)
	});
});

/*
* 	Find serials by handle
*
* 	Example: http://localhost:3000/find_serials_handle?q=teakopp
*
*/
app.route('/find_serials_by_handle')
  .get((req,res) => {
  	let send_dictionary = ""
	let option = encodeURIComponent(req.query.q.trim())
	option = option.replace('%20',' ');
	session_gear.dictionary_search_for_serial_handle(option).then((data) => {
		console.log(data)
		res.send(data)
	});
});


/*
* 	Find user gear object by user's name
*
* 	Example: http://localhost:3000/find_user_gear_object?q=Travis Kopp
*
*/
app.route('/find_gear_object_by_user')
  .get((req,res) => {
  	let send_dictionary = ""
	let option = encodeURIComponent(req.query.q.trim())

	session_gear.dictionary_by("user","name").then((data) => {
		option = option.replace('%20',' ');
		console.log(option);
		send_dictionary = m_functions.find_user(option, data)
		console.log(send_dictionary)
		if (send_dictionary){
			res.send(send_dictionary)
		} else {
			console.log("not found, consider searching by user's name")
			res.send("not found, consider searching by user's name")
		}

	});
});

/*
* 	Find user gear object by user handle
*
* 	Example: http://localhost:3000/find_gear_object_by_handle?q=coolkid
*
*/
app.route('/find_gear_object_by_handle')
  .get((req,res) => {
  	let send_dictionary = ""
	let option = encodeURIComponent(req.query.q.trim())

	session_gear.dictionary_by("user","login").then((data) => {
		console.log(option);
		send_dictionary = m_functions.find_user(option, data)
		console.log(send_dictionary)
		if (send_dictionary){
			res.send(send_dictionary)
		} else {
			console.log("not found, consider searching by handle")
			res.send("not found, consider searching by handle")
		}
	});
});
/*
* 	Dashboard generated webhook for http://localhost:3001/#groups
*
* 	Example: http://localhost:3001/#groups
*
*/
app.get('/dashboard', function (req, res){
	return jamf_dash.dashboard().then((data) => {
		if (data){
			var groups = data["computer_groups"]
			var arr = []
			for (var i = 0; i < groups.length; i++){
				arr.push(groups[i]["id"])
			}
			res.send(arr)
			return arr
		} else {
			res.send("not found")
		}
	});
});

/*
* 	Generate CSV for smartgroup => to aggregate Jamf + Gear handles
*
* 	Example: http://localhost:3000/generate_smartgroup_csv?q=it
*
*/
app.route('/generate_smartgroup_csv')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		try {
			session_jamf.find_computergroup(option, "Get").then((data) => {
				console.log(data)
				if (data){
					filename = m_functions.generate_csv_for_smargroups(option, data)
				}else{
					data = "error"
				}
				res.send(filename)
				console.log(filename)
			});
		} catch (err){
			console.log(err)
			res.send("error, couldn't generate")
		}
	});

/*
* 	Generate CSV for smartgroup fast => specific use for Dashboard
*
* 	Example: http://localhost:3000/generate_smartgroup_csv_fast?q=it
*
*/
app.route('/generate_smartgroup_csv_fast')
  .get((req,res) => {

	let option = encodeURIComponent(req.query.q.trim())
	console.log(req.query.q);
		try {
			session_jamf.find_computergroup(option, "Get").then((data) => {
				console.log(data)
				if (data){
					filename = m_functions.generate_csv_for_smargroups_fast(option, data)
				}else{
					data = "error"
				}
				res.send(filename)
				console.log(filename)
			});
		} catch (err){
			console.log(err)
			res.send("error, couldn't generate")
		}
	});

/*
* 	Generate CSV
*
*	Options:
*		- pass "user" to generate csv by user's name
*		- pass "handle" to generate csv by handle
*
*	Example 1: http://localhost:3000/generate_csv?q=user
*	Example 2: http://localhost:3000/generate_csv?q=handle
*
*	Note: The field for `null` could be because the user's name is not in Gear
*/
app.route('/generate_csv_all')
  .get((req,res) => {
  	let option = encodeURIComponent(req.query.q.trim())
	option = option.replace('%20',' ');
	let type = ""
	let filename = ""

	if (option == "handle")
	{
		filename = "gear_handles"
		type = "login"
	} else if(option == "user"){
		filename = "gear_users"
		type = "name"
	} else {
		res.send("error, choose either 'user' or 'handle' to generate csv by")
		console.log("error, choose either 'user' or 'handle' to generate csv by")
		return null
	}

	columns = ["GitHub Handle", "Number of items", "", "Item", "Item SN"]
		try {
			session_gear.dictionary_by("user",type).then((data) => {
				console.log(data)
				if (data){
					filename = m_functions.generate_csv_all(filename, data, columns)
				}else{
					data = "error"
				}
				res.send(filename+".csv")
			});
		} catch (err){
			console.log(err)
			res.send("error, couldn't generate")
		}
	});

/*
* 	Post request to receive dictionary for csv generation
*
* 	Example: http://localhost:3000/generate_csv?q=blah
*
*	Returns the filename of the csv
*
*/
app.post('/generate_csv', function (req, res) {
	data = encodeURIComponent(req.query.q.trim())

	categories = m_functions.categories_for_dict(req.body)
	dict = m_functions.convert_to_json(req.body)

	var ret = m_functions.generate_csv(data,dict,categories)
	if (!ret){
		ret = "Error creating CSV"
	}
	res.send(ret)
})

/*
*
*	Compare Jamf and Gear:
*/
app.get('/compare', function (req, res) {
	session_jamf.jamf_dictionary_serial().then((jamf_dic) =>{
		session_gear.dictionary_search_by_serial_compare(jamf_dic, "info").then((data) => {
			res.send(data)
		})
	})
})

/*
*	Creates a csv which comapres Jamf and Gear data disparities
*
*	** to download the file, use the
*	filename generated and the download webhook below
*
*/
app.get('/compare/csv', function (req, res) {
	option = encodeURIComponent(req.query.q.trim())
	session_jamf.jamf_dictionary_serial().then((jamf_dic) =>{
		session_gear.dictionary_search_by_serial_compare(jamf_dic, option).then((data) => {
			keys = Object.keys(data)
			filename = m_functions.generate_csv(keys[0], data, [[], ["hostname","serialNumber"]])
			res.send(filename)
			console.log(filename)
		})
	})
})

/*
* 	Download generated csv
*
* 	Example: http://localhost:3000/download?q=file.csv
*
*/
app.get("/download_csv", function (req, res) {
    filename = encodeURIComponent(req.query.q.trim())
    res.download("./csv/"+filename);
});

app.delete("/delete/csv", function (req, res) {
    filename = encodeURIComponent(req.query.q.trim())

    const fs = require('fs')

	const path = "./csv/"+filename

	try {
	  fs.unlinkSync(path)
	  console.log("file deleted.")
	  res.send(path + " deleted.");
	} catch(err) {
	  console.error(err)
	  res.send("file doesn't exist in current directory "+path+" or there was an error. => refer to server console")
	}
});

/* 
* 	Get all routes  for routes.html reference
*	http://localhost:3000/routes_info 
*/
app.get("/routes", function(req, res){
	const routes = getRoutes(app);
	var stream = fs.createWriteStream('./csv/'+"routes"+'.csv')
	for (i in routes){
		stream.write(i+','+',')
	}
	stream.write('\n')
	for (j in routes){
		if (j == "get"){
			for (k in routes[j]){
				stream.write(routes[j][k]+'\n')
			}
			stream.write(','+',')
		}
		if (j == "post"){
			for (k in routes[j]){
				stream.write(routes[j][k]+'\n')
			}
			stream.write(','+',')
		}
	}
	res.send(routes)
	stream.close()
})

/*
* 	Post request to identify computer data
*
* 	Example: http://localhost:3000/identify?q=computers_not_checked_zoom
*
*	Body data is raw Text
*
*	Returns files name
*
*/
app.use(bodyParser.text());
app.post('/identify', function (req, res) {

	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getYear();

	filename = encodeURIComponent(req.query.q.trim())+day+'_'+month+'_'+year+'_'+Math.random()
	parse = req.body
	tmp = ''
	arr_of_values = []
	parse += '\n'

	for (var i = 0; i < parse.length; i++){
		if (parse[i] == '\n'){
			arr_of_values.push(tmp)
			tmp = ''
		} else {
			tmp += parse[i]
		}
	}
	console.log(arr_of_values.length)

	session_jamf.jamf_dictionary_hostname().then((jamf_dict) =>{
		m_functions.identify_users(arr_of_values, jamf_dict).then((data)=>{
			dir = "./csv"
			if (!fs.existsSync(dir)){
		    	fs.mkdirSync(dir);
			}
			var stream = fs.createWriteStream('./csv/'+filename+'.csv')
			stream.write("hostname"+','+"user's handle"+'\n')
			keys = Object.keys(data)
			console.log("size "+keys.length)
			for (i in keys){
				if (data[keys[i]]["login"]){
					stream.write(keys[i]+','+data[keys[i]]["login"]+'\n')
				} else {
					stream.write(keys[i]+','+data[keys[i]]+'\n')
				}
			}
			stream.end()
			console.log(filename+'.csv')
			res.send(filename+'.csv')
		})
	})
})


/*
* 	Create all data endpoint
* 	
* 	Aggregates all data from Jamf and Gear and returns a single dictionary
*/
app.get("/all_data", function (req, res) {
	session_jamf.jamf_dictionary_aggregate().then((data)=>{
		m_functions.generate_all_dictionary(data).then((data)=>{
			var all_dict_data = data
			m_functions.return_handle_dict().then((data) => {
				var keys_gear = Object.keys(data)
				var gear_data = data
				session_jamf.jamf_dictionary_hostname().then((data) => {
					jamf_dict_data = data
					var send_all_data = {}
					for (var i = 0; i < keys_gear.length; i++){
						for (var x = 0; x < jamf_dict_data.length; x++)
						{
							try {
								if (keys_gear[i].toLowerCase() == jamf_dict_data[x]["data"][1].toLowerCase()){
									jamf_dict_data[x]["data"].push(gear_data[keys_gear[i]][1]["user"]["login"])
								}
							} catch (err){
								console.log("err")
							}
						}
						send_all_data = jamf_dict_data
					}
					all_dict_data["jamf_computers"] = send_all_data
					var keys = Object.keys(all_dict_data)
					console.log(keys)
					console.log("Done loading data.")
					res.send(all_dict_data)
					return all_dict_data
				});	
			});	
			
		})
	})

});

/*
* 	A post request that accepts space delimited values which are used to send an email:
*	Format:
*	handle 	 email 				 serial number
*
*	aharshbe aharshbe@github.com C02X547JJG5K
*	sukoonmusic sukoonmusic@github.com C02XD46DJGH6
*
*	Can be 1 or multiple values
*
*	Body data is raw Text
* 	Returns a message on success or not
*/
app.post("/emailer", function (req, res) {
	parse = req.body
	parse += '\n'
	string = ""
	emails = []
	for (i in parse){
		if(parse[i]=='\n'){
			emails.push(string)
			string = ""
		} else {
			string += parse[i]
		}
	}
	var to_send = []
	var arr = []
	var tmp = ""
	var counter = 0
	
	for (var i = 0; i < emails.length; i++){
		emails[i] += " "
		for (var x = 0; x < emails[i].length; x++){
			if (emails[i][x] == " "){
				arr.push(tmp)
				tmp = ""
			} else {
				tmp += emails[i][x]
			}
		}
		counter += 1
		if (counter == 1){
			to_send.push(arr)
			arr = []
			counter = 0
		}
	}
	for (var k = 0; k < to_send.length; k++){
		send_email(to_send[k][0],to_send[k][1],to_send[k][2])
	}

	function send_email(handle, email, serial){
		var nodemailer = require('nodemailer');
		var user_to_use = email_username
		var password_to_use = email_password
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: user_to_use,
		    pass: password_to_use
		  }
		});
		function html(handle, email, serial){
			var path = require('path');
			return (
				'<div>'+
					'<h1><img src="http://www.stickpng.com/assets/images/5847f98fcef1014c0b5e48c0.png" alt="Logo not avaible" width="75" height="75"> Help us help you.</h1><hr></hr><p>Greetings <b>'+handle+'</b>! 👋</p>'+
					'<p>Our system indicates that your computer (<b>'+serial+'</b>) is registered to you in Gear but not added in JAMF (our endpoint management system). If you have a computer that is not an Apple product or was purchased through the <a href="https://githubber.com/article/office/gear/gifting-gear" target="_blank">GitHub gifting program</a>, please reply to this email with <b>NA</b> and disregard. Otherwise, follow the steps below to get your computer enrolled and secured. GitHub IT thanks you!</p>'+
					'<p>Please click <a href="https://github.com/github/jamf/raw/master/deployment/quick_add_signed_v2-2.0.pkg">here</a> to install JAMF via a quick add package on the machine with the serial number (<b>'+serial+'</b>), it will take <b>less than 5 minutes</b>. Once you have done so, please follow the instructions below.</p>'+
					'<p><i>If you are confused or need help, you can reply to this email. An IT team member will then reach out to provide assistance.</i></p>'+

					'<h3>Instructions to install the JAMF MDM:</h3>'+
					'<ol>'+
					  '<li>Open <b>System Preferences</b></li>'+
					  '<li>Click on the <b>Profiles</b> button</li>'+
					  '<li>Under <b>User Profiles</b> on the left, you should see an <b>MDM Profile</b> listed.</li>'+
					  '<li>On the right side of the frame, there should be an <b>Approve</b> button. Click that, and you are done!</li>'+
					'</ol> '+
					'<ul><li>Fancy an instructional GIF? 😏 (It may take a few seconds to load): </li><p><img src="cid:mdm@github.gif.ee" alt="Gif not avaible" width="620" height="350"></p></ul>'+
					'<hr></hr>'+
					'<h3>⁉️ What is JAMF and why is it necessary?</h3>'+
					'<p>JAMF is a tool used by GitHub IT which allows us to keep your computer up to date and secure. For more information on JAMF and how it is used at GitHub, please view the <a href="https://github.com/github/jamf" target="_blank">JAMF repo.</a> Please feel free reach out to IT either in #it-helpdesk or by replying to this email!</p>'+
					'<hr></hr>'+
					'<p>Sincerely, <p>Your friends at <b><i>GitHub IT</i></b></p></p>'+
				'</div>'
				)
		}

		var mailOptions = {
		  from: user_to_use,
		  to: email,
		  subject: 'Hey! Enroll ('+serial+') in Jamf, please 💖 GitHub IT',
		  html: html(handle, email, serial),
	    attachments: [{
	        filename: 'helpful.gif',
	        path: 'assets/mdm.gif',
	        cid: 'mdm@github.gif.ee'
	    }]};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		    res.send("There was a problem sending the email")
		  } else {
		    console.log('Email sent to '+email+': ' + info.response);
		  }
		});
	}
	res.send("All emails sent.") 
});

/*
* 	Geberates a dictionary of all Jamf data:
*	- Scripts
*	- Computer extension attributes
*	- Policies
*	- Computer groups
*	- Packages
*/
app.get("/jamf_all", function (req, res) {
    session_jamf.jamf_dictionary_aggregate().then((data)=>{
    	res.send(data)
    })

});


/*
* 	Info - for now to routes glossary
*/
app.get("/routes_info", function (req, res) {
    res.sendFile(__dirname+'/routes.html')
});


// Hosted server port
app.listen(3000, function () {
  console.log('\n***Jamf Session running on port 3000.***');
});
