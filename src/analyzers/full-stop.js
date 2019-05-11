import Analyzer from "../analyzer";

export default class FullStopAnalyzer extends Analyzer {
    toItems(data) {
        return ("" + data).split('.').map(l => l.trim()).filter(l => l.trim().length > 0)
    }

    toTokens(item) {
        return ("" + item).split(' ')
    }
}