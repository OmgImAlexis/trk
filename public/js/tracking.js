// FROM THIS PAGE!
// http://clubmate.fi/setting-and-reading-cookies-with-javascript/
function createCookie(e,t,n){var o;if(n){var i=new Date;i.setTime(i.getTime()+24*n*60*60*1e3),o="; expires="+i.toGMTString()}else o="";document.cookie=e+"="+t+o+"; path=/"}function readCookie(e){for(var t=e+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var i=n[o];" "===i.charAt(0);)i=i.substring(1,i.length);if(0===i.indexOf(t))return i.substring(t.length,i.length)}return null}function eraseCookie(e){createCookie(e,"",-1)}
TrkTracking = {
    track: function(options) {
        console.log('As we are in beta all metrics can be viewed at https://trk.wvvw.me/metrics');
        if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1") {
            console.log('You don\'t want to be tracked so TrkTracking has been disabled for you.');
        } else {
            console.log('Currently TrkTracking is tracking you, if you would like us not to then please enable the DNT option in your browser.');
            var settings = $.extend({
                hitCounter: false,
                hitCounterText: ' views',
                onlineCounter: false,
                onlineCounterSingleText: ' user online',
                onlineCounterMultipleText: ' users online',
                followerCounter: false,
                followerCounterText: ' followers',
                topPosition: 28,
                gapSize: 22,
                server: 'https://trk.wvvw.me'
            }, options);
            var env = {};
            env.width = window.screen.width;
            env.height = window.screen.height;
            env.path = window.location.pathname;
            env.domain = window.location.hostname;
            if ($('link[rel="alternate"][href^="android-app"]').length) {
                env.blog_url = decodeURIComponent($('link[rel="alternate"][href^="android-app"]').attr('href')).split("?").pop().split("&").shift().split("=").pop();
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
            img.src = settings.server + '/pixel.gif?' + params.join('&');
            // img.src = 'http://localhost:4000/pixel.gif?' + params.join('&');

            var pos = [settings.topPosition, settings.topPosition + settings.gapSize, settings.topPosition + (settings.gapSize * 2)];

            if (settings.hitCounter) {
                $.ajax({
                    url: settings.server + '/blog/' + env.blog_url + '/hits?json=true',
                    dataType: 'jsonp',
                    success: function(data){
                        var a = document.createElement('a');
                        a.href = settings.server + '/blog/' + env.blog_url + '/hits';
                        a.text = data.hits + settings.hitCounterText;
                        a.className = 'btn';
                        a.style.cssText = 'position:fixed;top:' + pos.shift() + 'px;right:3px;';
                        document.getElementsByTagName('body')[0].appendChild(a);
                    }
                });
            }
            if (settings.onlineCounter) {
                $.ajax({
                    url: settings.server + '/blog/' + env.blog_url + '/online?json=true',
                    dataType: 'jsonp',
                    success: function(data){
                        var a = document.createElement('a');
                        a.href = settings.server + '/blog/' + env.blog_url + '/online';
                        a.text = (data.online === 0 ? 1 : data.online) + (data.online === 1 ? settings.onlineCounterSingleText : settings.onlineCounterMultipleText);
                        a.className = 'btn';
                        a.style.cssText = 'position:fixed;top:' + pos.shift() + 'px;right:3px;';
                        document.getElementsByTagName('body')[0].appendChild(a);
                    }
                });
            }
            if (settings.followerCounter) {
                $.ajax({
                    url: settings.server + '/blog/' + env.blog_url + '/followers?json=true',
                    dataType: 'jsonp',
                    success: function(data){
                        var a = document.createElement('a');
                        a.href = settings.server + '/blog/' + env.blog_url + '/followers';
                        a.text = data.followers + settings.followerCounterText;
                        a.className = 'btn';
                        a.style.cssText = 'position:fixed;top:' + pos.shift() + 'px;right:3px;';
                        document.getElementsByTagName('body')[0].appendChild(a);
                    }
                });
            }
        }
        console.log('Checkout ' + settings.server + ' to learn more.');
    }
};
