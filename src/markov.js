import Analyzer from './analyzer';
import TextLinesAnalyzer from './analyzers/text-lines';

export default class Markov {
    static get END_OF_ITEM() { return '/*/*/' }

    constructor(name, analyzer) {
        this.name = name
        this.analyzer = analyzer || new TextLinesAnalyzer()
        this.dict = {}
    }

    learn(data) {
        this.analyzer.toItems(data).map(this.analyzer.toTokens).forEach(et => {
            for (let index = 0; index < et.length; index++) {
                const token = et[index];
                if (!(token in this.dict)) this.dict[token] = {}
                const nextToken = (index < (et.length-1)) ?  et[index+1] : Markov.END_OF_ITEM;
                if (!(nextToken in this.dict[token])) this.dict[token][nextToken] = 1
                else this.dict[token][nextToken] = this.dict[token][nextToken] + 1
            }
        });
    }

    tokens() {
        return Object.keys(this.dict)
    }

    produce(initial, length) {
        return "abc"
    }
}

