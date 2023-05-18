// @ts-check
var utils = require("./utils");

/**
 * Apply the operators that apply to the 'file:changed' event
 * @param {import("rxjs").Observable} subject
 * @param options
 */
function fileChanges(subject, options) {
    const operators = [
        {
            option: "reloadThrottle",
            fnName: "throttle"
        },
        {
            option: "reloadDelay",
            fnName: "delay"
        }
    ];

    const scheduler = options.getIn(["debug", "scheduler"]);

    /**
     * Create a stream buffered/debounced stream of events
     */
    const initial = getAggregatedDebouncedStream(subject, options, scheduler);

    return applyOperators(operators, initial, options, scheduler);
}
module.exports.fileChanges = fileChanges;

/**
 * Apply the operators that apply to the 'browser:reload' event
 * @param {import("rxjs").Observable} subject
 * @param options
 */
function applyReloadOperators(subject, options) {
    var operators = [
        {
            option: "reloadDebounce",
            fnName: "debounce"
        },
        {
            option: "reloadThrottle",
            fnName: "throttle"
        },
        {
            option: "reloadDelay",
            fnName: "delay"
        }
    ];

    return applyOperators(operators, subject, options, options.getIn(["debug", "scheduler"]));
}
module.exports.applyReloadOperators = applyReloadOperators;

/**
 * @param items
 * @param subject
 * @param options
 * @param scheduler
 */
function applyOperators(items, subject, options, scheduler) {
    return items.reduce(function(subject, item) {
        var value = options.get(item.option);
        if (value > 0) {
            return subject[item.fnName].call(subject, value, scheduler);
        }
        return subject;
    }, subject);
}

/**
 * @param subject
 * @param options
 * @param scheduler
 */
function getAggregatedDebouncedStream(subject, options, scheduler) {
    return subject
        .filter(function(x) {
            return options.get("watchEvents").indexOf(x.event) > -1;
        })
        .buffer(subject.debounce(options.get("reloadDebounce"), scheduler));
}
