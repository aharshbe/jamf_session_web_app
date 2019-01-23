import React from "react";
import "./results.css";

class Results extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      resultsData : [],
      linkData : [],
      gearData : false
    }

  }


  findLink(data){
    var link = "http://localhost:3000/"
    var links = []
    var toSearch = data["links"]

    for (var i = 0; i < toSearch.length; i++){
      if (toSearch[i] === "no link"){
        links.push("no link")
      } else {
        links.push(link+data["type"][i]+"?q="+toSearch[i])
      }
    }
    return links
  }

  changeMatchData(data){

    var matchData = data["matches"]
    var arr = []
    var current = []
    for (var i = 0; i < matchData.length; i++){
      current = matchData[i]
      for (var x = 0; x < current.length; x++){
        arr.push(current[x])
      }
    }
    return arr
  }

  changeUserData(data){
    var toSearch = data["matches"]
    var current = []
    var handles = []
    var names = []
    var arr = []

    for (var i = 0; i < toSearch.length; i++){
      current = toSearch[i]
      for (var x = 1; x < current.length; x++){
        handles.push(current[x]["user"]["login"])
        names.push(current[x]["user"]["name"])
      }
    }
    arr[0] = handles
    arr[1] = names
    return arr
  }

  unpackGearHandlesData(data){
    var links = []
    var matchData = []
    var userData = []
    var handles = []
    var names = []

    links = this.findLink(data)
    userData = this.changeUserData(data)
    handles = userData[0][0]
    names = userData[1][0]

    if (data["links"][0] === "no link"){
      matchData = this.changeMatchData(data)
      data["matches"] = matchData
      data["user_data_names"] = names
      data["user_data_handles"] = handles
      data["user_data_email"] = handles+"@github.com"
      data["user_data_handle_link"] = "https://gear.githubapp.com/users/"+handles
    }
    data["links"] = links
    return data
  }

  linksSerials(data){
    var dict = {}
    var arr = []
    var s = 'http://localhost:3000/find_computer_sn?q='
    for (var i = 0; i < data.length; i++){
      if (data[i]["serialNumber"]){
        s += data[i]["serialNumber"]
        dict["name"] = data[i]["name"]
        dict["serialNumber"] = data[i]["serialNumber"]
        dict["link"] = s
        arr.push(dict)
        dict = {}
        s = 'http://localhost:3000/find_computer_sn?q='
      }
    }
    try {
      if (arr[0]["serialNumber"] === arr[1]["serialNumber"]){
        var tmp = arr[0]
        arr = []
        arr[0] = tmp
      }
    } catch (err){
      console.log("err")
    }
    console.log(arr)
    return arr
  }

  returnHTML(){
    const data = this.unpackGearHandlesData(this.props.sentData)
    const linkItems = data["links"].map((d, index) => <a href={d} target="_blank" rel="noopener noreferrer">{d}</a>)
    const dataItems = data["dataHostname"].map((d, index) => <div><p><b>User's handle:</b> {d[2]}</p><p><b>Serial number:</b> {d[1]}</p></div>)
    if (data["links"][0] === "no link"){
      var arr = this.linksSerials(data["matches"])
      const matchItems = arr.map((d, c, index) => <p key={index + d.name}><a href={d.link} target="_blank" rel="noopener noreferrer">{d.name}, {d.serialNumber}</a></p>);
      return(
        <div className="result">
          <div className="row"><b>{data["user_data_names"]}</b><a href={data["user_data_handle_link"]} target="_blank" rel="noopener noreferrer">{data["user_data_handles"]}</a>{data["user_data_email"]}<p></p></div>
          <div className="row">---Links---</div>
          <div className="row">{matchItems}</div>
          <div className="row">------</div>
           <div className="row"><p><span role="img" aria-label="info">ℹ️</span> <i>If the link doesn't work, the item may not be in JAMF but registered in Gear.</i></p></div>
        </div>
      )
    } else {
      const data = this.unpackGearHandlesData(this.props.sentData)
      var allItems = data["matches"].map((e, i, index) => <div key={index + e.name}><b>{e.name}:</b> {linkItems[i]}<p></p></div>);
      try {
        if (data["dataHostname"][0].length === 3){
            allItems = data["matches"].map((e, i, index) => <div key={index + e.name}>{dataItems[i]}<b>{e.name}:</b> {linkItems[i]}<p></p></div>);
        }
      } catch (err){
        console.log("err")
      }
      if (allItems.length === 0){
        allItems[0] = "No results found for your search. 🙃"
      }
      return(
        <div className="result">
          <div>{allItems}</div>
        </div>
      )
    }
  }
  render(props) {
    return (
      this.returnHTML()
    );
  }
}

export default Results;
