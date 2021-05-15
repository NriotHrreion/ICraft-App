import React, { Component } from "react";
import Page from "../components/Page";
import "./About.css";

export default class About extends Component {
    render() {
        return (
            <Page title="关于" back="home" className="about-page">
                <div className="header-container">
                    <h1>关于我</h1>
                    <p>我是NriotHrreion</p>
                </div>
                <div className="main-container">
                    <h2>开发者</h2>
                    <p><code>NriotHrreion</code> - 项目开发 &lt;<b>nriot233@gmail.com</b>&gt;</p>
                    <p><code>ded</code> - 功能测试 &lt;<b>Deed_9189@outlook.com</b>&gt;</p>
                    <h2>链接</h2>
                    <p>Github Repo: <a href="https://github.com/NriotHrreion/Craftmine-App">https://github.com/NriotHrreion/Craftmine-App</a></p>
                    <p>Bilibili: <a href="https://space.bilibili.com/167995410">https://space.bilibili.com/167995410</a></p>
                    <p>Website: <a href="https://nin.red">https://nin.red</a></p>
                    <h2>许可</h2>
                    <p>MIT</p>
                </div>
            </Page>
        );
    }
}
