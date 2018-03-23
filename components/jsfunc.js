import $ from "jquery";
import { actionCreators } from '../reducer'

export function serialize(form) {
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

export function getCookie(cname) {
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

export function submit(ev, dispatch){

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
              console.log("img")
              dispatch(actionCreators.add([data.msg]))
            }

            btn.innerHTML=value;
            btn.classList.remove('disabled');
          }
        });

}
