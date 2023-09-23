import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// import actionCable from "actioncable";

// const CableApp = {};
// CableApp.cable = actionCable.createConsumer(
// 	`wss:${import.meta.env.VITE_API_URL}/cable`
// );

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		{/* <App cable={CableApp.cable} /> */}
		<App />
	</React.StrictMode>
);
