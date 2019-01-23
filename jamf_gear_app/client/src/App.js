import React, { Component } from 'react';
import CounterDashBoard from "./components/counter-dashboard";
import Datatable from "./components/datatable";
import DataTableFitler from "./components/datatablefilter"
import "./App.css"
import Toolbar from "./components/toolbar"
import SearchOnly from "./components/searchonly"
import Compare from "./components/compare"
import 'whatwg-fetch';
import loadingimage from './components/assets/ajax-loader.gif'

//dashboards will be used to buildout UI and make API call so exact spelling is important
// It's dynamically generated, sop it can handle as many categories as needed

require('dotenv').config()


var dashboards = ["Loaners", "IT", "Umbrella is not installed",
"jamf Pro quick add not approved", "FileVault is not enabled", "Sennheiser HeadSetup Installed",
"Sennheiser SSL vulnerable","ZOOM CLIENT SAFE","Zoom Client Vulnerable","ZOOM NOT CHECKED", "Carbon Black Not Installed (OSX < 10.13.2)"]

// Credentials for authenticate server side
var username = process.env.REACT_APP_JAMF_SESSION_USER
var password = process.env.REACT_APP_JAMF_SESSION_PASSWORD

// Headers for the auth for the fetch request on line 135
let headers = new Headers();
headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      compareData : [],
      loaded :false,
      headers : null,
      group : '',
      tableData : null,
      search : '',
      allData : [],
      gearFilterOn : false,
      searchonly : null,
      unfilteredTableData : null,
      dashboards : [],
      Loadingloaded : false
    };

    this.handleClick = this.handleClick.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.gearFilterData = this.gearFilterData.bind(this)
    this.removeGearFilter = this.removeGearFilter.bind(this)
    this.changeSearchOnlyState = this.changeSearchOnlyState.bind(this)
    this.createSmartGroupCSV = this.createSmartGroupCSV.bind(this)
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

  createSmartGroupCSV(){
    fetch(`http://localhost:3000/generate_smartgroup_csv_fast?q=${this.state.group}`, {method: "GET",  headers: headers})
      .then(res => res.text())
      .then(csvUrl=> {
        window.open(`http://localhost:3000/download_csv?q=${csvUrl}`)
      });
  }

  all_smartgroups(){
    fetch(`http://localhost:3000/dashboard`, { method: "GET", headers: headers })
      .then(res => res.json())
      .then(data => {
        this.setState({dashboards : data}, ()=>{
          dashboards = this.state.dashboards
          this.getSmartgroups(dashboards)
        })
      });
  }

  getCompareData(){

    fetch("http://localhost:3000/compare",{
      method: "GET",
      headers: headers
    })
    .then(
      res => res.json())
    .then(resData => {
      console.log(resData);
      this.setState({compareData : resData, loaded : true})
    })
  }


  changeSearchOnlyState(activeTab){
    this.setState({searchOnly : activeTab})
  }

  changeTab(){
    if(this.state.searchOnly === "search"){
      return(<SearchOnly allData={this.state.allData}/>)
    }
    else if(this.state.searchOnly === "groups"){
      return(<CounterDashBoard clickHandler={this.handleClick} counterData={this.state.data}/>)
    }
    else if(this.state.searchOnly === "compare"){
      console.log(this.state.compareData);
      console.log(this.state.allData["gear_data_by_serial"]);
      return(<Compare gearBySerialData={this.state.allData["gear_data_by_serial"]} compareData={this.state.compareData} />)
    }
  }

  getData(){
    fetch(`http://localhost:3000/all_data`, { method: "GET", headers: headers })
      .then(res => res.json())
      .then(data => {
        this.setState({allData : data}, () =>{
          this.getCompareData()
        })
      });
  }

  removeGearFilter(){
    let unfilteredGearData = []
    let unfilteredGearHeaders = []
    let data = this.state.tableData
    let headers = this.state.headers
    const gearHeaders = ["gearName", "gearSerialNumber", "gearLogin", "gearUsername"]

    headers.map((header, index) => {
      console.log(header);
      if (gearHeaders.includes(header)){
        //pass
      }
      else{
        unfilteredGearHeaders.push(header)
      }
      return 1
    })

      data.map((item) => {
        let keys = Object.keys(item)

        keys.map((key) => {
          if (gearHeaders.includes(key)){
            delete item[key]
          }
          return 1
        })
        unfilteredGearData.push(item)
        return 1
    })
    this.setState({tableData : unfilteredGearData, headers :  unfilteredGearHeaders, gearFilterOn : false })
  }

  gearFilterData(){
    let filter = "serial_number"
    let gearFilterData = []
    let gearHeaders = ["gearName", "gearSerialNumber", "gearLogin", "gearUsername"]
    let headers = this.state.headers
    let gearData = this.state.allData["gear_data_by_serial"]

    this.state.tableData.map((item, index) => {

      if (item[filter] in gearData){

        item["gearName"] = gearData[item[filter]][1]["name"];
        item["gearSerialNumber"] = gearData[item[filter]][1]["serialNumber"];
        item["gearLogin"] = gearData[item[filter]][1]["user"]["login"];
        item["gearUsername"] = gearData[item[filter]][1]["user"]["name"];

        gearFilterData.push(item)
      }

      else {

        item["gearName"] = '---'
        item["gearSerialNumber"] = '---'
        item["gearLogin"] = '---'
        item["gearUsername"] = '---'

        gearFilterData.push(item)

      }
      return 1
    })

    gearHeaders.map((gearHeader) => {

      if (gearHeader in headers){
        //pass
      }
      else{
        headers.push(gearHeader)
      }
      return 1
    })

    this.setState({tableData : gearFilterData, headers : headers, gearFilterOn : true})
    return gearFilterData
  }

  handleClick(event) {

    if(this.state.gearFilterOn === true){
      this.removeGearFilter()
    }
    this.setState({group : event.target.value, gearFilterOn : false}, () => {
      this.state.data.map((item) => {
        let data = []
        if (item.computer_group.name === this.state.group){
            item.computer_group.computers.map((computer) => {
              let keys = Object.keys(computer)
              data.push(computer)
              this.setState({ headers : keys})
              return computer
            })
            this.setState({tableData : data, unfilteredTableData : data}, () => {
              this.gearFilterData()
            })

        }
        return data
      })
    })
  }

  makeGearObject(data) {
      console.log(data);
      data.map((item) => {
        let data = []
            item.computer_group.computers.map((computer) => {
              let keys = Object.keys(computer)
              data.push(computer)
              return computer
            })

        console.log(data);
        return data
      })

  }

  searchInDataTable(){
    let list = []
    let search = this.state.search.toString().replace(/[^a-zA-Z0-9]/g, "")
    let regex = new RegExp(search.toLowerCase())

    this.state.unfilteredTableData.map((item)=>{
      let values = Object.values(item)
      let match = false
      values.map((value) => {
        if(value === null){
          value = '---'
        }
        let filteredValue = value.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, "").replace(/\s/g, '')
        if(regex.test(filteredValue)){
          match = true
          return match
        }
        return 1
      })
      if(match){
        list.push(item)
      }
      return 1
    })
  return list
  }

  handleSearch(event){
    this.setState({search : event.target.value }, () => {
      if (this.state.search === ''){
        this.setState({tableData :  this.state.unfilteredTableData})
      }
      else if(this.state.search !== '' ){
        let data = this.searchInDataTable()
        this.setState({tableData : data})
      }
    })
  }

  getSmartgroups(data){
    Promise.all(data.map(dashboards =>
     fetch(`http://localhost:3000/get_computergroup_dashboard?q=${dashboards}`,{
      method: "GET",
      headers: headers
    }).then(
      res => res.json())
    )).then(resData => {
     let headers = Object.keys(resData[0].computer_group)
     this.setState({
      data : resData,
      headers : headers
     })
     return resData
   })
  }

  loadingCompon(){
    return(
      <div className="loadBox">
      <div>Jamf Session<span role="img" aria-label="strawberry">🍓</span></div>
      <br></br>
      <div>Loading...</div>
      <br></br>
      <img src={loadingimage} alt="loading..." />
      </div>
    )

  }

  loadHTML(){
    const dataTable = (
      <div>
       <DataTableFitler filterStatus={this.state.gearFilterOn} removeGearFilter={this.removeGearFilter} gearFilterData={this.gearFilterData} makeCall={this.createSmartGroupCSV}/>
       <Datatable tableHeaders={this.state.headers} tableData={this.state.tableData} searchFilter={this.handleSearch} search={this.state.search} headline={this.state.group} />
      </div>
    )
    const empty = (<div></div>)
    const activelySelectedComponent = this.changeTab()
    const tableData = this.hasLoaded((this.state.tableData && this.state.searchOnly === "groups"), dataTable, empty)
    return(
      <div className="App">
      <header className="App-header">
      <Toolbar changeSearchOnlyState={this.changeSearchOnlyState} searchonly={this.state.searchonly}/>
      {activelySelectedComponent}
      {tableData}
      </header>
      </div>
    );
  }

  componentDidMount() {
    this.all_smartgroups()
    this.getData()
    this.setState({searchOnly : "search"})
  }

  render() {
    const html = this.loadHTML()
    const loadingComponent = this.loadingCompon()
    const loadingScreen = this.hasLoaded(this.state.loaded, html, loadingComponent)

    return(
      <div className="App">
      <header className="App-header">
      {loadingScreen}
      </header>
      </div>
    );

  }
}

export default App;
