export class PizzaNotFoundException extends Error {
	pizza = "";

	constructor(pizza: string) {
		super();

		this.pizza = pizza;
	}
}
