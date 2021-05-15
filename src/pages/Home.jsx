import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import Page from "../components/Page";
import "./Home.css";

export default class Home extends Component {
    render() {
        return (
            <Page title="主页" nonav className="home-page">
                <div className="header-container">
                    <h1>Craftmine App</h1>
                    <p>By NriotHrreion</p>
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
}
