import "./assets/main.css";
import { createApp, reactive } from "vue";
import App from "./App.vue";
import { setColorScheme } from "mdui/functions/setColorScheme.js";
import Card from "./components/MdCard.vue";

const app = createApp(App);
setColorScheme("#09355b");
app.component("Card", Card);
app.mount("body");
