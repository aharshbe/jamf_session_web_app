import React from "react";
import "./datatable.css";
import Searchbar from "./searchbar";
//import DataTableFitler from "./datatablefilter"
//import Button from "./button"

class Datatable extends React.Component {



    hasHeadline(){
       if (this.props.headline){
         return(
           <div>
             <h1 className="headline">{this.props.headline} - {this.props.tableData.length} clients</h1>
           </div>
         )
       }
       else{
         return(
             <div></div>
         )
       }
     }

     hasSearchBar(){
       if(this.props.searchFilter){
         return(
           <Searchbar className="result-filter" containerName="result-filter-container" searchFilter={this.props.searchFilter}/>
         )
       }
       else{
         return (
           <div></div>
         )
       }
     }


    render(props) {
      console.log(this.props.tableData);
      const headers = this.props.tableHeaders.map((item) => {
        return(
            <th key={item}>{item}</th>
        )
      })

      const headline = this.hasHeadline()
      const searchBar = this.hasSearchBar()
      const data = this.props.tableData.map((item, index) => {
      let keys = Object.keys(item)
        return(
          <tr className="data-table-row" key={index}>
          {keys.map((key,index) => <td className="data-table-data" key={index}>{item[key]}</td>)}
          </tr>
        )
      })

    return (
      <div>
        {headline}
        {searchBar}
        <table className="table">
          <tbody>
            <tr>{headers}</tr>
            {data}
          </tbody>
        </table>
        <div className="spacer"></div>
      </div>

    );
  }

}

export default Datatable;
