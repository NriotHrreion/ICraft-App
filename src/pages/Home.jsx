import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import Page from "../components/Page";
import "./Home.css";
import Background from "../static/background.png";

export default class Home extends Component {
    render() {
        return (
            <Page title="主页" nonav className="home-page">
                <div className="header-container">
                    <h1>ICraft</h1>
                    <p>Minecraft 2D</p>
                </div>
                <div className="main-container">
                    <ButtonGroup>
                        <Button href="/worlds">存档</Button>
                        <Button href="/servers">服务器</Button>
                        <Button href="/about">关于</Button>
                    </ButtonGroup>
                </div>
            </Page>
        );
    }

    componentDidMount() {
        document.body.style.backgroundImage = "url("+ Background +")";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "100% 100%";
        document.body.style.backgroundAttachment = "fixed";
    }
}
