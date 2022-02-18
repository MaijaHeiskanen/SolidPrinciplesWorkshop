// No real database logic here, just to mock

export class Database {
	async query(text: string, params: (string | number)[]) {
		return 1;
	}
	async execute(text: string, params: (string | number)[]) {
		return 1;
	}
}
