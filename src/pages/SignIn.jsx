import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import Axios from "axios";
import Page from "../components/Page";
import "./FormPage.css";

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

    render() {
        return (
            <Page title="注册" back="home" className="form-page">
                <div className="header-container">
                    <h1>注册</h1>
                    <p>注册一个用户名</p>
                </div>
                <div className="main-container">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label>用户名</Form.Label>
                            <Form.Control type="text" autoFocus={true} autoComplete="off" onChange={(e) => {this.userName = e.target.value}}/>

                            <Button variant="success" type="submit" className="control-btn">注册</Button>
                            <Button variant="primary" className="control-btn" onClick={() => this.handleCancelClick()}>取消</Button>
                        </Form.Group>
                    </Form>
                </div>
            </Page>
        );
    }
}

