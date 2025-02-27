/* @refresh reload */
import "@/styles/reset.css";
import "@/styles/water.css";
import "@/styles/globals.css";
import App from "@/app.tsx";
import { render } from "solid-js/web";

const root = document.getElementById("root");

render(() => <App />, root!);
