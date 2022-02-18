import { Database } from "./Database";
import { InvalidEmailException } from "./InvalidEmailException";
import { PizzaNotFoundException } from "./PizzaNotFoundException";
import { ToppingNotFoundException } from "./ToppingNotFoundException";
import { validateEmail } from "./utils/validateEmail";
import axios, { AxiosRequestConfig } from "axios";

export class Pizzeria {
	private static readonly toppings: Record<string, number> = {
		Salami: 3.0,
		"Mozzarella Di Bufala": 2.5,
		"Sun Dried Tomatoes": 2.0,
		Ananas: 1.5,
		Bacon: 2.5,
		Prosciutto: 3.0,
		Shrimp: 3.25,
	};

	private static readonly pizzas: Record<string, number> = {
		Margarita: 8.0,
		Fantasia: 12.0,
		"Petri's Pizzeria Special": 10,
	};

	async takeAnOrder(ordererEmail: string, pizza: string, additionalToppings: string[] = []) {
		const isValidEmail = validateEmail(ordererEmail);

		if (!isValidEmail) {
			throw new InvalidEmailException(ordererEmail);
		}

		if (Pizzeria.pizzas[pizza] === undefined) {
			throw new PizzaNotFoundException(pizza);
		}

		const isAllToppingsValid = additionalToppings.every((topping) => Pizzeria.toppings[topping] !== undefined);

		if (!isAllToppingsValid) {
			const notFoundToppings = additionalToppings.filter((topping) => Pizzeria.toppings[topping] === undefined);

			throw new ToppingNotFoundException(notFoundToppings);
		}

		let pizzaPrice = Pizzeria.pizzas[pizza] + additionalToppings.map((topping) => Pizzeria.toppings[topping]).reduce((prev, next) => prev + next);

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

		const config: AxiosRequestConfig = {
			headers: {
				Authorization: "Bearer Aeofkewpofkwaop53251095121==",
				"Content-Type": "application/json",
			},
		};

		await axios.post("https://api.sendgrid.com/v3/mail/send", data, config);
	}
}
