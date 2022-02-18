import { Database } from "./Database.js";
import { InvalidEmailException } from "./InvalidEmailException.js";
import { PizzaNotFoundException } from "./PizzaNotFoundException.js";
import { ToppingNotFoundException } from "./ToppingNotFoundException.js";
import { validateEmail } from "./utils/validateEmail.js";
import axios from "axios";

export class Pizzeria {
	toppings = {
		Salami: 3.0,
		"Mozzarella Di Bufala": 2.5,
		"Sun Dried Tomatoes": 2.0,
		Ananas: 1.5,
		Bacon: 2.5,
		Prosciutto: 3.0,
		Shrimp: 3.25,
	};

	pizzas = {
		Margarita: 8.0,
		Fantasia: 12.0,
		"Petri's Pizzeria Special": 10,
	};

	async takeAnOrder(ordererEmail, pizza, additionalToppings = []) {
		const isValidEmail = validateEmail(ordererEmail);

		if (!isValidEmail) {
			throw new InvalidEmailException(ordererEmail);
		}

		if (this.pizzas[pizza] === undefined) {
			throw new PizzaNotFoundException(pizza);
		}

		const isAllToppingsValid = additionalToppings.every((topping) => this.toppings[topping] !== undefined);

		if (!isAllToppingsValid) {
			const notFoundToppings = additionalToppings.filter((topping) => this.toppings[topping] === undefined);

			throw new ToppingNotFoundException(notFoundToppings);
		}

		const pizzaPrice = this.pizzas[pizza] + additionalToppings.map((topping) => this.toppings[topping]).reduce((prev, next) => prev + next);

		if (additionalToppings.length >= 5 && pizza !== "Fantasia") {
			pizzaPrice *= 0.95;
		}

		const db = new Database();
		let customerId = await db.query("SELECT ID FROM Customers WHERE Email = $1", [ordererEmail]);

		if (customerId == undefined) {
			customerId = await db.execute("INSERT INTO Customers (Email) VALUES ($1)", [ordererEmail]);
		}

		await db.execute("INSERT INTO Orders (OrdererEmail, Pizza, ListOfToppings, Price) Values ($1, $2, $3, $4)", [ordererEmail, pizza, additionalToppings.join(), pizzaPrice]);

		const data = JSON.stringify({
			personalizations: [
				{
					to: [
						{
							email: ordererEmail,
						},
					],
				},
			],
			subject: "Pizza order",
			content: [
				{
					type: "text/plain",
					value: "Your pizza is on the way",
				},
			],
		});

		const config = {
			headers: {
				Authorization: "Bearer Aeofkewpofkwaop53251095121==",
				"Content-Type": "application/json",
			},
		};

		await axios.post("https://api.sendgrid.com/v3/mail/send", data, config);
	}
}
