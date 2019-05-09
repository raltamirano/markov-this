import Analyzer from "../analyzer";

export default class TextLinesAnalyzer extends Analyzer {
    toItems(data) {
        return ("" + data).split('\n')
    }

    toTokens(item) {
        return ("" + item).split(' ')
    }
}