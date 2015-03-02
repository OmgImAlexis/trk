var mongoose = require('mongoose');

var visitorSchema = new mongoose.Schema({
    guid: String,
    ip: String
});

module.exports = mongoose.model('Visitor', visitorSchema);
