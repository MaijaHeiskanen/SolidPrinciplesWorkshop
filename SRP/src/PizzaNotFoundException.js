export class PizzaNotFoundException extends Error {
	constructor(pizza) {
		super();

		this.pizza = pizza;
	}
}
