function serialize(form) {
    var result = [];
    if (typeof form === 'object' && form.nodeName === 'FORM')
        Array.prototype.slice.call(form.elements).forEach(function(control) {
            if (
                control.name && 
                !control.disabled && 
                ['file', 'reset', 'submit', 'button'].indexOf(control.type) === -1
            )
                if (control.type === 'select-multiple')
                    Array.prototype.slice.call(control.options).forEach(function(option) {
                        if (option.selected) 
                            result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(option.value));
                    });
                else if (
                    ['checkbox', 'radio'].indexOf(control.type) === -1 || 
                    control.checked
                ) result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(control.value));
        });
        return result.join('&').replace(/%20/g, '+');
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var Books = React.createClass({

  getInitialState: function() {
    return {data: []};
  },


   componentDidMount: function() {
   
  var th = this;
    this.serverRequest = 
      axios.get("/gets/userbooks?user="+this.props.user)
     
        .then(function(result) {    

          th.setState({
            data: result.data,
 
          });
      
        })
     
     
  },

render: function () {
console.log(this.state.data);
  return (
      <div id={this.props.id} >
  {this.state.data.map(function(item) {
  console.log(item.img);
          return (<img className="imgbook" src={item.img} height="42" width="42"/>)
      
      })}
  </div>
    );
  }

});

var Input = React.createClass({

  getInitialState: function() {
    return {value: this.props.value};
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
  },


render: function () {

  return (
      <input
        type={this.props.type}
        value={this.state.value}
        onChange={this.handleChange}
        id={this.props.id}
        name={this.props.name}
        placeholder={this.props.placeholder}
        className={this.props.className}
      />
    );
}

});

var Container = React.createClass({
 
  getInitialState: function () {
  var str=window.location.href;
str=str.split("//")[1];
str=str.split("/")[1];
    return { 
            page:str

           };
  },

  change: function(evt){

 window.history.pushState("", evt.target.value, "/"+evt.target.id);
  	this.setState({ page: evt.target.id});
  },
  
  logout: function(evt){

 window.location.href="/logout";
  },

  submit: function(ev){

    ev.preventDefault();

    var btn=ev.target.submit;
    var alert=ev.target.children.alert;
    console.log(ev.target.children.books);
    var value=btn.innerHTML;
    btn.innerHTML="<i class='fa fa-circle-o-notch fa-spin'></i>"+btn.innerHTML;
    btn.classList.add('disabled');
        $.ajax({
            type: ev.target.method,
            url: ev.target.action,
            data: serialize(ev.target),
            success: function (data) {

                if(alert){
                alert.classList.remove('invisible');
                alert.innerHTML=data.msg;
                }

                if(data.type=="ok"){
                alert.classList.remove('alert-danger');
                alert.classList.add('alert-success');
                }else if(data.type=="redirect"){
                window.location.href=data.msg;
                }
                else if(data.type=="denied"){
                alert.classList.remove('alert-success');
                alert.classList.add('alert-danger');
                }
                else if(data.type=="img"){

                ev.target.children.imgbook.classList.remove("invisible");
                ev.target.children.imgbook.setAttribute("src",data.msg);
                }

                btn.innerHTML=value;
                btn.classList.remove('disabled');
            }
        });

  },

  render: function () {

  if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
  console.log(username);
  }

  

  console.log(this.state.page);
          return (
          <div className="cont">
          	 <div className="navbar">
<h3>BookClub</h3>

<div id="btnsnav">

{() => {

if(username==undefined)
return<div className="btnnav" onClick={this.change} id="signup">Sign up</div>
}()}

{() => {
console.log(username);

if(username===undefined)
return<div className="btnnav" onClick={this.change} id="login">Login</div>
else
return<div className="btnnav" onClick={this.logout} id="logout">Logout</div>


}()}

{() => {
if(username!==undefined)
return<div className="btnnav" onClick={this.change} id="settings">Settings</div>
}()}

{() => {
if(username!==undefined)
return<div className="btnnav" onClick={this.change} id="books">Books</div>
}()}

{() => {
if(username!==undefined)
return<div className="btnnav" onClick={this.change} id="dashboard">Dashboard</div>
}()}


<div className="btnnav" onClick={this.change} id="home">Home</div>
</div>
</div>

{() => {
          if(this.state.page=="" || this.state.page=="home"){
          return<div className="cont"><div className="header"><h2>BookClub</h2><img className="icon" src="book-outline.png" width="100" height="100" /></div>
  
<div className="page">

<div className="feat">Books cataloque</div>
<div className="feat">Exchange books</div>
<div className="feat">Personal dashboard</div>

</div></div>
}else

          if(this.state.page=="login" && username===undefined){
       
          return<form className="form" action="/signin" method="post" onSubmit={this.submit}>
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
          }else if(this.state.page=="signup"  && username===undefined){
          
          return<form className="form" action="/register" method="post" onSubmit={this.submit}>
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
          }else if(this.state.page=="settings" && username!==undefined){
          
          return(<div>
          <form className="form" action="/update" method="post" onSubmit={this.submit}>
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
          <form className="form" action="/changepass" method="post" onSubmit={this.submit}>

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
         
          </div>)
          }else if(this.state.page=="dashboard"  && username!==undefined){
          console.log("dash");

          return(
          <div>
          <form className="form" action="/gets/addbook" method="get" onSubmit={this.submit}>
          <h2 style={{color:"black!important"}}>Your Books</h2>
          <input type="text" name="book" placeholder="Add Book" className="form-control"/>
          <button type="submit" id="submit" className="btn btn-primary">Add book</button><br/>
          <img className="invisible imgbook" src="" id="imgbook" height="42" width="42" />
          </form>
          <Books id="books" user={user.email}/>
          </div>)
          }else if(this.state.page=="books"  && username!==undefined){

          return(
          <div>
          <Books />
          </div>
          )
          }
}()}
          </div>
		
		)

}
  
});



ReactDOM.render(<Container />, document.getElementById('cont'));