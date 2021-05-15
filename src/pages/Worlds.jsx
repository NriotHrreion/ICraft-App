import React, { Component } from "react";
import { ListGroup, Button } from "react-bootstrap";
import Axios from "axios";
import Page from "../components/Page";
import "./Worlds.css";

export default class Worlds extends Component {
    constructor(props) {
        super(props);

        this.isDeleteMode = false;
    }

    async getWorldList() {
        var list = [];

        await Axios.get("http://"+ window.location.hostname +":3001/getWorldList").then((res) => {
            list = res.data.list;
        }).catch((err) => {
            throw err;
        });

        return list;
    }

    setDeleteMode() {
        var operateButton = document.getElementById("operate-btn");
        var deleteButton = document.getElementById("delete-btn");
        var worldNameTexts = document.getElementById("worldList").getElementsByTagName("span");
        var renameInputs = document.getElementById("worldList").getElementsByClassName("form-control");
        var renameSubmits = document.getElementById("worldList").getElementsByTagName("button");
        var checkBoxes = document.getElementsByClassName("form-check-input");

        this.isDeleteMode = !this.isDeleteMode ? true : false;

        operateButton.innerText = !this.isDeleteMode ? "管理存档" : "取消";
        deleteButton.style.display = !this.isDeleteMode ? "none" : "block";
        operateButton.blur();

        for(let i = 0; i < worldNameTexts.length; i++) {
            worldNameTexts[i].style.display = !this.isDeleteMode ? "block" : "none";
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
                var worldName = checkBoxes[i].getAttribute("data-worldname");

                Axios.post("http://"+ window.location.hostname +":3001/deleteWorld", "name="+ worldName, {
                    headers: {"Content-Type": "application/x-www-form-urlencoded"}
                }).catch((err) => {
                    throw err;
                });
            }
        }

        window.location.href = "http://"+ window.location.host +"/worlds";
    }

    renameWorld(oldname, newname) {
        Axios.post("http://"+ window.location.hostname +":3001/renameWorld", "oldname="+ oldname +"&newname="+ newname, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }).catch((err) => {
            throw err;
        });
    }

    render() {
        return (
            <Page title="存档列表" back="home" className="worlds-page">
                <div className="header-container">
                    <h1>存档列表</h1>
                    <p>你所有的Craftmine存档</p>
                </div>
                <div className="main-container">
                    <Button variant="success" href="/create" className="control-btn">创建存档</Button>
                    <Button variant="success" onClick={() => this.setDeleteMode()} className="control-btn" id="operate-btn">管理存档</Button>
                    <Button variant="danger" onClick={() => this.deleteWorlds()} className="control-btn delete-btn" id="delete-btn">批量删除</Button>
                    
                    <ListGroup id="worldList"></ListGroup>
                </div>
            </Page>
        );
    }

    componentDidMount() {
        this.getWorldList().then((list) => {
            var listElem = document.getElementById("worldList");
            listElem.innerHTML = "";

            for(let i in list) {
                if(list[i] == undefined) continue;

                var listItem = document.createElement("div");
                listItem.className = "list-group-item";
                listItem.setAttribute("data-worldname", list[i].name);
                listItem.onclick = (e) => {
                    if(!this.isDeleteMode) {
                        window.location.href = "http://"+ window.location.host +"/client/?map="+ e.target.getAttribute("data-worldname") +".cmworld";
                    }
                };
                var worldNameText = document.createElement("span");
                worldNameText.innerText = list[i].name;
                listItem.appendChild(worldNameText);
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
                renameSubmit.setAttribute("data-worldname", list[i].name);
                renameSubmit.onclick = (e) => {
                    var items = document.getElementById("worldList").getElementsByClassName("list-group-item");
                    var name = e.target.getAttribute("data-worldname");
                    for(let i = 0; i < items.length; i++) {
                        if(items[i].getAttribute("data-worldname") == name) {
                            this.renameWorld(name, items[i].getElementsByClassName("form-control")[0].value);
                            window.location.href = "http://"+ window.location.host +"/worlds";
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
                checkBoxInput.setAttribute("data-worldname", list[i].name);
                checkBox.appendChild(checkBoxInput);
                listItem.appendChild(checkBox);
                listElem.appendChild(listItem);
            }
        });
    }
}
