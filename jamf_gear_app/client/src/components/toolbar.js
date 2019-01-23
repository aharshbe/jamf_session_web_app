import React from "react";
import "./toolbar.css";

class Toolbar extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      active : ""
    };

    this.handleSearchOnly = this.handleSearchOnly.bind(this)
    this.handleSmartGroups = this.handleSmartGroups.bind(this)

  }

  handleSearchOnly(event) {
    if(this.props.searchonly === false){
      this.props.changeSearchOnlyState("ok")
    }

  }

  handleSmartGroups(thing) {
    if(this.props.searchonly === true){
      this.props.changeSearchOnlyState()
    }

  }

  handleComapre(event) {
    console.log("Compare event triggered.")
  }

  handleClick = (event) => {
      let className = event.currentTarget.getAttribute('value')
      this.props.changeSearchOnlyState(className)
  }


  render(props){
    const link = "https://github.com/github/it/issues/new?assignees=aharshbe%2C+teakopp&labels=jamf_session%2C+jamf_session_smart_group&template=create-new-jamf-session-smart-group.md&title=New+Jamf+Session+smart+group+request"

      return(
        <div className="total">
          <div className="toolbar">
            Jamf Session<span role="img" aria-label="strawberry">🍓</span> |
            <div className="tooltip" id="d1">
              <a className="item_left" href="https://github.com/github/jamf_session" target="_blank" rel="noopener noreferrer"><span role="img" aria-label="About">ℹ️</span></a>
              <span className="tooltiptext">About Jamf Session</span>
            </div>
            <div className="tooltip">
              <a className="item" href="#groups" value="groups" onClick={((event) =>this.handleClick(event))}><span role="img" aria-label="Dashboard">⚙️</span></a>
              <span className="tooltiptext">Smart Group Dashboard</span>
            </div>
            <div className="tooltip" id="d1">
              <a className="item" href={link} target="_blank" rel="noopener noreferrer" value="link" ><span role="img" aria-label="Reqest new smart group">🆕</span></a>
              <span className="tooltiptext">Reqest new smart group...</span>
            </div>
            <div className="tooltip" id="d1">
              <a className="item" href="#home" value="search" onClick={((event) =>this.handleClick(event))}><span role="img" aria-label="Search">🔎</span></a>
              <span className="tooltiptext">Search Jamf/Gear data</span>
            </div>
            <div className="tooltip">
              <a className="item" href="#compare"value="compare" onClick={((event) =>this.handleClick(event))}><span role="img" aria-label="Compare">📊</span></a>
              <span className="tooltiptext">Compare Jamf and Gear</span>
            </div>
          </div>
        </div>
      )
    }
}

export default Toolbar;
