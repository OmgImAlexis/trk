var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Metric = require('./models/Metric'),
    Visitor = require('./models/Visitor'),
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

var env = process.env.NODE_ENV || 'production';

if (env != 'dev') {
    app.use(function(req, res, next) {
        if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
            res.redirect('https://' + req.get('Host') + req.url);
        } else {
            next();
        }
    });
}

app.get('/', function(req, res){
    res.render('index');
});

app.get('/pixel.gif', function(req, res) {
    var buf = new Buffer(35);
    buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
    res.send(buf, { 'Content-Type': 'image/gif' }, 200);
    var data = JSON.parse(JSON.stringify(req.query));
    data.ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'];
    delete data.width;
    delete data.height;
    delete data.url;
    delete data.ref;
    delete data.path;
    Visitor.findOne({guid: req.query.guid}, function(err, visitor){
        if (err) console.log(err);
        var finished = _.after(2, doContinue);
        if (!visitor) {
            var newVisitor = new Visitor({
                guid: req.query.guid,
                ip: data.ip
            });
            newVisitor.save(function(err, visitor){
                if (err) console.log(err);
            });
            finished();
        } else {
            if(visitor.ip != data.ip) {
                Visitor.update({guid: req.query.guid}, {$set: {ip: data.ip}}, function(err, visitor){
                    if (err) console.log(err);
                    if(visitor == 1) {
                        console.log('Visitor\'s IP updated to: ' + data.ip);
                    }
                });
            }
            finished();
        }
        Session.findOne({guid: req.query.guid}, function(err, session) {
            if(!err) {
                if(!session) {
                    session = new Session({
                        guid: req.query.guid,
                        blog_url: req.query.blog_url
                    });
                }
                session.lastOnline = new Date();
                session.save(function(err) {
                    if(err) console.log(err);
                    console.log('session saved');
                });
                finished();
            }
        });
        function doContinue(){
            var metric = new Metric({
                visitor: {
                    ip: data.ip
                },
                width: req.query.width,
                height: req.query.height,
                path: req.query.path,
                ref: req.query.ref,
                eventData: data
            });
            metric.save(function(err, metric){
                if (err) console.log(err);
                console.log('Metric saved!');
            });

        };
    });
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
    Metric.find({ 'eventData.blog_url': req.params.blog_url }).sort({ _id: -1 }).limit(100).exec(function(err, visitors){
        res.send(visitors);
    });
});

app.get('/blog/:blog_url/hits', function(req, res) {
    Metric.count({ 'eventData.blog_url': req.params.blog_url }, function(err, hits){
        res.jsonp({
            hits: hits
        });
    });
});

app.get('/blog/:blog_url/online', function(req, res) {
    Session.count({ blog_url: req.params.blog_url }, function(err, online){
        res.jsonp({
            online: online
        });
    });
});
//
// app.get('/visitors', function(req, res) {
//     Visitor.aggregate([
//     { $match: {} },
//     { $sort: { _id: -1 } },
//     { $limit: 100 }], function(err, visitors){
//         res.send(visitors);
//     });
// });
//
// app.get('/visitor/:guid', function(req, res){
//     Metric.aggregate([
//     { $match: { 'eventData.guid': req.params.guid } },
//     { $sort: { _id: -1 } },
//     { $limit: 100 }], function(err, metrics){
//         res.send(metrics);
//     });
// });
//
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
