import React, { Component } from 'react';
import axios from 'axios'

export default class Books2 extends Component{

  constructor(props) {
    super(props);
    this.state = {data:[]} 
  }

  componentDidMount() {
    var th = this;

    if(this.props.type=="out"){
      this.serverRequest = 
      axios.get("/gets/reqbooks1")

      .then(function(result) {    

        th.setState({
          data: result.data,

        });

      })  

    }else if(this.props.type=="in"){
      this.serverRequest = 
      axios.get("/gets/reqbooks2")

      .then(function(result) {    

        th.setState({
          data: result.data,

        });

      })  

    }

  }

  trade(e){
    var th = this;
    e.persist();
    axios.get("/gets/checkreq?title="+e.target.value+"&ap="+e.target.id)

    .then(function(result) {    

      if(e.target.id=="approved" && result.data.msg=="ok"){
        e.target.parentElement.parentElement.classList.add('success');
        e.target.parentElement.parentElement.children[2].children[0].classList.add("disabled");
        e.target.parentElement.parentElement.children[3].children[0].classList.add("disabled");
      }
      else{
        if(e.target.id=="reject" && result.data.msg=="ok")
          e.target.parentElement.parentElement.classList.add('danger');
        e.target.parentElement.parentElement.children[2].children[0].classList.add("disabled");
        e.target.parentElement.parentElement.children[3].children[0].classList.add("disabled");
      }

    })  
  }

  render() {
    console.log(this.state.data);
    var th=this;
    let type=this.props.type;
    return (

      <table className="table" id={this.props.id} style={{width:"80%"}}>
      <thead><tr><th>Book</th><th>{type=="in"?"From":"To"}</th><th>{type=="out"?"Status":""}</th><th></th></tr></thead>
      <tbody>
      {this.state.data.map(function(item,i) {
        var ty=th.props.type;
        return (
          <tr className={(item.tradeap)?(item.tradeap=="true"?"success":"danger"):""}>
          
          <td>{item.title}</td>

          {(th.props.type=="in") &&
              <td>{item.trade}</td>
          }

          {(th.props.type=="out") &&
              <td>{item.trade}</td>

          }

          {(th.props.type=="in") &&
              <td><button onClick={(event) =>th.trade(event)} value={item.title} id="approved" className={"btn btn-success "+((item.tradeap)?"disabled":"")}>APPROVE</button></td>

          }


          {(th.props.type=="in") &&
              <td><button  onClick={(event) =>th.trade(event)} value={item.title} id="reject" className={"btn btn-success btn-danger "+((item.tradeap)?"disabled":"")}>REJECT</button></td>

          }

          {(th.props.type=="out") &&
              <td>{(item.tradeap)?(item.tradeap=="true"?"approved":"rejected"):"pending"}</td>

          }


          </tr>)

        })}
        </tbody>
        </table>
        );
      }

    }

