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

/*
import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import ArtDoc from "./components/ArtDoc/ArtDoc";
import ArtdocDashBoard from "./components/ArtDoc/ArtdocDashBoard";
import ArtdocCreate from "./components/ArtDoc/ArtdocCreate";
import Dashboard from "./components/DashBoard/DashBoard";


export default function App() {
  var { isAuthenticated } = useUserState();
  return (
    <HashRouter>
      <Switch>
    
		<Route path="/" exact component={Login} />
        <PrivateRoute path="/admin" component={Dashboard} />
		<PrivateRoute path="/expert" component={DashBoard} />

        <PublicRoute  path="/Artdoc" exact component={ArtdocDashBoard}  />
		<PublicRoute path="/artdoc/create" exact component={ArtdocCreate}  />
		
        <Route component={Error} />

      </Switch>
    </HashRouter>
  );

  */
