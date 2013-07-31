var mongoose = require('mongoose');

module.exports = function (dal) {

    var RouteSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: true,
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
        tags: [String],
        crag: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'crags',
            required: true
        }
    });

    //TODO: define post save hook for calculation of the corresponding crag's
    return mongoose.model('routes', RouteSchema);
};