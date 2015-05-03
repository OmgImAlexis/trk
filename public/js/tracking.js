console.log('As we are in beta all metrics can be viewed at https://trk.wvvw.me/metrics');
if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1") {
    console.log('You don\'t want to be tracked so TrkTracking has been disabled for you.');
} else {
    console.log('Currently TrkTracking is tracking you, if you would like us not to then please enable the DNT option in your browser.');
    // FROM THIS PAGE!
    // http://clubmate.fi/setting-and-reading-cookies-with-javascript/
    function createCookie(e,t,n){var o;if(n){var i=new Date;i.setTime(i.getTime()+24*n*60*60*1e3),o="; expires="+i.toGMTString()}else o="";document.cookie=e+"="+t+o+"; path=/"}function readCookie(e){for(var t=e+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var i=n[o];" "===i.charAt(0);)i=i.substring(1,i.length);if(0===i.indexOf(t))return i.substring(t.length,i.length)}return null}function eraseCookie(e){createCookie(e,"",-1)}
    TrkTracking = {
        track: function(env) {
            if(typeof(env) == "undefined") { env = {}; }
            $.getScript('/api/read/json', function(){
                // send some miscellaneous info about the request
                env.width = window.screen.width;
                env.height = window.screen.height;
                env.path = window.location.pathname;
                env.blog_url = tumblr_api_read.tumblelog.name;

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
                img.src = 'http://192.168.1.158:4000/pixel.gif?' + params.join('&');
            });
        }
    };
    TrkTracking.track();
}
console.log('Checkout https://trk.wvvw.me to learn more.');
