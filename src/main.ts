import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { initTwemoji } from "./lib/emoji";

createApp(App).use(router).mount("#app");
initTwemoji();

console.log("Hawww, console log mein kya hora ?!?");
console.log("If you saw ts then you owe me a crumbl btw 😋");
