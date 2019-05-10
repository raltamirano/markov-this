import Analyzer from './analyzer';
import TextLinesAnalyzer from './analyzers/text-lines';

export default class Markov {
    static get START_OF_ITEM() { return '^^^^^' }
    static get END_OF_ITEM()   { return '$$$$$' }

    constructor(name, analyzer) {
        this.name = name
        this.analyzer = analyzer || new TextLinesAnalyzer()
        this.dict = {}
    }

    learn(data) {
        var analyzed = {}
        analyzed[Markov.START_OF_ITEM] = {}

        this.analyzer.toItems(data).map(this.analyzer.toTokens).forEach(et => {
            for (let index = 0; index < et.length; index++) {
                const token = et[index];

                if (index == 0) {
                    if (!(token in analyzed[Markov.START_OF_ITEM]))
                        analyzed[Markov.START_OF_ITEM][token] = 1
                    else
                        analyzed[Markov.START_OF_ITEM][token] = analyzed[Markov.START_OF_ITEM][token] + 1
                }

                if (!(token in analyzed)) analyzed[token] = {}
                const nextToken = (index < (et.length-1)) ? et[index+1] : Markov.END_OF_ITEM;
                if (!(nextToken in analyzed[token])) analyzed[token][nextToken] = 1
                else analyzed[token][nextToken] = analyzed[token][nextToken] + 1
            }
        });

        //console.log("info=" + JSON.stringify(analyzed, null, 2))

        this.dict = {}
        Object.keys(analyzed).forEach(key => {
            const total = Object.keys(analyzed[key]).map(e => analyzed[key][e]).reduce((a, b) => a + b)
            Object.keys(analyzed[key]).forEach(nextKey => {
                if (!(key in this.dict))
                    this.dict[key] = {}
                this.dict[key][nextKey] = Math.round((analyzed[key][nextKey] * 100.0 / total)) / 100
            })            
        });

        console.log("info2=" + JSON.stringify(this.dict, null, 2))
    }

    tokens() {
        return Object.keys(this.dict)
    }

    produce() {
        const result = []

        let token = this.weightedRand(this.dict[Markov.START_OF_ITEM])()

        let counter = 0
        while (Markov.END_OF_ITEM !== token) {
            counter++
            result.push(token)

            token = this.weightedRand(this.dict[token])()

            if (counter > 100) break;
        }

        return result.join(' ')
    }

    weightedRand(spec) {
        var i, j, table = [];
        for (i in spec) {
          for (j=0; j<spec[i]*10; j++)
            table.push(i);
        }

        return function() {
          return table[Math.floor(Math.random() * table.length)];
        }
    }
}

