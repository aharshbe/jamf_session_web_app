import React from "react";
import "./searchbar.css";

class Searchbar extends React.Component{
constructor(props){
  super(props);

  this.state = {
    filter: ''
  }
}

keyUpHandler(event) {
    console.log(event.target.value);
}

containerName(){
  if(this.props.containerName){
    return this.props.containerName
  }
  else{
    return "searchBarContainer"
  }
}

className(){
  if(this.props.className){
    return this.props.className
  }
  else{
    return "searchBar_smart_groups"
  }
}


  render(props) {
    const containerName = this.containerName()
    const className = this.className()

    return(
      <div className={className} >
        <input className={className} type="text" placeholder="Search..." onKeyUp={this.props.searchFilter}/>
      </div>
    )
  }
}

export default Searchbar;
