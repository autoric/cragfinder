var _ = require('underscore')

module.exports = function () {

    return function ErrorHandler(err, req, res, next) {
        console.error(err.stack);
        //check for validation errors - this is the format of a mongoose ValidationError
        if (err.name === 'ValidationError') {
            res.send(400, {
                developerMessage: 'A validation error has occurred. See "errors" for details.',
                userMessage: 'A validation error has occurred.',
                error: err.errors
            });
        }

        if (_.isNumber(err)) {
            return res.send(err, res.data);
        } else {
            return res.send(500, {
                developerMessage: 'An internal server error has occurred.',
                userMessage: 'An unexpected error was encountered',
                error: err.stack
            });
        }
    };

};