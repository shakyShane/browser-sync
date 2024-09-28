var browserSync = require("../../../../");

var connect = require("connect");
var serveStatic = require("serve-static");
var request = require("supertest");
var assert = require("chai").assert;
var Rx = require("rx");
var utils = require("../../../utils");

describe("E2E proxy test with adding rewrite rules dynamically", function() {
    it("can accepts rules from options", function(done) {
        browserSync.reset();

        var app = connect();
        var server = app.listen();
        var proxytarget = "http://localhost:" + server.address().port;

        app.use("/index.html", function(req, res) {
            res.setHeader("content-type", "text/html");
            res.end('<a href="' + proxytarget + '/my-link">Browsersync</a>');
        });

        var config = {
            proxy: proxytarget,
            logLevel: "silent",
            open: false,
            rewriteRules: [
                {
                    match: /Browsersync/g,
                    fn: function() {
                        return "BROWSERSYNC";
                    }
                }
            ]
        };

        browserSync.init([], config, function(err, bs) {
            var reqs = utils.getRequests(
                [
                    [
                        "/index.html",
                        '<a href="http://127.0.0.1:3000/my-link">BROWSERSYNC</a>'
                    ]
                ],
                bs.server
            );

            var obs = Rx.Observable.concat(reqs);

            obs.subscribeOnCompleted(function() {
                server.close();
                bs.cleanup();
                done();
            });
        });
    });

    it("can accepts rules from options + add on the fly", function(done) {
        browserSync.reset();

        var app = connect();
        var server = app.listen();
        var proxytarget = "http://localhost:" + server.address().port;

        app.use("/index.html", function(req, res) {
            res.setHeader("content-type", "text/html");
            res.end('<a href="' + proxytarget + '/my-link">Browsersync</a>');
        });

        var config = {
            proxy: proxytarget,
            logLevel: "silent",
            open: false,
            rewriteRules: [
                {
                    match: /Browsersync/g,
                    fn: function() {
                        return "BROWSERSYNC";
                    }
                }
            ]
        };

        browserSync.init([], config, function(err, bs) {
            var reqs = utils.getRequests(
                [
                    [
                        "/index.html",
                        '<a href="http://127.0.0.1:3000/my-link">BROWSERSYNC</a>'
                    ],
                    function() {
                        bs.addRewriteRule({
                            match: /BROWSERSYNC/,
                            replace: "shane",
                            id: "my-rewrite-rule"
                        });
                    },
                    [
                        "/index.html",
                        '<a href="http://127.0.0.1:3000/my-link">shane</a>'
                    ],
                    function() {
                        bs.removeRewriteRule("my-rewrite-rule");
                    },
                    [
                        "/index.html",
                        '<a href="http://127.0.0.1:3000/my-link">BROWSERSYNC</a>'
                    ]
                ],
                bs.server
            );

            var obs = Rx.Observable.concat(reqs);

            obs.subscribeOnCompleted(function() {
                server.close();
                bs.cleanup();
                done();
            });
        });
    });
});
