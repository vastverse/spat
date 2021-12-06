import React from "react";
import BRoutes from "./routes";
import store from "./Store";
import { Provider } from "react-redux";
function App() {
	return (
		<Provider store={store}>
			<BRoutes />
		</Provider>
	);
}

export default App;
