import React from "react";
import Input from "./input"
import {submit} from './jsfunc'

export const Login = () => (
<form className="form container" action="/signin" method="post" onSubmit={(event) =>submit(event)}>
      <div role="alert" id="alert" className="alert invisible"></div>

      <div id="log" className="form-group">

            <input type="email" name="email" placeholder="Email" id="form-email1" className="form-control" />
      </div>

      <div className="form-group">

            <Input type="password" placeholder="Password" value="" className="form-control"
            name="password" />
      </div>
      <button id="submit" type="submit" className="btn btn-primary">
            Sign in
      </button>
</form>
)