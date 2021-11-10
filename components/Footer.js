import html from "html-literal";
import * as state from "../store";

const kelvinToFahrenheit = (kelvinTemp) =>
  Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

let city = state.Home.weather.name;
let temp = kelvinToFahrenheit(parseInt(state.Home.weather.temp));
let feelLike = kelvinToFahrenheit(parseInt(state.Home.weather.feelsLike));

export default () => html`
  <footer>
    <h3>
      Weather in ${state.Home.weather.city}
      ${kelvinToFahrenheit(state.Home.weather.temp)}F, feels like
      ${kelvinToFahrenheit(state.Home.weather.feelsLike)}F
    </h3>
    &copy; 2021 <a href="https://savvycoders.com/">Savvy Coders</a>
  </footer>
`;
