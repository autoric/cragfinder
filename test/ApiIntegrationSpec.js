var expect = require('expect.js'),
    _ = require('underscore'),
    request = require('supertest'),
    cragfinder = require('..');

xdescribe('REST api', function () {
    var crags = [
        {
            name: 'Cooper\'s Rock State Park',
            description: 'State park near morgantown wv'
        },
        {
            name: 'The Gunks'
        },
        {
            name: 'El Dorado Canyon',
            description: 'The best in the west'
        }
    ];
    var app = cragfinder.app;


    beforeEach(function (done) {
        cragfinder.Crags.remove({}, function () {
            cragfinder.Crags.create(crags, done);
        });
    });


    describe('GET /crags', function () {
        var makeRequest = function (args) {
            return request(app).get('/api/crags' + (args || ''));
        }

        it('returns json', function (done) {
            makeRequest().expect('Content-Type', /json/, done);
        });

        it('returns 200', function (done) {
            makeRequest().expect(200, done);
        });

        it('returns a wrapped json object with meta and data keys', function (done) {
            makeRequest().end(function (err, res) {
                if (err) return done(err);
                var body = res.body;
                expect(body).to.have.property('meta');
                expect(body).to.have.property('data');
                done();
            });
        });

        it('meta has the correct limit, offset and count', function (done) {
            makeRequest().end(function (err, res) {
                if (err) return done(err);
                var meta = res.body.meta;
                expect(meta).to.have.property('limit');
                expect(meta).to.have.property('offset');
                expect(meta).to.have.property('count');

                expect(meta.limit).to.equal(20);
                expect(meta.offset).to.equal(0);
                expect(meta.count).to.equal(crags.length);
                return done();
            })
        });

        it('data passes the crags data through', function (done) {
            makeRequest().end(function (err, res) {
                if (err) return done(err);
                var data = res.body.data;

                expect(documentCompare(data, crags)).to.be(true);
                return done();
            });
        });

        it('respects the limit argument', function (done) {
            makeRequest('?limit=2').end(function (err, res) {
                if (err) return done(err);
                var data = res.body.data;

                expect(documentCompare(data, crags.slice(0, 2))).to.be(true);
                return done();
            });
        });

        it('respect the offset argument', function (done) {
            makeRequest('?offset=1').end(function (err, res) {
                if (err) return done(err);
                var data = res.body.data;

                expect(documentCompare(data, crags.slice(1))).to.be(true);
                return done();
            });
        });

        it('provides a valid next url', function (done) {
            makeRequest('?limit=2&offset=0').end(function (err, res) {
                if (err) return done(err);
                var meta = res.body.meta;
                var page1 = res.body.data;

                expect(meta).to.have.property('next');
                expect(meta.next).to.equal('/api/crags?limit=2&offset=2');
                request(app).get(meta.next).end(function (err, res) {
                    if (err) return done(err);
                    var page2 = res.body.data,
                        allPages = _.union(page1, page2);

                    expect(documentCompare(allPages, crags)).to.be(true);
                    return done();
                });
            });
        });

        it('provides a valid prev url', function (done) {
            makeRequest('?limit=2&offset=1').end(function (err, res) {
                if (err) return done(err);
                var meta = res.body.meta;
                var page2 = res.body.data;

                expect(meta).to.have.property('prev');
                expect(meta.prev).to.equal('/api/crags?limit=2&offset=0');
                request(app).get(meta.prev).end(function (err, res) {
                    if (err) return done(err);
                    var page1 = res.body.data,
                        allPages = _.union(page1.slice(0,1), page2);

                    expect(documentCompare(allPages, crags)).to.be(true);
                    return done();
                });
            });
        });

        it('returns the fields argument on meta', function(done){
            makeRequest('?fields=name').end(function(err, res){
                if(err) return done(err);
                var meta = res.body.meta;

                expect(meta).to.have.property('fields');
                expect(meta.fields).equal('name');
                return done();
            });
        });

        it('respects the fields argument', function(done){
            makeRequest('?fields=name').end(function(err, res){
                if(err) return done(err);
                var data = res.body.data;

                expect(data).to.be.an('array');
                data.forEach(function(crag, i){
                    expect(crag).to.have.property('name');
                    expect(crag).not.to.have.property('description');
                    expect(crag.name).to.equal(crags[i].name);
                })
                return done();
            });
        })
    });

    describe('POST /crags', function(){

        it('')

    });


});

function documentCompare(dbDoc, localDoc) {
    var result = true;

    if(_.isArray(dbDoc)) {
        _.each(dbDoc, function(doc, i){
            result = result && documentCompare(dbDoc[i], localDoc[i]);
        });
        return result;
    }

    _.each(localDoc, function(val, key) {
        result = result && (dbDoc[key] === val);
    });

    return result;
}