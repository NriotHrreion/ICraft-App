import React, { Component } from "react";
import Page from "./Page";
import "./About.css";

export default class About extends Component {
    render() {
        return (
            <Page title="关于" className="about-page">
                <div className="header-container">
                    <h1>About Me</h1>
                    <p>我是NriotHrreion</p>
                </div>
                <div className="main-container">
                    <h2>Craftmine</h2>
                    <p>这个东西是我突发奇想写出来的, 如果你觉得很烂的话就尽情地喷吧, 我无所谓.</p>
                    <p>不过我很欢迎你来参与开发.</p>
                    <h2>链接</h2>
                    <p>Github: <a href="https://github.com/NriotHrreion">https://github.com/NriotHrreion</a></p>
                    <p>Bilibili: <a href="https://space.bilibili.com/167995410">https://space.bilibili.com/167995410</a></p>
                    <p>Website: <a href="https://nin.red">https://nin.red</a></p>
                </div>
            </Page>
        );
    }
}
