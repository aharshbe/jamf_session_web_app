import React from "react";
import "./counter.css";

class Counter extends React.Component{

  render() {
    return (
      <div>
      <button className="counter" value={this.props.groupName} onClick={this.props.clickHandler} >
        {this.props.groupName}
        <br></br>
        <br></br>
        {this.props.groupComputers}
      </button>
      </div>
    );
  }
}

export default Counter;
