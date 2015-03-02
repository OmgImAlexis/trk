var mongoose = require('mongoose');

var metricSchema = new mongoose.Schema({
    visitor: {
        ip: String
    },
    page: {
        width: Number,
        height: Number,
        url: String,
        ref: String
    },
    eventData: Object
});

module.exports = mongoose.model('Metric', metricSchema);
