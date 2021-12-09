import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Chat from "./Chat.jsx";
import Home from "./home";

function BRoutes() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/chat" element={<Chat />} />
				<Route path="*" element={<>not found</>} />
			</Routes>
		</Router>
	);
}

export default BRoutes;
