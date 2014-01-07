var bs = require("../../lib/browser-sync");
var browserSync = new bs();
var messages = require("../../lib/messages");
var http = require("http");
var sinon = require("sinon");
var assert = require("chai").assert;
var server = require("../../lib/server");

var ports = [3001, 3002];
var serverHost = "http://0.0.0.0:" + ports[1];

var expectedMatch1 = "<script src='//0.0.0.0:" + ports[0] + messages.socketIoScript + "'></script>";
var expectedMatch2 = "<script src='//0.0.0.0:" + ports[1] + messages.clientScript() + "'></script>";

describe("Launching a server with snippets", function () {

    var servers, reqCallback;

    var io;
    var clientsSpy;
    var emitSpy;

    before(function () {
        clientsSpy = sinon.stub().returns([]);
        emitSpy = sinon.spy();
        io = {
            sockets: {
                clients: clientsSpy,
                emit: emitSpy
            }
        };
    });
    afterEach(function () {
        clientsSpy.reset();
        emitSpy.reset();
    });

    beforeEach(function () {

        var options = {
            server: {
                baseDir: "test/fixtures",
                injectScripts: true
            }
        };

        servers = server.launchServer("0.0.0.0", ports, options, io);
    });

    afterEach(function () {
        servers.staticServer.close();
    });

    /**
     *
     *
     * SMALL HTML PAGE
     *
     *
     */
    it("can append the script tags to the body of html files", function (done) {

        http.get(serverHost + "/index.html", function (res) {
            var chunks = [];
            var data;
            res.on("data", function (chunk) {
                chunks.push(chunk.toString());
            });
            res.on("end", function () {
                data = chunks.join("");
                assert.include(data, expectedMatch1);
                assert.include(data, expectedMatch2);
                done();
            });
        });
    });

    /**
     *
     *
     * LARGE HTML PAGE
     *
     *
     */
    it("can append the script tags to the body of a LARGE html FILE", function (done) {
        http.get(serverHost + "/index-large.html", function (res) {
            var chunks = [];
            var data;
            res.on("data", function (chunk) {
                chunks.push(chunk.toString());
            });
            res.on("end", function () {
                data = chunks.join("");
                assert.include(data, expectedMatch1);
                assert.include(data, expectedMatch2);
                done();
            });
        });
    });


    /**
     *
     *
     * SUPPORT FOR AMD LOADERS
     * The script has to be appended *before* the script tag, therefor we insert it
     * as first tag in the body
     *
     *
     */
    it("can prepend script tags before any existing script tag", function (done) {
        http.get(serverHost + "/index-with-scripts.html", function (res) {
            var chunks = [];
            var data;
            res.on("data", function (chunk) {
                chunks.push(chunk.toString());
            });
            res.on("end", function () {
                var otherTags = "<script>// dummy</script>";

                data = chunks.join("");

                assert.include(data, expectedMatch1);
                assert.include(data, expectedMatch2);
                assert.include(data, otherTags);

                assert.isTrue(data.indexOf(expectedMatch1) < data.indexOf(otherTags));
                assert.isTrue(data.indexOf(expectedMatch2) < data.indexOf(otherTags));

                done();
            });
        });
    });
});
