var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    lastOnline: {
        type: Date,
        default: Date.now
    },
    blog_url: String,
    guid: String
});

module.exports = mongoose.model('Session', sessionSchema);
