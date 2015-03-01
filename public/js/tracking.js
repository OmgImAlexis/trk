// FROM THIS PAGE!
// http://clubmate.fi/setting-and-reading-cookies-with-javascript/
function createCookie(e,t,n){var o;if(n){var i=new Date;i.setTime(i.getTime()+24*n*60*60*1e3),o="; expires="+i.toGMTString()}else o="";document.cookie=e+"="+t+o+"; path=/"}function readCookie(e){for(var t=e+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var i=n[o];" "===i.charAt(0);)i=i.substring(1,i.length);if(0===i.indexOf(t))return i.substring(t.length,i.length)}return null}function eraseCookie(e){createCookie(e,"",-1)}
TrkTracking = {
  track: function(env) {
    if(typeof(env) == "undefined") { env = {}; }

    // send some miscellaneous info about the request
    env.url = document.location.href;
    env.width = window.innerWidth;
    env.height = window.innerHeight;

    if(document.referrer && document.referrer != "") {
      env.ref = document.referrer;
    }

    if(!readCookie('trk_guid')){
        createCookie('trk_guid', (Math.floor(Math.random() * 10e12)), 30);
    }
    env.guid = readCookie('trk_guid');

    var params = [];
    for(var key in env) {
      if(env.hasOwnProperty(key)) {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(env[key]));
      }
    }

    var img = new Image();
    img.src = 'http://trk.wvvw.me/pixel.gif?' + params.join('&');
  }
};
TrkTracking.track();
