import React from "react";
import {submit} from './jsfunc'
import Input from "./input"

export const Signup = () => (
<form className="form container" action="/register" method="post" onSubmit={(event) =>submit(event)}>
	<div role="alert" id="alert" className="alert invisible"></div>

	<div id="reg" className="form-group">
		<Input type="text" id="name" name="name" placeholder="Full name" value="" className="form-control" />
	</div>

	<div className="form-group">

		<input type="email" name="email" placeholder="Email" className="form-control" />
	</div>

	<div className="form-group">

		<input type="password" placeholder="Password" className="form-control"
		name="password" />
	</div>
	<button id="submit" type="submit" className="btn btn-primary">
		Registrer
	</button>
</form>
)