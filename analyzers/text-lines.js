var Analyzer = require("../analyzer");
"use strict"

class TextLinesAnalyzer extends Analyzer {
    toItems(data) {
        return ("" + data).split('\n').map(l => l.trim()).filter(l => l.trim().length > 0)
    }

    toTokens(item) {
        return ("" + item).split(' ')
    }
}

module.exports = TextLinesAnalyzer
