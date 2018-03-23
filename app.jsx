import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios'
import $ from "jquery";
import {getCookie} from './components/jsfunc'
import {Home} from "./components/home"
import {Login} from "./components/login"
import {Signup} from "./components/signup"
import {Settings} from "./components/settings"
import {Dashboard} from "./components/dashboard"
import {Booksp} from "./components/booksp"


var changebook=false;


if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
}

class Container extends Component{

  constructor(props) {
    super(props);
  }

  render() {

    console.log(Home);
    
    return (
      <Router>
      <div className="cont">
      <div className="navbar">

      <div className="container">
      <h3 className="navbar-header">BookClub</h3>

      <ul className="nav navbar-nav navbar-right">

      { (username===undefined) && <li className="btnnav">
      <Link to="/signup">Sign up</Link>
      </li>}

      { 
        (username===undefined)?
        <li className="btnnav">
        <Link to="/login">Login</Link>
        </li>:
        <li className="btnnav">
        <a href="/logout">Logout</a>
        </li>
      }

      {(username!==undefined) && 
        <li className="btnnav">
        <Link to="/settings">Settings</Link>
        </li>
      }

      {(username!==undefined) && 
        <li className="btnnav">
        <Link to="/books">Books</Link>
        </li>
      }

      {(username!==undefined) && 
        <li className="btnnav">
        <Link to="/dashboard">Dashboard</Link>
        </li>
      }


      <li className="btnnav">
      <Link to="/">Home</Link>
      </li>
      </ul>

      </div>
      </div>

      <Route exact path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/books" component={Booksp} />
      <Route path="/signup" component={Signup} />
      <Route path="/settings" component={Settings} />
      </div>

      </Router>
      )

  }

}



ReactDOM.render(<Container />, document.getElementById('cont'));