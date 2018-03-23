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