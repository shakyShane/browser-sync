// jscs:disable maximumLineLength

var rewriteCookies = require("../../../dist/server/proxy-utils").rewriteCookies;
var expect = require("chai").expect;

describe("rewriteCookies spec", function() {
    it("Should honor secure directive on SameSite=None cookies", function() {
        var cookies = [
            "localization=US; path=/; expires=Fri, 03 Jun 2022 21:13:22 GMT; SameSite=Lax",
            "localization=secure; path=/; expires=Fri, 03 Jun 2022 21:13:22 GMT; SameSite=Lax",
            "storefront_digest=1234567; path=/; secure; HttpOnly; SameSite=None"
        ];

        var result = cookies.reduce((aggregate, cookie) => {
            aggregate.push(rewriteCookies(cookie));
            return aggregate;
        }, []);

        expect(result).to.deep.equal([
            "localization=US; path=/; expires=Fri, 03 Jun 2022 21:13:22 GMT; SameSite=Lax",
            "localization=secure; path=/; expires=Fri, 03 Jun 2022 21:13:22 GMT; SameSite=Lax",
            "storefront_digest=1234567; path=/; SameSite=None; HttpOnly; secure"
        ]);
    });
});
