var mongoose = require('mongoose');

var metricSchema = new mongoose.Schema({
    visitor: {
        ip: String
    },
    width: Number,
    height: Number,
    path: String,
    ref: String,
    eventData: Object
});

module.exports = mongoose.model('Metric', metricSchema);
