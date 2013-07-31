var expect = require('expect.js'),
    constants = require('../app/lib/constants'),
    apiParseQS = require('../app/middleware/ApiParseQS')(constants),
    mongoose = require('mongoose');

describe('apiParseQS', function () {
    var req,
        res,
        schema = new mongoose.Schema({
            name: String,
            binary: Buffer,
            living: Boolean,
            updated: { type: Date, default: Date.now },
            age: { type: Number, min: 18, max: 65 },
            mixed: mongoose.Schema.Types.Mixed,
            _someId: mongoose.Schema.Types.ObjectId,
            array: [],
            ofString: [String],
            ofNumber: [Number],
            ofDates: [Date],
            ofBuffer: [Buffer],
            ofBoolean: [Boolean],
            ofMixed: [mongoose.Schema.Types.Mixed],
            ofObjectId: [mongoose.Schema.Types.ObjectId],
            nested: {
                stuff: { type: String, lowercase: true, trim: true }
            },
            ofNested: [
                {
                    _id: mongoose.Schema.ObjectId,
                    name: String,
                    ofString: [String]
                }
            ]
        }),
        Model = mongoose.model('testmodel', schema);

    beforeEach(function () {
        req = {
            query: {},
            Model: Model,
            documents: []
        };
        res = {};
    });

    it('creates a conditions object', function (done) {
        apiParseQS(req, res, function () {
            expect(req).to.have.property('conditions');

            expect(req.conditions).to.eql({});
            return done();
        });
    });

    it('sets default limit and offset', function (done) {
        apiParseQS(req, res, function () {
            expect(req).to.have.property('opts');
            expect(req.opts).to.have.property('limit');
            expect(req.opts).to.have.property('skip');

            expect(req.opts.limit).to.equal(constants["API.LIMIT"]);
            expect(req.opts.skip).to.equal(0);
            return done();
        });
    });

    it('prases limit and offset to numbers', function (done) {
        req.query.limit = '9';
        req.query.offset = '17';

        apiParseQS(req, res, function () {
            expect(req.opts).to.have.property('limit');
            expect(req.opts).to.have.property('skip');

            expect(req.opts.limit).to.be.a('number');
            expect(req.opts.skip).to.be.a('number');
            return done();
        });
    });

    it('sets default limit and offset', function (done) {
        req.query.limit = '9';
        req.query.offset = '17';

        apiParseQS(req, res, function () {
            expect(req.opts).to.have.property('limit');
            expect(req.opts).to.have.property('skip');

            expect(req.opts.limit).to.equal(9);
            expect(req.opts.skip).to.equal(17);
            return done();
        });
    });

    it('without a fields argument, sets fields empty string', function (done) {
        apiParseQS(req, res, function () {
            expect(req).to.have.property('fields');

            expect(req.fields).to.equal('');
            return done();
        });
    });

    it('splits fields', function (done) {
        req.query.fields = 'name,binary';

        apiParseQS(req, res, function () {
            expect(req).to.have.property('fields');

            expect(req.fields).to.equal('name binary');
            return done();
        });
    });
});