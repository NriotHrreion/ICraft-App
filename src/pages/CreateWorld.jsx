import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import Axios from "axios";
import Page from "../components/Page";
import "./FormPage.css";

export default class CreateWorld extends Component {
    constructor(props) {
        super(props);

        this.worldName = "World";
    }

    handleSubmit(e) {
        e.preventDefault();

        Axios.post("http://"+ window.location.hostname +":3001/createWorld", "name="+ this.worldName, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }).then((res) => {
            window.location.href = "http://"+ window.location.host +"/client/?map="+ this.worldName +".cmworld&player="+ document.getElementById("userNameText").innerText;
        }).catch((err) => {
            throw err;
        });
    }

    handleCancelClick() {
        window.history.back(-1);
    }

    render() {
        return (
            <Page title="存档列表" secondTitle="创建存档" back="worlds" className="form-page">
                <div className="header-container">
                    <h1>创建存档</h1>
                    <p>一个新的ICraft存档</p>
                </div>
                <div className="main-container">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label>存档名称(禁止重复命名)</Form.Label>
                            <Form.Control type="text" defaultValue="World" autoFocus={true} autoComplete="off" onChange={(e) => {this.worldName = e.target.value}}/>

                            <Button variant="success" type="submit" className="control-btn">创建</Button>
                            <Button variant="primary" className="control-btn" onClick={() => this.handleCancelClick()}>取消</Button>
                        </Form.Group>
                    </Form>
                </div>
            </Page>
        );
    }
}
