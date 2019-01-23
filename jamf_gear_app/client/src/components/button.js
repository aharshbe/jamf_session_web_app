import React from "react";
//import PropTypes from "prop-types";
import "./button.css";


class Button extends React.Component{

  render() {
    return (
      <button onClick={this.props.test} className={this.props.className} value={this.props.buttonName} >
        {this.props.buttonName}
      </button>
    );
  }
}

export default Button;
