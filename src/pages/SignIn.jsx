import React, { Component } from "react";
import { Button, Form, Dropdown, Badge } from "react-bootstrap";
import Axios from "axios";
import Page from "../components/Page";
import "./FormPage.css";
import axios from "axios";

export default class SignIn extends Component {
    constructor(props) {
        super(props);

        this.userName = "";
    }

    handleSubmit(e) {
        e.preventDefault();

        Axios.post("http://"+ window.location.hostname +":3001/setUserName", "username="+ this.userName, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }).then((res) => {
            window.location.href = "http://"+ window.location.host +"/home";
        }).catch((err) => {
            throw err;
        });
    }

    handleCancelClick() {
        window.history.back(-1);
    }

    handleInputChange(e) {
        var original = e.target.value.replace(/[^a-zA-Z|\d|_]/g, ""); // Can be only words, numbers or underline

        if(original > 0 && original.length <= 20) {
            this.userName = original;
        } else {
            this.userName = original.substr(0, 20);
        }
    }

    async getUsedNameList() {
        var result = [];

        await Axios.get("http://"+ window.location.hostname +":3001/getUsedNameList").then((res) => {
            result = res.data.list;
        }).catch((err) => {
            throw err;
        });

        return result;
    }

    render() {
        return (
            <Page title="注册" back="home" className="form-page">
                <div className="header-container">
                    <h1>注册</h1>
                    <p>注册或设置一个用户名</p>
                </div>
                <div className="main-container">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label>用户名(由字母、数字、下划线构成, 限制字数≤20)</Form.Label>
                            <Form.Control id="userNameInput" type="text" autoFocus={true} autoComplete="off" onChange={(e) => {this.handleInputChange(e)}}/>
                            
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdownButton">
                                    曾用名列表 <Badge variant="light" id="usedNameNumber"></Badge>
                                </Dropdown.Toggle>
                                <Dropdown.Menu id="usedNameList"></Dropdown.Menu>
                            </Dropdown>

                            <Button variant="success" type="submit" className="control-btn">注册</Button>
                            <Button variant="primary" className="control-btn" onClick={() => this.handleCancelClick()}>取消</Button>
                        </Form.Group>
                    </Form>
                </div>
            </Page>
        );
    }

    componentDidMount() {
        this.getUsedNameList().then((list) => {
            document.getElementById("usedNameNumber").innerText = list.length;

            document.getElementById("dropdownButton").onclick = () => {
                setTimeout(() => {
                    var self = this;
                    document.getElementById("usedNameList").innerHTML = "";

                    for(let i in list) {
                        var usedNameItem = document.createElement("a");
                        usedNameItem.href = "#";
                        usedNameItem.class = "dropdown-item";
                        usedNameItem.setAttribute("role", "button");
                        usedNameItem.innerText = list[i];
                        usedNameItem.onclick = function() {
                            document.getElementById("userNameInput").value = this.innerText;
                            self.userName = this.innerText;
                        };
                        document.getElementById("usedNameList").appendChild(usedNameItem);
                    }
                }, 50);
            };
        });
    }
}
