var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Metric = require('./models/Metric');
    Visitor = require('./models/Visitor');

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
    console.log(req.headers);
});

app.get('/pixel.gif', function(req, res) {
    var buf = new Buffer(35);
    buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
    res.send(buf, { 'Content-Type': 'image/gif' }, 200);
    var data = JSON.parse(JSON.stringify(req.query));
    delete data.width;
    delete data.height;
    delete data.url;
    delete data.ref;
    Visitor.find({guid: req.query.guid}, function(err, visitor){
        if (err) console.log(err);
        var finished = _.after(1, doContinue);
        if (!visitor) {
            var visitor = new Visitor({
                guid: req.query.guid,
                ip: req.headers['cf-connecting-ip']
            });
            visitor.save(function(err, visitor){
                if (err) console.log(err);
                console.log(visitor);
            });
            finished();
        } else {
            if(visitor.ip != req.headers['cf-connecting-ip']) {
                Visitor.update({guid: req.query.guid}, {$set: {ip: req.headers['cf-connecting-ip']}}, function(err, visitor){
                    if (err) console.log(err);
                    if(visitor == 1) {
                        console.log('Visitor\'s IP updated to: ' + req.headers['cf-connecting-ip']);
                    }
                });
            }
            finished();
        }
        function doContinue(){
            var metric = new Metric({
                visitor: {
                    ip: req.headers['cf-connecting-ip']
                },
                page: {
                    width: req.query.width,
                    height: req.query.height,
                    url: req.query.url,
                    ref: req.query.ref
                },
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
    // Metric.find().limit(100).exec(function(err, metrics) {
    //     res.send(metrics);
    // });
});

app.get('/visitors', function(req, res) {
    Visitor.aggregate([
    { $match: {} },
    { $sort: { _id: -1 } },
    { $limit: 100 }], function(err, visitors){
        res.send(visitors);
    });
    // Metric.find().limit(100).exec(function(err, metrics) {
    //     res.send(metrics);
    // });
});

app.listen(3000);
