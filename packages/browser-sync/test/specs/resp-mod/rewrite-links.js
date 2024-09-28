var utils = require("../../../dist/server/proxy-utils");
var assert = require("chai").assert;
var fs = require("fs");

describe("Rewriting Domains", function() {
    var proxyUrl = "192.168.0.4:3002";

    describe("when rewriting 'example.com' links", function() {
        var regex, fn;
        var testRegex;
        before(function() {
            var host = "192.168.0.4:3002";
            var rewrite = utils.rewriteLinks(
                { hostname: "example.com", port: 80 },
                proxyUrl
            );
            var bound = rewrite.fn.bind(null, { headers: { host: host } }, {});
            regex = rewrite.match;
            fn = rewrite.fn;
            testRegex = function(string) {
                return string.replace(rewrite.match, bound);
            };
        });

        it("should not replace domains that are not inside attribute", function() {
            var actual = testRegex("<h1>example.com</h1>");
            var expected = "<h1>example.com</h1>";
            assert.equal(expected, actual);
        });
        it("should replace CSS LINK", function() {
            var actual = testRegex(
                "<link href='http://example.com/css/styles'>example.com</link>"
            );
            var expected =
                "<link href='http://192.168.0.4:3002/css/styles'>example.com</link>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (2)", function() {
            var actual = testRegex("<a href='http://example.com'></a>");
            var expected = "<a href='http://192.168.0.4:3002'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (23)", function() {
            var actual = testRegex("<a href='http://example.com/sub/dir'></a>");
            var expected = "<a href='http://192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (3)", function() {
            var actual = testRegex("<a href='http://example.com/sub/dir'></a>");
            var expected = "<a href='http://192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (4)", function() {
            var actual = testRegex(
                "<a href='https://example.com/sub/dir'></a>"
            );
            var expected = "<a href='https://192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (5)", function() {
            var actual = testRegex("<a href='/example.com/sub/dir'></a>");
            var expected = "<a href='/192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (6)", function() {
            var actual = testRegex("<a href='example.com/sub/dir'></a>");
            var expected = "<a href='192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (6)", function() {
            /*jshint ignore:start*/
            var actual = testRegex(
                '<a href="http://example.com" class="active" title="Home">Home</a><a href="http://example.com/information" class="" title="Info">Info</a>'
            );
            var expected =
                '<a href="http://192.168.0.4:3002" class="active" title="Home">Home</a><a href="http://192.168.0.4:3002/information" class="" title="Info">Info</a>';
            assert.equal(actual, expected);
            /*jshint ignore:end*/
        });
        it("should use the regex to replace links (7)", function() {
            var actual = testRegex(
                "<a href='http://example.com/sub/dir/example.com/css/styles.css'></a><a href='http://example.com/sub/dir/example.com/css/styles.css'></a>"
            );
            var expected =
                "<a href='http://192.168.0.4:3002/sub/dir/example.com/css/styles.css'></a><a href='http://192.168.0.4:3002/sub/dir/example.com/css/styles.css'></a>";
            assert.equal(actual, expected);
        });
    });
    describe("when rewriting 'localhost:8000' links", function() {
        var regex, fn;
        var testRegex;
        before(function() {
            var host = "192.168.0.4:3002";
            var rewrite = utils.rewriteLinks(
                { hostname: "localhost:8000", port: 80 },
                proxyUrl
            );
            var bound = rewrite.fn.bind(null, { headers: { host: host } }, {});
            regex = rewrite.match;
            fn = rewrite.fn;
            testRegex = function(string) {
                return string.replace(rewrite.match, bound);
            };
        });
        it("should use the regex to replace links (1)", function() {
            var actual = testRegex("<a href='http://localhost:8000'></a>");
            var expected = "<a href='http://192.168.0.4:3002'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (1)", function() {
            var actual = testRegex("<a href='http://localhost:8000'></a>");
            var expected = "<a href='http://192.168.0.4:3002'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (2)", function() {
            var actual = testRegex(
                "<a href='http://localhost:8000/sub/dir'></a>"
            );
            var expected = "<a href='http://192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (3)", function() {
            var actual = testRegex(
                "<a href='http://localhost:8000/sub/dir'></a>"
            );
            var expected = "<a href='http://192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (4)", function() {
            var actual = testRegex(
                "<a href='https://localhost:8000/sub/dir'></a>"
            );
            var expected = "<a href='https://192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (5)", function() {
            var actual = testRegex("<a href='/localhost:8000/sub/dir'></a>");
            var expected = "<a href='/192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (6)", function() {
            var actual = testRegex("<a href='localhost:8000/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain hashes (1)", function() {
            var actual = testRegex(
                "<a href='http://localhost:8000/sub/dir/?search=some#shane'></a>"
            );
            var expected =
                "<a href='http://192.168.0.4:3002/sub/dir/?search=some#shane'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain hashes (2)", function() {
            var actual = testRegex(
                "<a href='http://localhost:8000/sub/dir/#search'></a>"
            );
            var expected =
                "<a href='http://192.168.0.4:3002/sub/dir/#search'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain hashes (2)", function() {
            var input = fs.readFileSync(
                "test/fixtures/rewrites/hashes.input.html",
                "utf8"
            );
            var expected = fs.readFileSync(
                "test/fixtures/rewrites/hashes.expected.html",
                "utf8"
            );
            var rewrite = utils.rewriteLinks(
                { hostname: "www.example.local.colinr.com", port: 80 },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain port + ", function() {
            var input =
                '<!--//<a href="http://example.com:1234/foo">Link 1</a>--><a href="http://example.com.gov/foo">Link 1</a>';
            var expected =
                '<!--//<a href="http://192.168.0.4:3002/foo">Link 1</a>--><a href="http://example.com.gov/foo">Link 1</a>';

            var rewrite = utils.rewriteLinks(
                { hostname: "example.com", port: 1234 },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links + comments", function() {
            var input = fs.readFileSync(
                "test/fixtures/rewrites/comment.html",
                "utf8"
            );
            var expected = fs.readFileSync(
                "test/fixtures/rewrites/comment.expected.html",
                "utf8"
            );
            var rewrite = utils.rewriteLinks(
                { hostname: "experiment.dev" },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain port + ", function() {
            var input =
                '<link href="/sites/default/themes/mclinic/css/styles.css" media="screen" rel="stylesheet">';
            var rewrite = utils.rewriteLinks({ hostname: "mclinic" }, proxyUrl);
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, input);
        });
        it("should use the regex to replace links that have protocol relative URLS", function() {
            var input =
                '<script type="text/javascript" src="//test.dev/file.js">';
            var expected =
                '<script type="text/javascript" src="//' +
                proxyUrl +
                '/file.js">';
            var rewrite = utils.rewriteLinks(
                { hostname: "test.dev" },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should not replace when host + subdomain ", function() {
            var input =
                '<a href="http://assets.cdn.example.com:1234/foo">Link 1</a>';
            var rewrite = utils.rewriteLinks(
                { hostname: "example.com", port: 1234 },
                proxyUrl
            );
            var actual = input.replace(rewrite.match, rewrite.fn);
            assert.equal(actual, input);
        });
        it("should not remove trailing slash", function() {
            var input = '<a href="http://example.com:1234/foo/">Link 1</a>';
            var expected = '<a href="http://' + proxyUrl + '/foo/">Link 1</a>';
            var rewrite = utils.rewriteLinks(
                { hostname: "example.com", port: 1234 },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should not greedy match when not inside attr - with paths", function() {
            var input =
                '<a href="https://example.com/calendar/2015/06/24/20471/">https://example.com/calendar/2015/06/24/20471/</a></p></div></li></ol></td><td  class="cal-current-month">';
            var expected =
                '<a href="https://' +
                proxyUrl +
                '/calendar/2015/06/24/20471/">https://' +
                proxyUrl +
                '/calendar/2015/06/24/20471/</a></p></div></li></ol></td><td  class="cal-current-month">';
            var rewrite = utils.rewriteLinks(
                { hostname: "example.com" },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should not greedy match when not inside attr", function() {
            var input =
                '<a href="https://example.com/">https://example.com/</a></p></div></li></ol></td><td  class="cal-current-month">';
            var expected =
                '<a href="https://192.168.0.4:3002/">https://192.168.0.4:3002/</a></p></div></li></ol></td><td  class="cal-current-month">';
            var rewrite = utils.rewriteLinks(
                { hostname: "example.com" },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("handles escaped urls correctly", function() {
            var input = fs.readFileSync(
                "test/fixtures/rewrites/escaped.1.html",
                "utf8"
            );
            var expected = fs.readFileSync(
                "test/fixtures/rewrites/escaped.1.expected.html",
                "utf8"
            );
            var rewrite = utils.rewriteLinks({ hostname: "demo.l5" }, proxyUrl);
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should support proxy: localhost", function() {
            var input = `
                <a href="http://localhost:6426">should skip</a>
                <a href="http://localhost">should hit</a>
                <a href="http://localhost/base.html">should hit (2)</a>
            `;
            var expected = `
                <a href="http://localhost:6426">should skip</a>
                <a href="http://${proxyUrl}">should hit</a>
                <a href="http://${proxyUrl}/base.html">should hit (2)</a>
            `;
            var rewrite = utils.rewriteLinks(
                { hostname: "localhost" },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
        it("should support localhost + port", function() {
            var input = `
                <a href="http://localhost:6426">should skip</a>
                <a href="http://localhost:8080">should hit</a>
                <a href="http://localhost:8080/base.html">should hit (2)</a>
            `;
            var expected = `
                <a href="http://localhost:6426">should skip</a>
                <a href="http://${proxyUrl}">should hit</a>
                <a href="http://${proxyUrl}/base.html">should hit (2)</a>
            `;
            var rewrite = utils.rewriteLinks(
                { hostname: "localhost", port: "8080" },
                proxyUrl
            );
            var bound = rewrite.fn.bind(
                null,
                { headers: { host: proxyUrl } },
                {}
            );
            var actual = input.replace(rewrite.match, bound);
            assert.equal(actual, expected);
        });
    });
});
