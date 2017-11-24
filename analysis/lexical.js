const Base = require('./base')
const fs = require('fs')

class Lexical extends Base {
	constructor ( targetCode ) {
		super()
		this.targetCode = targetCode
		this.symbolsTable = JSON.parse( fs.readFileSync(`${__dirname}/symbols_table.json`, 'utf8') )
		this.totalSymbols = this.symbolsTable.length
		this.formatSymbolTable()
	}

	formatSymbolTable () {
		const defaultObject = {
			target: '',
			source: '',
			saveOnSymbolTable: false
		}

		for (let i = 0; i < this.totalSymbols; i++) {
			this.symbolsTable[i] = Object.assign({}, defaultObject, this.symbolsTable[i])
		}
	}

	analyze () {
		this.targetCode = this.targetCode.split( "\n" )
		this.totalParses = this.targetCode.length

		for (let i = 0; i < this.totalParses; i++) {
			this.translateParse(i)
		}
		return this.targetCode.join( "\n" )
	}

	translateParse ( lineNumber ) {
		let regex
		let regexResult
		let translated = true
		let currentLineAux = ''

		for (let i = 0; i < this.totalSymbols; i++) {
			regex = new RegExp(this.symbolsTable[i]['target'], 'g')
			regexResult = regex.exec(this.targetCode[lineNumber])

			if (regexResult !== null) {

				currentLineAux = this.targetCode[lineNumber]
				this.targetCode[lineNumber] = this.targetCode[lineNumber].replace(
					RegExp(this.symbolsTable[i]['target'], 'g'),
					this.symbolsTable[i]['source']
				)

				translated &= currentLineAux !== this.targetCode[lineNumber]

				if (this.symbolsTable[i]['saveOnSymbolTable']) {
					this.symbolsTable.push({
						target: regexResult[1],
						source: regexResult[1]
					})
				}
			}
		}
	}
}

module.exports = Lexical