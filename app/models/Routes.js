var mongoose = require('mongoose');

module.exports = function (dal) {

    var RouteSchema = new mongoose.Schema({
        name: {
            type: String,
            require: true
        },
        latitude: {
            type: Number,
            require: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            require: true,
            min: -180,
            max: 180
        },
        type: {
            type: String
        },
        grade: {
            type: String
        },
        quality: {
            type: Number
        },
        description: {
            type: String
        },
        tags: [String]
    });

    return mongoose.model('routes', RouteSchema);

}