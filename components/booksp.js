import React from "react";
import Books from "./books";
import {submit, getCookie} from './jsfunc'
import { Provider } from 'react-redux'
import { reducer } from '../reducer'
import { createStore } from 'redux'
const store = createStore(reducer)

if(document.cookie && getCookie("user")!=="undefined"){
	var user=JSON.parse(getCookie("user"));
	var username=user.name;
}

export const Booksp = () => (
	<div className="cont container">
	<h2>All Books</h2>
	<p>Click the to request <i className="glyphicon-retweet"></i> a trade</p>

	<Provider store={store}>
		<Books id="books" type="others"/>
	</Provider>

	</div>
	)