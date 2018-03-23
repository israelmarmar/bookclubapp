import React, { Component } from 'react';

export default class Input extends Component{

   constructor(props) {
    super(props);
    this.state={value: this.props.value};
 }

 handleChange(event) {
    this.setState({value: event.target.value});
 }


 render() {

    return (
     <input
     type={this.props.type}
     value={this.state.value}
     onChange={(event)=>this.handleChange(event)}
     id={this.props.id}
     name={this.props.name}
     placeholder={this.props.placeholder}
     className={this.props.className}
     />
     );
  }

}
