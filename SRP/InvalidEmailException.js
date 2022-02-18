export class InvalidEmailException extends Error {
	constructor(email) {
		super();

		this.email = email;
	}
}
