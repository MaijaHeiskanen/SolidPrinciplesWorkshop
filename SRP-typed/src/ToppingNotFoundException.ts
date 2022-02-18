export class ToppingNotFoundException extends Error {
	toppings: string[] = [];

	constructor(toppings: string[]) {
		super();

		this.toppings = toppings;
	}
}
