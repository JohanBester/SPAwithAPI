export default (st) => `
<table id="pizzas">
<tr><th>Size</th><th>Crust</th><th>Cheese</th><th>Sauce</th><th>Toppings</th></tr>
${st.pizzas
  .map((pizza) => {
    return `<tr><td>${pizza.size}</td><td>${pizza.crust}</td><td>${
      pizza.cheese
    }</td><td>${pizza.sauce}</td><td>${pizza.toppings.join(" & ")}</td></tr>`;
  })
  .join("")}
</table>
`;
