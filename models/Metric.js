var mongoose = require('mongoose');

var metricSchema = new mongoose.Schema({
    page: {
        width: Number,
        height: Number,
        url: String,
        ref: String
    },
    eventData: Object
});

module.exports = mongoose.model('Metric', metricSchema);
