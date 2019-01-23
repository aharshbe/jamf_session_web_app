import React from "react";
import PropTypes from "prop-types";
import Counter from "./counter";
import "./counter-dashboard.css";

//
class CounterDashboard extends React.Component{

  render(props) {
    const listItems = this.props.counterData.map((item) => {
      return(
        <div key={item.computer_group.name} className="counterColumn">
          <Counter groupName={item.computer_group.name} groupComputers={item.computer_group.computers.length} clickHandler={this.props.clickHandler}/>
       </div>
      )
    }

     );

    return (
        <ul className="counterbox">{listItems}</ul>
    );
  }
}


export default CounterDashboard;
