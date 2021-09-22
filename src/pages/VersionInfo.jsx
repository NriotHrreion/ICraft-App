/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Component } from "react";
import { ListGroup, Button } from "react-bootstrap";
import Axios from "axios";
import ChildPage from "../components/ChildPage";
import "./TextPage.css";
import "./VersionInfo.css";

export default class VersionInfo extends Component {
    constructor() {
        super();

        this.version = "0.5.5";
    }

    checkUpdate() {
        var checkResultElem = document.getElementById("checkResult");

        Axios.get("https://api.github.com/repos/NriotHrreion/ICraft-App/releases").then((res) => {
            if(this.version == res.data[0].tag_name) {
                checkResultElem.innerText = "当前版本为最新版本";
            } else if(this.version.indexOf("[pre]") != -1) {
                checkResultElem.innerText = "你正在使用预览版本, 当前最新正式版本(Release): "+ res.data[0].tag_name;
            } else {
                var isNeedUpdate = confirm("检查到有新版本(Release): "+ res.data[0].tag_name +"\n是否下载安装更新?");
                checkResultElem.innerText = "有新版本发布(Release): "+ res.data[0].tag_name;
                if(isNeedUpdate) {
                    window.location.href = res.data[0].html_url;
                }
            }
        }).catch((err) => {
            throw err;
        });
    }

    async fetchVersionList() {
        var list = [];

        await Axios.get("https://api.github.com/repos/NriotHrreion/ICraft-App/releases").then((res) => {
            list = res.data;
        }).catch((err) => {
            throw err;
        });

        return list;
    }

    render() {
        return (
            <ChildPage title="关于" secondTitle="版本信息" back="about" className="text-page check-update-page">
                <div className="header-container">
                    <h1>版本信息</h1>
                </div>
                <div className="main-container">
                    <h2>当前版本</h2>
                    <p>v{this.version}</p>
                    <h2>版本列表</h2>
                    <Button onClick={() => this.checkUpdate()}>检查更新</Button>
                    <span className="check-result" id="checkResult"></span>
                    <ListGroup id="versionList"></ListGroup>
                </div>
            </ChildPage>
        );
    }

    componentDidMount() {
        var versionListElem = document.getElementById("versionList");

        this.fetchVersionList().then((list) => {
            for(let i in list) {
                var listItem = document.createElement("div");

                listItem.className = "list-group-item";
                listItem.innerText = list[i].name +" - "+ list[i].published_at;
                listItem.onclick = function() {
                    window.location.href = list[i].html_url;
                };

                versionListElem.appendChild(listItem);
            }
        });
    }
}
