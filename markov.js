var Analyzer = require("./analyzer");
var TextLinesAnalyzer = require("./analyzers/text-lines");
"use strict"

class Markov {
    static get START_OF_ITEM()              { return '^^^^^' }
    static get END_OF_ITEM()                { return '$$$$$' }
    static get ORDER_TOKEN_SEPARATOR()      { return '=====' }

    constructor(name, order, analyzer) {
        this.name = name
        this.order = order
        this.analyzer = analyzer || new TextLinesAnalyzer()
        this.dict = {}
    }

    learn(data) {
        var analyzed = {}
        analyzed[Markov.START_OF_ITEM] = {}

        const itemsTokens = this.analyzer.toItems(data).map(this.analyzer.toTokens)
        if (itemsTokens.length == 0)
            throw 'Provided input data is invalid!'

        itemsTokens.forEach(it => {
            for (let index = 0; index < it.length; index++) {
                let token = it[index];
                for (let orderIndex = index + 1; (orderIndex < it.length) && ((orderIndex - index) < this.order); orderIndex++)
                    token = token + Markov.ORDER_TOKEN_SEPARATOR + it[orderIndex]

                if (index == 0) {
                    if (!(token in analyzed[Markov.START_OF_ITEM]))
                        analyzed[Markov.START_OF_ITEM][token] = 1
                    else
                        analyzed[Markov.START_OF_ITEM][token] = analyzed[Markov.START_OF_ITEM][token] + 1
                }

                if (!(token in analyzed)) analyzed[token] = {}
                const nextToken = (index < (it.length-this.order)) ? it[index+this.order] : Markov.END_OF_ITEM;
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
                this.dict[key][nextKey] = (analyzed[key][nextKey] * 100.0 / total) / 100.0
            })
        });

        //console.log("info2=" + JSON.stringify(this.dict, null, 2))
    }

    tokens() {
        return Object.keys(this.dict)
    }

    produce() {
        const result = []
        let token = this.weightedRand(this.dict[Markov.START_OF_ITEM])()
        result.push(...token.split(Markov.ORDER_TOKEN_SEPARATOR))

        let counter = result.length
        while (Markov.END_OF_ITEM !== result[result.length-1]) {
            let previous = result[result.length-this.order]
            for (let index = (result.length-this.order)+1; index < result.length; index++)
                previous = previous + Markov.ORDER_TOKEN_SEPARATOR + result[index]

            result.push(this.weightedRand(this.dict[previous])())
            if (counter++ > 100) break;
        }

        if (Markov.END_OF_ITEM == result[result.length-1])
            result.pop()

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

module.exports = Markov
