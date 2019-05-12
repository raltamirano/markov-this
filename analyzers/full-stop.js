var Analyzer = require("../analyzer");
"use strict"

class FullStopAnalyzer extends Analyzer {
    toItems(data) {
        return ("" + data).split('.').map(l => l.trim()).filter(l => l.trim().length > 0)
    }

    toTokens(item) {
        return ("" + item).split(' ')
    }
}

module.exports = FullStopAnalyzer
