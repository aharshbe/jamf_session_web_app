/* 
*   File for aggregating data from Jamf API
*   using HTTP requests specific to Jamf Dashboard
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
  console.log("\n***Connection to GitHub Jamf/JSS for Dashboard established.***")
}

/*
*  Abstract to allow HTTP requests, example usage:
*
*  ** This is specific to jamf_dashboard because of a need for XML instead of JSON
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
   return rp(options).then((request_data) => {
     return request_data
  }).catch((err) => {
    console.log(err)
    console.log("There was an error in your request URL.")
  })
}

/*
*  Return Jamf dashboards
*
* ** All seperate smartgroups for Dashboard are generate from array in app.js called dashboards
*/
Strawberry.prototype.dashboard = function(){
    return this.make_request("https://github.jamfcloud.com/JSSResource/computergroups", null, "Get")
  }

/*
*  Generate Jamf dashboard
*
* ** All seperate smartgroups for Dashboard are generate from array in app.js called dashboards
*/
Strawberry.prototype.generate_dashboard = function(dashboard){
    return this.make_request("https://github.jamfcloud.com/JSSResource/computergroups/name/", dashboard, "Get")
  }

/*
*  Generate a CSV for smartgroup
*
* ** All seperate smartgroups for Dashboard are generate from array in app.js called dashboards
*/
Strawberry.prototype.generate_smartgroup_csv = function(smartgroup){
    
    var dataToWrite;
    var fs = require('fs');

    dataToWrite = this.make_request("https://github.jamfcloud.com/JSSResource/computergroups/name/", smartgroup, "Get")

    console.log(dataToWrite)

    fs.writeFile(smartgroup+'.csv', dataToWrite, 'utf8', function (err) {
      if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
      } else{
        console.log('It\'s saved!');
      }
    });
    console.log("CSV written, action done.")
    return "CSV written, action done."
  }

// Exports Strawberry object for module
module.exports = Strawberry


