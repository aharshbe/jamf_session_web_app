/* 
*   File for aggregating data from Jamf API
*   using HTTP requests
*/

// Adding modules to file
require('dotenv').config();
const rp = require('request-promise')

// Processing tokens from .env and storing in a variable
username = process.env.APIUSERNAME,
password = process.env.APIPASSWORD

/*
* Createing a class for Strawberry object, each Strawberry will be a user
* 
*  Example 1:
*
*  var new_straweberry = new Strawberry();
*  new_straweberry.make_request("https://github.jamfcloud.com/JSSResource/computers")
*
*  Exmaple 2:
*
*  var new_straweberry = new Strawberry();
*  new_straweberry.find_computer("C02X547JJG5K")
*
*/
function Strawberry(username, password){
  this.username = username
  this.password = password
  console.log("\n***Connection to GitHub Jamf/JSS established.***")
}

/*
*  Abstract to allow HTTP requests, example usage:
*
*  Example 1: make_request("https://github.jamfcloud.com/JSSResource/computers")
*  Example 2: make_request("https://github.jamfcloud.com/JSSResource/computers/match/", "C02X547JJG5K")
*
*/ 
Strawberry.prototype.make_request = function(request_string, parm, method){
  if (parm)
  {
    request_string = request_string+parm
  }
    const options = {
    url: request_string,
    method: method,
    auth: {
      'username': this.username,
      'password': this.password
    },
    json: true
  };
  console.log("Making request...")
   return rp(options).then((request_data) => {
     return request_data
  }).catch((err) => {
    console.log(err)
    console.log("There was an error in your request URL.")
  })
}


/*
*  Searches for a Jamf managed computer given a string, can be serial number, id or computer name:
*
*  Example 1: find_computer("ToastyGhost")
*  Example 2: find_computer("C02X547JJG5K")
*
*/
Strawberry.prototype.find_computer = function(string_name_serial, method){
    return this.make_request("https://github.jamfcloud.com/JSSResource/computers/id/", string_name_serial, method)
  }

/*
*  Searches for a Jamf managed computer given a string, can be serial number, id or computer name:
*
*  Example 1: find_computer("ToastyGhost")
*  Example 2: find_computer("C02X547JJG5K")
*
*/
Strawberry.prototype.find_computer_name = function(string_name_serial, method){
    return this.make_request("https://github.jamfcloud.com/JSSResource/computers/name/", string_name_serial, method)
  }

/*
*  Searches for a Jamf managed computer given a string, can be serial number, id or computer name:
*
*  Example 1: find_computer("ToastyGhost")
*  Example 2: find_computer("C02X547JJG5K")
*
*/
Strawberry.prototype.find_computer_sn = function(string_name_serial, method){
    return this.make_request("https://github.jamfcloud.com/JSSResource/computers/serialnumber/", string_name_serial, method)
  }


/*
*  Deletes a computer from the JSS given it's serial number
*
*  Example 1: remove_computer("ToastyGhost")
*  Example 2: remove_computer("C02X547JJG5K")
*
*/
Strawberry.prototype.remove_computer = function(string_name_serial, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/computers/id/", string_name_serial, method)
  }

/*
*  Get all users
*
*  Example 1: users()
*
*/
Strawberry.prototype.users = function(){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/users", null, "Get")
  }

/*
*  Get all scripts
*
*  Example 1: scripts()
*
*/
Strawberry.prototype.scripts = function(){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/scripts", null, "Get")
  }

/*
*  Get specific script
*
*  Example 1: get_script(10, "Get")
*
*/
Strawberry.prototype.get_script = function(id, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/scripts/id/", id, "Get")
  }

/*
*  Get specific script
*
*  Example 1: get_script(10, "Get")
*
*/
Strawberry.prototype.get_script_name = function(name, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/scripts/name/", name, "Get")
  }


/*
*  Get all computers
*
*  Example 1: computers()
*
*/
Strawberry.prototype.computers = function(){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/computers", null, "Get")
  }

/*
*  Get all Extension Attributes
*
*  Example 1: extension_attributes()
*
*/
Strawberry.prototype.extension_attributes = function(){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/computerextensionattributes", null, "Get")
  }

