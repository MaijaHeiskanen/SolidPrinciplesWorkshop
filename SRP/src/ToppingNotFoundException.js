export class ToppingNotFoundException extends Error {
	constructor(toppings) {
		super();

		this.toppings = toppings;
	}
}
