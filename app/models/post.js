// app/models/user.js
// load the things we need

var mongoose = require('mongoose');

var postSchema = mongoose.Schema({

    title: { type: String, required: true },
    body: { type: String, required: true },
    created_at: { type: Date, default: Date.now }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
