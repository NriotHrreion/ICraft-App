import React, { Component } from "react";
import { Breadcrumb, Button } from "react-bootstrap";
import Axios from "axios";
import "./Page.css";

export default class Page extends Component {
    async getUserInfo() {
        var user = {
            name: ""
        };

        await Axios.get("http://"+ window.location.hostname +":3001/getUserName").then((res) => {
            user.name = res.data.name;
        }).catch((err) => {
            throw err;
        });

        return user;
    }

    backButton() {
        if(this.props.back) {
            return (
                <div style={{display: "inline-block"}}>
                    <Button variant="link" className="link-btn" onClick={() => {
                        window.location.href = "http://"+ window.location.host +"/home"
                    }}>主页</Button>
                    <Button variant="link" className="link-btn" onClick={() => {
                        window.location.href = "http://"+ window.location.host +"/"+ this.props.back
                    }}>返回</Button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="nav-container">
                    <Breadcrumb>
                        {this.backButton()}
                        <Breadcrumb.Item active>ICraft</Breadcrumb.Item>
                        {this.props.nonav ? null : <Breadcrumb.Item active>{this.props.title}</Breadcrumb.Item>}
                        {this.props.nonav && this.props.secondTitle ? null : <Breadcrumb.Item active>{this.props.secondTitle}</Breadcrumb.Item>}

                        <div id="userInfo" className="user-info-container"></div>
                    </Breadcrumb>
                </div>
                {this.props.children}
                <div className="footer-container">
                    <p id="copyright">Copyright &copy; NriotHrreion {new Date().getFullYear()}</p>
                </div>
            </div>
        );
    }

    componentDidMount() {
        var userInfoElem = document.getElementById("userInfo");
        var copyrightElem = document.getElementById("copyright");

        if(this.props.title == "主页") {
            copyrightElem.style.color = "white";
        }
        
        this.getUserInfo().then((user) => {
            if(user.name == "") {
                var signInButton = document.createElement("button");
                signInButton.innerText = "注册";
                signInButton.type = "button";
                signInButton.className = "link-btn btn btn-link";
                signInButton.onclick = () => {
                    window.location.href = "http://"+ window.location.host +"/signIn";
                };
                userInfoElem.appendChild(signInButton);

                return;
            }

            var editNameButton = document.createElement("button");
            editNameButton.innerText = "编辑";
            editNameButton.type = "button";
            editNameButton.className = "link-btn btn btn-link";
            editNameButton.style.float = "right";
            if(this.props.title == "注册") {
                editNameButton.style.display = "none";
            }
            editNameButton.onclick = () => {
                window.location.href = "http://"+ window.location.host +"/signIn";
            };
            userInfoElem.parentElement.appendChild(editNameButton);

            var userNameText = document.createElement("p");
            userNameText.innerHTML = "<b>"+ user.name +"</b>";
            userNameText.className = "link-btn";
            userNameText.id = "userNameText";
            userInfoElem.appendChild(userNameText);
        });
    }
}
