import React from "react";
import Counter from "./counter";
import "./compare.css";
import Datatable from "./datatable"

// Credentials for authenticate server side
var username = process.env.REACT_APP_JAMF_SESSION_USER
var password = process.env.REACT_APP_JAMF_SESSION_PASSWORD

// Headers for the auth for the fetch request on line 135
let headers = new Headers();
headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

class Compare extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      headers : null,
      tableData : null,
      headers : null,
      headline : "",
    };

    this.counterClickHandler = this.counterClickHandler.bind(this)
    this.emailUsersNotInJamf = this.emailUsersNotInJamf.bind(this)
  }


  hasLoaded(item, html, alternativeHtml){
    if(alternativeHtml === undefined){
      let alternativeHtml = <div></div>
    }
    if(item){
      return(
        html
      )
    }
    else{
      return(
        alternativeHtml
      )
    }
  }

emailUsersNotInJamf(){
  const emails = []
  fetch(`http://localhost:3000/emailer`, { method: "POST", headers: headers, body : emails })
}

counterClickHandler(event){

  const gearBySerialData = this.props.gearBySerialData

  const targetClicked = event.target.value
  if(targetClicked === "Total Not In Gear"){
    this.setState({headers : ["Hostname", "Serial Number"]})
    const computersNotInGear = this.props.compareData["Total_Not_In_Gear"][1]
    let keys = Object.keys(computersNotInGear)
    let tableifiedData = []

    keys.map((key) => {
      let data = {};
      if(key !== "Total_Number_Not_In_Gear" && key !== "[object Object]"){
        data["serialNumber"] = key
        data["hostName"] = computersNotInGear[key]

      tableifiedData.push(data)
    }
    })
    this.setState({tableData : tableifiedData, headline : targetClicked})
  }
  else {
    this.setState({headers : ["Serial Number","Handle","Email"]})
    const computersNotInJamf = this.props.compareData["Total_Not_In_Jamf"][1]
    let keys = Object.keys(computersNotInJamf)
    let tableifiedData = []
    let data;
    keys.map((key) => {
      data = {}
      if(key !== "Total_Number_Not_In_Jamf" && key !== "[object Object]"){
        data["serialNumber"] = key
        data["handle"] = computersNotInJamf[key]

        if(data["serialNumber"] in gearBySerialData){
          try{
            data["email"] = `${data["handle"]}@github.com`
          }
          catch(error){
            data["handle"] = "---"
            data["email"] = "---"
          }
        }

        tableifiedData.push(data)

      }
    })

    this.setState({tableData : tableifiedData, headline : targetClicked})
  }
}

  render() {
    let keys = Object.keys(this.props.compareData);

    const counters = keys.map((key, index) => {
    const title = key.replace(/_/g,' ');
      return (
        <div key={index+key}>
          <div key={index} className="counterCompareColumn">
            <Counter key={title + index} groupName={title} value ={key} groupComputers={this.props.compareData[key][0]} clickHandler={this.counterClickHandler}/>
          </div>
        </div>
      );

    })
    const emailButton = (<div><button className="email" onClick={this.emailUsersNotInJamf}>Email</button></div>)
    const dataTable = (
      <div>
        < Datatable tableHeaders={this.state.headers} tableData={this.state.tableData} searchFilter={this.handleSearch} search={this.state.search} headline={this.state.headline} />
      </div>
    )

    const needEmailButton = this.hasLoaded(this.state.headline === "Total Not In Jamf", emailButton)
    const loadedDataTable = this.hasLoaded(this.state.tableData, dataTable)

    return(
      <div>
      <ul className="counterComparebox">{counters}</ul>
      {needEmailButton}
      {loadedDataTable}
      </div>
    )
  }
}

export default Compare;
