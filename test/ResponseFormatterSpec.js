var expect = require('expect.js'),
    apiResponseFormatter = require('../app/middleware/ApiResponseFormatter')();

describe('ApiResponseFormatter', function () {
    var req,
        res;

    beforeEach(function () {
        req = {
            originalUrl: '/api/crags',
            opts: {}
        };

        res = {
            meta: {},
            data: {}
        };
    });

    it('passes along data object', function (done) {
        res.data = {
            hello: 'world'
        };

        res.json = function (r) {
            expect(r).to.have.property('data');
            expect(r.data).to.eql(res.data);
            return done();
        }

        apiResponseFormatter(req, res);
    });

    it('returns an empty meta object when no metadata is provided', function (done) {
        res.data = {
            hello: 'world'
        };

        res.json = function (r) {
            expect(r).to.have.property('meta');
            expect(r.meta).to.eql({});
            return done();
        }

        apiResponseFormatter(req, res);
    });

    it('count, limit, and offset metadata is passed through', function (done) {
        res.meta.count = 123;
        req.opts.limit = 5;
        req.opts.skip = 0;

        res.json = function (r) {
            expect(r.meta).to.have.property('count');
            expect(r.meta).to.have.property('limit');
            expect(r.meta).to.have.property('offset');

            expect(r.meta.count).to.equal(res.meta.count);
            expect(r.meta.limit).to.equal(res.meta.limit);
            expect(r.meta.offset).to.equal(res.meta.offset);
            return done();
        }

        apiResponseFormatter(req, res);
    });

    it('calculates nex url correctly', function (done) {
        req.originalUrl = req.originalUrl+'?limit=5';
        res.meta.count = 200;
        req.opts.limit =5;
        req.opts.skip = 0;

        res.json = function (r) {
            expect(r.meta).to.have.property('next');

            expect(r.meta.next).to.equal('/api/crags?limit=5&offset=5');
            return done();
        }

        apiResponseFormatter(req, res);
    });

    it('does not return a next url when the current data set is the tail', function(done){
        req.originalUrl = req.originalUrl+'?limit=50&offset=179';
        res.meta.count = 200;
        req.opts.limit =50;
        req.opts.skip = 179;

        res.json = function (r) {
            expect(r.meta).not.to.have.property('next');
            return done();
        }

        apiResponseFormatter(req, res);
    });

    it('calculates prev url correctly', function (done) {
        req.originalUrl = req.originalUrl+'?limit=5&offset=20';
        res.meta.count = 200;
        req.opts.limit =5;
        req.opts.skip = 20;

        res.json = function (r) {
            expect(r.meta).to.have.property('prev');

            expect(r.meta.prev).to.equal('/api/crags?limit=5&offset=15');
            return done();
        }

        apiResponseFormatter(req, res);
    });

    it('does not return a prev url when the current data set is the head', function(done){
        req.originalUrl = req.originalUrl+'?limit=50';
        res.meta.count = 200;
        req.opts.limit =50;
        req.opts.skip = 0;

        res.json = function (r) {
            expect(r.meta).not.to.have.property('prev');
            return done();
        }

        apiResponseFormatter(req, res);
    });

    it('caps offset at zero', function(done) {
        req.originalUrl = req.originalUrl+'?limit=50&offset=20';
        res.meta.count = 200;
        req.opts.limit =50;
        req.opts.skip = 20;

        res.json = function (r) {
            expect(r.meta).to.have.property('prev');

            expect(r.meta.prev).to.equal('/api/crags?limit=50&offset=0');
            return done();
        }

        apiResponseFormatter(req, res);
    });
});