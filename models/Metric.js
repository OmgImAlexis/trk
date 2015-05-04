var mongoose = require('mongoose');

var metricSchema = new mongoose.Schema({
    ip: String,
    guid: String,
    width: Number,
    height: Number,
    domain: String,
    path: String,
    ref: String,
    eventData: Object,
    createdAt: Date
});

metricSchema.pre('save', function(next){
    if(!this.createdAt) {
        this.createdAt = this._id.getTimestamp();
    }
    next();
});

module.exports = mongoose.model('Metric', metricSchema);
