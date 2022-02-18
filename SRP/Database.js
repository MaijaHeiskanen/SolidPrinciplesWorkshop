// No real database logic here, just to mock

export class Database {
	async query(text, params) {
		return 1;
	}
	async execute(text, params) {
		return 1;
	}
}
