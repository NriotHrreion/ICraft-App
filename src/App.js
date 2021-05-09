import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from "./Home";
import Worlds from "./Worlds";
import CreateWorld from "./CreateWorld";
import About from "./About";

function App() {
    if(window.location.pathname == "/") {
        window.location.href = "/home"; // default page
    }

    return (
        <Router>
            <Route path="/home" component={Home}></Route>
            <Route path="/worlds" component={Worlds}></Route>
            <Route path="/create" component={CreateWorld}></Route>
            <Route path="/about" component={About}></Route>
        </Router>
    );
}

export default App;
