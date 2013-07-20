var expect = require('expect.js'),
    constants = require('../app/lib/constants'),
    apiArgsParser = require('../app/middleware/ApiArgsParser')(constants);

describe('apiArgsParser', function () {
    var req,
        res;

    beforeEach(function () {
        req = {
            query: {}
        };
        res = {};
    });

    it('creates a conditions object', function(done) {
        apiArgsParser(req, res, function(){
            expect(req).to.have.property('conditions');

            expect(req.conditions).to.eql({});
            return done();
        });
    });

    it('handles no fields correctly', function (done) {
        apiArgsParser(req, res, function () {
            expect(req).to.have.property('fields');

            expect(req.fields).to.equal('');
            return done();
        });
    });

    it('splits fields', function (done) {
        req.query.fields = 'name,description';

        apiArgsParser(req, res, function () {
            expect(req).to.have.property('fields');

            expect(req.fields).to.equal('name description');
            return done();
        });
    });

    it('sets default limit and offset', function (done) {
        apiArgsParser(req, res, function () {
            expect(req).to.have.property('opts');
            expect(req.opts).to.have.property('limit');
            expect(req.opts).to.have.property('skip');

            expect(req.opts.limit).to.equal(constants["API.LIMIT"]);
            expect(req.opts.skip).to.equal(0);
            return done();
        });
    });

    it('sets default limit and offset', function (done) {
        req.query.limit = 9;
        req.query.offset = 17;

        apiArgsParser(req, res, function () {
            expect(req).to.have.property('opts');
            expect(req.opts).to.have.property('limit');
            expect(req.opts).to.have.property('skip');

            expect(req.opts.limit).to.equal(req.query.limit);
            expect(req.opts.skip).to.equal(req.query.offset);
            return done();
        });
    });
});