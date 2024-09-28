var browserSync = require("../../../../");
var request = require("supertest");
var assert = require("chai").assert;

describe("E2E server test with serve static options", function() {
    it("sets the index of serve-static", function(done) {
        browserSync.reset();

        var config = {
            server: {
                baseDir: "test/fixtures",
                serveStaticOptions: {
                    index: "inputs.html"
                }
            },
            logLevel: "silent",
            open: false
        };

        browserSync.create().init(config, function(err, bs) {
            assert.equal(
                bs.options.getIn(["server", "serveStaticOptions", "index"]),
                "inputs.html"
            );
            request(bs.server)
                .get("/")
                .expect(200)
                .end(function(err, res) {
                    assert.deepEqual(
                        require("fs").readFileSync(
                            "test/fixtures/inputs.html",
                            "utf-8"
                        ),
                        res.text
                    );
                    bs.cleanup();
                    done();
                });
        });
    });
    it("also sets the index of serve-static to routes", function(done) {
        browserSync.reset();

        var config = {
            server: {
                baseDir: "test/fixtures",
                serveStaticOptions: {
                    index: "inputs.html"
                },
                routes: {
                    "/subdir": "test/fixtures"
                }
            },
            logLevel: "silent",
            open: false
        };

        browserSync.create().init(config, function(err, bs) {
            request(bs.server)
                .get("/subdir/")
                .expect(200)
                .end(function(err, res) {
                    assert.deepEqual(
                        require("fs").readFileSync(
                            "test/fixtures/inputs.html",
                            "utf-8"
                        ),
                        res.text
                    );
                    bs.cleanup();
                    done();
                });
        });
    });
    it("sets uses the default for serve static index", function(done) {
        browserSync.reset();

        var config = {
            server: {
                baseDir: "test/fixtures",
                serveStaticOptions: {}
            },
            logLevel: "silent",
            open: false
        };

        browserSync.create().init(config, function(err, bs) {
            assert.equal(
                bs.options.getIn(["server", "serveStaticOptions", "index"]),
                "index.html"
            );
            request(bs.server)
                .get("/")
                .expect(200)
                .end(function(err, res) {
                    assert.deepEqual(
                        require("fs").readFileSync(
                            "test/fixtures/index.html",
                            "utf-8"
                        ),
                        res.text
                    );
                    bs.cleanup();
                    done();
                });
        });
    });
});
