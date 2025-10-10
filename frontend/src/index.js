import React from "react";
import { createRoot } from "react-dom/client";
import './assets/noble/css/demo_5/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css'; //CSS clases personalizadas de SaintSeiya
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/mensajes_combate.css';


import {App} from "./App";

const root = createRoot(document.getElementById("root"));

root.render(<App />);
