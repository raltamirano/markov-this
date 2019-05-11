import Analyzer from "../analyzer";

export default class TextLinesAnalyzer extends Analyzer {
    toItems(data) {
        return ("" + data).split('\n').filter(l => l.trim().length > 0)
    }

    toTokens(item) {
        return ("" + item).split(' ')
    }
}