/*
*  Get specific Extension Attribute
*
*  Example 1: get_extension_attribute("Umbrella is installed", "Get")
*
*/
Strawberry.prototype.get_extension_attribute = function(name, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/computerextensionattributes/id/", name, "Get")
  }

/*
*  Get specific Extension Attribute
*
*  Example 1: get_extension_attribute("Umbrella is installed", "Get")
*
*/
Strawberry.prototype.get_extension_attribute_name = function(name, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/computerextensionattributes/name/", name, "Get")
  }

/*
*  Get all policies
*
*  Example 1: policies()
*
*/
Strawberry.prototype.policies = function(){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/policies", null, "Get")
  }

/*
*  Get specific policy
*
*  Example 1: get_policy("Enable FileVault via Policy", "Get")
*
*/
Strawberry.prototype.get_policy = function(name, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/policies/id/", name, "Get")
  }

/*
*  Get all packages
*
*  Example 1: packages()
*
*/
Strawberry.prototype.packages = function(){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/packages", null, "Get")
  }

/*
*  Get specific package
*
*  Example 1: get_extension_attribute(3, "Get")
*
*/
Strawberry.prototype.get_package = function(name, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/packages/id/", name, "Get")  
  }

/*
*  Get specific package
*
*  Example 1: get_extension_attribute(3, "Get")
*
*/
Strawberry.prototype.get_package_name = function(name, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/packages/name/", name, "Get")  
  }

/*
*  Get all computergroups
*
*  Example 1: get_computergroups()
*
*/
Strawberry.prototype.get_computergroups = function(){
    return this.make_request("https://github.jamfcloud.com/JSSResource/computergroups", null, "Get")  
  }

/*
*  Get specific computergroup
*
*  Example 1: get_computergroup("!Approve MDM (API Cal Group)", "Get")
*
*/
Strawberry.prototype.get_computergroup = function(id, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/computergroups/id/", id, "Get")  
  }

/*
*  Get specific computergroup
*
*  Example 1: get_computergroup("!Approve MDM (API Cal Group)", "Get")
*
*/
Strawberry.prototype.find_computergroup = function(name, method){  
    return this.make_request("https://github.jamfcloud.com/JSSResource/computergroups/name/", name, "Get")  
  }

/*
*  Create a dictionary of jamf users where computer name is key and serial is value
*/
Strawberry.prototype.jamf_dictionary_hostname = function(jamf_users){
  var arr = []
  var dict = {}
  var send_dicts = []
  return this.find_computergroup("all managed clients", "Get").then((data) => {
      data["computer_group"]["computers"].forEach((item)=>{
        arr[0] = item["name"]
        arr[1] = item["serial_number"]
        dict["id"] = item["id"]
        dict["name"] = arr[0]
        dict["data"] = arr
        send_dicts.push(dict)
        arr = []
        dict = {}
      })
      return send_dicts
    });
}

/*
*  Create a dictionary of jamf users where computer name is key and serial is value
*/
Strawberry.prototype.jamf_dictionary_serial = function(jamf_users){
  jamf_dictionary = {}
  return this.find_computergroup("all managed clients", "Get").then((data) => {
      data["computer_group"]["computers"].forEach((item)=>{
        jamf_dictionary[item["serial_number"]] = item["name"]
      })
      return jamf_dictionary
    });
}


/*
*  Creates a dictionary of all jamf other data
*/
Strawberry.prototype.jamf_dictionary_aggregate = function(){
  jamf_dictionary = {}

   return this.scripts().then((data)=>{
    jamf_dictionary["scripts"] = data
     return this.policies().then((data)=>{
      jamf_dictionary["policies"] = data
      return this.extension_attributes().then((data)=>{
        jamf_dictionary["computer_extension_attributes"] = data
        return this.packages().then((data)=>{
          jamf_dictionary["packages"] = data
          return this.get_computergroups().then((data)=>{
            jamf_dictionary["computer_groups"] = data
            return jamf_dictionary
          })
        })
      })
    })
  })
}

// Exports Strawberry object for module
module.exports = Strawberry


