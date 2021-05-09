import React, { Component } from "react";
import { Image, Button, ButtonGroup } from "react-bootstrap";
import Page from "./Page";
import "./Home.css";

export default class Home extends Component {
    render() {
        return (
            <Page title="主页" className="home-page">
                <div className="header-container">
                    <h1>Craftmine App</h1>
                    <p>By NriotHrreion</p>
                </div>
                <div className="main-container">
                    <ButtonGroup>
                        <Button href="/worlds">存档列表</Button>
                        <Button href="/home" onClick={() => alert("这个功能还没做...")}>多人游戏</Button>
                        <Button href="/about">关于</Button>
                    </ButtonGroup>
                </div>
            </Page>
        );
    }
}
