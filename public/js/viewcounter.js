window.onload = function() {
    $.getScript('/api/read/json', function(){
        var blog_url = tumblr_api_read.tumblelog.name;
        $.ajax({
            url: 'https://trk.wvvw.me/blog/' + blog_url + '/hits?json=true',
            dataType: 'jsonp',
            success: function(data){
                var a = document.createElement('a');
                a.href = 'https://trk.wvvw.me/blog/' + blog_url;
                a.text = data.hits + ' Visits';
                document.getElementsByTagName('body')[0].appendChild(a);
            }
        });
    });
};
