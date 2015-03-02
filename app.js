var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Metric = require('./models/Metric');

app = express();
mongoose.connect('mongodb://localhost/trk'),

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

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
app.use(express.static(__dirname + '/public'));

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
    delete data.url;
    delete data.ref;
    var metric = new Metric({
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
});

app.get('/metrics', function(req, res) {
    Metric.find({}).sort({'_id': -1}).limit(10).exec(function(err, metrics) {
        res.send(metrics);
    });
});

app.listen(3000);
