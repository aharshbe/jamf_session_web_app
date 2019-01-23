import React from "react";
import "./datatablefilter.css";
import Button from "./button"

class DataTableFitler extends React.Component{

  hasLoaded(item, html, alternativeHtml){
    console.log(alternativeHtml);
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

  render(props){

    const removeGearFilterButton =  (<Button className="datafilter-buttons" test={this.props.removeGearFilter} buttonName="Remove Gear Data"/>)
    const addGearFilterButton = (<Button className="datafilter-buttons" test={this.props.gearFilterData} buttonName="Add Gear Data" />)
    const gearFilterButton = this.hasLoaded(this.props.filterStatus, removeGearFilterButton, addGearFilterButton)

      return(
        <div>
        {gearFilterButton}
        <Button className="datafilter-buttons" test={this.props.makeCall} buttonName="Download CSV"/>
        </div>
      )
    }
}

export default DataTableFitler;
