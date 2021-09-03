import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/tailwind.css";
import "mosha-vue-toastify/dist/style.css";
import "./style.css";

const app = createApp(App).use(router);

app.config.devtools = true;

// const clickOutside = {
//   beforeMount: (el, binding) => {
//     el.clickOutsideEvent = (event) => {
//       if (!(el == event.target || el.contains(event.target))) {
//         binding.value();
//       }
//     };
//     document.addEventListener("click", el.clickOutsideEvent);
//   },
//   unmounted: (el) => {
//     document.removeEventListener("click", el.clickOutsideEvent);
//   },
// };

// app.directive("click-outside", clickOutside);
app.mount("#app");
