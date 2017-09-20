var jsonuser=getCookie("user");
var jsonobj=JSON.parse(getCookie("json"));

		
             $(function() {
				 
				 $("#sign-in-with-twitter").text("Sign in with Twitter");
				$("#mypolls").css("display","none");
				$("#newpoll").css("display","none");
                $("#sign-in-with-twitter").on("click", function() {
                    window.location.href = "https://votingapp-isrmm.herokuapp.com/request-token";
                });
				 
				if(jsonuser!=="undefined"){
					$("#sign-in-with-twitter").text(JSON.parse(jsonuser).name+" Sign out");
					$("#mypolls").css("display","block");
					$("#newpoll").css("display","block");
					$("#sign-in-with-twitter").on("click", function() {
				     window.location.href="https://votingapp-isrmm.herokuapp.com/logout";
                });
					 
				}
            });
	 
function tweet(){
 window.open("https://twitter.com/intent/tweet?url=https://votingapp-isrmm.herokuapp.com/polls/"+jsonobj._id+"&text="+jsonobj.title,"_blank","toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");

}

function send(){
var obj;
	
	if(document.getElementById('selec').value!=="ownop"){
	obj=JSON.parse(Get("https://votingapp-isrmm.herokuapp.com/vote/"+jsonobj._id+"?opt="+document.getElementById('selec').value));
	}
	else{
	obj=JSON.parse(Get("https://votingapp-isrmm.herokuapp.com/vote/"+jsonobj._id+"?opt="+document.getElementById('ownop').value));
	}
	
alert(obj.msg);
window.location.href=window.location.href;
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
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