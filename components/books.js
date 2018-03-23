import React, { Component } from 'react';
import axios from 'axios'
import {submit, getCookie} from './jsfunc'
import { actionCreators } from '../reducer'
import { connect } from 'react-redux'


if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
}

const mapStateToProps = (state) => ({
  data: state.data,
})

class Books extends Component{

  constructor(props) {
    super(props);
    this.state={data: []};
  }


  componentDidMount() {
    var th=this
    const {dispatch} = this.props
    axios.get("/gets/userbooks?user="+this.props.user)

    .then(function(result) {    
      dispatch(actionCreators.erase())
      dispatch(actionCreators.add(result.data))

    })


  }

  remove(e){
    const {dispatch} = this.props
    var th = this;
    var dt=this.state.data;
    e.persist()
    console.log(e.target.attributes.getNamedItem('index').value);
    axios.get("/gets/remove?title="+e.target.value+"&user="+e.target.id)

    .then(function(result) {    
    dispatch(actionCreators.remove(e.target.attributes.getNamedItem('index').value))

    })
  }

  trade(e){
    var btn=e;
    var th = this;
    btn.persist();
    axios.get("/gets/request?title="+e.target.value+"&user="+e.target.id)

    .then(function(result) {    
      btn.target.classList.add('disabled');
    })
  }

  render() {
    var th=this;
    console.log(this.props)

    if (this.props.data=="undefined")
      return(<img id="loading" src="/load-gif-12.gif" height="80" width="80" />)
    else{
      console.log(this.props.data)
      return (
        <div id={this.props.id} style={{width:"80%"}}>
        {this.props.data.map(function(item,i) {
          var type=th.props.type=="others" && user.email!==item.user;
          console.log(item.request);
          return (
            <div className="content">
            <img className="imgbook" src={item.img} height="42" width="42"/>

            <button value={item.title} id={item.user} index={i} onClick={type?(event)=>th.trade(event):(event)=>th.remove(event)} className={"btn btn-default btn-sm glyphicon "+(type?"glyphicon-retweet ":"glyphicon-remove ")+(item.trade==undefined || item.trade=="" ?"":!type?"":"disabled")}/>

            </div>)

        })}
        </div>
        )};
      }

    }

    export default connect(mapStateToProps)(Books)