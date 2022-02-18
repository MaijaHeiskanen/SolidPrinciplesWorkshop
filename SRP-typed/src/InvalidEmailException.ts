export class InvalidEmailException extends Error {
	public email = "";

	constructor(email: string) {
		super();

		this.email = email;
	}
}
