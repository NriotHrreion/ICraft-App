import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import Axios from "axios";
import Page from "../components/Page";
import "./FormPage.css";

export default class AddServer extends Component {
    constructor(props) {
        super(props);

        this.serverName = "";
        this.serverIP = "";
    }

    handleSubmit(e) {
        e.preventDefault();

        if(this.serverName.length > 15) {
            alert("服务器名称长度不能超过15个字符");
            return;
        }

        Axios.post("http://"+ window.location.hostname +":3001/AddServer", "name="+ this.serverName +"&ip="+ this.serverIP, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }).then((res) => {
            window.location.href = "http://"+ window.location.host +"/servers";
        }).catch((err) => {
            throw err;
        });
    }

    handleCancelClick() {
        window.history.back(-1);
    }

    render() {
        return (
            <Page title="服务器列表" secondTitle="添加服务器" back="servers" className="form-page">
                <div className="header-container">
                    <h1>添加服务器</h1>
                </div>
                <div className="main-container">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label>服务器名称(禁止重复命名)</Form.Label>
                            <Form.Control type="text" autoFocus={true} autoComplete="off" onChange={(e) => {this.serverName = e.target.value}}/>
                            <Form.Label>服务器IP地址</Form.Label>
                            <Form.Control type="text" autoComplete="off" onChange={(e) => {this.serverIP = e.target.value}}/>

                            <Button variant="success" type="submit" className="control-btn">创建</Button>
                            <Button variant="primary" className="control-btn" onClick={() => this.handleCancelClick()}>取消</Button>
                        </Form.Group>
                    </Form>
                </div>
            </Page>
        );
    }
}
