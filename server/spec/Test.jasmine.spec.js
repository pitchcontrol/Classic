describe('Hello world', function () {
    beforeEach(function () {
        jasmine.addMatchers({
            toBeWithinOf: function () {
                return {
                    compare: function (actual, distance, base) {
                        var arg = arguments;
                        var self= this;
                        var lower = base - distance,
                            upper = base + distance,
                            result = {
                                pass:  Math.abs(actual - base) <= distance
                            };

                        if(!result.pass) {
                            result.message =  "Expected " + actual + " to be between " +
                                lower + " and " + upper + " (inclusive)";
                        }
                        return result;
                    }
                }
            }
        })
    });
    it('should be within in range', function (done) {
        expect(1).toBeWithinOf(2, 6);
        done();
    });
});