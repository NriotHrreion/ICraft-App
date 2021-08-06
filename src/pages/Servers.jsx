/* eslint-disable no-loop-func */
import React, { Component } from "react";
import { Button, ListGroup } from "react-bootstrap";
import Axios from "axios";
import Page from "../components/Page";
import "./Servers.css";

export default class Servers extends Component {
    constructor(props) {
        super(props);

        this.isDeleteMode = false;
    }

    async getServerList() {
        var list = [];

        await Axios.get("http://"+ window.location.hostname +":3001/getServerList").then((res) => {
            list = res.data.list;
        }).catch((err) => {
            throw err;
        });

        return list;
    }

    setDeleteMode() {
        var operateButton = document.getElementById("operate-btn");
        var deleteButton = document.getElementById("delete-btn");
        var serverNameTexts = document.getElementById("serverList").getElementsByTagName("span");
        var renameInputs = document.getElementById("serverList").getElementsByClassName("form-control");
        var renameSubmits = document.getElementById("serverList").getElementsByTagName("button");
        var checkBoxes = document.getElementsByClassName("form-check-input");

        this.isDeleteMode = !this.isDeleteMode ? true : false;

        operateButton.innerText = !this.isDeleteMode ? "管理服务器" : "取消";
        deleteButton.style.display = !this.isDeleteMode ? "none" : "block";
        operateButton.blur();

        for(let i = 0; i < serverNameTexts.length; i++) {
            serverNameTexts[i].style.display = !this.isDeleteMode ? "block" : "none";
        }

        for(let i = 0; i < renameInputs.length; i++) {
            renameInputs[i].style.display = !this.isDeleteMode ? "none" : "inline-block";
        }

        for(let i = 0; i < renameSubmits.length; i++) {
            renameSubmits[i].style.display = !this.isDeleteMode ? "none" : "inline-block";
        }

        for(let i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].style.display = !this.isDeleteMode ? "none" : "block";
        }
    }

    deleteWorlds() {
        var checkBoxes = document.getElementsByClassName("form-check-input");

        for(let i = 0; i < checkBoxes.length; i++) {
            if(checkBoxes[i].checked) {
                var serverName = checkBoxes[i].getAttribute("data-servername");

                Axios.post("http://"+ window.location.hostname +":3001/deleteServer", "name="+ serverName, {
                    headers: {"Content-Type": "application/x-www-form-urlencoded"}
                }).catch((err) => {
                    throw err;
                });
            }
        }

        window.location.href = "http://"+ window.location.host +"/servers";
    }

    renameWorld(oldname, newname) {
        Axios.post("http://"+ window.location.hostname +":3001/renameServer", "oldname="+ oldname +"&newname="+ newname, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }).catch((err) => {
            throw err;
        });
    }

    render() {
        return (
            <Page title="服务器列表" back="home" className="servers-page">
                <div className="header-container">
                    <h1>服务器列表</h1>
                    <p>查看已添加的ICraft服务器</p>
                </div>
                <div className="main-container">
                    <Button variant="success" href="/addServer" className="control-btn">添加服务器</Button>
                    <Button variant="success" onClick={() => this.setDeleteMode()} className="control-btn" id="operate-btn">管理服务器</Button>
                    <Button variant="primary" onClick={() => window.location.reload()} className="control-btn">刷新</Button>
                    <Button variant="danger" onClick={() => this.deleteWorlds()} className="control-btn delete-btn" id="delete-btn">批量删除</Button>
                    
                    <ListGroup id="serverList"></ListGroup>
                </div>
            </Page>
        );
    }

    componentDidMount() {
        this.getServerList().then((list) => {
            var listElem = document.getElementById("serverList");
            listElem.innerHTML = "";

            for(let i in list) {
                if(list[i] == undefined) continue;

                var listItem = document.createElement("div");
                listItem.className = "list-group-item";
                listItem.setAttribute("data-servername", list[i].name);
                listItem.setAttribute("data-serverip", list[i].ip);
                var self = this;
                listItem.onclick = function() {
                    if(!self.isDeleteMode) {
                        window.location.href = "http://"+ window.location.host +"/client/?server="+ this.getAttribute("data-serverip") +"&player="+ document.getElementById("userNameText").innerText;
                    }
                };
                var worldNameText = document.createElement("span");
                worldNameText.innerHTML = list[i].name + " - <span style=\"color:gray\">连接中...</span>";
                worldNameText.id = list[i].name;
                listItem.appendChild(worldNameText);
                var ws = new WebSocket("ws://"+ list[i].ip);
                ws.onopen = function() {
                    this.send(JSON.stringify({
                        type: "motd"
                    }));
                };
                ws.onmessage = function(e) {
                    var msg = JSON.parse(e.data);

                    if(msg.type == "motd") {
                        document.getElementById(list[i].name).innerHTML = list[i].name +" - <span style=\"color:gray\">"+ msg.data.motd +"</span>";
                        this.close();
                    }
                };
                ws.onerror = function() {
                    document.getElementById(list[i].name).innerHTML = list[i].name +" - <span style=\"color:red\">无法连接到服务器</span>";
                    this.close();
                };
                var renameInput = document.createElement("input");
                renameInput.type = "text";
                renameInput.className = "form-control";
                renameInput.value = list[i].name;
                renameInput.onkeyup = function(e) {
                    this.value = this.value.replace(/[\/|\\|:|*|?|"|<|>|\|]/g, "");
                };
                listItem.appendChild(renameInput);
                var renameSubmit = document.createElement("button");
                renameSubmit.type = "button";
                renameSubmit.className = "control-btn btn btn-warning";
                renameSubmit.innerText = "重命名";
                renameSubmit.setAttribute("data-servername", list[i].name);
                renameSubmit.onclick = (e) => {
                    var items = document.getElementById("serverList").getElementsByClassName("list-group-item");
                    var name = e.target.getAttribute("data-servername");
                    for(let i = 0; i < items.length; i++) {
                        if(items[i].getAttribute("data-servername") == name) {
                            this.renameWorld(name, items[i].getElementsByClassName("form-control")[0].value);
                            window.location.href = "http://"+ window.location.host +"/servers";
                            break;
                        }
                    }
                };
                listItem.appendChild(renameSubmit);
                var checkBox = document.createElement("div");
                checkBox.className = "form-check";
                var checkBoxInput = document.createElement("input");
                checkBoxInput.type = "checkbox";
                checkBoxInput.className = "form-check-input position-static";
                checkBoxInput.setAttribute("data-servername", list[i].name);
                checkBox.appendChild(checkBoxInput);
                listItem.appendChild(checkBox);
                listElem.appendChild(listItem);
            }
        });
    }
}
