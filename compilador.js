if ( process.argv.length === 3 ) {
	// Biblioteca de manipulação de arquivos (leitura, gravação, etc.)
	const fs = require('fs')
	const colors = require('colors')

	fs.readFile(process.argv[2], 'utf8', (error, data) => {

		// Verifica se falhou na tentativa de ler o conteúdo do arquivo passado
		if ( error ) {
			// Se sim, retorna o erro ao usuário e finaliza o programa
			console.log(`Não foi possível ler o arquivo \n ${error}`.red)
		} else {

			const Compiler = require('./compiler')
			const compiler = new Compiler( data )
			compiler.startProcess()

			if (compiler.compiled) {
				console.log(`\n\\o/\nFase compilação finalizada!`.cyan)
				console.log(`Resultado da compilação pode ser encontrado no arquivo temp.js`.cyan)
				console.log(`Executando o programa...\n`.cyan)
				compiler.runProgram()
			} else {
				console.log(`Não foi possível compilar o arquivo`.red)
			}
		}
	})
} else {
	console.log( 'Não foi passado o arquivo que sera compilado' )
}