var mongoose = require('mongoose');

module.exports = function (dal) {

    var CragSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        routes: [
            {
                _id: mongoose.Schema.Types.ObjectId,
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
            }
        ]
    });

    //TODO: trails, access
    return mongoose.model('crags', CragSchema);
};
