import React from "react";
import { createRoot } from "react-dom/client";
import './assets/noble/css/demo_5/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css'; // Tu CSS personalizado
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";


//document.getElementById("root").className = "page-wrapper";
const root = createRoot(document.getElementById("root"));

root.render(<App />);
