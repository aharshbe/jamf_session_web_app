import React from "react";
import Results from "./results"
import "./searchonly.css"

class SearchOnly extends React.Component{
constructor(props){
  super(props);

  this.state = {
    search : '',
    data_arr : [],
    resultsLoaded : false,
    sendData : []

  }
  this.keyUpHandler = this.keyUpHandler.bind(this)
  this.submitSearch = this.submitSearch.bind(this)
}

keyUpHandler(event) {

  if (event.key === 'Enter') {
    this.submitSearch()
   }
  this.setState({search : event.target.value})
  this.hasLoaded()
}


hasLoaded(resultsLoaded){
  if (this.state.resultsLoaded === true){
    this.setState({resultsLoaded : false})
  }
}

startSearching(dataPack, searchString){
  var keys = Object.keys(dataPack)
  var current = ""
  var key = ""
  var currentKeys = ""
  var currentKey = ""
  var number_found = 0
  var matches = []
  var dataPacktoSend = {}
  var type = []
  var links = []
  var dataPackExtendedHostname = []

  for (var i = 0; i < keys.length; i++){
    key = keys[i]
    current = dataPack[key]
    try {
      currentKeys = Object.keys(current)
    } catch (err){
      console.log("name value for user is null")
    }
    for (var x = 0; x < currentKeys.length; x++){
      currentKey = currentKeys[x]
      if (currentKey.toLowerCase() === searchString.toLowerCase()){
          number_found += 1
          matches.push(current[currentKey])
          type.push(keys[i])
          if (current[currentKey]["id"]){
            links.push(current[currentKey]["id"])
          }
           else {
            links.push("no link")
          }
      } else {
        try {
         if (current[currentKey]["name"].toLowerCase() === searchString.toLowerCase()){
            number_found += 1
            matches.push(current[currentKey])
            type.push(keys[i])
            links.push(current[currentKey]["id"])
            if (current[currentKey]["data"]){
              dataPackExtendedHostname.push(current[currentKey]["data"])
            }
         }
        } catch(err){
          //console.log("still searchin...")
        }
      }
    }
  }
  dataPacktoSend["type"] = type
  dataPacktoSend["results"] = number_found
  dataPacktoSend["matches"] = matches
  dataPacktoSend["links"] = links
  dataPacktoSend["dataHostname"] = dataPackExtendedHostname

  return dataPacktoSend
}

submitSearch(){

  var searchString = this.state.search
  if (searchString === ""){
    console.log("Error: Enter a search query")
    return 0
  }

  var searchData = this.props.allData
  var scripts = searchData["scripts"]
  var policies = searchData["policies"]
  var extensionAttributes = searchData["computer_extension_attributes"]
  var packages = searchData["packages"]
  var computerGroups = searchData["computer_groups"]
  var jamf_computers = searchData["jamf_computers"]
  var gearDataSerial = searchData["gear_data_by_serial"]
  var gearDataHandle = searchData["gear_data_by_handle"]
  var gearDataName = searchData["gear_data_by_name"]

  var dataPack = {
    "get_script" : scripts["scripts"],
    "get_policy" : policies["policies"],
    "get_extension_attribute" : extensionAttributes["computer_extension_attributes"],
    "get_package" : packages["packages"],
    "get_computergroup" : computerGroups["computer_groups"],
    "find_computer" : jamf_computers,
    "gear names" : gearDataName,
    "gear serials" : gearDataSerial,
    "gear handles" : gearDataHandle
  }
  var searchResult = this.startSearching(dataPack, searchString)
  console.log("returned data => "+searchResult)
  this.setState({sendData : searchResult})
  this.setState({resultsLoaded : true})
}
// <button id="searchOnly" onClick={this.submitSearch }>Search</button>

  render(props) {

    return(
      <div className="searchBarContainer" >
        <div><input className="searchBar" type="text" placeholder="Press enter to search" onKeyUp={this.keyUpHandler}/>
        <button className="searchButton" id="searchOnly" onClick={this.submitSearch }><span role="img" aria-label="Search">🔎</span></button></div>
        { this.state.resultsLoaded ?
          < Results search={this.state.search} sentData={this.state.sendData}/> : null
        }
      </div>

    )
  }
}

export default SearchOnly;
