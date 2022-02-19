// No real database logic here, just to mock

export class Database {
	async query(text: string, params: (string | number)[]) {
		return new Promise<number>((resolve, reject) => {
			setTimeout(() => resolve(1), 1000);
		});
	}
	async execute(text: string, params: (string | number)[]) {
		return new Promise<number>((resolve, reject) => {
			setTimeout(() => resolve(1), 1000);
		});
	}
}
