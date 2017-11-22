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

	analyse () {
		for (let i = 0; i < this.totalSymbols; i++) {

			this.targetCode = this.targetCode.replace(
				new RegExp( this.symbolsTable[i]['target'], 'g' ),
				this.symbolsTable[i]['source']
			)

			if (this.symbolsTable[i]['saveOnSymbolTable']) {
				this.symbolsTable.push({
					target: 
				})
			}
		}
		return this.targetCode
	}
}

module.exports = Lexical