const Lexical = require('./analysis/lexical')
const fs = require('fs')
const colors = require('colors')
var exec = require('child_process').exec

const analysesTranslation = {
	lexical: 'Léxica',
	syntax: 'Sintática',
	semantic: 'Semântica'
}

class Compiler {

	constructor ( targetCode ) {
		this.targetCode = targetCode
		this._compiled = false
		this.cleanTargetCode()
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

	startProcess () {
		const analyses = {
			lexical: Lexical
		}

		let analysisClass = null

		for (let analysis in analyses) {
			console.log(`Iniciando análise ${analysesTranslation[analysis]}`.yellow)
			analysisClass = new analyses[ analysis ]( this.targetCode )
			this.targetCode = analysisClass.analyze()
			if (analysisClass.errors) {
				console.log(`Alguns erros encontrados na análise ${analysesTranslation[analysis]}: ${analysisClass.errors.red}`)
			} else {
				console.log(`Análise ${analysesTranslation[analysis]} finalizada`.green)
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
				if (error) {
					console.log('Não foi possível executar o programa,'.red)
					console.log('isso pode ocorrer por diversas maneiras, sendo a mais comum um loop infinito'.red)
					throw error
				}
				console.log('Resultado da execução:'.magenta)
				console.log(stdout.bold.magenta)
				console.log(`Fim de execução...`.magenta)
			});
		});
	}
}

module.exports = Compiler