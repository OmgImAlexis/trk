console.log('As we are in beta all metrics can be viewed at https://trk.wvvw.me/metrics');
if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1") {
    console.log('You don\'t want to be tracked so TrkTracking has been disabled for you.');
} else {
    console.log('Currently TrkTracking is tracking you, if you would like us not to then please enable the DNT option in your browser.');
    // FROM THIS PAGE!
    // http://clubmate.fi/setting-and-reading-cookies-with-javascript/
    function createCookie(e,t,n){var o;if(n){var i=new Date;i.setTime(i.getTime()+24*n*60*60*1e3),o="; expires="+i.toGMTString()}else o="";document.cookie=e+"="+t+o+"; path=/"}function readCookie(e){for(var t=e+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var i=n[o];" "===i.charAt(0);)i=i.substring(1,i.length);if(0===i.indexOf(t))return i.substring(t.length,i.length)}return null}function eraseCookie(e){createCookie(e,"",-1)}
    TrkTracking = {
        track: function(options) {
            var settings = $.extend({
                hitCounter: false,
                hitCounterText: ' views',
                onlineCounter: false,
                onlineCounterSingleText: ' user online',
                onlineCounterMultipleText: ' users online',
                followerCounter: false,
                followerCounterText: ' followers',
                topPosition: 28
            }, options);
            var env = {};
            env.width = window.screen.width;
            env.height = window.screen.height;
            env.path = window.location.pathname;
            env.domain = window.location.hostname;
            if ($('link[rel="alternate"][href^="android-app"]').length) {
                env.blog_url = $('link[rel="alternate"][href^="android-app"]').attr('href').split("?").pop().split("=").pop();
            }

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
            img.src = 'https://trk.wvvw.me/pixel.gif?' + params.join('&');
            // img.src = 'http://localhost:4000/pixel.gif?' + params.join('&');
            if (settings.hitCounter) {
                $.ajax({
                    url: 'https://trk.wvvw.me/blog/' + tumblr_api_read.tumblelog.name + '/hits?json=true',
                    dataType: 'jsonp',
                    success: function(data){
                        var a = document.createElement('a');
                        a.href = 'https://trk.wvvw.me/blog/' + tumblr_api_read.tumblelog.name;
                        a.text = data.hits + settings.hitCounterText;
                        a.className = 'btn';
                        a.style.cssText = 'position:fixed;top:28px;right:3px;';
                        document.getElementsByTagName('body')[0].appendChild(a);
                    }
                });
            }
            if (settings.onlineCounter) {
                $.ajax({
                    url: 'https://trk.wvvw.me/blog/' + tumblr_api_read.tumblelog.name + '/online?json=true',
                    dataType: 'jsonp',
                    success: function(data){
                        var a = document.createElement('a');
                        a.href = 'https://trk.wvvw.me/blog/' + tumblr_api_read.tumblelog.name;
                        a.text = (data.online == 0 ? '1' : data.online) + (data.online == 1 ? settings.onlineCounterSingleText : settings.onlineCounterMultipleText);
                        a.className = 'btn';
                        a.style.cssText = 'position:fixed;top:50px;right:3px;';
                        document.getElementsByTagName('body')[0].appendChild(a);
                    }
                });
            }
            if (settings.followerCounter) {
                $.ajax({
                    url: 'https://trk.wvvw.me/blog/' + tumblr_api_read.tumblelog.name + '/followers?json=true',
                    dataType: 'jsonp',
                    success: function(data){
                        var a = document.createElement('a');
                        a.href = 'https://trk.wvvw.me/blog/' + tumblr_api_read.tumblelog.name;
                        a.text = data.followers + settings.followerCounterText;
                        a.className = 'btn';
                        a.style.cssText = 'position:fixed;top:72px;right:3px;';
                        document.getElementsByTagName('body')[0].appendChild(a);
                    }
                });
            }

        }
    };
}
console.log('Checkout https://trk.wvvw.me to learn more.');
