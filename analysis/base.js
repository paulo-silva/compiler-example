class Base {

	constructor () {
		this._errors = ''
	}

	get errors() {
		return this._errors
	}

	set errors(newError) {
		this._errors += `\n${newError}`
	}
}

module.exports = Base