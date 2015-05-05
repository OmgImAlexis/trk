var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    async = require('async'),
    Metric = require('./models/Metric'),
    Session = require('./models/Session');

app = express();
mongoose.connect('mongodb://localhost/trk'),

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public', { redirect : false }));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/pixel.gif', function(req, res) {
    var buf = new Buffer(35);
    buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
    res.send(buf, { 'Content-Type': 'image/gif' }, 200);
    var data = JSON.parse(JSON.stringify(req.query));
    delete data.width;
    delete data.height;
    delete data.domain;
    delete data.ref;
    delete data.path;
    delete data.guid;
    var finished = _.after(1, doContinue);
    Session.findOne({guid: req.query.guid}, function(err, session) {
        if(!err) {
            if(!session) {
                session = new Session({
                    guid: req.query.guid
                });
            }
            session.lastOnline = new Date();
            session.blog_url = req.query.blog_url;
            session.save(function(err) {
                if(err) console.log(err);
            });
            finished();
        }
    });
    function doContinue(){
        var metric = new Metric({
            ip: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'],
            guid: req.query.guid,
            width: req.query.width,
            height: req.query.height,
            domain: req.query.domain,
            path: req.query.path,
            ref: req.query.ref,
            eventData: data
        });
        metric.save(function(err, metric){
            if (err) console.log(err);
        });

    };
});

app.get('/metrics', function(req, res) {
    Metric.aggregate([
    { $match: {} },
    { $sort: { _id: -1 } },
    { $limit: 100 }], function(err, metrics){
        res.send(metrics);
    });
});

app.get('/blog/:blog_url', function(req, res) {
    Metric.find({ 'eventData.blog_url': req.params.blog_url }).sort({ _id: -1 }).limit(100).exec(function(err, metrics){
        res.send(metrics);
    });
});

app.get('/blog/:blog_url/hits', function(req, res) {
    var blogUrl = req.params.blog_url;
    Metric.count({ 'eventData.blog_url': req.params.blog_url }, function(err, hits){
        if(req.query.callback || req.query.json){
            res.jsonp({
                hits: hits
            });
        } else {
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            async.parallel([
                function(callback){
                    Metric.count({
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate()-1)),
                            $lt: new Date(new Date().setDate(new Date().getDate()))
                        },
                        'eventData.blog_url': blogUrl
                    }).exec(function(err, count){
                        if(err) console.log(err);
                        callback(null, {
                            'day': days[new Date().getDay()],
                            'count': count
                        });
                    });
                },
                function(callback){
                    Metric.count({
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate()-2)),
                            $lt: new Date(new Date().setDate(new Date().getDate()-1))
                        },
                        'eventData.blog_url': blogUrl
                    }).exec(function(err, count){
                        if(err) console.log(err);
                        callback(null, {
                            'day': days[new Date(new Date().setDate(new Date().getDate()-1)).getDay()],
                            'count': count
                        });
                    });
                },
                function(callback){
                    Metric.count({
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate()-3)),
                            $lt: new Date(new Date().setDate(new Date().getDate()-2))
                        },
                        'eventData.blog_url': blogUrl
                    }).exec(function(err, count){
                        if(err) console.log(err);
                        callback(null,  {
                            'day': days[new Date(new Date().setDate(new Date().getDate()-2)).getDay()],
                            'count': count
                        });
                    });
                },
                function(callback){
                    Metric.count({
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate()-3)),
                            $lt: new Date(new Date().setDate(new Date().getDate()-4))
                        },
                        'eventData.blog_url': blogUrl
                    }).exec(function(err, count){
                        if(err) console.log(err);
                        callback(null,  {
                            'day': days[new Date(new Date().setDate(new Date().getDate()-3)).getDay()],
                            'count': count
                        });
                    });
                },
                function(callback){
                    Metric.count({
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate()-4)),
                            $lt: new Date(new Date().setDate(new Date().getDate()-5))
                        },
                        'eventData.blog_url': blogUrl
                    }).exec(function(err, count){
                        if(err) console.log(err);
                        callback(null,  {
                            'day': days[new Date(new Date().setDate(new Date().getDate()-4)).getDay()],
                            'count': count
                        });
                    });
                },
                function(callback){
                    Metric.count({
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate()-5)),
                            $lt: new Date(new Date().setDate(new Date().getDate()-6))
                        },
                        'eventData.blog_url': blogUrl
                    }).exec(function(err, count){
                        if(err) console.log(err);
                        callback(null,  {
                            'day': days[new Date(new Date().setDate(new Date().getDate()-5)).getDay()],
                            'count': count
                        });
                    });
                },
                function(callback){
                    Metric.count({
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate()-6)),
                            $lt: new Date(new Date().setDate(new Date().getDate()-7))
                        },
                        'eventData.blog_url': blogUrl
                    }).exec(function(err, count){
                        if(err) console.log(err);
                        callback(null,  {
                            'day': days[new Date(new Date().setDate(new Date().getDate()-6)).getDay()],
                            'count': count
                        });
                    });
                }
            ],
            // optional callback
            function(err, results){
                var labels = [];
                results.forEach(function(e){
                    e.day == days[new Date().getDay()] ? labels.push("Today") : labels.push(e.day);
                });
                var data = [];
                results.forEach(function(e){
                    data.push(e.count);
                });
                res.render('blog/online', {
                    labels: JSON.stringify(labels.reverse()),
                    data: JSON.stringify(data.reverse()),
                });
            });
        }
    });
});

app.get('/blog/:blog_url/online', function(req, res) {
    Session.count({ blog_url: req.params.blog_url }, function(err, online){
        if(req.query.callback || req.query.json){
            res.jsonp({
                online: online
            });
        } else {
            res.send({
                todo: 'todo'
            });
        }
    });
});

// app.get('/site/:url', function(req, res){
//     var unique = req.query.unique ? true : false;
//     var limit = req.query.limit ? req.query.limit : 100;
//     Metric.find({'page.url': new RegExp(req.params.url, 'i'), 'page.ref': {$exists: unique}}).limit(limit).exec(function(err, metrics){
//         var data = {
//             count: Object.keys(metrics).length,
//             metrics: metrics
//         };
//         res.send(data);
//     });
// });
//
// app.get('/urls', function(req, res){
//     Metric.find({}, 'page.ref', function (err, data) {
//         var urls = [];
//         var finished = _.after(data.length, doFinish);
//         for (var key in data.urls) {
//             if (data.urls.hasOwnProperty(key)) {
//                 if (data.urls[key.page].ref) {
//                     u.push(data.urls[key].page.ref);
//                 }
//             }
//         }
//         function doFinish() {
//             res.send({
//                 urls: urls
//             });
//         }
//     });
// });

app.listen(4000);
