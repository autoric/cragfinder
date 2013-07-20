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
        routes: [mongoose.Schema.Types.ObjectId]
    });

    //TODO: trails, access
    return mongoose.model('crags', CragSchema);
};
