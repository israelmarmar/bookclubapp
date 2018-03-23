import React from "react";
import Input from "./input"
import {submit, getCookie} from './jsfunc'

if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
}


export const Settings = () => (
<div>
      <form className="form container" action="/update" method="post" onSubmit={(event) =>submit(event)}>
            <h2 style={{color:"black!important"}}>Update profile</h2>
            <div role="alert" id="alert" className="alert invisible"></div>
            <div className="form-group">
                  <Input type="text" id="name" name="name" placeholder="Full name" value={username} className="form-control" />
            </div>

            <div className="form-group">
                  <Input type="text" name="country" placeholder="Country" value={user.country} className="form-control" />
            </div>

            <div className="form-group">
                  <Input type="text" name="town" placeholder="Town" value={user.town} className="form-control" />
            </div>

            <button type="submit" id="submit" className="btn btn-success">
                  Update
            </button>
      </form>
      <form className="form container" action="/changepass" method="post" onSubmit={(event) =>submit(event)}>

            <h2 style={{color:"black!important"}}>Change password</h2>
            <div role="alert" id="alert" className="alert invisible"></div>
            <div className="form-group">
                  <input type="password" placeholder="old password" className="form-control"
                  name="oldpassword" />
            </div>

            <div className="form-group">
                  <input type="password" placeholder="new password" className="form-control"
                  name="newpassword" />
            </div>
            <button type="submit" id="submit" className="btn btn-success">
                  Change
            </button>       
      </form>
      
</div>
)