const Lexical = require('./analysis/lexical')
const fs = require('fs')
const colors = require('colors')
var exec = require('child_process').exec;

class Compiler {
	
	constructor ( targetCode ) {
		this.targetCode = targetCode
		this._compiled = false
		this.cleanTargetCode()
		this.defineAnalysis()
	}

	cleanTargetCode () {
		const cleaners = [
			[/( )+/g, ' '], // Trocando espaços simultâneos por apenas um
			[/\t/g, ''], // Removendo todos os tabs do código alvo
			[ /\/\/.*/g, '' ], // Removendo todos os comentários do código alvo
		]

		// Loop em cada regra de limpeza definida acima
		for (let i = 0; i < cleaners.length; i++) {
			// Altera o conteúdo do código alvo para o listado
			this.targetCode = this.targetCode.replace(cleaners[i][0], cleaners[i][1] )
		}
	}

	defineAnalysis () {
		this.analysis = {
			lexical: new Lexical( this.targetCode )
		}
	}

	startProcess () {
		const analysis = [ Lexical ]

		for (let i = 0; i < analysis.length; i++) {
			const analysisClass = new analysis[i]( this.targetCode )
			this.targetCode = analysisClass.analyse()

			if (analysisClass.errors) {
				analysisClass.errors.red
			}
		}
		this._compiled = true
	}

	get compiled() {
		return this._compiled
	}

	runProgram () {
		fs.writeFile(`${__dirname}/temp.js`, this.targetCode, (err) => {
			if (err) throw err;

			exec(`node temp.js`, { timeout: 3000 }, function (error, stdout, stderr) {
				console.log(stdout.green)
			});
		});
	}
}

module.exports = Compiler