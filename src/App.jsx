import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Worlds from "./pages/Worlds";
import CreateWorld from "./pages/CreateWorld";
import Servers from "./pages/Servers";
import AddServer from "./pages/AddServer";
import About from "./pages/About";

function App() {
    if(window.location.pathname == "/") {
        window.location.href = "/home"; // default page
    }

    return (
        <Router>
            <Route path="/home" component={Home}></Route>
            <Route path="/signIn" component={SignIn}></Route>
            <Route path="/worlds" component={Worlds}></Route>
            <Route path="/create" component={CreateWorld}></Route>
            <Route path="/servers" component={Servers}></Route>
            <Route path="/addServer" component={AddServer}></Route>
            <Route path="/about" component={About}></Route>
        </Router>
    );
}

export default App;
