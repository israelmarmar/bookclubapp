import React from "react";
import Books from "./books";
import Books2 from "./books2";
import {submit, getCookie} from './jsfunc'
import { Provider } from 'react-redux'
import { reducer } from '../reducer'
import { createStore } from 'redux'
const store = createStore(reducer)


if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
}

export const Dashboard = () => (
<div className="cont container">
      <form className="form" action="/gets/addbook" method="get" onSubmit={(event) =>submit(event, store.dispatch)}>
            <h2 style={{color:"black!important"}}>Your Books</h2>
            <input type="text" name="book" placeholder="Add Book" className="form-control"/>
            <button type="submit" id="submit" className="btn btn-primary">Add book</button><br/>
            
      </form>
      <br />

      <Provider store={store}>
        <Books id="books" user={user.email}/>
      </Provider>

      <h2>Your Requests</h2>
      
      <h3>Incoming</h3>
      <Books2 type="in"/>

      <h3>Outcoming</h3>
      <Books2 type="out"/>
      
</div>
)